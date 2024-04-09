import io from "socket.io-client";
let socket;
const baseURL = "http://localhost:3300";
const initiateSocket = (userId) => {
  socket = io(baseURL, {
    path: "",
    transports: ["websocket"],
    query: { userId },
  });
};
const sendMessageSocket = (message) => {
  if (socket) {
    socket.emit("sendMessage", message);
  }
};
const newConversationSocket = (conversation, message) => {
  if (socket) {
    socket.emit("newConversation", conversation, message);
  }
};
const removeMessageSocket = (receiverId) => {
  if (socket) {
    socket.emit("removeMessage", receiverId);
  }
};
const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
export {
  socket,
  disconnectSocket,
  sendMessageSocket,
  initiateSocket,
  newConversationSocket,
  removeMessageSocket,
};
