import { css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/button/outlined-button.js";
import "@material/web/icon/icon.js";
import "@material/web/progress/linear-progress.js";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-consultation-info-portal")
export class YpConsultationInfoPortal extends YpBaseElement {
  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Boolean })
  isAdmin = false;

  @state()
  private portal: YpEvidencePortalAnalysisData | undefined;

  @state()
  private loading = false;

  @state()
  private analyzing = false;

  static override get styles() {
    return [
      super.styles,
      css`
        .portal {
          max-width: 960px;
          width: calc(100% - 32px);
          margin: 24px auto 64px;
        }

        .topRow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.2;
        }

        .summary {
          color: var(--md-sys-color-on-surface-variant);
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .themes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }

        .theme {
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 8px;
          padding: 16px;
          background: var(--md-sys-color-surface-container-low);
          min-height: 150px;
        }

        .themeImage {
          width: 100%;
          aspect-ratio: 16 / 7;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .themeIcon {
          color: var(--md-sys-color-primary);
          margin-bottom: 8px;
        }

        .themeTitle {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .themeSummary {
          line-height: 1.45;
          font-size: 14px;
        }

        .debateLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }

        .debateLinks a {
          color: var(--md-sys-color-primary);
          font-size: 13px;
          text-decoration: none;
        }
      `,
    ];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.loadPortal();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("groupId")) {
      this.loadPortal();
    }
  }

  override render() {
    if (this.loading) {
      return html`<md-linear-progress indeterminate></md-linear-progress>`;
    }

    if (!this.portal) return nothing;

    return html`
      <div class="portal">
        <div class="topRow">
          <h2>${this.portal.title || "Evidence and context"}</h2>
          <div class="flex"></div>
          ${this.isAdmin
            ? html`<md-outlined-button
                ?disabled="${this.analyzing}"
                @click="${this.analyzePortal}"
              >
                <md-icon slot="icon">auto_awesome</md-icon>
                Update analysis
              </md-outlined-button>`
            : nothing}
        </div>
        <div class="summary">${this.portal.short_analysis}</div>
        <div class="themes">
          ${(this.portal.theme_summaries || []).map((theme) =>
            this.renderTheme(theme)
          )}
        </div>
      </div>
    `;
  }

  private renderTheme(theme: YpEvidencePortalThemeData) {
    return html`
      <div class="theme">
        ${theme.imageUrl
          ? html`<img class="themeImage" src="${theme.imageUrl}" alt="" />`
          : html`<md-icon class="themeIcon">hub</md-icon>`}
        <div class="themeTitle">${theme.title}</div>
        <div class="themeSummary">${theme.summary}</div>
        <div class="debateLinks">
          ${(theme.connectedDebate || []).slice(0, 4).map((item) =>
            item.url
              ? html`<a href="${item.url}">${item.title || "Debate"}</a>`
              : nothing
          )}
        </div>
      </div>
    `;
  }

  private async loadPortal() {
    if (!this.groupId) return;

    this.loading = true;
    try {
      this.portal = (await window.serverApi.getEvidencePortal(
        this.groupId
      )) as YpEvidencePortalAnalysisData;
    } finally {
      this.loading = false;
    }
  }

  private async analyzePortal() {
    if (!this.groupId) return;

    this.analyzing = true;
    try {
      await window.serverApi.analyzeEvidencePortal(this.groupId);
    } finally {
      this.analyzing = false;
    }
  }
}
