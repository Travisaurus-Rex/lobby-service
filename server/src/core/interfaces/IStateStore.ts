import { Lobby } from "../entities/Lobby";

export interface IStateStore {
  saveLobby(lobby: Lobby): Promise<void>;
  getLobby(lobbyId: string): Promise<Lobby | null>;
  deleteLobby(lobbyId: string): Promise<void>;
  getAllLobbyIds(): Promise<string[]>;
  lobbyExists(lobbyId: string): Promise<boolean>;
  getAllLobbies(filter?: {
    isPrivate?: boolean;
    isFull?: boolean;
    isStarted?: boolean;
  }): Promise<Lobby[]>;
}
