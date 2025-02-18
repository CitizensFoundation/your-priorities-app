var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement } from "lit/decorators.js";
import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpLanguages } from "../common/languages/ypLanguages.js";
let YpAssistant = class YpAssistant extends YpAssistantBase {
    async sendChatMessage(message) {
        if (message === undefined) {
            message = this.chatInputField.value;
        }
        if (message.length === 0)
            return;
        if (this.voiceEnabled) {
            this.toggleVoiceMode();
        }
        //this.ws.send(message);
        this.chatInputField.value = "";
        this.sendButton.disabled = false;
        //this.sendButton!.innerHTML = this.t('Thinking...');
        setTimeout(() => {
            this.chatInputField.blur();
        });
        this.addChatBotElement({
            sender: "user",
            type: "start",
            message: message,
        });
        // this.addThinkingChatBotMessage();
        await this.serverApi.sendChatMessage(this.domainId, this.wsClientId, this.simplifiedChatLog, YpLanguages.getEnglishName(this.language), this.currentMode);
        await new Promise((resolve) => setTimeout(resolve, 10));
        this.chatInputField?.focus();
        this.scrollDown();
    }
};
YpAssistant = __decorate([
    customElement("yp-assistant")
], YpAssistant);
export { YpAssistant };
//# sourceMappingURL=yp-assistant.js.map