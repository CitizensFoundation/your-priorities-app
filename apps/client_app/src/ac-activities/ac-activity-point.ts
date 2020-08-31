import { property, html, css, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import linkifyStr from 'linkifyjs/string.js';

import '@material/mwc-circular-progress-four-color';
import '@material/mwc-dialog';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import '@material/mwc-snackbar';

import '@material/mwc-checkbox';
import '@material/mwc-radio';

import '@material/mwc-formfield';
import { Radio } from '@material/mwc-radio';

import { Checkbox } from '@material/mwc-checkbox';

import { TextField } from '@material/mwc-textfield';
import { YpBaseElementWithLogin } from '../@yrpri/yp-base-element-with-login.js';
import { LitVirtualizer } from 'lit-virtualizer';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';

@customElement('ac-activity-point')
export class AcActivityPoint extends YpBaseElementWithLogin {
  @property({ type: Object })
  activity: AcActivityData | undefined

  @property({ type: Number })
  postId: number | undefined

  static get styles() {
    return [
      super.styles,
      css`

      .pointContainer {
      }
      .point {
        padding: 8px;
        margin: 8px;
      }

      .pointText {
        margin-bottom: 16px;
        padding: 16px;
        width: 360px;
      }

      yp-point {
        margin-bottom: 36px;
      }

      @media (max-width: 480px) {
        yp-point {
          width: 100%;
        }
      }

      .pointLayout {
        width: 46%;
      }

      .postName {
        padding-left: 32px;
        font-weight: bold;
        font-size: 24px;
        padding-bottom: 12px;
      }

      .actionInfo {
        font-size: 22px;
        margin-top: 16px;
        padding-left: 16px;
      }

      .post-name {
        font-size: 26px;
        padding-bottom: 8px;
        margin: 0;
        padding-top: 0;
        margin-top: 8px;
        margin-left: 24px;
      }

      .withCursor {
        cursor: pointer;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical pointContainer">
      <div class="actionInfo withCursor" ?hidden="${!this._isUpVote(activity.Point)}" @tap="${this._goToPoint}">
        ${this.t('point.forAdded')}...
      </div>
      <div class="actionInfo withCursor" ?hidden="${!this._isDownVote(activity.Point)}" @tap="${this._goToPoint}">
        ${this.t('point.againstAdded')}...
      </div>
      <div class="layout vertical">
        <yp-magic-text class="post-name withCursor" @tap="${this._goToPoint}" .textOnly .textType="postName" .contentLanguage="${this.activity.Post.language}" .content="${this.activity.Post.name}" .contentId="${this.activity.Post.id}">
        </yp-magic-text>
        <yp-point ?hideUser .linkPoint="${!this.postId}" class="card" .point="${this.activity.Point}"></yp-point>
      </div>
    </div>
`
  }

/*
  behaviors: [
    ypGotoBehavior
  ],
*/

  _goToPoint() {
    if (!this.postId && this.activity) {
      YpNavHelpers.goToPost(this.activity.Post.id, this.activity.Point.id, this.activity)
    }
  }

  get isUpVote() {
    return this.point && this.point.value > 0;
  }

  get isDownVote() {
    return this.point && this.point.value < 0;
  }
}
