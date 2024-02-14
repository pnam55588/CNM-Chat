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
        socket.on('sendMessage', async (message) => { // message = {user, receiverIds, text, conversationId}
            // Gửi tin nhắn đến tất cả người nhận online
            if (message.receiverIds.length > 0) {
                // get avatar and name of message.user
                const user = await User.findById(message.user, 'name avatar');
                console.log(user);
                const newMessage = {
                    user: user,
                    text: message.text,
                    conversationId: message.conversationId,
                    createdAt: new Date(),
                }
                message.receiverIds.forEach(receiverId => {
                    if (users[receiverId])  {
                        message.receiverId = receiverId;
                        socket.to(users[receiverId]).emit('receiveMessage', newMessage);
                    }
                });
            }
        });



        socket.on('disconnect', () => {
            delete users[userId];
            io.emit('usersOnline', users);
        });
    });
}
module.exports.io = io;