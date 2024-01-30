const express = require('express');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { updateValidation } = require('../validations/user');
const bcrypt = require('bcryptjs');

router.get('/', verifyToken, async (req, res) => {
    User.find({}).then(function (users) {
        res.json(users);
    })
});
router.get('/:id/contacts', verifyToken, async (req, res) => {
    User.findById(req.params.id).populate('contacts', '_id name isOnline')
        .then(function (user) {
            if (!user) return res.status(404).send('User not found');
            const contacts = user.contacts.map((contact) => {
                return {
                    _id: contact._id,
                    avatar: contact.avatar,
                    name: contact.name,
                    phone: contact.phone,
                    dateOfBirth: contact.dateOfBirth,
                    gender: contact.gender,
                    // email: user.email,
                    isOnline: contact.isOnline
                }
            })
            res.json(contacts);
        })
});

router.get('/search', async (req, res) => {
    const { phone, name } = req.query;
    if (!phone && !name) return res.status(400).send('Bad request');
    try {
        const users = await User.find({ $or: [{ phone: phone }, { name: name }] });
        if (users.length === 0) return res.status(404).send('User not found');
        const result = users.map((user) => {
            return {
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                // email: user.email,
                isOnline: user.isOnline
            }
        })
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});
router.post('/addFriend', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) return res.status(404).send('User not found');
        if (receiver.contacts.includes(senderId)) return res.status(400).send('User already in your contact list');
        if (receiver.pendingRequests.includes(senderId)) return res.status(400).send('Request already sent');
        receiver.pendingRequests.push(senderId);
        await receiver.save();
        res.status(200).send('Request sent');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/acceptFriend', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).send('Bad request');
    if (senderId === receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) return res.status(404).send('User not found');
        if (!receiver.pendingRequests.includes(senderId)) return res.status(400).send('No request found');
        receiver.pendingRequests = receiver.pendingRequests.filter((request) => request.toString() !== senderId);
        receiver.contacts.push(senderId);
        sender.contacts.push(receiverId);
        await receiver.save();
        await sender.save();
        res.status(200).send('Request accepted');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/rejectFriend', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).send('Bad request');
    if (senderId === receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) return res.status(404).send('User not found');
        if (!receiver.pendingRequests.includes(senderId)) return res.status(400).send('No request found');
        receiver.pendingRequests = receiver.pendingRequests.filter((request) => request.toString() !== senderId);
        await receiver.save();
        res.status(200).send('Request rejected');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/block', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).send('Bad request');
    if (senderId === receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) return res.status(404).send('User not found');
        if (sender.blocked.includes(receiverId)) return res.status(400).send('User already blocked');
        if (receiver.blockedFrom.includes(senderId)) return res.status(400).send('User already blocked');
        sender.blocked.push(receiverId);
        receiver.blockedFrom.push(senderId);
        await sender.save();
        await receiver.save();
        res.status(200).send('User blocked');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/unblock', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) return res.status(400).send('Bad request');
    if (senderId === receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) return res.status(404).send('User not found');
        if (!sender.blocked.includes(receiverId)) return res.status(400).send('User not blocked');
        if (!receiver.blockedFrom.includes(senderId)) return res.status(400).send('User not blocked');
        sender.blocked = sender.blocked.filter((blockedUser) => blockedUser.toString() !== receiverId);
        receiver.blockedFrom = receiver.blockedFrom.filter((blockedUser) => blockedUser.toString() !== senderId);
        await sender.save();
        await receiver.save();
        res.status(200).send('User unblocked');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    User.findById(req.params.id).then(function (user) {
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    })
});

router.put('/:id', verifyToken, async (req, res) => {
    const { name, gender, dateOfBirth, password } = req.body;
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const query = {};
    if (name) query.name = name;
    if (gender) query.gender = gender;
    if (dateOfBirth) query.dateOfBirth = dateOfBirth;
    if (password) {
        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(password, salt);
        query.password = hashPassword;
    }
    User.findByIdAndUpdate(req.params.id, query, { new: true }).then(function (user) {
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    })
});

module.exports = router;