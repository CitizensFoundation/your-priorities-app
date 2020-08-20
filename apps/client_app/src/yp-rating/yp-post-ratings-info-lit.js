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
import { styles } from 'chalk';

class YpPostRatingsInfoLit extends YpBaseElement {
  static get properties() {
    return {
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
    } 
  }


  static get styles() {
    return [
      css`
    
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
    `, YpFlexLayout]
  }
    
  render() {
    return html`
      <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>

      <iron-media-query query="(max-width: 420px)" query-matches="${this.small}"></iron-media-query>
      <div class="layout vertical center-center topDiv" votingDisabled="${this.votingDisabled}" .ariaLabel="${this.t('evaluatePost')}" .title="${this.t('evaluatePost')}" on-tap="openRatingsDialog">
        <div id="ratingContainerMain" class="ratingContainerMain layout horizontal center-center  wrap" style="display: flex; justify-content: flex-end" .cardMode="${this.cardMode}">
          ${ this.items.map(post => html`
            <div class="layout horizontal ratingContainer" widtha="${this.hasWidthA}" widthb="${this.hasWidthB}" widthc="${this.hasWidthC}" widthd="${this.hasWidthD}">
              <yp-rating .title="${this.rating.name}" read-only postId="${this.post.id}" ratingIndex="${this.index}" .votingDisabled="${this.votingDisabled}" emoji="${this.rating.emoji}" rate="${this.getRating(index)}" .numberOf="${this.rating.numberOf}"></yp-rating>
              <div class="ratingsCount">${this.getRatingsCount(index)}</div>
            </div>
          `)}
        </div>
      </div>
    `
  }
  
/*
  behaviors: [
    ypLanguageBehavior,
    ypNumberFormatBehavior,
    ypRemoveClassBehavior,
    ypGotoBehavior
  ],
*/

  getRating(ratingIndex) {
    if (this.post.public_data && this.post.public_data.ratings && this.post.public_data.ratings[ratingIndex])
      return this.post.public_data.ratings[ratingIndex].averageRating;
    else
      return 0;
  }

  getRatingsCount(ratingIndex) {
    if (this.post.public_data && this.post.public_data.ratings && this.post.public_data.ratings[ratingIndex])
      return this.formatNumber(this.post.public_data.ratings[ratingIndex].count);
//          return this.formatNumber(1*(Math.floor(Math.random() * 10000) + 1)) //this.formatNumber(this.post.public_data.ratings[ratingIndex].count);
    else
      return 0;
  }

  _fireRefresh() {
    this.fire("refresh", {id: this.post.id});
  }

  openRatingsDialog() {
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
  }

  _onPostChanged(post, oldValue) {
    this.isEndorsed = false;
    if (post) {
      if (post.Group.configuration && post.Group.configuration.customRatings) {
          if (post.Group.configuration.canVote===false){
              this.votingDisabled = true;
          } else {
              this.votingDisabled = false;
          }

          this.customRatings = [];
          this.async(function () {
              this.customRatings = post.Group.configuration.customRatings.slice(0,4);
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
            this.hasWidthA = true;
            this.hasWidthB = false;
            this.hasWidthC = false;
            this.hasWidthD = false;
            this.$$("#ratingContainerMain").style.maxWidth="285px";
          } else if (maxCount>1000) {
            this.hasWidthA =false;
            this.hasWidthB = true;
            this.hasWidthC = false;
            this.hasWidthD = false;
            this.$$("#ratingContainerMain").style.maxWidth="255px";
          } else if (maxCount>10) {
            this.hasWidthA = false;
            this.hasWidthB = false;
            this.hasWidthC = true;
            this.hasWidthD = false;
            this.$$("#ratingContainerMain").style.maxWidth="235px";
         }  else {
            this.hasWidthA = false;
            this.hasWidthB = false;
            this.hasWidthC = false;
            this.hasWidthD = true;
            this.$$("#ratingContainerMain").style.maxWidth="215px";
          }
      }
      if (post.Group.configuration && post.Group.configuration.canVote!=undefined && post.Group.configuration.canVote==false) {
          this.votingDisabled = true;
          this.allDisabled = true;
          this.disabledTitle = this.t('votingDisabled');
      } else {
          this.votingDisabled = false;
          this.allDisabled = false;
      }

      if (post.Group.configuration) {
          this.post.Group.configuration.originalHideVoteCount = post.Group.configuration.hideVoteCount;
          if (post.Group.configuration.hideVoteCountUntilVoteCompleted) {
              this.post.Group.configuration.hideVoteCount = true;
          }
      }
    } else {
      this.customRatings = post.Group.configuration.null;
      console.warn("No post found for post actions");
    }
  }
}

window.customElements.define('yp-post-ratings-info-lit', YpPostRatingsInfoLit)
