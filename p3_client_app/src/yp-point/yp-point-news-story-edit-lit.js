import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import '../yp-user/yp-user-image.js';
import '../yp-ajax/yp-ajax.js';
import './yp-point-news-story-embed.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpPointNewsStoryEditLit extends YpBaseElement {
  static get properties() {
    return {
      loadingUrlPreview: {
        type: Boolean,
        notify: true
      },

      loadingPostStory: {
        type: Boolean,
        notify: true
      },

      point: {
        type: Object,
        notify: true
      },

      postId: {
        type: Number
      },

      postGroupId: {
        type: Number
      },

      groupId: {
        type: Number
      },

      communityId: {
        type: Number
      },

      domainId: {
        type: Number
      },
    }
  }

  static get styles() {
    return [
      css`

      :host {
        padding-top: 16px;
      }

      paper-textarea  {
        width: 460px;
        margin-top: -8px;
      }

      mwc-button {
        margin-top: 16px;
        background-color: var(--accent-color);
        color: #FFF;
      }

      .embedData {
        padding-top: 24px;
      }

      .userImage {
        padding-bottom: 16px;
        padding-right: 16px;
      }

      .userImage[rtl] {
        padding-left: 16px;
        padding-right: 4px;
      }

      paper-icon-button {
        margin-top: 16px;
        padding-bottom: 0;
      }

      paper-icon-button::shadow #icon {
        width: 36px;
        height: 36px;
        color: #777;
      }

      .container {
        margin-bottom: 32px;
      }

      @media (max-width: 420px) {
        paper-textarea {
          width: 270px;
        }

        .embedData {
          max-width: 270px;
          margin-left: 24px;
        }

        :host {
          margin-top: 16px;
        }
      }

      @media (max-width: 320px) {
        paper-textarea {
          width: 220px;
        }

        .embedData {
          max-width: 220px;
        }
      }

      [hidden] {
        display: none !important;
      }
  `, YpFlexLayout]
}

render() {
  return html`
    <div class="layout vertical container">
      <div class="layout horizontal">
        <yp-user-image class="userImage" .user="${this.loggedInUser}" ?rtl="${this.rtl}"></yp-user-image>
        <div class="layout vertical">
          <paper-textarea id="pointNewsStory" required .minlength="15" .name="pointNewsStory" .value="${this.point.content}" always-float-label="${this.point.content}" .label="${this.t('point.addNewsStory')}" char-counter .rows="2" .max-rows="5" @keydown="${this._keyDown}" .maxlength="500">
          </paper-textarea>
          <div class="layout horizontal end-justified">
            <mwc-button id="storySubmitButton" raised @click="${this._sendStory}" .label="${this.t('point.postNewsStory')}"></mwc-button>
          </div>
        </div>
      </div>

      <div class="layout horizontal center-center">

        ${ this.point.embed_data ? html`
          <div class="embedData layout vertical center-center">
            <yp-point-news-story-embed embed-data="${this.point.embed_data}"></yp-point-news-story-embed>
            <paper-icon-button .ariaLabel="${this.t('clearEmbededMedia')}" .icon="clear" @tap="${this._clearEmbed}"></paper-icon-button>
          </div>
        `: html``}

      </div>

      <div class="layout horizontal center-center">
        <yp-ajax id="urlPreviewAjax" url="/api/points/url_preview" ?hidden="${this.point.embed_detail}" @response="${this._urlPreviewResponse}"></yp-ajax>
        <yp-ajax id="postNewsStoryAjax" .method="POST" @error="${this._clearButtonState}" @response="${this_newsStoryResponse}"></yp-ajax>
      </div>

    </div>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>
    `;
  }

/*
  behaviors: [
    ypLoggedInUserBehavior
  ],
*/
  _clearButtonStat() {
    this.$$("#storySubmitButton").disabled = false;
  }

  connectedCallback() {
    super.connectedCallback()
    this._reset();
    this.$$("#pointNewsStory").addEventListener("paste", function () {
      this.async(function () {
        this._checkForUrl();
      }, 50);
    }.bind(this));
  }

  _reset() {
    this.point = { content: '' };
    this.point.embed_data = null;
    this._clearButtonState();
  }

  _sendStory() {
    this.$$("#storySubmitButton").disabled = true;
    const body = { point: this.point };
    if (this.point.content && this.point.content.length>2) {
      if (this.postId && this.postGroupId) {
        __.merge(body, { post_id: this.postId })
        this.$$("#postNewsStoryAjax").url = '/api/groups/'+this.postGroupId+'/post/news_story';
      } else if (this.groupId) {
        __.merge(body, { group_id: this.groupId })
        this.$$("#postNewsStoryAjax").url = '/api/groups/'+this.groupId+'/news_story';
      } else if (this.communityId) {
        __.merge(body, { community_id: this.communityId })
        this.$$("#postNewsStoryAjax").url = '/api/communities/'+this.communityId+'/news_story';
      } else if (this.domainId) {
        this.$$("#postNewsStoryAjax").url = '/api/domains/'+this.domainId+'/news_story';
        __.merge(body, { domain_id: this.domainId })
      } else {
        console.error("Can't find send ids");
      }
      this.$$("#postNewsStoryAjax").body = body;
      this.$$postNewsStoryAjax.generateRequest();
    } else {
      this._clearButtonState();
      this.$$("#postNewsStoryAjax").showErrorDialog(this.t('point.commentToShort'));
    }
  }

  _urlPreviewResponse(event, detail) {
    if (detail.response && detail.response.length>0)
    this.point.embed_data = detail.response[0];
  }

  _newsStoryResponse() {
    this.fire('refresh');
    this._reset();
  }

  _keyDown(event) {
    if (event.code == 'Space' || event.code == 'enter') {
      this._checkForUrl(event);
    }
  }

  _clearEmbed() {
    this.point.embed_data = null;
  }

  _checkForUrl(event) {
    if (!this.point.embed_data) {
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      const urlRegex2 = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
      const urls1 = urlRegex.exec(this.point.content);
      const urls2 = urlRegex2.exec(cthis.point.content);
      if (urls2 && urls2.length > 0) {
        this.$$("#urlPreviewAjax").params = { url: urls2[0] };
        this.$$("#urlPreviewAjax").generateRequest();
      }
    }
  }
}

window.customElements.define('yp-point-news-story-edit-lit', YpPointNewsStoryEditLit)
