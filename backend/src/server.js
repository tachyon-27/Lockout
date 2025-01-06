import dotenv from "dotenv";
import connectDB from "./config/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "../.env",
});

const port = process.env.BACKEND_PORT;
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Process is listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.log("MONGODB connection error: ", error);
        process.exit(1);
    });
