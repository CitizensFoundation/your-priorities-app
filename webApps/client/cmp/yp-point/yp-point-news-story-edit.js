var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/button/text-button.js';
import '../yp-user/yp-user-image.js';
import './yp-point-news-story-embed.js';
import { YpBaseElementWithLogin } from '../common/yp-base-element-with-login.js';
let YpPointNewsStoryEdit = class YpPointNewsStoryEdit extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.loadingUrlPreview = true;
        this.loadingPostStory = true;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          padding-top: 16px;
        }

        md-outlined-text-field {
          width: 460px;
          margin-top: -8px;
        }

        md-text-button {
          margin-top: 16px;
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

        md-icon-button {
          margin-top: 16px;
          padding-bottom: 0;
        }

        md-icon-button::shadow #icon {
          width: 36px;
          height: 36px;
        }

        .container {
          margin-bottom: 32px;
        }

        @media (max-width: 420px) {
          md-outlined-text-field {
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
          md-outlined-text-field {
            width: 220px;
          }

          .embedData {
            max-width: 220px;
          }
        }
      `,
        ];
    }
    render() {
        return this.point
            ? html `
          <div class="layout vertical container">
            <div class="layout horizontal">
              <yp-user-image
                class="userImage"
                .user="${this.loggedInUser}"
                ?rtl="${this.rtl}"></yp-user-image>
              <div class="layout vertical">
                <md-outlined-field
                  type="textarea"
                  id="pointNewsStory"
                  minlength="15"
                  name="pointNewsStory"
                  .value="${this.point.content}"
                  .label="${this.t('point.addNewsStory')}"
                  charCounter
                  rows="2"
                  maxrows="5"
                  @keydown="${this._keyDown}"
                  maxlength="500">
                </md-outlined-field>
                <div class="layout horizontal end-justified">
                  <md-text-button
                    id="storySubmitButton"
                    raised
                    @click="${this._sendStory}"
                    .label="${this.t('point.postNewsStory')}"></md-text-button>
                </div>
              </div>
            </div>

            <div class="layout horizontal center-center">
              ${this.point.embed_data
                ? html `
                    <div class="embedData layout vertical center-center">
                      <yp-point-news-story-embed
                        .embedData="${this.point
                    .embed_data}"></yp-point-news-story-embed>
                      <md-icon-button
                        .label="${this.t('clearEmbededMedia')}"
                        icon="clear"
                        @click="${this._clearEmbed}"></md-icon-button>
                    </div>
                  `
                : html ``}
            </div>
          </div>
        `
            : nothing;
    }
    _clearButtonStat() {
        this.$$('#storySubmitButton').disabled = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._reset();
    }
    firstUpdated(props) {
        super.firstUpdated(props);
        this.$$('#pointNewsStory').addEventListener('paste', this._checkForUrl.bind(this));
    }
    get newPointContent() {
        return this.$$("#pointNewsStory").value;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.$$('#pointNewsStory').removeEventListener('paste', this._checkForUrl.bind(this));
    }
    _reset() {
        this.point = { content: '' };
        this.point.embed_data = undefined;
        if (this.$$("#pointNewsStory"))
            this.$$("#pointNewsStory").value = '';
        this._clearButtonState();
    }
    async _sendStory() {
        this.$$('#storySubmitButton').disabled = true;
        this.point.content = this.newPointContent;
        let body = { point: this.point };
        let url;
        if (this.point && this.point.content && this.point.content.length > 2) {
            if (this.postId && this.postGroupId) {
                body = { ...body, ...{ post_id: this.postId } };
                url = '/api/groups/' + this.postGroupId + '/post/news_story';
            }
            else if (this.groupId) {
                body = { ...body, ...{ group_id: this.groupId } };
                url =
                    '/api/groups/' + this.groupId + '/news_story';
            }
            else if (this.communityId) {
                body = { ...body, ...{ community_id: this.communityId } };
                url = '/api/communities/' + this.communityId + '/news_story';
            }
            else if (this.domainId) {
                url = '/api/domains/' + this.domainId + '/news_story';
                body = { ...body, ...{ domain_id: this.domainId } };
            }
            else {
                console.error("Can't find send ids");
            }
            if (url) {
                await window.serverApi.postNewsStory(url, body);
                this.fire('refresh');
                this._reset();
            }
        }
        else {
            this._clearButtonState();
            this.fire('yp-error', this.t('point.commentToShort'));
        }
    }
    _clearButtonState() {
        if (this.$$("#storySubmitButton"))
            this.$$("#storySubmitButton").disabled = false;
    }
    _keyDown(event) {
        if (event.code == 'Space' || event.code == 'enter') {
            this._checkForUrl();
        }
    }
    _clearEmbed() {
        this.point.embed_data = undefined;
        this.requestUpdate();
    }
    async _checkForUrl() {
        if (this.point && !this.point.embed_data) {
            const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
            const urlRegex2 = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
            //      const urls1 = urlRegex.exec(this.point.content);
            const urls2 = urlRegex2.exec(this.newPointContent);
            if (urls2 && urls2.length > 0) {
                //TODO: Error should do this._clearButtonState
                const previewResponse = await window.serverApi.pointUrlPreview(`url=${urls2[0]}`);
                if (previewResponse && previewResponse.length > 0) {
                    this.point.embed_data = previewResponse[0];
                    this.requestUpdate();
                }
            }
        }
    }
};
__decorate([
    property({ type: Boolean })
], YpPointNewsStoryEdit.prototype, "loadingUrlPreview", void 0);
__decorate([
    property({ type: Boolean })
], YpPointNewsStoryEdit.prototype, "loadingPostStory", void 0);
__decorate([
    property({ type: Object })
], YpPointNewsStoryEdit.prototype, "point", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStoryEdit.prototype, "postId", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStoryEdit.prototype, "postGroupId", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStoryEdit.prototype, "groupId", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStoryEdit.prototype, "communityId", void 0);
__decorate([
    property({ type: Number })
], YpPointNewsStoryEdit.prototype, "domainId", void 0);
YpPointNewsStoryEdit = __decorate([
    customElement('yp-point-news-story-edit')
], YpPointNewsStoryEdit);
export { YpPointNewsStoryEdit };
//# sourceMappingURL=yp-point-news-story-edit.js.map