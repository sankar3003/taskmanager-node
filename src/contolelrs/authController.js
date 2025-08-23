const User = require("./../models/User")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerUser = async(req , res)=>{
    try {
        const { name, email, password } = req.body;
        console.log("dff", req.body)
        let user = await User.findOne({ email });
        if(user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password });
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
        if(!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};