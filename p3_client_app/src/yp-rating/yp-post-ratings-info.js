import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-media-query/iron-media-query.js';
import 'lite-signal/lite-signal.js';
import 'paper-share-button/paper-share-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypNumberFormatBehavior } from '../yp-behaviors/yp-number-format-behavior.js';
import { ypRemoveClassBehavior } from '../yp-behaviors/yp-remove-class-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import './yp-rating.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .ratingsCount {
        font-size: 0.6em;
        color: #aaa;
      }

      .ratingContainer {
        margin-left: 16px;
        margin-bottom: 4px;
      }

      .ratingContainer[widtha] {
        width: 125px;
      }

      .ratingContainer[widthb] {
        width: 110px;
      }

      .ratingContainer[widthc] {
        width: 100px;
      }

      .ratingContainer[widthd] {
        width: 90px;
      }

      .ratingContainerMain {
        text-align: right;
        margin-right: 8px;
        max-width: 230px;
      }

      .topDiv {
        cursor: pointer;
      }

      .topDiv[voting-disabled] {
        cursor: initial;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <iron-media-query query="(max-width: 420px)" query-matches="{{small}}"></iron-media-query>
    <div class="layout vertical center-center topDiv" voting-disabled\$="[[votingDisabled]]" aria-label="[[t('evaluatePost')]" title="[[t('evaluatePost')]]" on-tap="openRatingsDialog">
      <div id="ratingContainerMain" class="ratingContainerMain layout horizontal center-center  wrap" style="display: flex; justify-content: flex-end" card-mode\$="[[cardMode]]">
        <template is="dom-repeat" items="[[customRatings]]" as="rating">
          <div class="layout horizontal ratingContainer" widtha\$="[[hasWidthA]]" widthb\$="[[hasWidthB]]" widthc\$="[[hasWidthC]]" widthd\$="[[hasWidthD]]">
            <yp-rating title\$="[[rating.name]]" read-only="" post-id="[[post.id]]" rating-index="[[index]]" voting-disabled="[[votingDisabled]]" emoji="[[rating.emoji]]" rate="[[getRating(index)]]" number-of="[[rating.numberOf]]"></yp-rating>
            <div class="ratingsCount">[[getRatingsCount(index)]]</div>
          </div>
        </template>
      </div>
    </div>
`,

  is: 'yp-post-ratings-info',

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

    hasWidthA: {
      type: Boolean,
      value: false
    },

    hasWidthB: {
        type: Boolean,
        value: false
    },

    hasWidthC: {
        type: Boolean,
        value: false
    },

    hasWidthD: {
        type: Boolean,
        value: false
    },

    active: {
      type: Boolean,
      value: false
    },

    allDisabled: {
      type: Boolean,
      value: false
    },

    votingDisabled: {
      type: Boolean,
      value: false
    },

    customRatings: Array
  },

  getRating: function (ratingIndex) {
    if (this.post.public_data && this.post.public_data.ratings && this.post.public_data.ratings[ratingIndex])
      return this.post.public_data.ratings[ratingIndex].averageRating;
    else
      return 0;
  },

  getRatingsCount: function (ratingIndex) {
    if (this.post.public_data && this.post.public_data.ratings && this.post.public_data.ratings[ratingIndex])
      return this.formatNumber(this.post.public_data.ratings[ratingIndex].count);
//          return this.formatNumber(1*(Math.floor(Math.random() * 10000) + 1)) //this.formatNumber(this.post.public_data.ratings[ratingIndex].count);
    else
      return 0;
  },

  _fireRefresh: function () {
    this.fire("refresh", {id: this.post.id});
  },

  openRatingsDialog: function () {
    if (!this.post.Group.configuration.canVote===false) {
      window.appGlobals.activity('open', 'post.ratings');
      if (window.appUser.loggedIn()===true) {
        dom(document).querySelector('yp-app').getRatingsDialogAsync(function (dialog) {
            dialog.open(this.post, this._fireRefresh.bind(this));
        }.bind(this));
      } else {
        window.appUser.loginForRatings(this);
      }
    }
  },

  _onPostChanged: function (post, oldValue) {
    this.set('isEndorsed', false);
    if (post) {
      if (post.Group.configuration && post.Group.configuration.customRatings) {
          if (post.Group.configuration.canVote===false){
              this.set('votingDisabled', true);
          } else {
              this.set('votingDisabled', false);
          }

          this.set('customRatings', []);
          this.async(function () {
              this.set('customRatings', post.Group.configuration.customRatings.slice(0,4));
          });

          if (false) {
              var NUM = 10000000;
              if (this.post.public_data && this.post.public_data.ratings) {
                  if (this.post.public_data.ratings[0])
                      this.post.public_data.ratings[0].count = 1 * (Math.floor(Math.random() * NUM) + 1);
                  if (this.post.public_data.ratings[1])
                      this.post.public_data.ratings[1].count = 1 * (Math.floor(Math.random() * NUM) + 1);
                  if (this.post.public_data.ratings[2])
                      this.post.public_data.ratings[2].count = 1 * (Math.floor(Math.random() * NUM) + 1);
                  if (this.post.public_data.ratings[3])
                      this.post.public_data.ratings[3].count = 1 * (Math.floor(Math.random() * NUM) + 1);
              }
          }

          var maxCount = 0;
          if (this.post.public_data && this.post.public_data.ratings) {
            if (this.post.public_data && this.post.public_data.ratings) {
              for (var item in this.post.public_data.ratings) {
                if (this.post.public_data.ratings.hasOwnProperty(item)) {
                  if (this.post.public_data.ratings[item].count>maxCount) {
                    maxCount=this.post.public_data.ratings[item].count;
                  }
                }
              }
            }
          }

          if (maxCount>100000) {
            this.set('hasWidthA', true);
            this.set('hasWidthB', false);
            this.set('hasWidthC', false);
            this.set('hasWidthD', false);
            this.$$("#ratingContainerMain").style.maxWidth="285px";
          } else if (maxCount>1000) {
            this.set('hasWidthA', false);
            this.set('hasWidthB', true);
            this.set('hasWidthC', false);
            this.set('hasWidthD', false);
            this.$$("#ratingContainerMain").style.maxWidth="255px";
          } else if (maxCount>10) {
            this.set('hasWidthA', false);
            this.set('hasWidthB', false);
            this.set('hasWidthC', true);
            this.set('hasWidthD', false);
            this.$$("#ratingContainerMain").style.maxWidth="235px";
         }  else {
            this.set('hasWidthA', false);
            this.set('hasWidthB', false);
            this.set('hasWidthC', false);
            this.set('hasWidthD', true);
            this.$$("#ratingContainerMain").style.maxWidth="215px";
          }
      }
      if (post.Group.configuration && post.Group.configuration.canVote!=undefined && post.Group.configuration.canVote==false) {
          this.set('votingDisabled', true);
          this.set('allDisabled', true);
          this.set('disabledTitle', this.t('votingDisabled'));
      } else {
          this.set('votingDisabled', false);
          this.set('allDisabled', false);
      }

      if (post.Group.configuration) {
          this.set('post.Group.configuration.originalHideVoteCount', post.Group.configuration.hideVoteCount);
          if (post.Group.configuration.hideVoteCountUntilVoteCompleted) {
              this.set('post.Group.configuration.hideVoteCount', true);
          }
      }
    } else {
      this.set('customRatings', post.Group.configuration.null);
      console.warn("No post found for post actions");
    }
  }
});
