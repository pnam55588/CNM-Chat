const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

let io = null;
module.exports = function (server) {
    io = new Server(server, { cors: { origin: '*' } });
    const users = {};
    updateUserOnline = async (userId) => {
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, { isOnline: true }, { new: true });
        console.log(userUpdate);
    }
    updateUserOffline = async (userId) => {
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, { isOnline: false }, { new: true });
        console.log(userUpdate);
    }

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            users[userId] = socket.id;
            socket.join(userId);
            updateUserOnline(userId);
        }
        io.emit('usersOnline', users);
        io.emit('userOnline', userId);

        
        socket.on('updateGroup', (conversation, receiverIds, message) => { // conversation return from api
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveUpdateGroup', {conversation, message});
                }
            });
        });

        socket.on('newGroup', (conversation, receiverIds) => {
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveNewGroup', conversation);
                    console.log('NEW GROUP SOCKET');
                }
            });
        });

        socket.on('userOutGroup', async (userId, groupId, receiverIds) => { 
            const user = await User.findById(userId, 'name');
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveUserOutGroup', { userId, groupId, message: user.name+' out group'});
                }
            });
        });
        socket.on('userJoinGroup', async(userId, groupId, receiverIds) => {
            const user = await User.findById(userId, 'name');
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveUserJoinGroup', { userId, groupId, message: user.name+' join group'});
                }
            });
        });
        socket.on("changeGroupName", (groupId, groupName, receiverIds) => {
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveChangeGroupName', { groupId, groupName, message: 'Group name changed to '+groupName});
                }
            });
        });
        socket.on("changeGroupAvatar", (groupId, groupAvatar, receiverIds) => {
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveChangeGroupAvatar', { groupId, groupAvatar, message: 'Group avatar changed'});
                }
            });
        });
        socket.on('changeGroupAdmin', (groupId, adminId, receiverIds) => {
            const userAdmin = User.findById(adminId, 'name');
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveChangeGroupAdmin', { groupId, adminId, message: 'Admin changed to '+userAdmin.name});
                }
            });
        });
        socket.on('disbandGroup', (groupId, receiverIds) => {
            receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveDisbandGroup', groupId);
                }
            });
        });


        socket.on('removeMessage', (message) => { // message = {message, receiverIds}, message is return from api
            message.receiverIds.forEach(receiverId => {
                if (users[receiverId]) {
                    socket.to(users[receiverId]).emit('receiveRemoveMessage', message);
                }
            });
        });

        socket.on('sendMessage', async (message) => { // message = {message, receiverIds}, message is return from api
            // Gửi tin nhắn đến tất cả người nhận online
            if (message.receiverIds.length > 0) {
                // get avatar and name of message.user
                const user = await User.findById(message.user, 'name avatar');
                console.log(user);
                const newMessage = { ...message, user: user }
                message.receiverIds.forEach(receiverId => {
                    if (users[receiverId]) {
                        socket.to(users[receiverId]).emit('receiveMessage', newMessage);
                    }
                });
            }
        });
        socket.on('newConversation', async (conversation, message) => { // message = {message, receiverIds}, conversation and message is return from api
            if (!conversation.users || conversation.users.length === 0) return;
            const userSend = await User.findById(message.user, 'name avatar');
            const newMessage = { ...message, user: userSend }
            console.log("NEW CONVERSATION SOCKET");
            message.receiverIds?.forEach(userId => {
                if (users[userId]) {
                    console.log(userId);
                    socket.to(users[userId]).emit('receiveNewConversation', conversation);
                    socket.to(users[userId]).emit('receiveMessage', newMessage);
                }
            });
        })


        socket.on('disconnect', () => {
            delete users[userId];
            io.emit('usersOnline', users);
            updateUserOffline(userId);
        });
    });
}
module.exports.io = io;