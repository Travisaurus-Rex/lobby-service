/**
 * InMemoryChatStore
 * Simple in-memory implementation of IChatStore with sliding window
 */

import { ChatMessage } from "../../core/entities/ChatMessage";
import { IChatStore } from "../../core/interfaces/IChatStore";

export class InMemoryChatStore implements IChatStore {
  private messages: Map<string, ChatMessage[]> = new Map();
  private readonly maxMessages: number = 20;

  async addMessage(message: ChatMessage): Promise<void> {
    const lobbyId = message.getLobbyId;

    if (!this.messages.has(lobbyId)) {
      this.messages.set(lobbyId, []);
    }

    const lobbyMessages = this.messages.get(lobbyId)!;
    lobbyMessages.push(message);

    // Maintain sliding window (keep last N messages)
    if (lobbyMessages.length > this.maxMessages) {
      lobbyMessages.shift(); // Remove oldest
    }
  }

  async getMessages(
    lobbyId: string,
    limit: number = 20,
  ): Promise<ChatMessage[]> {
    const lobbyMessages = this.messages.get(lobbyId) || [];

    // Return last N messages (up to limit)
    const startIndex = Math.max(0, lobbyMessages.length - limit);
    return lobbyMessages.slice(startIndex);
  }

  async clearMessages(lobbyId: string): Promise<void> {
    this.messages.delete(lobbyId);
  }

  async getMessageCount(lobbyId: string): Promise<number> {
    const lobbyMessages = this.messages.get(lobbyId) || [];
    return lobbyMessages.length;
  }
}
