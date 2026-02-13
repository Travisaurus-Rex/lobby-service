import { Lobby } from "../core/entities/Lobby";
import { Player } from "../core/entities/Player";
import { IStateStore } from "../core/interfaces/IStateStore";

export class LobbyService {
  constructor(private stateStore: IStateStore) {}

  async createLobby(
    hostId: string,
    hostUsername: string,
    maxPlayers: number,
    isPrivate: boolean = false,
    lobbyCode?: string,
  ): Promise<Lobby> {
    const lobbyId = this.generateLobbyId();

    const lobby = new Lobby(lobbyId, hostId, maxPlayers, isPrivate, lobbyCode);

    const host = new Player(hostId, hostUsername, true);
    lobby.addPlayer(host);

    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async joinLobby(
    lobbyId: string,
    playerId: string,
    playerUsername: string,
    lobbyCode?: string,
  ): Promise<Lobby> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    if (lobby.getIsPrivate && !lobby.validateLobbyCode(lobbyCode || "")) {
      throw new Error("Invalid lobby code");
    }

    const player = new Player(playerId, playerUsername, true);
    lobby.addPlayer(player);

    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async leaveLobby(lobbyId: string, playerId: string): Promise<Lobby | null> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    lobby.removePlayer(playerId);

    if (lobby.shouldDestroy()) {
      await this.stateStore.deleteLobby(lobbyId);
      return null;
    }

    if (playerId === lobby.getHostId && lobby.isHostDisconnected) {
      await this.stateStore.saveLobby(lobby);
      return lobby;
    }

    await this.stateStore.saveLobby(lobby);
    return lobby;
  }

  async toggleReady(lobbyId: string, playerId: string): Promise<Lobby> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    lobby.toggleReady(playerId);
    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async startGame(lobbyId: string, hostId: string): Promise<Lobby> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    if (lobby.getHostId !== hostId) {
      throw new Error("Only host can start the game");
    }

    lobby.start();
    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async kickPlayer(
    lobbyId: string,
    hostId: string,
    targetPlayerId: string,
  ): Promise<Lobby> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    lobby.kickPlayer(hostId, targetPlayerId);
    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async getLobby(lobbyId: string): Promise<Lobby | null> {
    return await this.stateStore.getLobby(lobbyId);
  }

  async getAvailableLobbies(): Promise<Lobby[]> {
    return await this.stateStore.getAllLobbies({
      isPrivate: false,
      isFull: false,
      isStarted: false,
    });
  }

  async transferHost(lobbyId: string): Promise<Lobby | null> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    const nextHost = lobby.getNextHost();
    if (!nextHost) {
      await this.stateStore.deleteLobby(lobbyId);
      return null;
    }

    lobby.transferHost(nextHost.getId);
    await this.stateStore.saveLobby(lobby);

    return lobby;
  }

  async handleHostGracePeriodExpiry(lobbyId: string): Promise<Lobby | null> {
    const lobby = await this.stateStore.getLobby(lobbyId);
    if (!lobby) {
      return null;
    }

    if (lobby.isHostGracePeriodExpired()) {
      return await this.transferHost(lobbyId);
    }

    return lobby;
  }

  private generateLobbyId(): string {
    return `lobby_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  static generateLobbyCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
