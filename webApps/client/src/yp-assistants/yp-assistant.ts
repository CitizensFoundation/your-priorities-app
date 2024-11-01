import { customElement } from "lit/decorators.js";
import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpLanguages } from "../common/languages/ypLanguages.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";

@customElement("yp-assistant")
export class YpAssistant extends YpAssistantBase {
  groupId!: number;

  serverApi!: YpAssistantServerApi;
  override setupServerApi(): void {
    this.serverApi = new YpAssistantServerApi();
  }

  override async sendChatMessage() {
    const message = this.chatInputField!.value;

    if (message.length === 0) return;

    //this.ws.send(message);
    this.chatInputField!.value = "";
    this.sendButton!.disabled = false;
    //this.sendButton!.innerHTML = this.t('Thinking...');
    setTimeout(() => {
      this.chatInputField!.blur();
    });

    this.addChatBotElement({
      sender: "you",
      type: "start",
      message: message,
    });

    this.addThinkingChatBotMessage();

    await this.serverApi.sendChatMessage(
      this.groupId,
      this.wsClientId,
      this.simplifiedChatLog,
      YpLanguages.getEnglishName(this.language)
    );
  }
}