/**
 * StateService
 * Thin abstraction over IStateStore for any additional state logic
 * Currently just delegates to the store, but can be extended with caching, validation, etc.
 */

import { Lobby } from "../core/entities/Lobby";
import { IStateStore } from "../core/interfaces/IStateStore";

export class StateService {
  constructor(private stateStore: IStateStore) {}

  /**
   * Save lobby state
   */
  async saveLobby(lobby: Lobby): Promise<void> {
    await this.stateStore.saveLobby(lobby);
  }

  /**
   * Get lobby state
   */
  async getLobby(lobbyId: string): Promise<Lobby | null> {
    return await this.stateStore.getLobby(lobbyId);
  }

  /**
   * Delete lobby state
   */
  async deleteLobby(lobbyId: string): Promise<void> {
    await this.stateStore.deleteLobby(lobbyId);
  }

  /**
   * Get all lobby IDs
   */
  async getAllLobbyIds(): Promise<string[]> {
    return await this.stateStore.getAllLobbyIds();
  }

  /**
   * Check if lobby exists
   */
  async lobbyExists(lobbyId: string): Promise<boolean> {
    return await this.stateStore.lobbyExists(lobbyId);
  }

  /**
   * Get filtered lobbies
   */
  async getLobbies(filter?: {
    isPrivate?: boolean;
    isFull?: boolean;
    isStarted?: boolean;
  }): Promise<Lobby[]> {
    return await this.stateStore.getAllLobbies(filter);
  }
}
