import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/progress/circular-progress.js";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-evidence-request-button")
export class YpEvidenceRequestButton extends YpBaseElement {
  @property({ type: String })
  subjectType: "post" | "point" = "post";

  @property({ type: Number })
  subjectId: number | undefined;

  @property({ type: Boolean })
  override hidden = false;

  @property({ type: Boolean })
  deepResearch = false;

  @state()
  private requesting = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-button {
          margin: 8px 0;
        }

        md-circular-progress {
          --md-circular-progress-size: 18px;
        }
      `,
    ];
  }

  override render() {
    if (this.hidden || !this.subjectId) return nothing;

    return html`
      <md-outlined-button
        ?disabled="${this.requesting}"
        @click="${this.requestEvidence}"
      >
        ${this.requesting
          ? html`<md-circular-progress slot="icon" indeterminate></md-circular-progress>`
          : html`<md-icon slot="icon">travel_explore</md-icon>`}
        ${this.deepResearch ? "Deep research" : "Research evidence"}
      </md-outlined-button>
    `;
  }

  private async requestEvidence() {
    if (!this.subjectId || this.requesting) return;

    this.requesting = true;
    try {
      if (this.deepResearch) {
        await window.serverApi.requestDeepEvidenceResearch(
          this.subjectType,
          this.subjectId,
          {}
        );
      } else {
        await window.serverApi.requestEvidenceResearch(
          this.subjectType,
          this.subjectId,
          {}
        );
      }
      this.fireGlobal("yp-evidence-refresh", {
        subjectType: this.subjectType,
        subjectId: this.subjectId,
      });
    } finally {
      this.requesting = false;
    }
  }
}
