const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("new-progress", (data) => {
    io.emit("progress-updated", data);
  });
});

const express = require("express");
const rateLimit = require("express-rate-limit");

const progressRoutes = require("./routes/progressRoutes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests. Try again later."
});

app.use(limiter); // 🔥 add BEFORE routes
app.use("/uploads", express.static("uploads"));


app.use("/api/progress", progressRoutes);