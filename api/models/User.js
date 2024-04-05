const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    _id: String,
    name: {type: String, default: 'no name'},
    avatar: String,
    dateOfBirth: Date,
    gender: {type: String, default: 'male'},
    phone: {type: String, unique: true},
    password: String,
    isOnline: { type: Boolean, default: false },
    pendingRequests: [{ type: String, ref: 'User' }],
    contacts: [{ type: String, ref: 'User' }],
    blocked: [{ type: String, ref: 'User' }],
    blockedFrom: [{ type: String, ref: 'User' }],
    createdAt: { type: Date, default: new Date() },
    conversations: [{ type: mongoose.Types.ObjectId, ref: 'Conversation' }],
})

module.exports = mongoose.model("User",UserSchema)