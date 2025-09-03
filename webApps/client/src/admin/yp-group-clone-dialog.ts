import { html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/dialog/dialog.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/button/text-button.js";

import type { Dialog } from "@material/web/dialog/internal/dialog.js";

@customElement("yp-group-clone-dialog")
export class YpGroupCloneDialog extends YpBaseElement {
  @property({ type: Array })
  communities: YpCommunityData[] | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @state()
  private selectedCommunityId: number | undefined;

  @state()
  private cloning = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-select {
          width: 100%;
        }
      `,
    ];
  }

  setup(
    groupId: number,
    communities: YpCommunityData[],
    currentCommunityId: number
  ) {
    this.groupId = groupId;
    this.communities = communities;
    this.selectedCommunityId =
      communities.find((c) => c.id === currentCommunityId)?.id ||
      communities[0]?.id;
  }

  async open() {
    await this.updateComplete;
    (this.$$("#cloneDialog") as Dialog).show();
  }

  private _onSelected(e: CustomEvent) {
    const index = (e.target as any).selectedIndex;
    if (this.communities) {
      this.selectedCommunityId = this.communities[index].id;
    }
  }

  private async _clone() {
    if (!this.groupId || !this.selectedCommunityId) return;
    this.cloning = true;
    try {
      const newGroup = (await window.serverApi.apiAction(
        `/api/groups/${this.groupId}/cloneToCommunity/${this.selectedCommunityId}`,
        "POST",
        {}
      )) as YpGroupData;
      window.location.href = `/group/${newGroup.id}`;
    } catch (err) {
      console.error("Clone to community failed", err);
    } finally {
      this.cloning = false;
      (this.$$("#cloneDialog") as Dialog).close();
    }
  }

  override render() {
    return html`
      <md-dialog id="cloneDialog">
        <div slot="content">
          <md-outlined-select
            .label="${this.t("selectCommunity")}"
            @selected="${this._onSelected}"
          >
            ${this.communities?.map(
              (c) => html`<md-select-option
                ?selected="${c.id === this.selectedCommunityId}"
                >${c.name}</md-select-option
              >`
            )}
          </md-outlined-select>
        </div>
        <div slot="actions">
          <md-text-button dialogAction="cancel">
            ${this.t("cancel")}
          </md-text-button>
          <md-text-button
            ?disabled="${
              this.cloning ||
              !this.selectedCommunityId ||
              !this.communities ||
              this.communities.length === 0
            }"
            @click="${this._clone}"
            >${this.t("clone")}</md-text-button
          >
        </div>
      </md-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "yp-group-clone-dialog": YpGroupCloneDialog;
  }
}

