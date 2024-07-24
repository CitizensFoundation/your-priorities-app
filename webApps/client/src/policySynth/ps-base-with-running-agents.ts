import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";

export class PsBaseWithRunningAgentObserver extends YpBaseElement {
  @property({ type: Number })
  currentRunningAgentId: number | undefined = window.psAppGlobals.currentRunningAgentId;

  override connectedCallback(): void {
    super.connectedCallback();
    window.psAppGlobals.addCurrentAgentListener(this.handleAgentChange.bind(this));
  }

  override disconnectedCallback(): void {
    window.psAppGlobals.removeCurrentAgentListener(this.handleAgentChange.bind(this));
    super.disconnectedCallback();
  }

  handleAgentChange(currentRunningAgentId: number | undefined) {
    this.currentRunningAgentId = currentRunningAgentId;
  }
}

