const { string } = require("joi");
const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  users: [{type: String, ref: 'User'}],
  isGroup: Boolean,
  name: String,
  image: {type: String, default: ''},
  admin: {type: String, ref: 'User'},
  createdAt: {type: Date, default: new Date()},
  mutedBy: [{type: mongoose.Types.ObjectId}],
  connect: {
    receiverId: {type: String, ref: 'User'},
    active: {type: Boolean, default: false},
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);