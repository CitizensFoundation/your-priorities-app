import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpBulkStatusDisplayLit extends YpBaseElement {
  static get properties() {
    return {
      config: {
        type: Object
      },

      templates: {
        type: Object
      },

      community: {
        type: Object,
        observer: '_communityChanged'
      },

      statusUpdateId: {
        type: Number,
        observer: '_statusUpdateIdChanged'
      },

      readToLoad: {
        type: Boolean,
        computed: '_readyToLoad(userId, statusUpdateId)'
      },

      userId: Number,

      hideGroupName: {
        type: Boolean,
        value: false
      },

      byTemplate: {
        type: Boolean,
        value: false
      },

      gotModifiedTemplates: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      .statusMaterial {
        background-color: #FFF;
        padding: 16px;
        margin: 32px;
        margin-top: 16px;
      }

      a {
        color: #000;
      }

      .detail {
        max-width: 400px;
        margin: 8px;
        padding: 8px;
      }

      .openCloseButton {
        cursor: pointer;
        margin-top: 8px;
      }

      .ideaLink {
        cursor: pointer;
        text-decoration: underline;
      }

      .postName {
        margin-top: 8px;
      }

      .mainHeader {
        margin: 16px;
        margin-bottom: 0;
      }

      .infoText {
        padding-top: 8px;
        padding-right: 8px;
        padding-left: 8px;
      }

      .voteText {
        font-size: 19px;
      }

      .topArea {
        background-color: var(--primary-background-color);
        background-image: var(--top-area-background-image, none);
        height: 300px;
        padding-top: 0;
        margin-top: -24px;
      }

      .headerMaterial {
        padding: 16px;
        background-color: #fcfcfc;
        padding-top: 8px;
        padding-bottom: 24px;
      }


      @media (max-width: 900px) {
        .topArea {
          height: auto;
        }

        .statusMaterial {
          background-color: #FFF;
          padding: 16px;
          margin: 16px;
          margin-top: 8px;
        }

      }

      [hidden] {
        display: none !important;
      }

      .templateList {
        background-color: #FFF;
        padding: 32px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <div class="layout vertical center-center topArea">
      <paper-material .elevation="5" class="headerMaterial layout vertical center-center">
        <h2 class="mainHeader">${this.t('bulkStatusUdateFor')}: ${this.community.name}</h2>
        <div class="infoText">${this.t('bulkStatusUdateForInfo')}</div>
      </paper-material>
    </div>

    ${!this.byTemplate ? html`
      ${ this.config.groups.map(group => html`
        <paper-material .elevation="2" class="statusMaterial layout horizontal center-center wrap">
          ${ this._orderGroupStatuses(group.statuses).map(status => html`
            <div class="layout vertical self-start">
              <h1 ?hidden="${this.hideGroupName}">${this.group.name}</h1>
              <h2>${this._officialStatusOptionsNamePlural(status.official_status)}</h2>

              ${ this.status.posts.map(post => html`
                <div class="layout vertical">
                  <div class="layout horizontal">
                    <iron-icon class="openCloseButton" data-args="${this.post.id}" .icon="keyboard-arrow-right" @tap="${this._setOpen}"></iron-icon>
                    <div class="postName">
                      <div class="ideaLink" data-args="${this.post.id}" @tap="${this._setOpen}">${this.post.name}</div>
                    </div>
                  </div>
                  <div id="detail_${this.post.id}" class="detail" ?hidden="">
                    <div class="reason" ?hidden="${this.post.uniqueStatusMessage}">
                      ${this._getTemplate(post.selectedTemplateName)}
                    </div>
                    <div class="reason" ?hidden="${!this.post.uniqueStatusMessage}">
                      ${this.post.uniqueStatusMessage}
                    </div>
                    <div class="postName">
                      ${this.t('urlLink')}: <a target="_blank" href="/post/${this.post.id}">${this.post.name}</a>
                    </div>
                  </div>
                </div>
              `)}
            </div>
            `)}
        </paper-material>
      `)}
    ` : html``}

    ${ this.gotModifiedTemplates ? html`
      <div class="templateList">

        ${ this._toArray(templates).map(template => html`
          <h2>${this.template.title}</h2>

          ${ this.template.posts.map(post => html`
            <div class="postName">
              <a target="_blank" href="/post/${this.post.id}">${this.post.name}</a>
            </div>

          `)}
        `)}

      </div>
    ` : html``}

    <yp-ajax id="ajax" url="/api/users/${this.userId}/status_update/${this.statusUpdateId}" @response="${this._response}"></yp-ajax>

`
  }


/*
  behaviors: [
    ypOfficialStatusOptions,
    ypThemeBehavior,
    ypMediaFormatsBehavior,
    ypTruncateBehavior
  ],
*/

  _toArray(object) {
    return Object.values(object);
  }

  _communityChanged(community) {
    if (community && community.CommunityHeaderImages && community.CommunityHeaderImages.length>0) {
      this.setupTopHeaderImage(community.CommunityHeaderImages);
    }

    if (community) {
      if (community.id==470) {
        this.hideGroupName = true;
      }
    }
  }

  setupTopHeaderImage(image) {
    let path;
    if (image) {
      path = 'url(' + this.getImageFormatUrl(image, 0) + ')';
    } else {
      path = 'none';
    }
    this.updateStyles({ '--top-area-background-image': path });
  }

  _orderGroupStatuses(statuses) {
    const order = {
      "-1": 3,
      "0": 2,
      "-2": 1,
      "2": 0
    };

    return statuses.sort(function (a, b) {
      return order[a.official_status.toString()]-order[b.official_status.toString()];
    });
  }

  _getTemplate(templateName) {
    if (templateName && this.templates[templateName]) {
      return this.templates[templateName].content.replace("www.kosning.reykjavik.is", "kosning.reykjavik.is");
    } else {
      return "Vantar upplýsingar";
    }
  }

  _readyToLoad(userId, statusUpdateId) {
    if (userId && statusUpdateId) {
      this.async(function () {
        this.$("#ajax").generateRequest();
      }, 20);
    }
  }

  _statusUpdateIdChanged(id) {
  }

  _setOpen(event, detail) {
    event = event || window.event;
    event = event.target || event.srcElement;
    const postId = event.getAttribute('data-args');
    this.$$("#detail_"+postId).hidden = !this.$$("#detail_"+postId).hidden;
  }

  _setClosed() {
    const postId = event.target.getAttribute('data-args');
    this.$$("#detail_"+postId).hidden = true;
  }

  _response(event, detail) {
    this.config = detail.response.config;
    const templates = {};
    detail.response.templates.forEach(function (template) {
      templates[template.title] = template;
    });
    this.templates = templates;
    this.community = detail.response.community;
    this.fire("change-header", { headerTitle: this.truncate(this.community.name,80),
      documentTitle: this.t('bulkStatusUdateFor')+' '+this.truncate(this.community.name,80),
      headerDescription: '',//this.truncate(this.post.Group.objectives,45),
      backPath: "/community/" + this.community.id });
    if (this.community.theme_id!=null) {
      this.setTheme(this.community.theme_id);
    }

    if (this.byTemplate) {
      this.config.groups.forEach(function (group) {
        group.statuses.forEach(function (groupItems) {
          groupItems.posts.forEach(function (post) {
            if (post.selectedTemplateName && this.templates[post.selectedTemplateName]) {
              if (!this.templates[post.selectedTemplateName].posts) {
                this.templates[post.selectedTemplateName].posts = [];
              }
              this.templates[post.selectedTemplateName].posts.push(post);
              console.log("Pusing to:"+post.selectedTemplateName+" id:"+post.id);
            } else {
              if (!this.templates["No template"]) {
                this.templates["No template"] = { title: "No template" };
                this.templates["No template"].posts = [];
              }
              this.templates["No template"].posts.push(post);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
      this._toArray(this.templates).forEach(function (template) {
        if (!template.posts || template.posts.length==0) {
          delete this.templates[template.title];
        }
      }.bind(this));
      this.gotModifiedTemplates = true;
    }
  }
}

window.customElements.define('yp-bulk-status-display-lit', YpBulkStatusDisplayLit)
