// conversationBackup.ts
export interface ConversationBackupConfig {
  backupEndpoint: string;
  batchInterval?: number; // How often to send messages (optional)
  headers?: Record<string, string>;
  sessionId: string;
}

export interface ConversationMessage {
  type: 'avatar' | 'user';
  message: string;
  timestamp: number;
  taskId?: string;
}

export class ConversationBackupManager {
  private messageBuffer: ConversationMessage[] = [];
  private sendIntervalId: number | null = null;
  private isActive = false;

  constructor(private config: ConversationBackupConfig) {
    // Set up periodic sending if interval is specified
    if (config.batchInterval) {
      this.sendIntervalId = window.setInterval(() => {
        this.sendMessages();
      }, config.batchInterval);
    }
    this.isActive = true;
  }

  public addMessage(message: ConversationMessage): void {
    if (!this.isActive) return;

    this.messageBuffer.push(message);

    // If no batch interval is set, send immediately
    if (!this.config.batchInterval) {
      this.sendMessages();
    }
  }

  public stop(): void {
    this.isActive = false;

    if (this.sendIntervalId) {
      window.clearInterval(this.sendIntervalId);
      this.sendIntervalId = null;
    }

    // Send any remaining messages
    this.sendMessages();
    this.messageBuffer = [];
  }

  private async sendMessages(): Promise<void> {
    if (this.messageBuffer.length === 0) return;

    try {
      const payload = {
        timestamp: Date.now(),
        messages: [...this.messageBuffer],
        sessionId: this.config.sessionId
      };

      await fetch(this.config.backupEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        },
        body: JSON.stringify(payload)
      });

      // Clear buffer after successful send
      this.messageBuffer = [];
    } catch (error) {
      console.error('Error sending conversation backup:', error);
      // Keep messages in buffer in case of error
    }
  }
}