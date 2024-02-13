const router = require('express').Router();
const { verifyToken } = require('../middlewares/verifyToken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { io } = require('../config/socket');

router.post('/createConversation', async (req, res) => {
    try {
        if (!req.body.userId) return res.status(400).json("userId is required");
        if (!req.body.recipientId) return res.status(400).json("recipientId is required");
        if (req.body.userId === req.body.recipientId) return res.status(400).json("You can't create conversation with yourself");
        if (req.body.recipientId !== req.body.recipientId) return res.status(400).json("Recipient is not authorized");

        let user = await User.findById(req.body.userId);
        if (!user) return res.status(400).json("User not found");
        let recipient = await User.findById(req.body.recipientId);
        if (!recipient) return res.status(400).json("Recipient not found");

        // check if a conversation already exists between the two users
        const checkExists = await Conversation.findOne({ users: { $all: [req.body.userId, req.body.recipientId] } });
        if (checkExists) return res.status(400).json("Conversation already exists");

        const users = [req.body.userId, req.body.recipientId]//nguoi login va lien lac
        const conversation = new Conversation({
            users: users,
        });
        const newConversation = await conversation.save();
        const con = await Conversation.findById(newConversation._id).populate('users', 'name avatar');
        await User.updateOne({ _id: req.body.userId }, { $push: { conversations: newConversation._id } });
        await User.updateOne({ _id: req.body.recipientId }, { $push: { conversations: newConversation._id } });
        res.status(200).json(con);

    } catch (err) {
        res.status(400).json("something went wrong");
    }
});
router.get('/getConversations/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({ users: req.params.userId }).populate('users', 'name avatar');
        res.status(200).json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/getMessages/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        if (!conversationId) return res.status(400).json("conversationId is required");
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        // get messages from a conversation and populate the user field
        const messages = await Message 
            .find({ conversationId: req.params.conversationId }) 
            .populate('user', 'name avatar');
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.post('/sendMessage', async (req, res) => { //req.body = {conversationId, senderId, text}
    try {
        if (!req.body.conversationId) return res.status(400).json("conversationId is required");
        if (!req.body.senderId) return res.status(400).json("senderId is required");
        if (!req.body.text) return res.status(400).json("text is required");
        const message = new Message({
            conversationId: req.body.conversationId,
            user: req.body.senderId, // có cần đổi thành object id không ? 
            text: req.body.text,
        });
        const newMessage = await message.save();
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(400).json(err);
    }
});

// remove all message have no user
router.delete('/removeMessageNoUser', async (req, res) => {
    try {
        const messages = await Message.find({ user: null });
        await Message.deleteMany({ user: null });
        res.status(200).json(messages);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;