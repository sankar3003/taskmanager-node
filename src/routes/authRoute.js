
const express = require("express")
const router = express.Router()

const { registerUser, loginUser,
    forgotPassword, resetPassword
} = require("../contolelrs/authController")

// router.get("/", (req, res) => {
//     res.set({ 'Content-Type': 'application/json', 'my-Headers': 'Hello World' });
//     res.send("Auth Route is working 🚀")
// })

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports =router