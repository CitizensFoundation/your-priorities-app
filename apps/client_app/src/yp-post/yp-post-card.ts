import { property, html, css, customElement } from 'lit-element';
import { nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('yp-post-card')
export class YpPostCard extends YpBaseElement {
  @property({ type: String })
  selectedMenuItem: string | undefined;

  @property({ type: Boolean })
  mini = false;

  @property({ type: Boolean })
  isAudioCover = false;

  @property({ type: Object })
  post!: YpPostData;

  static get propersties() {
    return {
      post: {
        type: Object,
        observer: '_postChanged',
      }
    };
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .post-name {
          margin: 0;
          padding: 16px;
          padding-top: 20px;
          padding-bottom: 14px;
          cursor: pointer;
          vertical-align: middle !important;
          font-size: 1.25rem;
          background-color: #fff;
          color: #000;
          font-weight: 500;
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

        .postActions {
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
      `,
    ];
  }

  render() {
    return html`
      <div
        .mini="${this.mini}"
        .hide-post-cover="${this.post.Group.configuration.hidePostCover}"
        .hide-description="${this.post.Group.configuration.hidePostDescription}"
        ?hide-actions="${this.post.Group.configuration.hidePostActionsInGrid}"
        audio-cover="${this.isAudioCover}"
        class="card postCard layout vertical shadow-elevation-6dp shadow-transition"
        animated>
        <div class="layout vertical">
          <a href="${ifDefined(this._getPostLink(this.post))}" id="mainArea">
            <yp-post-cover-media
              ?mini="${this.mini}"
              top-radius
              ?audioCover="${this.isAudioCover}"
              .altTag="${this.post.name}"
              .post="${this.post}"
              ?hidden="${this.post.Group.configuration
                .hidePostCover}"></yp-post-cover-media>
            <div class="postNameContainer">
              <div class="post-name" ?mini="${this.mini}" id="postName">
                <yp-magic-text
                  id="postNameMagicText"
                  textType="postName"
                  .contentLanguage="${this.post.language}"
                  @click="${this.goToPostIfNotHeader}"
                  text-only
                  .content="${this.post.name}"
                  .contentId="${this.post.id}">
                </yp-magic-text>
              </div>
            </div>
            ${!this.post.public_data?.structuredAnswersJson
              ? html`
                  <yp-magic-text
                    class="description layout horizontal"
                    ?hasCustomRatings="${this.post.Group.configuration
                      .customRatings}"
                    ?hidden="${this.hideDescription}"
                    textType="postContent"
                    .contentLanguage="${this.post.language}"
                    @click="${this.goToPostIfNotHeader}"
                    text-only
                    .content="${this.post.description}"
                    .contentId="${this.post.id}"
                    truncate="120">
                  </yp-magic-text>
                `
              : html`
                  <yp-magic-text
                    id="description"
                    textType="postContent"
                    .contentLanguage="${this.post.language}"
                    ?hidden="${this.hideDescription}"
                    .content="${this.structuredAnswersFormatted}"
                    .contentId="${this.post.id}"
                    class="description"
                    truncate="120">
                  </yp-magic-text>
                `}
          </a>
          <div
            ?hidden="${this.post.Group.configuration.hidePostActionsInGrid}"
            @click="${this._onBottomClick}">
            ${!this.mini
              ? html`
                  <div class="share">
                    <paper-share-button
                      @share-tap="${this._shareTap}"
                      class="shareIcon"
                      ?lessMargin="${this.post.Group.configuration
                        .hideDownVoteForPost}"
                      horizontal-align="right"
                      id="shareButton"
                      ?whatsapp="${this.post.Group.configuration
                        .allowWhatsAppSharing}"
                      title="${this.t('post.shareInfo')}"
                      facebook
                      email
                      twitter
                      popup
                      url="${this._fullPostUrl}">
                    </paper-share-button>
                  </div>
                  ${this.post.Group.configuration.customRatings
                    ? html`
                        <yp-post-ratings-info
                          class="customRatings"
                          .post="${this.post}"></yp-post-ratings-info>
                      `
                    : html`
                        <yp-post-actions
                          floating
                          class="postActions"
                          elevation="-1"
                          .endorseMode="${this.endorseMode}"
                          .post="${this.post}"
                          ?hidden="${this.mini}">
                        </yp-post-actions>
                      `}
                `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  get _fullPostUrl() {
    return encodeURIComponent("https://"+window.location.host+"/post/"+this.post.id);
  }

  get structuredAnswersFormatted(): string {
    if (
      this.post &&
      this.post.public_data &&
      this.post.public_data.structuredAnswersJson &&
      this.post.Group.configuration &&
      this.post.Group.configuration.structuredQuestionsJson
    ) {
      const questionHash: Record<string, YpStructuredQuestions> = {};
      let outText = '';
      this.post.Group.configuration.structuredQuestionsJson.forEach(
       (question) => {
          if (question.uniqueId) {
            questionHash[question.uniqueId] = question;
          }
        }
      );

      for (let i = 0; i < this.post.public_data.structuredAnswersJson.length; i++) {
        const answer = this.post.public_data.structuredAnswersJson[i];
        if (answer && answer.value) {
          const question = questionHash[answer.uniqueId];
          if (question) {
            outText += question.text + ': ';
            outText += answer.value + ' ';
          }
          if (outText.length > 120) {
            break;
          }
        }
      }

      return outText;
    } else {
      return '';
    }
  }

  _onBottomClick(event: CustomEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  clickOnA() {
    this.$$("#mainArea")?.click();
  }

  _getPostLink(post: YpPostData) {
    if (post) {
      if (
        post.Group.configuration &&
        post.Group.configuration.disablePostPageLink
      ) {
        return '#';
      } else if (
        post.Group.configuration &&
        post.Group.configuration.resourceLibraryLinkMode
      ) {
        return post.description.trim();
      } else {
        return '/post/' + post.id;
      }
    } else {
      console.warn('Trying to get empty post link');
    }
  }

  _shareTap(event: CustomEvent) {
    window.appGlobals.activity(
      'postShareCardOpen',
      event.detail.brand,
      this.post ? this.post.id : -1
    );
  }

  get hideDescription(): boolean {
    return (
      this.mini ||
      (this.post &&
        this.post.Group.configuration &&
        this.post.Group.configuration.hidePostDescription)
    ) as boolean;
  }

  goToPostIfNotHeader() {
    if (
      this.post.Group.configuration &&
      this.post.Group.configuration.disablePostPageLink
    ) {
      console.log('goToPostDisabled');
    } else if (
      this.post.Group.configuration &&
      this.post.Group.configuration.resourceLibraryLinkMode
    ) {
      // Do nothing
    } else {
      YpNavHelpers.goToPost(this.post.id);
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('post') && this.post) {
      if (this.post.cover_media_type === 'audio') {
        this.isAudioCover = true;
      } else {
        this.isAudioCover = false;
      }
    }
  }

  updateDescriptionIfEmpty(description: string) {
    if (!this.post.description || this.post.description == '') {
      this.post.description = description;
    }
  }

  _refresh() {
    window.appDialogs
      .getDialogAsync(
        'postEdit',
       (dialog) => {
          dialog.selected = 0;
          this.fire('refresh');
        }
      );
  }

  _openReport() {
    window.appGlobals.activity('open', 'post.report');
    window.appDialogs
      .getDialogAsync(
        'apiActionDialog',
       (dialog) => {
          dialog.setup(
            '/api/posts/' + this.post.id + '/report',
            this.t('reportConfirmation'),
            this._onReport.bind(this),
            this.t('post.report'),
            'PUT'
          );
          dialog.open();
        }
      );
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t('post.report') + ': ' + this.post.name
    );
  }
}
