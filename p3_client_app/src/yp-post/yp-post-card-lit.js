import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-post-actions.js';
import './yp-post-cover-media.js';
import { YpPostBehavior } from './yp-post-behaviors.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostCardLit extends YpBaseElement {
  static get properties() {
    return {
      hideDescription: {
        type: Boolean,
        computed: '_hideDescription(mini, post)'
      },
  
      selectedMenuItem: {
        type: String
      },
  
      elevation: {
        type: Number,
        value: 2
      },
  
      post: {
        type: Object,
        observer: '_postChanged'
      },
  
      hasPostAccess: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_hasPostAccess(post, gotAdminRights)'
      },
  
      mini: {
        type: Boolean,
        value: false
      },
  
      isAudioCover: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return[
      css`

      .card-actions {
      }

      .post-name {
        margin:0 ;
        font-size: var(--extra-large-heading-size, 28px);
        background-color: var(--primary-color-600);
        color: #FFF;
        padding: 15px;
        cursor: pointer;
        vertical-align: middle !important;
        font-weight: bold;
      }

      .postNameContainer {
        width: 100%;
      }

      .postCardCursor {
        cursor: pointer;
      }

      .postCard {
        background-color: #fff;
      }

      :host {
        display: block;
      }

      .postCard {
        height: 435px;
        width: 416px;
      }

      .postCard[hide-post-cover] {
        height: 190px;
      }

      .postCard[hide-post-cover][hide-actions] {
        height: 165px;
      }

      .postCard[hide-post-cover][hide-description] {
        height: 140px;
      }

      .postCard[hide-description] {
        height: 372px;
      }

      .postCard[hide-description][hide-actions] {
        height: 311px;
      }

      .postCard[hide-description][hide-post-cover][hide-actions] {
        height: 77px;
      }

      .postCard[hide-actions] {
        height: 402px;
      }

      .postCard[mini] {
        width: 210px;
        height: 100%;
        margin: 0;
        padding-top: 0;
      }

      yp-post-cover-media {
        width: 416px;
        height: 234px;
      }

      yp-post-cover-media[mini] {
        width: 210px;
        height: 118px;
        min-height: 118px;
      }

      .post-name {
        font-size: 23px;
      }

      .post-name[mini] {
        padding: 16px;
      }

      .description {
        font-size: 18px;
        padding: 8px;
        cursor: pointer;
      }

      .postActions  {
        position: absolute;
        right: 11px;
        bottom: 2px;
      }

      @media (max-width: 960px) {
        :host {
          width: 100%;
          max-width: 423px;
        }

        .postCard {
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          height: 100%;
        }

        .postCard[mini] {
          width: 210px;
          height: 100%;
        }

        .card {
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          height: 100%;
        }

        .card[mini] {
          width: 210px;
          height: 100%;
        }

        .postActions  {
          bottom: 0;
          right: 8px;
        }

        yp-post-cover-media {
          width: 100%;
          height: 230px;
        }

        yp-post-cover-media[mini] {
          width: 210px;
          height: 118px;
          min-height: 118px;
        }

        .card {
          height: 100%;
          padding-bottom: 48px;
        }

        .postCard {
          height: 100% !important;
        }

        yp-post-cover-media[audio-cover] {
          width: 100%;
          height: 100px;
        }
      }

      @media (max-width: 420px) {
        yp-post-cover-media {
          height: 225px;
        }
        yp-post-cover-media[audio-cover] {
          height: 100px;
        }
      }

      @media (max-width: 375px) {
        yp-post-cover-media {
          height: 207px;
        }
        yp-post-cover-media[audio-cover] {
          height: 100px;
        }
      }

      @media (max-width: 360px) {
        yp-post-cover-media {
          height: 200px;
        }
        yp-post-cover-media[audio-cover] {
          height: 90px;
        }
      }

      @media (max-width: 320px) {
        yp-post-cover-media {
          height: 180px;
        }
        yp-post-cover-media[audio-cover] {
          height: 90px;
        }
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    ${this.post ? html`
    <iron-media-query query="(min-width: 600px)" query-matches="${this.wide}"></iron-media-query>

    <paper-material mini="${this.mini}" hide-post-cover="${this.post.Group.configuration.hidePostCover}" hide-description="${this.post.Group.configuration.hidePostDescription}" hide-actions="${this.post.Group.configuration.hidePostActionsInGrid}" audio-cover="${this.isAudioCover}" class="card postCard layout vertical" elevation="${this.elevation}" animated="">
      <div class="layout vertical">
        <yp-post-cover-media mini="${this.mini}" audio-cover="${this.isAudioCover}" post="${this.post}" ?hidden="${this.post.Group.configuration.hidePostCover}"></yp-post-cover-media>
        <div class="postNameContainer">
          <div class="post-name" mini="${this.mini}" id="postName" on-tap="goToPostIfNotHeader">
            <yp-magic-text id="postNameMagicText" text-type="postName" content-language="${this.post.language}" text-only="" content="${this.postName}" content-id="${this.post.id}">
            </yp-magic-text>
          </div>
        </div>
        <yp-magic-text class="description layout horizontal" on-tap="goToPostIfNotHeader" ?hidden="${this.hideDescription}" text-type="postContent" content-language="${this.post.language}" text-only="" content="${this.post.description}" content-id="${this.post.id}" truncate="100">
        </yp-magic-text>
        <div ?hidden="${this.post.Group.configuration.hidePostActionsInGrid}">
          <yp-post-actions floating="" class="postActions" elevation="-1" endorse-mode="${this.endorseMode}" post="${this.post}" ?hidden="${this.mini}"></yp-post-actions>
        </div>
      </div>
    </paper-material>
` : html``}
`
  }
/*
  behaviors: [
    ypLanguageBehavior,
    YpPostBehavior,
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypMediaFormatsBehavior,
    ypTruncateBehavior,
    ypGotoBehavior
  ],
*/

  _hideDescription(mini, post) {
    return (mini || (post && post.Group.configuration && post.Group.configuration.hidePostDescription))
  }

  _hasPostAccess(post, gotAdminRights) {
    if (post && gotAdminRights) {
      if (this.checkPostAccess(post)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  goToPostIfNotHeader() {
    if (this.post.Group.configuration && this.post.Group.configuration.disablePostPageLink) {
      console.log("goToPostDisabled");
    } else {
      this.goToPost(null, null, null, this.post);
    }
  }

  _postChanged(post) {
    if (post) {
      if (post.cover_media_type==='audio') {
        this.set('isAudioCover', true);
      } else {
        this.set('isAudioCover', false);
      }
      this.async(function () {
        var postName = this.$$("#postName");
        if (postName) {
          if (this.mini) {
            if (post.name.length>200) {
              postName.style.fontSize = "12px";
            } else if (post.name.length>100) {
              postName.style.fontSize = "13px";
            } else if (post.name.length>40) {
              postName.style.fontSize="16px";
            } else if (post.name.length>20) {
              postName.style.fontSize="18px";
            } else {
              postName.style.fontSize="19px";
            }
          } else if (!this.wide) {
            if (post.name.length>200) {
              postName.style.fontSize = "13px";
            } else if (post.name.length>100) {
              postName.style.fontSize = "15px";
            } else if (post.name.length>40) {
              postName.style.fontSize="16px";
            } else if (post.name.length>20) {
              postName.style.fontSize="21px";
            } else {
              postName.style.fontSize="22px";
            }
          } else {
            if (post.name.length>200) {
              postName.style.fontSize = "15px";
            } else if (post.name.length>100) {
              postName.style.fontSize = "18px";
            } else if (post.name.length>40) {
              postName.style.fontSize="19px";
            } else if (post.name.length>20) {
              postName.style.fontSize="22px";
            } else {
              postName.style.fontSize="24px";
            }
          }
        }
      });
    }
  }

  updateDescriptionIfEmpty(description) {
    if (!this.post.description || this.post.description=='') {
      this.set('post.description', description);
    }
  }

  _refresh() {
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.selected = 0;
      this.fire('refresh');
    }.bind(this));
  }

  _openReport() {
    window.appGlobals.activity('open', 'post.report');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('post.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(this.t('post.report')+': '+this.post.name);
  }
}

window.customElements.define('yp-post-card-lit', YpPostCardLit)