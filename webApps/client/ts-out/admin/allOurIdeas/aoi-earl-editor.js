var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { customElement, property } from "lit/decorators";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base";
let AoiEarlEditor = class AoiEarlEditor extends YpStreamingLlmBase {
};
__decorate([
    property({ type: Object })
], AoiEarlEditor.prototype, "earlConfiguration", void 0);
AoiEarlEditor = __decorate([
    customElement('aoi-earl-editor')
], AoiEarlEditor);
export { AoiEarlEditor };
//# sourceMappingURL=aoi-earl-editor.js.map