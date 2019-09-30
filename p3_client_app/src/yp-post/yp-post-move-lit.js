import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypPostMoveBehavior } from './yp-post-move-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostMoveLit extends YpBaseElement {
  static get properties() {
    return {
      action: {
        type: String,
        value: "/api/posts"
      },
  
      post: {
        type: Object
      },
  
      selectedGroupId: {
      Number
      },
    }
  }

  static get styles() {
    return [
      css`

      paper-textarea {
        padding-top: 16px;
      }

      .groupName {
        cursor: pointer;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
      ${this.post ? html`
        <yp-edit-dialog id="editDialog" title="${this.editHeaderText}" icon="language" confirmation-text="${this.t('post.statusChangeConfirmText')}" action="${this.action}" method="${this.method}" params="${this.params}" save-text="${this.saveText}" toast-text="${this.toastText}">
          <template is="dom-repeat" items="${this.availableGroups}" as="group">
            <div class="groupName" on-tap="_selectGroup" data-args="${this.group.id}" data-args-name="${this.group.name}">${this.group.name}</div>
          </template>

          <div class="layout horizontal center-center">
            <yp-ajax method="GET" id="getAvailableGroupsAjax" url="/api/users/available/groups" on-response="_getGroupsResponse"></yp-ajax>
            <yp-ajax method="PUT" id="movePostAjax" on-response="_movePostResponse"></yp-ajax>
          </div>
        </yp-edit-dialog>
` : html``}
`
  }

/* 
  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    AccessHelpers,
    ypPostMoveBehavior
  ],
*/

  _selectGroup(event) {
    this.set('selectedGroupId', event.target.getAttribute('data-args'));
    var groupName = event.target.getAttribute('data-args-name');
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('post.confirmMove')+' "'+this.post.name+'" '+this.t('to')+' "'+groupName+'"', this._reallyMove.bind(this));
    }.bind(this));
  }

  _reallyMove() {
    this.$.movePostAjax.url="/api/posts/"+this.post.id+'/'+this.selectedGroupId+'/move';
    this.$.movePostAjax.body = {};
    this.$.movePostAjax.generateRequest();
  }

  _movePostResponse() {
    location.reload();
  }

  _clear() {
    this.set('selectedGroupId', null);
    this.set('post', null);
  }

  setupAndOpen(post, refreshFunction) {
    this.set('post', post);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
    this.$.getAvailableGroupsAjax.generateRequest();
    this.open();
  }

  _setupTranslation() {
    this.set('editHeaderText', this.t('post.move'));
    this.set('toastText', this.t('post.haveMovedPost'));
    this.set('saveText', this.t('post.move'));
  }
}


window.customElements.define('yp-post-moves-lit', YpPostMoveLit)