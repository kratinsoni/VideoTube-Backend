import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //by changing CORS_ORIGIN we can control which IPs are allowed and blocked
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser()); // setup to send and recieve cookies

//routes import

import userRouter from "./routes/user.routes.js"; //route to handle all user related tasks like login, register, logout etc
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter)

export { app };
