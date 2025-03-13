"use client";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("Socket.io client connected to server:", SOCKET_SERVER_URL);
});

socket.on("connect_error", (error) => {
  console.error("Socket.io connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket.io client disconnected:", reason);
});