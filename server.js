// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// file uploads
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", (room) => socket.join(room));
  socket.on("message", (msg) => {
    io.to(msg.room).emit("message", msg);
  });

  socket.on("disconnect", () => console.log("user disconnected"));
});

server.listen(5000, () => console.log("Server running on port http://localhost:5000"));
