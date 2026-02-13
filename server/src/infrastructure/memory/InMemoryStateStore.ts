/**
 * InMemoryStateStore
 * Simple in-memory implementation of IStateStore for testing/development
 */

import { Lobby } from "../../core/entities/Lobby";
import { IStateStore } from "../../core/interfaces/IStateStore";

export class InMemoryStateStore implements IStateStore {
  private lobbies: Map<string, Lobby> = new Map();

  async saveLobby(lobby: Lobby): Promise<void> {
    // Serialize and deserialize to simulate storage
    const json = lobby.toJSON();
    const restored = Lobby.fromJSON(json);
    this.lobbies.set(lobby.getId, restored);
  }

  async getLobby(lobbyId: string): Promise<Lobby | null> {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      return null;
    }

    // Return a copy to simulate retrieval from storage
    const json = lobby.toJSON();
    return Lobby.fromJSON(json);
  }

  async deleteLobby(lobbyId: string): Promise<void> {
    this.lobbies.delete(lobbyId);
  }

  async getAllLobbyIds(): Promise<string[]> {
    return Array.from(this.lobbies.keys());
  }

  async lobbyExists(lobbyId: string): Promise<boolean> {
    return this.lobbies.has(lobbyId);
  }

  async getAllLobbies(filter?: {
    isPrivate?: boolean;
    isFull?: boolean;
    isStarted?: boolean;
  }): Promise<Lobby[]> {
    let lobbies = Array.from(this.lobbies.values());

    if (filter) {
      if (filter.isPrivate !== undefined) {
        lobbies = lobbies.filter((l) => l.getIsPrivate === filter.isPrivate);
      }
      if (filter.isFull !== undefined) {
        lobbies = lobbies.filter((l) => l.isFull === filter.isFull);
      }
      if (filter.isStarted !== undefined) {
        lobbies = lobbies.filter((l) => l.getIsStarted === filter.isStarted);
      }
    }

    // Return copies
    return lobbies.map((l) => Lobby.fromJSON(l.toJSON()));
  }
}
