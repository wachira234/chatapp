"use client";

import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface UserJoinedMessage {
  username: string;
}

interface ChatMessageData {
  sender: string;
  message: string;
}

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log("Setting up socket listeners");
    socket.on("user-joined", (message: UserJoinedMessage) => {
      console.log(`Received user-joined event: ${message.username}`);
      setMessages((prev) => [
        ...prev,
        { sender: "system", message: `${message.username} joined the room` },
      ]);
    });

    socket.on("message", (data: ChatMessageData) => {
      console.log(`Received message event:`, data);
      setMessages((prev) => {
        const newMessages = [...prev, data];
        console.log("Updated messages state:", newMessages);
        return newMessages;
      });
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("user-joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      const normalizedRoom = room.toLowerCase();
      console.log("Joining room with data:", { room: normalizedRoom, username: userName });
      socket.emit("join-room", { room: normalizedRoom, username: userName });
      setRoom(normalizedRoom);
      setJoined(true);
    } else {
      alert("Please enter both a username and a room name.");
    }
  };

  const handleSendMessage = (message: string) => {
    if (message.trim() && joined) {
      const normalizedRoom = room.toLowerCase();
      console.log("Sending message with room:", normalizedRoom);
      const data = { room: normalizedRoom, message, sender: userName };
      setMessages((prev) => [...prev, { sender: userName, message }]);
      socket.emit("message", data);
    } else {
      console.error("Cannot send message: Room not joined or message empty", { room, joined });
    }
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Join a Room</h1>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2">
            {messages.map((msg, index) => (
              <ChatMessage
                key={`${msg.sender}-${msg.message}-${index}`}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}