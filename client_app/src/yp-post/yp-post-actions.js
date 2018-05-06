import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../paper-share-button/paper-share-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { ypRemoveClassBehavior } from '../yp-behaviors/yp-remove-class-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .action-bar {
        @apply --layout-horizontal;
        position: absolute;
        background-color: #FFF;
      }

      .action-bar[floating] {
        @apply --layout-horizontal;
        position: relative;
        background-color: #FFF;
      }

      .action-bar-small {
        @apply --layout-horizontal;
        margin-top: 8px;
        position: absolute;
        width: 100%;
        bottom: -32px;
        vertical-align: bottom !important;
      }

      .action-text {
        font-size: 18px;
        text-align: left;
        vertical-align: bottom;
        padding-top: 8px;
        margin-top: 4px;
      }

      .action-icon {
      }

      .action-up {
        @apply --layout-horizontal;
        @apply --layout-start-justified;
        color: var(--primary-up-color-lighter, rgba(0,153,0,0.55));
      }

      .action-down {
        @apply --layout-horizontal;
        @apply --layout-end-justified;
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
        @apply --layout-horizontal;
        @apply --layout-center-justified;
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

      .down-vote-icon {
        margin-right: 0px;
      }

      paper-icon-button.largeButton {
        width: 52px;
        height: 52px;
      }

      paper-icon-button[smaller-icons] {
        height: 48px;
        width: 48px;
      }

      .debate-icon {
        color: #757575;
      }

      .shareIcon {
        margin-left: 16px;
        margin-top: 3px;
        --paper-share-button-icon-color: #656565;
        --paper-share-button-icon-height: 46px;
        --paper-share-button-icon-width: 46px;
        text-align: right;
      }

      .shareIcon[endorsed] {
        --paper-share-button-icon-color: var(--accent-color-400);
      }

      .shareIcon[less-margin] {
        margin-left: 0;
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
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <iron-media-query query="(max-width: 420px)" query-matches="{{small}}"></iron-media-query>

    <yp-ajax id="endorseAjax" method="POST" on-response="_endorseResponse"></yp-ajax>
    <paper-material elevation="[[elevationPlusOne]]" title\$="[[disabledTitle]]" floating\$="[[floating]]" animated="" class="action-bar layout horizontal">
      <div id="actionUp" class="action-up">
        <paper-icon-button id="iconUpButton" smaller-icons\$="[[smallerIcons]]" disabled="[[allDisabled]]" title\$="[[t('post.up_vote')]]" icon="[[endorseModeIcon(endorsementButtons,'up')]]" class="action-icon up-vote-icon largeButton" on-tap="upVote"></paper-icon-button>
        <div class="action-text up-text" hidden\$="[[post.Group.configuration.hideVoteCount]]">[[formattedUpCount]]</div>
      </div>

      <div class="action-debate" hidden\$="[[hideDebate]]">
        <paper-icon-button disabled="[[allDisabled]]" title\$="[[t('post.debate')]]" icon="chat-bubble-outline" class="action-icon debate-icon largeButton" on-tap="_goToPostIfNotHeader"></paper-icon-button>
        <div class="action-text debate-text">[[formattedPointCount]]</div>
      </div>

      <div class="" hidden\$="[[!hideDebate]]"></div>

      <div id="actionDown" class="action-down" hidden\$="[[post.Group.configuration.hideDownVoteForPost]]">
        <paper-icon-button smaller-icons\$="[[smallerIcons]]" disabled="[[allDisabled]]" title\$="[[t('post.down_vote')]]" icon="[[endorseModeIcon(endorsementButtons,'down')]]" class="action-icon down-vote-icon largeButton" on-tap="downVote"></paper-icon-button>
        <div class="action-text down-text" hidden\$="[[post.Group.configuration.hideVoteCount]]">[[formattedDownCount]]</div>
      </div>
      <div class="share">
        <paper-share-button on-share-tap="_shareTap" class="shareIcon" less-margin\$="[[post.Group.configuration.hideDownVoteForPost]]" endorsed\$="[[isEndorsed]]" horizontal-align="right" id="shareButton" title\$="[[t('post.shareInfo')]]" facebook="" google="" twitter="" popup="" url="[[postUrl]]"></paper-share-button>
      </div>
    </paper-material>

    <lite-signal on-lite-signal-got-endorsements-and-qualities="_updateEndorsementsFromSignal"></lite-signal>
`,

  is: 'yp-post-actions',

  behaviors: [
    ypLanguageBehavior,
    ypNumberFormatBehavior,
    ypRemoveClassBehavior,
    ypGotoBehavior
  ],

  properties: {
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
      computed: '_hideDebate(small,forceSmall,post)'
    }
  },

  _formattedUpCount: function (number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  },

  _formattedPointCount: function (number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  },

  _formattedDownCount: function (number) {
    if (number) {
      return this.formatNumber(number);
    } else {
      return "0";
    }
  },

  _goToPostIfNotHeader: function () {
    if (!this.headerMode) {
      this.goToPost();
    }
  },

  _postUrl: function (post) {
    if (post) {
      return encodeURIComponent("https://"+window.location.host+"/post/"+post.id);
    } else {
      console.warn("Can't find post for action");
      return "";
    }
  },

  _elevationPlusOne: function (elevation) {
    if (elevation<5) {
      return elevation + 1;
    } else {
      return elevation;
    }
  },

  _hideDebate: function (small, forceSmall) {
    return (small || forceSmall || (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.hideDebateIcon));
  },

  _onPostChanged: function (post, oldValue) {
    this.set('isEndorsed', false);
    if (post) {
      this.removeClass(this.$.actionUp,'hearts-up-selected');
      this.removeClass(this.$.actionDown, 'hearts-down-selected');
      this.removeClass(this.$.actionUp,'default-buttons-up-selected');
      this.removeClass(this.$.actionDown, 'default-buttons-down-selected');
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
      this._updateEndorsements(post);
      if (post.Group.configuration && post.Group.configuration.hideVoteCountUntilVoteCompleted) {
        this.set('post.Group.configuration.originalHideVoteCount', post.Group.configuration.hideVoteCount);
        this.set('post.Group.configuration.hideVoteCount', true);
      }
    } else {
      console.warn("No post found for post actions");
    }
  },

  _updateEndorsementsFromSignal: function () {
    if (this.post) {
      this._updateEndorsements(this.post);
    } else {
      console.warn("Trying to update post null from signal");
    }
  },

  _updateEndorsements: function (post) {
    this.set('isEndorsed', false);
    if (window.appUser && window.appUser.loggedIn() && window.appUser.user && window.appUser.user.Endorsements) {
      var thisPostsEndorsement = window.appUser.endorsementPostsIndex[post.id];
      if (thisPostsEndorsement)
        this._setEndorsement(thisPostsEndorsement.value);
    }
  },

  endorseModeIcon: function (endorsementButtons, upDown) {
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
  },

  _setEndorsement: function (value) {
    this.endorseValue = value;

    if (value>0) {
      this.set('isEndorsed', true);
    }

    if (this.endorsementButtons=='hearts') {
      if (value > 0) {
        this.$.actionUp.className += ' ' + 'hearts-up-selected';
        this.removeClass(this.$.actionDown, 'hearts-down-selected');
        this.$.iconUpButton.icon = "favorite";
      } else if (value < 0) {
        this.$.actionDown.className += ' ' + 'hearts-down-selected';
        this.removeClass(this.$.actionUp,'hearts-up-selected');
        this.$.iconUpButton.icon = "favorite-border";
      } else {
        this.removeClass(this.$.actionUp,'hearts-up-selected');
        this.removeClass(this.$.actionDown, 'hearts-down-selected');
        this.$.iconUpButton.icon = "favorite-border";
      }
    } else {
      if (value > 0) {
        this.$.actionUp.className += ' ' + 'default-buttons-up-selected';
        this.removeClass(this.$.actionDown, 'default-buttons-down-selected');
      } else if (value < 0) {
        this.$.actionDown.className += ' ' + 'default-buttons-down-selected';
        this.removeClass(this.$.actionUp,'default-buttons-up-selected');
      } else {
        this.removeClass(this.$.actionUp,'default-buttons-up-selected');
        this.removeClass(this.$.actionDown, 'default-buttons-down-selected');
      }
    }
  },

  _enableVoting: function () {
    if (!this.votingDisabled) {
      this.set('allDisabled', false);
    }
  },

  _endorseResponse: function (event, detail) {
    this._enableVoting();
    var endorsement = detail.response.endorsement;
    var oldEndorsementValue = detail.response.oldEndorsementValue;
    this._setEndorsement(endorsement.value);
    window.appUser.updateEndorsementForPost(this.post.id, endorsement);
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
  },

  generateEndorsementFromLogin: function (value) {
    if (!window.appUser.endorsementPostsIndex[this.post.id]) {
      this.generateEndorsement(value);
    }
  },

  generateEndorsement: function (value) {
    if (window.appUser.loggedIn()===true) {
      this.$.endorseAjax.url = '/api/posts/' + this.post.id + '/endorse';
      this.$.endorseAjax.body = { post_id: this.post.id, value: value };
      if (this.endorseValue === value) {
        this.$.endorseAjax.method = 'DELETE';
      } else {
        this.$.endorseAjax.method = 'POST';
      }
      this.$.endorseAjax.generateRequest();
    } else {
      this._enableVoting();
      window.appUser.loginForEndorse(this, { value: value } );
    }
  },

  _shareTap: function (event, detail) {
    window.appGlobals.activity('postShareOpen', detail.brand, this.post.id);
  },

  upVote: function (event) {
    this.set('allDisabled', true);
    this.generateEndorsement(1);
    window.appGlobals.activity('clicked', 'endorse_up', this.post.id);
    this.set('isEndorsed', true);
    this.updateStyles();
    this._setVoteHidingStatus();
  },

  downVote: function (event) {
    this.set('allDisabled', true);
    this.generateEndorsement(-1);
    window.appGlobals.activity('clicked', 'endorse_down', this.post.id);
    this._setVoteHidingStatus();
  },

  _setVoteHidingStatus: function () {
    if (this.post.Group.configuration &&
      this.post.Group.configuration.hideVoteCountUntilVoteCompleted &&
      !this.post.Group.configuration.originalHideVoteCount) {
      this.set('post.Group.configuration.hideVoteCount', false);
    }
  },

  computeActionClass: function (small) {
    return small ? 'action-bar' : 'action-bar';
  },

  ready: function() {
    if (this.endorsementButtons) {
      this.$.actionDown.className += ' ' + 'default-buttons-color';
      this.$.actionUp.className += ' ' + 'default-buttons-color';
    }
  }
});
