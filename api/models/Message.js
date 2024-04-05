const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: mongoose.Types.ObjectId,
  user: {type: String, ref: 'User'},
  text: String,
  images: [{type: String}],
  video: String,
  file: String,
  location: {latitude: Number, longitude: Number},
  seenBy: [{type: mongoose.Types.ObjectId}],
  createdAt: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Message', MessageSchema);