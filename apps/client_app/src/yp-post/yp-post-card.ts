import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
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
        value: 1
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
      },

      structuredAnswersFormatted: {
        type: String,
        computed: '_structuredAnswersFormatted(post)'
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
        padding: 16px;
        padding-top: 20px;
        padding-bottom: 14px;
        cursor: pointer;
        vertical-align: middle !important;
        font-size: 1.25rem;
        background-color: #fff;
        color: #000;
        font-weight: 500;apps/client_app/src/yp-collection/yp-group-lit.js
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
        border-radius: 4px;
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
        height: 331px;
      }

      .postCard[hide-description][hide-post-cover][hide-actions] {
        height: 110px;
      }

      .postCard[hide-actions] {
        height: 402px;
      }

      .postCard[mini] {
        width: 210px;
        height: 100%;
        margin: 0;
        padding-top: 0;
        padding-bottom: 0;
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

      .post-name[mini] {
        padding: 16px;
      }

      .description {
        font-size: 17px;
        padding: 16px;
        padding-top: 0;
        cursor: pointer;
        color: #555;
      }

      .postActions  {
        position: absolute;
        right: 20px;
        bottom: 2px;
        margin: 0;
      }

      .shareIcon {
        position: absolute;
        left: 8px;
        bottom: 2px;
        --paper-share-button-icon-color: #656565;
        --paper-share-button-icon-height: 46px;
        --paper-share-button-icon-width: 46px;
        text-align: right;
        width: 48px;
        height: 48px;
      }

      .customRatings {
        position: absolute;
        bottom: 10px;
        right: 6px;
      }

      @media (max-width: 960px) {
        .customRatings {
          bottom: 12px;
        }

        :host {
          width: 100%;
          max-width: 423px;
        }

        .description[has-custom-ratings] {
          padding-bottom: 28px;
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

      a {
        text-decoration: none;
      }

      .share[mini] {
        display: none;
      }
    `, YpFlexLayout];
  }

  render() {
    return html`
      <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
      <iron-media-query query="(min-width: 600px)" query-matches="${this.wide}"></iron-media-query>

      <paper-material .mini="${this.mini}" .hide-post-cover="${this.post.Group.configuration.hidePostCover}" .hide-description="${this.post.Group.configuration.hidePostDescription}" hide-actions="${this.post.Group.configuration.hidePostActionsInGrid}" audio-cover="${this.isAudioCover}" class="card postCard layout vertical" elevation="${this.elevation}" animated>
        <div class="layout vertical">
          <a .href="${this._getPostLink(post)}" id="theMainA">
            <yp-post-cover-media ?mini="${this.mini}" top-radius ?audioCover="${this.isAudioCover}" .altTag="${this.post.name}"
              .post="${this.post}" ?hidden="${this.post.Group.configuration.hidePostCover}"></yp-post-cover-media>
            <div class="postNameContainer">
              <div class="post-name" ?mini="${this.mini}" id="postName">
                <yp-magic-text id="postNameMagicText" textType="postName" .contentLanguage="${this.post.language}"
                  @click="${this.goToPostIfNotHeader}" text-only .content="${this.postName}" .contentId="${this.post.id}">
                </yp-magic-text>
              </div>
            </div>
            ${ !this.post.public_data.structuredAnswersJson ? html`
              <yp-magic-text class="description layout horizontal"
                ?hasCustomRatings="${this.post.Group.configuration.customRatings}"
                ?hidden="${this.hideDescription}" textType="postContent" .contentLanguage="${this.post.language}"
                @click="${this.goToPostIfNotHeader}" text-only .content="${this.post.description}"
                .contentId="${this.post.id}" truncate="120">
              </yp-magic-text>

            ` : html`
              <yp-magic-text id="description" textType="postContent" .contentLanguage="[[post.language]]" hidden\$="[[hideDescription]]" content="[[structuredAnswersFormatted]]" content-id="[[post.id]]" class="description" truncate="120">
              </yp-magic-text>
            `}
          </a>
          <div ?hidden="${this.post.Group.configuration.hidePostActionsInGrid}" @click="${this._onBottomClick}">
            ${ !this.mini ? html`
              <div class="share">
                <paper-share-button @share-tap="${this._shareTap}" class="shareIcon"
                  ?lessMargin="${this.post.Group.configuration.hideDownVoteForPost}"
                  ?endorsed="${this.isEndorsed}" horizontal-align="right" id="shareButton"
                  ?whatsapp="${this.post.Group.configuration.allowWhatsAppSharing}"
                  title="${this.t('post.shareInfo')}" facebook email
                  twitter popup url="${this.fullPostUrl}">
                </paper-share-button>
              </div>
              ${ this.post.Group.configuration.customRatings ? html`
                <yp-post-ratings-info class="customRatings" .post="${post}"></yp-post-ratings-info>
              ` : html`
                <yp-post-actions floating class="postActions" elevation="-1" .endorseMode="${this.endorseMode}"
                  .post="${this.post}" ?hidden="${this.mini}">
                </yp-post-actions>
              `}
            ` : nothing }
          </div>
        </div>
      </paper-material>
    `;
  }
/*
  behaviors: [
    YpPostBehavior,
    AccessHelpers,
    ypLoggedInUserBehavior,
    ypMediaFormatsBehavior,
    ypTruncateBehavior,
    ypGotoBehavior
  ],
*/

  _structuredAnswersFormatted(post) {
    if (post && post.public_data && post.public_data.structuredAnswersJson &&
      post.Group.configuration && post.Group.configuration.structuredQuestionsJson) {
      var questionHash = {};
      var outText = "";
      post.Group.configuration.structuredQuestionsJson.forEach(function (question) {
        if (question.uniqueId) {
          questionHash[question.uniqueId] = question;
        }
      }.bind(this));

      for (let i=0;i<post.public_data.structuredAnswersJson.length;i++) {
        const answer = post.public_data.structuredAnswersJson[i];
        if (answer && answer.value) {
          var question = questionHash[answer.uniqueId];
          if (question) {
            outText+=question.text+": ";
            outText+=answer.value+" ";
          }
          if (outText.length>120) {
            break;
          }
        }
      }

      return outText;
    } else {
      return "";
    }
  }

  _onBottomClick(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  clickOnA() {
    if (this.$.theMainA) {
      this.$.theMainA.click();
    }
  }

  _getPostLink(post) {
    if (post) {
      if (post.Group.configuration && post.Group.configuration.disablePostPageLink) {
        return "#";
      } else if (post.Group.configuration && post.Group.configuration.resourceLibraryLinkMode) {
        return post.description.trim();
      } else {
        return "/post/"+post.id;
      }
    } else {
      console.warn("Trying to get empty post link");
    }
  }

  _shareTap(event, detail) {
    window.appGlobals.activity('postShareCardOpen', detail.brand, this.post ? this.post.id : -1);
  }

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
    } else if (this.post.Group.configuration && this.post.Group.configuration.resourceLibraryLinkMode) {
      // Do nothing
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
        if (postName && false) {
          if (this.mini) {
            if (post.name.length>200) {
              postName.style.fontSize = "13px";
            } else if (post.name.length>100) {
              postName.style.fontSize = "14px";
            } else if (post.name.length>40) {
              postName.style.fontSize="16px";
            } else if (post.name.length>20) {
              postName.style.fontSize="18px";
            } else {
              postName.style.fontSize="19px";
            }
          } else if (!this.wide) {
            if (post.name.length>200) {
              postName.style.fontSize = "15px";
            } else if (post.name.length>100) {
              postName.style.fontSize = "17px";
            } else if (post.name.length>40) {
              postName.style.fontSize="18px";
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