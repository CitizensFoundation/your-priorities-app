import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
//TODO: import 'paper-share-button/paper-share-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypRemoveClassBehavior } from '../yp-behaviors/yp-remove-class-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPointActionsLit extends YpBaseElement {
  static get properties() {
    return {
      point: {
        type: Object,
        observer: "_onPointChanged"
      },

      hideNotHelpful: {
        type: Boolean,
        value: false
      },

      pointQualityValue: {
        type: Number,
        value: 0
      },

      isUpVoted: {
        type: Boolean,
        value: false
      },

      allDisabled: {
        type: Boolean,
        value: false
      },

      pointUrl: {
        type: String
      },

      hideSharing: {
        type: Boolean,
        value: false
      },

      allowWhatsAppSharing: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        min-width: 125px;
      }

      .action-text {
        font-size: 12px;
        padding-top: 12px;
      }

      .action-up {

      }

      .action-down {

      }

      .up-selected {
        color: #444;
      }

      .down-selected {
        color: #444;
      }

      .middle {

      }

      .all-actions {
        color: #aaa;
        padding-right: 8px;
      }

      yp-ajax {
        min-width: 32px;
      }

      .myButton {
      --paper-icon-button {
        width: 10px;
        height: 10px;
      }
      }

      .shareIcon {
        --paper-share-button-icon-color: #ddd;
        text-align: right;
      }

      .shareIcon[up-voted] {
        --paper-share-button-icon-color: var(--accent-color-400);
      }

      [hidden] {
        display: none !important;
      }
  `, YpFlexLayout0]
  }

  render() {
    return html`
      <div class="all-actions layout horizontal flex start-justified" ?hidden="${this.hideNotHelpful}">
        <div id="actionUp" class="actionUp layout horizontal">
          <paper-icon-button .title="${this.t('point.helpful')}" ?disabled="${this.allDisabled}" .icon="arrow-upward" class="point-up-vote-icon myButton" @tap="${this.pointHelpful}"></paper-icon-button>
          <div class="action-text action-up layouthorizontal ">${this.point.counter_quality_up}</div>
        </div>
        <div id="actionDown" class="actionDown layout horizontal">
          <paper-icon-button .title="${this.t('point.not_helpful')}" ?disabled="${this.allDisabled}" .icon="arrow-downward" class="point-down-vote-icon myButton" @tap="${this.pointNotHelpful}"></paper-icon-button>
          <div class="action-text">${this.point.counter_quality_down}</div>
        </div>
      </div>
      <paper-share-button ?hidden="${this.hideSharing}" @share-tap="${this._shareTap}" class="shareIcon" up-voted="${this.isUpVoted}" horizontal-align="right" id="shareButton"
        title="${this.t('sharePoint')}" facebook email twitter popup .url="${this.pointUrl}"
        ?whatsapp="${this.allowWhatsAppSharing}">
      </paper-share-button>

      <yp-ajax id="pointQualityAjax" .method="POST" @response="${this._pointQualityResponse}"></yp-ajax>
      <lite-signal @lite-signal-got-endorsements-and-qualities="${this._updateQualitiesFromSignal}"></lite-signal>
    `;
  }

/*
  behaviors: [
    ypRemoveClassBehavior
  ],


  observers: [
    '_qualityChanged(point.counter_quality_up, point.counter_quality_down)'
  ],
*/
  _onPointChanged(newValue, oldValue) {
    if (newValue) {
      this._updateQualities();
    } else {
      this.isUpVoted = false;
    }
  }

  _updateQualitiesFromSignal() {
    this._updateQualities();
  }

  _updateQualities() {
    if (window.appUser && window.appUser.loggedIn() && window.appUser.user && window.appUser.user.PointQualities) {
      const thisPointQuality = window.appUser.pointQualitiesIndex[this.point.id];
      if (thisPointQuality) {
        this._setPointQuality(thisPointQuality.value);
        if (thisPointQuality.value>0) {
          this.isUpVoted = true;
        }
      } else {
        this.isUpVoted = false;
        this._setPointQuality(null);
      }
    } else {
      this.isUpVoted = false;
      this._setPointQuality(null);
    }
  }

  _qualityChanged(a, b) {
    // TODO: Fix where you can't vote up a newstory just after posting
    //this._resetClasses();
    //this.isUpVoted = false;
  }

  _resetClasses() {
    if (this.pointQualityValue && this.pointQualityValue > 0) {
      this.$$("#actionUp").className += " " + "up-selected";
      this.removeClass(this.$$("#actionDown"), "down-selected");
    } else if (this.pointQualityValue && this.pointQualityValue < 0) {
      this.$$("#actionDown").className += " " + "down-selected";
      this.removeClass(this.$$("#actionUp"),"up-selected");
    } else {
      this.removeClass(this.$$("#actionUp"),"up-selected");
      this.removeClass(this.$$("#actionDown"), "down-selected");
    }
  }

  _setPointQuality(value) {
    this.pointQualityValue = value;
    this._resetClasses();
  }

  _pointQualityResponse(event, detail) {
    this.allDisabled = false;
    const pointQuality = detail.response.pointQuality;
    const oldPointQualityValue = detail.response.oldPointQualityValue;
    this._setPointQuality(pointQuality.value);
    window.appUser.updatePointQualityForPost(this.point.id, pointQuality);
    if (oldPointQualityValue) {
      if (oldPointQualityValue>0)
        this.point.counter_quality_up = this.point.counter_quality_up-1;
      else if (oldPointQualityValue<0)
        this.point.counter_quality_down = this.point.counter_quality_down-1;
    }
    if (pointQuality.value>0)
      this.point.counter_quality_up = this.point.counter_quality_up+1;
    else if (pointQuality.value<0)
      this.point.counter_quality_down = this.point.counter_quality_down+1; 
  }

  generatePointQualityFromLogin(value) {
    if (!window.appUser.pointQualitiesIndex[this.point.id]) {
      this.generatePointQuality(value);
    }
  }

  generatePointQuality(value) {
    if (window.appUser.loggedIn()===true) {
      this.$$("#pointQualityAjax").url = "/api/points/" + this.point.id + "/pointQuality";
      this.$$("#pointQualityAjax").body = { point_id: this.point.id, value: value };
      if (this.pointQualityValue === value) {
        this.$$("#pointQualityAjax").method = "DELETE";
      } else {
        this.$$("#pointQualityAjax").method = "POST";
      }
      this.$$("#pointQualityAjax").generateRequest();
    } else {
      this.allDisabled = false;
      window.appUser.loginForPointQuality(this, { value: value } );
    }
  }

  pointHelpful() {
    this.allDisabled = true;
    this.generatePointQuality(1);
    this.isUpVoted = true;
    this.updateStyles();
    window.appGlobals.activity('clicked', 'pointHelpful', this.point.id);
  }

  pointNotHelpful() {
    this.allDisabled = true;
    window.appGlobals.activity('clicked', 'pointNotHelpful', this.point.id);
    this.generatePointQuality(-1);
  }
}

window.customElements.define('yp-point-actions-lit', YpPointActionsLit)