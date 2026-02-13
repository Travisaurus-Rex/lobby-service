export interface IPlayer {
  id: string;
  username: string;
  isGuest: boolean;
  connectedAt: Date;
  lastSeenAt: Date;
}
