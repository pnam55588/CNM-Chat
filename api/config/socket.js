const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

let io = null;
module.exports = function (server) {
    io = new Server(server, { cors: { origin: '*' } });
    const users = {};

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        // when a user connects, save the socket id to the user id, send online status to all users
        if(userId){
            users[userId] = socket.id;
            socket.join(userId);
        }
        io.emit('usersOnline', users);
        io.emit('userOnline', userId);

        // Hàm này lắng nghe khi một client gửi tin nhắn
        socket.on('sendMessage', async (message) => { // message = {message, receiverIds}, message is return from api
            // Gửi tin nhắn đến tất cả người nhận online
            if (message.receiverIds.length > 0) {
                // get avatar and name of message.user
                const user = await User.findById(message.user, 'name avatar');
                console.log(user);
                // const newMessage = {
                //     user: user,
                //     text: message.text,
                //     images: message.images,
                //     conversationId: message.conversationId,
                //     createdAt: new Date(),
                // }
                const newMessage = {...message, user: user}
                message.receiverIds.forEach(receiverId => {
                    if (users[receiverId])  {
                        message.receiverId = receiverId;
                        socket.to(users[receiverId]).emit('receiveMessage', message);
                    }
                });
            }
        });
        socket.on('newConversation', async (conversation, message) => { // message = {message, receiverIds}, conversation and message is return from api
            if(!conversation.users || conversation.users.length === 0) return;
            const userSend = await User.findById(message.user, 'name avatar');
            // const newMessage = new Message({
            //     conversationId: conversation._id,
            //     user: userSend,
            //     text: message.text,
            // });
            const newMessage = {...message, user: userSend}
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
        });
    });
}
module.exports.io = io;