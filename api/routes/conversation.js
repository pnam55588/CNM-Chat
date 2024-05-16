const router = require('express').Router();
const { verifyToken } = require('../middlewares/verifyToken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { uploadImage, uploadVideo, uploadFile } = require('../config/multer');
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

        //check 2 user is friend
        if (user.contacts.indexOf(req.body.recipientId) === -1) return res.status(400).json("You are not friend with this user");

        // check if a conversation already exists between the two users, check isGroup = false
        const checkExists = await Conversation.findOne({ isGroup: { $ne: true }, users: { $all: [req.body.userId, req.body.recipientId] } });
        if (checkExists) return res.status(400).json("Conversation already exists");

        const users = [req.body.userId, req.body.recipientId]//nguoi login va lien lac
        const conversation = new Conversation({
            users: users,
        });
        const newConversation = await conversation.save();
        const con = await Conversation.findById(newConversation._id).populate('users', 'name avatar isOnline');
        await User.updateOne({ _id: req.body.userId }, { $push: { conversations: newConversation._id } });
        await User.updateOne({ _id: req.body.recipientId }, { $push: { conversations: newConversation._id } });
        res.status(200).json(con);

    } catch (err) {
        res.status(400).json("something went wrong");
    }
});




router.get('/getConversations/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({ users: req.params.userId }).populate('users', 'name avatar isOnline');
        res.status(200).json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.get('/:conversationId', async (req, res) => {
    try {
        const conversation = await Conversation.findById({ _id: req.params.conversationId }).populate('users', 'name avatar isOnline');
        res.status(200).json(conversation)
    } catch (error) {
        console.log(error);
    }
})
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
            createdAt: new Date(),
        });
        console.log(message);
        console.log("new message");
        const newMessage = await message.save();
        console.log(newMessage);
        res.status(200).json(newMessage);
    } catch (err) {
        res.status(400).json(err);
    }
});
// THIS ROUTE IS FOR TESTING PURPOSES ONLY
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
router.get('/test/query', async (req, res) => {
    try {
        const checkExists = await Conversation.findOne({ isGroup: { $ne: true }, users: { $all: [req.body.userId, req.body.recipientId] } });
        res.status(200).json(checkExists);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.get('/test/getAllGroup', async (req, res) => {
    try {
        // order by date
        const conversations = await Conversation.find({ isGroup: true }).sort({ createdAt: -1 });
        res.status(200).json(conversations);
    } catch (err) {
        res.status(400).json(err);
    }
});
//-----------------------------Group Chat--------------------------------

router.post('/createGroup', async (req, res) => { //req.body = {userId, groupName}
    const { adminId, groupName, userIds } = req.body;
    if (!adminId) return res.status(400).json("admin is required");
    if (!userIds) return res.status(400).json("userId is required");
    if (!groupName) return res.status(400).json("groupName is required");
    // check admin not in userIds
    if (userIds.includes(adminId)) return res.status(400).json("Admin should not be in userIds");
    try {
        const adminUser = await User.findById(adminId);
        if (!adminUser) return res.status(400).json("admin not found");
        const group = new Conversation({
            name: groupName,
            // users = userIds + adminId
            users: [...userIds, adminId],
            isGroup: true,
            admin: adminId,
        });
        const newGroup = await group.save();
        await User.updateMany({ _id: userIds }, { $push: { conversations: newGroup._id } });
        res.status(200).json(newGroup);
    } catch (err) {
        res.status(400).json(err.message);
    }
});
router.put('/addMembers', async (req, res) => { //req.body = {conversationId, userIds}
    const { conversationId, userIds } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userIds) return res.status(400).json("userIds is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        for (let userId of userIds) {
            if (conversation.users.includes(userId)) return res.status(400).json("User already in the group");
            const user = await User.findById(userId);
            if (!user) return res.status(400).json("User not found");
            await Conversation.updateOne({ _id: conversationId }, { $push: { users: userId } });
        }
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        return res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/removeMember', async (req, res) => { //req.body = {conversationId, userId}
    const { conversationId, userId, adminId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userId) return res.status(400).json("userId is required");
    if (!adminId) return res.status(400).json("adminId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (!conversation.users.includes(userId)) return res.status(400).json("User not in the group");
        if (conversation.admin == userId) return res.status(400).json("Admin can't be removed");
        if (conversation.admin != adminId) return res.status(400).json("You are not admin of this group");
        await Conversation.updateOne({ _id: conversationId }, { $pull: { users: userId } });
        await User.updateOne({ _id: userId }, { $pull: { conversations: conversationId } });
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        const userRemoved = await User.findById(userId, 'name');
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});
// this for test
router.delete('/deleteConversation/:conversationId', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        await Message.deleteMany({ conversationId: req.params.conversationId });
        await Conversation.deleteOne({ _id: req.params.conversationId });
        await User.updateMany({ conversations: req.params.conversationId }, { $pull: { conversations: req.params.conversationId } });
        res.status(200).json("Conversation deleted successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
//-----------------------------Group Chat--------------------------------
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
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/changeGroupImage/:conversationId', uploadImage.single('file'), async (req, res) => { //req.body = {conversationId, image}
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
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/sendImages', uploadImage.array('files', 50), async (req, res) => {
    const files = req.files;
    const { conversationId, user } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!user) return res.status(400).json("user is required");
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(400).json("Conversation not found");
    const findUser = await User.findById(user);
    if (!findUser) return res.status(400).json("User not found");
    if (conversation.users.indexOf(user) === -1) return res.status(400).json("User not in the conversation");
    if (!files) return res.status(400).json("No file uploaded.");

    const results = await s3.uploadMultipleToS3(files);
    const images = results.map(result => result.Location);
    const message = new Message({
        conversationId: conversationId,
        user: user,
        images: images,
        createdAt: new Date(),
    });
    const newMessage = await message.save();
    res.status(200).json(newMessage);
});
router.post('/sendVideo', uploadVideo.single('file'), async (req, res) => {
    const file = req.file;
    const { conversationId, user } = req.body;
    if (!file) return res.status(400).json("No file uploaded.");
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!user) return res.status(400).json("user is required");
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(400).json("Conversation not found");
    const findUser = await User.findById(user);
    if (!findUser) return res.status(400).json("User not found");
    if (conversation.users.indexOf(user) === -1) return res.status(400).json("User not in the conversation");

    const result = await s3.uploadToS3(file);
    const message = new Message({
        conversationId: conversationId,
        user: user,
        video: result.Location,
        createdAt: new Date(),
    });
    const newMessage = await message.save();
    res.status(200).json(newMessage);
});
router.post('/sendFile', uploadFile.single('file'), async (req, res) => {
    const file = req.file;
    const { conversationId, user } = req.body;
    if (!file) return res.status(400).json("No file uploaded.");
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!user) return res.status(400).json("user is required");
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(400).json("Conversation not found");
    const findUser = await User.findById(user);
    if (!findUser) return res.status(400).json("User not found");
    if (conversation.users.indexOf(user) === -1) return res.status(400).json("User not in the conversation");

    const result = await s3.uploadToS3(file);
    const message = new Message({
        conversationId: conversationId,
        user: user,
        file: result.Location,
        createdAt: new Date(),
    });
    const newMessage = await message.save();
    res.status(200).json(newMessage);
});

router.post('/sendLocation', async (req, res) => { // location = {latitude, longitude}
    const { conversationId, user, location } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!user) return res.status(400).json("user is required");
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(400).json("Conversation not found");
    const findUser = await User.findById(user);
    if (!findUser) return res.status(400).json("User not found");
    if (conversation.users.indexOf(user) === -1) return res.status(400).json("User not in the conversation");

    if (!location) return res.status(400).json("location is required");
    const { latitude, longitude } = location;
    if (!latitude) return res.status(400).json("latitude is required");
    if (!longitude) return res.status(400).json("longitude is required");


    const message = new Message({
        conversationId: conversationId,
        user: user,
        location: location,
        createdAt: new Date(),
    });
    const newMessage = await message.save();
    res.status(200).json(newMessage);
});

router.post('/removeMessage/:messageId', async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);
        if (!message) return res.status(400).json("Message not found");
        await Message.deleteOne({ _id: req.params.messageId });
        res.status(200).json("Message deleted successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post("/forwardMessage", async (req, res) => { // message return from api, conversationForwardId, userid forward this message
    try{
        const {message, conversationForwardId, userId} = req.body;
        if(!conversationForwardId) return res.status(400).json("conversationForwardId is required");
        if(!userId) return res.status(400).json("userId is required");
        const conversation = await Conversation.findById(conversationForwardId);
        if(!conversation) return res.status(400).json("Conversation not found");

        const newMessage = new Message({
            conversationId: conversationForwardId,
            user: userId,
            text: message.text || null,
            images: message.images || null,
            video: message.video || null,
            file: message.file || null,
            location: message.location || null,
            createdAt: new Date(),
        });
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(400).json(err);
    }
})

// out group
router.post('/outGroup', async (req, res) => {
    const { conversationId, userId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!userId) return res.status(400).json("userId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (!conversation.users.includes(userId)) return res.status(400).json("User not in the group");
        if (conversation.admin == userId) return res.status(400).json("Admin can't out the group");
        await User.updateOne({ _id: userId }, { $pull: { conversations: conversationId } });
        await Conversation.updateOne({ _id: conversationId }, { $pull: { users: userId }});
        // return conversation updated
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        const userOuted = await User.findById(userId, 'name');
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});
// disband group
router.delete('/disbandGroup', async (req, res) => {
    const { adminId, conversationId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (conversation.admin != adminId) return res.status(400).json("You are not admin of this group");
        await Message.deleteMany({ conversationId: conversationId });
        await User.updateMany({ conversations: conversationId }, { $pull: { conversations: conversationId } });
        await Conversation.deleteOne({ _id: conversationId });
        res.status(200).json("Group disband successfully");
    } catch (err) {
        res.status(400).json(err);
    }
});
// change admin
router.put('/changeGroupAdmin', async (req, res) => {
    const { conversationId, adminId, userId } = req.body;
    if (!conversationId) return res.status(400).json("conversationId is required");
    if (!adminId) return res.status(400).json("adminId is required");
    if (!userId) return res.status(400).json("userId is required");
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(400).json("Conversation not found");
        if (conversation.admin != adminId) return res.status(400).json("You are not admin of this group");
        if (!conversation.users.includes(userId)) return res.status(400).json("User not in the group");
        await Conversation.updateOne({ _id: conversationId }, { admin: userId });
        const updatedConversation = await Conversation.findById(conversationId).populate('users', 'name avatar isOnline');
        const newAdmin = await User.findById(userId, 'name');
        res.status(200).json(updatedConversation);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;