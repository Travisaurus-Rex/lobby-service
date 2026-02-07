const WebSocket = require("ws");

function setupWebsocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log(`Received: ${message.toString()}`);
      ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });

    ws.send("Welcome to the lobby server!");
  });

  return wss;
}

module.exports = setupWebsocket;
