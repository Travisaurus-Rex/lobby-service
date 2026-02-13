/**
 * Chat-related types
 */

export interface SendMessageData {
  lobbyId: string;
  content: string;
}

export interface ChatMessageData {
  id: string;
  lobbyId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}
