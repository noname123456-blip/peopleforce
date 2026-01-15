import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: [true, "Email must be unique!"]
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyOTP: {
        type: String,
    },
    verifyOTPCreatedAt: {
        type: Date
    },
    verifyOTPExpiry: {
        type: Date
    },
    resetPassOTP: {
        type: String
    },
    resetPassOTPExpiry: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User