import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-user/yp-user-image.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPointCommentLit extends YpBaseElement  {
  static get properties() {
    return {
      point: {
        type: Object,
        notify: true,
        observer: "_pointChanged"
      },

      user: {
        type: Object
      },

      hideUser: {
        type: Boolean,
        value: false
      },

      hasPointAccess: {
        type: Boolean,
        computed: '_hasPointAccess(point, gotAdminRights, loggedInUser)'
      }
    }
  }

  static get styles() {
    return [
      css`

      .userName {
        color: #777;
      }

      yp-user-image {
        padding-top: 16px;
        padding-right: 8px;
      }

      .userName {
        padding-bottom: 4px;
      }

      .comment {
        margin-left: 8px;
        margin-right: 8px;
        padding-bottom: 4px;
        margin-bottom: 8px;
        padding-top: 16px;
      }

      .commentDash {
        border-bottom: dashed #ddd;
        border-bottom-width: 1px;
      }

      yp-point-actions {
        padding-top: 8px;
      }

      #reportPointIconButton {
        color: #ddd;
        width: 36px;
        height: 36px;
      }

      [hidden] {
        display: none !important;
      }

      #deleteButton {
        color: #bbb;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <lite-signal @lite-signal-got-admin-rights="${this_gotAdminRights}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>

    <div class="layout horizontal">
      <div class="layout horizontal">
        <yp-user-image .user="${this.user}"></yp-user-image>
      </div>
      <div class="layout vertical">
        <div class="comment">
          ${this.point.content}
          <div class="layout horizontal" ?hidden="${!this.point}">
            <yp-point-actions .point="${this.point}" .hide-sharing></yp-point-actions>
            <paper-icon-button ?hidden="" ?hidden="${!this.loggedInUser}" title="${this.t('point.report')}" id="reportPointIconButton" .icon="warning" @tap="${this._reportPoint}"></paper-icon-button>

            ${ this.hasPointAccess ? html`
              <div class="layout horizontal self-end" ?hidden="">
                <yp-ajax id="deletePointAjax" .method="DELETE" @response="${this._deleteResponse}"></yp-ajax>
                <paper-icon-button id="deleteButton" .title="${this.t('delete')}" .icon="clear" @tap="${this._deletePoint}"></paper-icon-button>
              </div>
            `: html``}
          </div>
        </div>
      </div>
    </div>
  `
}

/*
  behaviors: [
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypGotAdminRightsBehavior
  ],
*/

  _deletePoint() {
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('point.confirmDelete'), this._reallyDeletePoint.bind(this));
    }.bind(this));
  }

  _reallyDeletePoint() {
    this.$$("#deletePointAjax").url = "/api/points/"+this.point.id;
    this.$$("#deletePointAjax").body = {};
    this.$$("#deletePointAjax").generateRequest();
  }

  _editResponse(event, detail) {
    if (detail.response) {
      this.point = detail.response;
    }
    this.isEditing = false;
  }

  _deleteResponse() {
    this.fire("yp-point-deleted", { pointId: this.point.id });
    this.fire("iron-resize");
    this.point = null;
  }

  _reportPoint() {
    window.appGlobals.activity('open', 'point.report');
    const dialog = dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/points/' + this.point.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('point.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(this.t('point.report')+': '+this.point.content);
  }

  _pointChanged(newValue, oldValue) {
    if (newValue) {
      this.user = this.point.PointRevisions[0].User;
    } else {
      this.user = null;
    }
  }

  _hasPointAccess(point) {
    return this.checkPointAccess(point);
  }

  loginName() {
    return this.point.PointRevisions[0].User.name;
  }
}

window.customElements.define('yp-point-comment-lit', YpPointCommentLit)