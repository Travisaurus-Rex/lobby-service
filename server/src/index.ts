import { RawData, WebSocketServer, WebSocket } from "ws";

const port = 3399;

const server = new WebSocketServer({
  port,
});

interface Player {
  username: string;
  socket: WebSocket;
}

interface Lobby {
  id: string;
  players: Set<Player>;
}

interface LobbyMetaData {
  id: string;
  size: number;
}

const playerLobbyMap = new Map<WebSocket, Lobby>();

const lobbies = new Set<Lobby>()
  .add({ id: "123", players: new Set<Player>() })
  .add({ id: "abc", players: new Set<Player>() });

server.on("connection", (socket: WebSocket) => {
  console.log("Client connected");

  const lobbyList = getLobbyList();
  const message = JSON.stringify({ type: "lobby_list", payload: lobbyList });
  socket.send(message);

  socket.on("message", (data: RawData) => {
    const message = JSON.parse(data.toString());
    switch (message.type) {
      case "join_lobby":
        return joinLobby(message.payload.lobbyId, {
          username: "tadams42069",
          socket,
        });
      case "chat":
        return broadcastMessage(message.payload.message, socket);
    }
  });

  socket.on("close", () => {
    // nothing yet
  });
});

function getLobbyList(): LobbyMetaData[] {
  let data: LobbyMetaData[] = [];
  lobbies.forEach((lobby: Lobby) =>
    data.push({ id: lobby.id, size: lobby.players.size }),
  );
  return data;
}

function joinLobby(id: string, player: Player) {
  lobbies.forEach((lobby: Lobby) => {
    if (lobby.id === id) {
      lobby.players.add(player);
      playerLobbyMap.set(player.socket, lobby);
    }
  });
}

function broadcastMessage(message: string, socket: WebSocket) {
  const lobby = playerLobbyMap.get(socket);
  if (!lobby) return;

  lobby.players.forEach((player) => {
    player.socket.send(JSON.stringify({ type: "chat", payload: { message } }));
  });
}
