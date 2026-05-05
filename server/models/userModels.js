import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, deault: 0},
    isAccountVerified: {type: Boolean, deault: false},
    resetOtp: {type: String, deault: ''},
    resetOtpExpireAt: {type: Number, deault: 0},
})

const userModel = mongoose.modelsuser || mongoose.model('user', userSchema)

export default userModel;