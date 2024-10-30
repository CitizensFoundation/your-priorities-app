export class AudioBackupManager {
    constructor(config) {
        this.config = config;
        this.audioBuffer = [];
        this.mediaRecorder = null;
        this.audioContext = null;
        this.sourceNode = null;
        this.processorNode = null;
        this.sendIntervalId = null;
        this.isRecording = false;
    }
    attachToStream(stream) {
        if (this.isRecording)
            return;
        try {
            // Create audio context and nodes
            this.audioContext = new AudioContext({
                sampleRate: 16000,
                latencyHint: 'interactive'
            });
            // Create a duplicate stream for backup
            this.sourceNode = this.audioContext.createMediaStreamSource(stream);
            this.processorNode = this.audioContext.createScriptProcessor(512, 1, 1);
            // Set up audio processing
            this.processorNode.onaudioprocess = (event) => {
                if (!this.isRecording)
                    return;
                const audioData = event.inputBuffer.getChannelData(0);
                this.audioBuffer.push(new Float32Array(audioData));
            };
            // Connect nodes
            this.sourceNode.connect(this.processorNode);
            this.processorNode.connect(this.audioContext.destination);
            // Start periodic sending
            this.isRecording = true;
            this.sendIntervalId = window.setInterval(() => {
                this.sendAudioChunks();
            }, this.config.sendInterval);
        }
        catch (error) {
            console.error('Error setting up audio backup:', error);
        }
    }
    stop() {
        this.isRecording = false;
        if (this.sendIntervalId) {
            window.clearInterval(this.sendIntervalId);
            this.sendIntervalId = null;
        }
        // Clean up audio nodes
        if (this.processorNode) {
            this.processorNode.disconnect();
            this.processorNode = null;
        }
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        // Send any remaining audio
        this.sendAudioChunks();
        this.audioBuffer = [];
    }
    async sendAudioChunks() {
        if (this.audioBuffer.length === 0)
            return;
        try {
            // Combine all chunks
            const totalLength = this.audioBuffer.reduce((acc, chunk) => acc + chunk.length, 0);
            const combinedAudio = new Float32Array(totalLength);
            let offset = 0;
            for (const chunk of this.audioBuffer) {
                combinedAudio.set(chunk, offset);
                offset += chunk.length;
            }
            // Prepare payload
            const audioArray = Array.from(combinedAudio);
            const payload = {
                timestamp: Date.now(),
                audioData: btoa(String.fromCharCode.apply(null, audioArray)),
                sampleRate: 16000,
                channels: 1,
                sessionId: this.config.sessionId
            };
            // Send to backup endpoint
            await fetch(this.config.backupEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.config.headers
                },
                body: JSON.stringify(payload)
            });
            // Clear buffer after successful send
            this.audioBuffer = [];
        }
        catch (error) {
            console.error('Error sending audio backup:', error);
            // Keep buffer in case of error
        }
    }
}
//# sourceMappingURL=AudioBackup.js.map