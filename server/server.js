const express = require("express");
const http = require("http");
const app = express();
const port = 8080;
const setupWebsocket = require("./websocket");

app.use(express.static("../client"));

const server = http.createServer(app);

setupWebsocket(server);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
