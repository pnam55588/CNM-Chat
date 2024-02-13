
import io from "socket.io-client";
let socket;
const baseURL = "http://localhost:3300";
export const initiateSocket = (userId) => {
  socket = io(baseURL, {
    transports: ["websocket"],
    query: { userId },
  });
};
export const disconnectSocket = () => {
  if (socket) socket.disconnect()
};
