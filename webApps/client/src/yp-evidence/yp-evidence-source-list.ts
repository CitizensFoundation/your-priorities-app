import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/icon/icon.js";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-evidence-source-list")
export class YpEvidenceSourceList extends YpBaseElement {
  @property({ type: Object })
  bundle: YpEvidenceBundleData | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        .sourceList {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .source {
          border: 1px solid var(--md-sys-color-outline-variant);
          border-radius: 6px;
          padding: 10px 12px;
          background: var(--md-sys-color-surface-container-lowest);
        }

        .sourceHeader {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 8px;
          align-items: center;
        }

        .citation {
          font-weight: 700;
          color: var(--md-sys-color-primary);
        }

        .title {
          font-size: 14px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }

        .publisher {
          color: var(--md-sys-color-on-surface-variant);
          font-size: 12px;
          margin-top: 4px;
        }

        a {
          color: var(--md-sys-color-primary);
          text-decoration: none;
        }

        md-icon {
          color: var(--md-sys-color-on-surface-variant);
          font-size: 18px;
        }
      `,
    ];
  }

  override render() {
    const highlights = this.bundle?.source_highlights || [];
    const bundleSources = this.bundle?.BundleSources || [];

    if (highlights.length === 0 && bundleSources.length === 0) {
      return nothing;
    }

    return html`
      <div class="sourceList">
        ${highlights.length > 0
          ? highlights.map((source) => this.renderSourceHighlight(source))
          : bundleSources.map((source) => this.renderBundleSource(source))}
      </div>
    `;
  }

  private renderSourceHighlight(source: YpEvidenceSourceHighlightData) {
    return html`
      <div class="source">
        <div class="sourceHeader">
          <div class="citation">${source.citation_label}</div>
          <div>
            <div class="title">
              ${source.url
                ? html`<a href="${source.url}" target="_blank" rel="noopener"
                    >${source.title || source.url}</a
                  >`
                : source.title || "Source"}
            </div>
            <div class="publisher" ?hidden="${!source.publisher}">
              ${source.publisher}
            </div>
          </div>
          <md-icon>open_in_new</md-icon>
        </div>
      </div>
    `;
  }

  private renderBundleSource(source: YpEvidenceBundleSourceData) {
    const data = source.Source;
    return html`
      <div class="source">
        <div class="sourceHeader">
          <div class="citation">${source.citation_label}</div>
          <div>
            <div class="title">
              ${data?.canonical_url
                ? html`<a
                    href="${data.canonical_url}"
                    target="_blank"
                    rel="noopener"
                    >${data.title || data.canonical_url}</a
                  >`
                : data?.title || "Source"}
            </div>
            <div class="publisher" ?hidden="${!data?.publisher}">
              ${data?.publisher}
            </div>
          </div>
          <md-icon>open_in_new</md-icon>
        </div>
      </div>
    `;
  }
}
