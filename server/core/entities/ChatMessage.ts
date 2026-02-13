export class ChatMessage {
  private readonly id: string;
  private readonly lobbyId: string;
  private readonly senderId: string;
  private readonly senderUsername: string;
  private readonly content: string;
  private readonly timestamp: Date;

  constructor(
    id: string,
    lobbyId: string,
    senderId: string,
    senderUsername: string,
    content: string,
  ) {
    this.validateContent(content);

    this.id = id;
    this.lobbyId = lobbyId;
    this.senderId = senderId;
    this.senderUsername = senderUsername;
    this.content = content.trim();
    this.timestamp = new Date();
  }

  private validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new Error("Message content cannot be empty");
    }

    const trimmed = content.trim();
    if (trimmed.length > 500) {
      throw new Error("Message content cannot exceed 500 characters");
    }
  }

  isFromSender(senderId: string): boolean {
    return this.senderId === senderId;
  }

  isOlderThan(ageMs: number): boolean {
    const now = new Date().getTime();
    const messageTime = this.timestamp.getTime();
    return now - messageTime > ageMs;
  }

  get getId(): string {
    return this.id;
  }

  get getLobbyId(): string {
    return this.lobbyId;
  }

  get getSenderId(): string {
    return this.senderId;
  }

  get getSenderUsername(): string {
    return this.senderUsername;
  }

  get getContent(): string {
    return this.content;
  }

  get getTimestamp(): Date {
    return this.timestamp;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      lobbyId: this.lobbyId,
      senderId: this.senderId,
      senderUsername: this.senderUsername,
      content: this.content,
      timestamp: this.timestamp.toISOString(),
    };
  }

  static fromJSON(data: any): ChatMessage {
    const message = new ChatMessage(
      data.id,
      data.lobbyId,
      data.senderId,
      data.senderUsername,
      data.content,
    );

    if (data.timestamp) {
      (message as any).timestamp = new Date(data.timestamp);
    }

    return message;
  }
}
