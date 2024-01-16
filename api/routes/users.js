const express = require('express');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

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
                    email: contact.email,
                    isOnline: contact.isOnline
                }
            })
            res.json(contacts);
        })
});

router.get('/search', async (req, res) => {
    const { email, name } = req.query;
    const query = {};
    if (email) query.email = email;
    if (name) query.name = name;
    User.find(query).then(function (users) {
        const result = users.map((user) => {
            return {
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                phone: user.phone,
                email: user.email,
                isOnline: user.isOnline
            }
        })
        res.status(200).json(result);
    })
});
router.post('/addFriend', verifyToken, async (req, res) => {
    const { senderId, receiverId } = req.body;
    if(!senderId || !receiverId) return res.status(400).send('Bad request');
    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if(!sender || !receiver) return res.status(404).send('User not found');
        if(receiver.contacts.includes(senderId)) return res.status(400).send('User already in your contact list');
        if(receiver.pendingRequests.includes(senderId)) return res.status(400).send('Request already sent');
        receiver.pendingRequests.push(senderId);
        await receiver.save();
        res.status(200).send('Request sent');
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/acceptFriend', verifyToken, async (req, res) => {
    // TODO
    
});

module.exports = router;