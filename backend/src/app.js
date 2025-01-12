import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

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

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export { app };
