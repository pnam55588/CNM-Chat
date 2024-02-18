const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  users: [{type: mongoose.Types.ObjectId, ref: 'User'}],
  isGroup: Boolean,
  name: String,
  image: {type: String, default: ''},
  admin: {type: mongoose.Types.ObjectId},
  createdAt: {type: Date, default: new Date()},
  mutedBy: [{type: mongoose.Types.ObjectId}]
});

module.exports = mongoose.model('Conversation', ConversationSchema);