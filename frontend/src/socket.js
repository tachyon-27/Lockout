import { io } from "socket.io-client";

const SOCKET_URL = `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
