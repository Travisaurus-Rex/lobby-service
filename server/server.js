const express = require("express");
const http = require("http");
const app = express();
const port = 8080;

app.use(express.static("../client"));

const server = http.createServer(app);

const WebSocket = require("ws");
const socket = new WebSocket.Server({ server });

socket.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received: ${message.toString()}`);
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconencted");
  });

  ws.send("Welcome to the lobby server!");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
