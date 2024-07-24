var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export class PsBaseWithRunningAgentObserver extends YpBaseElement {
    connectedCallback() {
        super.connectedCallback();
        window.psAppGlobals.currentRunningAgentId = window.psAppGlobals.currentRunningAgentId;
        window.psAppGlobals.addCurrentAgentListener(this.handleAgentChange.bind(this));
    }
    disconnectedCallback() {
        window.psAppGlobals.removeCurrentAgentListener(this.handleAgentChange.bind(this));
        super.disconnectedCallback();
    }
    handleAgentChange(currentRunningAgentId) {
        this.currentRunningAgentId = currentRunningAgentId;
    }
}
__decorate([
    property({ type: Number })
], PsBaseWithRunningAgentObserver.prototype, "currentRunningAgentId", void 0);
//# sourceMappingURL=ps-base-with-running-agents.js.map