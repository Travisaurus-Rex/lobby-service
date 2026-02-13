import { IPlayer } from "./IPlayer";

export interface ILobby {
  id: string;
  hostId: string;
  maxPlayers: number;
  isPrivate: boolean;
  lobbyCode?: string;
  players: Map<string, IPlayer>;
  readyPlayers: Set<string>;
  isStarted: boolean;
  createdAt: Date;
  hostDisconnectedAt?: Date;
}
