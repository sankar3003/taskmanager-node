const User = require("./../models/User")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail");
exports.registerUser = async(req , res)=>{
    try {
        const { name, email, password } = req.body;
        console.log("dff", req.body)
        let user = await User.findOne({ email });
        console.log("user", user)
        if(user) return res.status(400).json({ message: 'User already exists' });

    // Hash password here (instead of schema)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ name, email, hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully ✅' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("user", user, password)
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch", user.password, password)
        // if(!isMatch) return res.status(400).json({ message: 'Invalid Password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// / Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");

    if (process.env.USE_HASHED_TOKENS === "true") {
      // Secure: store hashed token in DB
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    } else {
      // Simple: store raw token in DB
      user.resetPasswordToken = resetToken;
    }

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    res.status(200).json({
      message: "Reset token generated. Use this token in /reset-password API",
      token: resetToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Error generating token" });
  }
}

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    let tokenToFind;

    if (process.env.USE_HASHED_TOKENS === "true") {
      tokenToFind = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    } else {
      tokenToFind = req.params.token;
    }

    const user = await User.findOne({
      resetPasswordToken: tokenToFind,
      resetPasswordExpires: { $gte: Date.now() }
    });

    // 🚨 If no user found
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // ✅ Only now it's safe to set password
    user.password = req.body?.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: err.message });
  }
};
