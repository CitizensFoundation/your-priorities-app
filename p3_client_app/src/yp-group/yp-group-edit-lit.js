import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../yp-file-upload/yp-file-upload.js';
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
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpGroupEditLit extends YpBaseElement {
  static get properties() {
    return {
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

      endorsementButtonsDisabled: {
        type: Boolean,
        value: false
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
      },

      structuredQuestionsJsonError: {
        type: Boolean,
        value: false
      },

      maxObjectivesLength: {
        type: Number,
        value: 300
      }
    }
  }

  static get styles() {
    return [
      css`

      .access {

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

      #structuredQuestionsJsonErrorInfo {
        margin-top: 0px;
        margin-bottom: 8px;
        color: #F00;
        font-weight: bold;
      }
    `, YpFlexLayout]
  }

render() {
  return html`
    <yp-edit-dialog .name="groupEdit" id="editDialog" .title="${this.editHeaderText}" .icon="people" .action="${this.action}" .method="${this.method}" .params="${this.params}" .saveText="${this.saveText}" .toastText="${this.toastText}">

      <paper-input id="name" .name="name" .type="text" .label="${this.t('name')}" .value="${this.group.name}" .maxlength="50" char-counter>
      </paper-input>

      <paper-textarea id="objectives" .name="objectives" .value="${this.group.objectives}"
        always-float-label="${this.group.objectives}" label="${this.t('group.objectives')}"
        char-counter .rows="2"
        .max-rows="5"
        @value-changed="${this._objectivesChanged}"
        max-rows="5"
        maxlength="[[maxObjectivesLength]]">
      </paper-textarea>

      <div class="horizontal end-justified layout">
        <emoji-selector id="emojiSelectorDescription"></emoji-selector>
      </div>

      <div class="layout vertical">

        <div class="subHeaders">${this.t('headerMedia')}</div>

        <div class="layout horizontal wrap">
          <div class="layout vertical additionalSettings uploadSection">
            <yp-file-upload id="logoImageUpload" raised target="/api/images?itemType=group-logo" .method="POST" @success="${this._logoImageUploaded}">
              <iron-icon class="icon" .icon="photo-camera"></iron-icon>
              <span>${this.t('image.logo.upload')}</span>
            </yp-file-upload>
          </div>

          <div class="layout vertical additionalSettings uploadSection">
            <yp-file-upload id="headerImageUpload" raised target="/api/images?itemType=group-header" .method="POST" on-success="_headerImageUploaded">
              <iron-icon class="icon" .icon="photo-camera"></iron-icon>
              <span>${this.t('image.header.upload')}</span>
            </yp-file-upload>
          </div>

          ${ this.hasVideoUpload ? html`
            <div class="layout horizontal uploadSection">
              <yp-file-upload id="videoFileUpload" raised video-upload="" .method="POST" @success="${this._videoUploaded}">
                <iron-icon class="icon" .icon="videocam"></iron-icon>
                <span>${this.t('uploadVideo')}</span>
              </yp-file-upload>
              <paper-checkbox class="useVideoCover" .name="useVideoCover" ?disabled="${!this.uploadedVideoId}" .checked="${this.group.configuration.useVideoCover}">${this.t('useVideoCover')}
              </paper-checkbox>
            </div>
          ` : html``}

          <input .type="hidden" .name="uploadedLogoImageId" .value="${this.uploadedLogoImageId}">
          <input .type="hidden" .name="uploadedHeaderImageId" .value="${this.uploadedHeaderImageId}">
        </div>

        <div class="subHeaders exteraTopMargin">${this.t('access')}</div>

        <paper-radio-group id="access" .name="access" class="access" selected="${this.groupAccess}">
          <paper-radio-button name="open_to_community">${this.t('group.openToCommunity')}</paper-radio-button>
          <paper-radio-button name="public">${this.t('group.public')}</paper-radio-button>
          <paper-radio-button .name="closed">${this.t('group.closed')}</paper-radio-button>
          <paper-radio-button .name="secret">${this.t('group.secret')}</paper-radio-button>
        </paper-radio-group>

        <paper-dropdown-menu .label="${this.t('status.select')}">
          <paper-listbox slot="dropdown-content" attr-for-selected="name" .selected="${this.status}">

            ${ this.collectionStatusOptions.map(statusOption => html`
            <paper-item .name="${this.statusOption.name}">${this.statusOption.translatedName}</paper-item>
            `)}

          </paper-listbox>
        </paper-dropdown-menu>

        <paper-checkbox .name="allowAnonymousUsers" .checked="${this.group.configuration.allowAnonymousUsers}">
          ${this.t('allowAnonymousUsers')}
        </paper-checkbox>
        <paper-checkbox .name="allowAnonymousAutoLogin" .checked="${this.group.configuration.allowAnonymousAutoLogin}">
          ${this.t('allowAnonymousAutoLogin')}
        </paper-checkbox>
        <paper-checkbox .name="disableFacebookLoginForGroup" .checked="${this.group.configuration.disableFacebookLoginForGroup}">
          ${this.t('disableFacebookLoginForGroup')}
        </paper-checkbox>
        <paper-checkbox .name="forceSecureSamlLogin" ?disabled="${!this.hasSamlLoginProvider}" .checked="${this.group.configuration.forceSecureSamlLogin}">${this.t('forceSecureSamlLogin')}
        </paper-checkbox>

        <paper-checkbox .name="forceSecureSamlEmployeeLogin" ?disabled="${!this.hasSamlLoginProvider}" .checked="${this.group.configuration.forceSecureSamlEmployeeLogin}">${this.t('forceSecureSamlEmployeeLogin')}
        </paper-checkbox>

        <input .type="hidden" .name="status" .value="${this.status}">

        <div class="subHeaders">${this.t('languageSettings')}</div>

        <yp-language-selector .name="defaultLocale" no-user-events="" .selectedLocale="${this.group.configuration.defaultLocale}"></yp-language-selector>
        <paper-checkbox .name="disableNameAutoTranslation" .checked="${this.group.configuration.disableNameAutoTranslation}">
          ${this.t('disableNameAutoTranslation')}
        </paper-checkbox>

        <div class="subHeaders">${this.t('themeSettings')}</div>

        <yp-theme-selector object="${this.group}" selected-theme="${this.themeId}"></yp-theme-selector>

        <paper-input id="themeOverrideColorPrimary" name="themeOverrideColorPrimary" .allowedPattern="[#-#0-9A-Fa-f]" .maxlength="7" char-counter .label="${this.t('themeOverrideColorPrimary')}" .value="${this.group.configuration.themeOverrideColorPrimary}">
          <div prefix="">#</div>
        </paper-input>

        <paper-input id="themeOverrideColorAccent" name="themeOverrideColorAccent" .allowedPattern="[#-#0-9A-Fa-f]" .maxlength="7" char-counter label="${this.t('themeOverrideColorAccent')}" .value="${this.group.configuration.themeOverrideColorAccent}">
        </paper-input>

        <paper-input id="themeOverrideBackgroundColor" name="themeOverrideBackgroundColor" .allowedPattern="[#-#0-9A-Fa-f]" maxlength="7" char-counter label="${this.t('themeOverrideBackgroundColor')}" value="${this.group.configuration.themeOverrideBackgroundColor}">
        </paper-input>

        <div class="themeOverrideInfo">
          <em>${this.t('themeOverrideColorInfo')}</em>
        </div>

        <div class="subHeaders">${this.t('postSettings')}</div>

        <paper-checkbox .name="canAddNewPosts" .checked="${this.canAddNewPosts}">${this.t('group.canAddNewPosts')}</paper-checkbox>
        <paper-checkbox .name="locationHidden" .checked="${this.locationHidden}">${this.t('group.locationHidden')}</paper-checkbox>
        <paper-checkbox .name="showWhoPostedPosts" .checked="${this.showWhoPostedPosts}">${this.t('group.showWhoPostedPosts')}</paper-checkbox>
        <paper-checkbox .name="disableDebate" .checked="${this.group.configuration.disableDebate}">${this.t('disableDebate')}</paper-checkbox>


        <paper-input id="postDescriptionLimit" .name="postDescriptionLimit" .type="text" allowed-pattern="[0-9]" .label="${this.t('postDescriptionLimit')}" value="${this.group.configuration.postDescriptionLimit}" maxlength="4" char-counter="">
        </paper-input>

        <paper-checkbox .name="allowPostVideoUploads" ?disabled="${!this.hasVideoUpload}" .checked="${this.allowPostVideoUploads}">${this.t('allowPostVideoUploads')}
        </paper-checkbox>

        <paper-input id="videoPostUploadLimitSec" .name="videoPostUploadLimitSec" allowed-pattern="[0-9]" .maxlength="3" .type="number" ?disabled="${!this.hasVideoUpload}" .label="${this.t('videoPostUploadLimitSec')}" .value="${this.group.configuration.videoPostUploadLimitSec}">
        </paper-input>

        <paper-checkbox .name="allowPostAudioUploads" ?disabled="${!this.hasAudioUpload}" .checked="${this.allowPostAudioUploads}">${this.t('allowPostAudioUploads')}
        </paper-checkbox>

        <paper-input id="audioPostUploadLimitSec" .name="audioPostUploadLimitSec" allowedPattern="[0-9]" .maxlength="3" .type="number" ?disabled="${!this.hasaudioUpload}" .label="${this.t('audioPostUploadLimitSec')}" .value="${this.group.configuration.audioPostUploadLimitSec}">
        </paper-input>

        <paper-input id="hideNameInputAndReplaceWith" name="hideNameInputAndReplaceWith" maxlength="60" label="[[t('hideNameInputAndReplaceWith')]]" value="{{group.configuration.hideNameInputAndReplaceWith}}">
        </paper-input>

        <paper-checkbox name="makeCategoryRequiredOnNewPost" ?checked="${this.group.configuration.makeCategoryRequiredOnNewPost}">${this.t('makeCategoryRequiredOnNewPost')}
        </paper-checkbox>

        <paper-checkbox name="showVideoUploadDisclaimer" ?checked="${this.group.configuration.showVideoUploadDisclaimer}">
          ${this.t('showVideoUploadDisclaimer')}
        </paper-checkbox>

        <paper-checkbox .name="moreContactInformation" .checked="${this.group.configuration.moreContactInformation}">
          ${this.t('moreContactInformation')}
        </paper-checkbox>

        <paper-checkbox name="moreContactInformationAddress" ?checked="${this.group.configuration.moreContactInformationAddress}">
          ${this.t('moreContactInformationAddress')}
        </paper-checkbox>

        <paper-checkbox .name="attachmentsEnabled" ?checked="${this.group.configuration.attachmentsEnabled}">
          ${this.t('attachmentsEnabled')}
        </paper-checkbox>

        <paper-checkbox name="useContainImageMode" ?checked="${this.group.configuration.useContainImageMode}">
          ${this.t('useContainImageMode')}
        </paper-checkbox>

        <paper-checkbox .name="hideNewPost" .checked="${this.group.configuration.hideNewPost}">${this.t('hideNewPost')}</paper-checkbox>

        <paper-checkbox name="hideRecommendationOnNewsFeed" ?checked="${this.group.configuration.hideRecommendationOnNewsFeed}">
          ${this.t('hideRecommendationOnNewsFeed')}
        </paper-checkbox>

        <paper-checkbox .name="hideNewPostOnPostPage" .checked="${this.hideNewPostOnPostPage}">
          ${this.t('hideNewPostOnPostPage')}
        </paper-checkbox>

        <paper-checkbox .name="hidePostCover" .checked="${this.group.configuration.hidePostCover}">${this.t('hidePostCover')}
        </paper-checkbox>
        <paper-checkbox .name="hidePostDescription" .checked="${this.group.configuration.hidePostDescription}">
          ${this.t('hidePostDescription')}
        </paper-checkbox>
        <paper-checkbox .name="hidePostActionsInGrid" .checked="${this.group.configuration.hidePostActionsInGrid}">
          ${this.t('hidePostActionsInGrid')}
        </paper-checkbox>
        <paper-checkbox .name="hideDebateIcon" .checked="${this.group.configuration.hideDebateIcon}">
          ${this.t('hideDebateIcon')}
        </paper-checkbox>
        <paper-checkbox .name="hideEmoji" .checked="${thishideEmoji}">${this.t('hideEmoji')}</paper-checkbox>

        <paper-checkbox .name="hidePostFilterAndSearch" .checked="${this.group.configuration.hidePostFilterAndSearch}">
          ${this.t('hidePostFilterAndSearch')}
        </paper-checkbox>

        <paper-checkbox name="hideMediaInput" ?checked="${this.group.configuration.hideMediaInput}">
          ${this.t('hideMediaInput')}
        </paper-checkbox>

        <paper-checkbox .name="hidePostImageUploads" disabled="${!this.hasVideoUpload}" .checked="${this.group.configuration.hidePostImageUploads}">${this.t('hidePostImageUploads')}
        </paper-checkbox>

        <paper-checkbox .name="disablePostPageLink" .checked="${this.group.configuration.disablePostPageLink}">
          ${this.t('disablePostPageLink')}
        </paper-checkbox>

        <paper-input id="defaultLocationLongLat" .name="defaultLocationLongLat" .type="text" .label="${this.t('defaultLocationLongLat')}" value="${this.group.configuration.defaultLocationLongLat}" .maxlength="100" .style="width: 300px;">
        </paper-input>

        <paper-input id="forcePostSortMethodAs" name="forcePostSortMethodAs" type="text" label="${this.t('forcePostSortMethodAs')}" value="${this.group.configuration.forcePostSortMethodAs}" maxlength="12">
        </paper-input>

        <paper-input id="customThankYouTextNewPosts" name="customThankYouTextNewPosts" type="text" label="${this.t('customThankYouTextNewPosts')}" value="${this.group.configuration.customThankYouTextNewPosts}" maxlength="60">
        </paper-input>

        <paper-input id="descriptionTruncateAmount" name="descriptionTruncateAmount" type="text" .allowedPattern="[0-9]" label="${this.t('descriptionTruncateAmount')}" value="${this.group.configuration.descriptionTruncateAmount}" maxlength="4">
        </paper-input>

        <paper-checkbox name="descriptionSimpleFormat" ?checked="${this.group.configuration.descriptionSimpleFormat}">
          ${this.t('descriptionSimpleFormat')}
        </paper-checkbox>

        <paper-checkbox name="transcriptSimpleFormat" ?checked="${this.group.configuration.transcriptSimpleFormat}">
          ${this.t('transcriptSimpleFormat')}
        </paper-checkbox>

        <paper-checkbox name="allPostsBlockedByDefault" ?checked="${this.group.configuration.allPostsBlockedByDefault}">
          ${this.t('allPostsBlockedByDefault')}
        </paper-checkbox>

        <paper-checkbox name="storeSubCodesWithRadiosAndCheckboxes" ?checked="${this.group.configuration.storeSubCodesWithRadiosAndCheckboxes}">
          ${this.t('storeSubCodesWithRadiosAndCheckboxes')}
        </paper-checkbox>


        <paper-textarea id="structuredQuestions" .name="structuredQuestions" .type="text" .rows="4" always-float-label="${this.group.configuration.structuredQuestions}" .maxrows="2"
          .label="${this.t('structuredQuestions')}" .value="${this.group.configuration.structuredQuestions}"
          on-value-changed="_structuredQuestionsChanged" max-rows="8">
        </paper-textarea>

        <div id="structuredQuestionsJsonErrorInfo" ?hidden="${!this.structuredQuestionsJsonError}">${this.t('structuredQuestionsJsonFormatNotValid')}</div>

        <div class="structuredQuestionsInfo">${this.t('structuredQuestionsInfo')}</div>

        <div class="layout vertical additionalSettings uploadSection">
          <yp-file-upload id="docxSurveyUpload" raised="true" multi="false"
                          target="/api/groups/-1/convert_docx_survey_to_json"
                          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          method="PUT" @success="${this._haveUploadedDocxSurvey}">
            <iron-icon class="icon" icon="sort"></iron-icon>
            <span>${this.t('uploadDocxSurveyFormat')}</span>
          </yp-file-upload>
        </div>

        <paper-input id="alternativeTextForNewIdeaButton" name="alternativeTextForNewIdeaButton" type="text" label="${this.t('alternativeTextForNewIdeaButton')}" value="${this.group.configuration.alternativeTextForNewIdeaButton}" maxlength="30" char-counter="">
        </paper-input>

        <paper-input id="alternativeTextForNewIdeaButtonClosed" name="alternativeTextForNewIdeaButtonClosed" type="text" label="${this.t('alternativeTextForNewIdeaButtonClosed')}" value="${this.group.configuration.alternativeTextForNewIdeaButtonClosed}" maxlength="30" char-counter="">
        </paper-input>

        <paper-input id="alternativeTextForNewIdeaButtonHeader" name="alternativeTextForNewIdeaButtonHeader" type="text" label="${this.t('alternativeTextForNewIdeaButtonHeader')}" value="${this.group.configuration.alternativeTextForNewIdeaButtonHeader}" maxlength="30" char-counter="">
        </paper-input>

        <div class="layout vertical additionalSettings defaultPostImage">
          <yp-file-upload id="defaultPostImageUpload" raised target="/api/images?itemType=group-logo" .method="POST" @success="${this._defaultPostImageUploaded}">
            <iron-icon class="icon" .icon="photo-camera"></iron-icon>
            <span>${this.t('defaultPostImage')}</span>
          </yp-file-upload>
        </div>

        <div class="layout horizontal">
          <div class="layout vertical additionalSettings">
            <yp-file-upload id="defaultDataImageUpload" raised target="/api/images?itemType=group-logo" .method="POST" @success="${this._defaultDataImageUploaded}">
              <iron-icon class="icon" .icon="photo-camera"></iron-icon>
              <span>${this.t('defaultDataImage')}</span>
            </yp-file-upload>
          </div>

          <input type="hidden" name="uploadedDefaultDataImageId" .value="${this.uploadedDefaultDataImageId}">
        </div>

        <input .type="hidden" .name="canVote" .value="${this.canVote}">
        <input .type="hidden" .name="canAddNewPosts" .value="${this.canAddNewPosts}">
        <input .type="hidden" .name="locationHidden" .value="${this.locationHidden}">
        <input .type="hidden" .name="showWhoPostedPosts" .value="${this.showWhoPostedPosts}">
        <input .type="hidden" .name="themeId" .value="${this.themeId}">
        <input .type="hidden" .name="uploadedDefaultPostImageId" value="${this.uploadedDefaultPostImageId}">

        <div class="subHeaders exteraTopMargin">${this.t('voteSettings')}</div>

        <div class="layout horizontal">
          <paper-dropdown-menu .label="${this.t('endorsementButtons')}"  ?disabled="${this.endorsementButtonsDisabled}">
            <paper-listbox slot="dropdown-content" attr-for-selected="name" .selected="${this.endorsementButtons}">

              ${ this.endorsementButtonsOptions.map( buttonsSelection => html`
                <paper-item .name="${this.buttonsSelection.name}">${this.buttonsSelection.translatedName}</paper-item>
              `)}

            </paper-listbox>
          </paper-dropdown-menu>
          <input .type="hidden" .name="endorsementButtons" .value="${this.endorsementButtons}">
        </div>
        <paper-checkbox .name="canVote" .checked="${this.canVote}">${this.t('group.canVote')}</paper-checkbox>
        <paper-checkbox .name="hideVoteCount" .checked="${this.group.configuration.hideVoteCount}">${this.t('hideVoteCount')}
        </paper-checkbox>
        <paper-checkbox .name="hideVoteCountUntilVoteCompleted" .checked="${this.group.configuration.hideVoteCountUntilVoteCompleted}">
          ${this.t('hideVoteCountUntilVoteCompleted')}
        </paper-checkbox>
        <paper-checkbox .name="hideDownVoteForPost" .checked="${this.group.configuration.hideDownVoteForPost}">
          ${this.t('hideDownVoteForPost')}
        </paper-checkbox>

        <paper-input id="customVoteUpHoverText" .name="customVoteUpHoverText" .type="text" .label="${this.t('customVoteUpHoverText')}" .value="${this.group.configuration.customVoteUpHoverText}" .maxlength="100" char-counter>
        </paper-input>

        <paper-input id="customVoteDownHoverText" .name="customVoteDownHoverText" .type="text" .label="${this.t('customVoteDownHoverText')}" .value="${this.group.configuration.customVoteDownHoverText}" .maxlength="100" char-counter>
        </paper-input>

        <paper-textarea id="customRatingsText" name="customRatingsText" type="text" rows="2"
          @value-changed="${this._customRatingsTextChanged}" always-float-label="${this.group.configuration.customRatingsText}" maxrows="2" label="${this.t('customRatings')}" value="${this.group.configuration.customRatingsText}">
        </paper-textarea>

        <div class="structuredQuestionsInfo">${this.t('customRatingsInfo')}</div>

        <div class="subHeaders">${this.t('pointSettings')}</div>

        <paper-checkbox .name="newPointOptional" .checked="${this.newPointOptional}">${this.t('newPointOptional')}</paper-checkbox>
        <paper-checkbox .name="hideNewPointOnNewIdea" .checked="${this.group.configuration.hideNewPointOnNewIdea}">${this.t('hideNewPointOnNewIdea')}</paper-checkbox>
        <paper-checkbox .name="hidePointAuthor" .checked="${this.group.configuration.hidePointAuthor}">
          ${this.t('hidePointAuthor')}
        </paper-checkbox>

        <paper-checkbox name="hidePointAgainst" ?checked="${this.group.configuration.hidePointAgainst}">
          ${this.t('hidePointAgainst')}
        </paper-checkbox>

        <paper-input id="pointCharLimit" name="pointCharLimit" type="text" allowed-pattern="[0-9]" label="[[t('pointCharLimit')]]" value="{{group.configuration.pointCharLimit}}" maxlength="4">
        </paper-input>


        <paper-input id="alternativePointForHeader" .name="alternativePointForHeader" .type="text" .label="${this.t('alternativePointForHeader')}" .value="${this.group.configuration.alternativePointForHeader}" .maxlength="100" char-counter>
        </paper-input>

        <paper-input id="alternativePointAgainstHeader" .name="alternativePointAgainstHeader" .type="text" .label="${this.t('alternativePointAgainstHeader')}" .value="${this.group.configuration.alternativePointAgainstHeader}" .maxlength="100" char-counter>
        </paper-input>

        <paper-input id="alternativePointForLabel" .name="alternativePointForLabel" .type="text" .label="${this.t('alternativePointForLabel')}" .value="${this.group.configuration.alternativePointForLabel}" .maxlength="100" char-counter>
        </paper-input>

        <paper-input id="alternativePointAgainstLabel" .name="alternativePointAgainstLabel" .type="text" .label="${this.t('alternativePointAgainstLabel')}" .value="${this.group.configuration.alternativePointAgainstLabel}" .maxlength="100" char-counter>
        </paper-input>

        <paper-checkbox .name="allowPointVideoUploads" ?disabled="${!this.hasVideoUpload}" .checked="${this.allowPointVideoUploads}">${this.t('allowPointVideoUploads')}
        </paper-checkbox>
        <paper-input id="videoPointUploadLimitSec" .name="videoPointUploadLimitSec" .type="text" .maxlength="3" allowed-pattern="[0-9]" disabled="${!this.hasVideoUpload}" .label="${this.t('videoPointUploadLimitSec')}" .value="${this.group.configuration.videoPointUploadLimitSec}">
        </paper-input>

        <paper-checkbox .name="allowPointAudioUploads" ?disabled="${!this.hasAudioUpload}" .checked="${this.allowPointAudioUploads}">${this.t('allowPointAudioUploads')}
        </paper-checkbox>

        <paper-input id="audioPointUploadLimitSec" .name="audioPointUploadLimitSec" .type="text" .maxlength="3" .allowedPattern="[0-9]" ?disabled="${!this.hasaudioUpload}" .label="${this.t('audioPointUploadLimitSec')}" .value="${this.group.configuration.audioPointUploadLimitSec}">
        </paper-input>

        <paper-checkbox name="allowAdminAnswersToPoints" ?checked="${this.group.configuration.allowAdminAnswersToPoints}">
          ${this.t('allowAdminAnswersToPoints')}
        </paper-checkbox>

        <paper-input id="customAdminCommentsTitle" name="customAdminCommentsTitle" type="text" label="${this.t('customAdminCommentsTitle')}" value="${this.group.configuration.customAdminCommentsTitle}" maxlength="50" char-counter="">
        </paper-input>

        <div class="subHeaders">${this.t('additionalGroupConfig')}</div>

        <paper-checkbox .name="hideAllTabs" .checked="${this.hideAllTabs}">${this.t('hideAllTabs')}</paper-checkbox>
        <paper-checkbox .name="hideHelpIcon" .checked="${this.hideHelpIcon}">${this.t('hideHelpIcon')}</paper-checkbox>

        <paper-checkbox name="useCommunityTopBanner" ?checked="${this.group.configuration.useCommunityTopBanner}">${this.t('useCommunityTopBanner')}</paper-checkbox>
        <paper-checkbox name="makeMapViewDefault" ?checked="${this.group.configuration.makeMapViewDefault}">${this.t('makeMapViewDefault')}</paper-checkbox>
        <paper-checkbox name="simpleFormatDescription" ?checked="${this.group.configuration.simpleFormatDescription}">${this.t('simpleFormatDescription')}</paper-checkbox>
        <paper-checkbox name="resourceLibraryLinkMode" ?checked="${this.group.configuration.resourceLibraryLinkMode}">${this.t('resourceLibraryLinkMode')}</paper-checkbox>
        <paper-checkbox name="collapsableTranscripts" ?checked="${this.group.configuration.collapsableTranscripts}">${this.t('collapsableTranscripts')}</paper-checkbox>
        <paper-checkbox name="allowWhatsAppSharing" ?checked="${this.group.configuration.allowWhatsAppSharing}">${this.t('allowWhatsAppSharing')}</paper-checkbox>

        <paper-input id="actAsLinkToCommunityId" name="actAsLinkToCommunityId" type="number" allowed-pattern="[0-9]" label="${this.t('actAsLinkToCommunityId')}" value="${this.group.configuration.actAsLinkToCommunityId}" maxlength="8">
        </paper-input>

        <paper-input id="maxDaysBackForRecommendations" name="maxDaysBackForRecommendations" type="text" maxlength="5" allowed-pattern="[0-9]" label="${this.t('maxDaysBackForRecommendations')}" value="${this.group.configuration.maxDaysBackForRecommendations}">
        </paper-input>

        <paper-input id="customUserNamePrompt" name="customUserNamePrompt" type="text" label="${this.t('customUserNamePrompt')}" value="${this.group.configuration.customUserNamePrompt}" maxlength="45" char-counter="">
        </paper-input>

        <paper-input id="customTermsIntroText" name="customTermsIntroText" type="text" label="${this.t('customTermsIntroText')}" value="${this.group.configuration.customTermsIntroText}" maxlength="100" char-counter="">
        </paper-input>

        <paper-input id="externalGoalTriggerUrl" .name="externalGoalTriggerUrl" .type="text" .label="${this.t('externalGoalTriggerUrl')}" .value="${this.group.configuration.externalGoalTriggerUrl}">
        </paper-input>

        <paper-input id="customBackURL" .name="customBackURL" .type="text" maxlength="256" .label="${this.t('customBackURL')}" .value="${this.group.configuration.customBackURL}">
        </paper-input>

        <paper-input id="customBackName" .name="customBackName" .type="text" .maxlength="20" .label="${this.t('customBackName')}" .value="${this.group.configuration.customBackName}">
        </paper-input>

        <paper-input id="optionalSortOrder" name="optionalSortOrder" type="number" .allowedPattern="[0-9]" label="${this.t('optionalSortOrder')}" value="${this.group.configuration.optionalSortOrder}" maxlength="4">
        </paper-input>

        <input .type="hidden" .name="hideAllTabs" .value="${this.hideAllTabs}">
        <input .type="hidden" .name="hideNewPostOnPostPage" .value="${this.hideNewPostOnPostPage}">
        <input .type="hidden" .name="newPointOptional" .value="${this.newPointOptional}">
        <input .type="hidden" .name="hideHelpIcon" .value="${this.hideHelpIcon}">
        <input .type="hidden" .name="hideEmoji" .value="${this.hideEmoji}">
        <input .type="hidden" .name="hideGroupHeader" .value="${this.hideGroupHeader}">
        <input .type="hidden" .name="allowPostVideoUploads" .value="${this.allowPostVideoUploads}">
        <input .type="hidden" .name="allowPointVideoUploads" .value="${this.allowPointVideoUploads}">
        <input .type="hidden" .name="allowPostAudioUploads" .value="${this.allowPostAudioUploads}">
        <input .type="hidden" .name="allowPointAudioUploads" .value="${this.allowPointAudioUploads}">

        <div class="layout vertical config" ?hidden="${!this.group.Categories}">
          <div class="subHeaders">${this.t('categories.the_all')}</div>

          ${ this.group.Categories.map(category => html`
            <paper-item data-category="${this.category}" data-category-name="${this.category.name}" @tap="${this._openCategoryEdit}">
              <img .sizing="cover" height="24" width="24" class="filterIcon" src="${this._categoryImageSrc(category)}">
              <span class="categoryName">${this.category.name}</span>
            </paper-item>
          `)}

        </div>
      </div>

    </yp-edit-dialog>
  `
}
  //TODO: Try to eliminate configuration boiler-plate


  /*behaviors: [
    ypEditDialogBehavior,
    ypCollectionStatusOptions,
    ypGotoBehavior,
    ypMediaFormatsBehavior
  ],
*/

  _objectivesChanged (event) {
    const description = event.target.value;
    const urlRegex = new RegExp(/(?:https?|http?):\/\/[\n\S]+/g);
    var urlArray = description.match(urlRegex);

    if (urlArray && urlArray.length>0) {
      let urlsLength = 0;
      for (let i=0;i<Math.min(urlArray.length,10); i++) {
        urlsLength+=urlArray[i].length;
      }
      let maxLength = 300;
      maxLength += urlsLength;
      maxLength -= Math.min(urlsLength, urlArray.length*30);
      this.maxObjectivesLength = maxLength;
    }
  }

  _structuredQuestionsChanged (event, detail) {
    if (detail && detail.value) {
      var questions = detail.value.trim();
      if (questions.startsWith("[") || questions.startsWith("{")) {
        var jsonError = false;
        try {
          JSON.parse(questions);
        } catch (e) {
          jsonError = true;
        }
        this.structuredQuestionsJsonError = jsonError;
      } else {
        this.structuredQuestionsJsonError = false;
      }
    } else {
      this.structuredQuestionsJsonError = false;
    }
  }

  _customRatingsTextChanged(event, detail) {
    if (detail.value && detail.value!=="") {
      this.endorsementButtonsDisabled = true;
    } else {
      this.endorsementButtonsDisabled = false;
    }
  }

  _videoUploaded(event, detail) {
    this.uploadedVideoId = detail.videoId;
    this.group.configuration.useVideoCover = true;
  }
/*
  observers: [
    '_setupTranslation(language,t)'
  ],
*/
  _openCategoryEdit(event) {
    window.appGlobals.activity('open', 'category.new');
    dom(document).querySelector('yp-app').getDialogAsync("categoryEdit", function (dialog) {
      dialog.setup(this.group, false, this._refreshCategories.bind(this), event.model.category);
      dialog.open("edit", {categoryId: event.model.category.id});
    }.bind(this));
  }

  _refreshCategories(newCategory) {
    const newCategories = [];
    __.each(this.group.Categories, function (oldCategory) {
      if (oldCategory.id === newCategory.id) {
        newCategories.push(newCategory)
      } else {
        newCategories.push(oldCategory);
      }
    });
    this.group.Categories = newCategories;
  }

  _categoryImageSrc(category) {
    return this.getImageFormatUrl(category.CategoryIconImages, 0);
  }

  _endorsementButtonsOptions(language) {
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
  }

  _updateEmojiBindings() {
    this.async(function () {
      var description = this.$$("#objectives");
      var emojiSelector = this.$$("#emojiSelectorDescription");
      if (description && emojiSelector) {
        emojiSelector.inputTarget = description;
      } else {
        console.warn("Group edit: Can't bind emojis :(");
      }
    }.bind(this), 500);
  }

  _publicCommunity(group) {
    if (group) {
      return group.Community.access === 0
    } else {
      return false;
    }
  }

  _customRedirect(group) {
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
  }

  _finishRedirect(group) {
    this.redirectTo("/group/" + group.id);
    window.appGlobals.activity('completed', 'editGroup');
  }

  _groupChanged(group, oldValue) {
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
        this.status = group.status;
      }

      if (group.configuration && group.configuration.canVote != undefined) {
        this.canVote = group.configuration.canVote;
        this.canAddNewPosts = group.configuration.canAddNewPosts;
      } else {
        this.canVote = true;
        this.canAddNewPosts = true;
      }

      if (group.configuration && group.configuration.endorsementButtons != undefined) {
        this.endorsementButtons = group.configuration.endorsementButtons;
      } else {
        this.endorsementButtons = "hearts";
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
            this.publicCommunity = true; 
          } else {
            this.publicCommunity = false;
          }
        } else if (group && group.Community) {
          if (group.Community.access == 0) {
            this.publicCommunity = true;
          } else {
            this.publicCommunity = false;
          }
        }
      });

      if ((!group || !group.id) && window.appGlobals.hasVideoUpload) {
        if (this.allowPostVideoUploads === null) {
          this.allowPostVideoUploads = true;
        }
        if (this.allowPointVideoUploads === null) {
          this.allowPointVideoUploads = true;
        }
      }

      if (window.appGlobals.hasVideoUpload) {
        this.hasVideoUpload = true;
      } else {
        this.hasVideoUpload = false;
      }

      if ((!group || !group.id) && window.appGlobals.hasAudioUpload) {
        if (this.allowPostAudioUploads === null) {
          this.allowPostAudioUploads = true;
        }
        if (this.allowPointAudioUploads === null) {
          this.allowPointAudioUploads = true;
        }
      }

      if (window.appGlobals.hasAudioUpload) {
        this.hasAudioUpload = true;
      } else {
        this.hasAudioUpload = false;
      }

      if (group.configuration && group.configuration.structuredQuestions) {
        this._structuredQuestionsChanged(null, { value: group.configuration.structuredQuestions })
      }
    }

    this._updateEmojiBindings();

    if (window.appGlobals.domain && window.appGlobals.domain.samlLoginProvided) {
      this.hasSamlLoginProvider = true;
    } else {
      this.hasSamlLoginProvider = false;
    }
  }

  _setFromConfiguration(propertyName, setNullDefault) {
    if (this.group.configuration && this.group.configuration[propertyName] != undefined && this.group.configuration[propertyName] !== "") {
      this.propertyName, this.group.configuration[propertyName];
    } else {
      this.propertyName, setNullDefault ? null : false;
    }
  }

  _clear() {
    this.group = null;
    this.uploadedLogoImageId = null;
    this.uploadedHeaderImageId = null;
    this.uploadedDefaultDataImageId = null;
    this.uploadedVideoId = null;

    if (this.$$("#videoFileUpload"))
      this.$$("#videoFileUpload").clear();
    if (this.$$("#headerImageUpload"))
      this.$$("#headerImageUpload").clear();
    if (this.$$("#logoImageUpload"))
      this.$$("#logoImageUpload").clear();
    if (this.$$("#defaultDataImageUpload"))
      this.$$("#defaultDataImageUpload").clear();
  }

  setup(group, newNotEdit, refreshFunction) {
    if (!group) {
      this.group = {name: '', objectives: '', access: 0, status: 'active'};
    } else {
      if (group.configuration && group.configuration.customRatings && !group.configuration.customRatingsText) {
        var customRatingsText = "";
        group.configuration.customRatings.forEach(function (rating) {
            customRatingsText += rating.name+","+rating.numberOf+","+rating.emoji+","
        });
        customRatingsText = customRatingsText.substring(0, customRatingsText.length - 1);
        group.configuration.customRatingsText = customRatingsText;
      }
      this.group = group;
      if (group.GroupLogoVideos && group.GroupLogoVideos.length > 0) {
        this.uploadedVideoId = group.GroupLogoVideos[0].id
      }
    }
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;

    if (this.group.configuration && this.group.configuration.customRatingsText && this.group.configuration.customRatingsText!=="") {
      this.endorsementButtonsDisabled = true;
    } else {
      this.endorsementButtonsDisabled = false;
    }

    this._setupTranslation();
  }

  setupAfterOpen(params) {
    if (params.community) {
      this.community = params.community;
    }

    var defaultAccess = 0;
    if (this.community) {
      if (this.community.access != 0) {
        this.groupAccess = 'open_to_community';
        this.group.access = 3;
        defaultAccess = 3;
      }
    } else if (this.group.Community) {
      if (this.group.Community.access != 0) {
        this.groupAccess = 'open_to_community';
        defaultAccess = 3;
      }
    }
    this.group.access = defaultAccess;
  }

  _setupTranslation(language, t) {
    if (this.language && this.t) {
      if (this.new) {
        this.editHeaderText = this.t('group.new');
        this.toastText = this.t('groupToastCreated');
        this.saveText = this.t('create');
      } else {
        this.saveText = this.t('save');
        this.editHeaderText = this.t('group.update');
        this.toastText = this.t('groupToastUpdated');
      }
    }
  }

  _haveUploadedDocxSurvey(event, detail) {
    if (detail.xhr.response) {
      detail = JSON.parse(detail.xhr.response);
      detail.jsonContent = JSON.stringify(JSON.parse(detail.jsonContent));
      this.$$("#structuredQuestions").value = detail.jsonContent;
      this.$$("#structuredQuestions").alwaysFloatLabel = true;
      if (this.group && this.group.configuration) {
        this.group.configuration.structuredQuestions = detail.jsonContent;
      }
      this.$.editDialog.scrollResize();
      this.fire('iron-resize');
    }
  }
}

window.customElements.define('yp-group-edit-lit', YpGroupEditLit)
