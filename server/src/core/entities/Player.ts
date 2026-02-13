import { PlayerData } from "../types/player.types";

export class Player {
  private readonly id: string;
  private username: string;
  private readonly isGuest: boolean;
  private readonly connectedAt: Date;
  private lastSeenAt: Date;

  constructor(id: string, username: string, isGuest: boolean = true) {
    this.validateUsername(username);

    this.id = id;
    this.username = username;
    this.isGuest = isGuest;
    this.connectedAt = new Date();
    this.lastSeenAt = new Date();
  }

  updateUsername(newUsername: string): void {
    this.validateUsername(newUsername);
    this.username = newUsername;
  }

  updatePresence(): void {
    this.lastSeenAt = new Date();
  }

  isActive(timeoutMs: number = 30000): boolean {
    const now = new Date().getTime();
    const lastSeen = this.lastSeenAt.getTime();
    return now - lastSeen < timeoutMs;
  }

  private validateUsername(username: string): void {
    if (!username || username.trim().length === 0) {
      throw new Error("Username cannot be empty");
    }

    const trimmed = username.trim();
    if (trimmed.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }
    if (trimmed.length > 20) {
      throw new Error("Username must be 20 characters or less");
    }

    const validPattern = /^[a-zA-Z0-9_\- ]+$/;
    if (!validPattern.test(trimmed)) {
      throw new Error(
        "Username can only contain letters, numbers, spaces, underscores, and hyphens",
      );
    }
  }

  get getId(): string {
    return this.id;
  }

  get getUsername(): string {
    return this.username;
  }

  get getIsGuest(): boolean {
    return this.isGuest;
  }

  get getConnectedAt(): Date {
    return this.connectedAt;
  }

  get getLastSeenAt(): Date {
    return this.lastSeenAt;
  }

  toJSON(): PlayerData {
    return {
      id: this.id,
      username: this.username,
      isGuest: this.isGuest,
      connectedAt: this.connectedAt.toISOString(),
      lastSeenAt: this.lastSeenAt.toISOString(),
    };
  }

  static fromJSON(data: PlayerData): Player {
    const player = new Player(data.id, data.username, data.isGuest);

    if (data.connectedAt) {
      (player as any).connectedAt = new Date(data.connectedAt);
    }
    if (data.lastSeenAt) {
      player.lastSeenAt = new Date(data.lastSeenAt);
    }

    return player;
  }

  static generateGuestUsername(): string {
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `Guest_${randomNum}`;
  }
}
