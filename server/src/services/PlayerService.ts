/**
 * PlayerService
 * Handles player creation, validation, and presence tracking
 */

import { Player } from "../core/entities/Player";

export class PlayerService {
  /**
   * Create a guest player
   */
  createGuestPlayer(playerId?: string): Player {
    const id = playerId || this.generatePlayerId();
    const username = Player.generateGuestUsername();
    return new Player(id, username, true);
  }

  /**
   * Create a player with custom username
   */
  createPlayer(
    playerId: string,
    username: string,
    isGuest: boolean = true,
  ): Player {
    return new Player(playerId, username, isGuest);
  }

  /**
   * Validate player username
   */
  validateUsername(username: string): { valid: boolean; error?: string } {
    try {
      // Create a temporary player to validate
      new Player("temp", username, true);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid username",
      };
    }
  }

  /**
   * Update player presence
   */
  updatePresence(player: Player): void {
    player.updatePresence();
  }

  /**
   * Check if player is active
   */
  isPlayerActive(player: Player, timeoutMs: number = 30000): boolean {
    return player.isActive(timeoutMs);
  }

  /**
   * Generate a unique player ID
   */
  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
