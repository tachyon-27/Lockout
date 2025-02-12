import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from 'http';
import { Server } from 'socket.io';
import { getIo, getUserSocket, setupSocket } from './socket.js'
import {errorHandler} from "./middlewares/errorHandler.js";

const app = express();
const server = http.createServer(app)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Creating socket.io instance
const io = new Server(server, {
  cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
  },
})

// Authenticating and setting up io instance
setupSocket(io);

app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(express.static("public"));
app.use(cookieParser());

// Attach `io` & `userSocket` to `req`
app.use((req, res, next) => {
  req.io = getIo();
  req.getUserSocket = getUserSocket
  next();
});

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import tournamentRouter from "./routes/tournament.route.js"
import cfRouter from "./routes/cf.route.js"

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tournament", tournamentRouter)
app.use("/api/cf", cfRouter)

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export { app, server };
