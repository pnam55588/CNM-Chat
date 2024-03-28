import io from "socket.io-client";
let socket;
const baseURL = "http://localhost:3300";
const initiateSocket = (userId) => {
  socket = io(baseURL, {
    path:"",
    transports: ["websocket"],
    query: { userId },
  });
};
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
const newConversationSocket=(conversation, message)=>{
  if(socket) {
    socket.emit('newConversation', conversation, message)
  }
}
const getReceiveNewConverstionsocket=()=>{
  return new Promise((resolve, reject)=>{
    if(socket){
      socket.on("receiveNewConversation", (res)=>{
        resolve(res)
      })
    }else{
      reject(new Error("Socket is not available."));
    }
    return()=>{
      socket.off("receiveNewConversation")
    }
  })
}
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
  newConversationSocket,
  getReceiveNewConverstionsocket,
};
