import jwt from "jsonwebtoken";

let ioInstance;
const userSockets = new Map();

export const setupSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`New connection from ${socket.id}`);

    let userId = null;
    
    try {
      const cookieHeader = socket.request.headers.cookie;
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split("; ").map((c) => c.split("="))
        );

        const token = cookies.token;
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded) {
            userId = decoded;
            socket.user = decoded;

            userSockets.set(userId, socket);
            console.log(`User authenticated: ${userId} (${socket.id})`);
          }
        }
      }
    } catch (err) {
      console.log(`Authentication failed for ${socket.id}: ${err.message}`);
    }

    console.log(`User (logged in: ${!!userId}) connected: ${socket.id}`);

    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`${userId || "Guest"} joined room: ${room}`);
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`${userId || "Guest"} left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId || "Guest"} (${socket.id})`);
      if (userId) {
        userSockets.delete(userId);
      }
    });
  });
};

export const getIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io is not initialized yet!");
  }
  return ioInstance;
};

export const getUserSocket = (userId) => {
  return userSockets.get(userId) || null;
};
