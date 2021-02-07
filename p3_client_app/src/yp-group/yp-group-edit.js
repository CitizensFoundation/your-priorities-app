import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypCollectionStatusOptions } from '../yp-behaviors/yp-collection-status-options.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-theme/yp-theme-selector.js';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .access {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      .subHeaders {
        color: #333;
        font-weight: normal;
        margin-bottom: 8px;
        margin-top: 30px;
        font-size: 22px;
        width: 100%;
        padding-bottom: 8px;
        border-bottom: 2px solid #888;
        text-align: center;
      }

      paper-radio-button {
        display: block;
      }

      .additionalSettings {
        padding-top: 8px;
      }

      yp-file-upload {
      }

      .half {
        width: 50%;
      }

      .config {
        padding: 8px;
        vertical-align: top;
      }

      paper-checkbox {
        padding-top: 8px;
      }

      .icon {
        padding-right: 8px;
      }

      paper-dropdown-menu {
        max-width: 250px;
        width: 250px;
      }

      .categoryName {
        padding-left: 8px;
      }

      [hidden] {
        display: none !important;
      }

      .uploadSection {
        max-width: 300px;
        margin: 8px;
        margin-bottom: 0;
      }

      .useVideoCover {
        margin-left: 16px;
        margin-top: 4px;
      }

      .themeOverrideInfo, .structuredQuestionsInfo {
        color: #555;
        font-style: italic;
        font-size: 14px;
      }

      .exteraTopMargin {
        margin-top: 8px;
      }

      .defaultPostImage {
        margin-top: 16px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <yp-edit-dialog name="groupEdit" id="editDialog" title="[[editHeaderText]]" icon="people" action="[[action]]" method="[[method]]" params="[[params]]" save-text="[[saveText]]" toast-text="[[toastText]]">

      <paper-input id="name" name="name" type="text" label="[[t('name')]]" value="{{group.name}}" maxlength="50" char-counter="">
      </paper-input>

      <paper-textarea id="objectives" name="objectives" value="{{group.objectives}}" always-float-label="[[group.objectives]]" label="[[t('group.objectives')]]" char-counter="" rows="2" max-rows="5" maxlength="300">
      </paper-textarea>

      <div class="horizontal end-justified layout">
        <emoji-selector id="emojiSelectorDescription"></emoji-selector>
      </div>

      <div class="layout vertical">

        <div class="subHeaders">[[t('headerMedia')]]</div>

        <div class="layout horizontal wrap">
          <div class="layout vertical additionalSettings uploadSection">
            <yp-file-upload id="logoImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_logoImageUploaded">
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>[[t('image.logo.upload')]]</span>
            </yp-file-upload>
          </div>

          <div class="layout vertical additionalSettings uploadSection">
            <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=group-header" method="POST" on-success="_headerImageUploaded">
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>[[t('image.header.upload')]]</span>
            </yp-file-upload>
          </div>

          <template is="dom-if" if="[[hasVideoUpload]]">
            <div class="layout horizontal uploadSection">
              <yp-file-upload id="videoFileUpload" raised="true" multi="false" video-upload="" method="POST" on-success="_videoUploaded">
                <iron-icon class="icon" icon="videocam"></iron-icon>
                <span>[[t('uploadVideo')]]</span>
              </yp-file-upload>
              <paper-checkbox class="useVideoCover" name="useVideoCover" disabled\$="[[!uploadedVideoId]]" checked\$="{{group.configuration.useVideoCover}}">[[t('useVideoCover')]]
              </paper-checkbox>
            </div>
          </template>

          <input type="hidden" name="uploadedLogoImageId" value="[[uploadedLogoImageId]]">
          <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">
        </div>

        <div class="subHeaders exteraTopMargin">[[t('access')]]</div>

        <paper-radio-group id="access" name="access" class="access" selected="{{groupAccess}}">
          <paper-radio-button name="public" hidden\$="[[!publicCommunity]]">[[t('group.public')]]</paper-radio-button>
          <paper-radio-button name="open_to_community" hidden\$="[[publicCommunity]]">[[t('group.openToCommunity')]]
          </paper-radio-button>
          <paper-radio-button name="closed">[[t('group.closed')]]</paper-radio-button>
          <paper-radio-button name="secret">[[t('group.secret')]]</paper-radio-button>
        </paper-radio-group>

        <paper-dropdown-menu label="[[t('status.select')]]">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{status}}">
            <template is="dom-repeat" items="[[collectionStatusOptions]]" as="statusOption">
              <paper-item name="[[statusOption.name]]">[[statusOption.translatedName]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-checkbox name="allowAnonymousUsers" checked\$="{{group.configuration.allowAnonymousUsers}}">
          [[t('allowAnonymousUsers')]]
        </paper-checkbox>
        <paper-checkbox name="allowAnonymousAutoLogin" checked\$="{{group.configuration.allowAnonymousAutoLogin}}">
          [[t('allowAnonymousAutoLogin')]]
        </paper-checkbox>
        <paper-checkbox name="disableFacebookLoginForGroup" checked\$="{{group.configuration.disableFacebookLoginForGroup}}">
          [[t('disableFacebookLoginForGroup')]]
        </paper-checkbox>
        <paper-checkbox name="forceSecureSamlLogin" disabled\$="[[!hasSamlLoginProvider]]" checked\$="{{group.configuration.forceSecureSamlLogin}}">[[t('forceSecureSamlLogin')]]
        </paper-checkbox>

        <paper-checkbox name="forceSecureSamlEmployeeLogin" disabled\$="[[!hasSamlLoginProvider]]" checked\$="{{group.configuration.forceSecureSamlEmployeeLogin}}">[[t('forceSecureSamlEmployeeLogin')]]
        </paper-checkbox>

        <input type="hidden" name="status" value="[[status]]">

        <div class="subHeaders">[[t('languageSettings')]]</div>

        <yp-language-selector name="defaultLocale" no-user-events="" selected-locale="{{group.configuration.defaultLocale}}"></yp-language-selector>
        <paper-checkbox name="disableNameAutoTranslation" checked\$="{{group.configuration.disableNameAutoTranslation}}">
          [[t('disableNameAutoTranslation')]]
        </paper-checkbox>

        <div class="subHeaders">[[t('themeSettings')]]</div>

        <yp-theme-selector object="[[group]]" selected-theme="{{themeId}}"></yp-theme-selector>

        <paper-input id="themeOverrideColorPrimary" name="themeOverrideColorPrimary" allowed-pattern="[#-#0-9A-Fa-f]" maxlength="7" char-counter="" label="[[t('themeOverrideColorPrimary')]]" value="{{group.configuration.themeOverrideColorPrimary}}">
          <div prefix="">#</div>
        </paper-input>

        <paper-input id="themeOverrideColorAccent" name="themeOverrideColorAccent" allowed-pattern="[#-#0-9A-Fa-f]" maxlength="7" char-counter="" label="[[t('themeOverrideColorAccent')]]" value="{{group.configuration.themeOverrideColorAccent}}">
        </paper-input>

        <div class="themeOverrideInfo">
          <em>[[t('themeOverrideColorInfo')]]</em>
        </div>

        <div class="subHeaders">[[t('postSettings')]]</div>

        <paper-checkbox name="canAddNewPosts" checked\$="{{canAddNewPosts}}">[[t('group.canAddNewPosts')]]</paper-checkbox>
        <paper-checkbox name="locationHidden" checked\$="{{locationHidden}}">[[t('group.locationHidden')]]</paper-checkbox>
        <paper-checkbox name="showWhoPostedPosts" checked\$="{{showWhoPostedPosts}}">[[t('group.showWhoPostedPosts')]]</paper-checkbox>
        <paper-checkbox name="disableDebate" checked\$="{{group.configuration.disableDebate}}">[[t('disableDebate')]]</paper-checkbox>


        <paper-input id="postDescriptionLimit" name="postDescriptionLimit" type="text" label="[[t('postDescriptionLimit')]]" value="{{group.configuration.postDescriptionLimit}}" maxlength="4" char-counter="">
        </paper-input>

        <paper-checkbox name="allowPostVideoUploads" disabled\$="[[!hasVideoUpload]]" checked\$="{{allowPostVideoUploads}}">[[t('allowPostVideoUploads')]]
        </paper-checkbox>

        <paper-input id="videoPostUploadLimitSec" name="videoPostUploadLimitSec" allowed-pattern="[0-9]" maxlength="3" type="number" disabled\$="[[!hasVideoUpload]]" label="[[t('videoPostUploadLimitSec')]]" value="{{group.configuration.videoPostUploadLimitSec}}">
        </paper-input>

        <paper-checkbox name="allowPostAudioUploads" disabled\$="[[!hasAudioUpload]]" checked\$="{{allowPostAudioUploads}}">[[t('allowPostAudioUploads')]]
        </paper-checkbox>
        <paper-input id="audioPostUploadLimitSec" name="audioPostUploadLimitSec" allowed-pattern="[0-9]" maxlength="3" type="number" disabled\$="[[!hasaudioUpload]]" label="[[t('audioPostUploadLimitSec')]]" value="{{group.configuration.audioPostUploadLimitSec}}">
        </paper-input>

        <paper-checkbox name="moreContactInformation" checked\$="{{group.configuration.moreContactInformation}}">
          [[t('moreContactInformation')]]
        </paper-checkbox>
        <paper-checkbox name="attachmentsEnabled" checked\$="{{group.configuration.attachmentsEnabled}}">
          [[t('attachmentsEnabled')]]
        </paper-checkbox>
        <paper-checkbox name="hideNewPost" checked\$="{{group.configuration.hideNewPost}}">[[t('hideNewPost')]]</paper-checkbox>
        <paper-checkbox name="hideNewPostOnPostPage" checked\$="{{hideNewPostOnPostPage}}">
          [[t('hideNewPostOnPostPage')]]
        </paper-checkbox>

        <paper-checkbox name="hidePostCover" checked\$="{{group.configuration.hidePostCover}}">[[t('hidePostCover')]]
        </paper-checkbox>
        <paper-checkbox name="hidePostDescription" checked\$="{{group.configuration.hidePostDescription}}">
          [[t('hidePostDescription')]]
        </paper-checkbox>
        <paper-checkbox name="hidePostActionsInGrid" checked\$="{{group.configuration.hidePostActionsInGrid}}">
          [[t('hidePostActionsInGrid')]]
        </paper-checkbox>
        <paper-checkbox name="hideDebateIcon" checked\$="{{group.configuration.hideDebateIcon}}">
          [[t('hideDebateIcon')]]
        </paper-checkbox>
        <paper-checkbox name="hideSharing" checked\$="{{group.configuration.hideSharing}}">
          [[t('hideSharing')]]
        </paper-checkbox>
        <paper-checkbox name="hideEmoji" checked\$="{{hideEmoji}}">[[t('hideEmoji')]]</paper-checkbox>

        <paper-checkbox name="hidePostFilterAndSearch" checked\$="{{group.configuration.hidePostFilterAndSearch}}">
          [[t('hidePostFilterAndSearch')]]
        </paper-checkbox>
        <paper-checkbox name="hidePostImageUploads" disabled\$="[[!hasVideoUpload]]" checked\$="{{group.configuration.hidePostImageUploads}}">[[t('hidePostImageUploads')]]
        </paper-checkbox>
        <paper-checkbox name="disablePostPageLink" checked\$="{{group.configuration.disablePostPageLink}}">
          [[t('disablePostPageLink')]]
        </paper-checkbox>

        <paper-input id="defaultLocationLongLat" name="defaultLocationLongLat" type="text" label="[[t('defaultLocationLongLat')]]" value="{{group.defaultLocationLongLat}}" maxlength="100" style="width: 300px;">
        </paper-input>

        <paper-textarea id="structuredQuestions" name="structuredQuestions" type="text" rows="2" always-float-label="[[group.configuration.structuredQuestions]]" maxrows="2" label="[[t('structuredQuestions')]]" value="{{group.configuration.structuredQuestions}}">
        </paper-textarea>
        <div class="structuredQuestionsInfo">[[t('structuredQuestionsInfo')]]</div>

        <div class="layout vertical additionalSettings defaultPostImage">
          <yp-file-upload id="defaultPostImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_defaultPostImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('defaultPostImage')]]</span>
          </yp-file-upload>
        </div>

        <div class="layout horizontal">
          <div class="layout vertical additionalSettings">
            <yp-file-upload id="defaultDataImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_defaultDataImageUploaded">
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>[[t('defaultDataImage')]]</span>
            </yp-file-upload>
          </div>

          <input type="hidden" name="uploadedDefaultDataImageId" value="[[uploadedDefaultDataImageId]]">
        </div>

        <input type="hidden" name="canVote" value\$="[[canVote]]">
        <input type="hidden" name="canAddNewPosts" value\$="[[canAddNewPosts]]">
        <input type="hidden" name="locationHidden" value\$="[[locationHidden]]">
        <input type="hidden" name="showWhoPostedPosts" value\$="[[showWhoPostedPosts]]">
        <input type="hidden" name="themeId" value="[[themeId]]">
        <input type="hidden" name="uploadedDefaultPostImageId" value="[[uploadedDefaultPostImageId]]">

        <div class="subHeaders exteraTopMargin">[[t('voteSettings')]]</div>

        <div class="layout horizontal">
          <paper-dropdown-menu label="[[t('endorsementButtons')]]">
            <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{endorsementButtons}}">
              <template is="dom-repeat" items="[[endorsementButtonsOptions]]" as="buttonsSelection">
                <paper-item name="[[buttonsSelection.name]]">[[buttonsSelection.translatedName]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
          <input type="hidden" name="endorsementButtons" value="[[endorsementButtons]]">
        </div>
        <paper-checkbox name="canVote" checked\$="{{canVote}}">[[t('group.canVote')]]</paper-checkbox>
        <paper-checkbox name="hideVoteCount" checked\$="{{group.configuration.hideVoteCount}}">[[t('hideVoteCount')]]
        </paper-checkbox>
        <paper-checkbox name="hideVoteCountUntilVoteCompleted" checked\$="{{group.configuration.hideVoteCountUntilVoteCompleted}}">
          [[t('hideVoteCountUntilVoteCompleted')]]
        </paper-checkbox>
        <paper-checkbox name="hideDownVoteForPost" checked\$="{{group.configuration.hideDownVoteForPost}}">
          [[t('hideDownVoteForPost')]]
        </paper-checkbox>

        <paper-input id="customVoteUpHoverText" name="customVoteUpHoverText" type="text" label="[[t('customVoteUpHoverText')]]" value="{{group.configuration.customVoteUpHoverText}}" maxlength="100" char-counter="">
        </paper-input>

        <paper-input id="customVoteDownHoverText" name="customVoteDownHoverText" type="text" label="[[t('customVoteDownHoverText')]]" value="{{group.configuration.customVoteDownHoverText}}" maxlength="100" char-counter="">
        </paper-input>

        <div class="subHeaders">[[t('pointSettings')]]</div>

        <paper-checkbox name="newPointOptional" checked\$="{{newPointOptional}}">[[t('newPointOptional')]]</paper-checkbox>
        <paper-checkbox name="hideNewPointOnNewIdea" checked\$="{{group.configuration.hideNewPointOnNewIdea}}">[[t('hideNewPointOnNewIdea')]]</paper-checkbox>
        <paper-checkbox name="hidePointAuthor" checked\$="{{group.configuration.hidePointAuthor}}">
          [[t('hidePointAuthor')]]
        </paper-checkbox>

        <paper-input id="alternativePointForHeader" name="alternativePointForHeader" type="text" label="[[t('alternativePointForHeader')]]" value="{{group.configuration.alternativePointForHeader}}" maxlength="100" char-counter="">
        </paper-input>

        <paper-input id="alternativePointAgainstHeader" name="alternativePointAgainstHeader" type="text" label="[[t('alternativePointAgainstHeader')]]" value="{{group.configuration.alternativePointAgainstHeader}}" maxlength="100" char-counter="">
        </paper-input>

        <paper-input id="alternativePointForLabel" name="alternativePointForLabel" type="text" label="[[t('alternativePointForLabel')]]" value="{{group.configuration.alternativePointForLabel}}" maxlength="100" char-counter="">
        </paper-input>

        <paper-input id="alternativePointAgainstLabel" name="alternativePointAgainstLabel" type="text" label="[[t('alternativePointAgainstLabel')]]" value="{{group.configuration.alternativePointAgainstLabel}}" maxlength="100" char-counter="">
        </paper-input>

        <paper-checkbox name="allowPointVideoUploads" disabled\$="[[!hasVideoUpload]]" checked\$="{{allowPointVideoUploads}}">[[t('allowPointVideoUploads')]]
        </paper-checkbox>
        <paper-input id="videoPointUploadLimitSec" name="videoPointUploadLimitSec" type="text" maxlength="3" allowed-pattern="[0-9]" disabled\$="[[!hasVideoUpload]]" label="[[t('videoPointUploadLimitSec')]]" value="{{group.configuration.videoPointUploadLimitSec}}">
        </paper-input>

        <paper-checkbox name="allowPointAudioUploads" disabled\$="[[!hasAudioUpload]]" checked\$="{{allowPointAudioUploads}}">[[t('allowPointAudioUploads')]]
        </paper-checkbox>
        <paper-input id="audioPointUploadLimitSec" name="audioPointUploadLimitSec" type="text" maxlength="3" allowed-pattern="[0-9]" disabled\$="[[!hasaudioUpload]]" label="[[t('audioPointUploadLimitSec')]]" value="{{group.configuration.audioPointUploadLimitSec}}">
        </paper-input>

        <div class="subHeaders">[[t('additionalGroupConfig')]]</div>
        <paper-checkbox name="hideAllTabs" checked\$="{{hideAllTabs}}">[[t('hideAllTabs')]]</paper-checkbox>
        <paper-checkbox name="hideHelpIcon" checked\$="{{hideHelpIcon}}">[[t('hideHelpIcon')]]</paper-checkbox>
        <paper-checkbox name="hideGroupHeader" checked\$="{{hideGroupHeader}}">[[t('hideGroupHeader')]]</paper-checkbox>

        <paper-input id="maxDaysBackForRecommendations" name="maxDaysBackForRecommendations" type="text" maxlength="4" allowed-pattern="[0-9]" label="[[t('maxDaysBackForRecommendations')]]" value="{{group.configuration.maxDaysBackForRecommendations}}">
        </paper-input>

        <paper-input id="externalGoalTriggerUrl" name="externalGoalTriggerUrl" type="text" label="[[t('externalGoalTriggerUrl')]]" value="{{group.configuration.externalGoalTriggerUrl}}">
        </paper-input>

        <paper-input id="customBackURL" name="customBackURL" type="text" maxlength="256" label="[[t('customBackURL')]]" value="{{group.configuration.customBackURL}}">
        </paper-input>

        <paper-input id="customBackName" name="customBackName" type="text" maxlength="20" label="[[t('customBackName')]]" value="{{group.configuration.customBackName}}">
        </paper-input>

        <input type="hidden" name="hideAllTabs" value\$="[[hideAllTabs]]">
        <input type="hidden" name="hideNewPostOnPostPage" value\$="[[hideNewPostOnPostPage]]">
        <input type="hidden" name="newPointOptional" value\$="[[newPointOptional]]">
        <input type="hidden" name="hideHelpIcon" value\$="[[hideHelpIcon]]">
        <input type="hidden" name="hideEmoji" value\$="[[hideEmoji]]">
        <input type="hidden" name="hideGroupHeader" value\$="[[hideGroupHeader]]">
        <input type="hidden" name="allowPostVideoUploads" value\$="[[allowPostVideoUploads]]">
        <input type="hidden" name="allowPointVideoUploads" value\$="[[allowPointVideoUploads]]">
        <input type="hidden" name="allowPostAudioUploads" value\$="[[allowPostAudioUploads]]">
        <input type="hidden" name="allowPointAudioUploads" value\$="[[allowPointAudioUploads]]">

        <div class="layout vertical config" hidden\$="[[!group.Categories]]">
          <div class="subHeaders">[[t('categories.the_all')]]</div>
          <template is="dom-repeat" items="[[group.Categories]]" as="category">
            <paper-item data-category\$="[[category]]" data-category-name\$="[[category.name]]" on-tap="_openCategoryEdit">
              <img sizing="cover" height="24" width="24" class="filterIcon" src="[[_categoryImageSrc(category)]]">
              <span class="categoryName">[[category.name]]</span>
            </paper-item>
          </template>
        </div>
      </div>

    </yp-edit-dialog>
`,

  //TODO: Try to eliminate configuration boiler-plate
  is: 'yp-group-edit',

  behaviors: [
    ypLanguageBehavior,
    ypEditDialogBehavior,
    ypCollectionStatusOptions,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],

  properties: {

    canVote: {
      type: Boolean,
      value: true
    },

    canAddNewPosts: {
      type: Boolean,
      value: true
    },

    showWhoPostedPosts: {
      type: Boolean,
      value: false
    },

    hideAllTabs: Boolean,
    hideNewPostOnPostPage: Boolean,
    newPointOptional: Boolean,
    hideHelpIcon: Boolean,
    hideEmoji: Boolean,
    hideGroupHeader: Boolean,

    action: {
      type: String,
      value: "/api/groups"
    },

    group: {
      type: Object,
      observer: "_groupChanged"
    },

    community: {
      type: Object
    },

    groupAccess: {
      type: String,
      value: "public"
    },

    uploadedLogoImageId: {
      type: String
    },

    uploadedHeaderImageId: {
      type: String
    },

    uploadedDefaultDataImageId: {
      type: String
    },

    uploadedDefaultPostImageId: {
      type: String
    },

    allowPostVideoUploads: {
      type: Boolean,
      value: null
    },

    allowPointVideoUploads: {
      type: Boolean,
      value: null
    },

    allowPostAudioUploads: {
      type: Boolean,
      value: null
    },

    allowPointAudioUploads: {
      type: Boolean,
      value: null
    },

    status: String,

    publicCommunity: {
      type: Boolean,
      value: false
    },

    themeId: {
      type: String,
      value: null
    },

    locationHidden: Boolean,

    endorsementButtonsOptions: {
      type: Object,
      computed: '_endorsementButtonsOptions(language)'
    },

    endorsementButtons: String,

    hasSamlLoginProvider: {
      type: Boolean,
      value: false
    },

    hasVideoUpload: {
      type: Boolean,
      value: false
    },

    hasAudioUpload: {
      type: Boolean,
      value: false
    },

    uploadedVideoId: {
      type: Number,
      value: null
    }
  },

  _videoUploaded: function (event, detail) {
    this.set('uploadedVideoId', detail.videoId);
    this.set('group.configuration.useVideoCover', true);
  },

  observers: [
    '_setupTranslation(language,t)'
  ],

  _openCategoryEdit: function (event) {
    window.appGlobals.activity('open', 'category.new');
    dom(document).querySelector('yp-app').getDialogAsync("categoryEdit", function (dialog) {
      dialog.setup(this.group, false, this._refreshCategories.bind(this), event.model.category);
      dialog.open("edit", {categoryId: event.model.category.id});
    }.bind(this));
  },

  _refreshCategories: function (newCategory) {
    var newCategories = [];
    __.each(this.group.Categories, function (oldCategory) {
      if (oldCategory.id === newCategory.id) {
        newCategories.push(newCategory)
      } else {
        newCategories.push(oldCategory);
      }
    });
    this.set('group.Categories', newCategories);
  },

  _categoryImageSrc: function (category) {
    return this.getImageFormatUrl(category.CategoryIconImages, 0);
  },

  _endorsementButtonsOptions: function (language) {
    if (this.t) {
      return [
        {name: 'hearts', translatedName: this.t('endorsementButtonsHeart')},
        {name: 'arrows', translatedName: this.t('endorsementArrows')},
        {name: 'thumbs', translatedName: this.t('endorsementThumbs')},
        {name: 'hats', translatedName: this.t('endorsementHats')}
      ]
    } else {
      return [];
    }
  },

  _updateEmojiBindings: function () {
    this.async(function () {
      var description = this.$$("#objectives");
      var emojiSelector = this.$$("#emojiSelectorDescription");
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Group edit: Can't bind emojis :(");
      }
    }.bind(this), 500);
  },

  _publicCommunity: function (group) {
    debugger;
    if (group) {
      return group.Community.access === 0
    } else {
      return false;
    }
  },

  _customRedirect: function (group) {
    if (group) {
      window.appUser.recheckAdminRights();
      if (this.uploadedVideoId) {
        var ajax = document.createElement('iron-ajax');
        ajax.handleAs = 'json';
        ajax.contentType = 'application/json';
        ajax.url = '/api/videos/' + group.id + '/completeAndAddToGroup';
        ajax.method = 'PUT';
        ajax.body = {
          videoId: this.uploadedVideoId
        };
        ajax.addEventListener('response', function (event) {
          this._finishRedirect(group);
        }.bind(this));
        ajax.generateRequest();
      } else {
        this._finishRedirect(group);
      }
    } else {
      console.warn('No group found on custom redirect');
    }
  },

  _finishRedirect: function (group) {
    this.redirectTo("/group/" + group.id);
    window.appGlobals.activity('completed', 'editGroup');
  },

  _groupChanged: function (group, oldValue) {
    if (group) {
      if (group.access == 0) {
        this.groupAccess = "public"
      } else if (group.access == 1) {
        this.groupAccess = "closed"
      } else if (group.access == 2) {
        this.groupAccess = "secret"
      } else if (group.access == 3) {
        this.groupAccess = "open_to_community"
      }

      if (group && group.status) {
        this.set('status', group.status);
      }

      if (group.configuration && group.configuration.canVote != undefined) {
        this.set('canVote', group.configuration.canVote);
        this.set('canAddNewPosts', group.configuration.canAddNewPosts);
      } else {
        this.set('canVote', true);
        this.set('canAddNewPosts', true);
      }

      if (group.configuration && group.configuration.endorsementButtons != undefined) {
        this.set('endorsementButtons', group.configuration.endorsementButtons);
      } else {
        this.set('endorsementButtons', "hearts");
      }

      this._setFromConfiguration('locationHidden');
      this._setFromConfiguration('hideAllTabs');
      this._setFromConfiguration('hideNewPostOnPostPage');
      this._setFromConfiguration('newPointOptional');
      this._setFromConfiguration('hideHelpIcon');
      this._setFromConfiguration('hideEmoji');
      this._setFromConfiguration('hideGroupHeader');
      this._setFromConfiguration('showWhoPostedPosts');
      this._setFromConfiguration('allowPostVideoUploads', true);
      this._setFromConfiguration('allowPointVideoUploads', true);
      this._setFromConfiguration('allowPostAudioUploads', true);
      this._setFromConfiguration('allowPointAudioUploads', true);

      this.async(function () {
        if (this.community) {
          if (this.community.access == 0) {
            debugger;
            this.set('publicCommunity', true);
          } else {
            this.set('publicCommunity', false);
          }
        } else if (group && group.Community) {
          if (group.Community.access == 0) {
            this.set('publicCommunity', true);
          } else {
            this.set('publicCommunity', false);
          }
        }
      });

      if ((!group || !group.id) && window.appGlobals.hasVideoUpload) {
        if (this.allowPostVideoUploads === null) {
          this.set('allowPostVideoUploads', true);
        }
        if (this.allowPointVideoUploads === null) {
          this.set('allowPointVideoUploads', true);
        }
      }

      if (window.appGlobals.hasVideoUpload) {
        this.set('hasVideoUpload', true);
      } else {
        this.set('hasVideoUpload', false);
      }

      if ((!group || !group.id) && window.appGlobals.hasAudioUpload) {
        if (this.allowPostAudioUploads === null) {
          this.set('allowPostAudioUploads', true);
        }
        if (this.allowPointAudioUploads === null) {
          this.set('allowPointAudioUploads', true);
        }
      }

      if (window.appGlobals.hasAudioUpload) {
        this.set('hasAudioUpload', true);
      } else {
        this.set('hasAudioUpload', false);
      }
    }

    this._updateEmojiBindings();

    if (window.appGlobals.domain && window.appGlobals.domain.samlLoginProvided) {
      this.set('hasSamlLoginProvider', true);
    } else {
      this.set('hasSamlLoginProvider', false);
    }
  },

  _setFromConfiguration: function (propertyName, setNullDefault) {
    if (this.group.configuration && this.group.configuration[propertyName] != undefined && this.group.configuration[propertyName] !== "") {
      this.set(propertyName, this.group.configuration[propertyName]);
    } else {
      this.set(propertyName, setNullDefault ? null : false);
    }
  },

  _clear: function () {
    this.set('group', null);
    this.set('uploadedLogoImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.set('uploadedDefaultDataImageId', null);
    this.set('uploadedVideoId', null);

    if (this.$$("#videoFileUpload"))
      this.$$("#videoFileUpload").clear();
    if (this.$$("#headerImageUpload"))
      this.$$("#headerImageUpload").clear();
    if (this.$$("#logoImageUpload"))
      this.$$("#logoImageUpload").clear();
    if (this.$$("#defaultDataImageUpload"))
      this.$$("#defaultDataImageUpload").clear();
  },

  setup: function (group, newNotEdit, refreshFunction) {
    if (!group) {
      this.set('group', {name: '', objectives: '', access: 0, status: 'active'});
    } else {
      this.set('group', group);
      if (group.GroupLogoVideos && group.GroupLogoVideos.length > 0) {
        this.set('uploadedVideoId', group.GroupLogoVideos[0].id)
      }
    }
    this.set('new', newNotEdit);
    this.set('refreshFunction', refreshFunction);
    this._setupTranslation();
  },

  setupAfterOpen: function (params) {
    if (params.community) {
      this.community = params.community;
    }

    var defaultAccess = 0;
    if (this.community) {
      if (this.community.access != 0) {
        this.set('groupAccess', 'open_to_community');
        this.set('group.access', 3);
        defaultAccess = 3;
      }
    } else if (this.group.Community) {
      if (this.group.Community.access != 0) {
        this.set('groupAccess', 'open_to_community');
        defaultAccess = 3;
      }
    }
    this.set('group.access', defaultAccess);
  },

  _setupTranslation: function (language, t) {
    if (this.language && this.t) {
      if (this.new) {
        this.editHeaderText = this.t('group.new');
        this.toastText = this.t('groupToastCreated');
        this.set('saveText', this.t('create'));
      } else {
        this.set('saveText', this.t('save'));
        this.editHeaderText = this.t('group.update');
        this.toastText = this.t('groupToastUpdated');
      }
    }
  }
});
