const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    dateOfBirth: Date,
    gender: {type: String, default: 'male'},
    phone: String,
    // email: String,
    password: String,
    status: {type: String, default: 'active'},
    isOnline: { type: Boolean, default: false },
    pendingRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    contacts: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blockedFrom: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: new Date() },
    conversations: [{ type: mongoose.Types.ObjectId, ref: 'Conversation' }],
})

module.exports = mongoose.model("User",UserSchema)