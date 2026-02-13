/**
 * Lobby-related types
 */

export interface CreateLobbyData {
  username: string;
  maxPlayers: number;
  isPrivate: boolean;
}

export interface JoinLobbyData {
  lobbyId: string;
  username: string;
  lobbyCode?: string;
}

export interface LobbyActionData {
  lobbyId: string;
}

export interface KickPlayerData {
  lobbyId: string;
  targetPlayerId: string;
}
