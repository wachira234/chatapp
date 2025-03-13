# chatapp

Real-Time Chat Application with Next.js and Socket.io

Overview
This project is a real-time chat application built using Next.js 15, Socket.io, and TypeScript. It allows users to join chat rooms, send messages, and receive messages in real-time from other users in the same room. The application uses Socket.io for real-time bidirectional communication between the client and server, with Next.js providing the frontend framework and TypeScript ensuring type safety.

Features

Join Rooms: Users can enter a username and room name to join a specific chat room.

Real-Time Messaging: Send and receive messages instantly within the same room.
Join Notifications: Users are notified when someone joins the room.
Responsive UI: Simple and clean chat interface styled with Tailwind CSS (assumed, based on class names).
Room Normalization: Room names are case-insensitive (e.g., "Room1" and "room1" are treated as the same room).

Project Structure
chat-socket-next15/
├-─ app/
│ ├── page.tsx # Main chat page (client-side logic)
│ ├── layout.tsx # Next.js layout file
│ └── globals.css # Global styles
├── components/
│ ├── ChatForm.tsx # Component for the message input form
│ └── ChatMessage.tsx # Component for rendering individual chat messages
├── lib/
│ └── socketClient.ts # Socket.io client setup
├── server.mts # Socket.io server setup integrated with Next.js
├── next.config.mjs # Next.js configuration
├── tsconfig.json # TypeScript configuration
├── tsconfig.server.json # TypeScript configuration for server.mts
├── package.json # Dependencies and scripts
├── package-lock.json # Dependency lock file
├── .eslintrc.json # ESLint configuration
├── .gitignore # Git ignore file
└── README.md # Project documentation (this file)

Prerequisites
To run this project, ensure you have the following installed:

Node.js: Version 18.x or higher (recommended: 20.x).
npm: Comes with Node.js (or use Yarn if preferred).
Git: For cloning the repository (optional).
Setup Instructions
Clone the Repository (if applicable):
git clone <repository-url>
cd chat-socket-next15

Install Dependencies: Run the following command to install all required npm packages:
npm install

Ensure the following key dependencies are in your package.json:
"dependencies": {
"next": "15.2.2",
"react": "^19.0.0",
"react-dom": "^19.0.0",
"socket.io": "^4.8.1",
"socket.io-client": "^4.8.1",
"ts-node": "^10.9.2"
},
"devDependencies": {
"@eslint/eslintrc": "^3",
"@tailwindcss/postcss": "^4",
"@types/node": "^20",
"@types/react": "^19",
"@types/react-dom": "^19",
"cross-env": "^7.0.3",
"eslint": "^9",
"eslint-config-next": "15.2.2",
"tailwindcss": "^4",
"typescript": "^5"
}

Verify Ports:
The server (server.mts) runs on port 3000.
The Next.js app runs on port 3001 to avoid conflicts (configured in package.json scripts).
Running the Application
The project requires two processes to run simultaneously: the Socket.io server and the Next.js app.

Step 1: Start the Socket.io Server
Run the following command to start the Socket.io server:
npm run dev:socket

This will start the server on http://localhost:3000.
You should see: Server running on http://localhost:3000.
Step 2: Start the Next.js App
In a separate terminal, run the following command to start the Next.js development server:
npm run dev

This will start the Next.js app on http://localhost:3000 (configured in package.json as "dev": "next dev -p 3000").
You should see: ready - started server on 0.0.0.0:3000, url: http://localhost:3000.
Step 3: Test the Chat
Open a browser and go to http://localhost:3000.
Open two browser tabs (or windows) to simulate multiple users:
Tab 1: Enter a username (e.g., "User1") and room name (e.g., "room1"), then click "Join Room".
Tab 2: Enter a different username (e.g., "User2") and the same room name ("room1"), then click "Join Room".
Verify that:
Tab 1 shows "User2 joined the room".
Tab 2 shows "User1 joined the room".
In Tab 2, send a message (e.g., "Hello from User2").
Tab 1 should show "Hello from User2".
Tab 2 should already show "Hello from User2" (from local state).
Troubleshooting
Common Issues
Port Conflict:
If you see an error like Error: listen EADDRINUSE: address already in use :::3000, ensure no other process is using port 3000 before starting the server.
If needed, change the port in server.mts and update SOCKET_SERVER_URL in socketClient.ts to match.
Messages Not Appearing:
Check the server logs for Broadcasting message to room <room> to confirm the message is being broadcasted.
Check the browser console in Tab 1 for Received message event: { sender: "User2", message: "Hello from User2" }.
If the message is received but not rendered, verify the ChatMessage component and the messages state update in page.tsx.
"Socket.io connection error":
Ensure the server is running on http://localhost:3000.
Verify the CORS configuration in server.mts matches the Next.js app’s port (http://localhost:3000).
Debugging Logs
Server Logs: Check the terminal running npm run dev:socket for logs like User <username> joined room <room> and Message from <sender> in room <room>: <message>.
Client Logs: Open the browser’s developer tools (F12) and check the Console tab for logs like Socket.io client connected to server, Joining room with data, and Received message event.
