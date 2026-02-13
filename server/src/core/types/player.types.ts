/**
 * Player-related types
 */

export interface PlayerData {
  id: string;
  username: string;
  isGuest: boolean;
  connectedAt: string;
  lastSeenAt: string;
}

export interface AuthGuestData {
  username?: string;
}
