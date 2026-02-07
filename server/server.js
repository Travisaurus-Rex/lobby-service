const WebSocket = require("ws");
const socket = new WebSocket.Server({ port: 8080 });

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
