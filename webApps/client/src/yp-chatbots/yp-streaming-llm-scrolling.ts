import { property, customElement } from "lit/decorators.js";

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

@customElement("yp-streaming-llm-scrolling")
export abstract class YpStreamingLlmScrolling extends YpStreamingLlmBase {
  @property({ type: String })
  scrollElementSelector = "#chat-messages";

  @property({ type: Boolean })
  useMainWindowScroll = false;

  @property({ type: Boolean })
  userScrolled = false;

  override scrollDown() {
    if (this.disableAutoScroll) {
      return;
    }

    if (
      !this.userScrolled &&
      (this.$$(this.scrollElementSelector) || this.useMainWindowScroll)
    ) {
      this.programmaticScroll = true;
      let element;
      if (this.useMainWindowScroll) {
        element = window.document.documentElement;
      } else if (this.$$(this.scrollElementSelector)) {
        element = this.$$(this.scrollElementSelector)!;
      }

      if (
        element?.tagName === "INPUT" ||
        element?.tagName === "TEXTAREA" ||
        element?.tagName === "MD-OUTLINED-TEXT-FIELD"
      ) {
        // Move the cursor to the end of the text
        (element as HTMLInputElement).selectionStart = (
          element as HTMLInputElement
        ).selectionEnd = (element as HTMLInputElement).value.length;
        element.scrollTop = element.scrollHeight - 100;
      } else {
        // For non-text field elements, use scrollTop and scrollHeight to scroll
        element!.scrollTop = element!.scrollHeight;
      }

      setTimeout(() => {
        this.programmaticScroll = false;
      }, 100);
    } else {
      console.error("User scrolled, not scrolling down");
    }
  }

  handleScroll() {
    if (this.disableAutoScroll) {
      return;
    }

    if (
      this.programmaticScroll ||
      (!this.$$(this.scrollElementSelector) && !this.useMainWindowScroll)
    ) {
      return;
    }

    let currentScrollTop = 0;
    if (this.$$(this.scrollElementSelector)) {
      currentScrollTop = this.$$(this.scrollElementSelector)!.scrollTop;
    } else if (this.useMainWindowScroll) {
      currentScrollTop = window.scrollY;
    }

    if (this.scrollStart === 0) {
      // Initial scroll
      this.scrollStart = currentScrollTop;
    }

    const threshold = 10;

    let atBottom;

    if (this.useMainWindowScroll) {
      atBottom =
        this.$$(this.scrollElementSelector)!.scrollHeight -
          currentScrollTop -
          this.$$(this.scrollElementSelector)!.clientHeight <=
        threshold;
    } else if (this.$$(this.scrollElementSelector)) {
      atBottom =
        document.documentElement.scrollHeight -
          currentScrollTop -
          window.innerHeight <=
        threshold;
    }

    if (atBottom) {
      this.userScrolled = false;
      this.scrollStart = 0; // Reset scroll start
    } else if (Math.abs(this.scrollStart - currentScrollTop) > threshold) {
      this.userScrolled = true;
      // Optionally reset scrollStart here if you want to continuously check for threshold scroll
      // this.scrollStart = currentScrollTop;
    }
  }
}
