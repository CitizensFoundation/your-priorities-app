import { html, css, nothing, PropertyValues } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/iconbutton/outlined-icon-button.js";

import { removeClass } from "../common/RemoveClass.js";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-point-actions")
export class YpPointActions extends YpBaseElement {
  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: Boolean })
  hideNotHelpful = false;

  @property({ type: Boolean })
  isUpVoted = false;

  @property({ type: Boolean })
  isDownVoted = false;

  @property({ type: Boolean })
  allDisabled = false;

  @property({ type: Boolean })
  hideSharing = false;

  @property({ type: Object })
  configuration: YpGroupConfiguration | undefined;

  @property({ type: Number })
  pointQualityValue: number | undefined;

  @property({ type: String })
  pointUrl: string | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          min-width: 125px;
        }

        .action-text {
          font-size: 16px;
          padding-top: 8px;
          padding-left: 6px;
        }

        md-icon-button[down-voted] {
          --md-sys-color-primary: var(--yp-sys-color-down);
        }

        md-icon-button[up-voted] {
          --md-sys-color-primary: var(--yp-sys-color-up);
        }

        .action-up {
        }

        .action-down {
        }

        .up-selected {
        }

        .down-selected {
        }

        .middle {
        }

        .all-actions {
          padding-right: 8px;
          margin-top: 8px;
        }

        yp-ajax {
          min-width: 32px;
        }

        .myButton {
          --md-outlined-icon-button {
            width: 10px;
            height: 10px;
          }
        }

        .shareIcon {
          text-align: right;
        }

        .shareIcon[up-voted] {
        }

        [hidden] {
          display: none !important;
        }

        .point-down-vote-icon {
          margin-left: 16px;
        }
      `,
    ];
  }

  override render() {
    return this.point
      ? html`
          <div
            class="all-actions layout horizontal center-center"
            ?hidden="${this.hideNotHelpful}"
          >
            <div id="actionUp" class="actionUp layout horizontal">
              <md-icon-button
                toggle
                ?selected="${this.pointQualityValue
                  ? this.pointQualityValue > 0
                  : false}"
                .label="${this.t("point.helpful")}"
                ?disabled="${this.allDisabled}"
                up-voted="${this.isUpVoted}"
                icon="arrow_upward"
                class="point-up-vote-icon myButton"
                @click="${this.pointHelpful}"
                ><md-icon>arrow_upward</md-icon></md-icon-button
              >
              <div class="action-text action-up layouthorizontal ">
                ${this.point.counter_quality_up}
              </div>
            </div>
            <div id="actionDown" class="actionDown layout horizontal">
              <md-icon-button
                toggle
                ?selected="${this.pointQualityValue
                  ? this.pointQualityValue < 0
                  : false}"
                .label="${this.t("point.not_helpful")}"
                down-voted="${this.isDownVoted}"
                ?disabled="${this.allDisabled}"
                icon="arrow_downward"
                class="point-down-vote-icon myButton"
                @click="${this.pointNotHelpful}"
                ><md-icon>arrow_downward</md-icon></md-icon-button
              >
              <div class="action-text">${this.point.counter_quality_down}</div>
            </div>
          </div>
        `
      : nothing;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateQualitiesFromSignal.bind(this)
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-got-endorsements-and-qualities",
      this._updateQualitiesFromSignal.bind(this)
    );
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._updateQualities();
  }

  get masterHideSharing() {
    return (
      this.hideSharing || (this.configuration && this.configuration.hideSharing)
    );
  }

  _sharedContent(event: CustomEvent) {
    const shareData = event.detail;
    window.appGlobals.activity(
      "pointShared",
      shareData.social,
      this.point ? this.point.id : -1
    );
  }

  _shareTap(event: CustomEvent) {
    const detail = event.detail;
    window.appGlobals.activity(
      "pointShareHeaderOpen",
      detail.brand,
      this.point ? this.point.id : -1
    );

    window.appDialogs.getDialogAsync(
      "shareDialog",
      (dialog: YpShareDialogData) => {
        dialog.open(
          this.pointUrl || "",
          this.t("sharePoint"),
          "",
          this._sharedContent
        );
      }
    );
  }

  _onPointChanged() {
    if (this.point) {
      this._updateQualities();
    } else {
      this.isUpVoted = false;
      this.isDownVoted = false;
    }
  }

  _updateQualitiesFromSignal() {
    this._updateQualities();
  }

  _updateQualities() {
    if (
      this.point &&
      window.appUser &&
      window.appUser.loggedIn() &&
      window.appUser.user &&
      window.appUser.user.PointQualities
    ) {
      this.isUpVoted = false;
      this.isDownVoted = false;
      const thisPointQuality =
        window.appUser.pointQualitiesIndex[this.point.id];
      if (thisPointQuality) {
        this._setPointQuality(thisPointQuality.value);
        if (thisPointQuality.value > 0) {
          this.isUpVoted = true;
        } else if (thisPointQuality.value < 0) {
          this.isDownVoted = true;
        }
      } else {
        this.isUpVoted = false;
        this.isDownVoted = false;
        this._setPointQuality(undefined);
      }
    } else {
      this.isUpVoted = false;
      this.isDownVoted = false;
      this._setPointQuality(undefined);
    }
  }

  _qualityChanged() {
    // TODO: Fix where you can't vote up a newstory just after posting
    //this._resetClasses();
    //this.isUpVoted = false;
  }

  _resetClasses() {
    if (this.pointQualityValue && this.pointQualityValue > 0) {
      (this.$$("#actionUp") as HTMLElement).className += " " + "up-selected";
      removeClass(this.$$("#actionDown") as HTMLElement, "down-selected");
    } else if (this.pointQualityValue && this.pointQualityValue < 0) {
      (this.$$("#actionDown") as HTMLElement).className +=
        " " + "down-selected";
      removeClass(this.$$("#actionUp") as HTMLElement, "up-selected");
    } else {
      removeClass(this.$$("#actionUp") as HTMLElement, "up-selected");
      removeClass(this.$$("#actionDown") as HTMLElement, "down-selected");
    }
  }

  _setPointQuality(value: number | undefined) {
    this.pointQualityValue = value;
    this._resetClasses();
  }

  async generatePointQuality(value: number) {
    if (this.point && window.appUser.loggedIn() === true) {
      let method;
      if (this.pointQualityValue === value) {
        method = "DELETE";
      } else {
        method = "POST";
      }
      const pointQuality = (await window.serverApi.setPointQuality(
        this.point.id,
        method,
        {
          point_id: this.point.id,
          value: value,
        }
      )) as YpPointQualityResponse;
      this._pointQualityResponse(pointQuality);
    } else {
      this.allDisabled = false;
      window.appUser.loginForPointQuality(this, { value: value });
    }
  }

  _pointQualityResponse(pointQualityResponse: YpPointQualityResponse) {
    this.allDisabled = false;
    const pointQuality = pointQualityResponse.pointQuality;
    const oldPointQualityValue = pointQualityResponse.oldPointQualityValue;
    this._setPointQuality(pointQuality.value);
    window.appUser.updatePointQualityForPost(this.point!.id, pointQuality);

    if (this.point!.counter_quality_up === undefined)
      this.point!.counter_quality_up = 0;

    if (this.point!.counter_quality_down === undefined)
      this.point!.counter_quality_down = 0;

    if (oldPointQualityValue) {
      if (oldPointQualityValue > 0)
        this.point!.counter_quality_up = Math.max(
          0,
          this.point!.counter_quality_up - 1
        );
      else if (oldPointQualityValue < 0)
        this.point!.counter_quality_down = Math.max(
          this.point!.counter_quality_down - 1
        );
    }
    if (pointQuality.value > 0)
      this.point!.counter_quality_up = this.point!.counter_quality_up + 1;
    else if (pointQuality.value < 0)
      this.point!.counter_quality_down = this.point!.counter_quality_down + 1;

    this.fire("changed");

    this.requestUpdate();
  }

  generatePointQualityFromLogin(value: number) {
    if (this.point && !window.appUser.pointQualitiesIndex[this.point.id]) {
      this.generatePointQuality(value);
    }
  }

  pointHelpful() {
    this.allDisabled = true;
    this.generatePointQuality(1);
    this.isUpVoted = true;
    this.requestUpdate;
    window.appGlobals.activity("clicked", "pointHelpful", this.point!.id);
  }

  pointNotHelpful() {
    this.allDisabled = true;
    window.appGlobals.activity("clicked", "pointNotHelpful", this.point!.id);
    this.isDownVoted = true;
    this.generatePointQuality(-1);
    this.requestUpdate;
  }
}
