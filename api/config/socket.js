const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

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
        socket.on('sendMessage', (message) => { // message = {senderId, receiverIds, text, conversationId}
            // Gửi tin nhắn đến tất cả người nhận online
            if (message.receiverIds.length > 0) {
                message.receiverIds.forEach(receiverId => {
                    if (users[receiverId])  {
                        message.receiverId = receiverId;
                        socket.to(users[receiverId]).emit('receiveMessage', message);
                    }
                });
            }
        });



        socket.on('disconnect', () => {
            delete users[socket.id];
            io.emit('usersOnline', users);
        });
    });
}
module.exports.io = io;