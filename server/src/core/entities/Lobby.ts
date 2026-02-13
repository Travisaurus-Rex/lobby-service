import { Player } from "./Player";

export class Lobby {
  private readonly id: string;
  private readonly hostId: string;
  private readonly maxPlayers: number;
  private readonly isPrivate: boolean;
  private readonly lobbyCode?: string;

  private players: Map<string, Player> = new Map();
  private readyPlayers: Set<string> = new Set();
  private isStarted: boolean = false;
  private readonly createdAt: Date;
  private hostDisconnectedAt?: Date;

  constructor(
    id: string,
    hostId: string,
    maxPlayers: number,
    isPrivate: boolean = false,
    lobbyCode?: string,
  ) {
    this.validateMaxPlayers(maxPlayers);

    this.id = id;
    this.hostId = hostId;
    this.maxPlayers = maxPlayers;
    this.isPrivate = isPrivate;
    this.lobbyCode = lobbyCode;
    this.createdAt = new Date();
  }

  addPlayer(player: Player): void {
    if (this.isFull) {
      throw new Error("Lobby is full");
    }
    if (this.isStarted) {
      throw new Error("Game already started");
    }
    if (this.players.has(player.getId)) {
      throw new Error("Player already in lobby");
    }

    this.players.set(player.getId, player);

    if (player.getId === this.hostId && this.hostDisconnectedAt) {
      this.hostDisconnectedAt = undefined;
    }
  }

  removePlayer(playerId: string): void {
    if (!this.players.has(playerId)) {
      throw new Error("Player not in lobby");
    }

    this.players.delete(playerId);
    this.readyPlayers.delete(playerId);

    if (playerId === this.hostId) {
      this.hostDisconnectedAt = new Date();
    }
  }

  toggleReady(playerId: string): void {
    if (!this.players.has(playerId)) {
      throw new Error("Player not in lobby");
    }
    if (this.isStarted) {
      throw new Error("Game already started");
    }

    if (this.readyPlayers.has(playerId)) {
      this.readyPlayers.delete(playerId);
    } else {
      this.readyPlayers.add(playerId);
    }
  }

  isPlayerReady(playerId: string): boolean {
    return this.readyPlayers.has(playerId);
  }

  start(): void {
    if (this.isStarted) {
      throw new Error("Game already started");
    }
    if (!this.canStart()) {
      throw new Error(
        "Cannot start: not all players are ready or minimum player count not met",
      );
    }

    this.isStarted = true;
  }

  canStart(): boolean {
    return (
      this.players.size >= 2 &&
      this.players.size === this.readyPlayers.size &&
      !this.isStarted
    );
  }

  kickPlayer(kickerId: string, playerId: string): void {
    if (kickerId !== this.hostId) {
      throw new Error("Only host can kick players");
    }
    if (playerId === this.hostId) {
      throw new Error("Host cannot kick themselves");
    }

    this.removePlayer(playerId);
  }

  transferHost(newHostId: string): void {
    if (!this.players.has(newHostId)) {
      throw new Error("New host must be in the lobby");
    }
    if (newHostId === this.hostId) {
      throw new Error("Player is already host");
    }

    (this as any).hostId = newHostId;
    this.hostDisconnectedAt = undefined;
  }

  isHostGracePeriodExpired(gracePeriodMs: number = 30000): boolean {
    if (!this.hostDisconnectedAt) {
      return false;
    }

    const now = new Date().getTime();
    const disconnectedAt = this.hostDisconnectedAt.getTime();
    return now - disconnectedAt > gracePeriodMs;
  }

  getNextHost(): Player | null {
    const playersArray = Array.from(this.players.values());

    const eligiblePlayers = playersArray.filter((p) => p.getId !== this.hostId);

    if (eligiblePlayers.length === 0) {
      return null;
    }

    return eligiblePlayers.sort(
      (a, b) => a.getConnectedAt.getTime() - b.getConnectedAt.getTime(),
    )[0];
  }

  shouldDestroy(gracePeriodMs: number = 30000): boolean {
    if (this.players.size === 0) {
      return true;
    }

    if (this.isHostGracePeriodExpired(gracePeriodMs) && !this.getNextHost()) {
      return true;
    }

    return false;
  }

  validateLobbyCode(code: string): boolean {
    if (!this.isPrivate) {
      return true;
    }

    return this.lobbyCode === code;
  }

  private validateMaxPlayers(maxPlayers: number): void {
    if (!Number.isInteger(maxPlayers)) {
      throw new Error("Max players must be an integer");
    }
    if (maxPlayers < 2) {
      throw new Error("Max players must be at least 2");
    }
    if (maxPlayers > 10) {
      throw new Error("Max players cannot exceed 10");
    }
  }

  get getId(): string {
    return this.id;
  }

  get getHostId(): string {
    return this.hostId;
  }

  get getMaxPlayers(): number {
    return this.maxPlayers;
  }

  get getIsPrivate(): boolean {
    return this.isPrivate;
  }

  get getLobbyCode(): string | undefined {
    return this.lobbyCode;
  }

  get getIsStarted(): boolean {
    return this.isStarted;
  }

  get isFull(): boolean {
    return this.players.size >= this.maxPlayers;
  }

  get playerCount(): number {
    return this.players.size;
  }

  get getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  get getPlayerIds(): string[] {
    return Array.from(this.players.keys());
  }

  get getReadyPlayerIds(): string[] {
    return Array.from(this.readyPlayers);
  }

  get getCreatedAt(): Date {
    return this.createdAt;
  }

  get isHostDisconnected(): boolean {
    return this.hostDisconnectedAt !== undefined;
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      hostId: this.hostId,
      maxPlayers: this.maxPlayers,
      isPrivate: this.isPrivate,
      lobbyCode: this.lobbyCode,
      players: Array.from(this.players.entries()).map(([id, player]) => [
        id,
        player.toJSON(),
      ]),
      readyPlayers: Array.from(this.readyPlayers),
      isStarted: this.isStarted,
      createdAt: this.createdAt.toISOString(),
      hostDisconnectedAt: this.hostDisconnectedAt?.toISOString(),
    };
  }

  static fromJSON(data: any): Lobby {
    const lobby = new Lobby(
      data.id,
      data.hostId,
      data.maxPlayers,
      data.isPrivate,
      data.lobbyCode,
    );

    if (data.players && Array.isArray(data.players)) {
      data.players.forEach(([id, playerData]: [string, any]) => {
        lobby.players.set(id, Player.fromJSON(playerData));
      });
    }

    if (data.readyPlayers && Array.isArray(data.readyPlayers)) {
      lobby.readyPlayers = new Set(data.readyPlayers);
    }

    (lobby as any).isStarted = data.isStarted || false;

    if (data.createdAt) {
      (lobby as any).createdAt = new Date(data.createdAt);
    }

    if (data.hostDisconnectedAt) {
      lobby.hostDisconnectedAt = new Date(data.hostDisconnectedAt);
    }

    return lobby;
  }
}
