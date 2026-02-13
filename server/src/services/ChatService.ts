/**
 * ChatService
 * Handles chat message routing, history, and pub/sub distribution
 */

import { ChatMessage } from "../core/entities/ChatMessage";
import { IChatStore } from "../core/interfaces/IChatStore";

export class ChatService {
  constructor(private chatStore: IChatStore) {}

  /**
   * Send a chat message
   */
  async sendMessage(
    lobbyId: string,
    senderId: string,
    senderUsername: string,
    content: string,
  ): Promise<ChatMessage> {
    // Generate message ID
    const messageId = this.generateMessageId();

    // Create message entity
    const message = new ChatMessage(
      messageId,
      lobbyId,
      senderId,
      senderUsername,
      content,
    );

    // Store message (sliding window)
    await this.chatStore.addMessage(message);

    return message;
  }

  /**
   * Get chat history for a lobby
   */
  async getChatHistory(
    lobbyId: string,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    return await this.chatStore.getMessages(lobbyId, limit);
  }

  /**
   * Clear chat history when lobby is destroyed
   */
  async clearChatHistory(lobbyId: string): Promise<void> {
    await this.chatStore.clearMessages(lobbyId);
  }

  /**
   * Get message count for a lobby
   */
  async getMessageCount(lobbyId: string): Promise<number> {
    return await this.chatStore.getMessageCount(lobbyId);
  }

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
