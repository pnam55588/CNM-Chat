import io from "socket.io-client";
export let socket;
const baseURL = "http://localhost:3300";
export const initiateSocket = (userId) => {
  socket = io(baseURL, {
    transports: ["websocket"],
    query: { userId },
  });
  return()=>{
    socket.disconnect()
  }
};
export const getUsersOnline = () => {
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
export const disconnectSocket = () => {
  if(socket){
    socket.disconnect();
  }
};
