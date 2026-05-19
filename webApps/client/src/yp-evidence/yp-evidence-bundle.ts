import { css, html, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/button/outlined-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/icon/icon.js";
import "@material/web/progress/linear-progress.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-evidence-source-list.js";

@customElement("yp-evidence-bundle")
export class YpEvidenceBundle extends YpBaseElement {
  @property({ type: String })
  subjectType: "post" | "point" = "post";

  @property({ type: Number })
  subjectId: number | undefined;

  @property({ type: Boolean })
  compact = false;

  @property({ type: Boolean })
  canReview = false;

  @state()
  private bundles: YpEvidenceBundleData[] = [];

  @state()
  private loading = false;

  @state()
  private hasLoaded = false;

  private observer: IntersectionObserver | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        .bundle {
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          background: var(--md-sys-color-surface-container-low);
          color: var(--md-sys-color-on-surface);
        }

        .bundle[compact] {
          padding: 12px;
          margin: 12px 0 4px;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title {
          font-weight: 700;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .status {
          margin-left: auto;
          color: var(--md-sys-color-on-secondary-container);
          background: var(--md-sys-color-secondary-container);
          border-radius: 999px;
          font-size: 12px;
          padding: 2px 8px;
          white-space: nowrap;
        }

        .analysis {
          margin-top: 12px;
          line-height: 1.5;
          font-size: 14px;
        }

        .deepMetrics {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
          color: var(--md-sys-color-on-tertiary-container);
        }

        .metric {
          background: var(--md-sys-color-tertiary-container);
          border-radius: 999px;
          font-size: 12px;
          padding: 3px 8px;
        }

        .sectionTitle {
          margin-top: 14px;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 700;
          color: var(--md-sys-color-on-surface-variant);
        }

        ul {
          margin: 0;
          padding-left: 18px;
        }

        li {
          margin: 4px 0;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        md-linear-progress {
          margin: 8px 0;
        }
      `,
    ];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener("yp-evidence-refresh", this.onEvidenceRefresh);
    this.startVisibilityObserver();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-evidence-refresh", this.onEvidenceRefresh);
    this.observer?.disconnect();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (
      changedProperties.has("subjectId") ||
      changedProperties.has("subjectType")
    ) {
      this.bundles = [];
      this.hasLoaded = false;
      this.startVisibilityObserver();
    }
  }

  override render() {
    if (this.loading && !this.hasLoaded) {
      return html`<md-linear-progress indeterminate></md-linear-progress>`;
    }

    if (this.bundles.length === 0) {
      return nothing;
    }

    return html`${this.bundles.map((bundle) => this.renderBundle(bundle))}`;
  }

  private renderBundle(bundle: YpEvidenceBundleData): TemplateResult {
    return html`
      <div class="bundle" ?compact="${this.compact}">
        <div class="header">
          <md-icon>fact_check</md-icon>
          <div class="title">${bundle.question_or_claim}</div>
          <div class="status">${this.statusLabel(bundle.status)}</div>
        </div>
        <div class="analysis" ?hidden="${!bundle.short_analysis}">
          ${bundle.short_analysis}
        </div>
        ${this.renderDeepResearchMetrics(bundle)}
        ${this.compact
          ? nothing
          : html`
              ${this.renderList("Key findings", bundle.key_findings)}
              ${this.renderList("Uncertainties", bundle.uncertainties)}
              ${this.renderList("Missing data", bundle.missing_data)}
            `}
        <yp-evidence-source-list .bundle="${bundle}"></yp-evidence-source-list>
        ${this.renderReviewActions(bundle)}
      </div>
    `;
  }

  private renderList(title: string, items: string[]) {
    if (!items || items.length === 0) return nothing;

    return html`
      <div class="sectionTitle">${title}</div>
      <ul>
        ${items.map((item) => html`<li>${item}</li>`)}
      </ul>
    `;
  }

  private renderDeepResearchMetrics(bundle: YpEvidenceBundleData) {
    const deepResearch = bundle.metadata?.deepResearch as
      | YpEvidenceResearchRunData["metrics"]
      | undefined;
    if (!deepResearch) return nothing;

    return html`
      <div class="deepMetrics">
        <span class="metric">${deepResearch.generationCount || 0} generations</span>
        <span class="metric">${deepResearch.queryCount || 0} queries</span>
        <span class="metric">${deepResearch.candidateCount || 0} candidates</span>
        <span class="metric">${deepResearch.comparisonCount || 0} pairwise votes</span>
        <span class="metric">${deepResearch.selectedCount || 0} selected</span>
      </div>
    `;
  }

  private renderReviewActions(bundle: YpEvidenceBundleData) {
    if (!this.canReview || !bundle.group_id || bundle.status === "published") {
      return nothing;
    }

    return html`
      <div class="actions">
        <md-filled-tonal-button @click="${() => this.publishBundle(bundle)}">
          <md-icon slot="icon">publish</md-icon>
          Publish
        </md-filled-tonal-button>
        <md-outlined-button @click="${() => this.synthesizeBundle(bundle)}">
          <md-icon slot="icon">auto_awesome</md-icon>
          Refresh analysis
        </md-outlined-button>
        <md-outlined-button @click="${() => this.archiveBundle(bundle)}">
          <md-icon slot="icon">archive</md-icon>
          Archive
        </md-outlined-button>
      </div>
    `;
  }

  private async loadBundles() {
    if (!this.subjectId || this.loading) return;

    this.loading = true;
    try {
      const bundles = (await window.serverApi.getEvidenceBundles(
        this.subjectType,
        this.subjectId
      )) as YpEvidenceBundleData[];
      this.bundles = bundles || [];
      this.hasLoaded = true;
    } finally {
      this.loading = false;
    }
  }

  private startVisibilityObserver() {
    this.observer?.disconnect();
    if (!this.subjectId || this.hasLoaded) return;

    if (!("IntersectionObserver" in window)) {
      this.loadBundles();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.observer?.disconnect();
        this.loadBundles();
      }
    });
    this.observer.observe(this);
  }

  private onEvidenceRefresh = (event: CustomEvent) => {
    const detail = event.detail || {};
    if (
      detail.subjectType === this.subjectType &&
      detail.subjectId === this.subjectId
    ) {
      this.loadBundles();
    }
  };

  private async publishBundle(bundle: YpEvidenceBundleData) {
    if (!bundle.group_id) return;
    await window.serverApi.publishEvidenceBundle(bundle.group_id, bundle.id);
    this.loadBundles();
  }

  private async synthesizeBundle(bundle: YpEvidenceBundleData) {
    if (!bundle.group_id) return;
    await window.serverApi.synthesizeEvidenceBundle(bundle.group_id, bundle.id);
    this.loadBundles();
  }

  private async archiveBundle(bundle: YpEvidenceBundleData) {
    if (!bundle.group_id) return;
    await window.serverApi.archiveEvidenceBundle(bundle.group_id, bundle.id);
    this.loadBundles();
  }

  private statusLabel(status: YpEvidenceBundleStatus) {
    return status.replace("_", " ");
  }
}
