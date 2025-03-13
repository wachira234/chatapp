import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", ({ room, username }) => {
      if (room && username) {
        const normalizedRoom = room.toLowerCase();
        socket.join(normalizedRoom);
        const roomsAfterJoin = Array.from(socket.rooms);
        console.log(`Socket ${socket.id} joined room ${normalizedRoom}. Rooms:`, roomsAfterJoin);
        if (roomsAfterJoin.includes(normalizedRoom)) {
          console.log(`User ${username} joined room ${normalizedRoom}`);
          socket.to(normalizedRoom).emit("user-joined", { username });
        } else {
          console.error(`Failed to join room ${normalizedRoom}`);
        }
      } else {
        console.error("Invalid join-room data:", { room, username });
      }
    });

    socket.on("message", ({ room, message, sender }) => {
      if (room && sender && message) {
        const normalizedRoom = room.toLowerCase();
        console.log(`Message from ${sender} in room ${normalizedRoom}: ${message}`);
        const rooms = Array.from(socket.rooms);
        console.log(`Socket ${socket.id} is in rooms:`, rooms);
        if (rooms.includes(normalizedRoom)) {
          console.log(`Broadcasting message to room ${normalizedRoom}`);
          socket.to(normalizedRoom).emit("message", { sender, message });
        } else {
          console.error(`Socket ${socket.id} is not in room ${normalizedRoom}`);
        }
      } else {
        console.error("Invalid message data:", { room, message, sender });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`);
  });
});