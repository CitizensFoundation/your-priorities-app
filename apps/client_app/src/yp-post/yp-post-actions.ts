import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-media-query/iron-media-query.js';
import 'lite-signal/lite-signal.js';
//TODO: import 'paper-share-button/paper-share-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { ypRemoveClassBehavior } from '../yp-behaviors/yp-remove-class-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpPostActionsLit extends YpBaseElement {
  static get properties() {
    return {
      post: {
        type: Object,
        observer: '_onPostChanged'
      },

      small: {
        type: Boolean,
        value: false
      },

      headerMode: {
        type: Boolean,
        value: false
      },

      forceSmall: {
        type: Boolean,
        value: false
      },

      endorsementButtons: {
        type: String,
        value: 'hearts'
      },

      endorseValue: {
        type: Number,
        value: 0
      },

      isEndorsed: {
        type: Boolean,
        value: false
      },

      elevation: {
        type: Number,
        value: 3
      },

      elevationPlusOne: {
        type: Number,
        computed: '_elevationPlusOne(elevation)'
      },

      allDisabled: {
        type: Boolean,
        value: false
      },

      disabledTitle: {
        type: String,
        value: null
      },

      floating: {
        type: Boolean,
        value: false
      },

      votingDisabled: {
        type: Boolean,
        value: false
      },

      smallerIcons: {
        type: Boolean,
        value: false
      },

      formattedPointCount: {
        type: String,
        computed: '_formattedPointCount(post.counter_points)'
      },

      formattedDownCount: {
        type: String,
        computed: '_formattedDownCount(post.counter_endorsements_down)'
      },

      formattedUpCount: {
        type: String,
        computed: '_formattedUpCount(post.counter_endorsements_up)'
      },

      postUrl: {
        type: String,
        computed: '_postUrl(post)'
      },

      hideDebate: {
        type: Boolean,
        computed: '_hideDebate(small,forceSmall,headerMode,post)'
      },

      customVoteUpHoverText: {
        type: String,
        computed: '_customVoteUpHoverText(post)'
      },

      customVoteDownHoverText: {
        type: String,
        computed: '_customVoteDownHoverText(post)'
      },

      endorseModeIconUp: {
        type: String,
        computed: '_endorseModeIconUp(endorsementButtons, post, endorseValue)'
      },

      endorseModeIconDown: {
        type: String,
        computed: '_endorseModeIconDown(endorsementButtons, post, endorseValue)'
      }
    };
  }


  static get styles() {
    return [
      css`

      :host {
        display: block;
      }

      .action-bar {
        position: absolute;
        background-color: #FFF;
      }

      .action-bar[floating] {
        position: relative;
        background-color: #FFF;
      }

      .action-bar-small {
        margin-top: 8px;
        position: absolute;
        width: 100%;
        bottom: -32px;
        vertical-align: bottom !important;
      }

      .action-text {
        font-size: 16px;
        text-align: left;
        vertical-align: bottom;
        padding-top: 8px;
        margin-top: 4px;
      }

      .action-icon {
      }

      .action-up {
        color: var(--primary-up-color-lighter, rgba(0,153,0,0.55));
      }

      .action-down {
        color: var(--primary-down-color-lighter, rgba(153,0,0,0.55));
      }

      .default-buttons-color {
        color: var(--default-endorsement-buttons-color, #656565);
      }

      .default-buttons-up-selected {
        color: var(--accent-color, rgba(0,0,0,1.0));
      }

      .default-buttons-down-selected {
        color: var(--accent-color, rgba(0,0,0,1.0));
      }

      .hearts-up-selected {
        color: var(--primary-hearts-color-up, rgba(168,0,0,0.72));
      }

      .hearts-down-selected {
        color: var(--primary-hearts-color-up, rgba(168,0,0,0.72));
      }

      .action-debate {
        color: #757575;
      }

      .debate-text {
        padding-top: 10px;
        padding-right: 6px;
        color: #757575;
      }

      .down-text {
        padding-right: 0px;
        padding-top: 10px;
      }

      .up-text {
        padding-top: 10px;
        margin-right: 8px;
      }

      .up-text[rtl] {
        margin-right: -8px;
      }

      .down-vote-icon {
        margin-right: 0px;
      }

      paper-icon-button.mainIcons {
        width: 48px;
        height: 48px;
      }

      paper-icon-button.debateIcon {
        width: 46px;
        height: 46px;
        margin-top: 2px;
      }

      paper-icon-button[smaller-icons] {
        height: 48px;
        width: 48px;
      }

      .debate-icon {
        color: #757575;
      }

      .up-vote-icon {
        margin-left: 8px;
      }

      @media (max-width: 320px) {
        :host {
          width: 250px;
        }
      }

      .shareButtonContainer {
        position: absolute;
        bottom: 55px;
        right: -32px;
        padding: 0;
        margin: 0;
        margin-bottom: 8px;
      }

      .shareButton {
        padding: 2px;
      }

      .shareShare {
        padding: 0;
        margin: 0;
        background-color: #FFF;
      }

      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .action-debate {
          display: none;
        }
      }

      [hidden] {
        display: none !important;
      }

      paper-material[rtl] {
        direction: rtl;
      }
    `, YpFlexLayout];
  }

  render() {
    return html`
      <iron-media-query query="(max-width: 420px)" .query-matches="${this.small}"></iron-media-query>

      <yp-ajax id="endorseAjax" .method="POST" @response="${this._endorseResponse}"></yp-ajax>
      <paper-material ?rtl="${this.rtl}" .elevation="${this.elevationPlusOne}" .title="${this.disabledTitle}" floating="${this.floating}" .animated="" class="action-bar layout horizontal">
        <div id="actionUp" class="action-up layout horizontal layout start justified">
          <paper-icon-button id="iconUpButton" .smaller-icons="${this.smallerIcons}" ?disabled="${this.allDisabled}" .title="${this.customVoteUpHoverText}" icon="${this.endorseModeIcon(endorsementButtons,'up')}" class="action-icon up-vote-icon largeButton" @tap="${thisupVote}"></paper-icon-button>
          <div ?rtl="${this.rtl}" class="action-text up-text" ?hidden="${this.post.Group.configuration.hideVoteCount}">${this.formattedUpCount}</div>
        </div>

        <div class="action-debate layout horizontal layout center justified " ?hidden="${this.hideDebate}">
            <paper-icon-button ?disabled="${this.allDisabled}" title="${this.t('post.debate')}" icon="chat-bubble-outline" class="action-icon debate-icon mainIcons debateIcon" @click="${this._goToPostIfNotHeader}"></paper-icon-button>
          <div class="action-text debate-text">${this.formattedPointCount}</div>
        </div>

        <div class="" ?hidden="${!this.hideDebate}"></div>

        <div id="actionDown" class="action-down layout horizontal layout center justified" ?hidden="${this.post.Group.configuration.hideDownVoteForPost}">
          <paper-icon-button smaller-icons="${this.smallerIcons}" ?disabled="${this.allDisabled}" title="${this.customVoteDownHoverText}" icon="${this.endorseModeIconDown}" class="action-icon down-vote-icon mainIcons" @click="${this.downVote}"></paper-icon-button>
          <div class="action-text down-text" ?hidden="${this.post.Group.configuration.hideVoteCount}">${this.formattedDownCount}</div>
        </div>
      </paper-material>

      <lite-signal on-lite-signal-got-endorsements-and-qualities="_updateEndorsementsFromSignal"></lite-signal>
    `;
  }

/*
  behaviors: [
    ypNumberFormatBehavior,
    ypRemoveClassBehavior,
    ypGotoBehavior
  ],
*/
  _endorseModeIconUp (endorsementButtons) {
    return this.endorseModeIcon(endorsementButtons, 'up');
  }

  _endorseModeIconDown(endorsementButtons) {
    return this.endorseModeIcon(endorsementButtons, 'down');
  }

  _customVoteUpHoverText(post) {
    if (post && post.Group && post.Group.configuration && post.Group.configuration.customVoteUpHoverText) {
      return post.Group.configuration.customVoteUpHoverText;
    } else {
      return this.t('post.up_vote');
    }
  }

  _customVoteDownHoverText(post) {
    if (post && post.Group && post.Group.configuration && post.Group.configuration.customVoteDownHoverText) {
      return post.Group.configuration.customVoteDownHoverText;
    } else {
      return this.t('post.down_vote');
    }
  }

  _formattedUpCount(number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  }

  _formattedPointCount(number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  }

  _formattedDownCount(number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  }

  _goToPostIfNotHeader() {
    if (!this.headerMode) {
      this.goToPost();
    }
  }

  _postUrl(post) {
    if (post) {
      return encodeURIComponent("https://"+window.location.host+"/post/"+post.id);
    } else {
      console.warn("Can't find post for action");
      return "";
    }
  }

  _elevationPlusOne(elevation) {
    if (elevation<5) {
      return elevation + 1;
    } else {
      return elevation;
    }
  }

  _hideDebate(small, forceSmall, headerMode) {
    return (small || forceSmall || headerMode || (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.hideDebateIcon));
  }

  _onPostChanged(post, oldValue) {
    this.set('isEndorsed', false);
    if (post) {
      this.removeClass(this.$$("#actionUp"),'hearts-up-selected');
      this.removeClass(this.$$("#actionDown"), 'hearts-down-selected');
      this.removeClass(this.$$("#actionUp"),'default-buttons-up-selected');
      this.removeClass(this.$$("#actionDown"), 'default-buttons-down-selected');
      this.set('endorseValue', 0);

      if (post.Group.configuration && post.Group.configuration.canVote!=undefined && post.Group.configuration.canVote==false) {
        this.set('votingDisabled', true);
        this.set('allDisabled', true);
        this.set('disabledTitle', this.t('votingDisabled'));
      } else {
        this.set('votingDisabled', false);
        this.set('allDisabled', false);
      }
      if (post.Group.configuration && post.Group.configuration.endorsementButtons!=undefined) {
        this.set('endorsementButtons', post.Group.configuration.endorsementButtons);
      } else {
        this.set('endorsementButtons', "hearts");
      }
      if (post.Group.configuration) {
        this.set('post.Group.configuration.originalHideVoteCount', post.Group.configuration.hideVoteCount);
        if (post.Group.configuration.hideVoteCountUntilVoteCompleted) {
          this.set('post.Group.configuration.hideVoteCount', true);
        }
      }
      this._updateEndorsements(post);
    } else {
      console.warn("No post found for post actions");
    }
  }

  _updateEndorsementsFromSignal() {
    if (this.post) {
      this._updateEndorsements(this.post);
    } else {
      this.async(function () {
        if (this.post) {
          this._updateEndorsements(this.post);
        } else {
          console.warn("Trying to update post null from signal");
        }
      }, 50);
    }
  }

  _updateEndorsements(post) {
    this.set('isEndorsed', false);
    if (window.appUser && window.appUser.loggedIn() && window.appUser.user && window.appUser.user.Endorsements) {
      const thisPostsEndorsement = window.appUser.endorsementPostsIndex[post.id];
      if (thisPostsEndorsement)
        this._setEndorsement(thisPostsEndorsement.value);
      else
        this._setEndorsement(0);
    }
  }

  endorseModeIcon(endorsementButtons, upDown) {
    if (endorsementButtons!="hearts" && endorsementButtons!="hats") {
      this.set('smallerIcons', true);
    } else {
      this.set('smallerIcons', false);
    }
    if (endorsementButtons=='thumbs' && upDown=='up') {
      return 'thumb-up';
    } else if (endorsementButtons=='thumbs' && upDown=='down') {
      return 'thumb-down';
    } else if (endorsementButtons=='hearts' && upDown=='up') {
      return 'favorite-border';
    } else if (endorsementButtons=='hearts' && upDown=='down') {
      return 'do-not-disturb';
    } else if (endorsementButtons=='hats' && upDown=='up') {
      return 'keyboard-arrow-up';
    } else if (endorsementButtons=='hats' && upDown=='down') {
      return 'keyboard-arrow-down';
    } else if (endorsementButtons=='arrows' && upDown=='up') {
      return 'arrow-upward';
    } else if (endorsementButtons=='arrows' && upDown=='down') {
      return 'arrow-downward';
    }
  }

  _setEndorsement(value) {
    this.endorseValue = value;

    if (value !== 0 && this.post.Group.configuration &&
      (this.post.Group.configuration.hideVoteCount && !this.post.Group.configuration.originalHideVoteCount)) {
      this.set('post.Group.configuration.hideVoteCount', false);
    }

    if (this.endorsementButtons=='hearts') {
      if (value > 0) {
        this.$$("#actionUp").className += ' ' + 'hearts-up-selected';
        this.removeClass(this.$$("#actionDown"), 'hearts-down-selected');
        this.$$("#iconUpButton").icon = "favorite";
      } else if (value < 0) {
        this.$$("#actionDown").className += ' ' + 'hearts-down-selected';
        this.removeClass(this.$$("#actionUp"),'hearts-up-selected');
        this.$$("#iconUpButton").icon = "favoriate-border";
      } else {
        this.removeClass(this.$$("#actionUp"),'hearts-up-selected');
        this.removeClass(this.$$("#actionDown"), 'hearts-down-selected');
        this.$$("#iconUpButton").icon = "favorite-border";
      }
    } else {
      if (value > 0) {
        this.$$("#actionUp").className += ' ' + 'default-buttons-up-selected';
        this.removeClass(this.$$("#actionDown"), 'default-buttons-down-selected');
      } else if (value < 0) {
        this.$$("#actionDown").className += ' ' + 'default-buttons-down-selected';
        this.removeClass(this.$$("#actionUp"),'default-buttons-up-selected');
      } else {
        this.removeClass(this.$$("#actionUp"),'default-buttons-up-selected');
        this.removeClass(this.$$("#actionDown"), 'default-buttons-down-selected');
      }
    }

    if (value>0) {
      this.set('isEndorsed', true);
    }
  }

  _enableVoting() {
    if (!this.votingDisabled) {
      this.set('allDisabled', false);
    }
  }

  _endorseResponse(event, detail) {
    this._enableVoting();
    const endorsement = detail.response.endorsement;
    const oldEndorsementValue = detail.response.oldEndorsementValue;
    window.appUser.updateEndorsementForPost(this.post.id, endorsement);
    this._setEndorsement(endorsement.value);
    if (oldEndorsementValue) {
      if (oldEndorsementValue>0)
        this.set('post.counter_endorsements_up', this.post.counter_endorsements_up-1);
      else if (oldEndorsementValue<0)
        this.set('post.counter_endorsements_down', this.post.counter_endorsements_down-1);
    }
    if (endorsement.value>0)
      this.set('post.counter_endorsements_up', this.post.counter_endorsements_up+1);
    else if (endorsement.value<0)
      this.set('post.counter_endorsements_down', this.post.counter_endorsements_down+1);

    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'got-endorsements-and-qualities' }
      })
    );
  }

  generateEndorsementFromLogin(value) {
    if (!window.appUser.endorsementPostsIndex[this.post.id]) {
      this.generateEndorsement(value);
    }
  }

  generateEndorsement(value) {
    if (window.appUser.loggedIn()===true) {
      this.$$("#endorseAjax").url = '/api/posts/' + this.post.id + '/endorse';
      this.$$("#endorseAjax").body = { post_id: this.post.id, value: value };
      if (this.endorseValue === value) {
        this.$$("#endorseAjax").method = 'DELETE';
      } else {
        this.$$("#endorseAjax").method = 'POST';
      }
      this.$$("#endorseAjax").generateRequest();
    } else {
      this._enableVoting();
      window.appUser.loginForEndorse(this, { value: value } );
    }
  }

  upVote(event) {
    this.set('allDisabled', true);
    this.generateEndorsement(1);
    window.appGlobals.activity('clicked', 'endorse_up', this.post ? this.post.id : -1);
    this.set('isEndorsed', true);
    this.updateStyles();
    this._setVoteHidingStatus();
  }

  downVote(event) {
    this.set('allDisabled', true);
    this.generateEndorsement(-1);
    window.appGlobals.activity('clicked', 'endorse_down', this.post ? this.post.id : -1);
    this._setVoteHidingStatus();
  }

  _setVoteHidingStatus() {
    if (this.post.Group.configuration &&
      this.post.Group.configuration.hideVoteCountUntilVoteCompleted &&
      !this.post.Group.configuration.originalHideVoteCount) {
      this.set('post.Group.configuration.hideVoteCount', false);
    }
  }

  computeActionClass(small) {
    return small ? 'action-bar' : 'action-bar';
  }

  connectedCallback() {
    super.connectedCallback()
      if (this.endorsementButtons) {
        this.$$("#actionDown").className += ' ' + 'default-buttons-color';
        this.$$("#actionUp").className += ' ' + 'default-buttons-color';
      }
  }
}

window.customElements.define('yp-post-actions-lit', YpPostActionsLit)
