const lobbies = new Map();

function createLobby(data) {
  const size = lobbies.size;
  const id = `lobby${size + 1}`;
  lobbies.set(id, data);
}
