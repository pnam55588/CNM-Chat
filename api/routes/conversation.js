const router = require('express').Router();
const { verifyToken } = require('../middlewares/verifyToken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const {uploadImage, uploadVideo, uploadFile} = require('../config/multer');
const s3 = require('../config/s3');

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
router.post('/sendMessage', async (req, res) => { //req.body = {conversationId, user, text}
    try {
        if (!req.body.conversationId) return res.status(400).json("conversationId is required");
        if (!req.body.user) return res.status(400).json("user is required");
        if (!req.body.text) return res.status(400).json("text is required");
        const message = new Message({
            conversationId: req.body.conversationId,
            user: req.body.user, // có cần đổi thành object id không ? 
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

router.post('/createGroup', async (req, res) => { //req.body = {userId, groupName}
    const { userId, groupName } = req.body;
    if (!userId) return res.status(400).json("userId is required");
    if (!groupName) return res.status(400).json("groupName is required");
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json("User not found");
        const group = new Conversation({
            name: groupName,
            users: [userId],
            isGroup: true,
            admin: userId,
        });
        const newGroup = await group.save();
        await User.updateOne({ _id: userId }, { $push: { conversations: newGroup._id } });
        res.status(200).json(newGroup);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/addMembers', async (req, res) => { //req.body = {conversationId, userIds}
    const { conversationId, userIds } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userIds) return res.status(400).json("userIds is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        for(let userId of userIds) {
            if (conversation.users.includes(userId)) return res.status(400).json("User already in the group");
            const user = await User.findById(userId);
            if (!user) return res.status(400).json("User not found");
            await Conversation.updateOne({ _id: conversationId }, { $push: { users: userId } });
        }
        return res.status(200).json("Members added successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/removeMember', async (req, res) => { //req.body = {conversationId, userId}
    const { conversationId, userId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userId) return res.status(400).json("userId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (!conversation.users.includes(userId)) return res.status(400).json("User not in the group");
        if (conversation.admin == userId) return res.status(400).json("Admin can't be removed");
        await Conversation.updateOne({ _id: conversationId }, { $pull: { users: userId } });
        await User.updateOne({ _id: userId }, { $pull: { conversations: conversationId } });
        res.status(200).json("Member removed successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.delete('/deleteConversation/:conversationId', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        await Message.deleteMany({ conversationId: req.params.conversationId });
        await Conversation.deleteOne({ _id: req.params.conversationId });
        res.status(200).json("Conversation deleted successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/muteConversation', async (req, res) => { //req.body = {conversationId, userId}
    const { conversationId, userId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userId) return res.status(400).json("userId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (conversation.mutedBy.includes(userId)) return res.status(400).json("Conversation already muted");
        await Conversation.updateOne({ _id: conversationId }, { $push: { mutedBy: userId } });
        res.status(200).json("Conversation muted successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/unmuteConversation', async (req, res) => { //req.body = {conversationId, userId}
    const { conversationId, userId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userId) return res.status(400).json("userId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (!conversation.mutedBy.includes(userId)) return res.status(400).json("Conversation not muted");
        await Conversation.updateOne({ _id: conversationId }, { $pull: { mutedBy: userId } });
        res.status(200).json("Conversation unmuted successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/changeGroupName', async (req, res) => { //req.body = {conversationId, name}
    const { conversationId, name } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!name) return res.status(400).json("name is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        await Conversation.updateOne({ _id: conversationId }, { name: name });
        res.status(200).json("Group name changed successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/changeGroupImage/:conversationId', uploadImage.single('file') ,async (req, res) => { //req.body = {conversationId, image}
    const { conversationId } = req.params;
    const file = req.file;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!file) return res.status(400).json("image is required");
    const result = await s3.uploadToS3(file);
    const imageUrl = result.Location;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        await Conversation.updateOne({ _id: conversationId }, { image: imageUrl });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/sendImages', uploadImage.array('file', 50), async (req, res) => {
    const files = req.files;
    if (!files) return res.status(400).json("No file uploaded.");
    const results = await Promise.all(files.map(async (file) => { 
        const result = await s3.uploadToS3(file);
        return result.Location;
    }));
    const message = new Message({
        conversationId: req.body.conversationId,
        user: req.body.user,
        images: results,
    });
    res.status(200).json(message);
});
router.post('/sendVideo', uploadVideo.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded.");
    const result = await s3.uploadToS3(file);
    const message = new Message({
        conversationId: req.body.conversationId,
        user: req.body.user,
        video: result.Location,
    });
    res.status(200).json(message);
});
router.post('/sendFile', uploadFile.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded.");
    const result = await s3.uploadToS3(file);
    const message = new Message({
        conversationId: req.body.conversationId,
        user: req.body.user,
        file: result.Location,
    });
    res.status(200).json(message);
});


module.exports = router;