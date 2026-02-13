import { ChatMessage } from "../entities/ChatMessage";

export interface IChatStore {
  addMessage(message: ChatMessage): Promise<void>;
  getMessages(lobbyId: string, limit?: number): Promise<ChatMessage[]>;
  clearMessages(lobbyId: string): Promise<void>;
  getMessageCount(lobbyId: string): Promise<number>;
}
