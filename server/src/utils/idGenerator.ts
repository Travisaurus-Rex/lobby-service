/**
 * ID Generation Utilities
 */

export class IdGenerator {
  /**
   * Generate a unique lobby ID
   */
  static generateLobbyId(): string {
    return `lobby_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate a unique player ID
   */
  static generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate a unique message ID
   */
  static generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate a lobby code for private lobbies
   */
  static generateLobbyCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing chars
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Generate a temporary connection ID
   */
  static generateTempId(): string {
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
