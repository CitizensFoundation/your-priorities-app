import { css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";

import { MdTabs } from "@material/web/tabs/tabs.js";
import { YpAdminPage } from "./yp-admin-page.js";
import "../yp-moderation/yp-content-moderation.js";
import "../yp-moderation/yp-fraud-management.js";

type YpAdminModerationPage = "flagged" | "all" | "fraud";

@customElement("yp-admin-moderation")
export class YpAdminModeration extends YpAdminPage {
  @property({ type: String })
  selectedPage: YpAdminModerationPage = "flagged";

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
        }

        md-tabs {
          max-width: 100%;
          margin-bottom: 12px;
          background-color: var(--md-sys-color-surface);
        }
      `,
    ];
  }

  get fraudAvailable() {
    const community = this.collection as YpCommunityData | undefined;
    return (
      this.collectionType === "community" &&
      !!community?.configuration?.enableFraudDetection
    );
  }

  get visiblePages(): YpAdminModerationPage[] {
    return this.fraudAvailable
      ? ["flagged", "all", "fraud"]
      : ["flagged", "all"];
  }

  get activeTabIndex() {
    const index = this.visiblePages.indexOf(this.selectedPage);
    return index > -1 ? index : 0;
  }

  private _tabChanged(event: Event) {
    const tabs = event.target as MdTabs;
    this.selectedPage = this.visiblePages[tabs.activeTabIndex] || "flagged";
  }

  private renderContentModeration(
    typeOfModeration: "flagged_content" | "moderate_all_content"
  ) {
    switch (this.collectionType) {
      case "domain":
        return html`
          <yp-content-moderation
            .domainId="${this.collectionId as number}"
            .collectionName="${this.collection?.name}"
            .typeOfModeration="${typeOfModeration}"
          ></yp-content-moderation>
        `;
      case "community":
        return html`
          <yp-content-moderation
            .communityId="${this.collectionId as number}"
            .collectionName="${this.collection?.name}"
            .typeOfModeration="${typeOfModeration}"
          ></yp-content-moderation>
        `;
      case "group":
        return html`
          <yp-content-moderation
            .groupId="${this.collectionId as number}"
            .collectionName="${this.collection?.name}"
            .typeOfModeration="${typeOfModeration}"
          ></yp-content-moderation>
        `;
      default:
        return nothing;
    }
  }

  private renderSelectedPage() {
    if (this.selectedPage === "fraud" && this.fraudAvailable) {
      return html`
        <yp-fraud-management
          .communityId="${this.collectionId as number}"
          .collectionName="${this.collection?.name}"
        ></yp-fraud-management>
      `;
    } else if (this.selectedPage === "all") {
      return this.renderContentModeration("moderate_all_content");
    } else {
      return this.renderContentModeration("flagged_content");
    }
  }

  override render() {
    return html`
      <md-tabs
        @change="${this._tabChanged.bind(this)}"
        .activeTabIndex="${this.activeTabIndex}"
      >
        <md-secondary-tab>${this.t("contentItemsFlagged")}</md-secondary-tab>
        <md-secondary-tab>${this.t("manageAllContent")}</md-secondary-tab>
        ${this.fraudAvailable
          ? html`<md-secondary-tab>${this.t("fraudManagement")}</md-secondary-tab>`
          : nothing}
      </md-tabs>
      ${this.renderSelectedPage()}
    `;
  }
}
