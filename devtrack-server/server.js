require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // 🔥 ADD THIS
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const progressRoutes = require("./routes/progressRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 🔥 CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/devtrack")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// Middlewares
app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Create HTTP Server AFTER app
const server = http.createServer(app);

// Create Socket Server
const io = new Server(server, {
  cors: { origin: "*" },
});

// Make io available everywhere
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket Connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join-room", (userId) => {
    socket.join(userId);
  });
});

// Routes
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

// Start Server
server.listen(5003, () => {
  console.log("Server running on port 5003"); // 🔥 fix log also
});