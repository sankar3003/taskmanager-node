const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String,},
     profilePic: { type: String, default: "" } ,// store file path or URL
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date}
}, { timestamps: true });

userSchema.virtual('tasks',{ ref:"Task", localField:'_id', foreignField:"user"})

userSchema.set('toJSON', { virtuals: true, versionKey: false, transform: (doc, ret) => {
    delete ret.password;
    return ret;
}});

// Generate reset token
userSchema.methods.getResetPasswordToken = function() {
  console.log("Generating reset token")
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};


module.exports = mongoose.model('User', userSchema);
