import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-input/paper-input.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import '../../../../@polymer/paper-checkbox/paper-checkbox.js';
import '../yp-file-upload/yp-file-upload.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypCollectionStatusOptions } from '../yp-behaviors/yp-collection-status-options.js';
import '../yp-behaviors/emoji-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import '../yp-theme/yp-theme-selector.js';
import '../yp-app-globals/yp-language-selector.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      .access {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      .accessHeader {
        color: var(--primary-color,#777);
        font-weight: normal;
        margin-bottom: 0;
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

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings">
          <yp-file-upload id="logoImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_logoImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.logo.upload')]]</span>
          </yp-file-upload>
        </div>

        <div class="layout vertical additionalSettings">
          <yp-file-upload id="headerImageUpload" raised="true" multi="false" target="/api/images?itemType=group-header" method="POST" on-success="_headerImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('image.header.upload')]]</span>
          </yp-file-upload>
        </div>

        <input type="hidden" name="uploadedLogoImageId" value="[[uploadedLogoImageId]]">
        <input type="hidden" name="uploadedHeaderImageId" value="[[uploadedHeaderImageId]]">
      </div>

      <div class="layout vertical">
        <div class="layout vertica config">
          <yp-theme-selector object="[[group]]" selected-theme="{{themeId}}"></yp-theme-selector>
          <div class="layout vertical">
            <paper-dropdown-menu label="[[t('status.select')]]">
              <paper-listbox slot="dropdown-content" attr-for-selected="name" selected="{{status}}">
                <template is="dom-repeat" items="[[collectionStatusOptions]]" as="statusOption">
                  <paper-item name="[[statusOption.name]]">[[statusOption.translatedName]]</paper-item>
                </template>
              </paper-listbox>
            </paper-dropdown-menu>

            <input type="hidden" name="status" value="[[status]]">

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
          </div>
        </div>
        <div class="layout vertical config">
          <paper-checkbox name="canVote" checked\$="{{canVote}}">[[t('group.canVote')]]</paper-checkbox>
          <paper-checkbox name="canAddNewPosts" checked\$="{{canAddNewPosts}}">[[t('group.canAddNewPosts')]]</paper-checkbox>
          <paper-checkbox name="disableDebate" checked\$="{{group.configuration.disableDebate}}">[[t('disableDebate')]]</paper-checkbox>
          <paper-checkbox name="locationHidden" checked\$="{{locationHidden}}">[[t('group.locationHidden')]]</paper-checkbox>
          <paper-checkbox name="showWhoPostedPosts" checked\$="{{showWhoPostedPosts}}">[[t('group.showWhoPostedPosts')]]</paper-checkbox>
        </div>
      </div>

      <input type="hidden" name="canVote" value\$="[[canVote]]">
      <input type="hidden" name="canAddNewPosts" value\$="[[canAddNewPosts]]">
      <input type="hidden" name="locationHidden" value\$="[[locationHidden]]">
      <input type="hidden" name="showWhoPostedPosts" value\$="[[showWhoPostedPosts]]">

      <input type="hidden" name="themeId" value="[[themeId]]">

      <yp-language-selector name="defaultLocale" no-user-events="" selected-locale="{{group.configuration.defaultLocale}}"></yp-language-selector>

      <h3 class="accessHeader">[[t('access')]]</h3>
      <paper-radio-group id="access" name="access" class="access" selected="{{groupAccess}}">
        <paper-radio-button name="public" hidden\$="[[!publicCommunity]]">[[t('group.public')]]</paper-radio-button>
        <paper-radio-button name="open_to_community" hidden\$="[[publicCommunity]]">[[t('group.openToCommunity')]]</paper-radio-button>
        <paper-radio-button name="closed">[[t('group.closed')]]</paper-radio-button>
        <paper-radio-button name="secret">[[t('group.secret')]]</paper-radio-button>
      </paper-radio-group>

      <hr>

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings">
          <yp-file-upload id="defaultPostImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_defaultPostImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('defaultPostImage')]]</span>
          </yp-file-upload>
        </div>

        <input type="hidden" name="uploadedDefaultPostImageId" value="[[uploadedDefaultPostImageId]]">
      </div>

      <div class="layout vertical config">
        <h2>[[t('additionalGroupConfig')]]</h2>
        <paper-checkbox name="attachmentsEnabled" checked\$="{{group.configuration.attachmentsEnabled}}">[[t('attachmentsEnabled')]]</paper-checkbox>
        <paper-checkbox name="moreContactInformation" checked\$="{{group.configuration.moreContactInformation}}">[[t('moreContactInformation')]]</paper-checkbox>
        <paper-checkbox name="hideAllTabs" checked\$="{{hideAllTabs}}">[[t('hideAllTabs')]]</paper-checkbox>
        <paper-checkbox name="hideNewPostOnPostPage" checked\$="{{hideNewPostOnPostPage}}">[[t('hideNewPostOnPostPage')]]</paper-checkbox>
        <paper-checkbox name="newPointOptional" checked\$="{{newPointOptional}}">[[t('newPointOptional')]]</paper-checkbox>
        <paper-checkbox name="hideHelpIcon" checked\$="{{hideHelpIcon}}">[[t('hideHelpIcon')]]</paper-checkbox>
        <paper-checkbox name="hideEmoji" checked\$="{{hideEmoji}}">[[t('hideEmoji')]]</paper-checkbox>
        <paper-checkbox name="hideGroupHeader" checked\$="{{hideGroupHeader}}">[[t('hideGroupHeader')]]</paper-checkbox>
        <paper-checkbox name="hidePointAuthor" checked\$="{{group.configuration.hidePointAuthor}}">[[t('hidePointAuthor')]]</paper-checkbox>
        <paper-checkbox name="hideDownVoteForPost" checked\$="{{group.configuration.hideDownVoteForPost}}">[[t('hideDownVoteForPost')]]</paper-checkbox>
        <paper-checkbox name="hidePostAuthor" checked\$="{{group.configuration.hidePostAuthor}}">[[t('hidePostAuthor')]]</paper-checkbox>
        <paper-checkbox name="allowAnonymousUsers" checked\$="{{group.configuration.allowAnonymousUsers}}">[[t('allowAnonymousUsers')]]</paper-checkbox>
        <paper-checkbox name="allowAnonymousAutoLogin" checked\$="{{group.configuration.allowAnonymousAutoLogin}}">[[t('allowAnonymousAutoLogin')]]</paper-checkbox>
        <paper-checkbox name="disableFacebookLoginForGroup" checked\$="{{group.configuration.disableFacebookLoginForGroup}}">[[t('disableFacebookLoginForGroup')]]</paper-checkbox>
        <paper-checkbox name="disableNameAutoTranslation" checked\$="{{group.configuration.disableNameAutoTranslation}}">[[t('disableNameAutoTranslation')]]</paper-checkbox>
        <paper-checkbox name="hideNewPost" checked\$="{{group.configuration.hideNewPost}}">[[t('hideNewPost')]]</paper-checkbox>
        <paper-checkbox name="hideVoteCount" checked\$="{{group.configuration.hideVoteCount}}">[[t('hideVoteCount')]]</paper-checkbox>
        <paper-checkbox name="hideVoteCountUntilVoteCompleted" checked\$="{{group.configuration.hideVoteCountUntilVoteCompleted}}">[[t('hideVoteCountUntilVoteCompleted')]]</paper-checkbox>
        <paper-checkbox name="hidePostCover" checked\$="{{group.configuration.hidePostCover}}">[[t('hidePostCover')]]</paper-checkbox>
        <paper-checkbox name="hidePostDescription" checked\$="{{group.configuration.hidePostDescription}}">[[t('hidePostDescription')]]</paper-checkbox>
        <paper-checkbox name="hideDebateIcon" checked\$="{{group.configuration.hideDebateIcon}}">[[t('hideDebateIcon')]]</paper-checkbox>
        <paper-checkbox name="disablePostPageLink" checked\$="{{group.configuration.disablePostPageLink}}">[[t('disablePostPageLink')]]</paper-checkbox>
      </div>

      <paper-input id="defaultLocationLongLat" name="defaultLocationLongLat" type="text" label="[[t('defaultLocationLongLat')]]" value="{{group.defaultLocationLongLat}}" maxlength="100" style="width: 300px;">
      </paper-input>

      <input type="hidden" name="hideAllTabs" value\$="[[hideAllTabs]]">
      <input type="hidden" name="hideNewPostOnPostPage" value\$="[[hideNewPostOnPostPage]]">
      <input type="hidden" name="newPointOptional" value\$="[[newPointOptional]]">
      <input type="hidden" name="hideHelpIcon" value\$="[[hideHelpIcon]]">
      <input type="hidden" name="hideEmoji" value\$="[[hideEmoji]]">
      <input type="hidden" name="hideGroupHeader" value\$="[[hideGroupHeader]]">

      <paper-input id="alternativePointForHeader" name="alternativePointForHeader" type="text" label="[[t('alternativePointForHeader')]]" value="{{group.configuration.alternativePointForHeader}}" maxlength="100" char-counter="">
      </paper-input>

      <paper-input id="alternativePointAgainstHeader" name="alternativePointAgainstHeader" type="text" label="[[t('alternativePointAgainstHeader')]]" value="{{group.configuration.alternativePointAgainstHeader}}" maxlength="100" char-counter="">
      </paper-input>

      <paper-input id="alternativePointForLabel" name="alternativePointForLabel" type="text" label="[[t('alternativePointForLabel')]]" value="{{group.configuration.alternativePointForLabel}}" maxlength="100" char-counter="">
      </paper-input>

      <paper-input id="alternativePointAgainstLabel" name="alternativePointAgainstLabel" type="text" label="[[t('alternativePointAgainstLabel')]]" value="{{group.configuration.alternativePointAgainstLabel}}" maxlength="100" char-counter="">
      </paper-input>

      <paper-input id="postDescriptionLimit" name="postDescriptionLimit" type="text" label="[[t('postDescriptionLimit')]]" value="{{group.configuration.postDescriptionLimit}}" maxlength="4" char-counter="">
      </paper-input>

      <paper-input id="externalGoalTriggerUrl" name="externalGoalTriggerUrl" type="text" label="[[t('externalGoalTriggerUrl')]]" value="{{group.configuration.externalGoalTriggerUrl}}">
      </paper-input>

      <div class="layout horizontal">
        <div class="layout vertical additionalSettings">
          <yp-file-upload id="defaultDataImageUpload" raised="true" multi="false" target="/api/images?itemType=group-logo" method="POST" on-success="_defaultDataImageUploaded">
            <iron-icon class="icon" icon="photo-camera"></iron-icon>
            <span>[[t('defaultDataImage')]]</span>
          </yp-file-upload>
        </div>

        <input type="hidden" name="uploadedDefaultDataImageId" value="[[uploadedDefaultDataImageId]]">
      </div>

      <div class="layout vertical config" hidden\$="[[!group.Categories]]">
        <h2>[[t('categories.the_all')]]</h2>
        <template is="dom-repeat" items="[[group.Categories]]" as="category">
          <paper-item data-category\$="[[category]]" data-category-name\$="[[category.name]]" on-tap="_openCategoryEdit">
            <img sizing="cover" height="24" width="24" class="filterIcon" src="[[_categoryImageSrc(category)]]">
            <span class="categoryName">[[category.name]]</span>
          </paper-item>
        </template>
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
    ypImageFormatsBehavior
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

    endorsementButtons: String
  },

  observers: [
    '_setupTranslation(language,t)'
  ],

  _openCategoryEdit: function (event) {
    window.appGlobals.activity('open', 'category.new');
    dom(document).querySelector('yp-app').getDialogAsync("categoryEdit", function (dialog) {
      debugger;
      dialog.setup(this.group, false, this._refreshCategories.bind(this), event.model.category);
      dialog.open("edit", {categoryId: event.model.category.id});
    }.bind(this));
  },

  _refreshCategories: function (newCategory) {
    var newCategories = [];
    __.each(this.group.Categories, function (oldCategory) {
      if (oldCategory.id===newCategory.id) {
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

  _endorsementButtonsOptions: function(language) {
    if (this.t) {
      return [
        {name: 'hearts', translatedName: this.t('endorsementButtonsHeart')},
        {name: 'arrows', translatedName: this.t('endorsementArrows') },
        {name: 'thumbs', translatedName: this.t('endorsementThumbs') },
        {name: 'hats', translatedName: this.t('endorsementHats') }
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
    if (group) {
      return group.Community.access==0
    }
  },

  _customRedirect: function (group) {
    if (group) {
      window.appUser.recheckAdminRights();
      this.redirectTo("/group/"+group.id);
    } else {
      console.warn('No group found on custom redirect');
    }
  },

  _groupChanged: function (newValue, oldValue) {
    if (this.group) {
      if (this.group.access==0) {
        this.groupAccess = "public"
      } else if (this.group.access==1) {
        this.groupAccess = "closed"
      } else if (this.group.access==2) {
        this.groupAccess = "secret"
      } else if (this.group.access==3) {
        this.groupAccess = "open_to_community"
      }

      if (this.group && this.group.status) {
        this.set('status', this.group.status);
      }

      if (this.group.configuration && this.group.configuration.canVote!=undefined) {
        this.set('canVote', this.group.configuration.canVote);
        this.set('canAddNewPosts', this.group.configuration.canAddNewPosts);
      } else {
        this.set('canVote', true);
        this.set('canAddNewPosts', true);
      }

      if (this.group.configuration && this.group.configuration.endorsementButtons!=undefined) {
        this.set('endorsementButtons', this.group.configuration.endorsementButtons);
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

      if (this.community) {
        if (this.community.access==0) {
          this.set('publicCommunity', true);
        } else {
          this.set('publicCommunity', false);
        }
      } else if (this.group && this.group.Community) {
        if (this.group.Community.access==0) {
          this.set('publicCommunity', true);
        } else {
          this.set('publicCommunity', false);
        }
      }
    }
    this._updateEmojiBindings();
  },

  _setFromConfiguration: function (propertyName) {
    if (this.group.configuration && this.group.configuration[propertyName]!=undefined && this.group.configuration[propertyName]!="") {
      this.set(propertyName, this.group.configuration[propertyName]);
    } else {
      this.set(propertyName, false);
    }
  },

  _clear: function () {
    this.set('group', { name: '', objectives: '', access: 0, status: 'active' });
    this.set('uploadedLogoImageId', null);
    this.set('uploadedHeaderImageId', null);
    this.set('uploadedDefaultDataImageId', null);
    this.$.headerImageUpload.clear();
    this.$.logoImageUpload.clear();
    this.$.defaultDataImageUpload.clear();
  },

  setup: function (group, newNotEdit, refreshFunction) {
    if (!group) {
      this.set('group', { name: '', objectives: '', access: 0, status: 'active' });
    } else {
      this.set('group', group);
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
      if (this.community.access!=0) {
        this.set('groupAccess', 'open_to_community');
        this.set('group.access', 3);
        defaultAccess = 3;
      }
    } else if (this.group.Community) {
      if (this.group.Community.access!=0) {
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
