const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    phone: String,
    email: String,
    password: String,
    status: {type: String, default: 'active'},
    isOnline: { type: Boolean, default: false },
    pendingRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    contacts: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blockedFrom: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: new Date() },
})

module.exports = mongoose.model("User",UserSchema)