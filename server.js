const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const router = express.Router();
const socketIo = require("./socket");
const bcrypt = require("bcrypt");

const { userRouter } = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:7000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Mongoose connection error", err));

socketIo(io);
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:7000");
});
