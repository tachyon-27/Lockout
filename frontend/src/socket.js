import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URI;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
