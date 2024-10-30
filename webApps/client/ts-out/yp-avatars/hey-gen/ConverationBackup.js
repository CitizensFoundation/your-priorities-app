export class ConversationBackupManager {
    constructor(config) {
        this.config = config;
        this.messageBuffer = [];
        this.sendIntervalId = null;
        this.isActive = false;
        // Set up periodic sending if interval is specified
        if (config.batchInterval) {
            this.sendIntervalId = window.setInterval(() => {
                this.sendMessages();
            }, config.batchInterval);
        }
        this.isActive = true;
    }
    addMessage(message) {
        if (!this.isActive)
            return;
        this.messageBuffer.push(message);
        // If no batch interval is set, send immediately
        if (!this.config.batchInterval) {
            this.sendMessages();
        }
    }
    stop() {
        this.isActive = false;
        if (this.sendIntervalId) {
            window.clearInterval(this.sendIntervalId);
            this.sendIntervalId = null;
        }
        // Send any remaining messages
        this.sendMessages();
        this.messageBuffer = [];
    }
    async sendMessages() {
        if (this.messageBuffer.length === 0)
            return;
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
        }
        catch (error) {
            console.error('Error sending conversation backup:', error);
            // Keep messages in buffer in case of error
        }
    }
}
//# sourceMappingURL=ConverationBackup.js.map