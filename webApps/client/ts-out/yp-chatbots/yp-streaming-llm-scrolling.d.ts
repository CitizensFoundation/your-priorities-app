import "@material/web/fab/fab.js";
import "@material/web/radio/radio.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "../common/yp-image.js";
import { YpStreamingLlmBase } from "./yp-streaming-llm-base.js";
import "./yp-chatbot-item-base.js";
export declare abstract class YpStreamingLlmScrolling extends YpStreamingLlmBase {
    scrollElementSelector: string;
    useMainWindowScroll: boolean;
    userScrolled: boolean;
    scrollDown(): void;
    handleScroll(): void;
}
//# sourceMappingURL=yp-streaming-llm-scrolling.d.ts.map