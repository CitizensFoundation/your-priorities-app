// baseAssistantMode.ts
export class BaseAssistantMode {
    constructor(assistant) {
        this.assistant = assistant;
    }
    get memory() {
        return this.assistant.memory;
    }
    renderCommon() {
        if (!this.memory.currentMode) {
            return "";
        }
        console.log(`renderCommon: currentConversationMode ${this.memory.currentMode}`);
        return `<currentConversationMode>${this.memory.currentMode}</currentConversationMode>`;
    }
}
