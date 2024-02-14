import io from "socket.io-client";
let socket;
const baseURL = "http://localhost:3300";
const initiateSocket = (userId) => {
  socket = io(baseURL, {
    transports: ["websocket"],
    query: { userId },
  });
  return () => {
    socket.disconnect();
  };
};
const initiateConversationsocket= (conversationId)=>{
  socket = io(baseURL, {
    transports: ["websocket"],
    query: { conversationId },
  });
  return () => {
    socket.disconnect();
  };
}
const getUsersOnline = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on("usersOnline", (res) => {
        resolve(res);
      });
    } else {
      reject(new Error("Socket is not available."));
    }
  });
};
const sendMessageSocket = (message) => {
  if (socket) {
    socket.emit("sendMessage", message);
  }
};
const getMessageSocket = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on("receiveMessage", (res) => {
        resolve(res);
      });
    } else {
      reject(new Error("Socket is not available."));
    }
    return()=>{
      socket.off('receiveMessage')
    }
  });
};
const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
export {
  socket,
  disconnectSocket,
  getMessageSocket,
  sendMessageSocket,
  getUsersOnline,
  initiateSocket,
  initiateConversationsocket,
};
