import{n as n$8,d as YpBaseElementWithLogin,f as e$7,g as YpMediaHelpers,h as YpImage,x,T as T$2,j as YpCollectionHelpers,o as o$8,k as o$9,i as i$5,t as t$5,a as YpBaseElement,l as YpThemeManager,m as c$4,p as YpNavHelpers,q as requestUpdateOnAriaChange,s as s$8,_ as __decorate$i,e as e$8,u as redispatchEvent,v as o$a,w as YpStreamingLlmBase,A as AoiAdminServerApi,y as AoiGenerateAiLogos,z as resolveUrl,B as pathFromUrl,C as strictTemplatePolicy,D as resolveCss,E as wrap$1,F as microTask$1,G as legacyUndefined,H as removeNestedTemplates,I as fastDomIf,J as sanitizeDOMValue,K as orderedComputed,L as legacyOptimizations,M as rootPath,N as syncInitialRender,O as legacyWarnings,P as useAdoptedStyleSheetsWithBuiltCSS,Q as supportsAdoptingStyleSheets$1,R as allowTemplateFromDomModule,S as FlattenedNodesObserver,U as j,V as Corner,W as YpFormattingHelpers,X as ShadowStyles,Z as YpLanguages,r as r$6,Y as YpEditBase,$ as YpAccessHelpers}from"./CQmPY7fF.js";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let dedupeId$1=0;const dedupingMixin=function(e){let t=e.__mixinApplications;t||(t=new WeakMap,e.__mixinApplications=t);let i=dedupeId$1++;return function(o){let n=o.__mixinSet;if(n&&n[i])return o;let s=t,r=s.get(o);if(!r){r=e(o),s.set(o,r);let t=Object.create(r.__mixinSet||n||null);t[i]=!0,r.__mixinSet=t}return r}};var __decorate$h=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};class YpAdminPage extends YpBaseElementWithLogin{}__decorate$h([n$8({type:String})],YpAdminPage.prototype,"collectionType",void 0),__decorate$h([n$8({type:Number})],YpAdminPage.prototype,"collectionId",void 0),__decorate$h([n$8({type:Object})],YpAdminPage.prototype,"collection",void 0);var __decorate$g=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};const defaultLtpPromptsConfiguration=()=>Object.fromEntries(Array.from({length:10},((e,t)=>[t+1,""]))),defaultLtpConfiguration={crt:{prompts:defaultLtpPromptsConfiguration(),promptsTests:defaultLtpPromptsConfiguration()}};class YpAdminConfigBase extends YpAdminPage{constructor(){super(),this.selectedTab=0,this.configChanged=!1,this.method="POST",this.generatingAiImageInBackground=!1,this.hasVideoUpload=!1,this.hasAudioUpload=!1,this.connectedVideoToCollection=!1,this.descriptionMaxLength=300,this.tabsHidden=!1,this.gettingImageColor=!1}async _formResponse(e){this.configChanged=!1}_selectTab(e){this.selectedTab=e.target.activeTabIndex}async getColorFromLogo(){try{this.gettingImageColor=!0;let e=this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages);const t=new Image;t.src=e+"?"+(new Date).getTime(),t.setAttribute("crossOrigin",""),await t.decode();let i=await YpImage.getThemeColorsFromImage(t);this.gettingImageColor=!1,console.error("New theme color",i),i&&(i=i.replace("#",""),this.fireGlobal("yp-theme-color-detected",i),this.detectedThemeColor=i,this._configChanged())}catch(e){console.log(e)}}_updateCollection(e){this.collection=e.detail}connectedCallback(){super.connectedCallback(),this.setupBootListener(),this.addGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.addGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),window.appGlobals.hasVideoUpload&&(this.hasVideoUpload=!0),window.appGlobals.hasAudioUpload&&(this.hasAudioUpload=!0),this.addListener("yp-form-response",this._formResponse),this.addListener("yp-updated-collection",this._updateCollection)}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.removeGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),this.removeListener("yp-form-response",this._formResponse),this.removeListener("yp-updated-collection",this._updateCollection)}_logoImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedLogoImageId=t.id,this.imagePreviewUrl=JSON.parse(t.formats)[0],JSON.parse(t.formats),this._configChanged()}_headerImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedHeaderImageId=t.id,this.configChanged=!0}_statusSelected(e){const t=e.target.selectedIndex;this.status=this.collectionStatusOptions[t].name,this._configChanged()}get statusIndex(){if(this.status){for(let e=0;e<this.collectionStatusOptions.length;e++)if(this.collectionStatusOptions[e].name==this.status)return e;return-1}return-1}get collectionStatusOptions(){return this.language?[{name:"active",translatedName:this.t("status.active")},{name:"featured",translatedName:this.t("status.featured")},{name:"archived",translatedName:this.t("status.archived")},{name:"hidden",translatedName:this.t("status.hidden")}]:[]}_ltpConfigChanged(e){setTimeout((()=>{const e=this.$$("#jsoneditor").json;this.collection.configuration.ltp=e,this._configChanged(),this.requestUpdate()}),25)}tabsPostSetup(e){}get disableSaveButtonForCollection(){if("group"==this.collectionType&&this.collection&&this.collection.configuration){if(1===this.collection.configuration.groupType){const e=this.collection.configuration?.allOurIdeas?.earl?.question_id;return void 0===e}return!1}return!1}_themeChanged(e){this.collection.configuration.theme={...this.collection.configuration.theme,...e.detail},this.requestUpdate()}renderSaveButton(){return x`
      <div class="layout horizontal">
        <md-filled-button
          raised
          class="saveButton"
          ?disabled="${!this.configChanged||this.disableSaveButtonForCollection}"
          @click="${this._save}"
          >${this.saveText||""}</md-filled-button
        >
      </div>
      <div>
        <md-circular-progress
          id="spinner"
          hidden
          indeterminate
          closed="${!this.configChanged}"
        ></md-circular-progress>
      </div>
    `}renderTabs(){return!this.tabsHidden&&this.configTabs?x`
          <div class="layout vertical center-center">
            <md-tabs @change="${this._selectTab}">
              ${this.configTabs.map((e=>x`
                  <md-secondary-tab
                    >${this.t(e.name)}<md-icon
                      >${e.icon}</md-icon
                    ></md-secondary-tab
                  >
                `))}
            </md-tabs>
          </div>
        `:T$2}renderTabPages(){if(this.tabsHidden)return T$2;let e=[];return this.configTabs?.forEach(((t,i)=>{e.push(this.renderTabPage(t.items,i))})),x`${e}`}_generateLogo(e){e.preventDefault(),e.stopPropagation(),this.requestUpdate();this.$$("#aiImageGenerator").open()}renderTabPage(e,t){return x`<div
      ?hidden="${this.selectedTab!=t}"
      class="layout vertical center-center"
    >
      <div class="innerTabContainer">
        ${e.map(((e,t)=>x`
            ${"html"==e.type?x`<div class="adminItem">${e.templateData}</div>`:x`
                  <div class="layout vertical center-center">
                    <yp-structured-question-edit
                      index="${t}"
                      id="configQuestion_${t}"
                      @yp-answer-content-changed="${e.onChange||this._configChanged}"
                      debounceTimeMs="10"
                      .name="${e.name||e.text||""}"
                      ?disabled="${!!e.disabled}"
                      .value="${void 0!==e.value?e.value:void 0!==this._getCurrentValue(e)?this._getCurrentValue(e):e.defaultValue||""}"
                      .question="${{...e,text:e.translationToken?this.t(e.translationToken):this.t(e.text),uniqueId:`u${t}`}}"
                    >
                    </yp-structured-question-edit>
                  </div>
                `}
          `))}
      </div>
    </div>`}get collectionVideoURL(){if(this.collection&&this.collection.configuration){const e=this.collectionVideos;if(e){const t=YpMediaHelpers.getVideoURL(e);if(t)return this.collectionVideoId=e[0].id,t}}else;}get collectionVideoPosterURL(){if(this.collection&&this.collection.configuration&&this.collection.configuration.useVideoCover){const e=YpMediaHelpers.getVideoPosterURL(this.collectionVideos,YpCollectionHelpers.logoImages(this.collectionType,this.collection));return e||void 0}}get collectionVideos(){switch(this.collectionType){case"domain":return this.collection.DomainLogoVideos;case"community":return this.collection.CommunityLogoVideos;case"group":return this.collection.GroupLogoVideos;default:return}}clearVideos(){switch(this.collectionVideoId=void 0,this.videoPreviewUrl=void 0,this.collectionType){case"domain":this.collection.DomainLogoVideos=[];break;case"community":this.collection.CommunityLogoVideos=[];break;case"group":this.collection.GroupLogoVideos=[]}this.requestUpdate()}clearImages(){switch(this.uploadedLogoImageId=void 0,this.imagePreviewUrl=void 0,this.collectionType){case"domain":this.collection.DomainLogoImages=[];break;case"community":this.collection.CommunityLogoImages=[];break;case"group":this.collection.GroupLogoImages=[]}this.currentLogoImages=void 0,this.requestUpdate()}renderCoverMediaContent(){return this.collection?.configuration?.welcomeHTML?x`<div id="welcomeHTML">
        ${o$8(this.collection.configuration.welcomeHTML)}
      </div>`:this.collectionVideoURL&&this.collection?.configuration.useVideoCover?x`
        <video
          id="videoPlayer"
          data-id="${o$9(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.collectionVideoURL}"
          playsinline
          poster="${o$9(this.collectionVideoPosterURL)}"
        ></video>
      `:this.videoPreviewUrl&&this.collection?.configuration.useVideoCover?x`
        <video
          id="videoPlayer"
          data-id="${o$9(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.videoPreviewUrl}"
          playsinline
        ></video>
      `:this.imagePreviewUrl?x`
        <div style="position: relative;">
          <yp-image
            class="mainImage"
            @loaded="${this.getColorFromLogo}"
            sizing="contain"
            .skipCloudFlare="${!0}"
            src="${this.imagePreviewUrl}"
          ></yp-image>
          ${this.gettingImageColor?x`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `:T$2}
        </div>
      `:this.currentLogoImages&&this.currentLogoImages.length>0?x`
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="contain"
            src="${YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
          ></yp-image>
          ${this.gettingImageColor?x`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `:T$2}
        </div>
      `:x`
        <yp-image
          class="image"
          sizing="contain"
          src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg"
        ></yp-image>
      `}async reallyDeleteCurrentLogoImage(){this.currentLogoImages?this.currentLogoImages.forEach((async e=>{await window.adminServerApi.deleteImage(e.id,this.collectionType,this.collectionId)})):this.imagePreviewUrl&&await window.adminServerApi.deleteImage(this.uploadedLogoImageId,this.collectionType,this.collectionId),this.clearImages()}async reallyDeleteCurrentVideo(){this.collectionVideoId?await window.adminServerApi.deleteVideo(this.collectionVideoId,this.collectionType,this.collectionId):this.videoPreviewUrl&&await window.adminServerApi.deleteVideo(this.uploadedVideoId,this.collectionType,this.collectionId),this.clearVideos()}deleteCurrentLogoImage(e){e.preventDefault(),e.stopPropagation(),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteLogoImage"),this.reallyDeleteCurrentLogoImage.bind(this))}))}deleteCurrentVideo(e){e.preventDefault(),e.stopPropagation(),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteVideo"),this.reallyDeleteCurrentVideo.bind(this))}))}renderLogoMedia(){return x`
      <div class="layout vertical logoImagePlaceholder">
        ${this.renderCoverMediaContent()}
        <div class="layout horizontal center-center logoUploadButtons">
          <yp-file-upload
            id="logoImageUpload"
            raised
            hideStatus
            useIconButton
            target="/api/images?itemType=domain-logo"
            method="POST"
            buttonIcon="photo_camera"
            .buttonText="${this.t("image.logo.upload")}"
            @success="${this._logoImageUploaded}"
          >
          </yp-file-upload>
          ${this.currentLogoImages&&this.currentLogoImages.length>0||this.imagePreviewUrl?x`<md-filled-icon-button class="deleteImageButton"
                @click="${this.deleteCurrentLogoImage}"
                ><md-icon>delete</md-icon></md-filled-icon-button
              >`:T$2}
          <div
            class="aiGenerationIconContainer"
            ?background-not-active="${!this.generatingAiImageInBackground}"
          >
            <md-filled-icon-button
              ?hidden="${!this.hasLlm}"
              id="generateButton"
              @click="${this._generateLogo}"
              ><md-icon>smart_toy</md-icon></md-filled-icon-button
            >
            ${this.generatingAiImageInBackground?x`<md-linear-progress
                  class="aiGenerationSpinnerInBackground"
                  indeterminate
                ></md-linear-progress>`:T$2}
          </div>

          <div
            class="layout vertical center-center"
            class="videoUploadContainer"
            ?has-video="${this.videoPreviewUrl||this.collectionVideoURL}"
          >
            ${this.collectionVideoURL||this.videoPreviewUrl?x`<md-filled-icon-button
                  style="margin-bottom: 8px;"
                  @click="${this.deleteCurrentVideo}"
                  ><md-icon>delete</md-icon></md-filled-icon-button
                >`:T$2}
            <yp-file-upload
              ?hidden="${!this.hasVideoUpload}"
              id="videoFileUpload"
              raised
              style="position: static;"
              useIconButton
              videoUpload
              method="POST"
              buttonIcon="videocam"
              .buttonText="${this.t("uploadVideo")}"
              @success="${this._videoUploaded}"
            >
            </yp-file-upload>
            <label
              ?hidden="${!this.videoPreviewUrl&&!this.collectionVideoURL}"
              class="layout vertical center-center videoCoverCheckbox"
            >
              <md-checkbox
                id="videoCoverCheckbox"
                name="useVideoCover"
                @click="${this._setVideoCover}"
                ?checked="${this.collection.configuration.useVideoCover}"
              >
              </md-checkbox>
              ${this.t("useVideoCover")}
            </label>
          </div>
        </div>
      </div>
    `}renderHeaderImageUploads(){return x`
      <div class="layout horizontal">
        <yp-file-upload
          ?hidden="${"new"==this.collectionId}"
          id="headerImageUpload"
          raised
          target="/api/images?itemType=domain-header"
          method="POST"
          buttonIcon="photo_camera"
          .buttonText="${this.t("image.header.upload")}"
          @success="${this._headerImageUploaded}"
        >
        </yp-file-upload>
      </div>
    `}static get styles(){return[super.styles,i$5`
        .saveButton {
          margin-left: 16px;
        }

        .deleteImageButton {
          margin-bottom: 48px;
          margin-left: 18px;
        }

        .videoCoverCheckbox {
          padding: 8px;
          border-radius: 20px;
          background-color: var(--md-sys-color-surface);
        }

        md-checkbox {
          padding: 4px;
        }

        md-outlined-text-field {
          width: 400px;
        }

        .videoUploadContainer {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
        }

        .imagePicker {
          width: 100%;
          position: absolute;
          bottom: 0;
        }

        md-tabs {
          margin-top: 16px;
          margin-bottom: 24px;
          width: 1024px;
          max-width: 100%;
        }

        .topInputContainer {
          margin-top: 16px;
          max-width: 1024px;
          padding: 24px;
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface);
          border-radius: 16px;
        }

        .adminItem {
          margin: 0px;
          width: 1024px;
          max-width: 100%;
          margin-bottom: 32px;
        }

        .innerTabContainer {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          border-radius: 16px;
          width: 900px;
          max-width: 100%;
          padding: 32px;
          margin-bottom: 128px;
        }

        @media (max-width: 600px) {
          .innerTabContainer {
            width: 100%;
          }
        }

        yp-structured-question-edit {
          width: 600px;
          max-width:100%;
        }

        .additionalSettings {
          margin-top: 16px;
        }

        yp-image {
          width: 432px;
          height: 243px;
        }

        .logoImagePlaceholder {
          width: 432px;
          height: 243px;
          position: relative;
          display: flex;
          align-items: center; /* Centers children vertically */
          justify-content: center;
          margin-right: 16px;
        }

        .logoUploadButtons {
          position: absolute;
          height: 48px;
          display: flex;
          justify-content: center;
        }

        .aiGenerationIconContainer {
          margin-left: 16px;
          margin-right: 16px;
          max-width: 42px;
          margin-bottom: 4px;
        }

        .aiGenerationIconContainer[background-not-active] {
          margin-bottom: 16px;
        }

        #generateButton {

        }

        .aiGenerationSpinnerInBackground {
          margin-top: 8px;
          margin-left: -24px;
        }

        #logoImageUpload {
          margin-bottom: 16px;
      `]}_setVideoCover(e){this.collection.configuration.useVideoCover=!e.target.checked,this._configChanged(),this.configTabs=this.setupConfigTabs()}renderNameAndDescription(e=!1){return x`
      <div class="layout vertical">
        <md-outlined-text-field
          id="name"
          name="name"
          type="text"
          @change="${this._configChanged}"
          .label="${this.t("Name")}"
          .value="${this.collection.name}"
          maxlength="50"
          charCounter
          class="mainInput"
        ></md-outlined-text-field>
        ${e?T$2:x`
              <md-outlined-text-field
                id="description"
                name="description"
                type="textarea"
                .value="${this.collection.description||""}"
                .label="${this.t("Description")}"
                @change="${this._configChanged}"
                rows="3"
                @keyup="${this._descriptionChanged}"
                maxlength="${this.descriptionMaxLength}"
                class="mainInput"
              ></md-outlined-text-field>
            `}
        <div class="horizontal end-justified layout pointEmoji">
          <div class="flex"></div>
          <yp-emoji-selector id="emojiSelectorDescription"></yp-emoji-selector>
        </div>
      </div>
    `}_descriptionChanged(e){const t=e.target.value,i=new RegExp(/(?:https?|http?):\/\/[\n\S]+/g),o=t.match(i);if(o&&o.length>0){let e=0;for(var n=0;n<Math.min(o.length,10);n++)e+=o[n].length;let t=300;t+=e,t-=Math.min(e,30*o.length),this.descriptionMaxLength=t}}render(){let e,t,i,o;return"new"===this.collectionId?("community"===this.collectionType?e="domain":"group"===this.collectionType&&(e="community"),t=this.parentCollectionId):this.collection&&(e=this.collectionType,t=this.collectionId),i=this.nameInput?.value,o=this.descriptionInput?.value,this.configTabs?x`
          <yp-form id="form" method="POST" customRedirect>
            <form
              name="ypForm"
              .method="${this.method}"
              .action="${this.action?this.action:""}"
            >
              <div class="layout horizontal center-center">
                ${this.renderHeader()}
              </div>
              ${this.renderTabs()} ${this.renderTabPages()}
              ${this.renderHiddenInputs()}

              <input
                type="hidden"
                name="themeId"
                .value="${this.themeId?.toString()||""}"
              />
              <input
                type="hidden"
                name="uploadedLogoImageId"
                .value="${this.uploadedLogoImageId?.toString()||""}"
              />
              <input
                type="hidden"
                name="uploadedHeaderImageId"
                .value="${this.uploadedHeaderImageId?.toString()||""}"
              />
            </form>
          </yp-form>
          <yp-generate-ai-image
            id="aiImageGenerator"
            .collectionType="${e}"
            .collectionId="${t}"
            .name="${i}"
            .description="${o}"
            @yp-generate-ai-image-background="${this._logoGeneratingInBackground}"
            @got-image="${this._gotAiImage}"
          >
          </yp-generate-ai-image>
        `:T$2}_logoGeneratingInBackground(e){this.generatingAiImageInBackground=!0}_gotAiImage(e){this.generatingAiImageInBackground=!1,this.imagePreviewUrl=e.detail.imageUrl,this.uploadedLogoImageId=e.detail.imageId,this.configChanged=!0}updated(e){super.updated(e),e.has("collection")&&this.collection&&(this.configTabs=this.setupConfigTabs()),e.has("collectionId")&&this.collectionId&&("new"==this.collectionId?this.method="POST":this.method="PUT")}async _getHelpPages(e=void 0,t=void 0){this.collectionId&&"new"!=this.collectionId?this.translatedPages=await window.serverApi.getHelpPages(e||this.collectionType,t||this.collectionId):console.error("Collection id setup for get help pages")}firstUpdated(e){super.firstUpdated(e),this._updateEmojiBindings()}_getLocalizePageTitle(e){let t="en";return window.appGlobals.locale&&e.title[window.appGlobals.locale]&&(t=window.appGlobals.locale),e.title[t]}beforeSave(){}afterSave(){}sendUpdateCollectionEvents(){"domain"==this.collectionType?this.fireGlobal("yp-refresh-domain"):"community"==this.collectionType?this.fireGlobal("yp-refresh-community"):"group"==this.collectionType&&this.fireGlobal("yp-refresh-group")}async _save(e){e.preventDefault(),e.stopPropagation(),this.beforeSave(),console.error("Saving collection",this.collection);const t=this.$$("#form");if(t.validate())this.$$("#spinner").hidden=!1,await t.submit(),this.$$("#spinner").hidden=!0,this.sendUpdateCollectionEvents(),this.afterSave();else{this.fire("yp-form-invalid");const e=this.t("form.invalid");this._showErrorDialog(e)}}_showErrorDialog(e){this.fire("yp-error",e)}_configChanged(){this.configChanged=!0}_videoUploaded(e){this.uploadedVideoId=e.detail.videoId,this.collection.configuration.useVideoCover=!0,this.videoPreviewUrl=e.detail.videoUrl,this.connectedVideoToCollection=!0,this._configChanged(),this.requestUpdate()}_getSaveCollectionPath(path){try{return eval(`this.collection.${path}`)}catch(e){return}}_clear(){this.collection=void 0,this.uploadedLogoImageId=void 0,this.uploadedHeaderImageId=void 0,this.imagePreviewUrl=void 0,this.collectionVideoId=void 0,this.uploadedVideoId=void 0,this.videoPreviewUrl=void 0,this.connectedVideoToCollection=!1,this.$$("#headerImageUpload").clear(),this.$$("#logoImageUpload").clear(),this.$$("#videoFileUpload")&&this.$$("#videoFileUpload").clear()}_updateEmojiBindings(){setTimeout((()=>{const e=this.$$("#description"),t=this.$$("#emojiSelectorDescription");e&&t?t.inputTarget=e:console.error("Could not find emoji selector or description input")}),500)}_getCurrentValue(question){if(this.collection&&this.collection.configuration&&-1==["textheader","textdescription"].indexOf(question.type)){const looseConfig=this.collection.configuration;if(question.text.indexOf(".")>-1)try{return eval(`this.collection.configuration.${question.text}`)}catch(e){console.error(e)}else{const e=looseConfig[question.text];if(void 0!==e)return e}}}}__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"configTabs",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"selectedTab",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"configChanged",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"method",void 0),__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"currentLogoImages",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"collectionVideoId",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"generatingAiImageInBackground",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"action",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"subRoute",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"hasVideoUpload",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"status",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"hasAudioUpload",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedLogoImageId",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedHeaderImageId",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedVideoId",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"connectedVideoToCollection",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"editHeaderText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"toastText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"saveText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"imagePreviewUrl",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"videoPreviewUrl",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"themeId",void 0),__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"translatedPages",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"descriptionMaxLength",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"tabsHidden",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"parentCollectionId",void 0),__decorate$g([n$8({type:Object})],YpAdminConfigBase.prototype,"parentCollection",void 0),__decorate$g([e$7("#name")],YpAdminConfigBase.prototype,"nameInput",void 0),__decorate$g([e$7("#description")],YpAdminConfigBase.prototype,"descriptionInput",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"gettingImageColor",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"detectedThemeColor",void 0);const clamp=(e,t=0,i=1)=>e>i?i:e<t?t:e,round=(e,t=0,i=Math.pow(10,t))=>Math.round(i*e)/i,hexToHsva=e=>rgbaToHsva(hexToRgba(e)),hexToRgba=e=>("#"===e[0]&&(e=e.substring(1)),e.length<6?{r:parseInt(e[0]+e[0],16),g:parseInt(e[1]+e[1],16),b:parseInt(e[2]+e[2],16),a:4===e.length?round(parseInt(e[3]+e[3],16)/255,2):1}:{r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16),a:8===e.length?round(parseInt(e.substring(6,8),16)/255,2):1}),hsvaToHex=e=>rgbaToHex(hsvaToRgba(e)),hsvaToHsla=({h:e,s:t,v:i,a:o})=>{const n=(200-t)*i/100;return{h:round(e),s:round(n>0&&n<200?t*i/100/(n<=100?n:200-n)*100:0),l:round(n/2),a:round(o,2)}},hsvaToHslString=e=>{const{h:t,s:i,l:o}=hsvaToHsla(e);return`hsl(${t}, ${i}%, ${o}%)`},hsvaToRgba=({h:e,s:t,v:i,a:o})=>{e=e/360*6,t/=100,i/=100;const n=Math.floor(e),s=i*(1-t),r=i*(1-(e-n)*t),a=i*(1-(1-e+n)*t),l=n%6;return{r:round(255*[i,r,s,s,a,i][l]),g:round(255*[a,i,i,r,s,s][l]),b:round(255*[s,s,a,i,i,r][l]),a:round(o,2)}},format=e=>{const t=e.toString(16);return t.length<2?"0"+t:t},rgbaToHex=({r:e,g:t,b:i,a:o})=>{const n=o<1?format(round(255*o)):"";return"#"+format(e)+format(t)+format(i)+n},rgbaToHsva=({r:e,g:t,b:i,a:o})=>{const n=Math.max(e,t,i),s=n-Math.min(e,t,i),r=s?n===e?(t-i)/s:n===t?2+(i-e)/s:4+(e-t)/s:0;return{h:round(60*(r<0?r+6:r)),s:round(n?s/n*100:0),v:round(n/255*100),a:o}},equalColorObjects=(e,t)=>{if(e===t)return!0;for(const i in e)if(e[i]!==t[i])return!1;return!0},equalHex=(e,t)=>e.toLowerCase()===t.toLowerCase()||equalColorObjects(hexToRgba(e),hexToRgba(t)),cache={},tpl=e=>{let t=cache[e];return t||(t=document.createElement("template"),t.innerHTML=e,cache[e]=t),t},fire=(e,t,i)=>{e.dispatchEvent(new CustomEvent(t,{bubbles:!0,detail:i}))};let hasTouched=!1;const isTouch$1=e=>"touches"in e,isValid=e=>!(hasTouched&&!isTouch$1(e))&&(hasTouched||(hasTouched=isTouch$1(e)),!0),pointerMove=(e,t)=>{const i=isTouch$1(t)?t.touches[0]:t,o=e.el.getBoundingClientRect();fire(e.el,"move",e.getMove({x:clamp((i.pageX-(o.left+window.pageXOffset))/o.width),y:clamp((i.pageY-(o.top+window.pageYOffset))/o.height)}))},keyMove=(e,t)=>{const i=t.keyCode;i>40||e.xy&&i<37||i<33||(t.preventDefault(),fire(e.el,"move",e.getMove({x:39===i?.01:37===i?-.01:34===i?.05:33===i?-.05:35===i?1:36===i?-1:0,y:40===i?.01:38===i?-.01:0},!0)))};class Slider{constructor(e,t,i,o){const n=tpl(`<div role="slider" tabindex="0" part="${t}" ${i}><div part="${t}-pointer"></div></div>`);e.appendChild(n.content.cloneNode(!0));const s=e.querySelector(`[part=${t}]`);s.addEventListener("mousedown",this),s.addEventListener("touchstart",this),s.addEventListener("keydown",this),this.el=s,this.xy=o,this.nodes=[s.firstChild,s]}set dragging(e){const t=e?document.addEventListener:document.removeEventListener;t(hasTouched?"touchmove":"mousemove",this),t(hasTouched?"touchend":"mouseup",this)}handleEvent(e){switch(e.type){case"mousedown":case"touchstart":if(e.preventDefault(),!isValid(e)||!hasTouched&&0!=e.button)return;this.el.focus(),pointerMove(this,e),this.dragging=!0;break;case"mousemove":case"touchmove":e.preventDefault(),pointerMove(this,e);break;case"mouseup":case"touchend":this.dragging=!1;break;case"keydown":keyMove(this,e)}}style(e){e.forEach(((e,t)=>{for(const i in e)this.nodes[t].style.setProperty(i,e[i])}))}}class Hue extends Slider{constructor(e){super(e,"hue",'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',!1)}update({h:e}){this.h=e,this.style([{left:e/360*100+"%",color:hsvaToHslString({h:e,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuenow",`${round(e)}`)}getMove(e,t){return{h:t?clamp(this.h+360*e.x,0,360):360*e.x}}}class Saturation extends Slider{constructor(e){super(e,"saturation",'aria-label="Color"',!0)}update(e){this.hsva=e,this.style([{top:100-e.v+"%",left:`${e.s}%`,color:hsvaToHslString(e)},{"background-color":hsvaToHslString({h:e.h,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuetext",`Saturation ${round(e.s)}%, Brightness ${round(e.v)}%`)}getMove(e,t){return{s:t?clamp(this.hsva.s+100*e.x,0,100):100*e.x,v:t?clamp(this.hsva.v-100*e.y,0,100):Math.round(100-100*e.y)}}}var css$1=':host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}',hueCss="[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}",saturationCss="[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}";const $isSame=Symbol("same"),$color=Symbol("color"),$hsva=Symbol("hsva"),$update=Symbol("update"),$parts=Symbol("parts"),$css=Symbol("css"),$sliders=Symbol("sliders");class ColorPicker extends HTMLElement{static get observedAttributes(){return["color"]}get[$css](){return[css$1,hueCss,saturationCss]}get[$sliders](){return[Saturation,Hue]}get color(){return this[$color]}set color(e){if(!this[$isSame](e)){const t=this.colorModel.toHsva(e);this[$update](t),this[$color]=e}}constructor(){super();const e=tpl(`<style>${this[$css].join("")}</style>`),t=this.attachShadow({mode:"open"});t.appendChild(e.content.cloneNode(!0)),t.addEventListener("move",this),this[$parts]=this[$sliders].map((e=>new e(t)))}connectedCallback(){if(this.hasOwnProperty("color")){const e=this.color;delete this.color,this.color=e}else this.color||(this.color=this.colorModel.defaultColor)}attributeChangedCallback(e,t,i){const o=this.colorModel.fromAttr(i);this[$isSame](o)||(this.color=o)}handleEvent(e){const t=this[$hsva],i={...t,...e.detail};let o;this[$update](i),equalColorObjects(i,t)||this[$isSame](o=this.colorModel.fromHsva(i))||(this[$color]=o,fire(this,"color-changed",{value:o}))}[$isSame](e){return this.color&&this.colorModel.equal(e,this.color)}[$update](e){this[$hsva]=e,this[$parts].forEach((t=>t.update(e)))}}const colorModel={defaultColor:"#000",toHsva:hexToHsva,fromHsva:({h:e,s:t,v:i})=>hsvaToHex({h:e,s:t,v:i,a:1}),equal:equalHex,fromAttr:e=>e};class HexBase extends ColorPicker{get colorModel(){return colorModel}}class HexColorPicker extends HexBase{}customElements.define("hex-color-picker",HexColorPicker);var __decorate$f=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpThemeColorInput=class extends YpBaseElement{constructor(){super(...arguments),this.disableSelection=!1,this.isColorPickerActive=!1,this.handleOutsideClick=e=>{if(!this.isColorPickerActive){const t=e.composedPath(),i=this.shadowRoot.querySelector("hex-color-picker");t.includes(i)||this.closePalette()}}}static get styles(){return[super.styles,i$5`
        md-outlined-select,
        md-outlined-text-field {
          width: 100%;
          margin-bottom: 16px;
          margin-top: 16px;
        }

        .container {
          position: relative;
        }

        .clearButton {
          position: absolute;
          left: -36px;
          top: 14px;
          opacity: 0.5;
        }

        hex-color-picker {
          position: absolute;
          top: -136px;
          right: 0;
          opacity: 1 !important;
        }
      `]}isValidHex(e){return!!e&&/^#([0-9A-F]{3}){1,2}$/i.test(e)}handleColorInput(e){const t=e.target.value;/^[0-9A-Fa-f]{0,6}$/.test(t)&&6===t.length?(this.color=t.replace("#",""),this.fire("input",{color:`${this.color}`})):e.target.value=this.color||"",console.error(`Invalid color: ${t}`)}_onPaste(e){e.preventDefault();let t="";e.clipboardData&&e.clipboardData.getData&&(t=e.clipboardData.getData("text/plain"));const i=t.replace(/[^0-9A-Fa-f]/g,"");this.isValidHex(`#${i}`)&&(this.color=i,this.fire("input",{color:`#${this.color}`}))}openPalette(){const e=this.shadowRoot.querySelector("hex-color-picker");e.hidden=!1,this.isColorPickerActive=!1,e.addEventListener("mousedown",(()=>this.isColorPickerActive=!0)),e.addEventListener("mouseup",(()=>this.isColorPickerActive=!1)),setTimeout((()=>document.addEventListener("click",this.handleOutsideClick,!0)),0)}closePalette(){const e=this.shadowRoot.querySelector("hex-color-picker");e&&(e.hidden=!0,document.removeEventListener("click",this.handleOutsideClick,!0))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleOutsideClick,!0);const e=this.shadowRoot.querySelector("hex-color-picker");e&&(e.removeEventListener("mousedown",(()=>this.isColorPickerActive=!0)),e.removeEventListener("mouseup",(()=>this.isColorPickerActive=!1)))}handleKeyDown(e){if(["Backspace","Tab","End","Home","ArrowLeft","ArrowRight","Delete"].includes(e.key))return;/^[0-9A-Fa-f]$/.test(e.key)||e.preventDefault()}handleColorChanged(e){this.color=e.detail.value.replace("#",""),this.fire("input",{color:`${this.color}`})}clearColor(){this.color=void 0,this.fire("input",{color:void 0})}render(){return x`
      <div class="container">
        <md-outlined-text-field
          .label="${this.label}"
          maxlength="6"
          trailing-icon
          @paste="${this._onPaste}"
          prefix-text="#"
          pattern="^[0-9A-Fa-f]{0,6}$"
          .value="${this.color||""}"
          ?disabled="${this.disableSelection}"
          @change="${this.handleColorInput}"
          @keydown="${this.handleKeyDown}"
          class="mainInput"
        >
          <md-icon-button @click="${this.openPalette}" slot="trailing-icon">
            <md-icon>palette</md-icon>
          </md-icon-button>
        </md-outlined-text-field>

        <md-icon-button
          ?hidden="${!this.color}"
          @click="${this.clearColor}"
          class="clearButton"
        >
          <md-icon>delete</md-icon>
        </md-icon-button>

        <hex-color-picker
          hidden
          @color-changed="${this.handleColorChanged}"
          .color="${this.color||"#000000"}"
        ></hex-color-picker>
      </div>
    `}};__decorate$f([n$8({type:String})],YpThemeColorInput.prototype,"color",void 0),__decorate$f([n$8({type:String})],YpThemeColorInput.prototype,"label",void 0),__decorate$f([n$8({type:Boolean})],YpThemeColorInput.prototype,"disableSelection",void 0),YpThemeColorInput=__decorate$f([t$5("yp-theme-color-input")],YpThemeColorInput);var __decorate$e=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpThemeSelector=class extends YpBaseElement{constructor(){super(...arguments),this.selectedThemeScheme="tonal",this.selectedThemeVariant="monochrome",this.disableSelection=!1,this.disableMultiInputs=!1,this.disableOneThemeColorInputs=!1,this.hasLogoImage=!1,this.channel=new BroadcastChannel("hex_color")}static get styles(){return[super.styles,i$5`
        md-outlined-select,
        md-outlined-text-field,
        yp-theme-color-input {
          max-width: 300px;
          width: 300px;
        }

        md-text-button {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .fontField {
          margin-bottom: 16px;
          max-width: 300px;
          width: 300px;
        }

        pre {
          max-width: 300px;
          font-size: 11px;
        }

        .colorTypeTitle {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: var(--md-sys-color-primary);
        }

        .darkContrastInfo {
          font-size: 11px;
          font-style: italic;
          margin-top: -8px;
          margin-bottom: 16px;
          text-align: center;
        }

        .or {
          margin-top: 16px;
          margin-bottom: 32px;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          max-width: 250px;
          width: 250px;
          text-align: center;
        }

        .color {
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 16px;
          margin-left: 32px;
          border-radius: 8px;
          width: 369px;
        }

        .leftContainer {
          align-self: start;
          margin-top: 32px;
        }

        .dynamicColors,
        .customColors {
          padding: 40px;
          margin: 32px;
          margin-bottom: 8px;
          margin-top: 8px;
          border-radius: 32px;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
        }
      `]}connectedCallback(){super.connectedCallback(),this.themeConfiguration&&(this.oneDynamicThemeColor=this.themeConfiguration.oneDynamicColor,this.selectedThemeScheme=this.themeConfiguration.oneColorScheme||this.selectedThemeScheme,this.selectedThemeVariant=this.themeConfiguration.variant||this.selectedThemeVariant,this.themePrimaryColor=this.themeConfiguration.primaryColor,this.themeSecondaryColor=this.themeConfiguration.secondaryColor,this.themeTertiaryColor=this.themeConfiguration.tertiaryColor,this.themeNeutralColor=this.themeConfiguration.neutralColor,this.themeNeutralVariantColor=this.themeConfiguration.neutralVariantColor,this.fontStyles=this.themeConfiguration.fontStyles,this.fontImports=this.themeConfiguration.fontImports),this.addGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}themeColorDetected(e){this.oneDynamicThemeColor=e.detail,console.error("Theme Color Detected:",this.oneDynamicThemeColor)}updated(e){let t=!1;["oneDynamicThemeColor","selectedThemeScheme","selectedThemeVariant","themePrimaryColor","themeSecondaryColor","themeTertiaryColor","themeNeutralColor","themeNeutralVariantColor","fontStyles","fontImports"].forEach((i=>{e.has(i)&&(t=!0,this.updateDisabledInputs(),this.fire("config-updated"))})),e.has("oneDynamicThemeColor")&&this.channel.postMessage(this.oneDynamicThemeColor),t&&(this.themeConfiguration={oneDynamicColor:this.oneDynamicThemeColor,oneColorScheme:this.selectedThemeScheme,variant:this.selectedThemeVariant,primaryColor:this.themePrimaryColor,secondaryColor:this.themeSecondaryColor,tertiaryColor:this.themeTertiaryColor,neutralColor:this.themeNeutralColor,neutralVariantColor:this.themeNeutralVariantColor,fontStyles:this.fontStyles,fontImports:this.fontImports},(this.themeConfiguration.oneDynamicColor||!this.themeConfiguration.oneDynamicColor&&this.themeConfiguration.primaryColor&&this.themeConfiguration.secondaryColor&&this.themeConfiguration.tertiaryColor&&this.themeConfiguration.neutralColor&&this.themeConfiguration.neutralVariantColor)&&this.fireGlobal("yp-theme-configuration-updated",this.themeConfiguration),this.fire("yp-theme-configuration-changed",this.themeConfiguration))}isValidHex(e){return!!e&&/^#([0-9A-F]{3}){1,2}$/i.test(e)}setThemeSchema(e){const t=e.target.selectedIndex;this.selectedThemeScheme=YpThemeManager.themeScemesOptionsWithName[t].value}setThemeVariant(e){const t=e.target.selectedIndex;this.selectedThemeVariant=YpThemeManager.themeVariantsOptionsWithName[t].value}handleColorInput(e){const t=e.target.value;/^[0-9A-Fa-f]{0,6}$/.test(t)?this.oneDynamicThemeColor=t:e.target.value=this.oneDynamicThemeColor||""}updateDisabledInputs(){this.disableOneThemeColorInputs=[this.themePrimaryColor,this.themeSecondaryColor,this.themeTertiaryColor,this.themeNeutralColor,this.themeNeutralVariantColor].some((e=>this.isValidHex(e))),this.disableMultiInputs=this.isValidHex(this.oneDynamicThemeColor)}get currentThemeSchemaIndex(){return YpThemeManager.themeScemesOptionsWithName.findIndex((e=>e.value===this.selectedThemeScheme))||0}updateFontStyles(e){this.fontStyles=e.target.value||"",this.fontStyles=this.fontStyles.replace("<style>","").replace("</style>","").trim()}updateFontImports(e){this.fontImports=e.target.value||"",this.fontImports=this.fontImports.replace("<style>","").replace("</style>",""),this.fontImports=this.fontImports.replace("<a href","").replace("</a>","").trim()}render(){return x`
      <div class="layout horizontal">
        <div class="layout vertical center-center leftContainer">
          <div class="dynamicColors">
            <div class="colorTypeTitle">${this.t("Dynamic Colors")}</div>
            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("One Dynamic Color")}"
              .color="${this.oneDynamicThemeColor}"
              .disableSelection="${this.disableSelection||this.disableOneThemeColorInputs}"
              @input="${e=>{this.oneDynamicThemeColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              label="Theme Scheme"
              .disabled="${this.disableSelection||this.disableOneThemeColorInputs}"
              @change="${this.setThemeSchema}"
              .selectedIndex="${this.currentThemeSchemaIndex}"
            >
              ${YpThemeManager.themeScemesOptionsWithName.map((e=>x`
                  <md-select-option value="${e.value}">
                    <div slot="headline">${e.name}</div>
                  </md-select-option>
                `))}
            </md-outlined-select>

            <div class="layout vertical center-center">
              <md-text-button
                ?hidden="${!this.hasLogoImage}"
                @click="${()=>this.fire("get-color-from-logo")}"
              >
                ${this.t("getColorFromLogo")}
              </md-text-button>
            </div>
          </div>

          <div class="or">${this.t("or")}</div>

          <div class="customColors">
            <div class="colorTypeTitle">${this.t("Custom Colors")}</div>
            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Primary Color")}"
              .color="${this.themePrimaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${e=>{this.themePrimaryColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Secondary Color")}"
              .color="${this.themeSecondaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${e=>{this.themeSecondaryColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Tertiary Color")}"
              .color="${this.themeTertiaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${e=>{this.themeTertiaryColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Color")}"
              .color="${this.themeNeutralColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${e=>{this.themeNeutralColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Variant Color")}"
              .color="${this.themeNeutralVariantColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${e=>{this.themeNeutralVariantColor=e.detail.color}}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              hidden
              label="Theme Variant"
              .disabled="${this.disableMultiInputs}"
              @change="${this.setThemeVariant}"
            >
              ${YpThemeManager.themeVariantsOptionsWithName.map((e=>x`
                  <md-select-option value="${e.value}">
                    <div slot="headline">${e.name}</div>
                  </md-select-option>
                `))}
            </md-outlined-select>
          </div>
          <div class="layout vertical center-center customColors">
            <md-outlined-text-field
              class="fontField"
              type="textarea"
              rows="3"
              .label="${this.t("fontImports")}"
              .value="${this.fontImports||""}"
              @change="${this.updateFontImports}"
              ?disabled="${this.disableSelection}"
            ></md-outlined-text-field>
            <md-outlined-text-field
              class="fontField"
              type="textarea"
              rows="6"
              .value="${this.fontStyles||""}"
              .label="${this.t("fontStyles")}"
              @change="${this.updateFontStyles}"
              ?disabled="${this.disableSelection}"
            ></md-outlined-text-field>

            <pre>
<code>
  body {
      font-family: Roboto, serif;
  }

  :root {
    --md-ref-typeface-brand: Roboto, serif;
    --md-ref-typeface-plain: Roboto, serif;
  }
</code>
${this.t("exampleFontStyles")}:
            </pre>
          </div>
        </div>
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            ${this.renderThemeToggle(!0)}
          </div>
          <div class="darkContrastInfo">
            ${this.t("userControlledSettings")}
          </div>

          ${this.renderPallette()}
        </div>
      </div>
    `}renderPallette(){return x`<div class="wrapper">
      ${c$4([{text:"Primary",color:"--md-sys-color-primary",contrast:"--md-sys-color-on-primary"},{text:"Primary Container",color:"--md-sys-color-primary-container",contrast:"--md-sys-color-on-primary-container"},{text:"Secondary",color:"--md-sys-color-secondary",contrast:"--md-sys-color-on-secondary"},{text:"Secondary Container",color:"--md-sys-color-secondary-container",contrast:"--md-sys-color-on-secondary-container"},{text:"Tertiary",color:"--md-sys-color-tertiary",contrast:"--md-sys-color-on-tertiary"},{text:"Tertiary Container",color:"--md-sys-color-tertiary-container",contrast:"--md-sys-color-on-tertiary-container"},{text:"Error",color:"--md-sys-color-error",contrast:"--md-sys-color-on-error"},{text:"Error Container",color:"--md-sys-color-error-container",contrast:"--md-sys-color-on-error-container"},{text:"Background",color:"--md-sys-color-background",contrast:"--md-sys-color-on-background"},{text:"Surface Dim",color:"--md-sys-color-surface-dim",contrast:"--md-sys-color-on-surface"},{text:"Surface",color:"--md-sys-color-surface",contrast:"--md-sys-color-on-surface"},{text:"Surface Bright",color:"--md-sys-color-surface-bright",contrast:"--md-sys-color-on-surface"},{text:"Surface Variant",color:"--md-sys-color-surface-variant",contrast:"--md-sys-color-on-surface-variant"},{text:"Surface Container Lowest",color:"--md-sys-color-surface-container-lowest",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Low",color:"--md-sys-color-surface-container-low",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container",color:"--md-sys-color-surface-container",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container High",color:"--md-sys-color-surface-container-high",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Highest",color:"--md-sys-color-surface-container-highest",contrast:"--md-sys-color-on-surface-container"},{text:"Inverse Primary",color:"--md-sys-color-inverse-primary",contrast:"--md-sys-color-inverse-on-primary"},{text:"Inverse Surface",color:"--md-sys-color-inverse-surface",contrast:"--md-sys-color-inverse-on-surface"}],(({text:e})=>e),(({text:e,color:t,contrast:i})=>x` <div
          class="color"
          style="color:var(${i});background-color:var(${t})"
        >
          ${e}
        </div>`))}
    </div>`}};__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"oneDynamicThemeColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themePrimaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeSecondaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeTertiaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeNeutralColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeNeutralVariantColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"fontStyles",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"fontImports",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"selectedThemeScheme",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"selectedThemeVariant",void 0),__decorate$e([n$8({type:Object})],YpThemeSelector.prototype,"themeConfiguration",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableSelection",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableMultiInputs",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableOneThemeColorInputs",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"hasLogoImage",void 0),YpThemeSelector=__decorate$e([t$5("yp-theme-selector")],YpThemeSelector);var __decorate$d=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminCommunities=class extends YpBaseElementWithLogin{newCommunity(){YpNavHelpers.redirectTo(`/community/new/${this.domain.id}`)}static get styles(){return[super.styles,i$5`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }

        .communityItem {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          width: 600px;
          margin: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .communityText {
          margin-top: 18px;
          font-size: 1.1em;
        }
      `]}gotoCommunity(e){YpNavHelpers.redirectTo(`/community/${e.id}`)}renderCommunity(e){const t=YpMediaHelpers.getImageFormatUrl(e.CommunityLogoImages);return x`
      <div
        class="layout horizontal communityItem"
        @click="${()=>this.gotoCommunity(e)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${t}"
        ></yp-image>
        <div class="layout vertical">
          <div class="communityText">${e.name}</div>
        </div>
      </div>
    `}render(){return x`
      <div class="layout horizontal center-center fabContainer">
        <md-fab
          .label="${this.t("New Community")}"
          @click="${this.newCommunity}"
        ><md-icon slot="icon">add</md-icon></md-fab>
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.domain.Communities.map((e=>this.renderCommunity(e)))}
        </div>
      </div>
    `}};__decorate$d([n$8({type:Object})],YpAdminCommunities.prototype,"domain",void 0),YpAdminCommunities=__decorate$d([t$5("yp-admin-communities")],YpAdminCommunities);var __decorate$c=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminConfigDomain=class extends YpAdminConfigBase{constructor(){super(),this.action="/domains"}static get styles(){return[super.styles,i$5``]}renderHeader(){return this.collection?x`
          <div class="layout horizontal topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout horizontal wrap">
              ${this.renderNameAndDescription()}
              <div>${this.renderSaveButton()}</div>
            </div>
          </div>

          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString()||""}"
          />
        `:T$2}renderHiddenInputs(){return x`
      ${(this.collection?.configuration).ltp?x`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `:T$2}
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$2}
    `}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(e){e.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.DomainLogoImages,this._setupTranslations(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.DomainLogoVideos&&this.collection.DomainLogoVideos.length>0&&(this.uploadedVideoId=this.collection.DomainLogoVideos[0].id)),e.has("collectionId")&&this.collectionId&&("new"==this.collectionId?this.action="/domains":this.action=`/domains/${this.collectionId}`),super.updated(e)}_setupTranslations(){"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},"completeAndAddToDomain"),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No domain found on custom redirect")}_finishRedirect(e){YpNavHelpers.redirectTo("/domain/"+e.id),window.appGlobals.activity("completed","editDomain")}setupConfigTabs(){const e=[];return e.push({name:"basic",icon:"code",items:[{text:"defaultLocale",type:"html",templateData:x`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.collection.default_locale}"
            >
            </yp-language-selector>
          `},{text:"themeSelector",type:"html",templateData:x`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.collection.configuration.theme}"
            ></yp-theme-selector>
          `},{text:"mediaUploads",type:"html",templateData:x`
            <div class="layout horizontal wrap">
              ${this.renderHeaderImageUploads()}
            </div>
          `},{text:"onlyAdminsCanCreateCommunities",type:"checkbox",value:this.collection.only_admins_can_create_communities,translationToken:"domain.onlyAdminsCanCreateCommunities"},{text:"hideAllTabs",type:"checkbox"},{text:"hideDomainNews",type:"checkbox"},{text:"welcomeHtmlInsteadOfCommunitiesList",type:"textarea",rows:5}]}),e.push({name:"webApp",icon:"get_app",items:[{text:"appHomeScreenShortName",type:"textfield",maxLength:12},{text:"appHomeScreenIconImageUpload",type:"html",templateData:x`
            <yp-file-upload
              id="appHomeScreenIconImageUpload"
              raised
              target="/api/images?itemType=app-home-screen-icon"
              method="POST"
              buttonIcon="photo_camera"
              .buttonText="${this.t("appHomeScreenIconImageUpload")}"
              @success="${this._appHomeScreenIconImageUploaded}"
            >
            </yp-file-upload>
          `}]}),e.push({name:"authApis",icon:"api",items:[{text:"Facebook Client Id",name:"facebookClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_id"),maxLength:60},{text:"Facebook Client Secret",name:"facebookClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_secret"),maxLength:60},{text:"Google Client Id",name:"googleClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_id"),maxLength:60},{text:"Google Client Secret",name:"googleClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_secret"),maxLength:60},{text:"Discord Client Id",name:"discordClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_id"),maxLength:60},{text:"Discord Client Secret",name:"discordClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_secret"),maxLength:60},{text:"Twitter Client Id",name:"twitterClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_id"),maxLength:60},{text:"Twitter Client Secret",name:"twitterClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_secret"),maxLength:60}]}),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};__decorate$c([n$8({type:Number})],YpAdminConfigDomain.prototype,"appHomeScreenIconImageId",void 0),YpAdminConfigDomain=__decorate$c([t$5("yp-admin-config-domain")],YpAdminConfigDomain);var __decorate$b=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminConfigCommunity=class extends YpAdminConfigBase{constructor(){super(),this.hasSamlLoginProvider=!1,this.communityAccess="public",this.action="/communities"}static get styles(){return[super.styles,i$5`
        .accessContainer {
        }

        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        md-radio {
          margin-right: 4px;
        }
      `]}renderHeader(){return this.collection?x`
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout vertical">
              ${this.renderNameAndDescription()}
              <md-outlined-text-field
                id="hostname"
                name="hostname"
                type="text"
                @keyup="${this._hostnameChanged}"
                label="${this.t("community.hostname")}"
                .value="${this.collection.hostname}"
                ?required="${!this.collection.is_community_folder}"
                maxlength="80"
                charCounter
                class="mainInput"
              ></md-outlined-text-field>
              <div class="hostnameInfo">https://${this.hostnameExample}</div>
            </div>
            <div>${this.renderSaveButton()}</div>
          </div>
        `:T$2}renderHiddenAccessSettings(){return this.communityAccess?x`
        <input type="hidden" name="${this.communityAccess}" value="on" />
      `:T$2}renderHiddenInputsNotActive(){return x`
      <input type="hidden" name="themeId" value="${o$9(this.themeId)}" />
    `}renderHiddenInputs(){return x`
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$2}
      <input
        type="hidden"
        name="appHomeScreenIconImageId"
        value="${this.appHomeScreenIconImageId?.toString()||""}"
      />

      ${(this.collection?.configuration).ltp?x`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `:T$2}

      <input
        type="hidden"
        name="ssnLoginListDataId"
        value="${o$9(this.ssnLoginListDataId)}"
      />

      <input type="hidden" name="status" value="${this.status||""}" />

      <input
        type="hidden"
        name="is_community_folder"
        value="${o$9(this.collection.is_community_folder)}"
      />

      <input
        type="hidden"
        name="in_community_folder_id"
        value="${o$9(this.inCommunityFolderId)}"
      />

      <input
        type="hidden"
        name="welcomePageId"
        value="${o$9(this.welcomePageId)}"
      />

      <input
        type="hidden"
        name="signupTermsPageId"
        value="${o$9(this.signupTermsPageId)}"
      />

      ${this.renderHiddenAccessSettings()}
    `}_hostnameChanged(){const e=this.$$("#hostname").value;this.hostnameExample=e?e+"."+window.appGlobals.domain.domain_name:"your-hostname.."+window.appGlobals.domain.domain_name,this._configChanged()}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0,this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0,this.inCommunityFolderId=void 0,this.signupTermsPageId=void 0,this.welcomePageId=void 0,this.availableCommunityFolders=void 0,this.$$("#appHomeScreenIconImageUpload").clear()}updated(e){e.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.CommunityLogoImages,this._communityChanged(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration),e.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(e)}languageChanged(){this._setupTranslations()}_communityChanged(){this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0&&(this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id),this._getHelpPages("community"),this.collection&&(0===this.collection.access?this.communityAccess="public":1===this.collection.access?this.communityAccess="closed":2===this.collection.access&&(this.communityAccess="secret"),this.collection.status&&(this.status=this.collection.status),this.collection.in_community_folder_id&&(this.inCommunityFolderId=this.collection.in_community_folder_id),this.collection.configuration&&(this.collection.configuration.signupTermsPageId&&(this.signupTermsPageId=this.collection.configuration.signupTermsPageId),this.collection.configuration.welcomePageId&&(this.welcomePageId=this.collection.configuration.welcomePageId))),window.appGlobals.hasVideoUpload?this.hasVideoUpload=!0:this.hasVideoUpload=!1,window.appGlobals.domain&&window.appGlobals.domain.samlLoginProvided?this.hasSamlLoginProvider=!0:this.hasSamlLoginProvider=!1,this.collection&&this.collection.configuration&&this.collection.configuration.ssnLoginListDataId&&(this.ssnLoginListDataId=this.collection.configuration.ssnLoginListDataId,this._getSsnListCount()),this.requestUpdate()}_deleteSsnLoginList(){this.collection&&this.ssnLoginListDataId&&(window.adminServerApi.deleteSsnLoginList(this.collection.id,this.ssnLoginListDataId),this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0)}_ssnLoginListDataUploaded(e){this.ssnLoginListDataId=JSON.parse(e.detail.xhr.response).ssnLoginListDataId,this._getSsnListCount(),this._configChanged()}async _getSsnListCount(){if(this.collection&&this.ssnLoginListDataId){const e=await window.adminServerApi.getSsnListCount(this.collection.id,this.ssnLoginListDataId);this.ssnLoginListDataCount=e.count}}_collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(this.action=`/communities/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",access:0,status:"active",only_admins_can_create_groups:!0,counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},hostname:"",is_community_folder:"newFolder"==this.collectionId}):this.action=`/communities/${this.collectionId}`}async _checkCommunityFolders(e){let t;t=e.Domain?e.Domain:window.appGlobals.domain;const i=await window.adminServerApi.getCommunityFolders(t.id);var o;i&&this.collection?.id&&(i.forEach(((e,t)=>{e.id==this.collection?.id&&(o=t)})),o&&i.splice(o,1));i&&i.length>0?(i.unshift({id:-1,name:this.t("none")}),this.availableCommunityFolders=i):this.availableCommunityFolders=void 0}_setupTranslations(){"new"==this.collectionId?(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("newCommunityFolder"):this.editHeaderText=this.t("community.new"),this.saveText=this.t("create"),this.toastText=this.t("communityToastCreated")):(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("updateCommunityFolder"):this.editHeaderText=this.t("Update community info"),this.saveText=this.t("save"),this.toastText=this.t("communityToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?t.hostnameTaken?window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("hostnameTaken"),void 0)})):this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},"completeAndAddToCommunity"),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No community found on custom redirect")}_finishRedirect(e){"new"==this.collectionId&&window.appUser.recheckAdminRights(),e.is_community_folder?YpNavHelpers.redirectTo("/community_folder/"+e.id):YpNavHelpers.redirectTo("/community/"+e.id),window.appGlobals.activity("completed","editCommunity")}_accessRadioChanged(e){this.communityAccess=e.target.value,this._configChanged()}_getAccessTab(){return{name:"access",icon:"code",items:[{text:"status",type:"html",templateData:x`
            <div class="layout vertical accessContainer">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  value="public"
                  ?checked="${"public"==this.communityAccess}"
                  name="access"
                ></md-radio>
                ${this.t("public")}
              </label>
              <label>
                <md-radio
                  @change="${this._accessRadioChanged}"
                  ?checked="${"secret"==this.communityAccess}"
                  value="secret"
                  name="access"
                ></md-radio>
                ${this.t("private")}
              </label>
            </div>
          `},{text:"status",type:"html",templateData:x`
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
            >
              ${this.collectionStatusOptions?.map(((e,t)=>x`
                  <md-select-option ?selected="${this.statusIndex==t}"
                    >${e.translatedName}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"onlyAdminsCanCreateGroups",type:"checkbox",value:this.collection.only_admins_can_create_groups,translationToken:"community.onlyAdminsCanCreateGroups"},{text:"alwaysShowOnDomainPage",type:"checkbox",value:this.collection.configuration.alwaysShowOnDomainPage,translationToken:"alwaysShowOnDomainPage"}]}}_getBasicTab(){return{name:"basic",icon:"code",items:[{text:"defaultLocale",type:"html",templateData:x`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.collection.default_locale}"
            >
            </yp-language-selector>
          `},{text:"facebookPixelId",type:"textfield",maxLength:40},{text:"redirectToGroupId",type:"textfield",maxLength:40},{text:"defaultLocationLongLat",type:"textfield",maxLength:100,value:this.collection.defaultLocationLongLat},{text:"inCommunityFolder",type:"html",templateData:x`
            <md-select
              .label="${this.t("inCommunityFolder")}"
              @selected="${this._communityFolderSelected}"
            >
              ${this.availableCommunityFolders?.map(((e,t)=>x`
                  <md-select-option
                    ?selected="${this.inCommunityFolderId==e.id}"
                    >${e.name}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.availableCommunityFolders},{text:"signupTermsSelectPage",type:"html",templateData:x`
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._signupTermsPageSelected}"
            >
              ${this.translatedPages?.map(((e,t)=>x`
                  <md-select-option
                    ?selected="${this.signupTermsPageId==e.id}"
                    >${this._getLocalizePageTitle(e)}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.translatedPages},{text:"welcomePageSelect",type:"html",templateData:x`
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(((e,t)=>x`
                  <md-select-option ?selected="${this.welcomePageId==e.id}"
                    >${this._getLocalizePageTitle(e)}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.translatedPages}]}}_welcomePageSelected(e){const t=e.detail.index;this.welcomePageId=this.translatedPages[t].id}get welcomePageIndex(){if(this.translatedPages){for(let e=0;e<this.translatedPages.length;e++)if(this.translatedPages[e].id==this.welcomePageId)return e;return-1}return-1}_signupTermsPageSelected(e){const t=e.detail.index;this.signupTermsPageId=this.translatedPages[t].id}get signupTermsPageIndex(){if(this.translatedPages){for(let e=0;e<this.translatedPages.length;e++)if(this.translatedPages[e].id==this.signupTermsPageId)return e;return-1}return-1}_communityFolderSelected(e){const t=e.detail.index;this.inCommunityFolderId=this.availableCommunityFolders[t].id}get communityFolderIndex(){if(this.availableCommunityFolders){for(let e=0;e<this.availableCommunityFolders.length;e++)if(this.availableCommunityFolders[e].id==this.inCommunityFolderId)return e;return-1}return-1}_getLookAndFeelTab(){return{name:"lookAndFeel",icon:"code",items:[{text:"themeSelector",type:"html",templateData:x`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.collection.configuration.theme}"
            ></yp-theme-selector>
          `},{text:"hideRecommendationOnNewsFeed",type:"checkbox"},{text:"disableCollectionUpLink",type:"checkbox",translationToken:"disableCommunityDomainUpLink"},{text:"disableNameAutoTranslation",type:"checkbox"},{text:"hideAllTabs",type:"checkbox"},{text:"welcomeHTML",type:"textarea",rows:2,maxRows:5},{text:"sortBySortOrder",type:"checkbox",translationToken:"sortGroupsBySortOrder"},{text:"highlightedLanguages",type:"textfield",maxLength:200},{text:"customBackName",type:"textfield",maxLength:20},{text:"customBackURL",type:"textfield",maxLength:256}]}}_getWebAppTab(){return{name:"webApp",icon:"get_app",items:[{text:"appHomeScreenShortName",type:"textfield",maxLength:12},{text:"appHomeScreenIconImageUpload",type:"html",templateData:x`
            <yp-file-upload
              id="appHomeScreenIconImageUpload"
              raised
              target="/api/images?itemType=app-home-screen-icon"
              method="POST"
              buttonIcon="photo_camera"
              .buttonText="${this.t("appHomeScreenIconImageUpload")}"
              @success="${this._appHomeScreenIconImageUploaded}"
            >
            </yp-file-upload>
          `}]}}_getSamlTab(){return{name:"samlAuth",icon:"security",items:[{text:"forceSecureSamlLogin",type:"checkbox",disabled:!this.hasSamlLoginProvider},{text:"customSamlLoginMessage",type:"textarea",rows:2,maxRows:5,maxLength:175},{text:"customSamlDeniedMessage",type:"textarea",rows:2,maxRows:5,maxLength:150},{text:"ssnLoginListDataUpload",type:"html",templateData:x`
            ${this.collection&&this.ssnLoginListDataId?x`
                <div>
                  <b>${this.t("ssnLoginListCount")}: ${this.ssnLoginListDataCount}</b>
                </div>
                <div>
                  <md-filled-button
                    style="padding: 8px;"
                    raised
                    .label="${this.t("deleteSsnLoginList")}"
                    @click="${this._deleteSsnLoginList}"
                    ></md-filled-button
                  >
                </div>
              </div>
                `:T$2}
            ${this.collection&&!this.ssnLoginListDataId?x`
                  <yp-file-upload
                    id="ssnLoginListDataUpload"
                    raised
                    ?disable="${!this.hasSamlLoginProvider}"
                    accept=".txt,.csv"
                    .target="/api/communities/${this.collection.id}/upload_ssn_login_list"
                    method="POST"
                    buttonIcon="link"
                    .buttonText="${this.t("appHomeScreenIconImageUpload")}"
                    @success="${this._ssnLoginListDataUploaded}"
                  >
                  </yp-file-upload>
                `:T$2}
          `}]}}setupConfigTabs(){const e=[];return e.push(this._getAccessTab()),e.push(this._getBasicTab()),e.push(this._getLookAndFeelTab()),e.push(this._getWebAppTab()),e.push(this._getSamlTab()),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"appHomeScreenIconImageId",void 0),__decorate$b([n$8({type:String})],YpAdminConfigCommunity.prototype,"hostnameExample",void 0),__decorate$b([n$8({type:Boolean})],YpAdminConfigCommunity.prototype,"hasSamlLoginProvider",void 0),__decorate$b([n$8({type:Array})],YpAdminConfigCommunity.prototype,"availableCommunityFolders",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataCount",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"inCommunityFolderId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"signupTermsPageId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"welcomePageId",void 0),__decorate$b([n$8({type:String})],YpAdminConfigCommunity.prototype,"communityAccess",void 0),YpAdminConfigCommunity=__decorate$b([t$5("yp-admin-config-community")],YpAdminConfigCommunity);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isCEPolyfill="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,removeNodes=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},marker=`{{lit-${String(Math.random()).slice(2)}}}`,nodeMarker=`\x3c!--${marker}--\x3e`,markerRegex=new RegExp(`${marker}|${nodeMarker}`),boundAttributeSuffix="$lit$";class Template{constructor(e,t){this.parts=[],this.element=t;const i=[],o=[],n=document.createTreeWalker(t.content,133,null,!1);let s=0,r=-1,a=0;const{strings:l,values:{length:c}}=e;for(;a<c;){const e=n.nextNode();if(null!==e){if(r++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:i}=t;let o=0;for(let e=0;e<i;e++)endsWith(t[e].name,boundAttributeSuffix)&&o++;for(;o-- >0;){const t=l[a],i=lastAttributeNameRegex.exec(t)[2],o=i.toLowerCase()+boundAttributeSuffix,n=e.getAttribute(o);e.removeAttribute(o);const s=n.split(markerRegex);this.parts.push({type:"attribute",index:r,name:i,strings:s}),a+=s.length-1}}"TEMPLATE"===e.tagName&&(o.push(e),n.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(marker)>=0){const o=e.parentNode,n=t.split(markerRegex),s=n.length-1;for(let t=0;t<s;t++){let i,s=n[t];if(""===s)i=createMarker();else{const e=lastAttributeNameRegex.exec(s);null!==e&&endsWith(e[2],boundAttributeSuffix)&&(s=s.slice(0,e.index)+e[1]+e[2].slice(0,-boundAttributeSuffix.length)+e[3]),i=document.createTextNode(s)}o.insertBefore(i,e),this.parts.push({type:"node",index:++r})}""===n[s]?(o.insertBefore(createMarker(),e),i.push(e)):e.data=n[s],a+=s}}else if(8===e.nodeType)if(e.data===marker){const t=e.parentNode;null!==e.previousSibling&&r!==s||(r++,t.insertBefore(createMarker(),e)),s=r,this.parts.push({type:"node",index:r}),null===e.nextSibling?e.data="":(i.push(e),r--),a++}else{let t=-1;for(;-1!==(t=e.data.indexOf(marker,t+1));)this.parts.push({type:"node",index:-1}),a++}}else n.currentNode=o.pop()}for(const e of i)e.parentNode.removeChild(e)}}const endsWith=(e,t)=>{const i=e.length-t.length;return i>=0&&e.slice(i)===t},isTemplatePartActive=e=>-1!==e.index,createMarker=()=>document.createComment(""),lastAttributeNameRegex=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,walkerNodeFilter=133;function removeNodesFromTemplate(e,t){const{element:{content:i},parts:o}=e,n=document.createTreeWalker(i,walkerNodeFilter,null,!1);let s=nextActiveIndexInTemplateParts(o),r=o[s],a=-1,l=0;const c=[];let d=null;for(;n.nextNode();){a++;const e=n.currentNode;for(e.previousSibling===d&&(d=null),t.has(e)&&(c.push(e),null===d&&(d=e)),null!==d&&l++;void 0!==r&&r.index===a;)r.index=null!==d?-1:r.index-l,s=nextActiveIndexInTemplateParts(o,s),r=o[s]}c.forEach((e=>e.parentNode.removeChild(e)))}const countNodes=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,walkerNodeFilter,null,!1);for(;i.nextNode();)t++;return t},nextActiveIndexInTemplateParts=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(isTemplatePartActive(t))return i}return-1};function insertNodeIntoTemplate(e,t,i=null){const{element:{content:o},parts:n}=e;if(null==i)return void o.appendChild(t);const s=document.createTreeWalker(o,walkerNodeFilter,null,!1);let r=nextActiveIndexInTemplateParts(n),a=0,l=-1;for(;s.nextNode();){l++;for(s.currentNode===i&&(a=countNodes(t),i.parentNode.insertBefore(t,i));-1!==r&&n[r].index===l;){if(a>0){for(;-1!==r;)n[r].index+=a,r=nextActiveIndexInTemplateParts(n,r);return}r=nextActiveIndexInTemplateParts(n,r)}}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const directives=new WeakMap,isDirective=e=>"function"==typeof e&&directives.has(e),noChange={},nothing={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class TemplateInstance{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=isCEPolyfill?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],i=this.template.parts,o=document.createTreeWalker(e,133,null,!1);let n,s=0,r=0,a=o.nextNode();for(;s<i.length;)if(n=i[s],isTemplatePartActive(n)){for(;r<n.index;)r++,"TEMPLATE"===a.nodeName&&(t.push(a),o.currentNode=a.content),null===(a=o.nextNode())&&(o.currentNode=t.pop(),a=o.nextNode());if("node"===n.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(a.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(a,n.name,n.strings,this.options));s++}else this.__parts.push(void 0),s++;return isCEPolyfill&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const policy$1=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:e=>e}),commentMarker=` ${marker} `;class TemplateResult{constructor(e,t,i,o){this.strings=e,this.values=t,this.type=i,this.processor=o}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let o=0;o<e;o++){const e=this.strings[o],n=e.lastIndexOf("\x3c!--");i=(n>-1||i)&&-1===e.indexOf("--\x3e",n+1);const s=lastAttributeNameRegex.exec(e);t+=null===s?e+(i?commentMarker:nodeMarker):e.substr(0,s.index)+s[1]+s[2]+boundAttributeSuffix+s[3]+marker}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");let t=this.getHTML();return void 0!==policy$1&&(t=policy$1.createHTML(t)),e.innerHTML=t,e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const isPrimitive=e=>null===e||!("object"==typeof e||"function"==typeof e),isIterable=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class AttributeCommitter{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new AttributePart(this)}_getValue(){const e=this.strings,t=e.length-1,i=this.parts;if(1===t&&""===e[0]&&""===e[1]){const e=i[0].value;if("symbol"==typeof e)return String(e);if("string"==typeof e||!isIterable(e))return e}let o="";for(let n=0;n<t;n++){o+=e[n];const t=i[n];if(void 0!==t){const e=t.value;if(isPrimitive(e)||!isIterable(e))o+="string"==typeof e?e:String(e);else for(const t of e)o+="string"==typeof t?t:String(t)}}return o+=e[t],o}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class AttributePart{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===noChange||isPrimitive(e)&&e===this.value||(this.value=e,isDirective(e)||(this.committer.dirty=!0))}commit(){for(;isDirective(this.value);){const e=this.value;this.value=noChange,e(this)}this.value!==noChange&&this.committer.commit()}}class NodePart{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(createMarker()),this.endNode=e.appendChild(createMarker())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=createMarker()),e.__insert(this.endNode=createMarker())}insertAfterPart(e){e.__insert(this.startNode=createMarker()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){if(null===this.startNode.parentNode)return;for(;isDirective(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=noChange,e(this)}const e=this.__pendingValue;e!==noChange&&(isPrimitive(e)?e!==this.value&&this.__commitText(e):e instanceof TemplateResult?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):isIterable(e)?this.__commitIterable(e):e===nothing?(this.value=nothing,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof TemplateInstance&&this.value.template===t)this.value.update(e.values);else{const i=new TemplateInstance(t,e.processor,this.options),o=i._clone();i.update(e.values),this.__commitNode(o),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,o=0;for(const n of e)i=t[o],void 0===i&&(i=new NodePart(this.options),t.push(i),0===o?i.appendIntoPart(this):i.insertAfterPart(t[o-1])),i.setValue(n),i.commit(),o++;o<t.length&&(t.length=o,this.clear(i&&i.endNode))}clear(e=this.startNode){removeNodes(this.startNode.parentNode,e.nextSibling,this.endNode)}}class BooleanAttributePart{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;isDirective(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=noChange,e(this)}if(this.__pendingValue===noChange)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=noChange}}class PropertyCommitter extends AttributeCommitter{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new PropertyPart(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class PropertyPart extends AttributePart{}let eventOptionsSupported=!1;(()=>{try{const e={get capture(){return eventOptionsSupported=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}})();class EventPart{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;isDirective(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=noChange,e(this)}if(this.__pendingValue===noChange)return;const e=this.__pendingValue,t=this.value,i=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),o=null!=e&&(null==t||i);i&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),o&&(this.__options=getOptions(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=noChange}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const getOptions=e=>e&&(eventOptionsSupported?{capture:e.capture,passive:e.passive,once:e.once}:e.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function templateFactory(e){let t=templateCaches.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},templateCaches.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const o=e.strings.join(marker);return i=t.keyString.get(o),void 0===i&&(i=new Template(e,e.getTemplateElement()),t.keyString.set(o,i)),t.stringsArray.set(e.strings,i),i}const templateCaches=new Map,parts=new WeakMap,render$1=(e,t,i)=>{let o=parts.get(t);void 0===o&&(removeNodes(t,t.firstChild),parts.set(t,o=new NodePart(Object.assign({templateFactory:templateFactory},i))),o.appendInto(t)),o.setValue(e),o.commit()};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class DefaultTemplateProcessor{handleAttributeExpressions(e,t,i,o){const n=t[0];if("."===n){return new PropertyCommitter(e,t.slice(1),i).parts}if("@"===n)return[new EventPart(e,t.slice(1),o.eventContext)];if("?"===n)return[new BooleanAttributePart(e,t.slice(1),i)];return new AttributeCommitter(e,t,i).parts}handleTextExpression(e){return new NodePart(e)}}const defaultTemplateProcessor=new DefaultTemplateProcessor;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const html$1=(e,...t)=>new TemplateResult(e,t,"html",defaultTemplateProcessor)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,getTemplateCacheKey=(e,t)=>`${e}--${t}`;let compatibleShadyCSSVersion=!0;void 0===window.ShadyCSS?compatibleShadyCSSVersion=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),compatibleShadyCSSVersion=!1);const shadyTemplateFactory=e=>t=>{const i=getTemplateCacheKey(t.type,e);let o=templateCaches.get(i);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},templateCaches.set(i,o));let n=o.stringsArray.get(t.strings);if(void 0!==n)return n;const s=t.strings.join(marker);if(n=o.keyString.get(s),void 0===n){const i=t.getTemplateElement();compatibleShadyCSSVersion&&window.ShadyCSS.prepareTemplateDom(i,e),n=new Template(t,i),o.keyString.set(s,n)}return o.stringsArray.set(t.strings,n),n},TEMPLATE_TYPES=["html","svg"],removeStylesFromLitTemplates=e=>{TEMPLATE_TYPES.forEach((t=>{const i=templateCaches.get(getTemplateCacheKey(t,e));void 0!==i&&i.keyString.forEach((e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach((e=>{i.add(e)})),removeNodesFromTemplate(e,i)}))}))},shadyRenderSet=new Set,prepareTemplateStyles=(e,t,i)=>{shadyRenderSet.add(e);const o=i?i.element:document.createElement("template"),n=t.querySelectorAll("style"),{length:s}=n;if(0===s)return void window.ShadyCSS.prepareTemplateStyles(o,e);const r=document.createElement("style");for(let e=0;e<s;e++){const t=n[e];t.parentNode.removeChild(t),r.textContent+=t.textContent}removeStylesFromLitTemplates(e);const a=o.content;i?insertNodeIntoTemplate(i,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(o,e);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)t.insertBefore(l.cloneNode(!0),t.firstChild);else if(i){a.insertBefore(r,a.firstChild);const e=new Set;e.add(r),removeNodesFromTemplate(i,e)}},render=(e,t,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const o=i.scopeName,n=parts.has(t),s=compatibleShadyCSSVersion&&11===t.nodeType&&!!t.host,r=s&&!shadyRenderSet.has(o),a=r?document.createDocumentFragment():t;if(render$1(e,a,Object.assign({templateFactory:shadyTemplateFactory(o)},i)),r){const e=parts.get(a);parts.delete(a);const i=e.value instanceof TemplateInstance?e.value.template:void 0;prepareTemplateStyles(o,a,i),removeNodes(t,t.firstChild),t.appendChild(a),parts.set(t,e)}!n&&s&&window.ShadyCSS.styleElement(t.host)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;window.JSCompiler_renameProperty=(e,t)=>e;const defaultConverter={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},notEqual=(e,t)=>t!==e&&(t==t||e==e),defaultPropertyDeclaration={attribute:!0,type:String,converter:defaultConverter,reflect:!1,hasChanged:notEqual},STATE_HAS_UPDATED=1,STATE_UPDATE_REQUESTED=4,STATE_IS_REFLECTING_TO_ATTRIBUTE=8,STATE_IS_REFLECTING_TO_PROPERTY=16,finalized="finalized";class UpdatingElement extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach(((t,i)=>{const o=this._attributeNameForProperty(i,t);void 0!==o&&(this._attributeToPropertyMap.set(o,i),e.push(o))})),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach(((e,t)=>this._classProperties.set(t,e)))}}static createProperty(e,t=defaultPropertyDeclaration){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():`__${e}`,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const n=this[e];this[t]=o,this.requestUpdateInternal(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this._classProperties&&this._classProperties.get(e)||defaultPropertyDeclaration}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty(finalized)||e.finalize(),this[finalized]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=notEqual){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,o=t.converter||defaultConverter,n="function"==typeof o?o:o.fromAttribute;return n?n(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,o=t.converter;return(o&&o.toAttribute||defaultConverter.toAttribute)(e,i)}initialize(){this._updateState=0,this._updatePromise=new Promise((e=>this._enableUpdatingResolver=e)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((e,t)=>this[t]=e)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=defaultPropertyDeclaration){const o=this.constructor,n=o._attributeNameForProperty(e,i);if(void 0!==n){const e=o._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=this._updateState|STATE_IS_REFLECTING_TO_ATTRIBUTE,null==e?this.removeAttribute(n):this.setAttribute(n,e),this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_ATTRIBUTE}}_attributeToProperty(e,t){if(this._updateState&STATE_IS_REFLECTING_TO_ATTRIBUTE)return;const i=this.constructor,o=i._attributeToPropertyMap.get(e);if(void 0!==o){const e=i.getPropertyOptions(o);this._updateState=this._updateState|STATE_IS_REFLECTING_TO_PROPERTY,this[o]=i._propertyValueFromAttribute(t,e),this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_PROPERTY}}requestUpdateInternal(e,t,i){let o=!0;if(void 0!==e){const n=this.constructor;i=i||n.getPropertyOptions(e),n._valueHasChanged(this[e],t,i.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==i.reflect||this._updateState&STATE_IS_REFLECTING_TO_PROPERTY||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,i))):o=!1}!this._hasRequestedUpdate&&o&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(e,t){return this.requestUpdateInternal(e,t),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|STATE_UPDATE_REQUESTED;try{await this._updatePromise}catch(e){}const e=this.performUpdate();return null!=e&&await e,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&STATE_UPDATE_REQUESTED}get hasUpdated(){return this._updateState&STATE_HAS_UPDATED}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e?this.update(t):this._markUpdated()}catch(t){throw e=!1,this._markUpdated(),t}e&&(this._updateState&STATE_HAS_UPDATED||(this._updateState=this._updateState|STATE_HAS_UPDATED,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~STATE_UPDATE_REQUESTED}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((e,t)=>this._propertyToAttribute(t,this[t],e))),this._reflectingProperties=void 0),this._markUpdated()}updated(e){}firstUpdated(e){}}_a=finalized,UpdatingElement[_a]=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,constructionToken=Symbol();class CSSResult{constructor(e,t){if(t!==constructionToken)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(supportsAdoptingStyleSheets?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const unsafeCSS=e=>new CSSResult(String(e),constructionToken),textFromCSSResult=e=>{if(e instanceof CSSResult)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)},css=(e,...t)=>{const i=t.reduce(((t,i,o)=>t+textFromCSSResult(i)+e[o+1]),e[0]);return new CSSResult(i,constructionToken)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const renderNotImplemented={};class LitElement extends UpdatingElement{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const e=this.getStyles();if(Array.isArray(e)){const t=(e,i)=>e.reduceRight(((e,i)=>Array.isArray(i)?t(i,e):(e.add(i),e)),i),i=t(e,new Set),o=[];i.forEach((e=>o.unshift(e))),this._styles=o}else this._styles=void 0===e?[]:[e];this._styles=this._styles.map((e=>{if(e instanceof CSSStyleSheet&&!supportsAdoptingStyleSheets){const t=Array.prototype.slice.call(e.cssRules).reduce(((e,t)=>e+t.cssText),"");return unsafeCSS(t)}return e}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?supportsAdoptingStyleSheets?this.renderRoot.adoptedStyleSheets=e.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map((e=>e.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){const t=this.render();super.update(e),t!==renderNotImplemented&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)})))}render(){return renderNotImplemented}}LitElement.finalized=!0,LitElement.render=render,LitElement.shadowRootOptions={mode:"open"};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var __extends=(extendStatics=function(e,t){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])},extendStatics(e,t)},function(e,t){function i(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}),extendStatics,_hasOwnProperty=Object.prototype.hasOwnProperty;function hasOwnProperty$1(e,t){return _hasOwnProperty.call(e,t)}function _objectKeys(e){if(Array.isArray(e)){for(var t=new Array(e.length),i=0;i<t.length;i++)t[i]=""+i;return t}if(Object.keys)return Object.keys(e);var o=[];for(var n in e)hasOwnProperty$1(e,n)&&o.push(n);return o}function _deepClone(e){switch(typeof e){case"object":return JSON.parse(JSON.stringify(e));case"undefined":return null;default:return e}}function isInteger(e){for(var t,i=0,o=e.length;i<o;){if(!((t=e.charCodeAt(i))>=48&&t<=57))return!1;i++}return!0}function escapePathComponent(e){return-1===e.indexOf("/")&&-1===e.indexOf("~")?e:e.replace(/~/g,"~0").replace(/\//g,"~1")}function unescapePathComponent(e){return e.replace(/~1/g,"/").replace(/~0/g,"~")}function hasUndefined(e){if(void 0===e)return!0;if(e)if(Array.isArray(e)){for(var t=0,i=e.length;t<i;t++)if(hasUndefined(e[t]))return!0}else if("object"==typeof e)for(var o=_objectKeys(e),n=o.length,s=0;s<n;s++)if(hasUndefined(e[o[s]]))return!0;return!1}function patchErrorMessageFormatter(e,t){var i=[e];for(var o in t){var n="object"==typeof t[o]?JSON.stringify(t[o],null,2):t[o];void 0!==n&&i.push(o+": "+n)}return i.join("\n")}var PatchError=function(e){function t(t,i,o,n,s){var r=this.constructor,a=e.call(this,patchErrorMessageFormatter(t,{name:i,index:o,operation:n,tree:s}))||this;return a.name=i,a.index=o,a.operation=n,a.tree=s,Object.setPrototypeOf(a,r.prototype),a.message=patchErrorMessageFormatter(t,{name:i,index:o,operation:n,tree:s}),a}return __extends(t,e),t}(Error),JsonPatchError=PatchError,deepClone=_deepClone,objOps={add:function(e,t,i){return e[t]=this.value,{newDocument:i}},remove:function(e,t,i){var o=e[t];return delete e[t],{newDocument:i,removed:o}},replace:function(e,t,i){var o=e[t];return e[t]=this.value,{newDocument:i,removed:o}},move:function(e,t,i){var o=getValueByPointer(i,this.path);o&&(o=_deepClone(o));var n=applyOperation(i,{op:"remove",path:this.from}).removed;return applyOperation(i,{op:"add",path:this.path,value:n}),{newDocument:i,removed:o}},copy:function(e,t,i){var o=getValueByPointer(i,this.from);return applyOperation(i,{op:"add",path:this.path,value:_deepClone(o)}),{newDocument:i}},test:function(e,t,i){return{newDocument:i,test:_areEquals(e[t],this.value)}},_get:function(e,t,i){return this.value=e[t],{newDocument:i}}},arrOps={add:function(e,t,i){return isInteger(t)?e.splice(t,0,this.value):e[t]=this.value,{newDocument:i,index:t}},remove:function(e,t,i){return{newDocument:i,removed:e.splice(t,1)[0]}},replace:function(e,t,i){var o=e[t];return e[t]=this.value,{newDocument:i,removed:o}},move:objOps.move,copy:objOps.copy,test:objOps.test,_get:objOps._get};function getValueByPointer(e,t){if(""==t)return e;var i={op:"_get",path:t};return applyOperation(e,i),i.value}function applyOperation(e,t,i,o,n,s){if(void 0===i&&(i=!1),void 0===o&&(o=!0),void 0===n&&(n=!0),void 0===s&&(s=0),i&&("function"==typeof i?i(t,0,e,t.path):validator(t,0)),""===t.path){var r={newDocument:e};if("add"===t.op)return r.newDocument=t.value,r;if("replace"===t.op)return r.newDocument=t.value,r.removed=e,r;if("move"===t.op||"copy"===t.op)return r.newDocument=getValueByPointer(e,t.from),"move"===t.op&&(r.removed=e),r;if("test"===t.op){if(r.test=_areEquals(e,t.value),!1===r.test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",s,t,e);return r.newDocument=e,r}if("remove"===t.op)return r.removed=e,r.newDocument=null,r;if("_get"===t.op)return t.value=e,r;if(i)throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",s,t,e);return r}o||(e=_deepClone(e));var a=(t.path||"").split("/"),l=e,c=1,d=a.length,g=void 0,I=void 0,h=void 0;for(h="function"==typeof i?i:validator;;){if((I=a[c])&&-1!=I.indexOf("~")&&(I=unescapePathComponent(I)),n&&("__proto__"==I||"prototype"==I&&c>0&&"constructor"==a[c-1]))throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(i&&void 0===g&&(void 0===l[I]?g=a.slice(0,c).join("/"):c==d-1&&(g=t.path),void 0!==g&&h(t,0,e,g)),c++,Array.isArray(l)){if("-"===I)I=l.length;else{if(i&&!isInteger(I))throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",s,t,e);isInteger(I)&&(I=~~I)}if(c>=d){if(i&&"add"===t.op&&I>l.length)throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",s,t,e);if(!1===(r=arrOps[t.op].call(t,l,I,e)).test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",s,t,e);return r}}else if(c>=d){if(!1===(r=objOps[t.op].call(t,l,I,e)).test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",s,t,e);return r}if(l=l[I],i&&c<d&&(!l||"object"!=typeof l))throw new JsonPatchError("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",s,t,e)}}function applyPatch(e,t,i,o,n){if(void 0===o&&(o=!0),void 0===n&&(n=!0),i&&!Array.isArray(t))throw new JsonPatchError("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");o||(e=_deepClone(e));for(var s=new Array(t.length),r=0,a=t.length;r<a;r++)s[r]=applyOperation(e,t[r],i,!0,n,r),e=s[r].newDocument;return s.newDocument=e,s}function applyReducer(e,t,i){var o=applyOperation(e,t);if(!1===o.test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",i,t,e);return o.newDocument}function validator(e,t,i,o){if("object"!=typeof e||null===e||Array.isArray(e))throw new JsonPatchError("Operation is not an object","OPERATION_NOT_AN_OBJECT",t,e,i);if(!objOps[e.op])throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",t,e,i);if("string"!=typeof e.path)throw new JsonPatchError("Operation `path` property is not a string","OPERATION_PATH_INVALID",t,e,i);if(0!==e.path.indexOf("/")&&e.path.length>0)throw new JsonPatchError('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",t,e,i);if(("move"===e.op||"copy"===e.op)&&"string"!=typeof e.from)throw new JsonPatchError("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",t,e,i);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&void 0===e.value)throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",t,e,i);if(("add"===e.op||"replace"===e.op||"test"===e.op)&&hasUndefined(e.value))throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",t,e,i);if(i)if("add"==e.op){var n=e.path.split("/").length,s=o.split("/").length;if(n!==s+1&&n!==s)throw new JsonPatchError("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",t,e,i)}else if("replace"===e.op||"remove"===e.op||"_get"===e.op){if(e.path!==o)throw new JsonPatchError("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",t,e,i)}else if("move"===e.op||"copy"===e.op){var r=validate([{op:"_get",path:e.from,value:void 0}],i);if(r&&"OPERATION_PATH_UNRESOLVABLE"===r.name)throw new JsonPatchError("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",t,e,i)}}function validate(e,t,i){try{if(!Array.isArray(e))throw new JsonPatchError("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(t)applyPatch(_deepClone(t),_deepClone(e),i||!0);else{i=i||validator;for(var o=0;o<e.length;o++)i(e[o],o,t,void 0)}}catch(e){if(e instanceof JsonPatchError)return e;throw e}}function _areEquals(e,t){if(e===t)return!0;if(e&&t&&"object"==typeof e&&"object"==typeof t){var i,o,n,s=Array.isArray(e),r=Array.isArray(t);if(s&&r){if((o=e.length)!=t.length)return!1;for(i=o;0!=i--;)if(!_areEquals(e[i],t[i]))return!1;return!0}if(s!=r)return!1;var a=Object.keys(e);if((o=a.length)!==Object.keys(t).length)return!1;for(i=o;0!=i--;)if(!t.hasOwnProperty(a[i]))return!1;for(i=o;0!=i--;)if(!_areEquals(e[n=a[i]],t[n]))return!1;return!0}return e!=e&&t!=t}var core=Object.freeze({__proto__:null,JsonPatchError:JsonPatchError,_areEquals:_areEquals,applyOperation:applyOperation,applyPatch:applyPatch,applyReducer:applyReducer,deepClone:deepClone,getValueByPointer:getValueByPointer,validate:validate,validator:validator}),beforeDict=new WeakMap,Mirror=function(e){this.observers=new Map,this.obj=e},ObserverInfo=function(e,t){this.callback=e,this.observer=t};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 * Selectr 2.4.0
 * https://github.com/Mobius1/Selectr
 *
 * Released under the MIT license
 */.selectr-container{position:relative}.selectr-container li{list-style:none}.selectr-hidden{position:absolute;overflow:hidden;clip:rect(0,0,0,0);width:1px;height:1px;margin:-1px;padding:0;border:0 none}.selectr-visible{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;z-index:11}.selectr-desktop.multiple .selectr-visible{display:none}.selectr-desktop.multiple.native-open .selectr-visible{top:100%;min-height:200px!important;height:auto;opacity:1;display:block}.selectr-container.multiple.selectr-mobile .selectr-selected{z-index:0}.selectr-selected{position:relative;z-index:1;box-sizing:border-box;width:100%;padding:7px 28px 7px 14px;cursor:pointer;border:1px solid #999;border-radius:3px;background-color:#fff}.selectr-selected::before{position:absolute;top:50%;right:10px;width:0;height:0;content:'';-o-transform:rotate(0) translate3d(0,-50%,0);-ms-transform:rotate(0) translate3d(0,-50%,0);-moz-transform:rotate(0) translate3d(0,-50%,0);-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0);border-width:4px 4px 0 4px;border-style:solid;border-color:#6c7a86 transparent transparent}.selectr-container.native-open .selectr-selected::before,.selectr-container.open .selectr-selected::before{border-width:0 4px 4px 4px;border-style:solid;border-color:transparent transparent #6c7a86}.selectr-label{display:none;overflow:hidden;width:100%;white-space:nowrap;text-overflow:ellipsis}.selectr-placeholder{color:#6c7a86}.selectr-tags{margin:0;padding:0;white-space:normal}.has-selected .selectr-tags{margin:0 0 -2px}.selectr-tag{list-style:none;position:relative;float:left;padding:2px 25px 2px 8px;margin:0 2px 2px 0;cursor:default;color:#fff;border:medium none;border-radius:10px;background:#acb7bf none repeat scroll 0 0}.selectr-container.multiple.has-selected .selectr-selected{padding:5px 28px 5px 5px}.selectr-options-container{position:absolute;z-index:10000;top:calc(100% - 1px);left:0;display:none;box-sizing:border-box;width:100%;border-width:0 1px 1px;border-style:solid;border-color:transparent #999 #999;border-radius:0 0 3px 3px;background-color:#fff}.selectr-container.open .selectr-options-container{display:block}.selectr-input-container{position:relative;display:none}.selectr-clear,.selectr-input-clear,.selectr-tag-remove{position:absolute;top:50%;right:22px;width:20px;height:20px;padding:0;cursor:pointer;-o-transform:translate3d(0,-50%,0);-ms-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);border:medium none;background-color:transparent;z-index:11}.selectr-clear,.selectr-input-clear{display:none}.selectr-container.has-selected .selectr-clear,.selectr-input-container.active .selectr-input-clear{display:block}.selectr-selected .selectr-tag-remove{right:2px}.selectr-clear::after,.selectr-clear::before,.selectr-input-clear::after,.selectr-input-clear::before,.selectr-tag-remove::after,.selectr-tag-remove::before{position:absolute;top:5px;left:9px;width:2px;height:10px;content:' ';background-color:#6c7a86}.selectr-tag-remove::after,.selectr-tag-remove::before{top:4px;width:3px;height:12px;background-color:#fff}.selectr-clear:before,.selectr-input-clear::before,.selectr-tag-remove::before{-o-transform:rotate(45deg);-ms-transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg);transform:rotate(45deg)}.selectr-clear:after,.selectr-input-clear::after,.selectr-tag-remove::after{-o-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.selectr-input-container.active,.selectr-input-container.active .selectr-clear{display:block}.selectr-input{top:5px;left:5px;box-sizing:border-box;width:calc(100% - 30px);margin:10px 15px;padding:7px 30px 7px 9px;border:1px solid #999;border-radius:3px}.selectr-notice{display:none;box-sizing:border-box;width:100%;padding:8px 16px;border-top:1px solid #999;border-radius:0 0 3px 3px;background-color:#fff}.selectr-container.notice .selectr-notice{display:block}.selectr-container.notice .selectr-selected{border-radius:3px 3px 0 0}.selectr-options{position:relative;top:calc(100% + 2px);display:none;overflow-x:auto;overflow-y:scroll;max-height:200px;margin:0;padding:0}.selectr-container.notice .selectr-options-container,.selectr-container.open .selectr-input-container,.selectr-container.open .selectr-options{display:block}.selectr-option{position:relative;display:block;padding:5px 20px;list-style:outside none none;cursor:pointer;font-weight:400}.selectr-options.optgroups>.selectr-option{padding-left:25px}.selectr-optgroup{font-weight:700;padding:0}.selectr-optgroup--label{font-weight:700;margin-top:10px;padding:5px 15px}.selectr-match{text-decoration:underline}.selectr-option.selected{background-color:#ddd}.selectr-option.active{color:#fff;background-color:#5897fb}.selectr-option.disabled{opacity:.4}.selectr-option.excluded{display:none}.selectr-container.open .selectr-selected{border-color:#999 #999 transparent #999;border-radius:3px 3px 0 0}.selectr-container.open .selectr-selected::after{-o-transform:rotate(180deg) translate3d(0,50%,0);-ms-transform:rotate(180deg) translate3d(0,50%,0);-moz-transform:rotate(180deg) translate3d(0,50%,0);-webkit-transform:rotate(180deg) translate3d(0,50%,0);transform:rotate(180deg) translate3d(0,50%,0)}.selectr-disabled{opacity:.6}.has-selected .selectr-placeholder,.selectr-empty{display:none}.has-selected .selectr-label{display:block}.taggable .selectr-selected{padding:4px 28px 4px 4px}.taggable .selectr-selected::after{display:table;content:" ";clear:both}.taggable .selectr-label{width:auto}.taggable .selectr-tags{float:left;display:block}.taggable .selectr-placeholder{display:none}.input-tag{float:left;min-width:90px;width:auto}.selectr-tag-input{border:medium none;padding:3px 10px;width:100%;font-family:inherit;font-weight:inherit;font-size:inherit}.selectr-input-container.loading::after{position:absolute;top:50%;right:20px;width:20px;height:20px;content:'';-o-transform:translate3d(0,-50%,0);-ms-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);-o-transform-origin:50% 0 0;-ms-transform-origin:50% 0 0;-moz-transform-origin:50% 0 0;-webkit-transform-origin:50% 0 0;transform-origin:50% 0 0;-moz-animation:.5s linear 0s normal forwards infinite running spin;-webkit-animation:.5s linear 0s normal forwards infinite running spin;animation:.5s linear 0s normal forwards infinite running spin;border-width:3px;border-style:solid;border-color:#aaa #ddd #ddd;border-radius:50%}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0)}100%{-webkit-transform:rotate(360deg) translate3d(0,-50%,0);transform:rotate(360deg) translate3d(0,-50%,0)}}@keyframes spin{0%{-webkit-transform:rotate(0) translate3d(0,-50%,0);transform:rotate(0) translate3d(0,-50%,0)}100%{-webkit-transform:rotate(360deg) translate3d(0,-50%,0);transform:rotate(360deg) translate3d(0,-50%,0)}}.selectr-container.open.inverted .selectr-selected{border-color:transparent #999 #999;border-radius:0 0 3px 3px}.selectr-container.inverted .selectr-options-container{border-width:1px 1px 0;border-color:#999 #999 transparent;border-radius:3px 3px 0 0;background-color:#fff}.selectr-container.inverted .selectr-options-container{top:auto;bottom:calc(100% - 1px)}.selectr-container ::-webkit-input-placeholder{color:#6c7a86;opacity:1}.selectr-container ::-moz-placeholder{color:#6c7a86;opacity:1}.selectr-container :-ms-input-placeholder{color:#6c7a86;opacity:1}.selectr-container ::placeholder{color:#6c7a86;opacity:1}`;const JSONEditorAPI=["set","setMode","setName","setText","get","getMode","getName","getText"];class FleshyJsoneditor extends LitElement{static get styles(){return[jsoneditor_min,css`
        :host {
          display: block;
        }

        #jsonEditorContainer {
          height: 100%;
        }
      `]}static get properties(){return{json:{type:Object},mode:{type:String},modes:{type:Array},name:{type:String},search:{type:Boolean,reflect:!0},indentation:{type:Number},history:{type:Boolean}}}constructor(){super(),this.json={},this.modes=[],this.search=!1,this.history=!1}firstUpdated(){this.shadowRoot&&(this._injectTheme("#ace_editor\\.css"),this._injectTheme("#ace-tm"),this._injectTheme("#ace_searchbox"),ace.config.loadModule(["theme","ace/theme/jsoneditor"],(()=>{this._injectTheme("#ace-jsoneditor")}))),this._initializeEditor()}updated(e){super.updated(e),e.has("mode")&&this.editor.setMode(this.mode),e.has("name")&&this.editor.setName(this.name),e.has("json")&&(this._observer&&unobserve(e.get("json"),this._observer),this.json&&(this._observer=observe(this.json,this._refresh.bind(this))),this._refresh())}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this.editor&&(this._observer=observe(this.json,this._refresh))}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this._observer&&unobserve(this.json,this._observer)}render(){return html$1`<div id="jsonEditorContainer"></div> `}_initializeEditor(){this._jsonEditorContainer=this.shadowRoot.querySelector("#jsonEditorContainer");const e={mode:this.mode,history:this.history,name:this.name,modes:this.modes,search:this.search,indentation:this.indentation,onChange:()=>{if(this.editor)try{const e=compare$1(this.json,this.editor.get());this.dispatchEvent(new CustomEvent("change",{detail:{json:this.json,patches:e}})),this._observer&&unobserve(this.json,this._observer),applyPatch(this.json,e),this._observer=observe(this.json,this._refresh)}catch(e){this.dispatchEvent(new CustomEvent("error",{detail:{level:"fleshy",error:e}}))}},onError:e=>{this.dispatchEvent(new CustomEvent("error",{detail:{level:"upstream",error:e}}))}};this.editor=new JSONEditor(this._jsonEditorContainer,e),this.editor.set(this.json);let t=JSONEditorAPI.length-1;for(;t;)this[JSONEditorAPI[t]]=this.editor[JSONEditorAPI[t]].bind(this.editor),t-=1}_refresh(){this.editor.set(this.json)}_injectTheme(e){const t=document.querySelector(e);this.shadowRoot.appendChild(this._cloneStyle(t))}_cloneStyle(e){const t=document.createElement("style");return t.id=e.id,t.textContent=e.textContent,t}}window.customElements.define("fleshy-jsoneditor",FleshyJsoneditor);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles$5=i$5`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;class Chip extends s$8{constructor(){super(...arguments),this.disabled=!1,this.alwaysFocusable=!1,this.label="",this.hasIcon=!1}get rippleDisabled(){return this.disabled}focus(e){this.disabled&&!this.alwaysFocusable||super.focus(e)}render(){return x`
      <div class="container ${e$8(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `}updated(e){e.has("disabled")&&void 0!==e.get("disabled")&&this.dispatchEvent(new Event("update-focus",{bubbles:!0}))}getContainerClasses(){return{disabled:this.disabled,"has-icon":this.hasIcon}}renderContainerContent(){return x`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}></md-focus-ring>
      <md-ripple
        for=${this.primaryId}
        ?disabled=${this.rippleDisabled}></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `}renderOutline(){return x`<span class="outline"></span>`}renderLeadingIcon(){return x`<slot name="icon" @slotchange=${this.handleIconChange}></slot>`}renderPrimaryContent(){return x`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">${this.label}</span>
      <span class="touch"></span>
    `}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements({flatten:!0}).length>0}}requestUpdateOnAriaChange(Chip),Chip.shadowRootOptions={...s$8.shadowRootOptions,delegatesFocus:!0},__decorate$i([n$8({type:Boolean,reflect:!0})],Chip.prototype,"disabled",void 0),__decorate$i([n$8({type:Boolean,attribute:"always-focusable"})],Chip.prototype,"alwaysFocusable",void 0),__decorate$i([n$8()],Chip.prototype,"label",void 0),__decorate$i([n$8({type:Boolean,reflect:!0,attribute:"has-icon"})],Chip.prototype,"hasIcon",void 0);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ARIA_LABEL_REMOVE="aria-label-remove";class MultiActionChip extends Chip{get ariaLabelRemove(){if(this.hasAttribute(ARIA_LABEL_REMOVE))return this.getAttribute(ARIA_LABEL_REMOVE);const{ariaLabel:e}=this;return`Remove ${e||this.label}`}set ariaLabelRemove(e){e!==this.ariaLabelRemove&&(null===e?this.removeAttribute(ARIA_LABEL_REMOVE):this.setAttribute(ARIA_LABEL_REMOVE,e),this.requestUpdate())}constructor(){super(),this.handleTrailingActionFocus=this.handleTrailingActionFocus.bind(this),this.addEventListener("keydown",this.handleKeyDown.bind(this))}focus(e){(this.alwaysFocusable||!this.disabled)&&e?.trailing&&this.trailingAction?this.trailingAction.focus(e):super.focus(e)}renderContainerContent(){return x`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `}handleKeyDown(e){const t="ArrowLeft"===e.key,i="ArrowRight"===e.key;if(!t&&!i)return;if(!this.primaryAction||!this.trailingAction)return;const o="rtl"===getComputedStyle(this).direction?t:i,n=this.primaryAction?.matches(":focus-within"),s=this.trailingAction?.matches(":focus-within");if(o&&s||!o&&n)return;e.preventDefault(),e.stopPropagation();(o?this.trailingAction:this.primaryAction).focus()}handleTrailingActionFocus(){const{primaryAction:e,trailingAction:t}=this;e&&t&&(e.tabIndex=-1,t.addEventListener("focusout",(()=>{e.tabIndex=0}),{once:!0}))}}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function renderRemoveButton({ariaLabel:e,disabled:t,focusListener:i,tabbable:o=!1}){return x`
    <button
      class="trailing action"
      aria-label=${e}
      tabindex=${o?T$2:-1}
      @click=${handleRemoveClick}
      @focus=${i}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${t}></md-ripple>
      <span class="trailing icon" aria-hidden="true">
        <slot name="remove-trailing-icon">
          <svg viewBox="0 96 960 960">
            <path
              d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </slot>
      </span>
      <span class="touch"></span>
    </button>
  `}function handleRemoveClick(e){if(this.disabled)return;e.stopPropagation();!this.dispatchEvent(new Event("remove",{cancelable:!0}))||this.remove()}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class FilterChip extends MultiActionChip{constructor(){super(...arguments),this.elevated=!1,this.removable=!1,this.selected=!1,this.hasSelectedIcon=!1}get primaryId(){return"button"}getContainerClasses(){return{...super.getContainerClasses(),elevated:this.elevated,selected:this.selected,"has-trailing":this.removable,"has-icon":this.hasIcon||this.selected}}renderPrimaryAction(e){const{ariaLabel:t}=this;return x`
      <button
        class="primary action"
        id="button"
        aria-label=${t||T$2}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        @click=${this.handleClick}
        >${e}</button
      >
    `}renderLeadingIcon(){return this.selected?x`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `:super.renderLeadingIcon()}renderTrailingAction(e){return this.removable?renderRemoveButton({focusListener:e,ariaLabel:this.ariaLabelRemove,disabled:this.disabled}):T$2}renderOutline(){return this.elevated?x`<md-elevation part="elevation"></md-elevation>`:super.renderOutline()}handleClick(e){if(this.disabled)return;const t=this.selected;this.selected=!this.selected;!redispatchEvent(this,e)&&(this.selected=t)}}__decorate$i([n$8({type:Boolean})],FilterChip.prototype,"elevated",void 0),__decorate$i([n$8({type:Boolean})],FilterChip.prototype,"removable",void 0),__decorate$i([n$8({type:Boolean,reflect:!0})],FilterChip.prototype,"selected",void 0),__decorate$i([n$8({type:Boolean,reflect:!0,attribute:"has-selected-icon"})],FilterChip.prototype,"hasSelectedIcon",void 0),__decorate$i([e$7(".primary.action")],FilterChip.prototype,"primaryAction",void 0),__decorate$i([e$7(".trailing.action")],FilterChip.prototype,"trailingAction",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles$4=i$5`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}
`,styles$3=i$5`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}
`,styles$2=i$5`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host([disabled]){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);height:100%;text-overflow:ellipsis;user-select:none;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button{text-transform:inherit}a,button:not(:disabled){cursor:inherit}
`,styles$1=i$5`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */let MdFilterChip=class extends FilterChip{};MdFilterChip.styles=[styles$2,styles$5,styles$1,styles$3,styles$4],MdFilterChip=__decorate$i([t$5("md-filter-chip")],MdFilterChip);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ChipSet extends s$8{get chips(){return this.childElements.filter((e=>e instanceof Chip))}constructor(){super(),this.internals=this.attachInternals(),this.addEventListener("focusin",this.updateTabIndices.bind(this)),this.addEventListener("update-focus",this.updateTabIndices.bind(this)),this.addEventListener("keydown",this.handleKeyDown.bind(this)),this.internals.role="toolbar"}render(){return x`<slot @slotchange=${this.updateTabIndices}></slot>`}handleKeyDown(e){const t="ArrowLeft"===e.key,i="ArrowRight"===e.key,o="Home"===e.key,n="End"===e.key;if(!(t||i||o||n))return;const{chips:s}=this;if(s.length<2)return;if(e.preventDefault(),o||n){return s[o?0:s.length-1].focus({trailing:n}),void this.updateTabIndices()}const r="rtl"===getComputedStyle(this).direction?t:i,a=s.find((e=>e.matches(":focus-within")));if(!a){return(r?s[0]:s[s.length-1]).focus({trailing:!r}),void this.updateTabIndices()}const l=s.indexOf(a);let c=r?l+1:l-1;for(;c!==l;){c>=s.length?c=0:c<0&&(c=s.length-1);const e=s[c];if(!e.disabled||e.alwaysFocusable){e.focus({trailing:!r}),this.updateTabIndices();break}r?c++:c--}}updateTabIndices(){const{chips:e}=this;let t;for(const i of e){const e=i.alwaysFocusable||!i.disabled;i.matches(":focus-within")&&e?t=i:(e&&!t&&(t=i),i.tabIndex=-1)}t&&(t.tabIndex=0)}}__decorate$i([o$a()],ChipSet.prototype,"childElements",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles=i$5`:host{display:flex;flex-wrap:wrap;gap:8px}
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let MdChipSet=class extends ChipSet{};MdChipSet.styles=[styles],MdChipSet=__decorate$i([t$5("md-chip-set")],MdChipSet);var __decorate$a=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let AoiEarlIdeasEditor=class extends YpStreamingLlmBase{constructor(){super(),this.openForAnswers=!1,this.isGeneratingWithAi=!1,this.isSubmittingIdeas=!1,this.isFetchingChoices=!1,this.currentIdeasFilter="latest",this.scrollElementSelector="#answers",this.serverApi=new AoiAdminServerApi,this.shouldContinueGenerating=!0,this.currentGeneratingIndex=void 0}connectedCallback(){this.createGroupObserver(),this.setupBootListener(),this.imageGenerator=new AoiGenerateAiLogos(this.themeColor),this.configuration.earl&&this.configuration.earl.question_id?(this.disableWebsockets=!0,this.isCreatingIdeas=!1,this.getChoices()):this.isCreatingIdeas=!0,super.connectedCallback(),this.addEventListener("yp-ws-closed",this.socketClosed),this.addEventListener("yp-ws-error",this.socketError),this.addGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this))}disconnectedCallback(){this.removeEventListener("yp-ws-closed",this.socketClosed),this.removeEventListener("yp-ws-error",this.socketError),this.removeGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this)),super.disconnectedCallback()}themeUpdated(e){this.imageGenerator=new AoiGenerateAiLogos(e.detail.oneDynamicColor||e.detail.primaryColor||this.themeColor),this.requestUpdate()}socketClosed(){this.isGeneratingWithAi=!1}socketError(){this.isGeneratingWithAi=!1}async getChoices(){this.choices=await this.serverApi.getChoices(this.domainId,this.communityId,this.configuration.earl.question_id)}createGroupObserver(){const e={set:(e,t,i,o)=>(console.error(`Property ${String(t)} set to`,i),this.handleGroupChange(),Reflect.set(e,t,i,o))};this.group=new Proxy(this.group,e)}handleGroupChange(){console.error("Group changed",this.group)}async addChatBotElement(e){switch(e.type){case"start":case"moderation_error":break;case"error":this.isGeneratingWithAi=!1;break;case"end":this.isGeneratingWithAi=!1,this.answersElement.value+="\n";break;case"stream":if(e.message&&"undefined"!=e.message){this.answersElement.value+=e.message,this.answersElement.value=this.answersElement.value.replace(/\n\n/g,"\n");break}console.warn("stream message is undefined")}this.scrollDown()}get answers(){return this.$$("#answers")?.value.split("\n").map((e=>e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"))).filter((e=>e.length>0))}hasMoreThanOneIdea(){}openMenuFor(e){console.log("openMenuFor",e)}generateIdeas(){this.isGeneratingWithAi=!0;try{this.serverApi.startGenerateIdeas(this.configuration.earl.question.name,this.domainId,this.communityId,this.wsClientId,this.answers)}catch(e){console.error(e)}}async submitIdeasForCreation(){this.isSubmittingIdeas=!0;try{const{question_id:e}=await this.serverApi.submitIdeasForCreation(this.domainId,this.communityId,this.answers,this.configuration.earl.question.name);this.configuration.earl.question_id=e,this.configuration.earl.active=!0,this.configuration.earl.configuration||(this.configuration.earl.configuration={}),this.configuration.earl.question||(this.configuration.earl.question={}),this.configuration.earl.question.id=e,this.fire("configuration-changed",this.configuration),this.requestUpdate(),this.getChoices()}catch(e){console.error(e)}finally{this.isSubmittingIdeas=!1}}toggleIdeaActivity(e){return async()=>{this.isTogglingIdeaActive=e.id;try{e.active=!e.active,await this.serverApi.updateActive(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,e.active)}catch(e){console.error(e)}finally{this.isTogglingIdeaActive=void 0}this.requestUpdate()}}applyFilter(e){this.currentIdeasFilter=e}get sortedChoices(){if(this.choices)switch(this.currentIdeasFilter){case"latest":return this.choices.sort(((e,t)=>t.id-e.id));case"highestScore":return this.choices.sort(((e,t)=>t.score-e.score));case"activeDeactive":return this.choices.sort(((e,t)=>t.active<e.active?-1:t.active>e.active?1:0))}}updated(e){super.updated(e)}async generateAiIcons(){this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let e=0;e<this.choices.length&&this.shouldContinueGenerating;e+=5){const t=[];for(let i=e;i<e+5&&i<this.choices.length;i++){const e=this.choices[i];if(e.data?.imageUrl)continue;const o=new AoiGenerateAiLogos(this.themeColor);this.communityId?(o.collectionType="community",o.collectionId=this.communityId):this.domainId&&(o.collectionType="domain",o.collectionId=this.domainId),e.data.isGeneratingImage=!0,this.requestUpdate();const n=o.generateIcon(e.data.content,this.$$("#aiStyleInput").value).then((t=>{if(e.data.isGeneratingImage=void 0,t.error)console.error(t.error);else if(this.shouldContinueGenerating)return t.imageUrl?this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,{content:e.data.content,imageUrl:t.imageUrl,choiceId:e.id}).then((()=>{e.data.imageUrl=t.imageUrl,this.requestUpdate()})):void 0})).catch((t=>{e.data.isGeneratingImage=!1,console.error(t)}));t.push(n)}await Promise.all(t)}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}async generateAiIconsOld(){this.imageGenerator.collectionType="community",this.imageGenerator.collectionId=this.communityId,this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let e=0;e<this.choices.length&&this.shouldContinueGenerating;e++){const t=this.choices[e];if(!t.data?.imageUrl){this.currentGeneratingIndex=e;try{t.data.isGeneratingImage=!0;const{imageUrl:e,error:i}=await this.imageGenerator.generateIcon(t.data.content,this.$$("#aiStyleInput").value);if(t.data.isGeneratingImage=void 0,i){console.error(i);continue}if(!this.shouldContinueGenerating)break;await this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,t.id,{content:t.data.content,imageUrl:e,choiceId:t.id}),t.data.imageUrl=e,console.error("imageUrl",e,"error",i),this.requestUpdate()}catch(e){t.data.isGeneratingImage=!1,console.error(e)}}}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}stopGenerating(){this.shouldContinueGenerating=!1,this.isGeneratingWithAi=!1,this.choices&&void 0!==this.currentGeneratingIndex&&(this.choices[this.currentGeneratingIndex].data.isGeneratingImage=!1,this.requestUpdate())}get allChoicesHaveIcons(){return this.choices?.every((e=>e.data.imageUrl))}async deleteImageUrl(e){e.data.imageUrl=void 0,await this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,{content:e.data.content,imageUrl:void 0,choiceId:e.id}),this.requestUpdate()}static get styles(){return[super.styles,i$5`
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-surface-container-higher
          );
          --md-elevated-button-label-text-color: var(--md-sys-color-on-surface);
        }

        .activeCheckboxText {
          margin-left: 16px;
        }

        .activeCheckbox {
          margin-top: 2px;
        }

        yp-magic-text {
          min-width: 262px;
        }

        .headerPadding {
          width: 414px;
        }

        .genIconSpinner {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
          border-radius: 70px;
        }

        .iconImageRight {
        }

        .closeIcon {
        }

        .deleteIcon {
          position: absolute;
          right: 6px;
          bottom: 16px;
          height: 28px;
          width: 28px;
        }

        .iconContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: collapse balance;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        #aiStyleInput {
          margin-bottom: 16px;
        }

        .generateIconButton {
          max-width: 250px;
        }

        .iconGenerationBottomSpinner {
          margin-top: 16px;
          width: 200px;
        }

        .ideasList {
          padding: 16px;
          max-width: 900px;
          width: 900px;
          padding-left: 0;
        }

        .ideaContainer {
          padding: 8px;
          margin: 0;
          border-radius: 8px;
          align-items: center;
        }

        .answer {
          padding: 16px;
          padding-top: 16px;
          padding-bottom: 16px;
          border-radius: 16px;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          flex-grow: 1;
        }

        .wins,
        .losses,
        .score {
          padding: 5px;
          text-align: center;
          min-width: 50px;
        }

        .origin {
          min-width: 70px;
          text-align: center;
        }

        .generateAnswersInfo {
          margin-top: -16px;
          margin-bottom: 24px;
          font-size: 14px;
          font-style: italic;
        }

        .buttons {
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 140px;
          min-width: 140px;
          position: relative;
        }

        .toggleActiveProgress {
          position: absolute;
          bottom: -4px;
        }

        .generateIconsProgress {
          margin-top: 8px;
        }

        md-filled-text-field {
          width: 100%;
          margin-bottom: 32px;
        }

        .iconContainer {
          position: relative;
        }

        .button {
          margin-left: 16px;
          margin-right: 16px;
        }

        .generationProgress {
          width: 100%;
          margin-bottom: 24px;
          margin-top: -24px;
        }

        md-filled-text-field {
          --md-filled-field-container-color: var(
            --md-sys-color-surface
          ) !important;
        }
      `]}answersChanged(){this.requestUpdate()}renderCreateIdeas(){return x`
      <div class="layout vertical center-center generateAnswersInfo">
        <div style="max-width: 650px">
          ${o$8(this.t("generateAnswersInfo"))}
        </div>
      </div>
      <div class="layout vertical center-center">
        <md-filled-text-field
          type="textarea"
          id="answers"
          ?disabled="${!this.openForAnswers}"
          rows="14"
          @input="${this.answersChanged}"
          .label="${this.t("answersToVoteOn")}"
        >
        </md-filled-text-field>
        <md-linear-progress
          class="generationProgress"
          ?hidden="${!this.isGeneratingWithAi}"
          indeterminate
        ></md-linear-progress>
        <div class="layout horizontal">
          ${this.isGeneratingWithAi?x`
                <div
                  class="layout vertical center-center"
                  ?hidden="${!this.hasLlm}"
                >
                  <md-outlined-button class="button" @click="${this.reset}"
                    >${this.t("stopGenerating")}
                    <md-icon slot="icon">stop_circle</md-icon>
                  </md-outlined-button>
                </div>
              `:x`
                <md-text-button
                  class="button"
                  @click="${this.generateIdeas}"
                  ?hidden="${!this.hasLlm}"
                  ?disabled="${this.isGeneratingWithAi||!this.openForAnswers}"
                  >${this.answers?.length>1?this.t("generateMoreIdeasWithAi"):this.t("generateIdeasWithAi")}
                  <md-icon slot="icon">smart_toy</md-icon>
                </md-text-button>
              `}
          <md-filled-button
            class="button"
            @click="${this.submitIdeasForCreation}"
            ?disabled="${this.isSubmittingIdeas||this.answers?.length<6||!this.configuration||this.isGeneratingWithAi}"
            >${this.t("submitAnswersForCreation")}</md-filled-button
          >
        </div>
      </div>
    `}renderIdeasSortingChips(){return x`
      <div class="layout horizontal center-center">
        <md-chip-set class="ideaFilters layout horizontal wrap" type="filter">
          <md-filter-chip
            class="layout horizontal center-center"
            label="${this.t("latest")}"
            .selected="${"latest"==this.currentIdeasFilter}"
            @click="${()=>this.applyFilter("latest")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="${this.t("higestScore")}"
            .selected="${"highestScore"==this.currentIdeasFilter}"
            @click="${()=>this.applyFilter("highestScore")}"
          ></md-filter-chip>
          <md-filter-chip
            class="layout horizontal center-center"
            label="${this.t("active")}"
            .selected="${"activeDeactive"==this.currentIdeasFilter}"
            @click="${()=>this.applyFilter("activeDeactive")}"
          ></md-filter-chip>
        </md-chip-set>
      </div>
    `}renderIcon(e){return e.data.isGeneratingImage?x`
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `:e.data.imageUrl?x` <img
        class="iconImage"
        src="${e.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!e.data.imageUrl}"
      />`:T$2}aiStyleChanged(){this.group.configuration.theme||(this.group.configuration.theme={}),this.fire("theme-config-changed",{iconPrompt:this.aiStyleInputElement?.value})}renderAnswerData(e){return x`
      <div class="iconContainer">
        <md-elevated-button
          id="leftAnswerButton"
          class="leftAnswer"
          trailing-icon
        >
          ${this.renderIcon(e)}
          <yp-magic-text
            id="answerText"
            .contentId="${this.groupId}"
            .extraId="${e.data.choiceId}"
            textOnly
            truncate="140"
            .content="${e.data.content}"
            .contentLanguage="${this.group.language}"
            textType="aoiChoiceContent"
          ></yp-magic-text>
        </md-elevated-button>
        <md-filled-tonal-icon-button
          ?hidden="${!e.data.imageUrl}"
          @click="${()=>this.deleteImageUrl(e)}"
          class="deleteIcon"
          ><md-icon class="closeIcon"
            >close</md-icon
          ></md-filled-tonal-icon-button
        >
      </div>
    `}renderEditIdeas(){return x`
      <div class="layout vertical">
        ${this.renderIdeasSortingChips()}
        <div class="ideasList">
          <md-linear-progress
            indeterminate
            ?hidden="${!this.isFetchingChoices}"
          ></md-linear-progress>
          <div class="layout horizontal ideaContainer">
            <div class="headerPadding">&nbsp;</div>
            <div class="origin">${this.t("origin")}</div>
            <div class="wins">${this.t("wins")}</div>
            <div class="losses">${this.t("losses")}</div>
            <div class="score">${this.t("score")}</div>
            <div class="buttons">${this.t("choiceStatus")}</div>
          </div>

          ${this.sortedChoices?.map(((e,t)=>x`<div class="layout horizontal ideaContainer">
              <div>${this.renderAnswerData(e)}</div>
              <div class="origin">
                ${e.user_created?this.t("User"):this.t("Seed")}
              </div>
              <div class="wins">${e.wins}</div>
              <div class="losses">${e.losses}</div>
              <div class="score">${Math.round(e.score)}</div>
              <div class="buttons layout vertical center-center">
                <label>
                  <md-checkbox
                    class="activeCheckbox"
                    .checked="${e.active}"
                    @click="${this.toggleIdeaActivity(e)}"
                  ></md-checkbox>
                  <span class="activeCheckboxText">${this.t("active")}</span>
                </label>

                <md-linear-progress
                  class="toggleActiveProgress"
                  indeterminate
                  ?hidden="${this.isTogglingIdeaActive!==e.id}"
                ></md-linear-progress>
              </div>
            </div>`))}
        </div>
        <div class="layout vertical center-center"></div>
          <md-outlined-text-field
            id="aiStyleInput"
            .label="${this.t("styleForAiIconGeneration")}"
            type="textarea"
            @change="${this.aiStyleChanged}"
            rows="5"
            .value="${this.group.configuration.theme?.iconPrompt||this.imageGenerator.promptDraft}"
            ?hidden="${this.allChoicesHaveIcons||!this.hasLlm}"
            ?disabled="${this.isGeneratingWithAi||this.allChoicesHaveIcons}"
          ></md-outlined-text-field>
          <div class="layout vertical center-center" ?hidden="${!this.hasLlm}">
            <md-outlined-button
              class="generateIconButton"
              @click="${this.stopGenerating}"
              ?hidden="${!this.isGeneratingWithAi}"
            >
              ${this.t("stopGenerating")}
              <md-icon slot="icon">stop_circle</md-icon>
            </md-outlined-button>
            <md-linear-progress class="iconGenerationBottomSpinner" ?hidden="${!this.isGeneratingWithAi}" indeterminate></md-linear-progress>

            <md-outlined-button
              class="generateIconButton"
              @click="${this.generateAiIcons}"
              ?disabled="${this.allChoicesHaveIcons}"
              ?hidden="${this.isGeneratingWithAi}"
            >
              ${this.allChoicesHaveIcons?this.t("allIconsHaveBeenGenerated"):this.t("generateIconsWithAi")}
              <md-icon slot="icon">smart_toy</md-icon>
            </md-outlined-button
          >
        </div>
      </div>
    </div>
    `}render(){return this.choices?this.renderEditIdeas():this.renderCreateIdeas()}};__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"groupId",void 0),__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"communityId",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"openForAnswers",void 0),__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"domainId",void 0),__decorate$a([n$8({type:Object})],AoiEarlIdeasEditor.prototype,"configuration",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isCreatingIdeas",void 0),__decorate$a([n$8({type:Array})],AoiEarlIdeasEditor.prototype,"choices",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isGeneratingWithAi",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isSubmittingIdeas",void 0),__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"isTogglingIdeaActive",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isFetchingChoices",void 0),__decorate$a([n$8({type:Object})],AoiEarlIdeasEditor.prototype,"group",void 0),__decorate$a([e$7("#aiStyleInput")],AoiEarlIdeasEditor.prototype,"aiStyleInputElement",void 0),__decorate$a([n$8({type:String})],AoiEarlIdeasEditor.prototype,"currentIdeasFilter",void 0),__decorate$a([e$7("#answers")],AoiEarlIdeasEditor.prototype,"answersElement",void 0),AoiEarlIdeasEditor=__decorate$a([t$5("aoi-earl-ideas-editor")],AoiEarlIdeasEditor);var __decorate$9=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},YpAdminConfigGroup_1;const defaultModerationPrompt="Only allow ideas that are relevant to the question.",defaultAiAnalysisJson={analyses:[{ideasLabel:"Three most popular ideas",ideasIdsRange:3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]},{ideasLabel:"Three least popular ideas",ideasIdsRange:-3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]}]};let YpAdminConfigGroup=YpAdminConfigGroup_1=class extends YpAdminConfigBase{constructor(){super(),this.groupAccess="open_to_community",this.groupTypeIndex=1,this.endorsementButtonsDisabled=!1,this.questionNameHasChanged=!1,this.groupTypeOptions=["ideaGenerationGroupType","allOurIdeasGroupType"],this.groupAccessOptions={0:"public",1:"closed",2:"secret",3:"open_to_community"},this.action="/groups",this.group=this.collection}static get styles(){return[super.styles,i$5`
        .mainImage {
          width: 432px;
          height: 243px;
        }

        .socialMediaCreateInfo {
          font-size: 12px;
          font-style: italic;
          text-align: center;
          padding: 8px;
        }

        .aboutAccess {
          font-size: 14px;
          padding: 8px;
          margin-top: -24px;
          font-style: italic;
          max-width: 600px;
        }

        .saveButtonContainer {
        }

        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        md-radio {
          margin-right: 4px;
        }

        fleshy-jsoneditor {
          width: 960px;
        }
      `]}_setGroupType(e){const t=e.target.selectedIndex;this.groupTypeIndex=t,this.group.configuration.groupType=t,this._configChanged(),this.configTabs=this.setupConfigTabs(),this.requestUpdate(),this.fire("yp-request-update-on-parent")}renderGroupTypeSelection(){return x`
      <md-outlined-select
        .label="${this.t("selectGroupType")}"
        @change="${this._setGroupType}"
      >
        ${this.groupTypeOptions.map(((e,t)=>x`
            <md-select-option ?selected="${this.groupTypeIndex==t}"
              >${this.t(e)}</md-select-option
            >
          `))}
      </md-outlined-select>
    `}renderHeader(){return this.collection?x`
          <div class="layout horizontal wrap topInputContainer">
            <div class="layout vertical">
              ${this.renderLogoMedia()}
              <div class="socialMediaCreateInfo">
                ${this.t("socialMediaCreateInfo")}
              </div>
            </div>
            <div class="layout vertical">
              ${this.renderNameAndDescription()}
              ${this.renderGroupTypeSelection()}
            </div>
            <div class="saveButtonContainer">${this.renderSaveButton()}</div>
          </div>
          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString()||""}"
          />
        `:T$2}getAccessTokenName(){return"open_to_community"==this.groupAccess||"public"==this.groupAccess?"open_to_community":"secret"}renderHiddenInputs(){return x`
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$2}
      <input
        type="hidden"
        name="objectives"
        value="${this.collection?.description}"
      />

      ${window.appGlobals.originalQueryParameters.createCommunityForGroup?x`
            <input type="hidden" name="createCommunityForGroup" value="true" />
          `:T$2}
      ${(this.collection?.configuration).ltp?x`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `:T$2}
      ${(this.collection?.configuration).allOurIdeas?x`
            <input
              type="hidden"
              name="allOurIdeas"
              value="${JSON.stringify((this.collection?.configuration).allOurIdeas)}"
            />
          `:T$2}

      <input type="hidden" name="${this.getAccessTokenName()}" value="1" />

      <input type="hidden" name="groupType" value="${this.groupTypeIndex}" />

      <input type="hidden" name="status" value="${this.status||""}" />

      ${this.endorsementButtons?x`
            <input
              type="hidden"
              name="endorsementButtons"
              value="${this.endorsementButtons}"
            />
          `:T$2}
      ${this.detectedThemeColor?x`<input
            type="hidden"
            name="themeColor"
            value="${this.detectedThemeColor}"
          />`:T$2}
    `}_descriptionChanged(e){const t=e.target.value;this.group.description=t,this.group.objectives=t,super._descriptionChanged(e)}connectedCallback(){super.connectedCallback(),this.group=this.collection}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(e){e.has("collection")&&this.collection&&(this.group=this.collection,this.currentLogoImages=this.collection.GroupLogoImages,this.collection.description=this.group.objectives,this.group.description=this.group.objectives,this.groupAccess=this.groupAccessOptions[this.group.access],this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.configuration.allOurIdeas&&this.collection.configuration.allOurIdeas.earl&&this.collection.configuration.allOurIdeas.earl.question&&(this.aoiQuestionName=this.collection.configuration.allOurIdeas.earl.question.name),this.groupTypeIndex=this.group.configuration.groupType||1,this.endorsementButtons=this.group.configuration.endorsementButtons,this.collection.status&&(this.status=this.collection.status),this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0?this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id:this.collection.GroupLogoVideos&&this.collection.GroupLogoVideos.length>0&&(this.uploadedVideoId=this.collection.GroupLogoVideos[0].id)),e.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(e)}async _collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(window.appGlobals.originalQueryParameters.createCommunityForGroup?(this.parentCollectionId=window.appGlobals.domain.id,this.action=`/groups/${this.parentCollectionId}/create_community_for_group`):this.action=`/groups/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",objectives:"",access:3,status:"hidden",counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},community_id:this.parentCollectionId,hostname:"",is_group_folder:"newFolder"==this.collectionId},this.group=this.collection):this.action=`/groups/${this.collectionId}`}_setupTranslations(){"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},this.collectionType),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No domain found on custom redirect")}_finishRedirect(e){YpNavHelpers.redirectTo("/group/"+e.id),window.appGlobals.activity("completed","editGroup")}_getAccessTab(){const e="new"==this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup,t={name:"access",icon:"code",items:[{text:"groupAccess",type:"html",templateData:x`
            <div id="access" name="access" class="layout vertical access">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  value="open_to_community"
                  name="access"
                  @change="${this._groupAccessChanged}"
                  ?checked="${"open_to_community"==this.groupAccess}"
                ></md-radio
                >${e?this.t("public"):this.t("group.openToCommunity")}</label
              >
              <label>
                <md-radio
                  value="secret"
                  name="access"
                  @change="${this._groupAccessChanged}"
                  ?checked="${"secret"==this.groupAccess}"
                ></md-radio
                >${this.t("private")}
              </label>
            </div>
          `},{text:"aboutAccess",type:"html",templateData:x`
            <div class="aboutAccess">
              ${e?this.t("aboutGroupPrivacyOptionsCreateGroupDirectly"):this.t("aboutGroupPrivacyOptions")}
            </div>
          `},{text:"status",type:"html",templateData:x`
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
              .selectedIndex="${this.statusIndex}"
            >
              ${this.collectionStatusOptions?.map(((e,t)=>x`
                  <md-select-option ?selected="${this.statusIndex==t}"
                    >${e.translatedName}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"aboutStatus",type:"html",templateData:x`
            <div class="aboutAccess">
              ${e?this.t("aboutStatusOptionsCreateGroupDirectly"):this.t("aboutStatusOptions")}
            </div>
          `}]};return this.groupTypeIndex!==YpAdminConfigGroup_1.GroupType.allOurIdeas&&t.items.concat([{text:"allowAnonymousUsers",type:"checkbox",value:this.group.configuration.allowAnonymousUsers,translationToken:"allowAnonymousUsers"},{text:"anonymousAskRegistrationQuestions",type:"checkbox",value:this.group.configuration.anonymousAskRegistrationQuestions,translationToken:"anonymousAskRegistrationQuestions"},{text:"allowAnonymousAutoLogin",type:"checkbox",value:this.group.configuration.allowAnonymousAutoLogin,translationToken:"allowAnonymousAutoLogin",disabled:!this.group.configuration.allowAnonymousUsers},{text:"allowOneTimeLoginWithName",type:"checkbox",value:this.group.configuration.allowOneTimeLoginWithName,translationToken:"allowOneTimeLoginWithName"},{text:"disableFacebookLoginForGroup",type:"checkbox",value:this.group.configuration.disableFacebookLoginForGroup,translationToken:"disableFacebookLoginForGroup"},{text:"forceSecureSamlLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlLogin,translationToken:"forceSecureSamlLogin",disabled:!this.hasSamlLoginProvider},{text:"forceSecureSamlEmployeeLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlEmployeeLogin,translationToken:"forceSecureSamlEmployeeLogin",disabled:!this.hasSamlLoginProvider},{text:"registrationQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.registrationQuestions,translationToken:"registrationQuestions"}]),t}_groupAccessChanged(e){this.groupAccess=e.target.value,this._configChanged()}_getThemeTab(){return{name:"themeSettings",icon:"palette",items:[{text:"inheritThemeFromCommunity",type:"checkbox",value:this.group.configuration.inheritThemeFromCommunity,translationToken:"inheritThemeFromCommunity",onChange:"_inheritThemeChanged"},{text:"themeSelector",type:"html",templateData:x`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              .disableSelection="${this.group.configuration.inheritThemeFromCommunity}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.group.configuration.theme}"
            ></yp-theme-selector>
          `}]}}_inheritThemeChanged(e){this.group.configuration.inheritThemeFromCommunity=e.target.checked}_getPostSettingsTab(){return this.isGroupFolder?null:{name:"postSettings",icon:"create",items:[{text:"canAddNewPosts",type:"checkbox",value:this.group.configuration.canAddNewPosts,translationToken:"group.canAddNewPosts"},{text:"locationHidden",type:"checkbox",value:this.group.configuration.locationHidden,translationToken:"group.locationHidden"},{text:"allowGenerativeImages",type:"checkbox",value:this.group.configuration.allowGenerativeImages,translationToken:"allowGenerativeImages"},{text:"showWhoPostedPosts",type:"checkbox",value:this.group.configuration.showWhoPostedPosts,translationToken:"group.showWhoPostedPosts"},{text:"askUserIfNameShouldBeDisplayed",type:"checkbox",value:this.group.configuration.askUserIfNameShouldBeDisplayed,translationToken:"askUserIfNameShouldBeDisplayed"},{text:"disableDebate",type:"checkbox",value:this.group.configuration.disableDebate,translationToken:"disableDebate"},{text:"allowAdminsToDebate",type:"checkbox",value:this.group.configuration.allowAdminsToDebate,translationToken:"allowAdminsToDebate"},{text:"postDescriptionLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.postDescriptionLimit,translationToken:"postDescriptionLimit",charCounter:!0},{text:"allowPostVideoUploads",type:"checkbox",value:this.hasVideoUpload,translationToken:"allowPostVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPostUploadLimitSec,translationToken:"videoPostUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPostAudioUploads",type:"checkbox",value:this.hasAudioUpload,translationToken:"allowPostAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPostUploadLimitSec,translationToken:"audioPostUploadLimitSec",disabled:!this.hasAudioUpload},{text:"customTitleQuestionText",type:"textfield",maxLength:60,value:this.group.configuration.customTitleQuestionText,translationToken:"customTitleQuestionText"},{text:"hideNameInputAndReplaceWith",type:"textfield",maxLength:60,value:this.group.configuration.hideNameInputAndReplaceWith,translationToken:"hideNameInputAndReplaceWith"},{text:"customTabTitleNewLocation",type:"textfield",maxLength:60,value:this.group.configuration.customTabTitleNewLocation,translationToken:"customTabTitleNewLocation"},{text:"customCategoryQuestionText",type:"textfield",maxLength:30,value:this.group.configuration.customCategoryQuestionText,translationToken:"customCategoryQuestionText",charCounter:!0},{text:"customFilterText",type:"textfield",maxLength:17,value:this.group.configuration.customFilterText,translationToken:"customFilterText",charCounter:!0},{text:"makeCategoryRequiredOnNewPost",type:"checkbox",value:this.group.configuration.makeCategoryRequiredOnNewPost,translationToken:"makeCategoryRequiredOnNewPost"},{text:"showVideoUploadDisclaimer",type:"checkbox",value:this.group.configuration.showVideoUploadDisclaimer,translationToken:"showVideoUploadDisclaimer"},{text:"moreContactInformation",type:"checkbox",value:this.group.configuration.moreContactInformation,translationToken:"moreContactInformation"},{text:"moreContactInformationAddress",type:"checkbox",value:this.group.configuration.moreContactInformationAddress,translationToken:"moreContactInformationAddress"},{text:"attachmentsEnabled",type:"checkbox",value:this.group.configuration.attachmentsEnabled,translationToken:"attachmentsEnabled"},{text:"useContainImageMode",type:"checkbox",value:this.group.configuration.useContainImageMode,translationToken:"useContainImageMode"},{text:"hideNewestFromFilter",type:"checkbox",value:this.group.configuration.hideNewestFromFilter,translationToken:"hideNewestFromFilter"},{text:"hideNewPost",type:"checkbox",value:this.group.configuration.hideNewPost,translationToken:"hideNewPost"},{text:"hideRecommendationOnNewsFeed",type:"checkbox",value:this.group.configuration.hideRecommendationOnNewsFeed,translationToken:"hideRecommendationOnNewsFeed"},{text:"hideNewPostOnPostPage",type:"checkbox",value:this.group.configuration.hideNewPostOnPostPage,translationToken:"hideNewPostOnPostPage"},{text:"hidePostCover",type:"checkbox",value:this.group.configuration.hidePostCover,translationToken:"hidePostCover"},{text:"hidePostDescription",type:"checkbox",value:this.group.configuration.hidePostDescription,translationToken:"hidePostDescription"},{text:"hidePostActionsInGrid",type:"checkbox",value:this.group.configuration.hidePostActionsInGrid,translationToken:"hidePostActionsInGrid"},{text:"hideDebateIcon",type:"checkbox",value:this.group.configuration.hideDebateIcon,translationToken:"hideDebateIcon"},{text:"hideSharing",type:"checkbox",value:this.group.configuration.hideSharing,translationToken:"hideSharing"},{text:"hideEmoji",type:"checkbox",value:this.group.configuration.hideEmoji,translationToken:"hideEmoji"},{text:"hidePostFilterAndSearch",type:"checkbox",value:this.group.configuration.hidePostFilterAndSearch,translationToken:"hidePostFilterAndSearch"},{text:"hideMediaInput",type:"checkbox",value:this.group.configuration.hideMediaInput,translationToken:"hideMediaInput"},{text:"hidePostImageUploads",type:"checkbox",value:this.group.configuration.hidePostImageUploads,translationToken:"hidePostImageUploads",disabled:!this.hasVideoUpload},{text:"disablePostPageLink",type:"checkbox",value:this.group.configuration.disablePostPageLink,translationToken:"disablePostPageLink"},{text:"defaultLocationLongLat",type:"textfield",maxLength:100,value:this.group.configuration.defaultLocationLongLat,translationToken:"defaultLocationLongLat",style:"width: 300px;"},{text:"forcePostSortMethodAs",type:"textfield",maxLength:12,value:this.group.configuration.forcePostSortMethodAs,translationToken:"forcePostSortMethodAs"},{text:"descriptionTruncateAmount",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.descriptionTruncateAmount,translationToken:"descriptionTruncateAmount"},{text:"descriptionSimpleFormat",type:"checkbox",value:this.group.configuration.descriptionSimpleFormat,translationToken:"descriptionSimpleFormat"},{text:"transcriptSimpleFormat",type:"checkbox",value:this.group.configuration.transcriptSimpleFormat,translationToken:"transcriptSimpleFormat"},{text:"allPostsBlockedByDefault",type:"checkbox",value:this.group.configuration.allPostsBlockedByDefault,translationToken:"allPostsBlockedByDefault"},{text:"exportSubCodesForRadiosAndCheckboxes",type:"checkbox",value:this.group.configuration.exportSubCodesForRadiosAndCheckboxes,translationToken:"exportSubCodesForRadiosAndCheckboxes"},{text:"structuredQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.structuredQuestions,translationToken:"structuredQuestions",onChange:"_structuredQuestionsChanged"},{text:"structuredQuestionsJsonErrorInfo",type:"textdescription",translationToken:"structuredQuestionsJsonFormatNotValid",hidden:!this.structuredQuestionsJsonError},{text:"structuredQuestionsInfo",type:"textdescription",translationToken:"structuredQuestionsInfo"},{text:"uploadDocxSurveyFormat",type:"html",templateData:x`
            <yp-file-upload
              id="docxSurveyUpload"
              raised
              multi="false"
              accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              .target="${this.apiEndpoint}/groups/-1/convert_docx_survey_to_json"
              method="PUT"
              @success="${this._haveUploadedDocxSurvey}"
            >
              <iron-icon class="icon" icon="sort"></iron-icon>
              <span>${this.t("uploadDocxSurveyFormat")}</span>
            </yp-file-upload>
          `},{text:"alternativeTextForNewIdeaButton",type:"textfield",maxLength:30,value:this.group.configuration.alternativeTextForNewIdeaButton,translationToken:"alternativeTextForNewIdeaButton",charCounter:!0},{text:"alternativeTextForNewIdeaButtonClosed",type:"textfield",maxLength:30,value:this.group.configuration.alternativeTextForNewIdeaButtonClosed,translationToken:"alternativeTextForNewIdeaButtonClosed",charCounter:!0},{text:"alternativeTextForNewIdeaButtonHeader",type:"textfield",maxLength:30,value:this.group.configuration.alternativeTextForNewIdeaButtonHeader,translationToken:"alternativeTextForNewIdeaButtonHeader",charCounter:!0},{text:"alternativeTextForNewIdeaSaveButton",type:"textfield",maxLength:20,value:this.group.configuration.alternativeTextForNewIdeaSaveButton,translationToken:"alternativeTextForNewIdeaSaveButton",charCounter:!0},{text:"customThankYouTextNewPosts",type:"textfield",maxLength:120,value:this.group.configuration.customThankYouTextNewPosts,translationToken:"customThankYouTextNewPosts",charCounter:!0},{text:"defaultPostImage",type:"html",templateData:x`
            <yp-file-upload
              id="defaultPostImageUpload"
              raised
              multi="false"
              .target="${this.apiEndpoint}/images?itemType=group-logo"
              method="POST"
              @success="${this._defaultPostImageUploaded}"
            >
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>${this.t("defaultPostImage")}</span>
            </yp-file-upload>
          `},{text:"defaultDataImage",type:"html",templateData:x`
            <yp-file-upload
              id="defaultDataImageUpload"
              raised
              multi="false"
              .target="${this.apiEndpoint}/images?itemType=group-logo"
              method="POST"
              @success="${this._defaultDataImageUploaded}"
            >
              <iron-icon class="icon" icon="photo-camera"></iron-icon>
              <span>${this.t("defaultDataImage")}</span>
            </yp-file-upload>
          `}]}}_defaultDataImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.group.configuration.defaultDataImageId=t.id,this.configChanged=!0}_defaultPostImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.group.configuration.uploadedDefaultPostImageId=t.id,this.configChanged=!0}_haveUploadedDocxSurvey(e){const t=e.detail;if(t.xhr&&t.xhr.response){let e=JSON.parse(t.xhr.response);e.jsonContent=JSON.stringify(JSON.parse(e.jsonContent)),this.group.configuration.structuredQuestions=e.jsonContent}}_getVoteSettingsTab(){return{name:"voteSettings",icon:"thumbs_up_down",items:[{text:"endorsementButtons",type:"html",templateData:x`
            <md-outlined-select
              .label="${this.t("endorsementButtons")}"
              .disabled="${this.endorsementButtonsDisabled}"
              @change="${this._endorsementButtonsSelected}"
            >
              ${this.endorsementButtonsOptions?.map(((e,t)=>x`
                  <md-select-option
                    ?selected="${this.endorsementButtonsIndex==t}"
                    >${e.translatedName}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"canVote",type:"checkbox",value:this.group.configuration.canVote,translationToken:"group.canVote"},{text:"hideVoteCount",type:"checkbox",value:this.group.configuration.hideVoteCount,translationToken:"hideVoteCount"},{text:"hideVoteCountUntilVoteCompleted",type:"checkbox",value:this.group.configuration.hideVoteCountUntilVoteCompleted,translationToken:"hideVoteCountUntilVoteCompleted"},{text:"hideDownVoteForPost",type:"checkbox",value:this.group.configuration.hideDownVoteForPost,translationToken:"hideDownVoteForPost"},{text:"maxNumberOfGroupVotes",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.maxNumberOfGroupVotes,translationToken:"maxNumberOfGroupVotes"},{text:"customVoteUpHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteUpHoverText,translationToken:"customVoteUpHoverText"},{text:"customVoteDownHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteDownHoverText,translationToken:"customVoteDownHoverText"},{text:"customRatingsText",type:"textarea",rows:2,maxRows:2,value:this.group.configuration.customRatingsText,translationToken:"customRatings"},{text:"customRatingsInfo",type:"textdescription"}]}}get endorsementButtonsOptions(){return this.t?[{name:"hearts",translatedName:this.t("endorsementButtonsHeart")},{name:"arrows",translatedName:this.t("endorsementArrows")},{name:"thumbs",translatedName:this.t("endorsementThumbs")},{name:"hats",translatedName:this.t("endorsementHats")}]:[]}_endorsementButtonsSelected(e){const t=e.target.selectedIndex;this.endorsementButtons=this.endorsementButtonsOptions[t].name,this._configChanged()}get endorsementButtonsIndex(){if(this.endorsementButtonsOptions){for(let e=0;e<this.endorsementButtonsOptions.length;e++)if(this.endorsementButtonsOptions[e].name==this.endorsementButtons)return e;return-1}return-1}_customRatingsTextChanged(e){}_getPointSettingsTab(){return{name:"pointSettings",icon:"stars",items:[{text:"newPointOptional",type:"checkbox",value:this.group.configuration.newPointOptional,translationToken:"newPointOptional"},{text:"hideNewPointOnNewIdea",type:"checkbox",value:this.group.configuration.hideNewPointOnNewIdea,translationToken:"hideNewPointOnNewIdea"},{text:"hidePointAuthor",type:"checkbox",value:this.group.configuration.hidePointAuthor,translationToken:"hidePointAuthor"},{text:"hidePointAgainst",type:"checkbox",value:this.group.configuration.hidePointAgainst,translationToken:"hidePointAgainst"},{text:"pointCharLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.pointCharLimit,translationToken:"pointCharLimit"},{text:"alternativePointForHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForHeader,translationToken:"alternativePointForHeader"},{text:"alternativePointAgainstHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstHeader,translationToken:"alternativePointAgainstHeader"},{text:"alternativePointForLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForLabel,translationToken:"alternativePointForLabel"},{text:"alternativePointAgainstLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstLabel,translationToken:"alternativePointAgainstLabel"},{text:"allowPointVideoUploads",type:"checkbox",value:this.group.configuration.allowPostVideoUploads,translationToken:"allowPointVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPointUploadLimitSec,translationToken:"videoPointUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPointAudioUploads",type:"checkbox",value:this.group.configuration.allowPointAudioUploads,translationToken:"allowPointAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPointUploadLimitSec,translationToken:"audioPointUploadLimitSec",disabled:!this.hasAudioUpload},{text:"disableMachineTranscripts",type:"checkbox",value:this.group.configuration.disableMachineTranscripts,translationToken:"disableMachineTranscripts"},{text:"allowAdminAnswersToPoints",type:"checkbox",value:this.group.configuration.allowAdminAnswersToPoints,translationToken:"allowAdminAnswersToPoints"},{text:"customAdminCommentsTitle",type:"textfield",maxLength:50,charCounter:!0,value:this.group.configuration.customAdminCommentsTitle,translationToken:"customAdminCommentsTitle"}]}}_getAdditionalConfigTab(){return{name:"additionalGroupConfig",icon:"settings",items:[{text:"defaultLocale",type:"html",templateData:x`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.group.configuration.defaultLocale}"
            >
            </yp-language-selector>
          `},{text:"hideStatsAndMembership",type:"checkbox",value:this.group.configuration.hideStatsAndMembership,translationToken:"hideStatsAndMembership"},{text:"customBackURL",type:"textfield",maxLength:256,value:this.group.configuration.customBackURL,translationToken:"customBackURL"},{text:"customBackName",type:"textfield",maxLength:20,value:this.group.configuration.customBackName,translationToken:"customBackName"},{text:"optionalSortOrder",type:"textfield",maxLength:4,value:this.group.configuration.optionalSortOrder,translationToken:"optionalSortOrder"},{text:"disableNameAutoTranslation",type:"checkbox",value:this.group.configuration.disableNameAutoTranslation,translationToken:"disableNameAutoTranslation"},{text:"hideAllTabs",type:"checkbox",value:this.group.configuration.hideAllTabs,translationToken:"hideAllTabs"},{text:"hideGroupLevelTabs",type:"checkbox",value:this.group.configuration.hideGroupLevelTabs,translationToken:"hideGroupLevelTabs"},{text:"hideHelpIcon",type:"checkbox",value:this.group.configuration.hideHelpIcon,translationToken:"hideHelpIcon"},{text:"useCommunityTopBanner",type:"checkbox",value:this.group.configuration.useCommunityTopBanner,translationToken:"useCommunityTopBanner"},{text:"makeMapViewDefault",type:"checkbox",value:this.group.configuration.makeMapViewDefault,translationToken:"makeMapViewDefault"},{text:"simpleFormatDescription",type:"checkbox",value:this.group.configuration.simpleFormatDescription,translationToken:"simpleFormatDescription"},{text:"resourceLibraryLinkMode",type:"checkbox",value:this.group.configuration.resourceLibraryLinkMode,translationToken:"resourceLibraryLinkMode"},{text:"collapsableTranscripts",type:"checkbox",value:this.group.configuration.collapsableTranscripts,translationToken:"collapsableTranscripts"},{text:"allowWhatsAppSharing",type:"checkbox",value:this.group.configuration.allowWhatsAppSharing,translationToken:"allowWhatsAppSharing"},{text:"actAsLinkToCommunityId",type:"textfield",maxLength:8,pattern:"[0-9]",value:this.group.configuration.actAsLinkToCommunityId,translationToken:"actAsLinkToCommunityId"},{text:"maxDaysBackForRecommendations",type:"textfield",maxLength:5,pattern:"[0-9]",value:this.group.configuration.maxDaysBackForRecommendations,translationToken:"maxDaysBackForRecommendations"},{text:"customUserNamePrompt",type:"textfield",maxLength:45,charCounter:!0,value:this.group.configuration.customUserNamePrompt,translationToken:"customUserNamePrompt"},{text:"customTermsIntroText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customTermsIntroText,translationToken:"customTermsIntroText"},{text:"externalGoalTriggerUrl",type:"textfield",value:this.group.configuration.externalGoalTriggerUrl,translationToken:"externalGoalTriggerUrl"},{text:"externalId",type:"textfield",value:this.group.configuration.externalId,translationToken:"externalId"},{text:"usePostListFormatOnDesktop",type:"checkbox",value:this.group.configuration.usePostListFormatOnDesktop,translationToken:"usePostListFormatOnDesktop"},{text:"usePostTags",type:"checkbox",value:this.group.configuration.usePostTags,translationToken:"usePostTags"},{text:"usePostTagsForPostListItems",type:"checkbox",value:this.group.configuration.usePostTagsForPostListItems,translationToken:"usePostTagsForPostListItems"},{text:"usePostTagsForPostCards",type:"checkbox",value:this.group.configuration.usePostTagsForPostCards,translationToken:"usePostTagsForPostCards"},{text:"forceShowDebateCountOnPost",type:"checkbox",value:this.group.configuration.forceShowDebateCountOnPost,translationToken:"forceShowDebateCountOnPost"},{text:"closeNewsfeedSubmissions",type:"checkbox",value:this.group.configuration.closeNewsfeedSubmissions,translationToken:"closeNewsfeedSubmissions"},{text:"hideNewsfeeds",type:"checkbox",value:this.group.configuration.hideNewsfeeds,translationToken:"hideNewsfeeds"},{text:"disableCollectionUpLink",type:"checkbox",value:this.group.configuration.disableCollectionUpLink,translationToken:"disableCollectionUpLink"},{text:"welcomeSelectPage",type:"html",hidden:!this.pages,templateData:x`
            <md-outlined-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(((e,t)=>x`
                  <md-select-option ?selected="${this.welcomePageId==e.id}"
                    >${this._getLocalizePageTitle(e)}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"urlToReview",type:"textfield",value:this.group.configuration.urlToReview,translationToken:"urlToReview"},{text:"urlToReviewActionText",type:"textfield",maxLength:30,charCounter:!0,value:this.group.configuration.urlToReviewActionText,translationToken:"urlToReviewActionText"},{text:"isDataVisualizationGroup",type:"checkbox",value:this.group.configuration.isDataVisualizationGroup,translationToken:"isDataVisualizationGroup",onTap:"_isDataVisualizationGroupClick"},{text:"dataForVisualization",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.dataForVisualization,translationToken:"dataForVisualization",hidden:!this.isDataVisualizationGroup,onChange:"_dataForVisualizationChanged"},{text:"dataForVisualizationJsonError",type:"textdescription",hidden:!this.dataForVisualizationJsonError,translationToken:"structuredQuestionsJsonFormatNotValid"},{text:"moveGroupTo",type:"html",templateData:x`
            <md-outlined-select
              name="moveGroupTo"
              .label="${this.t("moveGroupTo")}"
              @selected="${this._moveGroupToSelected}"
            >
              ${this.groupMoveToOptions?.map((e=>x`
                  <md-select-option
                    ?selected="${this.moveGroupToId==e.id}"
                    >${e.name}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"categories.the_all",type:"html",templateData:x`
            <div class="subHeaders">${this.t("categories.the_all")}</div>
            <md-outlined-select
              .label="${this.t("selectCategory")}"
              @selected="${this._categorySelected}"
            >
              ${this.group.Categories?.map((e=>x`
                  <md-select-option value="${e.id}">
                    <md-icon
                      slot="icon"
                      src="${this._categoryImageSrc(e)}"
                    ></md-icon>
                    ${e.name}
                  </md-select-option>
                `))}
            </md-outlined-select>
          `}]}}earlConfigChanged(e){this.group.configuration.allOurIdeas=this.$$("aoi-earl-ideas-editor").configuration,this.requestUpdate()}themeConfigChanged(e){this.group.configuration.theme={...this.group.configuration.theme,...e.detail},this.requestUpdate()}renderCreateEarl(e,t){return x`<aoi-earl-ideas-editor
      id="createEarl"
      .domainId="${e}"
      .communityId="${t}"
      @configuration-changed="${this.earlConfigChanged}"
      @theme-config-changed="${this.themeConfigChanged}"
      .group="${this.group}"
      .configuration="${this.group.configuration.allOurIdeas}"
    ></aoi-earl-ideas-editor>`}setupEarlConfigIfNeeded(){const e=this.group.configuration.allOurIdeas;e.earl||(e.earl={active:!0,configuration:{accept_new_ideas:!0,hide_results:!1,hide_analysis:!1,hide_skip:!1,enableAiModeration:!1,allowAnswersNotForVoting:!1,hide_explain:!1,minimum_ten_votes_to_show_results:!0,target_votes:30,analysis_config:defaultAiAnalysisJson,moderationPrompt:defaultModerationPrompt,welcome_html:"",welcome_message:"",external_goal_params_whitelist:"",external_goal_trigger_url:""}},this.configTabs=this.setupConfigTabs(),this.requestUpdate()),e.earl.question||(e.earl.question={})}questionNameChanged(e){this.setupEarlConfigIfNeeded();const t=e.currentTarget.value,i=this.group.configuration.allOurIdeas,o=this.$$("#createEarl");t&&t.length>=3?o.openForAnswers=!0:o.openForAnswers=!1,i.earl.question.name=t,this.aoiQuestionName=t,console.error("questionNameChanged",t),this.set(this.group.configuration.allOurIdeas.earl,"question.name",t),this.questionNameHasChanged=!0,this.configTabs=this.setupConfigTabs(),this._configChanged(),this.requestUpdate()}afterSave(){if(super.afterSave(),this.questionNameHasChanged){let e,t;"new"===this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup?t=this.parentCollectionId:e="new"===this.collectionId?this.parentCollectionId:this.group.community_id;(new AoiAdminServerApi).updateName(t,e,this.group.configuration.allOurIdeas.earl.question.id,this.group.configuration.allOurIdeas.earl.question.name)}}_getAllOurIdeaTab(){let e,t,i=this.group.configuration.allOurIdeas;return i||(i=this.group.configuration.allOurIdeas={}),"new"===this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup?(t=this.parentCollectionId,this.group.configuration.disableCollectionUpLink=!0):e="new"===this.collectionId?this.parentCollectionId:this.group.community_id,{name:"allOurIdeas",icon:"lightbulb",items:[{text:"questionName",type:"textarea",maxLength:140,rows:2,charCounter:!0,value:this.aoiQuestionName,translationToken:"questionName",onChange:this.questionNameChanged},{text:"earlConfig",type:"html",templateData:this.renderCreateEarl(t,e)}]}}set(e,t,i){const o=t.split(".");let n=e;o.forEach(((e,t)=>{t===o.length-1?n[e]=i:(n[e]||(n[e]={}),n=n[e])}))}_updateEarl(e,t,i=!1){let o=e.detail.value;if(i)try{o=JSON.parse(o)}catch(e){console.error("Error parsing JSON",e)}this.set(this.group.configuration.allOurIdeas.earl,t,o),this._configChanged(),this.requestUpdate()}_getAllOurIdeaOptionsTab(){let e=this.group.configuration.allOurIdeas?.earl;return e&&(e.configuration.analysis_config||(e.configuration.analysis_config=defaultAiAnalysisJson)),{name:"allOurIdeasOptions",icon:"settings",items:[{text:"active",type:"checkbox",onChange:e=>this._updateEarl(e,"active"),value:e?.active,translationToken:"wikiSurveyActive"},{text:"welcome_message",type:"textarea",rows:5,maxLength:300,value:e?.configuration?.welcome_message,onChange:e=>this._updateEarl(e,"configuration.welcome_message"),translationToken:"welcomeMessage"},{text:"accept_new_ideas",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.accept_new_ideas"),value:void 0===e?.configuration?.accept_new_ideas||e?.configuration?.accept_new_ideas,translationToken:"acceptNewIdeas"},{text:"enableAiModeration",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.enableAiModeration"),value:e?.configuration?.enableAiModeration,translationToken:"enableAiModeration"},{text:"allowAnswersNotForVoting",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.allowAnswersNotForVoting"),value:e?.configuration?.allowAnswersNotForVoting,translationToken:"allowAnswersNotForVoting"},{text:"minimum_ten_votes_to_show_results",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.minimum_ten_votes_to_show_results"),value:e?.configuration?.minimum_ten_votes_to_show_results,translationToken:"minimumTenVotesToShowResults"},{text:"disableCollectionUpLink",type:"checkbox",value:this.group.configuration.disableCollectionUpLink,translationToken:"disableCollectionUpLink"},{text:"hide_results",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_results"),value:e?.configuration?.hide_results,translationToken:"hideAoiResults"},{text:"hide_analysis",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_analysis"),value:e?.configuration?.hide_analysis,translationToken:"hideAoiAnalysis"},{text:"hide_skip",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_skip"),value:e?.configuration?.hide_skip,translationToken:"hideSkipButton"},{text:"hide_explain",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_explain"),value:e?.configuration?.hide_explain,translationToken:"hideAoiExplainButton"},{text:"welcome_html",type:"textarea",rows:5,value:e?.configuration?.welcome_html,onChange:e=>this._updateEarl(e,"configuration.welcome_html"),translationToken:"welcomeHtml"},{text:"moderationPrompt",type:"textarea",rows:5,value:e?.configuration?.moderationPrompt?e?.configuration?.moderationPrompt:defaultModerationPrompt,onChange:e=>this._updateEarl(e,"configuration.moderationPrompt"),translationToken:"aoiModerationPrompt"},{text:"targetVotes",type:"textfield",maxLength:3,pattern:"[0-9]",value:e?.configuration?.target_votes,translationToken:"targetVotes",onChange:e=>this._updateEarl(e,"configuration.target_votes",!0),charCounter:!0},{text:"externalGoalParamsWhitelist",type:"textfield",pattern:"[0-9]",value:e?.configuration?.external_goal_params_whitelist,onChange:e=>this._updateEarl(e,"configuration.external_goal_params_whitelist",!0),translationToken:"externalGoalParamsWhitelist"},{text:"externalGoalTriggerUrl",type:"textfield",value:e?.configuration?.external_goal_trigger_url,onChange:e=>this._updateEarl(e,"configuration.external_goal_trigger_url",!0),translationToken:"externalGoalTriggerUrl"},{text:"analysis_config",type:"textarea",rows:7,value:e?.configuration?.analysis_config?JSON.stringify(e?.configuration?.analysis_config,null,2):JSON.stringify(defaultAiAnalysisJson,null,2),onChange:e=>this._updateEarl(e,"configuration.analysis_config",!0),translationToken:"aoiAiAnalysisConfig"},{type:"html",templateData:x`<div
            class="layout vertical center-center"
            style="margin-top: -8px"
          >
            <div style="max-width: 700px">
              ${o$8(this.t("aiAnalysisConfigInfo"))}
            </div>
          </div>`}]}}_categorySelected(e){e.detail.value}_categoryImageSrc(e){return`path/to/category/icons/${e.id}.png`}_welcomePageSelected(e){const t=e.detail.index;this.welcomePageId=this.translatedPages[t].id}_isDataVisualizationGroupClick(e){}_dataForVisualizationChanged(e){}_moveGroupToSelected(e){const t=e.detail.index;this.moveGroupToId=this.groupMoveToOptions[t].id}setupConfigTabs(){const e=[];if(this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.ideaGeneration){const t=this._getPostSettingsTab();this.isGroupFolder||e.push(t),e.push(this._getVoteSettingsTab()),e.push(this._getPointSettingsTab()),e.push(this._getAdditionalConfigTab())}else this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.allOurIdeas&&(e.push(this._getAllOurIdeaTab()),e.push(this._getAllOurIdeaOptionsTab()));return e.push(this._getAccessTab()),e.push(this._getThemeTab()),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};YpAdminConfigGroup.GroupType={ideaGeneration:0,allOurIdeas:1},__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"appHomeScreenIconImageId",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"hostnameExample",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"signupTermsPageId",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"welcomePageId",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"aoiQuestionName",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"groupAccess",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"groupTypeIndex",void 0),__decorate$9([n$8({type:Object})],YpAdminConfigGroup.prototype,"group",void 0),YpAdminConfigGroup=YpAdminConfigGroup_1=__decorate$9([t$5("yp-admin-config-group")],YpAdminConfigGroup);var __decorate$8=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminGroups=class extends YpBaseElementWithLogin{newGroup(){YpNavHelpers.redirectTo(`/group/new/${this.community.id}`)}static get styles(){return[super.styles,i$5`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }

        .groupItem {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          width: 600px;
          margin: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .groupText {
          margin-top: 18px;
          font-size: 1.1em;
        }
      `]}gotoGroup(e){YpNavHelpers.redirectTo(`/group/${e.id}`)}renderGroup(e){const t=YpMediaHelpers.getImageFormatUrl(e.GroupLogoImages);return x`
      <div
        class="layout horizontal groupItem"
        @click="${()=>this.gotoGroup(e)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${t}"
        ></yp-image>
        <div class="layout vertical">
          <div class="groupText">${e.name}</div>
        </div>
      </div>
    `}render(){return x`
      <div class="layout horizontal center-center fabContainer">
        <md-fab .label="${this.t("New Group")}" @click="${this.newGroup}"
          ><md-icon slot="icon">add</md-icon></md-fab
        >
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.community.Groups.map((e=>this.renderGroup(e)))}
        </div>
      </div>
    `}};__decorate$8([n$8({type:Object})],YpAdminGroups.prototype,"community",void 0),YpAdminGroups=__decorate$8([t$5("yp-admin-groups")],YpAdminGroups);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Lumo extends HTMLElement{static get version(){return"23.3.31"}}customElements.define("vaadin-lumo-styles",Lumo);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=window,e$5=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$7=Symbol(),n$7=new WeakMap;let o$7=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s$7)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(e$5&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n$7.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n$7.set(t,e))}return e}toString(){return this.cssText}};const r$5=e=>new o$7("string"==typeof e?e:e+"",void 0,s$7),i$3=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1]),e[0]);return new o$7(i,e,s$7)},S$3=(e,t)=>{e$5?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const i=document.createElement("style"),o=t$3.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,e.appendChild(i)}))},c$3=e$5?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r$5(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var s$6;const e$4=window,r$4=e$4.trustedTypes,h$3=r$4?r$4.emptyScript:"",o$6=e$4.reactiveElementPolyfillSupport,n$6={toAttribute(e,t){switch(t){case Boolean:e=e?h$3:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},a$3=(e,t)=>t!==e&&(t==t||e==e),l$5={attribute:!0,type:String,converter:n$6,reflect:!1,hasChanged:a$3},d$3="finalized";let u$3=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const o=this._$Ep(i,t);void 0!==o&&(this._$Ev.set(o,i),e.push(o))})),e}static createProperty(e,t=l$5){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const n=this[e];this[t]=o,this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||l$5}static finalize(){if(this.hasOwnProperty(d$3))return!1;this[d$3]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(c$3(e))}else void 0!==e&&t.push(c$3(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return S$3(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=l$5){var o;const n=this.constructor._$Ep(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:n$6).toAttribute(t,i.type);this._$El=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$El=null}}_$AK(e,t){var i;const o=this.constructor,n=o._$Ev.get(e);if(void 0!==n&&this._$El!==n){const e=o.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:n$6;this._$El=n,this[n]=s.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let o=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||a$3)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$2;u$3[d$3]=!0,u$3.elementProperties=new Map,u$3.elementStyles=[],u$3.shadowRootOptions={mode:"open"},null==o$6||o$6({ReactiveElement:u$3}),(null!==(s$6=e$4.reactiveElementVersions)&&void 0!==s$6?s$6:e$4.reactiveElementVersions=[]).push("1.6.3");const i$2=window,s$5=i$2.trustedTypes,e$3=s$5?s$5.createPolicy("lit-html",{createHTML:e=>e}):void 0,o$5="$lit$",n$5=`lit$${(Math.random()+"").slice(9)}$`,l$4="?"+n$5,h$2=`<${l$4}>`,r$3=document,u$2=()=>r$3.createComment(""),d$2=e=>null===e||"object"!=typeof e&&"function"!=typeof e,c$2=Array.isArray,v$1=e=>c$2(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),a$2="[ \t\n\f\r]",f$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_$1=/-->/g,m$1=/>/g,p$1=RegExp(`>|${a$2}(?:([^\\s"'>=/]+)(${a$2}*=${a$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g$1=/'/g,$$1=/"/g,y$1=/^(?:script|style|textarea|title)$/i,T$1=Symbol.for("lit-noChange"),A$1=Symbol.for("lit-nothing"),E$1=new WeakMap,C$1=r$3.createTreeWalker(r$3,129,null,!1);function P$1(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$3?e$3.createHTML(t):t}const V$1=(e,t)=>{const i=e.length-1,o=[];let n,s=2===t?"<svg>":"",r=f$1;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===f$1?"!--"===l[1]?r=_$1:void 0!==l[1]?r=m$1:void 0!==l[2]?(y$1.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=p$1):void 0!==l[3]&&(r=p$1):r===p$1?">"===l[0]?(r=null!=n?n:f$1,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?p$1:'"'===l[3]?$$1:g$1):r===$$1||r===g$1?r=p$1:r===_$1||r===m$1?r=f$1:(r=p$1,n=void 0);const g=r===p$1&&e[t+1].startsWith("/>")?" ":"";s+=r===f$1?i+h$2:c>=0?(o.push(a),i.slice(0,c)+o$5+i.slice(c)+n$5+g):i+n$5+(-2===c?(o.push(void 0),t):g)}return[P$1(e,s+(e[i]||"<?>")+(2===t?"</svg>":"")),o]};let N$1=class e{constructor({strings:t,_$litType$:i},o){let n;this.parts=[];let s=0,r=0;const a=t.length-1,l=this.parts,[c,d]=V$1(t,i);if(this.el=e.createElement(c,o),C$1.currentNode=this.el.content,2===i){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(n=C$1.nextNode())&&l.length<a;){if(1===n.nodeType){if(n.hasAttributes()){const e=[];for(const t of n.getAttributeNames())if(t.endsWith(o$5)||t.startsWith(n$5)){const i=d[r++];if(e.push(t),void 0!==i){const e=n.getAttribute(i.toLowerCase()+o$5).split(n$5),t=/([.?@])?(.*)/.exec(i);l.push({type:1,index:s,name:t[2],strings:e,ctor:"."===t[1]?H$1:"?"===t[1]?L$1:"@"===t[1]?z$1:k$1})}else l.push({type:6,index:s})}for(const t of e)n.removeAttribute(t)}if(y$1.test(n.tagName)){const e=n.textContent.split(n$5),t=e.length-1;if(t>0){n.textContent=s$5?s$5.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],u$2()),C$1.nextNode(),l.push({type:2,index:++s});n.append(e[t],u$2())}}}else if(8===n.nodeType)if(n.data===l$4)l.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(n$5,e+1));)l.push({type:7,index:s}),e+=n$5.length-1}s++}}static createElement(e,t){const i=r$3.createElement("template");return i.innerHTML=e,i}};function S$2(e,t,i=e,o){var n,s,r,a;if(t===T$1)return t;let l=void 0!==o?null===(n=i._$Co)||void 0===n?void 0:n[o]:i._$Cl;const c=d$2(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,i,o)),void 0!==o?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(t=S$2(e,l._$AS(e,t.values),l,o)),t}let M$1=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:i},parts:o}=this._$AD,n=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:r$3).importNode(i,!0);C$1.currentNode=n;let s=C$1.nextNode(),r=0,a=0,l=o[0];for(;void 0!==l;){if(r===l.index){let t;2===l.type?t=new R$1(s,s.nextSibling,this,e):1===l.type?t=new l.ctor(s,l.name,l.strings,this,e):6===l.type&&(t=new Z$1(s,this,e)),this._$AV.push(t),l=o[++a]}r!==(null==l?void 0:l.index)&&(s=C$1.nextNode(),r++)}return C$1.currentNode=r$3,n}v(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},R$1=class e{constructor(e,t,i,o){var n;this.type=2,this._$AH=A$1,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cp=null===(n=null==o?void 0:o.isConnected)||void 0===n||n}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S$2(this,e,t),d$2(e)?e===A$1||null==e||""===e?(this._$AH!==A$1&&this._$AR(),this._$AH=A$1):e!==this._$AH&&e!==T$1&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):v$1(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==A$1&&d$2(this._$AH)?this._$AA.nextSibling.data=e:this.$(r$3.createTextNode(e)),this._$AH=e}g(e){var t;const{values:i,_$litType$:o}=e,n="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=N$1.createElement(P$1(o.h,o.h[0]),this.options)),o);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===n)this._$AH.v(i);else{const e=new M$1(n,this),t=e.u(this.options);e.v(i),this.$(t),this._$AH=e}}_$AC(e){let t=E$1.get(e.strings);return void 0===t&&E$1.set(e.strings,t=new N$1(e)),t}T(t){c$2(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let o,n=0;for(const s of t)n===i.length?i.push(o=new e(this.k(u$2()),this.k(u$2()),this,this.options)):o=i[n],o._$AI(s),n++;n<i.length&&(this._$AR(o&&o._$AB.nextSibling,n),i.length=n)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cp=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}},k$1=class{constructor(e,t,i,o,n){this.type=1,this._$AH=A$1,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A$1}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,o){const n=this.strings;let s=!1;if(void 0===n)e=S$2(this,e,t,0),s=!d$2(e)||e!==this._$AH&&e!==T$1,s&&(this._$AH=e);else{const o=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=S$2(this,o[i+r],t,r),a===T$1&&(a=this._$AH[r]),s||(s=!d$2(a)||a!==this._$AH[r]),a===A$1?e=A$1:e!==A$1&&(e+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(e)}j(e){e===A$1?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}},H$1=class extends k$1{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A$1?void 0:e}};const I$1=s$5?s$5.emptyScript:"";let L$1=class extends k$1{constructor(){super(...arguments),this.type=4}j(e){e&&e!==A$1?this.element.setAttribute(this.name,I$1):this.element.removeAttribute(this.name)}},z$1=class extends k$1{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=S$2(this,e,t,0))&&void 0!==i?i:A$1)===T$1)return;const o=this._$AH,n=e===A$1&&o!==A$1||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==A$1&&(o===A$1||n);n&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}},Z$1=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){S$2(this,e)}};const B$1=i$2.litHtmlPolyfillSupport;null==B$1||B$1(N$1,R$1),(null!==(t$2=i$2.litHtmlVersions)&&void 0!==t$2?t$2:i$2.litHtmlVersions=[]).push("2.8.0");const D$1=(e,t,i)=>{var o,n;const s=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:t;let r=s._$litPart$;if(void 0===r){const e=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;s._$litPart$=r=new R$1(t.insertBefore(u$2(),e),e,void 0,null!=i?i:{})}return r._$AI(e),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};var l$3,o$4;let s$4=class extends u$3{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=D$1(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return T$1}};s$4.finalized=!0,s$4._$litElement$=!0,null===(l$3=globalThis.litElementHydrateSupport)||void 0===l$3||l$3.call(globalThis,{LitElement:s$4});const n$4=globalThis.litElementPolyfillSupport;null==n$4||n$4({LitElement:s$4}),(null!==(o$4=globalThis.litElementVersions)&&void 0!==o$4?o$4:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ThemePropertyMixin=e=>class extends e{static get properties(){return{theme:{type:String,reflectToAttribute:!0,observer:"__deprecatedThemePropertyChanged"},_theme:{type:String,readOnly:!0}}}__deprecatedThemePropertyChanged(e){this._set_theme(e)}}
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,themeRegistry=[];function registerStyles(e,t,i={}){e&&hasThemes(e)&&console.warn(`The custom element definition for "${e}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`),t=flattenStyles(t),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(e,t,i):themeRegistry.push({themeFor:e,styles:t,include:i.include,moduleId:i.moduleId})}function getAllThemes(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():themeRegistry}function matchesThemeFor(e,t){return(e||"").split(" ").some((e=>new RegExp(`^${e.split("*").join(".*")}$`).test(t)))}function getIncludePriority(e=""){let t=0;return e.startsWith("lumo-")||e.startsWith("material-")?t=1:e.startsWith("vaadin-")&&(t=2),t}function flattenStyles(e=[]){return[e].flat(1/0).filter((e=>e instanceof o$7||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}function getIncludedStyles(e){const t=[];return e.include&&[].concat(e.include).forEach((e=>{const i=getAllThemes().find((t=>t.moduleId===e));i?t.push(...getIncludedStyles(i),...i.styles):console.warn(`Included moduleId ${e} not found in style registry`)}),e.styles),t}function addStylesToTemplate(e,t){const i=document.createElement("style");i.innerHTML=e.map((e=>e.cssText)).join("\n"),t.content.appendChild(i)}function getThemes(e){const t=`${e}-default-theme`,i=getAllThemes().filter((i=>i.moduleId!==t&&matchesThemeFor(i.themeFor,e))).map((e=>({...e,styles:[...getIncludedStyles(e),...e.styles],includePriority:getIncludePriority(e.moduleId)}))).sort(((e,t)=>t.includePriority-e.includePriority));return i.length>0?i:getAllThemes().filter((e=>e.moduleId===t))}function hasThemes(e){return classHasThemes(customElements.get(e))}function classHasThemes(e){return e&&Object.prototype.hasOwnProperty.call(e,"__themes")}const ThemableMixin=e=>class extends(ThemePropertyMixin(e)){static finalize(){if(super.finalize(),this.elementStyles)return;const e=this.prototype._template;e&&!classHasThemes(this)&&addStylesToTemplate(this.getStylesForThis(),e)}static finalizeStyles(e){const t=this.getStylesForThis();return e?[...super.finalizeStyles(e),...t]:t}static getStylesForThis(){const e=Object.getPrototypeOf(this.prototype),t=(e?e.constructor.__themes:[])||[];this.__themes=[...t,...getThemes(this.is)];const i=this.__themes.flatMap((e=>e.styles));return i.filter(((e,t)=>t===i.lastIndexOf(e)))}}
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,colorBase=i$3`
  :host {
    /* Base (background) */
    --lumo-base-color: #fff;

    /* Tint */
    --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
    --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
    --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
    --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
    --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
    --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
    --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
    --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
    --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
    --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
    --lumo-tint: #fff;

    /* Shade */
    --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
    --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
    --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
    --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
    --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
    --lumo-shade-50pct: hsla(214, 45%, 20%, 0.52);
    --lumo-shade-60pct: hsla(214, 43%, 19%, 0.6);
    --lumo-shade-70pct: hsla(214, 42%, 18%, 0.69);
    --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
    --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
    --lumo-shade: hsl(214, 35%, 15%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-shade-5pct);
    --lumo-contrast-10pct: var(--lumo-shade-10pct);
    --lumo-contrast-20pct: var(--lumo-shade-20pct);
    --lumo-contrast-30pct: var(--lumo-shade-30pct);
    --lumo-contrast-40pct: var(--lumo-shade-40pct);
    --lumo-contrast-50pct: var(--lumo-shade-50pct);
    --lumo-contrast-60pct: var(--lumo-shade-60pct);
    --lumo-contrast-70pct: var(--lumo-shade-70pct);
    --lumo-contrast-80pct: var(--lumo-shade-80pct);
    --lumo-contrast-90pct: var(--lumo-shade-90pct);
    --lumo-contrast: var(--lumo-shade);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 100%, 48%);
    --lumo-primary-color-50pct: hsla(214, 100%, 49%, 0.76);
    --lumo-primary-color-10pct: hsla(214, 100%, 60%, 0.13);
    --lumo-primary-text-color: hsl(214, 100%, 43%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 85%, 48%);
    --lumo-error-color-50pct: hsla(3, 85%, 49%, 0.5);
    --lumo-error-color-10pct: hsla(3, 85%, 49%, 0.1);
    --lumo-error-text-color: hsl(3, 89%, 42%);
    --lumo-error-contrast-color: #fff;

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 72%, 31%, 0.5);
    --lumo-success-color-10pct: hsla(145, 72%, 31%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 25%);
    --lumo-success-contrast-color: #fff;
  }
`,$tpl$4=document.createElement("template");$tpl$4.innerHTML=`<style>${colorBase.toString().replace(":host","html")}</style>`,document.head.appendChild($tpl$4.content);const color=i$3`
  [theme~='dark'] {
    /* Base (background) */
    --lumo-base-color: hsl(214, 35%, 21%);

    /* Tint */
    --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
    --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
    --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
    --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
    --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
    --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
    --lumo-tint-60pct: hsla(214, 82%, 90%, 0.58);
    --lumo-tint-70pct: hsla(214, 87%, 92%, 0.69);
    --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
    --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
    --lumo-tint: hsl(214, 100%, 98%);

    /* Shade */
    --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
    --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
    --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
    --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
    --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
    --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
    --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
    --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
    --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
    --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
    --lumo-shade: hsl(214, 33%, 13%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-tint-5pct);
    --lumo-contrast-10pct: var(--lumo-tint-10pct);
    --lumo-contrast-20pct: var(--lumo-tint-20pct);
    --lumo-contrast-30pct: var(--lumo-tint-30pct);
    --lumo-contrast-40pct: var(--lumo-tint-40pct);
    --lumo-contrast-50pct: var(--lumo-tint-50pct);
    --lumo-contrast-60pct: var(--lumo-tint-60pct);
    --lumo-contrast-70pct: var(--lumo-tint-70pct);
    --lumo-contrast-80pct: var(--lumo-tint-80pct);
    --lumo-contrast-90pct: var(--lumo-tint-90pct);
    --lumo-contrast: var(--lumo-tint);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 90%, 48%);
    --lumo-primary-color-50pct: hsla(214, 90%, 70%, 0.69);
    --lumo-primary-color-10pct: hsla(214, 90%, 55%, 0.13);
    --lumo-primary-text-color: hsl(214, 90%, 77%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 79%, 49%);
    --lumo-error-color-50pct: hsla(3, 75%, 62%, 0.5);
    --lumo-error-color-10pct: hsla(3, 75%, 62%, 0.14);
    --lumo-error-text-color: hsl(3, 100%, 80%);

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 92%, 51%, 0.5);
    --lumo-success-color-10pct: hsla(145, 92%, 51%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 46%);
  }

  html {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: light;
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a:where(:any-link) {
    color: var(--lumo-primary-text-color);
  }

  a:not(:any-link) {
    color: var(--lumo-disabled-text-color);
  }

  blockquote {
    color: var(--lumo-secondary-text-color);
  }

  code,
  pre {
    background-color: var(--lumo-contrast-10pct);
    border-radius: var(--lumo-border-radius-m);
  }
`;registerStyles("",color,{moduleId:"lumo-color"});const colorLegacy=i$3`
  :host {
    color: var(--lumo-body-text-color) !important;
    background-color: var(--lumo-base-color) !important;
  }
`;registerStyles("",[color,colorLegacy],{moduleId:"lumo-color-legacy"});
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const template$1=document.createElement("template");template$1.innerHTML='\n  <style>\n    @font-face {\n      font-family: \'lumo-icons\';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format(\'woff\');\n      font-weight: normal;\n      font-style: normal;\n    }\n\n    html {\n      --lumo-icons-align-center: "\\ea01";\n      --lumo-icons-align-left: "\\ea02";\n      --lumo-icons-align-right: "\\ea03";\n      --lumo-icons-angle-down: "\\ea04";\n      --lumo-icons-angle-left: "\\ea05";\n      --lumo-icons-angle-right: "\\ea06";\n      --lumo-icons-angle-up: "\\ea07";\n      --lumo-icons-arrow-down: "\\ea08";\n      --lumo-icons-arrow-left: "\\ea09";\n      --lumo-icons-arrow-right: "\\ea0a";\n      --lumo-icons-arrow-up: "\\ea0b";\n      --lumo-icons-bar-chart: "\\ea0c";\n      --lumo-icons-bell: "\\ea0d";\n      --lumo-icons-calendar: "\\ea0e";\n      --lumo-icons-checkmark: "\\ea0f";\n      --lumo-icons-chevron-down: "\\ea10";\n      --lumo-icons-chevron-left: "\\ea11";\n      --lumo-icons-chevron-right: "\\ea12";\n      --lumo-icons-chevron-up: "\\ea13";\n      --lumo-icons-clock: "\\ea14";\n      --lumo-icons-cog: "\\ea15";\n      --lumo-icons-cross: "\\ea16";\n      --lumo-icons-download: "\\ea17";\n      --lumo-icons-dropdown: "\\ea18";\n      --lumo-icons-edit: "\\ea19";\n      --lumo-icons-error: "\\ea1a";\n      --lumo-icons-eye: "\\ea1b";\n      --lumo-icons-eye-disabled: "\\ea1c";\n      --lumo-icons-menu: "\\ea1d";\n      --lumo-icons-minus: "\\ea1e";\n      --lumo-icons-ordered-list: "\\ea1f";\n      --lumo-icons-phone: "\\ea20";\n      --lumo-icons-photo: "\\ea21";\n      --lumo-icons-play: "\\ea22";\n      --lumo-icons-plus: "\\ea23";\n      --lumo-icons-redo: "\\ea24";\n      --lumo-icons-reload: "\\ea25";\n      --lumo-icons-search: "\\ea26";\n      --lumo-icons-undo: "\\ea27";\n      --lumo-icons-unordered-list: "\\ea28";\n      --lumo-icons-upload: "\\ea29";\n      --lumo-icons-user: "\\ea2a";\n    }\n  </style>\n',document.head.appendChild(template$1.content);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const sizing=i$3`
  :host {
    --lumo-size-xs: 1.625rem;
    --lumo-size-s: 1.875rem;
    --lumo-size-m: 2.25rem;
    --lumo-size-l: 2.75rem;
    --lumo-size-xl: 3.5rem;

    /* Icons */
    --lumo-icon-size-s: 1.25em;
    --lumo-icon-size-m: 1.5em;
    --lumo-icon-size-l: 2.25em;
    /* For backwards compatibility */
    --lumo-icon-size: var(--lumo-icon-size-m);
  }
`,$tpl$3=document.createElement("template");$tpl$3.innerHTML=`<style>${sizing.toString().replace(":host","html")}</style>`,document.head.appendChild($tpl$3.content);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const spacing=i$3`
  :host {
    /* Square */
    --lumo-space-xs: 0.25rem;
    --lumo-space-s: 0.5rem;
    --lumo-space-m: 1rem;
    --lumo-space-l: 1.5rem;
    --lumo-space-xl: 2.5rem;

    /* Wide */
    --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
    --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
    --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
    --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
    --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

    /* Tall */
    --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
    --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
    --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
    --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
    --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
  }
`,$tpl$2=document.createElement("template");$tpl$2.innerHTML=`<style>${spacing.toString().replace(":host","html")}</style>`,document.head.appendChild($tpl$2.content);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const style=i$3`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
    --lumo-border-radius: 0.25em; /* Deprecated */

    /* Shadow */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
    --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
    --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
    --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
    --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

    /* Clickable element cursor */
    --lumo-clickable-cursor: default;
  }
`;i$3`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
  }
`;const $tpl$1=document.createElement("template");$tpl$1.innerHTML=`<style>${style.toString().replace(":host","html")}$</style>`,document.head.appendChild($tpl$1.content);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const font=i$3`
  :host {
    /* prettier-ignore */
    --lumo-font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    /* Font sizes */
    --lumo-font-size-xxs: 0.75rem;
    --lumo-font-size-xs: 0.8125rem;
    --lumo-font-size-s: 0.875rem;
    --lumo-font-size-m: 1rem;
    --lumo-font-size-l: 1.125rem;
    --lumo-font-size-xl: 1.375rem;
    --lumo-font-size-xxl: 1.75rem;
    --lumo-font-size-xxxl: 2.5rem;

    /* Line heights */
    --lumo-line-height-xs: 1.25;
    --lumo-line-height-s: 1.375;
    --lumo-line-height-m: 1.625;
  }
`,typography=i$3`
  html,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size, var(--lumo-font-size-m));
    line-height: var(--lumo-line-height-m);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  small,
  [theme~='font-size-s'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
  }

  [theme~='font-size-xs'] {
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-top: 1.25em;
  }

  h1 {
    font-size: var(--lumo-font-size-xxxl);
    margin-bottom: 0.75em;
  }

  h2 {
    font-size: var(--lumo-font-size-xxl);
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: var(--lumo-font-size-xl);
    margin-bottom: 0.5em;
  }

  h4 {
    font-size: var(--lumo-font-size-l);
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: var(--lumo-font-size-m);
    margin-bottom: 0.25em;
  }

  h6 {
    font-size: var(--lumo-font-size-xs);
    margin-bottom: 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  p,
  blockquote {
    margin-top: 0.5em;
    margin-bottom: 0.75em;
  }

  a {
    text-decoration: none;
  }

  a:where(:any-link):hover {
    text-decoration: underline;
  }

  hr {
    display: block;
    align-self: stretch;
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
    background-color: var(--lumo-contrast-10pct);
  }

  blockquote {
    border-left: 2px solid var(--lumo-contrast-30pct);
  }

  b,
  strong {
    font-weight: 600;
  }

  /* RTL specific styles */
  blockquote[dir='rtl'] {
    border-left: none;
    border-right: 2px solid var(--lumo-contrast-30pct);
  }
`;registerStyles("",typography,{moduleId:"lumo-typography"});const $tpl=document.createElement("template");$tpl.innerHTML=`<style>${font.toString().replace(":host","html")}</style>`,document.head.appendChild($tpl.content),registerStyles("vaadin-checkbox",i$3`
    :host {
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      font-family: var(--lumo-font-family);
      line-height: var(--lumo-line-height-s);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: default;
      outline: none;
      --_checkbox-size: var(--vaadin-checkbox-size, calc(var(--lumo-size-m) / 2));
    }

    :host([has-label]) ::slotted(label) {
      padding-block: var(--lumo-space-xs);
      padding-inline: var(--lumo-space-xs) var(--lumo-space-s);
    }

    [part='checkbox'] {
      width: var(--_checkbox-size);
      height: var(--_checkbox-size);
      margin: var(--lumo-space-xs);
      position: relative;
      border-radius: var(--lumo-border-radius-s);
      background-color: var(--lumo-contrast-20pct);
      transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), background-color 0.15s;
      cursor: var(--lumo-clickable-cursor);
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--lumo-primary-color);
    }

    /* Checkmark */
    [part='checkbox']::after {
      pointer-events: none;
      font-family: 'lumo-icons';
      content: var(--lumo-icons-checkmark);
      color: var(--lumo-primary-contrast-color);
      font-size: calc(var(--_checkbox-size) + 2px);
      line-height: 1;
      position: absolute;
      top: -1px;
      left: -1px;
      contain: content;
      opacity: 0;
    }

    :host([checked]) [part='checkbox']::after {
      opacity: 1;
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      content: '';
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--lumo-primary-contrast-color);
    }

    /* Focus ring */
    :host([focus-ring]) [part='checkbox'] {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      color: var(--lumo-disabled-text-color);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='checkbox'] {
      background-color: var(--lumo-contrast-10pct);
    }

    :host([disabled]) [part='checkbox']::after {
      color: var(--lumo-contrast-30pct);
    }

    :host([indeterminate][disabled]) [part='checkbox']::after {
      background-color: var(--lumo-contrast-30pct);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Used for activation "halo" */
    [part='checkbox']::before {
      pointer-events: none;
      color: transparent;
      width: 100%;
      height: 100%;
      line-height: var(--_checkbox-size);
      border-radius: inherit;
      background-color: inherit;
      transform: scale(1.4);
      opacity: 0;
      transition: transform 0.1s, opacity 0.8s;
    }

    /* Hover */
    :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
      background-color: var(--lumo-contrast-30pct);
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
        background-color: var(--lumo-contrast-20pct);
      }
    }

    /* Active */
    :host([active]) [part='checkbox'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='checkbox'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='checkbox']::before {
      transition-duration: 0.01s, 0.01s;
      transform: scale(0);
      opacity: 0.4;
    }
  `,{moduleId:"lumo-checkbox"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let modules={},lcModules={};function setModule(e,t){modules[e]=lcModules[e.toLowerCase()]=t}function findModule(e){return modules[e]||lcModules[e.toLowerCase()]}function styleOutsideTemplateCheck(e){e.querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}class DomModule extends HTMLElement{static get observedAttributes(){return["id"]}static import(e,t){if(e){let i=findModule(e);return i&&t?i.querySelector(t):i}return null}attributeChangedCallback(e,t,i,o){t!==i&&this.register()}get assetpath(){if(!this.__assetpath){const e=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,t=resolveUrl(this.getAttribute("assetpath")||"",e.baseURI);this.__assetpath=pathFromUrl(t)}return this.__assetpath}register(e){if(e=e||this.id){if(strictTemplatePolicy&&void 0!==findModule(e))throw setModule(e,null),new Error(`strictTemplatePolicy: dom-module ${e} re-registered`);this.id=e,setModule(e,this),styleOutsideTemplateCheck(this)}}}DomModule.prototype.modules=modules,customElements.define("dom-module",DomModule);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const MODULE_STYLE_LINK_SELECTOR="link[rel=import][type~=css]",INCLUDE_ATTR="include",SHADY_UNSCOPED_ATTR="shady-unscoped";function importModule(e){return DomModule.import(e)}function styleForImport(e){let t=e.body?e.body:e;const i=resolveCss(t.textContent,e.baseURI),o=document.createElement("style");return o.textContent=i,o}function stylesFromModules(e){const t=e.trim().split(/\s+/),i=[];for(let e=0;e<t.length;e++)i.push(...stylesFromModule(t[e]));return i}function stylesFromModule(e){const t=importModule(e);if(!t)return console.warn("Could not find style data in module named",e),[];if(void 0===t._styles){const e=[];e.push(..._stylesFromModuleImports(t));const i=t.querySelector("template");i&&e.push(...stylesFromTemplate(i,t.assetpath)),t._styles=e}return t._styles}function stylesFromTemplate(e,t){if(!e._styles){const i=[],o=e.content.querySelectorAll("style");for(let e=0;e<o.length;e++){let n=o[e],s=n.getAttribute(INCLUDE_ATTR);s&&i.push(...stylesFromModules(s).filter((function(e,t,i){return i.indexOf(e)===t}))),t&&(n.textContent=resolveCss(n.textContent,t)),i.push(n)}e._styles=i}return e._styles}function stylesFromModuleImports(e){let t=importModule(e);return t?_stylesFromModuleImports(t):[]}function _stylesFromModuleImports(e){const t=[],i=e.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);for(let e=0;e<i.length;e++){let o=i[e];if(o.import){const e=o.import,i=o.hasAttribute(SHADY_UNSCOPED_ATTR);if(i&&!e._unscopedStyle){const t=styleForImport(e);t.setAttribute(SHADY_UNSCOPED_ATTR,""),e._unscopedStyle=t}else e._style||(e._style=styleForImport(e));t.push(i?e._unscopedStyle:e._style)}}return t}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function isPath(e){return e.indexOf(".")>=0}function root(e){let t=e.indexOf(".");return-1===t?e:e.slice(0,t)}function isAncestor(e,t){return 0===e.indexOf(t+".")}function isDescendant(e,t){return 0===t.indexOf(e+".")}function translate(e,t,i){return t+i.slice(e.length)}function normalize(e){if(Array.isArray(e)){let t=[];for(let i=0;i<e.length;i++){let o=e[i].toString().split(".");for(let e=0;e<o.length;e++)t.push(o[e])}return t.join(".")}return e}function split(e){return Array.isArray(e)?normalize(e).split("."):e.toString().split(".")}function get$1(e,t,i){let o=e,n=split(t);for(let e=0;e<n.length;e++){if(!o)return;o=o[n[e]]}return i&&(i.path=n.join(".")),o}function set(e,t,i){let o=e,n=split(t),s=n[n.length-1];if(n.length>1){for(let e=0;e<n.length-1;e++){if(o=o[n[e]],!o)return}o[s]=i}else o[t]=i;return n.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const caseMap={},DASH_TO_CAMEL=/-[a-z]/g,CAMEL_TO_DASH=/([A-Z])/g;function dashToCamelCase(e){return caseMap[e]||(caseMap[e]=e.indexOf("-")<0?e:e.replace(DASH_TO_CAMEL,(e=>e[1].toUpperCase())))}function camelToDashCase(e){return caseMap[e]||(caseMap[e]=e.replace(CAMEL_TO_DASH,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const microtask=microTask$1,PropertiesChanged=dedupingMixin((e=>class extends e{static createProperties(e){const t=this.prototype;for(let i in e)i in t||t._createPropertyAccessor(i)}static attributeNameForProperty(e){return e.toLowerCase()}static typeForProperty(e){}_createPropertyAccessor(e,t){this._addPropertyToAttributeMap(e),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[e]||(this.__dataHasAccessor[e]=!0,this._definePropertyAccessor(e,t))}_addPropertyToAttributeMap(e){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.__dataAttributes=Object.assign({},this.__dataAttributes));let t=this.__dataAttributes[e];return t||(t=this.constructor.attributeNameForProperty(e),this.__dataAttributes[t]=e),t}_definePropertyAccessor(e,t){Object.defineProperty(this,e,{get(){return this.__data[e]},set:t?function(){}:function(t){this._setPendingProperty(e,t,!0)&&this._invalidateProperties()}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__dataCounter=0,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let e in this.__dataHasAccessor)this.hasOwnProperty(e)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[e]=this[e],delete this[e])}_initializeInstanceProperties(e){Object.assign(this,e)}_setProperty(e,t){this._setPendingProperty(e,t)&&this._invalidateProperties()}_getProperty(e){return this.__data[e]}_setPendingProperty(e,t,i){let o=this.__data[e],n=this._shouldPropertyChange(e,t,o);return n&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(e in this.__dataOld)&&(this.__dataOld[e]=o),this.__data[e]=t,this.__dataPending[e]=t),n}_isPropertyPending(e){return!(!this.__dataPending||!this.__dataPending.hasOwnProperty(e))}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,microtask.run((()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())})))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){this.__dataCounter++;const e=this.__data,t=this.__dataPending,i=this.__dataOld;this._shouldPropertiesChange(e,t,i)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(e,t,i)),this.__dataCounter--}_shouldPropertiesChange(e,t,i){return Boolean(t)}_propertiesChanged(e,t,i){}_shouldPropertyChange(e,t,i){return i!==t&&(i==i||t==t)}attributeChangedCallback(e,t,i,o){t!==i&&this._attributeToProperty(e,i),super.attributeChangedCallback&&super.attributeChangedCallback(e,t,i,o)}_attributeToProperty(e,t,i){if(!this.__serializing){const o=this.__dataAttributes,n=o&&o[e]||e;this[n]=this._deserializeValue(t,i||this.constructor.typeForProperty(n))}}_propertyToAttribute(e,t,i){this.__serializing=!0,i=arguments.length<3?this[e]:i,this._valueToNodeAttribute(this,i,t||this.constructor.attributeNameForProperty(e)),this.__serializing=!1}_valueToNodeAttribute(e,t,i){const o=this._serializeValue(t);"class"!==i&&"name"!==i&&"slot"!==i||(e=wrap$1(e)),void 0===o?e.removeAttribute(i):e.setAttribute(i,""===o&&window.trustedTypes?window.trustedTypes.emptyScript:o)}_serializeValue(e){return"boolean"==typeof e?e?"":void 0:null!=e?e.toString():void 0}_deserializeValue(e,t){switch(t){case Boolean:return null!==e;case Number:return Number(e);default:return e}}})),nativeProperties={};let proto=HTMLElement.prototype;for(;proto;){let e=Object.getOwnPropertyNames(proto);for(let t=0;t<e.length;t++)nativeProperties[e[t]]=!0;proto=Object.getPrototypeOf(proto)}const isTrustedType=window.trustedTypes?e=>trustedTypes.isHTML(e)||trustedTypes.isScript(e)||trustedTypes.isScriptURL(e):()=>!1;function saveAccessorValue(e,t){if(!nativeProperties[t]){let i=e[t];void 0!==i&&(e.__data?e._setPendingProperty(t,i):(e.__dataProto?e.hasOwnProperty(JSCompiler_renameProperty("__dataProto",e))||(e.__dataProto=Object.create(e.__dataProto)):e.__dataProto={},e.__dataProto[t]=i))}}const PropertyAccessors=dedupingMixin((e=>{const t=PropertiesChanged(e);return class extends t{static createPropertiesForAttributes(){let e=this.observedAttributes;for(let t=0;t<e.length;t++)this.prototype._createPropertyAccessor(dashToCamelCase(e[t]))}static attributeNameForProperty(e){return camelToDashCase(e)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(e){for(let t in e)this._setProperty(t,e[t])}_ensureAttribute(e,t){const i=this;i.hasAttribute(e)||this._valueToNodeAttribute(i,t,e)}_serializeValue(e){if("object"==typeof e){if(e instanceof Date)return e.toString();if(e){if(isTrustedType(e))return e;try{return JSON.stringify(e)}catch(e){return""}}}return super._serializeValue(e)}_deserializeValue(e,t){let i;switch(t){case Object:try{i=JSON.parse(e)}catch(t){i=e}break;case Array:try{i=JSON.parse(e)}catch(t){i=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${e}`)}break;case Date:i=isNaN(e)?String(e):Number(e),i=new Date(i);break;default:i=super._deserializeValue(e,t)}return i}_definePropertyAccessor(e,t){saveAccessorValue(this,e),super._definePropertyAccessor(e,t)}_hasAccessor(e){return this.__dataHasAccessor&&this.__dataHasAccessor[e]}_isPropertyPending(e){return Boolean(this.__dataPending&&e in this.__dataPending)}}})),templateExtensions={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let placeholderBugDetect=!1,placeholderBug=!1;function hasPlaceholderBug(){if(!placeholderBugDetect){placeholderBugDetect=!0;const e=document.createElement("textarea");e.placeholder="a",placeholderBug=e.placeholder===e.textContent}return placeholderBug}function fixPlaceholder(e){hasPlaceholderBug()&&"textarea"===e.localName&&e.placeholder&&e.placeholder===e.textContent&&(e.textContent=null)}const copyAttributeWithTemplateEventPolicy=(()=>{const e=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:e=>e});return(t,i,o)=>{const n=i.getAttribute(o);e&&o.startsWith("on-")?t.setAttribute(o,e.createScript(n,o)):t.setAttribute(o,n)}})();function wrapTemplateExtension(e){let t=e.getAttribute("is");if(t&&templateExtensions[t]){let i=e;for(i.removeAttribute("is"),e=i.ownerDocument.createElement(t),i.parentNode.replaceChild(e,i),e.appendChild(i);i.attributes.length;){const{name:t}=i.attributes[0];copyAttributeWithTemplateEventPolicy(e,i,t),i.removeAttribute(t)}}return e}function findTemplateNode(e,t){let i=t.parentInfo&&findTemplateNode(e,t.parentInfo);if(!i)return e;for(let e=i.firstChild,o=0;e;e=e.nextSibling)if(t.parentIndex===o++)return e}function applyIdToMap(e,t,i,o){o.id&&(t[o.id]=i)}function applyEventListener(e,t,i){if(i.events&&i.events.length)for(let o,n=0,s=i.events;n<s.length&&(o=s[n]);n++)e._addMethodEventListenerToNode(t,o.name,o.value,e)}function applyTemplateInfo(e,t,i,o){i.templateInfo&&(t._templateInfo=i.templateInfo,t._parentTemplateInfo=o)}function createNodeEventHandler(e,t,i){e=e._methodHost||e;return function(t){e[i]?e[i](t,t.detail):console.warn("listener method `"+i+"` not defined")}}const TemplateStamp=dedupingMixin((e=>class extends e{static _parseTemplate(e,t){if(!e._templateInfo){let i=e._templateInfo={};i.nodeInfoList=[],i.nestedTemplate=Boolean(t),i.stripWhiteSpace=t&&t.stripWhiteSpace||e.hasAttribute&&e.hasAttribute("strip-whitespace"),this._parseTemplateContent(e,i,{parent:null})}return e._templateInfo}static _parseTemplateContent(e,t,i){return this._parseTemplateNode(e.content,t,i)}static _parseTemplateNode(e,t,i){let o=!1,n=e;return"template"!=n.localName||n.hasAttribute("preserve-content")?"slot"===n.localName&&(t.hasInsertionPoint=!0):o=this._parseTemplateNestedTemplate(n,t,i)||o,fixPlaceholder(n),n.firstChild&&this._parseTemplateChildNodes(n,t,i),n.hasAttributes&&n.hasAttributes()&&(o=this._parseTemplateNodeAttributes(n,t,i)||o),o||i.noted}static _parseTemplateChildNodes(e,t,i){if("script"!==e.localName&&"style"!==e.localName)for(let o,n=e.firstChild,s=0;n;n=o){if("template"==n.localName&&(n=wrapTemplateExtension(n)),o=n.nextSibling,n.nodeType===Node.TEXT_NODE){let i=o;for(;i&&i.nodeType===Node.TEXT_NODE;)n.textContent+=i.textContent,o=i.nextSibling,e.removeChild(i),i=o;if(t.stripWhiteSpace&&!n.textContent.trim()){e.removeChild(n);continue}}let r={parentIndex:s,parentInfo:i};this._parseTemplateNode(n,t,r)&&(r.infoIndex=t.nodeInfoList.push(r)-1),n.parentNode&&s++}}static _parseTemplateNestedTemplate(e,t,i){let o=e,n=this._parseTemplate(o,t);return(n.content=o.content.ownerDocument.createDocumentFragment()).appendChild(o.content),i.templateInfo=n,!0}static _parseTemplateNodeAttributes(e,t,i){let o=!1,n=Array.from(e.attributes);for(let s,r=n.length-1;s=n[r];r--)o=this._parseTemplateNodeAttribute(e,t,i,s.name,s.value)||o;return o}static _parseTemplateNodeAttribute(e,t,i,o,n){return"on-"===o.slice(0,3)?(e.removeAttribute(o),i.events=i.events||[],i.events.push({name:o.slice(3),value:n}),!0):"id"===o&&(i.id=n,!0)}static _contentForTemplate(e){let t=e._templateInfo;return t&&t.content||e.content}_stampTemplate(e,t){e&&!e.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(e);let i=(t=t||this.constructor._parseTemplate(e)).nodeInfoList,o=t.content||e.content,n=document.importNode(o,!0);n.__noInsertionPoint=!t.hasInsertionPoint;let s=n.nodeList=new Array(i.length);n.$={};for(let e,o=0,r=i.length;o<r&&(e=i[o]);o++){let i=s[o]=findTemplateNode(n,e);applyIdToMap(this,n.$,i,e),applyTemplateInfo(this,i,e,t),applyEventListener(this,i,e)}return n}_addMethodEventListenerToNode(e,t,i,o){let n=createNodeEventHandler(o=o||e,t,i);return this._addEventListenerToNode(e,t,n),n}_addEventListenerToNode(e,t,i){e.addEventListener(t,i)}_removeEventListenerFromNode(e,t,i){e.removeEventListener(t,i)}}));
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */let dedupeId=0;const NOOP=[],TYPES={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},COMPUTE_INFO="__computeInfo",capitalAttributeRegex=/[A-Z]/;function ensureOwnEffectMap(e,t,i){let o=e[t];if(o){if(!e.hasOwnProperty(t)&&(o=e[t]=Object.create(e[t]),i))for(let e in o){let t=o[e],i=o[e]=Array(t.length);for(let e=0;e<t.length;e++)i[e]=t[e]}}else o=e[t]={};return o}function runEffects(e,t,i,o,n,s){if(t){let r=!1;const a=dedupeId++;for(let l in i){let c=t[n?root(l):l];if(c)for(let t,d=0,g=c.length;d<g&&(t=c[d]);d++)t.info&&t.info.lastRun===a||n&&!pathMatchesTrigger(l,t.trigger)||(t.info&&(t.info.lastRun=a),t.fn(e,l,i,o,t.info,n,s),r=!0)}return r}return!1}function runEffectsForProperty(e,t,i,o,n,s,r,a){let l=!1,c=t[r?root(o):o];if(c)for(let t,d=0,g=c.length;d<g&&(t=c[d]);d++)t.info&&t.info.lastRun===i||r&&!pathMatchesTrigger(o,t.trigger)||(t.info&&(t.info.lastRun=i),t.fn(e,o,n,s,t.info,r,a),l=!0);return l}function pathMatchesTrigger(e,t){if(t){let i=t.name;return i==e||!(!t.structured||!isAncestor(i,e))||!(!t.wildcard||!isDescendant(i,e))}return!0}function runObserverEffect(e,t,i,o,n){let s="string"==typeof n.method?e[n.method]:n.method,r=n.property;s?s.call(e,e.__data[r],o[r]):n.dynamicFn||console.warn("observer method `"+n.method+"` not defined")}function runNotifyEffects(e,t,i,o,n){let s,r,a=e[TYPES.NOTIFY],l=dedupeId++;for(let r in t)t[r]&&(a&&runEffectsForProperty(e,a,l,r,i,o,n)||n&&notifyPath(e,r,i))&&(s=!0);s&&(r=e.__dataHost)&&r._invalidateProperties&&r._invalidateProperties()}function notifyPath(e,t,i){let o=root(t);if(o!==t){return dispatchNotifyEvent(e,camelToDashCase(o)+"-changed",i[t],t),!0}return!1}function dispatchNotifyEvent(e,t,i,o){let n={value:i,queueProperty:!0};o&&(n.path=o),wrap$1(e).dispatchEvent(new CustomEvent(t,{detail:n}))}function runNotifyEffect(e,t,i,o,n,s){let r=(s?root(t):t)!=t?t:null,a=r?get$1(e,r):e.__data[t];r&&void 0===a&&(a=i[t]),dispatchNotifyEvent(e,n.eventName,a,r)}function handleNotification(e,t,i,o,n){let s,r=e.detail,a=r&&r.path;a?(o=translate(i,o,a),s=r&&r.value):s=e.currentTarget[i],s=n?!s:s,t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][o]||!t._setPendingPropertyOrPath(o,s,!0,Boolean(a))||r&&r.queueProperty||t._invalidateProperties()}function runReflectEffect(e,t,i,o,n){let s=e.__data[t];sanitizeDOMValue&&(s=sanitizeDOMValue(s,n.attrName,"attribute",e)),e._propertyToAttribute(t,n.attrName,s)}function runComputedEffects(e,t,i,o){let n=e[TYPES.COMPUTE];if(n)if(orderedComputed){dedupeId++;const s=getComputedOrder(e),r=[];for(let e in t)enqueueEffectsFor(e,n,r,s,o);let a;for(;a=r.shift();)runComputedEffect(e,"",t,i,a)&&enqueueEffectsFor(a.methodInfo,n,r,s,o);Object.assign(i,e.__dataOld),Object.assign(t,e.__dataPending),e.__dataPending=null}else{let s=t;for(;runEffects(e,n,s,i,o);)Object.assign(i,e.__dataOld),Object.assign(t,e.__dataPending),s=e.__dataPending,e.__dataPending=null}}const insertEffect=(e,t,i)=>{let o=0,n=t.length-1,s=-1;for(;o<=n;){const r=o+n>>1,a=i.get(t[r].methodInfo)-i.get(e.methodInfo);if(a<0)o=r+1;else{if(!(a>0)){s=r;break}n=r-1}}s<0&&(s=n+1),t.splice(s,0,e)},enqueueEffectsFor=(e,t,i,o,n)=>{const s=t[n?root(e):e];if(s)for(let t=0;t<s.length;t++){const r=s[t];r.info.lastRun===dedupeId||n&&!pathMatchesTrigger(e,r.trigger)||(r.info.lastRun=dedupeId,insertEffect(r.info,i,o))}};function getComputedOrder(e){let t=e.constructor.__orderedComputedDeps;if(!t){t=new Map;const i=e[TYPES.COMPUTE];let o,{counts:n,ready:s,total:r}=dependencyCounts(e);for(;o=s.shift();){t.set(o,t.size);const e=i[o];e&&e.forEach((e=>{const t=e.info.methodInfo;--r,0==--n[t]&&s.push(t)}))}if(0!==r){const t=e;console.warn(`Computed graph for ${t.localName} incomplete; circular?`)}e.constructor.__orderedComputedDeps=t}return t}function dependencyCounts(e){const t=e[COMPUTE_INFO],i={},o=e[TYPES.COMPUTE],n=[];let s=0;for(let e in t){const o=t[e];s+=i[e]=o.args.filter((e=>!e.literal)).length+(o.dynamicFn?1:0)}for(let e in o)t[e]||n.push(e);return{counts:i,ready:n,total:s}}function runComputedEffect(e,t,i,o,n){let s=runMethodEffect(e,t,i,o,n);if(s===NOOP)return!1;let r=n.methodInfo;return e.__dataHasAccessor&&e.__dataHasAccessor[r]?e._setPendingProperty(r,s,!0):(e[r]=s,!1)}function computeLinkedPaths(e,t,i){let o=e.__dataLinkedPaths;if(o){let n;for(let s in o){let r=o[s];isDescendant(s,t)?(n=translate(s,r,t),e._setPendingPropertyOrPath(n,i,!0,!0)):isDescendant(r,t)&&(n=translate(r,s,t),e._setPendingPropertyOrPath(n,i,!0,!0))}}}function addBinding(e,t,i,o,n,s,r){i.bindings=i.bindings||[];let a={kind:o,target:n,parts:s,literal:r,isCompound:1!==s.length};if(i.bindings.push(a),shouldAddListener(a)){let{event:e,negate:t}=a.parts[0];a.listenerEvent=e||camelToDashCase(n)+"-changed",a.listenerNegate=t}let l=t.nodeInfoList.length;for(let i=0;i<a.parts.length;i++){let o=a.parts[i];o.compoundIndex=i,addEffectForBindingPart(e,t,a,o,l)}}function addEffectForBindingPart(e,t,i,o,n){if(!o.literal)if("attribute"===i.kind&&"-"===i.target[0])console.warn("Cannot set attribute "+i.target+' because "-" is not a valid attribute starting character');else{let s=o.dependencies,r={index:n,binding:i,part:o,evaluator:e};for(let i=0;i<s.length;i++){let o=s[i];"string"==typeof o&&(o=parseArg(o),o.wildcard=!0),e._addTemplatePropertyEffect(t,o.rootProperty,{fn:runBindingEffect,info:r,trigger:o})}}}function runBindingEffect(e,t,i,o,n,s,r){let a=r[n.index],l=n.binding,c=n.part;if(s&&c.source&&t.length>c.source.length&&"property"==l.kind&&!l.isCompound&&a.__isPropertyEffectsClient&&a.__dataHasAccessor&&a.__dataHasAccessor[l.target]){let o=i[t];t=translate(c.source,l.target,t),a._setPendingPropertyOrPath(t,o,!1,!0)&&e._enqueueClient(a)}else{let r=n.evaluator._evaluateBinding(e,c,t,i,o,s);r!==NOOP&&applyBindingValue(e,a,l,c,r)}}function applyBindingValue(e,t,i,o,n){if(n=computeBindingValue(t,n,i,o),sanitizeDOMValue&&(n=sanitizeDOMValue(n,i.target,i.kind,t)),"attribute"==i.kind)e._valueToNodeAttribute(t,n,i.target);else{let o=i.target;t.__isPropertyEffectsClient&&t.__dataHasAccessor&&t.__dataHasAccessor[o]?t[TYPES.READ_ONLY]&&t[TYPES.READ_ONLY][o]||t._setPendingProperty(o,n)&&e._enqueueClient(t):e._setUnmanagedPropertyToNode(t,o,n)}}function computeBindingValue(e,t,i,o){if(i.isCompound){let n=e.__dataCompoundStorage[i.target];n[o.compoundIndex]=t,t=n.join("")}return"attribute"!==i.kind&&("textContent"!==i.target&&("value"!==i.target||"input"!==e.localName&&"textarea"!==e.localName)||(t=null==t?"":t)),t}function shouldAddListener(e){return Boolean(e.target)&&"attribute"!=e.kind&&"text"!=e.kind&&!e.isCompound&&"{"===e.parts[0].mode}function setupBindings(e,t){let{nodeList:i,nodeInfoList:o}=t;if(o.length)for(let t=0;t<o.length;t++){let n=o[t],s=i[t],r=n.bindings;if(r)for(let t=0;t<r.length;t++){let i=r[t];setupCompoundStorage(s,i),addNotifyListener(s,e,i)}s.__dataHost=e}}function setupCompoundStorage(e,t){if(t.isCompound){let i=e.__dataCompoundStorage||(e.__dataCompoundStorage={}),o=t.parts,n=new Array(o.length);for(let e=0;e<o.length;e++)n[e]=o[e].literal;let s=t.target;i[s]=n,t.literal&&"property"==t.kind&&("className"===s&&(e=wrap$1(e)),e[s]=t.literal)}}function addNotifyListener(e,t,i){if(i.listenerEvent){let o=i.parts[0];e.addEventListener(i.listenerEvent,(function(e){handleNotification(e,t,i.target,o.source,o.negate)}))}}function createMethodEffect(e,t,i,o,n,s){s=t.static||s&&("object"!=typeof s||s[t.methodName]);let r={methodName:t.methodName,args:t.args,methodInfo:n,dynamicFn:s};for(let n,s=0;s<t.args.length&&(n=t.args[s]);s++)n.literal||e._addPropertyEffect(n.rootProperty,i,{fn:o,info:r,trigger:n});return s&&e._addPropertyEffect(t.methodName,i,{fn:o,info:r}),r}function runMethodEffect(e,t,i,o,n){let s=e._methodHost||e,r=s[n.methodName];if(r){let o=e._marshalArgs(n.args,t,i);return o===NOOP?NOOP:r.apply(s,o)}n.dynamicFn||console.warn("method `"+n.methodName+"` not defined")}const emptyArray=[],IDENT="(?:[a-zA-Z_$][\\w.:$\\-*]*)",NUMBER="(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",SQUOTE_STRING="(?:'(?:[^'\\\\]|\\\\.)*')",DQUOTE_STRING='(?:"(?:[^"\\\\]|\\\\.)*")',STRING="(?:"+SQUOTE_STRING+"|"+DQUOTE_STRING+")",ARGUMENT="(?:("+IDENT+"|"+NUMBER+"|"+STRING+")\\s*)",ARGUMENTS="(?:"+ARGUMENT+"(?:,\\s*"+ARGUMENT+")*)",ARGUMENT_LIST="(?:\\(\\s*(?:"+ARGUMENTS+"?)\\)\\s*)",BINDING="("+IDENT+"\\s*"+ARGUMENT_LIST+"?)",OPEN_BRACKET="(\\[\\[|{{)\\s*",CLOSE_BRACKET="(?:]]|}})",NEGATE="(?:(!)\\s*)?",EXPRESSION=OPEN_BRACKET+NEGATE+BINDING+CLOSE_BRACKET,bindingRegex=new RegExp(EXPRESSION,"g");function literalFromParts(e){let t="";for(let i=0;i<e.length;i++){t+=e[i].literal||""}return t}function parseMethod(e){let t=e.match(/([^\s]+?)\(([\s\S]*)\)/);if(t){let e={methodName:t[1],static:!0,args:emptyArray};if(t[2].trim()){return parseArgs(t[2].replace(/\\,/g,"&comma;").split(","),e)}return e}return null}function parseArgs(e,t){return t.args=e.map((function(e){let i=parseArg(e);return i.literal||(t.static=!1),i}),this),t}function parseArg(e){let t=e.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),i={name:t,value:"",literal:!1},o=t[0];switch("-"===o&&(o=t[1]),o>="0"&&o<="9"&&(o="#"),o){case"'":case'"':i.value=t.slice(1,-1),i.literal=!0;break;case"#":i.value=Number(t),i.literal=!0}return i.literal||(i.rootProperty=root(t),i.structured=isPath(t),i.structured&&(i.wildcard=".*"==t.slice(-2),i.wildcard&&(i.name=t.slice(0,-2)))),i}function getArgValue(e,t,i){let o=get$1(e,i);return void 0===o&&(o=t[i]),o}function notifySplices(e,t,i,o){const n={indexSplices:o};legacyUndefined&&!e._overrideLegacyUndefined&&(t.splices=n),e.notifyPath(i+".splices",n),e.notifyPath(i+".length",t.length),legacyUndefined&&!e._overrideLegacyUndefined&&(n.indexSplices=[])}function notifySplice(e,t,i,o,n,s){notifySplices(e,t,i,[{index:o,addedCount:n,removed:s,object:t,type:"splice"}])}function upper(e){return e[0].toUpperCase()+e.substring(1)}const PropertyEffects=dedupingMixin((e=>{const t=TemplateStamp(PropertyAccessors(e));return class extends t{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__computeInfo,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return TYPES}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_registerHost(){if(hostStack.length){let e=hostStack[hostStack.length-1];e._enqueueClient(this),this.__dataHost=e}}_initializeProtoProperties(e){this.__data=Object.create(e),this.__dataPending=Object.create(e),this.__dataOld={}}_initializeInstanceProperties(e){let t=this[TYPES.READ_ONLY];for(let i in e)t&&t[i]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[i]=this.__dataPending[i]=e[i])}_addPropertyEffect(e,t,i){this._createPropertyAccessor(e,t==TYPES.READ_ONLY);let o=ensureOwnEffectMap(this,t,!0)[e];o||(o=this[t][e]=[]),o.push(i)}_removePropertyEffect(e,t,i){let o=ensureOwnEffectMap(this,t,!0)[e],n=o.indexOf(i);n>=0&&o.splice(n,1)}_hasPropertyEffect(e,t){let i=this[t];return Boolean(i&&i[e])}_hasReadOnlyEffect(e){return this._hasPropertyEffect(e,TYPES.READ_ONLY)}_hasNotifyEffect(e){return this._hasPropertyEffect(e,TYPES.NOTIFY)}_hasReflectEffect(e){return this._hasPropertyEffect(e,TYPES.REFLECT)}_hasComputedEffect(e){return this._hasPropertyEffect(e,TYPES.COMPUTE)}_setPendingPropertyOrPath(e,t,i,o){if(o||root(Array.isArray(e)?e[0]:e)!==e){if(!o){let i=get$1(this,e);if(!(e=set(this,e,t))||!super._shouldPropertyChange(e,t,i))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(e,t,i))return computeLinkedPaths(this,e,t),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[e])return this._setPendingProperty(e,t,i);this[e]=t}return!1}_setUnmanagedPropertyToNode(e,t,i){i===e[t]&&"object"!=typeof i||("className"===t&&(e=wrap$1(e)),e[t]=i)}_setPendingProperty(e,t,i){let o=this.__dataHasPaths&&isPath(e),n=o?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(e,t,n[e])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),e in this.__dataOld||(this.__dataOld[e]=this.__data[e]),o?this.__dataTemp[e]=t:this.__data[e]=t,this.__dataPending[e]=t,(o||this[TYPES.NOTIFY]&&this[TYPES.NOTIFY][e])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[e]=i),!0)}_setProperty(e,t){this._setPendingProperty(e,t,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(e){this.__dataPendingClients=this.__dataPendingClients||[],e!==this&&this.__dataPendingClients.push(e)}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let e=this.__dataPendingClients;if(e){this.__dataPendingClients=null;for(let t=0;t<e.length;t++){let i=e[t];i.__dataEnabled?i.__dataPending&&i._flushProperties():i._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(e,t){for(let i in e)!t&&this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][i]||this._setPendingPropertyOrPath(i,e[i],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(e,t,i){let o,n=this.__dataHasPaths;this.__dataHasPaths=!1,runComputedEffects(this,t,i,n),o=this.__dataToNotify,this.__dataToNotify=null,this._propagatePropertyChanges(t,i,n),this._flushClients(),runEffects(this,this[TYPES.REFLECT],t,i,n),runEffects(this,this[TYPES.OBSERVE],t,i,n),o&&runNotifyEffects(this,o,t,i,n),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(e,t,i){this[TYPES.PROPAGATE]&&runEffects(this,this[TYPES.PROPAGATE],e,t,i),this.__templateInfo&&this._runEffectsForTemplate(this.__templateInfo,e,t,i)}_runEffectsForTemplate(e,t,i,o){const n=(t,o)=>{runEffects(this,e.propertyEffects,t,i,o,e.nodeList);for(let n=e.firstChild;n;n=n.nextSibling)this._runEffectsForTemplate(n,t,i,o)};e.runEffects?e.runEffects(n,t,o):n(t,o)}linkPaths(e,t){e=normalize(e),t=normalize(t),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[e]=t}unlinkPaths(e){e=normalize(e),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[e]}notifySplices(e,t){let i={path:""};notifySplices(this,get$1(this,e,i),i.path,t)}get(e,t){return get$1(t||this,e)}set(e,t,i){i?set(i,e,t):this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][e]||this._setPendingPropertyOrPath(e,t,!0)&&this._invalidateProperties()}push(e,...t){let i={path:""},o=get$1(this,e,i),n=o.length,s=o.push(...t);return t.length&&notifySplice(this,o,i.path,n,t.length,[]),s}pop(e){let t={path:""},i=get$1(this,e,t),o=Boolean(i.length),n=i.pop();return o&&notifySplice(this,i,t.path,i.length,0,[n]),n}splice(e,t,i,...o){let n,s={path:""},r=get$1(this,e,s);return t<0?t=r.length-Math.floor(-t):t&&(t=Math.floor(t)),n=2===arguments.length?r.splice(t):r.splice(t,i,...o),(o.length||n.length)&&notifySplice(this,r,s.path,t,o.length,n),n}shift(e){let t={path:""},i=get$1(this,e,t),o=Boolean(i.length),n=i.shift();return o&&notifySplice(this,i,t.path,0,0,[n]),n}unshift(e,...t){let i={path:""},o=get$1(this,e,i),n=o.unshift(...t);return t.length&&notifySplice(this,o,i.path,0,t.length,[]),n}notifyPath(e,t){let i;if(1==arguments.length){let o={path:""};t=get$1(this,e,o),i=o.path}else i=Array.isArray(e)?normalize(e):e;this._setPendingPropertyOrPath(i,t,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(e,t){this._addPropertyEffect(e,TYPES.READ_ONLY),t&&(this["_set"+upper(e)]=function(t){this._setProperty(e,t)})}_createPropertyObserver(e,t,i){let o={property:e,method:t,dynamicFn:Boolean(i)};this._addPropertyEffect(e,TYPES.OBSERVE,{fn:runObserverEffect,info:o,trigger:{name:e}}),i&&this._addPropertyEffect(t,TYPES.OBSERVE,{fn:runObserverEffect,info:o,trigger:{name:t}})}_createMethodObserver(e,t){let i=parseMethod(e);if(!i)throw new Error("Malformed observer expression '"+e+"'");createMethodEffect(this,i,TYPES.OBSERVE,runMethodEffect,null,t)}_createNotifyingProperty(e){this._addPropertyEffect(e,TYPES.NOTIFY,{fn:runNotifyEffect,info:{eventName:camelToDashCase(e)+"-changed",property:e}})}_createReflectedProperty(e){let t=this.constructor.attributeNameForProperty(e);"-"===t[0]?console.warn("Property "+e+" cannot be reflected to attribute "+t+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(e,TYPES.REFLECT,{fn:runReflectEffect,info:{attrName:t}})}_createComputedProperty(e,t,i){let o=parseMethod(t);if(!o)throw new Error("Malformed computed expression '"+t+"'");const n=createMethodEffect(this,o,TYPES.COMPUTE,runComputedEffect,e,i);ensureOwnEffectMap(this,COMPUTE_INFO)[e]=n}_marshalArgs(e,t,i){const o=this.__data,n=[];for(let s=0,r=e.length;s<r;s++){let{name:r,structured:a,wildcard:l,value:c,literal:d}=e[s];if(!d)if(l){const e=isDescendant(r,t),n=getArgValue(o,i,e?t:r);c={path:e?t:r,value:n,base:e?get$1(o,r):n}}else c=a?getArgValue(o,i,r):o[r];if(legacyUndefined&&!this._overrideLegacyUndefined&&void 0===c&&e.length>1)return NOOP;n[s]=c}return n}static addPropertyEffect(e,t,i){this.prototype._addPropertyEffect(e,t,i)}static createPropertyObserver(e,t,i){this.prototype._createPropertyObserver(e,t,i)}static createMethodObserver(e,t){this.prototype._createMethodObserver(e,t)}static createNotifyingProperty(e){this.prototype._createNotifyingProperty(e)}static createReadOnlyProperty(e,t){this.prototype._createReadOnlyProperty(e,t)}static createReflectedProperty(e){this.prototype._createReflectedProperty(e)}static createComputedProperty(e,t,i){this.prototype._createComputedProperty(e,t,i)}static bindTemplate(e){return this.prototype._bindTemplate(e)}_bindTemplate(e,t){let i=this.constructor._parseTemplate(e),o=this.__preBoundTemplateInfo==i;if(!o)for(let e in i.propertyEffects)this._createPropertyAccessor(e);if(t)if(i=Object.create(i),i.wasPreBound=o,this.__templateInfo){const t=e._parentTemplateInfo||this.__templateInfo,o=t.lastChild;i.parent=t,t.lastChild=i,i.previousSibling=o,o?o.nextSibling=i:t.firstChild=i}else this.__templateInfo=i;else this.__preBoundTemplateInfo=i;return i}static _addTemplatePropertyEffect(e,t,i){(e.hostProps=e.hostProps||{})[t]=!0;let o=e.propertyEffects=e.propertyEffects||{};(o[t]=o[t]||[]).push(i)}_stampTemplate(e,t){t=t||this._bindTemplate(e,!0),hostStack.push(this);let i=super._stampTemplate(e,t);if(hostStack.pop(),t.nodeList=i.nodeList,!t.wasPreBound){let e=t.childNodes=[];for(let t=i.firstChild;t;t=t.nextSibling)e.push(t)}return i.templateInfo=t,setupBindings(this,t),this.__dataClientsReady&&(this._runEffectsForTemplate(t,this.__data,null,!1),this._flushClients()),i}_removeBoundDom(e){const t=e.templateInfo,{previousSibling:i,nextSibling:o,parent:n}=t;i?i.nextSibling=o:n&&(n.firstChild=o),o?o.previousSibling=i:n&&(n.lastChild=i),t.nextSibling=t.previousSibling=null;let s=t.childNodes;for(let e=0;e<s.length;e++){let t=s[e];wrap$1(wrap$1(t).parentNode).removeChild(t)}}static _parseTemplateNode(e,i,o){let n=t._parseTemplateNode.call(this,e,i,o);if(e.nodeType===Node.TEXT_NODE){let t=this._parseBindings(e.textContent,i);t&&(e.textContent=literalFromParts(t)||" ",addBinding(this,i,o,"text","textContent",t),n=!0)}return n}static _parseTemplateNodeAttribute(e,i,o,n,s){let r=this._parseBindings(s,i);if(r){let t=n,s="property";capitalAttributeRegex.test(n)?s="attribute":"$"==n[n.length-1]&&(n=n.slice(0,-1),s="attribute");let a=literalFromParts(r);return a&&"attribute"==s&&("class"==n&&e.hasAttribute("class")&&(a+=" "+e.getAttribute(n)),e.setAttribute(n,a)),"attribute"==s&&"disable-upgrade$"==t&&e.setAttribute(n,""),"input"===e.localName&&"value"===t&&e.setAttribute(t,""),e.removeAttribute(t),"property"===s&&(n=dashToCamelCase(n)),addBinding(this,i,o,s,n,r,a),!0}return t._parseTemplateNodeAttribute.call(this,e,i,o,n,s)}static _parseTemplateNestedTemplate(e,i,o){let n=t._parseTemplateNestedTemplate.call(this,e,i,o);const s=e.parentNode,r=o.templateInfo,a="dom-if"===s.localName,l="dom-repeat"===s.localName;removeNestedTemplates&&(a||l)&&(s.removeChild(e),(o=o.parentInfo).templateInfo=r,o.noted=!0,n=!1);let c=r.hostProps;if(fastDomIf&&a)c&&(i.hostProps=Object.assign(i.hostProps||{},c),removeNestedTemplates||(o.parentInfo.noted=!0));else{let e="{";for(let t in c){addBinding(this,i,o,"property","_host_"+t,[{mode:e,source:t,dependencies:[t],hostProp:!0}])}}return n}static _parseBindings(e,t){let i,o=[],n=0;for(;null!==(i=bindingRegex.exec(e));){i.index>n&&o.push({literal:e.slice(n,i.index)});let s=i[1][0],r=Boolean(i[2]),a=i[3].trim(),l=!1,c="",d=-1;"{"==s&&(d=a.indexOf("::"))>0&&(c=a.substring(d+2),a=a.substring(0,d),l=!0);let g=parseMethod(a),I=[];if(g){let{args:e,methodName:i}=g;for(let t=0;t<e.length;t++){let i=e[t];i.literal||I.push(i)}let o=t.dynamicFns;(o&&o[i]||g.static)&&(I.push(i),g.dynamicFn=!0)}else I.push(a);o.push({source:a,mode:s,negate:r,customEvent:l,signature:g,dependencies:I,event:c}),n=bindingRegex.lastIndex}if(n&&n<e.length){let t=e.substring(n);t&&o.push({literal:t})}return o.length?o:null}static _evaluateBinding(e,t,i,o,n,s){let r;return r=t.signature?runMethodEffect(e,i,o,n,t.signature):i!=t.source?get$1(e,t.source):s&&isPath(i)?get$1(e,i):e.__data[i],t.negate&&(r=!r),r}}})),hostStack=[];
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function register$1(e){}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function normalizeProperties(e){const t={};for(let i in e){const o=e[i];t[i]="function"==typeof o?{type:o}:o}return t}const PropertiesMixin=dedupingMixin((e=>{const t=PropertiesChanged(e);function i(e){const t=Object.getPrototypeOf(e);return t.prototype instanceof n?t:null}function o(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",e))){let t=null;if(e.hasOwnProperty(JSCompiler_renameProperty("properties",e))){const i=e.properties;i&&(t=normalizeProperties(i))}e.__ownProperties=t}return e.__ownProperties}class n extends t{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){register$1(this.prototype);const e=this._properties;this.__observedAttributes=e?Object.keys(e).map((e=>this.prototype._addPropertyToAttributeMap(e))):[]}return this.__observedAttributes}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const e=i(this);e&&e.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const e=o(this);e&&this.createProperties(e)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const e=i(this);this.__properties=Object.assign({},e&&e._properties,o(this))}return this.__properties}static typeForProperty(e){const t=this._properties[e];return t&&t.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return n})),version="3.5.1",builtCSS=window.ShadyCSS&&window.ShadyCSS.cssBuild,ElementMixin$1=dedupingMixin((e=>{const t=PropertiesMixin(PropertyEffects(e));function i(e,t,i,o){i.computed&&(i.readOnly=!0),i.computed&&(e._hasReadOnlyEffect(t)?console.warn(`Cannot redefine computed property '${t}'.`):e._createComputedProperty(t,i.computed,o)),i.readOnly&&!e._hasReadOnlyEffect(t)?e._createReadOnlyProperty(t,!i.computed):!1===i.readOnly&&e._hasReadOnlyEffect(t)&&console.warn(`Cannot make readOnly property '${t}' non-readOnly.`),i.reflectToAttribute&&!e._hasReflectEffect(t)?e._createReflectedProperty(t):!1===i.reflectToAttribute&&e._hasReflectEffect(t)&&console.warn(`Cannot make reflected property '${t}' non-reflected.`),i.notify&&!e._hasNotifyEffect(t)?e._createNotifyingProperty(t):!1===i.notify&&e._hasNotifyEffect(t)&&console.warn(`Cannot make notify property '${t}' non-notify.`),i.observer&&e._createPropertyObserver(t,i.observer,o[i.observer]),e._addPropertyToAttributeMap(t)}return class extends t{static get polymerElementVersion(){return version}static _finalizeClass(){t._finalizeClass.call(this);const e=((i=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",i))||(i.__ownObservers=i.hasOwnProperty(JSCompiler_renameProperty("observers",i))?i.observers:null),i.__ownObservers);var i;e&&this.createObservers(e,this._properties),this._prepareTemplate()}static _prepareTemplate(){let e=this.template;e&&("string"==typeof e?(console.error("template getter must return HTMLTemplateElement"),e=null):legacyOptimizations||(e=e.cloneNode(!0))),this.prototype._template=e}static createProperties(e){for(let t in e)i(this.prototype,t,e[t],e)}static createObservers(e,t){const i=this.prototype;for(let o=0;o<e.length;o++)i._createMethodObserver(e[o],t)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let e=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof e&&(e=e()),this._template=void 0!==e?e:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(e){let t=null;if(e&&(!strictTemplatePolicy||allowTemplateFromDomModule)&&(t=DomModule.import(e,"template"),strictTemplatePolicy&&!t))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${e}`);return t}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(e){this._template=e}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const e=this.importMeta;if(e)this._importPath=pathFromUrl(e.url);else{const e=DomModule.import(this.is);this._importPath=e&&e.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=rootPath,this.importPath=this.constructor.importPath;let e=function(e){if(!e.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",e))){e.__propertyDefaults=null;let t=e._properties;for(let i in t){let o=t[i];"value"in o&&(e.__propertyDefaults=e.__propertyDefaults||{},e.__propertyDefaults[i]=o)}}return e.__propertyDefaults}(this.constructor);if(e)for(let t in e){let i=e[t];if(this._canApplyPropertyDefault(t)){let e="function"==typeof i.value?i.value.call(this):i.value;this._hasAccessor(t)?this._setPendingProperty(t,e,!0):this[t]=e}}}_canApplyPropertyDefault(e){return!this.hasOwnProperty(e)}static _processStyleText(e,t){return resolveCss(e,t)}static _finalizeTemplate(e){const t=this.prototype._template;if(t&&!t.__polymerFinalized){t.__polymerFinalized=!0;const i=this.importPath;!function(e,t,i,o){if(!builtCSS){const n=t.content.querySelectorAll("style"),s=stylesFromTemplate(t),r=stylesFromModuleImports(i),a=t.content.firstElementChild;for(let i=0;i<r.length;i++){let n=r[i];n.textContent=e._processStyleText(n.textContent,o),t.content.insertBefore(n,a)}let l=0;for(let t=0;t<s.length;t++){let i=s[t],r=n[l];r!==i?(i=i.cloneNode(!0),r.parentNode.insertBefore(i,r)):l++,i.textContent=e._processStyleText(i.textContent,o)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(t,i),useAdoptedStyleSheetsWithBuiltCSS&&builtCSS&&supportsAdoptingStyleSheets$1){const i=t.content.querySelectorAll("style");if(i){let t="";Array.from(i).forEach((e=>{t+=e.textContent,e.parentNode.removeChild(e)})),e._styleSheet=new CSSStyleSheet,e._styleSheet.replaceSync(t)}}}(this,t,e,i?resolveUrl(i):""),this.prototype._bindTemplate(t)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(e){const t=wrap$1(this);if(t.attachShadow)return e?(t.shadowRoot||(t.attachShadow({mode:"open",shadyUpgradeFragment:e}),t.shadowRoot.appendChild(e),this.constructor._styleSheet&&(t.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),syncInitialRender&&window.ShadyDOM&&window.ShadyDOM.flushInitial(t.shadowRoot),t.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(e){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,e)}resolveUrl(e,t){return!t&&this.importPath&&(t=resolveUrl(this.importPath)),resolveUrl(e,t)}static _parseTemplateContent(e,i,o){return i.dynamicFns=i.dynamicFns||this._properties,t._parseTemplateContent.call(this,e,i,o)}static _addTemplatePropertyEffect(e,i,o){return!legacyWarnings||i in this._properties||o.info.part.signature&&o.info.part.signature.static||o.info.part.hostProp||e.nestedTemplate||console.warn(`Property '${i}' used in template but not declared in 'properties'; attribute will not be observed.`),t._addTemplatePropertyEffect.call(this,e,i,o)}}})),policy=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:e=>e});
/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */class LiteralString{constructor(e,t){assertValidTemplateStringParameters(e,t);const i=t.reduce(((t,i,o)=>t+literalValue(i)+e[o+1]),e[0]);this.value=i.toString()}toString(){return this.value}}function literalValue(e){if(e instanceof LiteralString)return e.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${e}`)}function htmlValue(e){if(e instanceof HTMLTemplateElement)return e.innerHTML;if(e instanceof LiteralString)return literalValue(e);throw new Error(`non-template value passed to Polymer's html function: ${e}`)}const html=function(e,...t){assertValidTemplateStringParameters(e,t);const i=document.createElement("template");let o=t.reduce(((t,i,o)=>t+htmlValue(i)+e[o+1]),e[0]);return policy&&(o=policy.createHTML(o)),i.innerHTML=o,i},assertValidTemplateStringParameters=(e,t)=>{if(!Array.isArray(e)||!Array.isArray(e.raw)||t.length!==e.length-1)throw new TypeError("Invalid call to the html template tag")},PolymerElement=ElementMixin$1(HTMLElement),DisabledMixin=dedupingMixin((e=>class extends e{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(e){this._setAriaDisabled(e)}_setAriaDisabled(e){e?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}}));
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let microtaskCurrHandle=0,microtaskLastHandle=0;const microtaskCallbacks=[];let microtaskNodeContent=0,microtaskScheduled=!1;const microtaskNode=document.createTextNode("");function microtaskFlush(){microtaskScheduled=!1;const e=microtaskCallbacks.length;for(let t=0;t<e;t++){const e=microtaskCallbacks[t];if(e)try{e()}catch(e){setTimeout((()=>{throw e}))}}microtaskCallbacks.splice(0,e),microtaskLastHandle+=e}new window.MutationObserver(microtaskFlush).observe(microtaskNode,{characterData:!0});const timeOut={after:e=>({run:t=>window.setTimeout(t,e),cancel(e){window.clearTimeout(e)}}),run:(e,t)=>window.setTimeout(e,t),cancel(e){window.clearTimeout(e)}},animationFrame={run:e=>window.requestAnimationFrame(e),cancel(e){window.cancelAnimationFrame(e)}},idlePeriod={run:e=>window.requestIdleCallback?window.requestIdleCallback(e):window.setTimeout(e,16),cancel(e){window.cancelIdleCallback?window.cancelIdleCallback(e):window.clearTimeout(e)}},microTask={run(e){microtaskScheduled||(microtaskScheduled=!0,microtaskNode.textContent=microtaskNodeContent,microtaskNodeContent+=1),microtaskCallbacks.push(e);const t=microtaskCurrHandle;return microtaskCurrHandle+=1,t},cancel(e){const t=e-microtaskLastHandle;if(t>=0){if(!microtaskCallbacks[t])throw new Error(`invalid async handle: ${e}`);microtaskCallbacks[t]=null}}},passiveTouchGestures=!1,wrap=e=>e,HAS_NATIVE_TA="string"==typeof document.head.style.touchAction,GESTURE_KEY="__polymerGestures",HANDLED_OBJ="__polymerGesturesHandled",TOUCH_ACTION="__polymerGesturesTouchAction",TAP_DISTANCE=25,TRACK_DISTANCE=5,TRACK_LENGTH=2,MOUSE_EVENTS=["mousedown","mousemove","mouseup","click"],MOUSE_WHICH_TO_BUTTONS=[0,1,4,2],MOUSE_HAS_BUTTONS=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(e){return!1}}();function isMouseEvent(e){return MOUSE_EVENTS.indexOf(e)>-1}let supportsPassive=!1;function PASSIVE_TOUCH(e){if(!isMouseEvent(e)&&"touchend"!==e)return HAS_NATIVE_TA&&supportsPassive&&passiveTouchGestures?{passive:!0}:void 0}!function(){try{const e=Object.defineProperty({},"passive",{get(){supportsPassive=!0}});window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(e){}}();const IS_TOUCH_ONLY=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),canBeDisabled={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function hasLeftMouseButton(e){const t=e.type;if(!isMouseEvent(t))return!1;if("mousemove"===t){let t=void 0===e.buttons?1:e.buttons;return e instanceof window.MouseEvent&&!MOUSE_HAS_BUTTONS&&(t=MOUSE_WHICH_TO_BUTTONS[e.which]||0),Boolean(1&t)}return 0===(void 0===e.button?0:e.button)}function isSyntheticClick(e){if("click"===e.type){if(0===e.detail)return!0;const t=_findOriginalTarget(e);if(!t.nodeType||t.nodeType!==Node.ELEMENT_NODE)return!0;const i=t.getBoundingClientRect(),o=e.pageX,n=e.pageY;return!(o>=i.left&&o<=i.right&&n>=i.top&&n<=i.bottom)}return!1}const POINTERSTATE={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function firstTouchAction(e){let t="auto";const i=getComposedPath(e);for(let e,o=0;o<i.length;o++)if(e=i[o],e[TOUCH_ACTION]){t=e[TOUCH_ACTION];break}return t}function trackDocument(e,t,i){e.movefn=t,e.upfn=i,document.addEventListener("mousemove",t),document.addEventListener("mouseup",i)}function untrackDocument(e){document.removeEventListener("mousemove",e.movefn),document.removeEventListener("mouseup",e.upfn),e.movefn=null,e.upfn=null}const getComposedPath=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:e=>e.composedPath&&e.composedPath()||[],gestures={},recognizers=[];function deepTargetFind(e,t){let i=document.elementFromPoint(e,t),o=i;for(;o&&o.shadowRoot&&!window.ShadyDOM;){const n=o;if(o=o.shadowRoot.elementFromPoint(e,t),n===o)break;o&&(i=o)}return i}function _findOriginalTarget(e){const t=getComposedPath(e);return t.length>0?t[0]:e.target}function _handleNative(e){const t=e.type,i=e.currentTarget[GESTURE_KEY];if(!i)return;const o=i[t];if(!o)return;if(!e[HANDLED_OBJ]&&(e[HANDLED_OBJ]={},t.startsWith("touch"))){const i=e.changedTouches[0];if("touchstart"===t&&1===e.touches.length&&(POINTERSTATE.touch.id=i.identifier),POINTERSTATE.touch.id!==i.identifier)return;HAS_NATIVE_TA||"touchstart"!==t&&"touchmove"!==t||_handleTouchAction(e)}const n=e[HANDLED_OBJ];if(!n.skip){for(let t,i=0;i<recognizers.length;i++)t=recognizers[i],o[t.name]&&!n[t.name]&&t.flow&&t.flow.start.indexOf(e.type)>-1&&t.reset&&t.reset();for(let i,s=0;s<recognizers.length;s++)i=recognizers[s],o[i.name]&&!n[i.name]&&(n[i.name]=!0,i[t](e))}}function _handleTouchAction(e){const t=e.changedTouches[0],i=e.type;if("touchstart"===i)POINTERSTATE.touch.x=t.clientX,POINTERSTATE.touch.y=t.clientY,POINTERSTATE.touch.scrollDecided=!1;else if("touchmove"===i){if(POINTERSTATE.touch.scrollDecided)return;POINTERSTATE.touch.scrollDecided=!0;const i=firstTouchAction(e);let o=!1;const n=Math.abs(POINTERSTATE.touch.x-t.clientX),s=Math.abs(POINTERSTATE.touch.y-t.clientY);e.cancelable&&("none"===i?o=!0:"pan-x"===i?o=s>n:"pan-y"===i&&(o=n>s)),o?e.preventDefault():prevent("track")}}function addListener(e,t,i){return!!gestures[t]&&(_add(e,t,i),!0)}function _add(e,t,i){const o=gestures[t],n=o.deps,s=o.name;let r=e[GESTURE_KEY];r||(e[GESTURE_KEY]=r={});for(let t,i,o=0;o<n.length;o++)t=n[o],IS_TOUCH_ONLY&&isMouseEvent(t)&&"click"!==t||(i=r[t],i||(r[t]=i={_count:0}),0===i._count&&e.addEventListener(t,_handleNative,PASSIVE_TOUCH(t)),i[s]=(i[s]||0)+1,i._count=(i._count||0)+1);e.addEventListener(t,i),o.touchAction&&setTouchAction(e,o.touchAction)}function register(e){recognizers.push(e);for(let t=0;t<e.emits.length;t++)gestures[e.emits[t]]=e}function _findRecognizerByEvent(e){for(let t,i=0;i<recognizers.length;i++){t=recognizers[i];for(let i,o=0;o<t.emits.length;o++)if(i=t.emits[o],i===e)return t}return null}function setTouchAction(e,t){HAS_NATIVE_TA&&e instanceof HTMLElement&&microTask.run((()=>{e.style.touchAction=t})),e[TOUCH_ACTION]=t}function _fire(e,t,i){const o=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(o.detail=i,wrap(e).dispatchEvent(o),o.defaultPrevented){const e=i.preventer||i.sourceEvent;e&&e.preventDefault&&e.preventDefault()}}function prevent(e){const t=_findRecognizerByEvent(e);t.info&&(t.info.prevent=!0)}function downupFire(e,t,i,o){t&&_fire(t,e,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:o,prevent:e=>prevent(e)})}function trackHasMovedEnough(e,t,i){if(e.prevent)return!1;if(e.started)return!0;const o=Math.abs(e.x-t),n=Math.abs(e.y-i);return o>=TRACK_DISTANCE||n>=TRACK_DISTANCE}function trackFire(e,t,i){if(!t)return;const o=e.moves[e.moves.length-2],n=e.moves[e.moves.length-1],s=n.x-e.x,r=n.y-e.y;let a,l=0;o&&(a=n.x-o.x,l=n.y-o.y),_fire(t,"track",{state:e.state,x:i.clientX,y:i.clientY,dx:s,dy:r,ddx:a,ddy:l,sourceEvent:i,hover:()=>deepTargetFind(i.clientX,i.clientY)})}function trackForward(e,t,i){const o=Math.abs(t.clientX-e.x),n=Math.abs(t.clientY-e.y),s=_findOriginalTarget(i||t);!s||canBeDisabled[s.localName]&&s.hasAttribute("disabled")||(isNaN(o)||isNaN(n)||o<=TAP_DISTANCE&&n<=TAP_DISTANCE||isSyntheticClick(t))&&(e.prevent||_fire(s,"tap",{x:t.clientX,y:t.clientY,sourceEvent:t,preventer:i}))}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */register({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){untrackDocument(this.info)},mousedown(e){if(!hasLeftMouseButton(e))return;const t=_findOriginalTarget(e),i=this;trackDocument(this.info,(e=>{hasLeftMouseButton(e)||(downupFire("up",t,e),untrackDocument(i.info))}),(e=>{hasLeftMouseButton(e)&&downupFire("up",t,e),untrackDocument(i.info)})),downupFire("down",t,e)},touchstart(e){downupFire("down",_findOriginalTarget(e),e.changedTouches[0],e)},touchend(e){downupFire("up",_findOriginalTarget(e),e.changedTouches[0],e)}}),register({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(e){this.moves.length>TRACK_LENGTH&&this.moves.shift(),this.moves.push(e)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,untrackDocument(this.info)},mousedown(e){if(!hasLeftMouseButton(e))return;const t=_findOriginalTarget(e),i=this,o=e=>{const o=e.clientX,n=e.clientY;trackHasMovedEnough(i.info,o,n)&&(i.info.state=i.info.started?"mouseup"===e.type?"end":"track":"start","start"===i.info.state&&prevent("tap"),i.info.addMove({x:o,y:n}),hasLeftMouseButton(e)||(i.info.state="end",untrackDocument(i.info)),t&&trackFire(i.info,t,e),i.info.started=!0)};trackDocument(this.info,o,(e=>{i.info.started&&o(e),untrackDocument(i.info)})),this.info.x=e.clientX,this.info.y=e.clientY},touchstart(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchmove(e){const t=_findOriginalTarget(e),i=e.changedTouches[0],o=i.clientX,n=i.clientY;trackHasMovedEnough(this.info,o,n)&&("start"===this.info.state&&prevent("tap"),this.info.addMove({x:o,y:n}),trackFire(this.info,t,i),this.info.state="track",this.info.started=!0)},touchend(e){const t=_findOriginalTarget(e),i=e.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),trackFire(this.info,t,i))}}),register({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(e){hasLeftMouseButton(e)&&(this.info.x=e.clientX,this.info.y=e.clientY)},click(e){hasLeftMouseButton(e)&&trackForward(this.info,e)},touchstart(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchend(e){trackForward(this.info,e.changedTouches[0],e)}});const KeyboardMixin=dedupingMixin((e=>class extends e{ready(){super.ready(),this.addEventListener("keydown",(e=>{this._onKeyDown(e)})),this.addEventListener("keyup",(e=>{this._onKeyUp(e)}))}_onKeyDown(e){switch(e.key){case"Enter":this._onEnter(e);break;case"Escape":this._onEscape(e)}}_onKeyUp(e){}_onEnter(e){}_onEscape(e){}})),ActiveMixin=e=>class extends(DisabledMixin(KeyboardMixin(e))){get _activeKeys(){return[" "]}ready(){super.ready(),addListener(this,"down",(e=>{this._shouldSetActive(e)&&this._setActive(!0)})),addListener(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(e){return!this.disabled}_onKeyDown(e){super._onKeyDown(e),this._shouldSetActive(e)&&this._activeKeys.includes(e.key)&&(this._setActive(!0),document.addEventListener("keyup",(e=>{this._activeKeys.includes(e.key)&&this._setActive(!1)}),{once:!0}))}_setActive(e){this.toggleAttribute("active",e)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ControllerMixin=dedupingMixin((e=>class extends e{constructor(){super(),this.__controllers=new Set}connectedCallback(){super.connectedCallback(),this.__controllers.forEach((e=>{e.hostConnected&&e.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.__controllers.forEach((e=>{e.hostDisconnected&&e.hostDisconnected()}))}addController(e){this.__controllers.add(e),void 0!==this.$&&this.isConnected&&e.hostConnected&&e.hostConnected()}removeController(e){this.__controllers.delete(e)}})),DEV_MODE_CODE_REGEXP=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,FlowClients=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function isMinified(){return uncommentAndRun((function(){return!0}))}function isDevelopmentMode(){try{return!!isForcedDevelopmentMode()||!!isLocalhost()&&(FlowClients?!isFlowProductionMode():!isMinified())}catch(e){return!1}}function isForcedDevelopmentMode(){return localStorage.getItem("vaadin.developmentmode.force")}function isLocalhost(){return["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0}function isFlowProductionMode(){if(FlowClients){if(Object.keys(FlowClients).map((e=>FlowClients[e])).filter((e=>e.productionMode)).length>0)return!0}return!1}function uncommentAndRun(e,t){if("function"!=typeof e)return;const i=DEV_MODE_CODE_REGEXP.exec(e.toString());if(i)try{e=new Function(i[1])}catch(e){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",e)}return e(t)}window.Vaadin=window.Vaadin||{};const runIfDevelopmentMode=function(e,t){if(window.Vaadin.developmentMode)return uncommentAndRun(e,t)};function maybeGatherAndSendStats(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=isDevelopmentMode());const usageStatistics=function(){if("function"==typeof runIfDevelopmentMode)return runIfDevelopmentMode(maybeGatherAndSendStats)};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/class Debouncer{static debounce(e,t,i){return e instanceof Debouncer?e._cancelAsync():e=new Debouncer,e.setConfig(t,i),e}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(e,t){this._asyncModule=e,this._callback=t,this._timer=this._asyncModule.run((()=>{this._timer=null,debouncerQueue.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),debouncerQueue.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}let debouncerQueue=new Set;function enqueueDebouncer(e){debouncerQueue.add(e)}function flushDebouncers(){const e=Boolean(debouncerQueue.size);return debouncerQueue.forEach((e=>{try{e.flush()}catch(e){setTimeout((()=>{throw e}))}})),e}const flush=()=>{let e;do{e=flushDebouncers()}while(e)};
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class DirHelper{static detectScrollType(){const e=document.createElement("div");e.textContent="ABCD",e.dir="rtl",e.style.fontSize="14px",e.style.width="4px",e.style.height="1px",e.style.position="absolute",e.style.top="-1000px",e.style.overflow="scroll",document.body.appendChild(e);let t="reverse";return e.scrollLeft>0?t="default":(e.scrollLeft=2,e.scrollLeft<2&&(t="negative")),document.body.removeChild(e),t}static getNormalizedScrollLeft(e,t,i){const{scrollLeft:o}=i;if("rtl"!==t||!e)return o;switch(e){case"negative":return i.scrollWidth-i.clientWidth+o;case"reverse":return i.scrollWidth-i.clientWidth-o;default:return o}}static setNormalizedScrollLeft(e,t,i,o){if("rtl"===t&&e)switch(e){case"negative":i.scrollLeft=i.clientWidth-i.scrollWidth+o;break;case"reverse":i.scrollLeft=i.scrollWidth-i.clientWidth-o;break;default:i.scrollLeft=o}else i.scrollLeft=o}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const directionSubscribers=[];function directionUpdater(){const e=getDocumentDir();directionSubscribers.forEach((t=>{alignDirs(t,e)}))}let scrollType;const directionObserver=new MutationObserver(directionUpdater);function alignDirs(e,t,i=e.getAttribute("dir")){t?e.setAttribute("dir",t):null!=i&&e.removeAttribute("dir")}function getDocumentDir(){return document.documentElement.getAttribute("dir")}directionObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const DirMixin=e=>class extends e{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:e=>e||"",toAttribute:e=>""===e?null:e}}}}static finalize(){super.finalize(),scrollType||(scrollType=DirHelper.detectScrollType())}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),alignDirs(this,getDocumentDir(),null))}attributeChangedCallback(e,t,i){if(super.attributeChangedCallback(e,t,i),"dir"!==e)return;const o=getDocumentDir(),n=i===o&&-1===directionSubscribers.indexOf(this),s=!i&&t&&-1===directionSubscribers.indexOf(this),r=i!==o&&t===o;n||s?(this.__subscribe(),alignDirs(this,o,i)):r&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=directionSubscribers.includes(this),this.__unsubscribe()}_valueToNodeAttribute(e,t,i){("dir"!==i||""!==t||e.hasAttribute("dir"))&&super._valueToNodeAttribute(e,t,i)}_attributeToProperty(e,t,i){"dir"!==e||t?super._attributeToProperty(e,t,i):this.dir=""}__subscribe(){directionSubscribers.includes(this)||directionSubscribers.push(this)}__unsubscribe(){directionSubscribers.includes(this)&&directionSubscribers.splice(directionSubscribers.indexOf(this),1)}__getNormalizedScrollLeft(e){return DirHelper.getNormalizedScrollLeft(scrollType,this.getAttribute("dir")||"ltr",e)}__setNormalizedScrollLeft(e,t){return DirHelper.setNormalizedScrollLeft(scrollType,this.getAttribute("dir")||"ltr",e,t)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let statsJob;window.Vaadin=window.Vaadin||{},window.Vaadin.registrations=window.Vaadin.registrations||[],window.Vaadin.developmentModeCallback=window.Vaadin.developmentModeCallback||{},window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){usageStatistics()};const registered=new Set,ElementMixin=e=>class extends(DirMixin(e)){static get version(){return"23.3.31"}static finalize(){super.finalize();const{is:e}=this;e&&!registered.has(e)&&(window.Vaadin.registrations.push(this),registered.add(e),window.Vaadin.developmentModeCallback&&(statsJob=Debouncer.debounce(statsJob,idlePeriod,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),enqueueDebouncer(statsJob)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let uniqueId=0;function generateUniqueId(){return uniqueId++}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class SlotController extends EventTarget{static generateId(e,t){return`${e||"default"}-${t.localName}-${generateUniqueId()}`}constructor(e,t,i,o,n){super(),this.host=e,this.slotName=t,this.slotFactory=i,this.slotInitializer=o,n&&(this.defaultId=SlotController.generateId(t,e))}hostConnected(){if(!this.initialized){let e=this.getSlotChild();e?(this.node=e,this.initCustomNode(e)):e=this.attachDefaultNode(),this.initNode(e),this.observe(),this.initialized=!0}}attachDefaultNode(){const{host:e,slotName:t,slotFactory:i}=this;let o=this.defaultNode;return!o&&i&&(o=i(e),o instanceof Element&&(""!==t&&o.setAttribute("slot",t),this.node=o,this.defaultNode=o)),o&&e.appendChild(o),o}getSlotChild(){const{slotName:e}=this;return Array.from(this.host.childNodes).find((t=>t.nodeType===Node.ELEMENT_NODE&&t.slot===e||t.nodeType===Node.TEXT_NODE&&t.textContent.trim()&&""===e))}initNode(e){const{slotInitializer:t}=this;t&&t(this.host,e)}initCustomNode(e){}teardownNode(e){}observe(){const{slotName:e}=this,t=""===e?"slot:not([name])":`slot[name=${e}]`,i=this.host.shadowRoot.querySelector(t);this.__slotObserver=new FlattenedNodesObserver(i,(e=>{const t=this.node,i=e.addedNodes.find((e=>e!==t));e.removedNodes.length&&e.removedNodes.forEach((e=>{this.teardownNode(e)})),i&&(t&&t.isConnected&&this.host.removeChild(t),this.node=i,i!==this.defaultNode&&(this.initCustomNode(i),this.initNode(i)))}))}}
/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class TooltipController extends SlotController{constructor(e){super(e,"tooltip"),this.setTarget(e)}initCustomNode(e){e.target=this.target,void 0!==this.context&&(e.context=this.context),void 0!==this.manual&&(e.manual=this.manual),void 0!==this.opened&&(e.opened=this.opened),void 0!==this.position&&(e._position=this.position),void 0!==this.shouldShow&&(e.shouldShow=this.shouldShow)}setContext(e){this.context=e;const t=this.node;t&&(t.context=e)}setManual(e){this.manual=e;const t=this.node;t&&(t.manual=e)}setOpened(e){this.opened=e;const t=this.node;t&&(t.opened=e)}setPosition(e){this.position=e;const t=this.node;t&&(t._position=e)}setShouldShow(e){this.shouldShow=e;const t=this.node;t&&(t.shouldShow=e)}setTarget(e){this.target=e;const t=this.node;t&&(t.target=e)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let keyboardActive=!1;function isKeyboardActive(){return keyboardActive}function isElementHiddenDirectly(e){const t=e.style;if("hidden"===t.visibility||"none"===t.display)return!0;const i=window.getComputedStyle(e);return"hidden"===i.visibility||"none"===i.display}function isElementHidden(e){return null===e.offsetParent&&0===e.clientWidth&&0===e.clientHeight||isElementHiddenDirectly(e)}function isElementFocused(e){return e.getRootNode().activeElement===e}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */window.addEventListener("keydown",(()=>{keyboardActive=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{keyboardActive=!1}),{capture:!0});const DelegateStateMixin=dedupingMixin((e=>class extends e{static get properties(){return{stateTarget:{type:Object,observer:"_stateTargetChanged"}}}static get delegateAttrs(){return[]}static get delegateProps(){return[]}ready(){super.ready(),this._createDelegateAttrsObserver(),this._createDelegatePropsObserver()}_stateTargetChanged(e){e&&(this._ensureAttrsDelegated(),this._ensurePropsDelegated())}_createDelegateAttrsObserver(){this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`)}_createDelegatePropsObserver(){this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`)}_ensureAttrsDelegated(){this.constructor.delegateAttrs.forEach((e=>{this._delegateAttribute(e,this[e])}))}_ensurePropsDelegated(){this.constructor.delegateProps.forEach((e=>{this._delegateProperty(e,this[e])}))}_delegateAttrsChanged(...e){this.constructor.delegateAttrs.forEach(((t,i)=>{this._delegateAttribute(t,e[i])}))}_delegatePropsChanged(...e){this.constructor.delegateProps.forEach(((t,i)=>{this._delegateProperty(t,e[i])}))}_delegateAttribute(e,t){this.stateTarget&&("invalid"===e&&this._delegateAttribute("aria-invalid",!!t&&"true"),"boolean"==typeof t?this.stateTarget.toggleAttribute(e,t):t?this.stateTarget.setAttribute(e,t):this.stateTarget.removeAttribute(e))}_delegateProperty(e,t){this.stateTarget&&(this.stateTarget[e]=t)}})),InputMixin=dedupingMixin((e=>class extends e{static get properties(){return{inputElement:{type:Object,readOnly:!0,observer:"_inputElementChanged"},type:{type:String,readOnly:!0},value:{type:String,value:"",observer:"_valueChanged",notify:!0},_hasInputValue:{type:Boolean,value:!1,observer:"_hasInputValueChanged"}}}constructor(){super(),this._boundOnInput=this.__onInput.bind(this),this._boundOnChange=this._onChange.bind(this)}clear(){this.value=""}_addInputListeners(e){e.addEventListener("input",this._boundOnInput),e.addEventListener("change",this._boundOnChange)}_removeInputListeners(e){e.removeEventListener("input",this._boundOnInput),e.removeEventListener("change",this._boundOnChange)}_forwardInputValue(e){this.inputElement&&(this.inputElement.value=null!=e?e:"")}_inputElementChanged(e,t){e?this._addInputListeners(e):t&&this._removeInputListeners(t)}_hasInputValueChanged(e,t){(e||t)&&this.dispatchEvent(new CustomEvent("has-input-value-changed"))}__onInput(e){this._setHasInputValue(e),this._onInput(e)}_onInput(e){const t=e.composedPath()[0];this.__userInput=e.isTrusted,this.value=t.value,this.__userInput=!1}_onChange(e){}_toggleHasValue(e){this.toggleAttribute("has-value",e)}_valueChanged(e,t){this._toggleHasValue(this._hasValue),""===e&&void 0===t||this.__userInput||this._forwardInputValue(e)}get _hasValue(){return null!=this.value&&""!==this.value}_setHasInputValue(e){const t=e.composedPath()[0];this._hasInputValue=t.value.length>0}})),CheckedMixin=dedupingMixin((e=>class extends(DelegateStateMixin(DisabledMixin(InputMixin(e)))){static get properties(){return{checked:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0}}}static get delegateProps(){return[...super.delegateProps,"checked"]}_onChange(e){const t=e.target;this._toggleChecked(t.checked),isElementFocused(t)||t.focus()}_toggleChecked(e){this.checked=e}})),FocusMixin=dedupingMixin((e=>class extends e{get _keyboardActive(){return isKeyboardActive()}ready(){this.addEventListener("focusin",(e=>{this._shouldSetFocus(e)&&this._setFocused(!0)})),this.addEventListener("focusout",(e=>{this._shouldRemoveFocus(e)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(e){this.toggleAttribute("focused",e),this.toggleAttribute("focus-ring",e&&this._keyboardActive)}_shouldSetFocus(e){return!0}_shouldRemoveFocus(e){return!0}})),TabindexMixin=e=>class extends(DisabledMixin(e)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(e,t){super._disabledChanged(e,t),e?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):t&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(e){this.disabled&&-1!==e&&(this._lastTabIndex=e,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,DelegateFocusMixin=dedupingMixin((e=>class extends(FocusMixin(TabindexMixin(e))){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged"},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame((()=>{this.focus(),this.setAttribute("focus-ring","")}))}focus(){this.focusElement&&!this.disabled&&(this.focusElement.focus(),this._setFocused(!0))}blur(){this.focusElement&&(this.focusElement.blur(),this._setFocused(!1))}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(e,t){e?(e.disabled=this.disabled,this._addFocusListeners(e),this.__forwardTabIndex(this.tabindex)):t&&this._removeFocusListeners(t)}_addFocusListeners(e){e.addEventListener("blur",this._boundOnBlur),e.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(e){e.removeEventListener("blur",this._boundOnBlur),e.removeEventListener("focus",this._boundOnFocus)}_onFocus(e){e.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(e){e.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(e){return e.target===this.focusElement}_disabledChanged(e,t){super._disabledChanged(e,t),this.focusElement&&(this.focusElement.disabled=e),e&&this.blur()}_tabindexChanged(e){this.__forwardTabIndex(e)}__forwardTabIndex(e){void 0!==e&&this.focusElement&&(this.focusElement.tabIndex=e,-1!==e&&(this.tabindex=void 0)),this.disabled&&e&&(-1!==e&&(this._lastTabIndex=e),this.tabindex=void 0)}}));
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class InputController extends SlotController{constructor(e,t){super(e,"input",(()=>document.createElement("input")),((e,i)=>{e.value&&(i.value=e.value),e.type&&i.setAttribute("type",e.type),i.id=this.defaultId,"function"==typeof t&&t(i)}),!0)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class LabelController extends SlotController{constructor(e){super(e,"label",(()=>document.createElement("label")),((e,t)=>{this.__updateLabelId(t),this.__updateDefaultLabel(this.label),this.__observeLabel(t)}),!0)}get labelId(){return this.node.id}initCustomNode(e){this.__updateLabelId(e);const t=this.__hasLabel(e);this.__toggleHasLabel(t)}teardownNode(e){this.__labelObserver&&this.__labelObserver.disconnect();let t=this.getSlotChild();t||e===this.defaultNode||(t=this.attachDefaultNode(),this.initNode(t));const i=this.__hasLabel(t);this.__toggleHasLabel(i)}setLabel(e){this.label=e,this.__updateDefaultLabel(e)}__hasLabel(e){return!!e&&(e.children.length>0||this.__isNotEmpty(e.textContent))}__isNotEmpty(e){return Boolean(e&&""!==e.trim())}__observeLabel(e){this.__labelObserver=new MutationObserver((e=>{e.forEach((e=>{const t=e.target,i=t===this.node;if("attributes"===e.type)i&&t.id!==this.defaultId&&this.__updateLabelId(t);else if(i||t.parentElement===this.node){const e=this.__hasLabel(this.node);this.__toggleHasLabel(e)}}))})),this.__labelObserver.observe(e,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}__toggleHasLabel(e){this.host.toggleAttribute("has-label",e),this.dispatchEvent(new CustomEvent("label-changed",{detail:{hasLabel:e,node:this.node}}))}__updateDefaultLabel(e){if(this.defaultNode&&(this.defaultNode.textContent=e,this.defaultNode===this.node)){const t=this.__isNotEmpty(e);this.__toggleHasLabel(t)}}__updateLabelId(e){e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const LabelMixin=dedupingMixin((e=>class extends(ControllerMixin(e)){static get properties(){return{label:{type:String,observer:"_labelChanged"}}}get _labelId(){return this._labelController.labelId}get _labelNode(){return this._labelController.node}constructor(){super(),this._labelController=new LabelController(this)}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(e){this._labelController.setLabel(e)}}));
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class LabelledInputController{constructor(e,t){this.input=e,this.__preventDuplicateLabelClick=this.__preventDuplicateLabelClick.bind(this),t.addEventListener("label-changed",(e=>{this.__initLabel(e.detail.node)})),this.__initLabel(t.node)}__initLabel(e){e&&(e.addEventListener("click",this.__preventDuplicateLabelClick),this.input&&e.setAttribute("for",this.input.id))}__preventDuplicateLabelClick(){const e=t=>{t.stopImmediatePropagation(),this.input.removeEventListener("click",e)};this.input.addEventListener("click",e)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class SlotTargetController{constructor(e,t,i){this.sourceSlot=e,this.targetFactory=t,this.copyCallback=i,e&&e.addEventListener("slotchange",(()=>{this.__copying?this.__copying=!1:this.__checkAndCopyNodesToSlotTarget()}))}hostConnected(){this.__sourceSlotObserver=new MutationObserver((()=>this.__checkAndCopyNodesToSlotTarget())),this.__copying||this.__checkAndCopyNodesToSlotTarget()}__checkAndCopyNodesToSlotTarget(){this.__sourceSlotObserver.disconnect();const e=this.targetFactory();if(!e)return;this.__slotTargetClones&&(this.__slotTargetClones.forEach((t=>{t.parentElement===e&&e.removeChild(t)})),delete this.__slotTargetClones);const t=this.sourceSlot.assignedNodes({flatten:!0}).filter((e=>!(e.nodeType===Node.TEXT_NODE&&""===e.textContent.trim())));t.length>0&&(e.innerHTML="",this.__copying=!0,this.__copyNodesToSlotTarget(t,e))}__copyNodesToSlotTarget(e,t){this.__slotTargetClones=this.__slotTargetClones||[],e.forEach((e=>{const i=e.cloneNode(!0);this.__slotTargetClones.push(i),t.appendChild(i),this.__sourceSlotObserver.observe(e,{attributes:!0,childList:!0,subtree:!0,characterData:!0})})),"function"==typeof this.copyCallback&&this.copyCallback(e)}}
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Checkbox extends(LabelMixin(CheckedMixin(DelegateFocusMixin(ActiveMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))))))){static get is(){return"vaadin-checkbox"}static get template(){return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }

        .vaadin-checkbox-container {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
        }

        [part='checkbox'],
        ::slotted(input),
        ::slotted(label) {
          grid-row: 1;
        }

        [part='checkbox'],
        ::slotted(input) {
          grid-column: 1;
        }

        [part='checkbox'] {
          width: var(--vaadin-checkbox-size, 1em);
          height: var(--vaadin-checkbox-size, 1em);
        }

        [part='checkbox']::before {
          display: block;
          content: '\\202F';
          line-height: var(--vaadin-checkbox-size, 1em);
          contain: paint;
        }

        /* visually hidden */
        ::slotted(input) {
          opacity: 0;
          cursor: inherit;
          margin: 0;
          align-self: stretch;
          -webkit-appearance: none;
          width: initial;
          height: initial;
        }
      </style>
      <div class="vaadin-checkbox-container">
        <div part="checkbox"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>

        <div style="display: none !important">
          <slot id="noop"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `}static get properties(){return{indeterminate:{type:Boolean,notify:!0,value:!1,reflectToAttribute:!0},name:{type:String,value:""}}}static get delegateProps(){return[...super.delegateProps,"indeterminate"]}static get delegateAttrs(){return[...super.delegateAttrs,"name"]}constructor(){super(),this._setType("checkbox"),this.value="on"}ready(){super.ready(),this.addController(new InputController(this,(e=>{this._setInputElement(e),this._setFocusElement(e),this.stateTarget=e,this.ariaTarget=e}))),this.addController(new LabelledInputController(this.inputElement,this._labelController)),this.addController(new SlotTargetController(this.$.noop,(()=>this._labelController.node),(()=>this.__warnDeprecated()))),this._tooltipController=new TooltipController(this),this.addController(this._tooltipController)}__warnDeprecated(){console.warn('WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.\nPlease use <label slot="label"> wrapper or the label property instead.')}_shouldSetActive(e){return"a"!==e.target.localName&&super._shouldSetActive(e)}_toggleChecked(e){this.indeterminate&&(this.indeterminate=!1),super._toggleChecked(e)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function processTemplates(e){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(e):e.querySelector("template")&&console.warn(`WARNING: <template> inside <${e.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */customElements.define(Checkbox.is,Checkbox),registerStyles("vaadin-grid",i$3`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      line-height: var(--lumo-line-height-s);
      color: var(--lumo-body-text-color);
      background-color: var(--lumo-base-color);
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      /* For internal use only */
      --_lumo-grid-border-color: var(--lumo-contrast-20pct);
      --_lumo-grid-secondary-border-color: var(--lumo-contrast-10pct);
      --_lumo-grid-border-width: 1px;
      --_lumo-grid-selected-row-color: var(--lumo-primary-color-10pct);
    }

    /* No (outer) border */

    :host(:not([theme~='no-border'])) {
      border: var(--_lumo-grid-border-width) solid var(--_lumo-grid-border-color);
    }

    :host([disabled]) {
      opacity: 0.7;
    }

    /* Cell styles */

    [part~='cell'] {
      min-height: var(--lumo-size-m);
      background-color: var(--lumo-base-color);
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: default;
      padding: var(--lumo-space-xs) var(--lumo-space-m);
    }

    /* Apply row borders by default and introduce the "no-row-borders" variant */
    :host(:not([theme~='no-row-borders'])) [part~='cell']:not([part~='details-cell']) {
      border-top: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Hide first body row top border */
    :host(:not([theme~='no-row-borders'])) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      border-top: 0;
      min-height: calc(var(--lumo-size-m) - var(--_lumo-grid-border-width));
    }

    /* Focus-ring */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='focused-cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='focused-cell']:focus::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    :host([navigating]) [part~='row']:focus::before {
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: calc(var(--_lumo-grid-border-width) + 2px);
      pointer-events: none;
      background: var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] [part~='cell'][last-frozen]::after {
      right: -1px;
    }

    :host([theme~='no-row-borders']) [dragover] [part~='cell']::after {
      height: 2px;
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      top: 100%;
      bottom: auto;
      margin-top: -1px;
    }

    :host([all-rows-visible]) [part~='row'][last][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      top: auto;
      bottom: 100%;
      margin-bottom: -1px;
    }

    [part~='row'][details-opened][dragover='below'] [part~='cell']:not([part~='details-cell'])::after,
    [part~='row'][details-opened][dragover='above'] [part~='details-cell']::after {
      display: none;
    }

    [part~='row'][dragover][dragover='on-top'] [part~='cell']::after {
      height: 100%;
      opacity: 0.5;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    #scroller [part~='row'][dragstart]:not([dragstart=''])::after {
      display: block;
      position: absolute;
      left: var(--_grid-drag-start-x);
      top: var(--_grid-drag-start-y);
      z-index: 100;
      content: attr(dragstart);
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: calc(var(--lumo-space-xs) * 0.8);
      color: var(--lumo-error-contrast-color);
      background-color: var(--lumo-error-color);
      border-radius: var(--lumo-border-radius-m);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
      font-weight: 500;
      text-transform: initial;
      letter-spacing: initial;
      min-width: calc(var(--lumo-size-s) * 0.7);
      text-align: center;
    }

    /* Headers and footers */

    [part~='header-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='reorder-ghost'] {
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content) {
      font-weight: 400;
    }

    [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-xl);
    }

    /* Header borders */

    /* Hide first header row top border */
    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='header-cell'] {
      border-top: 0;
    }

    [part='row']:last-child [part~='header-cell'] {
      border-bottom: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='top']) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-border-color);
    }

    /* Footer borders */

    [part='row']:first-child [part~='footer-cell'] {
      border-top: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='bottom']) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-border-color);
    }

    /* Column reordering */

    :host([reordering]) [part~='cell'] {
      background: linear-gradient(var(--lumo-shade-20pct), var(--lumo-shade-20pct)) var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      background: var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      background: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct)) var(--lumo-base-color);
    }

    [part~='reorder-ghost'] {
      opacity: 0.85;
      box-shadow: var(--lumo-box-shadow-s);
      /* TODO Use the same styles as for the cell element (reorder-ghost copies styles from the cell element) */
      padding: var(--lumo-space-s) var(--lumo-space-m) !important;
    }

    /* Column resizing */

    [part='resize-handle'] {
      width: 3px;
      background-color: var(--lumo-primary-color-50pct);
      opacity: 0;
      transition: opacity 0.2s;
    }

    :host(:not([reordering])) *:not([column-resizing]) [part~='cell']:hover [part='resize-handle'],
    [part='resize-handle']:active {
      opacity: 1;
      transition-delay: 0.15s;
    }

    /* Column borders */

    :host([theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Frozen columns */

    [last-frozen] {
      border-right: var(--_lumo-grid-border-width) solid transparent;
      overflow: hidden;
    }

    :host([overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }

    [first-frozen-to-end] {
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    /* Row stripes */

    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='body-cell'],
    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='details-cell'] {
      background-image: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
      background-repeat: repeat-x;
    }

    /* Selected row */

    /* Raise the selected rows above unselected rows (so that box-shadow can cover unselected rows) */
    :host(:not([reordering])) [part~='row'][selected] {
      z-index: 1;
    }

    :host(:not([reordering])) [part~='row'][selected] [part~='body-cell']:not([part~='details-cell']) {
      background-image: linear-gradient(var(--_lumo-grid-selected-row-color), var(--_lumo-grid-selected-row-color));
      background-repeat: repeat;
    }

    /* Cover the border of an unselected row */
    :host(:not([theme~='no-row-borders'])) [part~='row'][selected] [part~='cell']:not([part~='details-cell']) {
      box-shadow: 0 var(--_lumo-grid-border-width) 0 0 var(--_lumo-grid-selected-row-color);
    }

    /* Compact */

    :host([theme~='compact']) [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-m);
    }

    :host([theme~='compact']) [part~='cell'] {
      min-height: var(--lumo-size-s);
    }

    :host([theme~='compact']) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      min-height: calc(var(--lumo-size-s) - var(--_lumo-grid-border-width));
    }

    :host([theme~='compact']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Wrap cell contents */

    :host([theme~='wrap-cell-content']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      white-space: normal;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    :host([dir='rtl'][theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    :host([dir='rtl']) [last-frozen] {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl']) [first-frozen-to-end] {
      border-left: none;
      border-right: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl'][overflow~='start']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }

    :host([dir='rtl'][overflow~='end']) [part~='cell'][first-frozen-to-end]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }
  `,{moduleId:"lumo-grid"});const ColumnBaseMixin=e=>class extends e{static get properties(){return{resizable:{type:Boolean,value(){if("vaadin-grid-column-group"===this.localName)return;const e=this.parentNode;return e&&"vaadin-grid-column-group"===e.localName&&e.resizable||!1}},frozen:{type:Boolean,value:!1},frozenToEnd:{type:Boolean,value:!1},hidden:{type:Boolean,value:!1},header:{type:String},textAlign:{type:String},_lastFrozen:{type:Boolean,value:!1},_firstFrozenToEnd:{type:Boolean,value:!1},_order:Number,_reorderStatus:Boolean,_emptyCells:Array,_headerCell:Object,_footerCell:Object,_grid:Object,__initialized:{type:Boolean,value:!0},headerRenderer:Function,_headerRenderer:{type:Function,computed:"_computeHeaderRenderer(headerRenderer, header, __initialized)"},footerRenderer:Function,_footerRenderer:{type:Function,computed:"_computeFooterRenderer(footerRenderer, __initialized)"},__gridColumnElement:{type:Boolean,value:!0}}}static get observers(){return["_widthChanged(width, _headerCell, _footerCell, _cells.*)","_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)","_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells.*)","_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)","_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)","_orderChanged(_order, _headerCell, _footerCell, _cells.*)","_lastFrozenChanged(_lastFrozen)","_firstFrozenToEndChanged(_firstFrozenToEnd)","_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)","_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)","_resizableChanged(resizable, _headerCell)","_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)","_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)"]}connectedCallback(){super.connectedCallback(),requestAnimationFrame((()=>{this._grid&&this._allCells.forEach((e=>{e._content.parentNode||this._grid.appendChild(e._content)}))}))}disconnectedCallback(){super.disconnectedCallback(),requestAnimationFrame((()=>{this._grid||this._allCells.forEach((e=>{e._content.parentNode&&e._content.parentNode.removeChild(e._content)}))})),this._gridValue=void 0}ready(){super.ready(),processTemplates(this)}_findHostGrid(){let e=this;for(;e&&!/^vaadin.*grid(-pro)?$/.test(e.localName);)e=e.assignedSlot?e.assignedSlot.parentNode:e.parentNode;return e||void 0}get _grid(){return this._gridValue||(this._gridValue=this._findHostGrid()),this._gridValue}get _allCells(){return[].concat(this._cells||[]).concat(this._emptyCells||[]).concat(this._headerCell).concat(this._footerCell).filter((e=>e))}_renderHeaderAndFooter(){this._renderHeaderCellContent(this._headerRenderer,this._headerCell),this._renderFooterCellContent(this._footerRenderer,this._footerCell)}_flexGrowChanged(e){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("flexGrow"),this._allCells.forEach((t=>{t.style.flexGrow=e}))}_orderChanged(e){this._allCells.forEach((t=>{t.style.order=e}))}_widthChanged(e){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("width"),this._allCells.forEach((t=>{t.style.width=e}))}_frozenChanged(e){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozen",e),this._allCells.forEach((t=>t.toggleAttribute("frozen",e))),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_frozenToEndChanged(e){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozenToEnd",e),this._allCells.forEach((t=>{this._grid&&t.parentElement===this._grid.$.sizer||t.toggleAttribute("frozen-to-end",e)})),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_lastFrozenChanged(e){this._allCells.forEach((t=>t.toggleAttribute("last-frozen",e))),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._lastFrozen=e)}_firstFrozenToEndChanged(e){this._allCells.forEach((t=>{this._grid&&t.parentElement===this._grid.$.sizer||t.toggleAttribute("first-frozen-to-end",e)})),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._firstFrozenToEnd=e)}_generateHeader(e){return e.substr(e.lastIndexOf(".")+1).replace(/([A-Z])/g,"-$1").toLowerCase().replace(/-/g," ").replace(/^./,(e=>e.toUpperCase()))}_reorderStatusChanged(e){this._allCells.forEach((t=>t.setAttribute("reorder-status",e)))}_resizableChanged(e,t){void 0!==e&&void 0!==t&&t&&[t].concat(this._emptyCells).forEach((t=>{if(t){const i=t.querySelector('[part~="resize-handle"]');if(i&&t.removeChild(i),e){const e=document.createElement("div");e.setAttribute("part","resize-handle"),t.appendChild(e)}}}))}_textAlignChanged(e){if(void 0===e||void 0===this._grid)return;if(-1===["start","end","center"].indexOf(e))return void console.warn('textAlign can only be set as "start", "end" or "center"');let t;"ltr"===getComputedStyle(this._grid).direction?"start"===e?t="left":"end"===e&&(t="right"):"start"===e?t="right":"end"===e&&(t="left"),this._allCells.forEach((i=>{i._content.style.textAlign=e,getComputedStyle(i._content).textAlign!==e&&(i._content.style.textAlign=t)}))}_hiddenChanged(e){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("hidden",e),!!e!=!!this._previousHidden&&this._grid&&(!0===e&&this._allCells.forEach((e=>{e._content.parentNode&&e._content.parentNode.removeChild(e._content)})),this._grid._debouncerHiddenChanged=Debouncer.debounce(this._grid._debouncerHiddenChanged,animationFrame,(()=>{this._grid&&this._grid._renderColumnTree&&this._grid._renderColumnTree(this._grid._columnTree)})),this._grid._debounceUpdateFrozenColumn&&this._grid._debounceUpdateFrozenColumn(),this._grid._resetKeyboardNavigation&&this._grid._resetKeyboardNavigation()),this._previousHidden=e}_runRenderer(e,t,i){const o=[t._content,this];i&&i.item&&o.push(i),e.apply(this,o)}__renderCellsContent(e,t){!this.hidden&&this._grid&&t.forEach((t=>{if(!t.parentElement)return;const i=this._grid.__getRowModel(t.parentElement);e&&(t._renderer!==e&&this._clearCellContent(t),t._renderer=e,(i.item||e===this._headerRenderer||e===this._footerRenderer)&&this._runRenderer(e,t,i))}))}_clearCellContent(e){e._content.innerHTML="",delete e._content._$litPart$}_renderHeaderCellContent(e,t){t&&e&&(this.__renderCellsContent(e,[t]),this._grid&&t.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(t.parentElement))}_onHeaderRendererOrBindingChanged(e,t,...i){this._renderHeaderCellContent(e,t)}_renderBodyCellsContent(e,t){t&&e&&this.__renderCellsContent(e,t)}_onRendererOrBindingChanged(e,t,...i){this._renderBodyCellsContent(e,t)}_renderFooterCellContent(e,t){t&&e&&(this.__renderCellsContent(e,[t]),this._grid&&t.parentElement&&this._grid.__debounceUpdateHeaderFooterRowVisibility(t.parentElement))}_onFooterRendererOrBindingChanged(e,t){this._renderFooterCellContent(e,t)}__setTextContent(e,t){e.textContent!==t&&(e.textContent=t)}__textHeaderRenderer(){this.__setTextContent(this._headerCell._content,this.header)}_defaultHeaderRenderer(){this.path&&this.__setTextContent(this._headerCell._content,this._generateHeader(this.path))}_defaultRenderer(e,t,{item:i}){this.path&&this.__setTextContent(e,this.get(this.path,i))}_defaultFooterRenderer(){}_computeHeaderRenderer(e,t){return e||(null!=t?this.__textHeaderRenderer:this._defaultHeaderRenderer)}_computeRenderer(e){return e||this._defaultRenderer}_computeFooterRenderer(e){return e||this._defaultFooterRenderer}};class GridColumn extends(ColumnBaseMixin(DirMixin(PolymerElement))){static get is(){return"vaadin-grid-column"}static get properties(){return{width:{type:String,value:"100px"},flexGrow:{type:Number,value:1},renderer:Function,_renderer:{type:Function,computed:"_computeRenderer(renderer, __initialized)"},path:{type:String},autoWidth:{type:Boolean,value:!1},_focusButtonMode:{type:Boolean,value:!1},_cells:Array}}}customElements.define(GridColumn.is,GridColumn),
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
registerStyles("vaadin-grid",i$3`
    @keyframes vaadin-grid-appear {
      to {
        opacity: 1;
      }
    }

    :host {
      display: block;
      animation: 1ms vaadin-grid-appear;
      height: 400px;
      flex: 1 1 auto;
      align-self: stretch;
      position: relative;
    }

    :host([hidden]) {
      display: none !important;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    #scroller {
      display: block;
      transform: translateY(0);
      width: auto;
      height: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    :host([all-rows-visible]) {
      height: auto;
      align-self: flex-start;
      flex-grow: 0;
      width: 100%;
    }

    :host([all-rows-visible]) #scroller {
      width: 100%;
      height: 100%;
      position: relative;
    }

    :host([all-rows-visible]) #items {
      min-height: 1px;
    }

    #table {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      outline: none;
      /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
      z-index: 0;
    }

    #header,
    #footer {
      display: block;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      overflow: visible;
      width: 100%;
      z-index: 1;
    }

    #header {
      top: 0;
    }

    th {
      text-align: inherit;
    }

    /* Safari doesn't work with "inherit" */
    [safari] th {
      text-align: initial;
    }

    #footer {
      bottom: 0;
    }

    #items {
      flex-grow: 1;
      flex-shrink: 0;
      display: block;
      position: -webkit-sticky;
      position: sticky;
      width: 100%;
      left: 0;
      overflow: visible;
    }

    [part~='row'] {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }

    [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
      opacity: 0;
    }

    #items [part~='row'] {
      position: absolute;
    }

    #items [part~='row']:empty {
      height: 100%;
    }

    [part~='cell']:not([part~='details-cell']) {
      flex-shrink: 0;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;
      padding: 0;
      white-space: nowrap;
    }

    [part~='cell'] > [tabindex] {
      display: flex;
      align-items: inherit;
      outline: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    [part~='details-cell'] {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [hidden] {
      display: none !important;
    }

    [frozen],
    [frozen-to-end] {
      z-index: 2;
      will-change: transform;
    }

    [no-scrollbars][safari] #table,
    [no-scrollbars][firefox] #table {
      overflow: hidden;
    }

    /* Reordering styles */
    :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
    :host([reordering]) [part~='resize-handle'],
    #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      pointer-events: none;
    }

    [part~='reorder-ghost'] {
      visibility: hidden;
      position: fixed;
      pointer-events: none;
      opacity: 0.5;

      /* Prevent overflowing the grid in Firefox */
      top: 0;
      left: 0;
    }

    :host([reordering]) {
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Resizing styles */
    [part~='resize-handle'] {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      cursor: col-resize;
      z-index: 1;
    }

    [part~='resize-handle']::before {
      position: absolute;
      content: '';
      height: 100%;
      width: 35px;
      transform: translateX(-50%);
    }

    [last-column] [part~='resize-handle']::before,
    [last-frozen] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
      right: 0;
    }

    [frozen-to-end] [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    [frozen-to-end] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    [first-frozen-to-end] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
    }

    [first-frozen-to-end] {
      margin-inline-start: auto;
    }

    /* Hide resize handle if scrolled to end */
    :host(:not([overflow~='end'])) [first-frozen-to-end] [part~='resize-handle'] {
      display: none;
    }

    #scroller[column-resizing] {
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Sizer styles */
    #sizer {
      display: flex;
      position: absolute;
      visibility: hidden;
    }

    #sizer [part~='details-cell'] {
      display: none !important;
    }

    #sizer [part~='cell'][hidden] {
      display: none !important;
    }

    #sizer [part~='cell'] {
      display: block;
      flex-shrink: 0;
      line-height: 0;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    #sizer [part~='cell']::before {
      content: '-';
    }

    #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: none !important;
    }

    /* RTL specific styles */

    :host([dir='rtl']) #items,
    :host([dir='rtl']) #header,
    :host([dir='rtl']) #footer {
      left: auto;
    }

    :host([dir='rtl']) [part~='reorder-ghost'] {
      left: auto;
      right: 0;
    }

    :host([dir='rtl']) [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [part~='resize-handle']::before {
      transform: translateX(50%);
    }

    :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
    :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle'] {
      right: 0;
      left: auto;
    }

    :host([dir='rtl']) [frozen-to-end] [part~='resize-handle']::before {
      right: 0;
      left: auto;
    }
  `,{moduleId:"vaadin-grid-styles"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let scheduled=!1,beforeRenderQueue=[],afterRenderQueue=[];function schedule(){scheduled=!0,requestAnimationFrame((function(){scheduled=!1,flushQueue(beforeRenderQueue),setTimeout((function(){runQueue(afterRenderQueue)}))}))}function flushQueue(e){for(;e.length;)callMethod(e.shift())}function runQueue(e){for(let t=0,i=e.length;t<i;t++)callMethod(e.shift())}function callMethod(e){const t=e[0],i=e[1],o=e[2];try{i.apply(t,o)}catch(e){setTimeout((()=>{throw e}))}}function beforeNextRender(e,t,i){scheduled||schedule(),beforeRenderQueue.push([e,t,i])}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const testUserAgent=e=>e.test(navigator.userAgent),testPlatform=e=>e.test(navigator.platform),testVendor=e=>e.test(navigator.vendor),isAndroid=testUserAgent(/Android/),isChrome=testUserAgent(/Chrome/)&&testVendor(/Google Inc/),isFirefox=testUserAgent(/Firefox/),isIPad=testPlatform(/^iPad/)||testPlatform(/^Mac/)&&navigator.maxTouchPoints>1,isIPhone=testPlatform(/^iPhone/),isIOS=isIPhone||isIPad,isSafari=testUserAgent(/^((?!chrome|android).)*safari/i),isTouch=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(e){return!1}})(),IOS=navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/),IOS_TOUCH_SCROLLING=IOS&&IOS[1]>=8,DEFAULT_PHYSICAL_COUNT=3,ironList={_ratio:.5,_scrollerPaddingTop:0,_scrollPosition:0,_physicalSize:0,_physicalAverage:0,_physicalAverageCount:0,_physicalTop:0,_virtualCount:0,_estScrollHeight:0,_scrollHeight:0,_viewportHeight:0,_viewportWidth:0,_physicalItems:null,_physicalSizes:null,_firstVisibleIndexVal:null,_lastVisibleIndexVal:null,_maxPages:2,_templateCost:0,get _physicalBottom(){return this._physicalTop+this._physicalSize},get _scrollBottom(){return this._scrollPosition+this._viewportHeight},get _virtualEnd(){return this._virtualStart+this._physicalCount-1},get _hiddenContentSize(){return this._physicalSize-this._viewportHeight},get _maxScrollTop(){return this._estScrollHeight-this._viewportHeight+this._scrollOffset},get _maxVirtualStart(){const e=this._virtualCount;return Math.max(0,e-this._physicalCount)},get _virtualStart(){return this._virtualStartVal||0},set _virtualStart(e){e=this._clamp(e,0,this._maxVirtualStart),this._virtualStartVal=e},get _physicalStart(){return this._physicalStartVal||0},set _physicalStart(e){(e%=this._physicalCount)<0&&(e=this._physicalCount+e),this._physicalStartVal=e},get _physicalEnd(){return(this._physicalStart+this._physicalCount-1)%this._physicalCount},get _physicalCount(){return this._physicalCountVal||0},set _physicalCount(e){this._physicalCountVal=e},get _optPhysicalSize(){return 0===this._viewportHeight?1/0:this._viewportHeight*this._maxPages},get _isVisible(){return Boolean(this.offsetWidth||this.offsetHeight)},get firstVisibleIndex(){let e=this._firstVisibleIndexVal;if(null==e){let t=this._physicalTop+this._scrollOffset;e=this._iterateItems(((e,i)=>{if(t+=this._getPhysicalSizeIncrement(e),t>this._scrollPosition)return i}))||0,this._firstVisibleIndexVal=e}return e},get lastVisibleIndex(){let e=this._lastVisibleIndexVal;if(null==e){let t=this._physicalTop+this._scrollOffset;this._iterateItems(((i,o)=>{t<this._scrollBottom&&(e=o),t+=this._getPhysicalSizeIncrement(i)})),this._lastVisibleIndexVal=e}return e},get _scrollOffset(){return this._scrollerPaddingTop+this.scrollOffset},_scrollHandler(){const e=Math.max(0,Math.min(this._maxScrollTop,this._scrollTop));let t=e-this._scrollPosition;const i=t>=0;if(this._scrollPosition=e,this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,Math.abs(t)>this._physicalSize&&this._physicalSize>0){t-=this._scrollOffset;const e=Math.round(t/this._physicalAverage);this._virtualStart+=e,this._physicalStart+=e,this._physicalTop=Math.min(Math.floor(this._virtualStart)*this._physicalAverage,this._scrollPosition),this._update()}else if(this._physicalCount>0){const e=this._getReusables(i);i?(this._physicalTop=e.physicalTop,this._virtualStart+=e.indexes.length,this._physicalStart+=e.indexes.length):(this._virtualStart-=e.indexes.length,this._physicalStart-=e.indexes.length),this._update(e.indexes,i?null:e.indexes),this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,0),microTask)}},_getReusables(e){let t,i,o;const n=[],s=this._hiddenContentSize*this._ratio,r=this._virtualStart,a=this._virtualEnd,l=this._physicalCount;let c=this._physicalTop+this._scrollOffset;const d=this._physicalBottom+this._scrollOffset,g=this._scrollPosition,I=this._scrollBottom;for(e?(t=this._physicalStart,i=g-c):(t=this._physicalEnd,i=d-I);o=this._getPhysicalSizeIncrement(t),i-=o,!(n.length>=l||i<=s);)if(e){if(a+n.length+1>=this._virtualCount)break;if(c+o>=g-this._scrollOffset)break;n.push(t),c+=o,t=(t+1)%l}else{if(r-n.length<=0)break;if(c+this._physicalSize-o<=I)break;n.push(t),c-=o,t=0===t?l-1:t-1}return{indexes:n,physicalTop:c-this._scrollOffset}},_update(e,t){if(!(e&&0===e.length||0===this._physicalCount)){if(this._assignModels(e),this._updateMetrics(e),t)for(;t.length;){const e=t.pop();this._physicalTop-=this._getPhysicalSizeIncrement(e)}this._positionItems(),this._updateScrollerSize()}},_isClientFull(){return 0!==this._scrollBottom&&this._physicalBottom-1>=this._scrollBottom&&this._physicalTop<=this._scrollPosition},_increasePoolIfNeeded(e){const t=this._clamp(this._physicalCount+e,DEFAULT_PHYSICAL_COUNT,this._virtualCount-this._virtualStart)-this._physicalCount;let i=Math.round(.5*this._physicalCount);if(!(t<0)){if(t>0){const e=window.performance.now();[].push.apply(this._physicalItems,this._createPool(t));for(let e=0;e<t;e++)this._physicalSizes.push(0);this._physicalCount+=t,this._physicalStart>this._physicalEnd&&this._isIndexRendered(this._focusedVirtualIndex)&&this._getPhysicalIndex(this._focusedVirtualIndex)<this._physicalEnd&&(this._physicalStart+=t),this._update(),this._templateCost=(window.performance.now()-e)/t,i=Math.round(.5*this._physicalCount)}this._virtualEnd>=this._virtualCount-1||0===i||(this._isClientFull()?this._physicalSize<this._optPhysicalSize&&this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,this._clamp(Math.round(50/this._templateCost),1,i)),idlePeriod):this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,i),microTask))}},_render(){if(this.isAttached&&this._isVisible)if(0!==this._physicalCount){const e=this._getReusables(!0);this._physicalTop=e.physicalTop,this._virtualStart+=e.indexes.length,this._physicalStart+=e.indexes.length,this._update(e.indexes),this._update(),this._increasePoolIfNeeded(0)}else this._virtualCount>0&&(this.updateViewportBoundaries(),this._increasePoolIfNeeded(DEFAULT_PHYSICAL_COUNT))},_itemsChanged(e){"items"===e.path&&(this._virtualStart=0,this._physicalTop=0,this._virtualCount=this.items?this.items.length:0,this._physicalIndexForKey={},this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._physicalCount=this._physicalCount||0,this._physicalItems=this._physicalItems||[],this._physicalSizes=this._physicalSizes||[],this._physicalStart=0,this._scrollTop>this._scrollOffset&&this._resetScrollPosition(0),this._debounce("_render",this._render,animationFrame))},_iterateItems(e,t){let i,o,n,s;if(2===arguments.length&&t){for(s=0;s<t.length;s++)if(i=t[s],o=this._computeVidx(i),null!=(n=e.call(this,i,o)))return n}else{for(i=this._physicalStart,o=this._virtualStart;i<this._physicalCount;i++,o++)if(null!=(n=e.call(this,i,o)))return n;for(i=0;i<this._physicalStart;i++,o++)if(null!=(n=e.call(this,i,o)))return n}},_computeVidx(e){return e>=this._physicalStart?this._virtualStart+(e-this._physicalStart):this._virtualStart+(this._physicalCount-this._physicalStart)+e},_positionItems(){this._adjustScrollPosition();let e=this._physicalTop;this._iterateItems((t=>{this.translate3d(0,`${e}px`,0,this._physicalItems[t]),e+=this._physicalSizes[t]}))},_getPhysicalSizeIncrement(e){return this._physicalSizes[e]},_adjustScrollPosition(){const e=0===this._virtualStart?this._physicalTop:Math.min(this._scrollPosition+this._physicalTop,0);if(0!==e){this._physicalTop-=e;const t=this._scrollPosition;!IOS_TOUCH_SCROLLING&&t>0&&this._resetScrollPosition(t-e)}},_resetScrollPosition(e){this.scrollTarget&&e>=0&&(this._scrollTop=e,this._scrollPosition=this._scrollTop)},_updateScrollerSize(e){this._estScrollHeight=this._physicalBottom+Math.max(this._virtualCount-this._physicalCount-this._virtualStart,0)*this._physicalAverage,((e=(e=e||0===this._scrollHeight)||this._scrollPosition>=this._estScrollHeight-this._physicalSize)||Math.abs(this._estScrollHeight-this._scrollHeight)>=this._viewportHeight)&&(this.$.items.style.height=`${this._estScrollHeight}px`,this._scrollHeight=this._estScrollHeight)},scrollToIndex(e){if("number"!=typeof e||e<0||e>this.items.length-1)return;if(flush(),0===this._physicalCount)return;e=this._clamp(e,0,this._virtualCount-1),(!this._isIndexRendered(e)||e>=this._maxVirtualStart)&&(this._virtualStart=e-1),this._assignModels(),this._updateMetrics(),this._physicalTop=this._virtualStart*this._physicalAverage;let t=this._physicalStart,i=this._virtualStart,o=0;const n=this._hiddenContentSize;for(;i<e&&o<=n;)o+=this._getPhysicalSizeIncrement(t),t=(t+1)%this._physicalCount,i+=1;this._updateScrollerSize(!0),this._positionItems(),this._resetScrollPosition(this._physicalTop+this._scrollOffset+o),this._increasePoolIfNeeded(0),this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null},_resetAverage(){this._physicalAverage=0,this._physicalAverageCount=0},_resizeHandler(){this._debounce("_render",(()=>{this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._isVisible?(this.updateViewportBoundaries(),this.toggleScrollListener(!0),this._resetAverage(),this._render()):this.toggleScrollListener(!1)}),animationFrame)},_isIndexRendered(e){return e>=this._virtualStart&&e<=this._virtualEnd},_getPhysicalIndex(e){return(this._physicalStart+(e-this._virtualStart))%this._physicalCount},_clamp:(e,t,i)=>Math.min(i,Math.max(t,e)),_debounce(e,t,i){this._debouncers=this._debouncers||{},this._debouncers[e]=Debouncer.debounce(this._debouncers[e],i,t.bind(this)),enqueueDebouncer(this._debouncers[e])}},MAX_VIRTUAL_COUNT=1e5,OFFSET_ADJUST_MIN_THRESHOLD=1e3;class IronListAdapter{constructor({createElements:e,updateElement:t,scrollTarget:i,scrollContainer:o,elementsContainer:n,reorderElements:s}){this.isAttached=!0,this._vidxOffset=0,this.createElements=e,this.updateElement=t,this.scrollTarget=i,this.scrollContainer=o,this.elementsContainer=n||o,this.reorderElements=s,this._maxPages=1.3,this.__placeholderHeight=200,this.__elementHeightQueue=Array(10),this.timeouts={SCROLL_REORDER:500,IGNORE_WHEEL:500,FIX_INVALID_ITEM_POSITIONING:100},this.__resizeObserver=new ResizeObserver((()=>this._resizeHandler())),"visible"===getComputedStyle(this.scrollTarget).overflow&&(this.scrollTarget.style.overflow="auto"),"static"===getComputedStyle(this.scrollContainer).position&&(this.scrollContainer.style.position="relative"),this.__resizeObserver.observe(this.scrollTarget),this.scrollTarget.addEventListener("scroll",(()=>this._scrollHandler())),this._scrollLineHeight=this._getScrollLineHeight(),this.scrollTarget.addEventListener("wheel",(e=>this.__onWheel(e))),this.reorderElements&&(this.scrollTarget.addEventListener("mousedown",(()=>{this.__mouseDown=!0})),this.scrollTarget.addEventListener("mouseup",(()=>{this.__mouseDown=!1,this.__pendingReorder&&this.__reorderElements()})))}get scrollOffset(){return 0}get adjustedFirstVisibleIndex(){return this.firstVisibleIndex+this._vidxOffset}get adjustedLastVisibleIndex(){return this.lastVisibleIndex+this._vidxOffset}scrollToIndex(e){if("number"!=typeof e||isNaN(e)||0===this.size||!this.scrollTarget.offsetHeight)return;e=this._clamp(e,0,this.size-1);const t=this.__getVisibleElements().length;let i=Math.floor(e/this.size*this._virtualCount);this._virtualCount-i<t?(i=this._virtualCount-(this.size-e),this._vidxOffset=this.size-this._virtualCount):i<t?e<OFFSET_ADJUST_MIN_THRESHOLD?(i=e,this._vidxOffset=0):(i=OFFSET_ADJUST_MIN_THRESHOLD,this._vidxOffset=e-i):this._vidxOffset=e-i,this.__skipNextVirtualIndexAdjust=!0,super.scrollToIndex(i),this.adjustedFirstVisibleIndex!==e&&this._scrollTop<this._maxScrollTop&&!this.grid&&(this._scrollTop-=this.__getIndexScrollOffset(e)||0),this._scrollHandler()}flush(){0!==this.scrollTarget.offsetHeight&&(this._resizeHandler(),flush(),this._scrollHandler(),this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.flush(),this.__scrollReorderDebouncer&&this.__scrollReorderDebouncer.flush(),this.__debouncerWheelAnimationFrame&&this.__debouncerWheelAnimationFrame.flush())}update(e=0,t=this.size-1){this.__getVisibleElements().forEach((i=>{i.__virtualIndex>=e&&i.__virtualIndex<=t&&this.__updateElement(i,i.__virtualIndex,!0)}))}_updateMetrics(e){flush();let t=0,i=0;const o=this._physicalAverageCount,n=this._physicalAverage;this._iterateItems(((e,o)=>{i+=this._physicalSizes[e],this._physicalSizes[e]=Math.ceil(this.__getBorderBoxHeight(this._physicalItems[e])),t+=this._physicalSizes[e],this._physicalAverageCount+=this._physicalSizes[e]?1:0}),e),this._physicalSize=this._physicalSize+t-i,this._physicalAverageCount!==o&&(this._physicalAverage=Math.round((n*o+t)/this._physicalAverageCount))}__getBorderBoxHeight(e){const t=getComputedStyle(e),i=parseFloat(t.height)||0;if("border-box"===t.boxSizing)return i;return i+(parseFloat(t.paddingBottom)||0)+(parseFloat(t.paddingTop)||0)+(parseFloat(t.borderBottomWidth)||0)+(parseFloat(t.borderTopWidth)||0)}__updateElement(e,t,i){e.style.paddingTop&&(e.style.paddingTop=""),this.__preventElementUpdates||e.__lastUpdatedIndex===t&&!i||(this.updateElement(e,t),e.__lastUpdatedIndex=t);const o=e.offsetHeight;if(0===o)e.style.paddingTop=`${this.__placeholderHeight}px`,requestAnimationFrame((()=>this._resizeHandler()));else{this.__elementHeightQueue.push(o),this.__elementHeightQueue.shift();const e=this.__elementHeightQueue.filter((e=>void 0!==e));this.__placeholderHeight=Math.round(e.reduce(((e,t)=>e+t),0)/e.length)}}__getIndexScrollOffset(e){const t=this.__getVisibleElements().find((t=>t.__virtualIndex===e));return t?this.scrollTarget.getBoundingClientRect().top-t.getBoundingClientRect().top:void 0}get size(){return this.__size}set size(e){if(e===this.size)return;let t,i;if(this.__fixInvalidItemPositioningDebouncer&&this.__fixInvalidItemPositioningDebouncer.cancel(),this._debouncers&&this._debouncers._increasePoolIfNeeded&&this._debouncers._increasePoolIfNeeded.cancel(),this.__preventElementUpdates=!0,e>0&&(t=this.adjustedFirstVisibleIndex,i=this.__getIndexScrollOffset(t)),this.__size=e,this._itemsChanged({path:"items"}),flush(),e>0){t=Math.min(t,e-1),this.scrollToIndex(t);const o=this.__getIndexScrollOffset(t);void 0!==i&&void 0!==o&&(this._scrollTop+=i-o)}this.elementsContainer.children.length||requestAnimationFrame((()=>this._resizeHandler())),this.__preventElementUpdates=!1,this._resizeHandler(),flush()}get _scrollTop(){return this.scrollTarget.scrollTop}set _scrollTop(e){this.scrollTarget.scrollTop=e}get items(){return{length:Math.min(this.size,MAX_VIRTUAL_COUNT)}}get offsetHeight(){return this.scrollTarget.offsetHeight}get $(){return{items:this.scrollContainer}}updateViewportBoundaries(){const e=window.getComputedStyle(this.scrollTarget);this._scrollerPaddingTop=this.scrollTarget===this?0:parseInt(e["padding-top"],10),this._isRTL=Boolean("rtl"===e.direction),this._viewportWidth=this.elementsContainer.offsetWidth,this._viewportHeight=this.scrollTarget.offsetHeight,this._scrollPageHeight=this._viewportHeight-this._scrollLineHeight,this.grid&&this._updateGridMetrics()}setAttribute(){}_createPool(e){const t=this.createElements(e),i=document.createDocumentFragment();return t.forEach((e=>{e.style.position="absolute",i.appendChild(e),this.__resizeObserver.observe(e)})),this.elementsContainer.appendChild(i),t}_assignModels(e){this._iterateItems(((e,t)=>{const i=this._physicalItems[e];i.hidden=t>=this.size,i.hidden?delete i.__lastUpdatedIndex:(i.__virtualIndex=t+(this._vidxOffset||0),this.__updateElement(i,i.__virtualIndex))}),e)}_isClientFull(){return setTimeout((()=>{this.__clientFull=!0})),this.__clientFull||super._isClientFull()}translate3d(e,t,i,o){o.style.transform=`translateY(${t})`}toggleScrollListener(){}_scrollHandler(){if(0===this.scrollTarget.offsetHeight)return;this._adjustVirtualIndexOffset(this._scrollTop-(this.__previousScrollTop||0));const e=this.scrollTarget.scrollTop-this._scrollPosition;if(super._scrollHandler(),0!==this._physicalCount){const t=e>=0,i=this._getReusables(!t);i.indexes.length&&(this._physicalTop=i.physicalTop,t?(this._virtualStart-=i.indexes.length,this._physicalStart-=i.indexes.length):(this._virtualStart+=i.indexes.length,this._physicalStart+=i.indexes.length),this._resizeHandler())}e&&(this.__fixInvalidItemPositioningDebouncer=Debouncer.debounce(this.__fixInvalidItemPositioningDebouncer,timeOut.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),(()=>this.__fixInvalidItemPositioning()))),this.reorderElements&&(this.__scrollReorderDebouncer=Debouncer.debounce(this.__scrollReorderDebouncer,timeOut.after(this.timeouts.SCROLL_REORDER),(()=>this.__reorderElements()))),this.__previousScrollTop=this._scrollTop,0===this._scrollTop&&0!==this.firstVisibleIndex&&Math.abs(e)>0&&this.scrollToIndex(0)}__fixInvalidItemPositioning(){if(!this.scrollTarget.isConnected)return;const e=this._physicalTop>this._scrollTop,t=this._physicalBottom<this._scrollBottom,i=0===this.adjustedFirstVisibleIndex,o=this.adjustedLastVisibleIndex===this.size-1;if(e&&!i||t&&!o){const e=t,i=this._ratio;this._ratio=0,this._scrollPosition=this._scrollTop+(e?-1:1),this._scrollHandler(),this._ratio=i}}__onWheel(e){if(e.ctrlKey||this._hasScrolledAncestor(e.target,e.deltaX,e.deltaY))return;let t=e.deltaY;if(e.deltaMode===WheelEvent.DOM_DELTA_LINE?t*=this._scrollLineHeight:e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._scrollPageHeight),this._deltaYAcc=this._deltaYAcc||0,this._wheelAnimationFrame)return this._deltaYAcc+=t,void e.preventDefault();t+=this._deltaYAcc,this._deltaYAcc=0,this._wheelAnimationFrame=!0,this.__debouncerWheelAnimationFrame=Debouncer.debounce(this.__debouncerWheelAnimationFrame,animationFrame,(()=>{this._wheelAnimationFrame=!1}));const i=Math.abs(e.deltaX)+Math.abs(t);this._canScroll(this.scrollTarget,e.deltaX,t)?(e.preventDefault(),this.scrollTarget.scrollTop+=t,this.scrollTarget.scrollLeft+=e.deltaX,this._hasResidualMomentum=!0,this._ignoreNewWheel=!0,this._debouncerIgnoreNewWheel=Debouncer.debounce(this._debouncerIgnoreNewWheel,timeOut.after(this.timeouts.IGNORE_WHEEL),(()=>{this._ignoreNewWheel=!1}))):this._hasResidualMomentum&&i<=this._previousMomentum||this._ignoreNewWheel?e.preventDefault():i>this._previousMomentum&&(this._hasResidualMomentum=!1),this._previousMomentum=i}_hasScrolledAncestor(e,t,i){return e!==this.scrollTarget&&e!==this.scrollTarget.getRootNode().host&&(!(!this._canScroll(e,t,i)||-1===["auto","scroll"].indexOf(getComputedStyle(e).overflow))||(e!==this&&e.parentElement?this._hasScrolledAncestor(e.parentElement,t,i):void 0))}_canScroll(e,t,i){return i>0&&e.scrollTop<e.scrollHeight-e.offsetHeight||i<0&&e.scrollTop>0||t>0&&e.scrollLeft<e.scrollWidth-e.offsetWidth||t<0&&e.scrollLeft>0}_getScrollLineHeight(){const e=document.createElement("div");e.style.fontSize="initial",e.style.display="none",document.body.appendChild(e);const t=window.getComputedStyle(e).fontSize;return document.body.removeChild(e),t?window.parseInt(t):void 0}__getVisibleElements(){return Array.from(this.elementsContainer.children).filter((e=>!e.hidden))}__reorderElements(){if(this.__mouseDown)return void(this.__pendingReorder=!0);this.__pendingReorder=!1;const e=this._virtualStart+(this._vidxOffset||0),t=this.__getVisibleElements(),i=t.find((e=>e.contains(this.elementsContainer.getRootNode().activeElement)||e.contains(this.scrollTarget.getRootNode().activeElement)))||t[0];if(!i)return;const o=i.__virtualIndex-e,n=t.indexOf(i)-o;if(n>0)for(let e=0;e<n;e++)this.elementsContainer.appendChild(t[e]);else if(n<0)for(let e=t.length+n;e<t.length;e++)this.elementsContainer.insertBefore(t[e],t[0]);if(isSafari){const{transform:e}=this.scrollTarget.style;this.scrollTarget.style.transform="translateZ(0)",setTimeout((()=>{this.scrollTarget.style.transform=e}))}}_adjustVirtualIndexOffset(e){if(this._virtualCount>=this.size)this._vidxOffset=0;else if(this.__skipNextVirtualIndexAdjust)this.__skipNextVirtualIndexAdjust=!1;else if(Math.abs(e)>1e4){const e=this._scrollTop/(this.scrollTarget.scrollHeight-this.scrollTarget.offsetHeight),t=e*this.size;this._vidxOffset=Math.round(t-e*this._virtualCount)}else{const e=this._vidxOffset,t=OFFSET_ADJUST_MIN_THRESHOLD,i=100;0===this._scrollTop?(this._vidxOffset=0,e!==this._vidxOffset&&super.scrollToIndex(0)):this.firstVisibleIndex<t&&this._vidxOffset>0&&(this._vidxOffset-=Math.min(this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex+(e-this._vidxOffset)));const o=this.size-this._virtualCount;this._scrollTop>=this._maxScrollTop&&this._maxScrollTop>0?(this._vidxOffset=o,e!==this._vidxOffset&&super.scrollToIndex(this._virtualCount-1)):this.firstVisibleIndex>this._virtualCount-t&&this._vidxOffset<o&&(this._vidxOffset+=Math.min(o-this._vidxOffset,i),super.scrollToIndex(this.firstVisibleIndex-(this._vidxOffset-e)))}}}Object.setPrototypeOf(IronListAdapter.prototype,ironList);class Virtualizer{constructor(e){this.__adapter=new IronListAdapter(e)}get size(){return this.__adapter.size}set size(e){this.__adapter.size=e}scrollToIndex(e){this.__adapter.scrollToIndex(e)}update(e=0,t=this.size-1){this.__adapter.update(e,t)}flush(){this.__adapter.flush()}get firstVisibleIndex(){return this.__adapter.adjustedFirstVisibleIndex}get lastVisibleIndex(){return this.__adapter.adjustedLastVisibleIndex}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const A11yMixin=e=>class extends e{static get observers(){return["_a11yUpdateGridSize(size, _columnTree, _columnTree.*)"]}_a11yGetHeaderRowCount(e){return e.filter((e=>e.some((e=>e.headerRenderer||e.path||e.header)))).length}_a11yGetFooterRowCount(e){return e.filter((e=>e.some((e=>e.headerRenderer)))).length}_a11yUpdateGridSize(e,t){if(void 0===e||void 0===t)return;const i=t[t.length-1];this.$.table.setAttribute("aria-rowcount",e+this._a11yGetHeaderRowCount(t)+this._a11yGetFooterRowCount(t)),this.$.table.setAttribute("aria-colcount",i&&i.length||0),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows()}_a11yUpdateHeaderRows(){Array.from(this.$.header.children).forEach(((e,t)=>e.setAttribute("aria-rowindex",t+1)))}_a11yUpdateFooterRows(){Array.from(this.$.footer.children).forEach(((e,t)=>e.setAttribute("aria-rowindex",this._a11yGetHeaderRowCount(this._columnTree)+this.size+t+1)))}_a11yUpdateRowRowindex(e,t){e.setAttribute("aria-rowindex",t+this._a11yGetHeaderRowCount(this._columnTree)+1)}_a11yUpdateRowSelected(e,t){e.setAttribute("aria-selected",Boolean(t)),Array.from(e.children).forEach((e=>e.setAttribute("aria-selected",Boolean(t))))}_a11yUpdateRowExpanded(e){this.__isRowExpandable(e)?e.setAttribute("aria-expanded","false"):this.__isRowCollapsible(e)?e.setAttribute("aria-expanded","true"):e.removeAttribute("aria-expanded")}_a11yUpdateRowLevel(e,t){t>0||this.__isRowCollapsible(e)||this.__isRowExpandable(e)?e.setAttribute("aria-level",t+1):e.removeAttribute("aria-level")}_a11ySetRowDetailsCell(e,t){Array.from(e.children).forEach((e=>{e!==t&&e.setAttribute("aria-controls",t.id)}))}_a11yUpdateCellColspan(e,t){e.setAttribute("aria-colspan",Number(t))}_a11yUpdateSorters(){Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((e=>{let t=e.parentNode;for(;t&&"vaadin-grid-cell-content"!==t.localName;)t=t.parentNode;if(t&&t.assignedSlot){t.assignedSlot.parentNode.setAttribute("aria-sort",{asc:"ascending",desc:"descending"}[String(e.direction)]||"none")}}))}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ActiveItemMixin=e=>class extends e{static get properties(){return{activeItem:{type:Object,notify:!0,value:null}}}ready(){super.ready(),this.$.scroller.addEventListener("click",this._onClick.bind(this)),this.addEventListener("cell-activate",this._activateItem.bind(this)),this.addEventListener("row-activate",this._activateItem.bind(this))}_activateItem(e){const t=e.detail.model,i=t?t.item:null;i&&(this.activeItem=this._itemsEqual(this.activeItem,i)?null:i)}_onClick(e){if(e.defaultPrevented)return;const t=e.composedPath(),i=t[t.indexOf(this.$.table)-3];if(!i||i.getAttribute("part").indexOf("details-cell")>-1)return;const o=i._content,n=this.getRootNode().activeElement;o.contains(n)||this._isFocusable(e.target)||e.target instanceof HTMLLabelElement||this.dispatchEvent(new CustomEvent("cell-activate",{detail:{model:this.__getRowModel(i.parentElement)}}))}_isFocusable(e){return isFocusable(e)}},isFocusable=e=>{if(!e.parentNode)return!1;const t=Array.from(e.parentNode.querySelectorAll("[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]")).filter((e=>{const t=e.getAttribute("part");return!(t&&t.includes("body-cell"))})).includes(e);return!e.disabled&&t&&e.offsetParent&&"hidden"!==getComputedStyle(e).visibility};function get(e,t){return e.split(".").reduce(((e,t)=>e[t]),t)}function checkPaths(e,t,i){if(0===i.length)return!1;let o=!0;return e.forEach((({path:e})=>{if(!e||-1===e.indexOf("."))return;void 0===get(e.replace(/\.[^.]*$/,""),i[0])&&(console.warn(`Path "${e}" used for ${t} does not exist in all of the items, ${t} is disabled.`),o=!1)})),o}function multiSort(e,t){return e.sort(((e,i)=>t.map((t=>"asc"===t.direction?compare(get(t.path,e),get(t.path,i)):"desc"===t.direction?compare(get(t.path,i),get(t.path,e)):0)).reduce(((e,t)=>0!==e?e:t),0)))}function normalizeEmptyValue(e){return[void 0,null].indexOf(e)>=0?"":isNaN(e)?e.toString():e}function compare(e,t){return(e=normalizeEmptyValue(e))<(t=normalizeEmptyValue(t))?-1:e>t?1:0}function filter(e,t){return e.filter((e=>t.every((t=>{const i=normalizeEmptyValue(get(t.path,e)),o=normalizeEmptyValue(t.value).toString().toLowerCase();return i.toString().toLowerCase().includes(o)}))))}const createArrayDataProvider=e=>(t,i)=>{let o=e?[...e]:[];t.filters&&checkPaths(t.filters,"filtering",o)&&(o=filter(o,t.filters)),Array.isArray(t.sortOrders)&&t.sortOrders.length&&checkPaths(t.sortOrders,"sorting",o)&&(o=multiSort(o,t.sortOrders));const n=Math.min(o.length,t.pageSize),s=t.page*n,r=s+n;i(o.slice(s,r),o.length)},ArrayDataProviderMixin=e=>class extends e{static get properties(){return{items:Array}}static get observers(){return["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)"]}__setArrayDataProvider(e){const t=createArrayDataProvider(this.items);t.__items=e,this.setProperties({_arrayDataProvider:t,size:e.length,dataProvider:t})}__dataProviderOrItemsChanged(e,t,i){i&&(this._arrayDataProvider?e!==this._arrayDataProvider?this.setProperties({_arrayDataProvider:void 0,items:void 0}):t?this._arrayDataProvider.__items===t?(this.clearCache(),this.size=this._effectiveSize):this.__setArrayDataProvider(t):(this.setProperties({_arrayDataProvider:void 0,dataProvider:void 0,size:0}),this.clearCache()):t&&this.__setArrayDataProvider(t))}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function updateColumnOrders(e,t,i){let o=1;e.forEach((e=>{o%10==0&&(o+=1),e._order=i+o*t,o+=1}))}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ColumnReorderingMixin=e=>class extends e{static get properties(){return{columnReorderingAllowed:{type:Boolean,value:!1},_orderBaseScope:{type:Number,value:1e7}}}static get observers(){return["_updateOrders(_columnTree)"]}ready(){super.ready(),addListener(this,"track",this._onTrackEvent),this._reorderGhost=this.shadowRoot.querySelector('[part="reorder-ghost"]'),this.addEventListener("touchstart",this._onTouchStart.bind(this)),this.addEventListener("touchmove",this._onTouchMove.bind(this)),this.addEventListener("touchend",this._onTouchEnd.bind(this)),this.addEventListener("contextmenu",this._onContextMenu.bind(this))}_onContextMenu(e){this.hasAttribute("reordering")&&(e.preventDefault(),isTouch||this._onTrackEnd())}_onTouchStart(e){this._startTouchReorderTimeout=setTimeout((()=>{this._onTrackStart({detail:{x:e.touches[0].clientX,y:e.touches[0].clientY}})}),100)}_onTouchMove(e){this._draggedColumn&&e.preventDefault(),clearTimeout(this._startTouchReorderTimeout)}_onTouchEnd(){clearTimeout(this._startTouchReorderTimeout),this._onTrackEnd()}_onTrackEvent(e){if("start"===e.detail.state){const t=e.composedPath(),i=t[t.indexOf(this.$.header)-2];if(!i||!i._content)return;if(i._content.contains(this.getRootNode().activeElement))return;if(this.$.scroller.hasAttribute("column-resizing"))return;this._touchDevice||this._onTrackStart(e)}else"track"===e.detail.state?this._onTrack(e):"end"===e.detail.state&&this._onTrackEnd(e)}_onTrackStart(e){if(!this.columnReorderingAllowed)return;const t=e.composedPath&&e.composedPath();if(t&&t.some((e=>e.hasAttribute&&e.hasAttribute("draggable"))))return;const i=this._cellFromPoint(e.detail.x,e.detail.y);if(i&&i.getAttribute("part").includes("header-cell")){for(this.toggleAttribute("reordering",!0),this._draggedColumn=i._column;1===this._draggedColumn.parentElement.childElementCount;)this._draggedColumn=this._draggedColumn.parentElement;this._setSiblingsReorderStatus(this._draggedColumn,"allowed"),this._draggedColumn._reorderStatus="dragging",this._updateGhost(i),this._reorderGhost.style.visibility="visible",this._updateGhostPosition(e.detail.x,this._touchDevice?e.detail.y-50:e.detail.y),this._autoScroller()}}_onTrack(e){if(!this._draggedColumn)return;const t=this._cellFromPoint(e.detail.x,e.detail.y);if(!t)return;const i=this._getTargetColumn(t,this._draggedColumn);if(this._isSwapAllowed(this._draggedColumn,i)&&this._isSwappableByPosition(i,e.detail.x)){const e=this._columnTree.findIndex((e=>e.includes(i))),t=this._getColumnsInOrder(e),o=t.indexOf(this._draggedColumn),n=t.indexOf(i),s=o<n?1:-1;for(let e=o;e!==n;e+=s)this._swapColumnOrders(this._draggedColumn,t[e+s])}this._updateGhostPosition(e.detail.x,this._touchDevice?e.detail.y-50:e.detail.y),this._lastDragClientX=e.detail.x}_onTrackEnd(){this._draggedColumn&&(this.toggleAttribute("reordering",!1),this._draggedColumn._reorderStatus="",this._setSiblingsReorderStatus(this._draggedColumn,""),this._draggedColumn=null,this._lastDragClientX=null,this._reorderGhost.style.visibility="hidden",this.dispatchEvent(new CustomEvent("column-reorder",{detail:{columns:this._getColumnsInOrder()}})))}_getColumnsInOrder(e=this._columnTree.length-1){return this._columnTree[e].filter((e=>!e.hidden)).sort(((e,t)=>e._order-t._order))}_cellFromPoint(e,t){e=e||0,t=t||0,this._draggedColumn||this.$.scroller.toggleAttribute("no-content-pointer-events",!0);const i=this.shadowRoot.elementFromPoint(e,t);if(this.$.scroller.toggleAttribute("no-content-pointer-events",!1),i&&i._column)return i}_updateGhostPosition(e,t){const i=this._reorderGhost.getBoundingClientRect(),o=e-i.width/2,n=t-i.height/2,s=parseInt(this._reorderGhost._left||0),r=parseInt(this._reorderGhost._top||0);this._reorderGhost._left=s-(i.left-o),this._reorderGhost._top=r-(i.top-n),this._reorderGhost.style.transform=`translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`}_updateGhost(e){const t=this._reorderGhost;t.textContent=e._content.innerText;const i=window.getComputedStyle(e);return["boxSizing","display","width","height","background","alignItems","padding","border","flex-direction","overflow"].forEach((e=>{t.style[e]=i[e]})),t}_updateOrders(e){void 0!==e&&(e[0].forEach((e=>{e._order=0})),updateColumnOrders(e[0],this._orderBaseScope,0))}_setSiblingsReorderStatus(e,t){Array.from(e.parentNode.children).filter((t=>/column/.test(t.localName)&&this._isSwapAllowed(t,e))).forEach((e=>{e._reorderStatus=t}))}_autoScroller(){if(this._lastDragClientX){const e=this._lastDragClientX-this.getBoundingClientRect().right+50,t=this.getBoundingClientRect().left-this._lastDragClientX+50;e>0?this.$.table.scrollLeft+=e/10:t>0&&(this.$.table.scrollLeft-=t/10)}this._draggedColumn&&setTimeout((()=>this._autoScroller()),10)}_isSwapAllowed(e,t){if(e&&t){const i=e!==t,o=e.parentElement===t.parentElement,n=e.frozen&&t.frozen||e.frozenToEnd&&t.frozenToEnd||!e.frozen&&!e.frozenToEnd&&!t.frozen&&!t.frozenToEnd;return i&&o&&n}}_isSwappableByPosition(e,t){const i=Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find((t=>e.contains(t._column))),o=this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(),n=i.getBoundingClientRect();return n.left>o.left?t>n.right-o.width:t<n.left+o.width}_swapColumnOrders(e,t){[e._order,t._order]=[t._order,e._order],this._debounceUpdateFrozenColumn(),this._updateFirstAndLastColumn()}_getTargetColumn(e,t){if(e&&t){let i=e._column;for(;i.parentElement!==t.parentElement&&i!==this;)i=i.parentElement;return i.parentElement===t.parentElement?i:e._column}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ColumnResizingMixin=e=>class extends e{ready(){super.ready();const e=this.$.scroller;addListener(e,"track",this._onHeaderTrack.bind(this)),e.addEventListener("touchmove",(t=>e.hasAttribute("column-resizing")&&t.preventDefault())),e.addEventListener("contextmenu",(e=>"resize-handle"===e.target.getAttribute("part")&&e.preventDefault())),e.addEventListener("mousedown",(e=>"resize-handle"===e.target.getAttribute("part")&&e.preventDefault()))}_onHeaderTrack(e){const t=e.target;if("resize-handle"===t.getAttribute("part")){let i=t.parentElement._column;for(this.$.scroller.toggleAttribute("column-resizing",!0);"vaadin-grid-column-group"===i.localName;)i=i._childColumns.slice(0).sort(((e,t)=>e._order-t._order)).filter((e=>!e.hidden)).pop();const o=e.detail.x,n=Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')),s=n.find((e=>e._column===i));if(s.offsetWidth){const e=getComputedStyle(s._content),t=10+parseInt(e.paddingLeft)+parseInt(e.paddingRight)+parseInt(e.borderLeftWidth)+parseInt(e.borderRightWidth)+parseInt(e.marginLeft)+parseInt(e.marginRight);let n;const r=s.offsetWidth,a=s.getBoundingClientRect();n=s.hasAttribute("frozen-to-end")?r+(this.__isRTL?o-a.right:a.left-o):r+(this.__isRTL?a.left-o:o-a.right),i.width=`${Math.max(t,n)}px`,i.flexGrow=0}n.sort(((e,t)=>e._column._order-t._column._order)).forEach(((e,t,i)=>{t<i.indexOf(s)&&(e._column.width=`${e.offsetWidth}px`,e._column.flexGrow=0)}));const r=this._frozenToEndCells[0];if(r&&this.$.table.scrollWidth>this.$.table.offsetWidth){const e=r.getBoundingClientRect(),t=o-(this.__isRTL?e.right:e.left);(this.__isRTL&&t<=0||!this.__isRTL&&t>=0)&&(this.$.table.scrollLeft+=t)}"end"===e.detail.state&&(this.$.scroller.toggleAttribute("column-resizing",!1),this.dispatchEvent(new CustomEvent("column-resize",{detail:{resizedColumn:i}}))),this._resizeHandler()}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ItemCache=class e{constructor(e,t,i){this.grid=e,this.parentCache=t,this.parentItem=i,this.itemCaches={},this.items={},this.effectiveSize=0,this.size=0,this.pendingRequests={}}isLoading(){return Boolean(Object.keys(this.pendingRequests).length||Object.keys(this.itemCaches).filter((e=>this.itemCaches[e].isLoading()))[0])}getItemForIndex(e){const{cache:t,scaledIndex:i}=this.getCacheAndIndex(e);return t.items[i]}updateSize(){this.effectiveSize=!this.parentItem||this.grid._isExpanded(this.parentItem)?this.size+Object.keys(this.itemCaches).reduce(((e,t)=>{const i=this.itemCaches[t];return i.updateSize(),e+i.effectiveSize}),0):0}ensureSubCacheForScaledIndex(t){if(!this.itemCaches[t]){const i=new e(this.grid,this,this.items[t]);this.itemCaches[t]=i,this.grid._loadPage(0,i)}}getCacheAndIndex(e){let t=e;const i=Object.keys(this.itemCaches);for(let e=0;e<i.length;e++){const o=Number(i[e]),n=this.itemCaches[o];if(t<=o)return{cache:this,scaledIndex:t};if(t<=o+n.effectiveSize)return n.getCacheAndIndex(t-o-1);t-=n.effectiveSize}return{cache:this,scaledIndex:t}}},DataProviderMixin=e=>class extends e{static get properties(){return{size:{type:Number,notify:!0},pageSize:{type:Number,value:50,observer:"_pageSizeChanged"},dataProvider:{type:Object,notify:!0,observer:"_dataProviderChanged"},loading:{type:Boolean,notify:!0,readOnly:!0,reflectToAttribute:!0},_cache:{type:Object,value(){return new ItemCache(this)}},_hasData:{type:Boolean,value:!1},itemHasChildrenPath:{type:String,value:"children"},itemIdPath:{type:String,value:null},expandedItems:{type:Object,notify:!0,value:()=>[]},__expandedKeys:{type:Object,computed:"__computeExpandedKeys(itemIdPath, expandedItems.*)"}}}static get observers(){return["_sizeChanged(size)","_expandedItemsChanged(expandedItems.*)"]}_sizeChanged(e){const t=e-this._cache.size;this._cache.size+=t,this._cache.effectiveSize+=t,this._effectiveSize=this._cache.effectiveSize}_getItem(e,t){if(e>=this._effectiveSize)return;t.index=e;const{cache:i,scaledIndex:o}=this._cache.getCacheAndIndex(e),n=i.items[o];n?(t.toggleAttribute("loading",!1),this._updateItem(t,n),this._isExpanded(n)&&i.ensureSubCacheForScaledIndex(o)):(t.toggleAttribute("loading",!0),this._loadPage(this._getPageForIndex(o),i))}getItemId(e){return this.itemIdPath?this.get(this.itemIdPath,e):e}_isExpanded(e){return this.__expandedKeys.has(this.getItemId(e))}_expandedItemsChanged(){this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,this.__updateVisibleRows()}__computeExpandedKeys(e,t){const i=t.base||[],o=new Set;return i.forEach((e=>{o.add(this.getItemId(e))})),o}expandItem(e){this._isExpanded(e)||(this.expandedItems=[...this.expandedItems,e])}collapseItem(e){this._isExpanded(e)&&(this.expandedItems=this.expandedItems.filter((t=>!this._itemsEqual(t,e))))}_getIndexLevel(e){let{cache:t}=this._cache.getCacheAndIndex(e),i=0;for(;t.parentCache;)t=t.parentCache,i+=1;return i}_loadPage(e,t){if(!t.pendingRequests[e]&&this.dataProvider){this._setLoading(!0),t.pendingRequests[e]=!0;const i={page:e,pageSize:this.pageSize,sortOrders:this._mapSorters(),filters:this._mapFilters(),parentItem:t.parentItem};this.dataProvider(i,((o,n)=>{void 0!==n?t.size=n:i.parentItem&&(t.size=o.length);const s=Array.from(this.$.items.children).map((e=>e._item));o.forEach(((i,o)=>{const n=e*this.pageSize+o;t.items[n]=i,this._isExpanded(i)&&s.indexOf(i)>-1&&t.ensureSubCacheForScaledIndex(n)})),this._hasData=!0,delete t.pendingRequests[e],this._debouncerApplyCachedData=Debouncer.debounce(this._debouncerApplyCachedData,timeOut.after(0),(()=>{this._setLoading(!1),this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,Array.from(this.$.items.children).filter((e=>!e.hidden)).forEach((e=>{this._cache.getItemForIndex(e.index)&&this._getItem(e.index,e)})),this.__scrollToPendingIndex(),this.__dispatchPendingBodyCellFocus()})),this._cache.isLoading()||this._debouncerApplyCachedData.flush(),this.__itemsReceived()}))}}_getPageForIndex(e){return Math.floor(e/this.pageSize)}clearCache(){this._cache=new ItemCache(this),this._cache.size=this.size||0,this._cache.updateSize(),this._hasData=!1,this.__updateVisibleRows(),this._effectiveSize||this._loadPage(0,this._cache)}_pageSizeChanged(e,t){void 0!==t&&e!==t&&this.clearCache()}_checkSize(){void 0===this.size&&0===this._effectiveSize&&console.warn("The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.")}_dataProviderChanged(e,t){void 0!==t&&this.clearCache(),this._ensureFirstPageLoaded(),this._debouncerCheckSize=Debouncer.debounce(this._debouncerCheckSize,timeOut.after(2e3),this._checkSize.bind(this))}_ensureFirstPageLoaded(){this._hasData||this._loadPage(0,this._cache)}_itemsEqual(e,t){return this.getItemId(e)===this.getItemId(t)}_getItemIndexInArray(e,t){let i=-1;return t.forEach(((t,o)=>{this._itemsEqual(t,e)&&(i=o)})),i}scrollToIndex(e){super.scrollToIndex(e),isNaN(e)||!this._cache.isLoading()&&this.clientHeight||(this.__pendingScrollToIndex=e)}__scrollToPendingIndex(){if(this.__pendingScrollToIndex&&this.$.items.children.length){const e=this.__pendingScrollToIndex;delete this.__pendingScrollToIndex,this.scrollToIndex(e)}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,DropMode={BETWEEN:"between",ON_TOP:"on-top",ON_TOP_OR_BETWEEN:"on-top-or-between",ON_GRID:"on-grid"},DropLocation={ON_TOP:"on-top",ABOVE:"above",BELOW:"below",EMPTY:"empty"},usesDnDPolyfill=!("draggable"in document.createElement("div")),DragAndDropMixin=e=>class extends e{static get properties(){return{dropMode:String,rowsDraggable:Boolean,dragFilter:Function,dropFilter:Function,__dndAutoScrollThreshold:{value:50}}}static get observers(){return["_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)"]}ready(){super.ready(),this.$.table.addEventListener("dragstart",this._onDragStart.bind(this)),this.$.table.addEventListener("dragend",this._onDragEnd.bind(this)),this.$.table.addEventListener("dragover",this._onDragOver.bind(this)),this.$.table.addEventListener("dragleave",this._onDragLeave.bind(this)),this.$.table.addEventListener("drop",this._onDrop.bind(this)),this.$.table.addEventListener("dragenter",(e=>{this.dropMode&&(e.preventDefault(),e.stopPropagation())}))}_onDragStart(e){if(this.rowsDraggable){let t=e.target;if("vaadin-grid-cell-content"===t.localName&&(t=t.assignedSlot.parentNode.parentNode),t.parentNode!==this.$.items)return;if(e.stopPropagation(),this.toggleAttribute("dragging-rows",!0),this._safari){const e=t.style.transform;t.style.top=/translateY\((.*)\)/.exec(e)[1],t.style.transform="none",requestAnimationFrame((()=>{t.style.top="",t.style.transform=e}))}const i=t.getBoundingClientRect();usesDnDPolyfill?e.dataTransfer.setDragImage(t):e.dataTransfer.setDragImage(t,e.clientX-i.left,e.clientY-i.top);let o=[t];this._isSelected(t._item)&&(o=this.__getViewportRows().filter((e=>this._isSelected(e._item))).filter((e=>!this.dragFilter||this.dragFilter(this.__getRowModel(e))))),e.dataTransfer.setData("text",this.__formatDefaultTransferData(o)),t.setAttribute("dragstart",o.length>1?o.length:""),this.style.setProperty("--_grid-drag-start-x",e.clientX-i.left+20+"px"),this.style.setProperty("--_grid-drag-start-y",e.clientY-i.top+10+"px"),requestAnimationFrame((()=>{t.removeAttribute("dragstart"),this.updateStyles({"--_grid-drag-start-x":"","--_grid-drag-start-y":""})}));const n=new CustomEvent("grid-dragstart",{detail:{draggedItems:o.map((e=>e._item)),setDragData:(t,i)=>e.dataTransfer.setData(t,i),setDraggedItemsCount:e=>t.setAttribute("dragstart",e)}});n.originalEvent=e,this.dispatchEvent(n)}}_onDragEnd(e){this.toggleAttribute("dragging-rows",!1),e.stopPropagation();const t=new CustomEvent("grid-dragend");t.originalEvent=e,this.dispatchEvent(t)}_onDragLeave(e){e.stopPropagation(),this._clearDragStyles()}_onDragOver(e){if(this.dropMode){if(this._dropLocation=void 0,this._dragOverItem=void 0,this.__dndAutoScroll(e.clientY))return void this._clearDragStyles();let t=e.composedPath().find((e=>"tr"===e.localName));if(this._effectiveSize&&this.dropMode!==DropMode.ON_GRID)if(t&&t.parentNode===this.$.items){const i=t.getBoundingClientRect();if(this._dropLocation=DropLocation.ON_TOP,this.dropMode===DropMode.BETWEEN){const t=e.clientY-i.top<i.bottom-e.clientY;this._dropLocation=t?DropLocation.ABOVE:DropLocation.BELOW}else this.dropMode===DropMode.ON_TOP_OR_BETWEEN&&(e.clientY-i.top<i.height/3?this._dropLocation=DropLocation.ABOVE:e.clientY-i.top>i.height/3*2&&(this._dropLocation=DropLocation.BELOW))}else{if(t)return;if(this.dropMode!==DropMode.BETWEEN&&this.dropMode!==DropMode.ON_TOP_OR_BETWEEN)return;t=Array.from(this.$.items.children).filter((e=>!e.hidden)).pop(),this._dropLocation=DropLocation.BELOW}else this._dropLocation=DropLocation.EMPTY;if(t&&t.hasAttribute("drop-disabled"))return void(this._dropLocation=void 0);e.stopPropagation(),e.preventDefault(),this._dropLocation===DropLocation.EMPTY?this.toggleAttribute("dragover",!0):t?(this._dragOverItem=t._item,t.getAttribute("dragover")!==this._dropLocation&&t.setAttribute("dragover",this._dropLocation)):this._clearDragStyles()}}__dndAutoScroll(e){if(this.__dndAutoScrolling)return!0;const t=this.$.header.getBoundingClientRect().bottom,i=this.$.footer.getBoundingClientRect().top,o=t-e+this.__dndAutoScrollThreshold,n=e-i+this.__dndAutoScrollThreshold;let s=0;if(n>0?s=2*n:o>0&&(s=2*-o),s){const e=this.$.table.scrollTop;this.$.table.scrollTop+=s;if(e!==this.$.table.scrollTop)return this.__dndAutoScrolling=!0,setTimeout((()=>{this.__dndAutoScrolling=!1}),20),!0}}__getViewportRows(){const e=this.$.header.getBoundingClientRect().bottom,t=this.$.footer.getBoundingClientRect().top;return Array.from(this.$.items.children).filter((i=>{const o=i.getBoundingClientRect();return o.bottom>e&&o.top<t}))}_clearDragStyles(){this.removeAttribute("dragover"),Array.from(this.$.items.children).forEach((e=>e.removeAttribute("dragover")))}_onDrop(e){if(this.dropMode){e.stopPropagation(),e.preventDefault();const t=e.dataTransfer.types&&Array.from(e.dataTransfer.types).map((t=>({type:t,data:e.dataTransfer.getData(t)})));this._clearDragStyles();const i=new CustomEvent("grid-drop",{bubbles:e.bubbles,cancelable:e.cancelable,detail:{dropTargetItem:this._dragOverItem,dropLocation:this._dropLocation,dragData:t}});i.originalEvent=e,this.dispatchEvent(i)}}__formatDefaultTransferData(e){return e.map((e=>Array.from(e.children).filter((e=>!e.hidden&&-1===e.getAttribute("part").indexOf("details-cell"))).sort(((e,t)=>e._column._order>t._column._order?1:-1)).map((e=>e._content.textContent.trim())).filter((e=>e)).join("\t"))).join("\n")}_dragDropAccessChanged(){this.filterDragAndDrop()}filterDragAndDrop(){Array.from(this.$.items.children).filter((e=>!e.hidden)).forEach((e=>{this._filterDragAndDrop(e,this.__getRowModel(e))}))}_filterDragAndDrop(e,t){const i=this.loading||e.hasAttribute("loading"),o=!this.rowsDraggable||i||this.dragFilter&&!this.dragFilter(t),n=!this.dropMode||i||this.dropFilter&&!this.dropFilter(t);Array.from(e.children).map((e=>e._content)).forEach((e=>{o?e.removeAttribute("draggable"):e.setAttribute("draggable",!0)})),e.toggleAttribute("drag-disabled",!!o),e.toggleAttribute("drop-disabled",!!n)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;function arrayEquals(e,t){if(!e||!t||e.length!==t.length)return!1;for(let i=0,o=e.length;i<o;i++)if(e[i]instanceof Array&&t[i]instanceof Array){if(!arrayEquals(e[i],t[i]))return!1}else if(e[i]!==t[i])return!1;return!0}const DynamicColumnsMixin=e=>class extends e{static get properties(){return{_columnTree:Object}}ready(){super.ready(),this._addNodeObserver()}_hasColumnGroups(e){for(let t=0;t<e.length;t++)if("vaadin-grid-column-group"===e[t].localName)return!0;return!1}_getChildColumns(e){return FlattenedNodesObserver.getFlattenedNodes(e).filter(this._isColumnElement)}_flattenColumnGroups(e){return e.map((e=>"vaadin-grid-column-group"===e.localName?this._getChildColumns(e):[e])).reduce(((e,t)=>e.concat(t)),[])}_getColumnTree(){const e=FlattenedNodesObserver.getFlattenedNodes(this).filter(this._isColumnElement),t=[e];let i=e;for(;this._hasColumnGroups(i);)i=this._flattenColumnGroups(i),t.push(i);return t}_updateColumnTree(){const e=this._getColumnTree();arrayEquals(e,this._columnTree)||(this._columnTree=e)}_addNodeObserver(){this._observer=new FlattenedNodesObserver(this,(e=>{const t=e=>e.filter(this._isColumnElement).length>0;if(t(e.addedNodes)||t(e.removedNodes)){const t=e.removedNodes.flatMap((e=>e._allCells)),i=e=>t.filter((t=>t&&t._content.contains(e))).length;this.__removeSorters(this._sorters.filter(i)),this.__removeFilters(this._filters.filter(i)),this._updateColumnTree()}this._debouncerCheckImports=Debouncer.debounce(this._debouncerCheckImports,timeOut.after(2e3),this._checkImports.bind(this)),this._ensureFirstPageLoaded()}))}_checkImports(){["vaadin-grid-column-group","vaadin-grid-filter","vaadin-grid-filter-column","vaadin-grid-tree-toggle","vaadin-grid-selection-column","vaadin-grid-sort-column","vaadin-grid-sorter"].forEach((e=>{const t=this.querySelector(e);!t||t instanceof PolymerElement||console.warn(`Make sure you have imported the required module for <${e}> element.`)}))}_updateFirstAndLastColumn(){Array.from(this.shadowRoot.querySelectorAll("tr")).forEach((e=>this._updateFirstAndLastColumnForRow(e)))}_updateFirstAndLastColumnForRow(e){Array.from(e.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort(((e,t)=>e._column._order-t._column._order)).forEach(((e,t,i)=>{e.toggleAttribute("first-column",0===t),e.toggleAttribute("last-column",t===i.length-1)}))}_isColumnElement(e){return e.nodeType===Node.ELEMENT_NODE&&/\bcolumn\b/.test(e.localName)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,EventContextMixin=e=>class extends e{getEventContext(e){const t={},i=e.__composedPath||e.composedPath(),o=i[i.indexOf(this.$.table)-3];return o?(t.section=["body","header","footer","details"].find((e=>o.getAttribute("part").indexOf(e)>-1)),o._column&&(t.column=o._column),"body"!==t.section&&"details"!==t.section||Object.assign(t,this.__getRowModel(o.parentElement)),t):t}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,FilterMixin=e=>class extends e{static get properties(){return{_filters:{type:Array,value:()=>[]}}}ready(){super.ready(),this.addEventListener("filter-changed",this._filterChanged.bind(this))}_filterChanged(e){e.stopPropagation(),this.__addFilter(e.target),this.__applyFilters()}__removeFilters(e){0!==e.length&&(this._filters=this._filters.filter((t=>e.indexOf(t)<0)),this.__applyFilters())}__addFilter(e){-1===this._filters.indexOf(e)&&this._filters.push(e)}__applyFilters(){this.dataProvider&&this.isAttached&&this.clearCache()}_mapFilters(){return this._filters.map((e=>({path:e.path,value:e.value})))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;function deserializeAttributeValue(e){return e?new Set(e.split(" ")):new Set}function serializeAttributeValue(e){return[...e].join(" ")}function addValueToAttribute(e,t,i){const o=deserializeAttributeValue(e.getAttribute(t));o.add(i),e.setAttribute(t,serializeAttributeValue(o))}function removeValueFromAttribute(e,t,i){const o=deserializeAttributeValue(e.getAttribute(t));o.delete(i),0!==o.size?e.setAttribute(t,serializeAttributeValue(o)):e.removeAttribute(t)}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const KeyboardNavigationMixin=e=>class extends e{static get properties(){return{_headerFocusable:{type:Object,observer:"_focusableChanged"},_itemsFocusable:{type:Object,observer:"_focusableChanged"},_footerFocusable:{type:Object,observer:"_focusableChanged"},_navigatingIsHidden:Boolean,_focusedItemIndex:{type:Number,value:0},_focusedColumnOrder:Number,_focusedCell:{type:Object,observer:"_focusedCellChanged"},interacting:{type:Boolean,value:!1,reflectToAttribute:!0,readOnly:!0,observer:"_interactingChanged"}}}ready(){super.ready(),this._ios||this._android||(this.addEventListener("keydown",this._onKeyDown),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("focusin",this._onFocusIn),this.addEventListener("focusout",this._onFocusOut),this.$.table.addEventListener("focusin",this._onContentFocusIn.bind(this)),this.addEventListener("mousedown",(()=>{this.toggleAttribute("navigating",!1),this._isMousedown=!0,this._focusedColumnOrder=void 0})),this.addEventListener("mouseup",(()=>{this._isMousedown=!1})))}get __rowFocusMode(){return this.__isRow(this._itemsFocusable)||this.__isRow(this._headerFocusable)||this.__isRow(this._footerFocusable)}set __rowFocusMode(e){["_itemsFocusable","_footerFocusable","_headerFocusable"].forEach((t=>{const i=this[t];if(e){const e=i&&i.parentElement;this.__isCell(i)?this[t]=e:this.__isCell(e)&&(this[t]=e.parentElement)}else if(!e&&this.__isRow(i)){const e=i.firstElementChild;this[t]=e._focusButton||e}}))}_focusableChanged(e,t){t&&t.setAttribute("tabindex","-1"),e&&this._updateGridSectionFocusTarget(e)}_focusedCellChanged(e,t){t&&removeValueFromAttribute(t,"part","focused-cell"),e&&addValueToAttribute(e,"part","focused-cell")}_interactingChanged(){this._updateGridSectionFocusTarget(this._headerFocusable),this._updateGridSectionFocusTarget(this._itemsFocusable),this._updateGridSectionFocusTarget(this._footerFocusable)}__updateItemsFocusable(){if(!this._itemsFocusable)return;const e=this.shadowRoot.activeElement===this._itemsFocusable;this._getVisibleRows().forEach((e=>{if(e.index===this._focusedItemIndex)if(this.__rowFocusMode)this._itemsFocusable=e;else{let t=this._itemsFocusable.parentElement,i=this._itemsFocusable;if(t){this.__isCell(t)&&(i=t,t=t.parentElement);const o=[...t.children].indexOf(i);this._itemsFocusable=this.__getFocusable(e,e.children[o])}}})),e&&this._itemsFocusable.focus()}_onKeyDown(e){const t=e.key;let i;switch(t){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"PageUp":case"PageDown":case"Home":case"End":i="Navigation";break;case"Enter":case"Escape":case"F2":i="Interaction";break;case"Tab":i="Tab";break;case" ":i="Space"}this._detectInteracting(e),this.interacting&&"Interaction"!==i&&(i=void 0),i&&this[`_on${i}KeyDown`](e,t)}_ensureScrolledToIndex(e){[...this.$.items.children].find((t=>t.index===e))?this.__scrollIntoViewport(e):this.scrollToIndex(e)}__isRowExpandable(e){if(this.itemHasChildrenPath){const t=e._item;return t&&this.get(this.itemHasChildrenPath,t)&&!this._isExpanded(t)}}__isRowCollapsible(e){return this._isExpanded(e._item)}__isDetailsCell(e){return e.matches('[part~="details-cell"]')}__isCell(e){return e instanceof HTMLTableCellElement}__isRow(e){return e instanceof HTMLTableRowElement}__getIndexOfChildElement(e){return Array.prototype.indexOf.call(e.parentNode.children,e)}_onNavigationKeyDown(e,t){e.preventDefault();const i=this._lastVisibleIndex-this._firstVisibleIndex-1;let o=0,n=0;switch(t){case"ArrowRight":o=this.__isRTL?-1:1;break;case"ArrowLeft":o=this.__isRTL?1:-1;break;case"Home":this.__rowFocusMode||e.ctrlKey?n=-1/0:o=-1/0;break;case"End":this.__rowFocusMode||e.ctrlKey?n=1/0:o=1/0;break;case"ArrowDown":n=1;break;case"ArrowUp":n=-1;break;case"PageDown":n=i;break;case"PageUp":n=-i}const s=e.composedPath().find((e=>this.__isRow(e))),r=e.composedPath().find((e=>this.__isCell(e)));if(this.__rowFocusMode&&!s||!this.__rowFocusMode&&!r)return;const a=this.__isRTL?"ArrowLeft":"ArrowRight",l=this.__isRTL?"ArrowRight":"ArrowLeft";if(t===a){if(this.__rowFocusMode)return this.__isRowExpandable(s)?void this.expandItem(s._item):(this.__rowFocusMode=!1,void this._onCellNavigation(s.firstElementChild,0,0))}else if(t===l)if(this.__rowFocusMode){if(this.__isRowCollapsible(s))return void this.collapseItem(s._item)}else{const e=[...s.children].sort(((e,t)=>e._order-t._order));if(r===e[0]||this.__isDetailsCell(r))return this.__rowFocusMode=!0,void this._onRowNavigation(s,0)}this.__rowFocusMode?this._onRowNavigation(s,n):this._onCellNavigation(r,o,n)}_onRowNavigation(e,t){const{dstRow:i}=this.__navigateRows(t,e);i&&i.focus()}__getIndexInGroup(e,t){return e.parentNode===this.$.items?void 0!==t?t:e.index:this.__getIndexOfChildElement(e)}__navigateRows(e,t,i){const o=this.__getIndexInGroup(t,this._focusedItemIndex),n=t.parentNode,s=(n===this.$.items?this._effectiveSize:n.children.length)-1;let r=Math.max(0,Math.min(o+e,s));if(n!==this.$.items){if(r>o)for(;r<s&&n.children[r].hidden;)r+=1;else if(r<o)for(;r>0&&n.children[r].hidden;)r-=1;return this.toggleAttribute("navigating",!0),{dstRow:n.children[r]}}let a=!1;if(i){const s=this.__isDetailsCell(i);if(n===this.$.items){const i=t._item,n=this._cache.getItemForIndex(r);a=s?0===e:1===e&&this._isDetailsOpened(i)||-1===e&&r!==o&&this._isDetailsOpened(n),a!==s&&(1===e&&a||-1===e&&!a)&&(r=o)}}return this._ensureScrolledToIndex(r),this._focusedItemIndex=r,this.toggleAttribute("navigating",!0),{dstRow:[...n.children].find((e=>!e.hidden&&e.index===r)),dstIsRowDetails:a}}_onCellNavigation(e,t,i){const o=e.parentNode,{dstRow:n,dstIsRowDetails:s}=this.__navigateRows(i,o,e);if(!n)return;const r=this.__getIndexOfChildElement(e),a=this.__isDetailsCell(e),l=o.parentNode,c=this.__getIndexInGroup(o,this._focusedItemIndex);if(void 0===this._focusedColumnOrder&&(this._focusedColumnOrder=a?0:this._getColumns(l,c).filter((e=>!e.hidden))[r]._order),s){[...n.children].find((e=>this.__isDetailsCell(e))).focus()}else{const e=this.__getIndexInGroup(n,this._focusedItemIndex),o=this._getColumns(l,e).filter((e=>!e.hidden)),s=o.map((e=>e._order)).sort(((e,t)=>e-t)),r=s.length-1,c=s.indexOf(s.slice(0).sort(((e,t)=>Math.abs(e-this._focusedColumnOrder)-Math.abs(t-this._focusedColumnOrder)))[0]),d=0===i&&a?c:Math.max(0,Math.min(c+t,r));d!==c&&(this._focusedColumnOrder=void 0);const g=o.reduce(((e,t,i)=>(e[t._order]=i,e)),{}),I=g[s[d]],h=n.children[I];this._scrollHorizontallyToCell(h),h.focus()}}_onInteractionKeyDown(e,t){const i=e.composedPath()[0],o="input"===i.localName&&!/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(i.type);let n;switch(t){case"Enter":n=!this.interacting||!o;break;case"Escape":n=!1;break;case"F2":n=!this.interacting}const{cell:s}=this._getGridEventLocation(e);if(this.interacting!==n&&null!==s)if(n){const t=s._content.querySelector("[focus-target]")||[...s._content.querySelectorAll("*")].find((e=>this._isFocusable(e)));t&&(e.preventDefault(),t.focus(),this._setInteracting(!0),this.toggleAttribute("navigating",!1))}else e.preventDefault(),this._focusedColumnOrder=void 0,s.focus(),this._setInteracting(!1),this.toggleAttribute("navigating",!0);"Escape"===t&&this._hideTooltip(!0)}_predictFocusStepTarget(e,t){const i=[this.$.table,this._headerFocusable,this._itemsFocusable,this._footerFocusable,this.$.focusexit];let o=i.indexOf(e);for(o+=t;o>=0&&o<=i.length-1;){let e=i[o];if(e&&!this.__rowFocusMode&&(e=i[o].parentNode),e&&!e.hidden)break;o+=t}let n=i[o];if(n&&!this.__isHorizontallyInViewport(n)){const e=this._getColumnsInOrder().find((e=>this.__isColumnInViewport(e)));if(e)if(n===this._headerFocusable)n=e._headerCell;else if(n===this._itemsFocusable){const t=n._column._cells.indexOf(n);n=e._cells[t]}else n===this._footerFocusable&&(n=e._footerCell)}return n}__isColumnInViewport(e){return!(!e.frozen&&!e.frozenToEnd)||this.__isHorizontallyInViewport(e._sizerCell)}__isHorizontallyInViewport(e){return e.offsetLeft+e.offsetWidth>=this._scrollLeft&&e.offsetLeft<=this._scrollLeft+this.clientWidth}_onTabKeyDown(e){const t=this._predictFocusStepTarget(e.composedPath()[0],e.shiftKey?-1:1);if(t){if(e.stopPropagation(),t===this.$.table)this.$.table.focus();else if(t===this.$.focusexit)this.$.focusexit.focus();else if(t===this._itemsFocusable){let i=t;const o=this.__isRow(t)?t:t.parentNode;if(this._ensureScrolledToIndex(this._focusedItemIndex),o.index!==this._focusedItemIndex&&this.__isCell(t)){const e=Array.from(o.children).indexOf(this._itemsFocusable),t=Array.from(this.$.items.children).find((e=>!e.hidden&&e.index===this._focusedItemIndex));t&&(i=t.children[e])}e.preventDefault(),i.focus()}else e.preventDefault(),t.focus();this.toggleAttribute("navigating",!0)}}_onSpaceKeyDown(e){e.preventDefault();const t=e.composedPath()[0],i=this.__isRow(t);!i&&t._content&&t._content.firstElementChild||this.dispatchEvent(new CustomEvent(i?"row-activate":"cell-activate",{detail:{model:this.__getRowModel(i?t:t.parentElement)}}))}_onKeyUp(e){if(!/^( |SpaceBar)$/.test(e.key)||this.interacting)return;e.preventDefault();const t=e.composedPath()[0];if(t._content&&t._content.firstElementChild){const i=this.hasAttribute("navigating");t._content.firstElementChild.dispatchEvent(new MouseEvent("click",{shiftKey:e.shiftKey,bubbles:!0,composed:!0,cancelable:!0})),this.toggleAttribute("navigating",i)}}_onFocusIn(e){this._isMousedown||this.toggleAttribute("navigating",!0);const t=e.composedPath()[0];t===this.$.table||t===this.$.focusexit?(this._predictFocusStepTarget(t,t===this.$.table?1:-1).focus(),this._setInteracting(!1)):this._detectInteracting(e)}_onFocusOut(e){this.toggleAttribute("navigating",!1),this._detectInteracting(e),this._hideTooltip(),this._focusedCell=null}_onContentFocusIn(e){const{section:t,cell:i,row:o}=this._getGridEventLocation(e);if(i||this.__rowFocusMode){if(this._detectInteracting(e),t&&(i||o))if(this._activeRowGroup=t,this.$.header===t?this._headerFocusable=this.__getFocusable(o,i):this.$.items===t?this._itemsFocusable=this.__getFocusable(o,i):this.$.footer===t&&(this._footerFocusable=this.__getFocusable(o,i)),i){const t=this.getEventContext(e);this.__pendingBodyCellFocus=this.loading&&"body"===t.section,this.__pendingBodyCellFocus||i.dispatchEvent(new CustomEvent("cell-focus",{bubbles:!0,composed:!0,detail:{context:t}})),this._focusedCell=i._focusButton||i,isKeyboardActive()&&e.target===i&&this._showTooltip(e)}else this._focusedCell=null;this._detectFocusedItemIndex(e)}}__dispatchPendingBodyCellFocus(){this.__pendingBodyCellFocus&&this.shadowRoot.activeElement===this._itemsFocusable&&this._itemsFocusable.dispatchEvent(new Event("focusin",{bubbles:!0,composed:!0}))}__getFocusable(e,t){return this.__rowFocusMode?e:t._focusButton||t}_detectInteracting(e){const t=e.composedPath().some((e=>"vaadin-grid-cell-content"===e.localName));this._setInteracting(t),this.__updateHorizontalScrollPosition()}_detectFocusedItemIndex(e){const{section:t,row:i}=this._getGridEventLocation(e);t===this.$.items&&(this._focusedItemIndex=i.index)}_updateGridSectionFocusTarget(e){if(!e)return;const t=this._getGridSectionFromFocusTarget(e),i=this.interacting&&t===this._activeRowGroup;e.tabIndex=i?-1:0}_preventScrollerRotatingCellFocus(e,t){e.index===this._focusedItemIndex&&this.hasAttribute("navigating")&&this._activeRowGroup===this.$.items&&(this._navigatingIsHidden=!0,this.toggleAttribute("navigating",!1)),t===this._focusedItemIndex&&this._navigatingIsHidden&&(this._navigatingIsHidden=!1,this.toggleAttribute("navigating",!0))}_getColumns(e,t){let i=this._columnTree.length-1;return e===this.$.header?i=t:e===this.$.footer&&(i=this._columnTree.length-1-t),this._columnTree[i]}__isValidFocusable(e){return this.$.table.contains(e)&&e.offsetHeight}_resetKeyboardNavigation(){if(["header","footer"].forEach((e=>{if(!this.__isValidFocusable(this[`_${e}Focusable`])){const t=[...this.$[e].children].find((e=>e.offsetHeight)),i=t?[...t.children].find((e=>!e.hidden)):null;t&&i&&(this[`_${e}Focusable`]=this.__getFocusable(t,i))}})),!this.__isValidFocusable(this._itemsFocusable)&&this.$.items.firstElementChild){const e=this.__getFirstVisibleItem(),t=e?[...e.children].find((e=>!e.hidden)):null;t&&e&&(delete this._focusedColumnOrder,this._itemsFocusable=this.__getFocusable(e,t))}else this.__updateItemsFocusable()}_scrollHorizontallyToCell(e){if(e.hasAttribute("frozen")||e.hasAttribute("frozen-to-end")||this.__isDetailsCell(e))return;const t=e.getBoundingClientRect(),i=e.parentNode,o=Array.from(i.children).indexOf(e),n=this.$.table.getBoundingClientRect();let s=n.left,r=n.right;for(let e=o-1;e>=0;e--){const t=i.children[e];if(!t.hasAttribute("hidden")&&!this.__isDetailsCell(t)&&(t.hasAttribute("frozen")||t.hasAttribute("frozen-to-end"))){s=t.getBoundingClientRect().right;break}}for(let e=o+1;e<i.children.length;e++){const t=i.children[e];if(!t.hasAttribute("hidden")&&!this.__isDetailsCell(t)&&(t.hasAttribute("frozen")||t.hasAttribute("frozen-to-end"))){r=t.getBoundingClientRect().left;break}}t.left<s&&(this.$.table.scrollLeft+=Math.round(t.left-s)),t.right>r&&(this.$.table.scrollLeft+=Math.round(t.right-r))}_getGridEventLocation(e){const t=e.composedPath(),i=t.indexOf(this.$.table);return{section:i>=1?t[i-1]:null,row:i>=2?t[i-2]:null,cell:i>=3?t[i-3]:null}}_getGridSectionFromFocusTarget(e){return e===this._headerFocusable?this.$.header:e===this._itemsFocusable?this.$.items:e===this._footerFocusable?this.$.footer:null}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,RowDetailsMixin=e=>class extends e{static get properties(){return{detailsOpenedItems:{type:Array,value:()=>[]},rowDetailsRenderer:Function,_detailsCells:{type:Array}}}static get observers(){return["_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)","_rowDetailsRendererChanged(rowDetailsRenderer)"]}ready(){super.ready(),this._detailsCellResizeObserver=new ResizeObserver((e=>{e.forEach((({target:e})=>{this._updateDetailsCellHeight(e.parentElement)})),this.__virtualizer.__adapter._resizeHandler()}))}_rowDetailsRendererChanged(e){e&&this._columnTree&&Array.from(this.$.items.children).forEach((e=>{if(!e.querySelector("[part~=details-cell]")){this._updateRow(e,this._columnTree[this._columnTree.length-1]);const t=this._isDetailsOpened(e._item);this._toggleDetailsCell(e,t)}}))}_detailsOpenedItemsChanged(e,t){"detailsOpenedItems.length"!==e.path&&e.value&&[...this.$.items.children].forEach((e=>{(e.hasAttribute("details-opened")||t&&this._isDetailsOpened(e._item))&&this._updateItem(e,e._item)}))}_configureDetailsCell(e){e.setAttribute("part","cell details-cell"),e.toggleAttribute("frozen",!0),this._detailsCellResizeObserver.observe(e)}_toggleDetailsCell(e,t){const i=e.querySelector('[part~="details-cell"]');i&&(i.hidden=!t,i.hidden||this.rowDetailsRenderer&&(i._renderer=this.rowDetailsRenderer))}_updateDetailsCellHeight(e){const t=e.querySelector('[part~="details-cell"]');t&&(this.__updateDetailsRowPadding(e,t),requestAnimationFrame((()=>this.__updateDetailsRowPadding(e,t))))}__updateDetailsRowPadding(e,t){t.hidden?e.style.removeProperty("padding-bottom"):e.style.setProperty("padding-bottom",`${t.offsetHeight}px`)}_updateDetailsCellHeights(){[...this.$.items.children].forEach((e=>{this._updateDetailsCellHeight(e)}))}_isDetailsOpened(e){return this.detailsOpenedItems&&-1!==this._getItemIndexInArray(e,this.detailsOpenedItems)}openItemDetails(e){this._isDetailsOpened(e)||(this.detailsOpenedItems=[...this.detailsOpenedItems,e])}closeItemDetails(e){this._isDetailsOpened(e)&&(this.detailsOpenedItems=this.detailsOpenedItems.filter((t=>!this._itemsEqual(t,e))))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,observer=new ResizeObserver((e=>{setTimeout((()=>{e.forEach((e=>{e.target.resizables?e.target.resizables.forEach((t=>{t._onResize(e.contentRect)})):e.target._onResize(e.contentRect)}))}))})),ResizeMixin=dedupingMixin((e=>class extends e{connectedCallback(){if(super.connectedCallback(),observer.observe(this),this._observeParent){const e=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;e.resizables||(e.resizables=new Set,observer.observe(e)),e.resizables.add(this),this.__parent=e}}disconnectedCallback(){super.disconnectedCallback(),observer.unobserve(this);const e=this.__parent;if(this._observeParent&&e){const t=e.resizables;t&&(t.delete(this),0===t.size&&observer.unobserve(e)),this.__parent=null}}get _observeParent(){return!1}_onResize(e){}notifyResize(){console.warn("WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}})),timeouts={SCROLLING:500},ScrollMixin=e=>class extends(ResizeMixin(e)){static get properties(){return{_frozenCells:{type:Array,value:()=>[]},_frozenToEndCells:{type:Array,value:()=>[]},_rowWithFocusedElement:Element}}get _scrollTop(){return this.$.table.scrollTop}set _scrollTop(e){this.$.table.scrollTop=e}get _scrollLeft(){return this.$.table.scrollLeft}ready(){super.ready(),this.scrollTarget=this.$.table,this.$.items.addEventListener("focusin",(e=>{const t=e.composedPath().indexOf(this.$.items);this._rowWithFocusedElement=e.composedPath()[t-1]})),this.$.items.addEventListener("focusout",(()=>{this._rowWithFocusedElement=void 0})),this.$.table.addEventListener("scroll",(()=>this._afterScroll()))}_onResize(){if(this._updateOverflow(),this.__updateHorizontalScrollPosition(),this._firefox){const e=!isElementHidden(this);e&&!1===this.__previousVisible&&(this._scrollTop=this.__memorizedScrollTop||0),this.__previousVisible=e}}scrollToIndex(e){e=Math.min(this._effectiveSize-1,Math.max(0,e)),this.__virtualizer.scrollToIndex(e),this.__scrollIntoViewport(e)}__scrollIntoViewport(e){const t=[...this.$.items.children].find((t=>t.index===e));if(t){const e=t.getBoundingClientRect(),i=this.$.footer.getBoundingClientRect().top,o=this.$.header.getBoundingClientRect().bottom;e.bottom>i?this.$.table.scrollTop+=e.bottom-i:e.top<o&&(this.$.table.scrollTop-=o-e.top)}}_scheduleScrolling(){this._scrollingFrame||(this._scrollingFrame=requestAnimationFrame((()=>this.$.scroller.toggleAttribute("scrolling",!0)))),this._debounceScrolling=Debouncer.debounce(this._debounceScrolling,timeOut.after(timeouts.SCROLLING),(()=>{cancelAnimationFrame(this._scrollingFrame),delete this._scrollingFrame,this.$.scroller.toggleAttribute("scrolling",!1)}))}_afterScroll(){if(this.__updateHorizontalScrollPosition(),this.hasAttribute("reordering")||this._scheduleScrolling(),this.hasAttribute("navigating")||this._hideTooltip(!0),this._updateOverflow(),this._firefox){!isElementHidden(this)&&!1!==this.__previousVisible&&(this.__memorizedScrollTop=this._scrollTop)}}_updateOverflow(){let e="";const t=this.$.table;t.scrollTop<t.scrollHeight-t.clientHeight&&(e+=" bottom"),t.scrollTop>0&&(e+=" top");const i=this.__getNormalizedScrollLeft(t);i>0&&(e+=" start"),i<t.scrollWidth-t.clientWidth&&(e+=" end"),this.__isRTL&&(e=e.replace(/start|end/gi,(e=>"start"===e?"end":"start"))),t.scrollLeft<t.scrollWidth-t.clientWidth&&(e+=" right"),t.scrollLeft>0&&(e+=" left"),this._debounceOverflow=Debouncer.debounce(this._debounceOverflow,animationFrame,(()=>{const t=e.trim();t.length>0&&this.getAttribute("overflow")!==t?this.setAttribute("overflow",t):0===t.length&&this.hasAttribute("overflow")&&this.removeAttribute("overflow")}))}_frozenCellsChanged(){this._debouncerCacheElements=Debouncer.debounce(this._debouncerCacheElements,microTask,(()=>{Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((e=>{e.style.transform=""})),this._frozenCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")),this._frozenToEndCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")),this.__updateHorizontalScrollPosition()})),this._debounceUpdateFrozenColumn()}_debounceUpdateFrozenColumn(){this.__debounceUpdateFrozenColumn=Debouncer.debounce(this.__debounceUpdateFrozenColumn,microTask,(()=>this._updateFrozenColumn()))}_updateFrozenColumn(){if(!this._columnTree)return;const e=this._columnTree[this._columnTree.length-1].slice(0);let t,i;e.sort(((e,t)=>e._order-t._order));for(let o=0;o<e.length;o++){const n=e[o];n._lastFrozen=!1,n._firstFrozenToEnd=!1,void 0===i&&n.frozenToEnd&&!n.hidden&&(i=o),n.frozen&&!n.hidden&&(t=o)}void 0!==t&&(e[t]._lastFrozen=!0),void 0!==i&&(e[i]._firstFrozenToEnd=!0)}__updateHorizontalScrollPosition(){const e=this.$.table.scrollWidth,t=this.$.table.clientWidth,i=Math.max(0,this.$.table.scrollLeft),o=this.__getNormalizedScrollLeft(this.$.table),n=`translate(${-i}px, 0)`;this.$.header.style.transform=n,this.$.footer.style.transform=n,this.$.items.style.transform=n;const s=this.__isRTL?o+t-e:i,r=`translate(${s}px, 0)`;for(let e=0;e<this._frozenCells.length;e++)this._frozenCells[e].style.transform=r;const a=`translate(${this.__isRTL?o:i+t-e}px, 0)`;for(let e=0;e<this._frozenToEndCells.length;e++)this._frozenToEndCells[e].style.transform=a;this.hasAttribute("navigating")&&this.__rowFocusMode&&this.$.table.style.setProperty("--_grid-horizontal-scroll-position",-s+"px")}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,SelectionMixin=e=>class extends e{static get properties(){return{selectedItems:{type:Object,notify:!0,value:()=>[]},__selectedKeys:{type:Object,computed:"__computeSelectedKeys(itemIdPath, selectedItems.*)"}}}static get observers(){return["__selectedItemsChanged(itemIdPath, selectedItems.*)"]}_isSelected(e){return this.__selectedKeys.has(this.getItemId(e))}selectItem(e){this._isSelected(e)||(this.selectedItems=[...this.selectedItems,e])}deselectItem(e){this._isSelected(e)&&(this.selectedItems=this.selectedItems.filter((t=>!this._itemsEqual(t,e))))}_toggleItem(e){this._isSelected(e)?this.deselectItem(e):this.selectItem(e)}__selectedItemsChanged(){this.requestContentUpdate()}__computeSelectedKeys(e,t){const i=t.base||[],o=new Set;return i.forEach((e=>{o.add(this.getItemId(e))})),o}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let defaultMultiSortPriority="prepend";const SortMixin=e=>class extends e{static get properties(){return{multiSort:{type:Boolean,value:!1},multiSortPriority:{type:String,value:()=>defaultMultiSortPriority},multiSortOnShiftClick:{type:Boolean,value:!1},_sorters:{type:Array,value:()=>[]},_previousSorters:{type:Array,value:()=>[]}}}static setDefaultMultiSortPriority(e){defaultMultiSortPriority=["append","prepend"].includes(e)?e:"prepend"}ready(){super.ready(),this.addEventListener("sorter-changed",this._onSorterChanged)}_onSorterChanged(e){const t=e.target;e.stopPropagation(),t._grid=this,this.__updateSorter(t,e.detail.shiftClick,e.detail.fromSorterClick),this.__applySorters()}__removeSorters(e){0!==e.length&&(this._sorters=this._sorters.filter((t=>e.indexOf(t)<0)),this.multiSort&&this.__updateSortOrders(),this.__applySorters())}__updateSortOrders(){this._sorters.forEach(((e,t)=>{e._order=this._sorters.length>1?t:null}))}__appendSorter(e){e.direction?this._sorters.includes(e)||this._sorters.push(e):this._removeArrayItem(this._sorters,e),this.__updateSortOrders()}__prependSorter(e){this._removeArrayItem(this._sorters,e),e.direction&&this._sorters.unshift(e),this.__updateSortOrders()}__updateSorter(e,t,i){if(e.direction||-1!==this._sorters.indexOf(e))if(e._order=null,this.multiSort&&(!this.multiSortOnShiftClick||!i)||this.multiSortOnShiftClick&&t)"append"===this.multiSortPriority?this.__appendSorter(e):this.__prependSorter(e);else if(e.direction||this.multiSortOnShiftClick){const t=this._sorters.filter((t=>t!==e));this._sorters=e.direction?[e]:[],t.forEach((e=>{e._order=null,e.direction=null}))}}__applySorters(){this.dataProvider&&this.isAttached&&JSON.stringify(this._previousSorters)!==JSON.stringify(this._mapSorters())&&this.clearCache(),this._a11yUpdateSorters(),this._previousSorters=this._mapSorters()}_mapSorters(){return this._sorters.map((e=>({path:e.path,direction:e.direction})))}_removeArrayItem(e,t){const i=e.indexOf(t);i>-1&&e.splice(i,1)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,StylingMixin=e=>class extends e{static get properties(){return{cellClassNameGenerator:Function}}static get observers(){return["__cellClassNameGeneratorChanged(cellClassNameGenerator)"]}__cellClassNameGeneratorChanged(){this.generateCellClassNames()}generateCellClassNames(){Array.from(this.$.items.children).filter((e=>!e.hidden&&!e.hasAttribute("loading"))).forEach((e=>this._generateCellClassNames(e,this.__getRowModel(e))))}_generateCellClassNames(e,t){Array.from(e.children).forEach((e=>{if(e.__generatedClasses&&e.__generatedClasses.forEach((t=>e.classList.remove(t))),this.cellClassNameGenerator){const i=this.cellClassNameGenerator(e._column,t);e.__generatedClasses=i&&i.split(" ").filter((e=>e.length>0)),e.__generatedClasses&&e.__generatedClasses.forEach((t=>e.classList.add(t)))}}))}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class Grid extends(ElementMixin(ThemableMixin(DataProviderMixin(ArrayDataProviderMixin(DynamicColumnsMixin(ActiveItemMixin(ScrollMixin(SelectionMixin(SortMixin(RowDetailsMixin(KeyboardNavigationMixin(A11yMixin(FilterMixin(ColumnReorderingMixin(ColumnResizingMixin(ControllerMixin(EventContextMixin(DragAndDropMixin(StylingMixin(TabindexMixin(PolymerElement))))))))))))))))))))){static get template(){return html`
      <div
        id="scroller"
        safari$="[[_safari]]"
        ios$="[[_ios]]"
        loading$="[[loading]]"
        column-reordering-allowed$="[[columnReorderingAllowed]]"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <slot name="tooltip"></slot>

      <div id="focusexit" tabindex="0"></div>
    `}static get is(){return"vaadin-grid"}static get observers(){return["_columnTreeChanged(_columnTree, _columnTree.*)","_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)"]}static get properties(){return{_safari:{type:Boolean,value:isSafari},_ios:{type:Boolean,value:isIOS},_firefox:{type:Boolean,value:isFirefox},_android:{type:Boolean,value:isAndroid},_touchDevice:{type:Boolean,value:isTouch},allRowsVisible:{type:Boolean,value:!1,reflectToAttribute:!0},_recalculateColumnWidthOnceLoadingFinished:{type:Boolean,value:!0},isAttached:{value:!1},__gridElement:{type:Boolean,value:!0}}}constructor(){super(),this.addEventListener("animationend",this._onAnimationEnd)}connectedCallback(){super.connectedCallback(),this.isAttached=!0,this.recalculateColumnWidths()}disconnectedCallback(){super.disconnectedCallback(),this.isAttached=!1,this._hideTooltip(!0)}__getFirstVisibleItem(){return this._getVisibleRows().find((e=>this._isInViewport(e)))}get _firstVisibleIndex(){const e=this.__getFirstVisibleItem();return e?e.index:void 0}__getLastVisibleItem(){return this._getVisibleRows().reverse().find((e=>this._isInViewport(e)))}get _lastVisibleIndex(){const e=this.__getLastVisibleItem();return e?e.index:void 0}_isInViewport(e){const t=this.$.table.getBoundingClientRect(),i=e.getBoundingClientRect(),o=this.$.header.getBoundingClientRect().height,n=this.$.footer.getBoundingClientRect().height;return i.bottom>t.top+o&&i.top<t.bottom-n}_getVisibleRows(){return Array.from(this.$.items.children).filter((e=>!e.hidden)).sort(((e,t)=>e.index-t.index))}ready(){super.ready(),this.__virtualizer=new Virtualizer({createElements:this._createScrollerRows.bind(this),updateElement:this._updateScrollerItem.bind(this),scrollContainer:this.$.items,scrollTarget:this.$.table,reorderElements:!0}),new ResizeObserver((()=>setTimeout((()=>{this.__updateFooterPositioning(),this._recalculateColumnWidthOnceVisible&&(this._recalculateColumnWidthOnceVisible=!1,this.recalculateColumnWidths())})))).observe(this.$.table),processTemplates(this),this._tooltipController=new TooltipController(this),this.addController(this._tooltipController),this._tooltipController.setManual(!0)}attributeChangedCallback(e,t,i){super.attributeChangedCallback(e,t,i),"dir"===e&&(this.__isRTL="rtl"===i)}__getBodyCellCoordinates(e){if(this.$.items.contains(e)&&"td"===e.localName)return{item:e.parentElement._item,column:e._column}}__focusBodyCell({item:e,column:t}){const i=this._getVisibleRows().find((t=>t._item===e)),o=i&&[...i.children].find((e=>e._column===t));o&&o.focus()}_effectiveSizeChanged(e,t,i,o){if(t&&i&&o){const i=this.shadowRoot.activeElement,o=this.__getBodyCellCoordinates(i);t.size=e,t.update(),t.flush(),o&&i.parentElement.hidden&&this.__focusBodyCell(o),this._resetKeyboardNavigation()}}__itemsReceived(){if(!this._recalculateColumnWidthOnceLoadingFinished||this._cache.isLoading())return;if([...this.$.items.children].some((e=>void 0===e.index)))return;[...this.$.items.children].some((e=>e.clientHeight>0))&&(this._recalculateColumnWidthOnceLoadingFinished=!1,this.recalculateColumnWidths())}__getIntrinsicWidth(e){if(this.__intrinsicWidthCache.has(e))return this.__intrinsicWidthCache.get(e);const t=this.__calculateIntrinsicWidth(e);return this.__intrinsicWidthCache.set(e,t),t}__calculateIntrinsicWidth(e){const t=e.width,i=e.flexGrow;e.width="auto",e.flexGrow=0;const o=e._allCells.filter((e=>!this.$.items.contains(e)||this._isInViewport(e.parentElement))).reduce(((e,t)=>Math.max(e,t.offsetWidth+1)),0);return e.flexGrow=i,e.width=t,o}__getDistributedWidth(e,t){if(null==e||e===this)return 0;const i=Math.max(this.__getIntrinsicWidth(e),this.__getDistributedWidth((e.assignedSlot||e).parentElement,e));if(!t)return i;const o=i,n=e._visibleChildColumns.map((e=>this.__getIntrinsicWidth(e))).reduce(((e,t)=>e+t),0),s=Math.max(0,o-n),r=this.__getIntrinsicWidth(t)/n*s;return this.__getIntrinsicWidth(t)+r}_recalculateColumnWidths(e){this.__virtualizer.flush(),[...this.$.header.children,...this.$.footer.children].forEach((e=>{e.__debounceUpdateHeaderFooterRowVisibility&&e.__debounceUpdateHeaderFooterRowVisibility.flush()})),this._debouncerHiddenChanged&&this._debouncerHiddenChanged.flush(),this.__intrinsicWidthCache=new Map,e.forEach((e=>{e.width=`${this.__getDistributedWidth(e)}px`}))}recalculateColumnWidths(){if(!this._columnTree)return;if(isElementHidden(this))return void(this._recalculateColumnWidthOnceVisible=!0);if(this._cache.isLoading())return void(this._recalculateColumnWidthOnceLoadingFinished=!0);const e=this._getColumns().filter((e=>!e.hidden&&e.autoWidth));this._recalculateColumnWidths(e)}_createScrollerRows(e){const t=[];for(let i=0;i<e;i++){const e=document.createElement("tr");e.setAttribute("part","row"),e.setAttribute("role","row"),e.setAttribute("tabindex","-1"),this._columnTree&&this._updateRow(e,this._columnTree[this._columnTree.length-1],"body",!1,!0),t.push(e)}return this._columnTree&&this._columnTree[this._columnTree.length-1].forEach((e=>e.isConnected&&e.notifyPath&&e.notifyPath("_cells.*",e._cells))),beforeNextRender(this,(()=>{this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._afterScroll(),this.__itemsReceived()})),t}_createCell(e,t){const i=`vaadin-grid-cell-content-${this._contentIndex=this._contentIndex+1||0}`,o=document.createElement("vaadin-grid-cell-content");o.setAttribute("slot",i);const n=document.createElement(e);n.id=i.replace("-content-","-"),n.setAttribute("role","td"===e?"gridcell":"columnheader"),isAndroid||isIOS||(n.addEventListener("mouseenter",(e=>{this.$.scroller.hasAttribute("scrolling")||this._showTooltip(e)})),n.addEventListener("mouseleave",(()=>{this._hideTooltip()})),n.addEventListener("mousedown",(()=>{this._hideTooltip(!0)})));const s=document.createElement("slot");if(s.setAttribute("name",i),t&&t._focusButtonMode){const e=document.createElement("div");e.setAttribute("role","button"),e.setAttribute("tabindex","-1"),n.appendChild(e),n._focusButton=e,n.focus=function(){n._focusButton.focus()},e.appendChild(s)}else n.setAttribute("tabindex","-1"),n.appendChild(s);return n._content=o,o.addEventListener("mousedown",(()=>{if(isChrome){const e=t=>{const i=o.contains(this.getRootNode().activeElement),s=t.composedPath().includes(o);!i&&s&&n.focus(),document.removeEventListener("mouseup",e,!0)};document.addEventListener("mouseup",e,!0)}else setTimeout((()=>{o.contains(this.getRootNode().activeElement)||n.focus()}))})),n}_updateRow(e,t,i,o,n){i=i||"body";const s=document.createDocumentFragment();Array.from(e.children).forEach((e=>{e._vacant=!0})),e.innerHTML="",t.filter((e=>!e.hidden)).forEach(((t,r,a)=>{let l;if("body"===i){if(t._cells=t._cells||[],l=t._cells.find((e=>e._vacant)),l||(l=this._createCell("td",t),t._cells.push(l)),l.setAttribute("part","cell body-cell"),e.appendChild(l),e===this.$.sizer&&(t._sizerCell=l),r===a.length-1&&this.rowDetailsRenderer){this._detailsCells=this._detailsCells||[];const t=this._detailsCells.find((e=>e._vacant))||this._createCell("td");-1===this._detailsCells.indexOf(t)&&this._detailsCells.push(t),t._content.parentElement||s.appendChild(t._content),this._configureDetailsCell(t),e.appendChild(t),this._a11ySetRowDetailsCell(e,t),t._vacant=!1}t.notifyPath&&!n&&t.notifyPath("_cells.*",t._cells)}else{const n="header"===i?"th":"td";o||"vaadin-grid-column-group"===t.localName?(l=t[`_${i}Cell`]||this._createCell(n),l._column=t,e.appendChild(l),t[`_${i}Cell`]=l):(t._emptyCells=t._emptyCells||[],l=t._emptyCells.find((e=>e._vacant))||this._createCell(n),l._column=t,e.appendChild(l),-1===t._emptyCells.indexOf(l)&&t._emptyCells.push(l)),l.setAttribute("part",`cell ${i}-cell`)}l._content.parentElement||s.appendChild(l._content),l._vacant=!1,l._column=t})),"body"!==i&&this.__debounceUpdateHeaderFooterRowVisibility(e),this.appendChild(s),this._frozenCellsChanged(),this._updateFirstAndLastColumnForRow(e)}__debounceUpdateHeaderFooterRowVisibility(e){e.__debounceUpdateHeaderFooterRowVisibility=Debouncer.debounce(e.__debounceUpdateHeaderFooterRowVisibility,microTask,(()=>this.__updateHeaderFooterRowVisibility(e)))}__updateHeaderFooterRowVisibility(e){if(!e)return;const t=Array.from(e.children).filter((t=>{const i=t._column;if(i._emptyCells&&i._emptyCells.indexOf(t)>-1)return!1;if(e.parentElement===this.$.header){if(i.headerRenderer)return!0;if(null===i.header)return!1;if(i.path||void 0!==i.header)return!0}else if(i.footerRenderer)return!0;return!1}));e.hidden!==!t.length&&(e.hidden=!t.length),this._resetKeyboardNavigation()}_updateScrollerItem(e,t){this._preventScrollerRotatingCellFocus(e,t),this._columnTree&&(e.toggleAttribute("first",0===t),e.toggleAttribute("last",t===this._effectiveSize-1),e.toggleAttribute("odd",t%2),this._a11yUpdateRowRowindex(e,t),this._getItem(t,e))}_columnTreeChanged(e){this._renderColumnTree(e),this.recalculateColumnWidths()}_renderColumnTree(e){for(Array.from(this.$.items.children).forEach((t=>this._updateRow(t,e[e.length-1],null,!1,!0)));this.$.header.children.length<e.length;){const e=document.createElement("tr");e.setAttribute("part","row"),e.setAttribute("role","row"),e.setAttribute("tabindex","-1"),this.$.header.appendChild(e);const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this.$.footer.appendChild(t)}for(;this.$.header.children.length>e.length;)this.$.header.removeChild(this.$.header.firstElementChild),this.$.footer.removeChild(this.$.footer.firstElementChild);Array.from(this.$.header.children).forEach(((t,i)=>this._updateRow(t,e[i],"header",i===e.length-1))),Array.from(this.$.footer.children).forEach(((t,i)=>this._updateRow(t,e[e.length-1-i],"footer",0===i))),this._updateRow(this.$.sizer,e[e.length-1]),this._resizeHandler(),this._frozenCellsChanged(),this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows(),this.__updateFooterPositioning(),this.generateCellClassNames(),this.__updateHeaderAndFooter()}__updateFooterPositioning(){this._firefox&&parseFloat(navigator.userAgent.match(/Firefox\/(\d{2,3}.\d)/)[1])<99&&(this.$.items.style.paddingBottom=0,this.allRowsVisible||(this.$.items.style.paddingBottom=`${this.$.footer.offsetHeight}px`))}_updateItem(e,t){e._item=t;const i=this.__getRowModel(e);this._toggleDetailsCell(e,i.detailsOpened),this._a11yUpdateRowLevel(e,i.level),this._a11yUpdateRowSelected(e,i.selected),e.toggleAttribute("expanded",i.expanded),e.toggleAttribute("selected",i.selected),e.toggleAttribute("details-opened",i.detailsOpened),this._generateCellClassNames(e,i),this._filterDragAndDrop(e,i),Array.from(e.children).forEach((e=>{if(e._renderer){const t=e._column||this;e._renderer.call(t,e._content,t,i)}})),this._updateDetailsCellHeight(e),this._a11yUpdateRowExpanded(e,i.expanded)}_resizeHandler(){this._updateDetailsCellHeights(),this.__updateFooterPositioning(),this.__updateHorizontalScrollPosition()}_onAnimationEnd(e){0===e.animationName.indexOf("vaadin-grid-appear")&&(e.stopPropagation(),this.__itemsReceived(),requestAnimationFrame((()=>{this.__scrollToPendingIndex()})))}__getRowModel(e){return{index:e.index,item:e._item,level:this._getIndexLevel(e.index),expanded:this._isExpanded(e._item),selected:this._isSelected(e._item),detailsOpened:!!this.rowDetailsRenderer&&this._isDetailsOpened(e._item)}}_showTooltip(e){const t=this._tooltipController.node;t&&t.isConnected&&(this._tooltipController.setTarget(e.target),this._tooltipController.setContext(this.getEventContext(e)),t._stateController.open({focus:"focusin"===e.type,hover:"mouseenter"===e.type}))}_hideTooltip(e){const t=this._tooltipController.node;t&&t._stateController.close(e)}requestContentUpdate(){this.__updateHeaderAndFooter(),this.__updateVisibleRows()}__updateHeaderAndFooter(){(this._columnTree||[]).forEach((e=>{e.forEach((e=>{e._renderHeaderAndFooter&&e._renderHeaderAndFooter()}))}))}__updateVisibleRows(e,t){this.__virtualizer&&this.__virtualizer.update(e,t)}notifyResize(){console.warn("WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}}customElements.define(Grid.is,Grid);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const GridElement=Grid;console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-grid" is deprecated. Use "@vaadin/grid" instead.');
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridSelectionColumn extends GridColumn{static get is(){return"vaadin-grid-selection-column"}static get properties(){return{width:{type:String,value:"58px"},flexGrow:{type:Number,value:0},selectAll:{type:Boolean,value:!1,notify:!0},autoSelect:{type:Boolean,value:!1},__indeterminate:Boolean,__previousActiveItem:Object,__selectAllHidden:Boolean}}static get observers(){return["__onSelectAllChanged(selectAll)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, __indeterminate, __selectAllHidden)"]}constructor(){super(),this.__boundOnActiveItemChanged=this.__onActiveItemChanged.bind(this),this.__boundOnDataProviderChanged=this.__onDataProviderChanged.bind(this),this.__boundOnSelectedItemsChanged=this.__onSelectedItemsChanged.bind(this)}disconnectedCallback(){this._grid.removeEventListener("active-item-changed",this.__boundOnActiveItemChanged),this._grid.removeEventListener("data-provider-changed",this.__boundOnDataProviderChanged),this._grid.removeEventListener("filter-changed",this.__boundOnSelectedItemsChanged),this._grid.removeEventListener("selected-items-changed",this.__boundOnSelectedItemsChanged),super.disconnectedCallback()}connectedCallback(){super.connectedCallback(),this._grid&&(this._grid.addEventListener("active-item-changed",this.__boundOnActiveItemChanged),this._grid.addEventListener("data-provider-changed",this.__boundOnDataProviderChanged),this._grid.addEventListener("filter-changed",this.__boundOnSelectedItemsChanged),this._grid.addEventListener("selected-items-changed",this.__boundOnSelectedItemsChanged))}_defaultHeaderRenderer(e,t){let i=e.firstElementChild;i||(i=document.createElement("vaadin-checkbox"),i.setAttribute("aria-label","Select All"),i.classList.add("vaadin-grid-select-all-checkbox"),i.addEventListener("checked-changed",this.__onSelectAllCheckedChanged.bind(this)),e.appendChild(i));const o=this.__isChecked(this.selectAll,this.__indeterminate);i.__rendererChecked=o,i.checked=o,i.hidden=this.__selectAllHidden,i.indeterminate=this.__indeterminate}_defaultRenderer(e,t,{item:i,selected:o}){let n=e.firstElementChild;n||(n=document.createElement("vaadin-checkbox"),n.setAttribute("aria-label","Select Row"),n.addEventListener("checked-changed",this.__onSelectRowCheckedChanged.bind(this)),e.appendChild(n)),n.__item=i,n.__rendererChecked=o,n.checked=o}__onSelectAllChanged(e){void 0!==e&&this._grid&&(this.__selectAllInitialized?this._selectAllChangeLock||(e&&this.__hasArrayDataProvider()?this.__withFilteredItemsArray((e=>{this._grid.selectedItems=e})):this._grid.selectedItems=[]):this.__selectAllInitialized=!0)}__arrayContains(e,t){return Array.isArray(e)&&Array.isArray(t)&&t.every((t=>e.includes(t)))}__onSelectAllCheckedChanged(e){e.target.checked!==e.target.__rendererChecked&&(this.selectAll=this.__indeterminate||e.target.checked)}__onSelectRowCheckedChanged(e){e.target.checked!==e.target.__rendererChecked&&(e.target.checked?this._grid.selectItem(e.target.__item):this._grid.deselectItem(e.target.__item))}__isChecked(e,t){return t||e}__onActiveItemChanged(e){const t=e.detail.value;if(this.autoSelect){const e=t||this.__previousActiveItem;e&&this._grid._toggleItem(e)}this.__previousActiveItem=t}__hasArrayDataProvider(){return Array.isArray(this._grid.items)&&!!this._grid.dataProvider}__onSelectedItemsChanged(){this._selectAllChangeLock=!0,this.__hasArrayDataProvider()&&this.__withFilteredItemsArray((e=>{this._grid.selectedItems.length?this.__arrayContains(this._grid.selectedItems,e)?(this.selectAll=!0,this.__indeterminate=!1):(this.selectAll=!1,this.__indeterminate=!0):(this.selectAll=!1,this.__indeterminate=!1)})),this._selectAllChangeLock=!1}__onDataProviderChanged(){this.__selectAllHidden=!Array.isArray(this._grid.items)}__withFilteredItemsArray(e){const t={page:0,pageSize:1/0,sortOrders:[],filters:this._grid._mapFilters()};this._grid.dataProvider(t,(t=>e(t)))}}customElements.define(GridSelectionColumn.is,GridSelectionColumn),registerStyles("vaadin-input-container",i$3`
    :host {
      border-radius: var(--lumo-border-radius-m);
      background-color: var(--lumo-contrast-10pct);
      padding: 0 calc(0.375em + var(--lumo-border-radius-m) / 4 - 1px);
      font-weight: 500;
      line-height: 1;
      position: relative;
      cursor: text;
      box-sizing: border-box;
    }

    /* Used for hover and activation effects */
    :host::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      pointer-events: none;
      background-color: var(--lumo-contrast-50pct);
      opacity: 0;
      transition: transform 0.15s, opacity 0.2s;
      transform-origin: 100% 0;
    }

    ::slotted(:not([slot$='fix'])) {
      cursor: inherit;
      min-height: var(--lumo-text-field-size, var(--lumo-size-m));
      padding: 0 0.25em;
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
      -webkit-mask-image: var(--_lumo-text-field-overflow-mask-image);
      mask-image: var(--_lumo-text-field-overflow-mask-image);
    }

    /* Read-only */
    :host([readonly]) {
      color: var(--lumo-secondary-text-color);
      background-color: transparent;
      cursor: default;
    }

    :host([readonly])::after {
      background-color: transparent;
      opacity: 1;
      border: 1px dashed var(--lumo-contrast-30pct);
    }

    /* Disabled */
    :host([disabled]) {
      background-color: var(--lumo-contrast-5pct);
    }

    :host([disabled]) ::slotted(*) {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    /* Invalid */
    :host([invalid]) {
      background-color: var(--lumo-error-color-10pct);
    }

    :host([invalid])::after {
      background-color: var(--lumo-error-color-50pct);
    }

    /* Slotted icons */
    ::slotted(iron-icon),
    ::slotted(vaadin-icon) {
      color: var(--lumo-contrast-60pct);
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    ::slotted(iron-icon[icon^='vaadin:']),
    ::slotted(vaadin-icon[icon^='vaadin:']) {
      padding: 0.25em;
      box-sizing: border-box !important;
    }

    /* Text align */
    :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent, #000 1.25em);
    }

    @-moz-document url-prefix() {
      :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
        mask-image: var(--_lumo-text-field-overflow-mask-image);
      }
    }

    :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
      text-align: start;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center']) ::slotted(:not([slot$='fix'])) {
      text-align: center;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
      text-align: end;
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }

    /* RTL specific styles */
    :host([dir='rtl'])::after {
      transform-origin: 0% 0;
    }

    :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }
  `,{moduleId:"lumo-input-container"});
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class InputContainer extends(ThemableMixin(DirMixin(PolymerElement))){static get is(){return"vaadin-input-container"}static get template(){return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex: 0 1 auto;
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Reset the native input styles */
        ::slotted(input) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          height: 100%;
          outline: none;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          min-width: 0;
          font: inherit;
          line-height: normal;
          color: inherit;
          background-color: transparent;
          /* Disable default invalid style in Firefox */
          box-shadow: none;
        }

        ::slotted(*) {
          flex: none;
        }

        ::slotted(:is(input, textarea))::placeholder {
          /* Use ::slotted(input:placeholder-shown) in themes to style the placeholder. */
          /* because ::slotted(...)::placeholder does not work in Safari. */
          font: inherit;
          color: inherit;
          /* Override default opacity in Firefox */
          opacity: 1;
        }
      </style>
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `}static get properties(){return{disabled:{type:Boolean,reflectToAttribute:!0},readonly:{type:Boolean,reflectToAttribute:!0},invalid:{type:Boolean,reflectToAttribute:!0}}}ready(){super.ready(),this.addEventListener("pointerdown",(e=>{e.target===this&&e.preventDefault()})),this.addEventListener("click",(e=>{e.target===this&&this.shadowRoot.querySelector("slot:not([name])").assignedNodes({flatten:!0}).forEach((e=>e.focus&&e.focus()))}))}}customElements.define(InputContainer.is,InputContainer);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const fieldButton=i$3`
  [part$='button'] {
    flex: none;
    width: 1em;
    height: 1em;
    line-height: 1;
    font-size: var(--lumo-icon-size-m);
    text-align: center;
    color: var(--lumo-contrast-60pct);
    transition: 0.2s color;
    cursor: var(--lumo-clickable-cursor);
  }

  [part$='button']:hover {
    color: var(--lumo-contrast-90pct);
  }

  :host([disabled]) [part$='button'],
  :host([readonly]) [part$='button'] {
    color: var(--lumo-contrast-20pct);
    cursor: default;
  }

  [part$='button']::before {
    font-family: 'lumo-icons';
    display: block;
  }
`;registerStyles("",fieldButton,{moduleId:"lumo-field-button"});
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const helper=i$3`
  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: 0.4em;
  }

  [part='helper-text'] {
    display: block;
    color: var(--lumo-secondary-text-color);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
  }

  :host(:hover:not([readonly])) [part='helper-text'] {
    color: var(--lumo-body-text-color);
  }

  :host([disabled]) [part='helper-text'] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::before {
    display: none;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] {
    order: 0;
    padding-bottom: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text'] {
    order: 1;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] + * {
    order: 2;
  }

  :host([has-helper][theme~='helper-above-field']) [part='error-message'] {
    order: 3;
  }
`
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,requiredField=i$3`
  [part='label'] {
    align-self: flex-start;
    color: var(--lumo-secondary-text-color);
    font-weight: 500;
    font-size: var(--lumo-font-size-s);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
    line-height: 1;
    padding-right: 1em;
    padding-bottom: 0.5em;
    /* As a workaround for diacritics being cut off, add a top padding and a 
    negative margin to compensate */
    padding-top: 0.25em;
    margin-top: -0.25em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    max-width: 100%;
    box-sizing: border-box;
  }

  :host([has-label])::before {
    margin-top: calc(var(--lumo-font-size-s) * 1.5);
  }

  :host([has-label][theme~='small'])::before {
    margin-top: calc(var(--lumo-font-size-xs) * 1.5);
  }

  :host([has-label]) {
    padding-top: var(--lumo-space-m);
  }

  :host([has-label]) ::slotted([slot='tooltip']) {
    --vaadin-tooltip-offset-bottom: calc((var(--lumo-space-m) - var(--lumo-space-xs)) * -1);
  }

  :host([required]) [part='required-indicator']::after {
    content: var(--lumo-required-field-indicator, '•');
    transition: opacity 0.2s;
    color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
    position: absolute;
    right: 0;
    width: 1em;
    text-align: center;
  }

  :host([invalid]) [part='required-indicator']::after {
    color: var(--lumo-required-field-indicator-color, var(--lumo-error-text-color));
  }

  [part='error-message'] {
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-error-text-color);
    will-change: max-height;
    transition: 0.4s max-height;
    max-height: 5em;
  }

  :host([has-error-message]) [part='error-message']::before,
  :host([has-error-message]) [part='error-message']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host(:not([invalid])) [part='error-message'] {
    max-height: 0;
    overflow: hidden;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='label'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }

  :host([dir='rtl']) [part='label'] {
    padding-left: 1em;
    padding-right: 0;
  }

  :host([dir='rtl']) [part='required-indicator']::after {
    right: auto;
    left: 0;
  }

  :host([dir='rtl']) [part='error-message'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }
`;registerStyles("",requiredField,{moduleId:"lumo-required-field"});
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const inputField=i$3`
  :host {
    --lumo-text-field-size: var(--lumo-size-m);
    color: var(--lumo-body-text-color);
    font-size: var(--lumo-font-size-m);
    font-family: var(--lumo-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    padding: var(--lumo-space-xs) 0;
  }

  :host::before {
    height: var(--lumo-text-field-size);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
  }

  :host([focused]:not([readonly])) [part='label'] {
    color: var(--lumo-primary-text-color);
  }

  :host([focused]) [part='input-field'] ::slotted(:is(input, textarea)) {
    -webkit-mask-image: none;
    mask-image: none;
  }

  ::slotted(:is(input, textarea):placeholder-shown) {
    color: var(--lumo-secondary-text-color);
  }

  /* Hover */
  :host(:hover:not([readonly]):not([focused])) [part='label'] {
    color: var(--lumo-body-text-color);
  }

  :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
    opacity: 0.1;
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
    :host(:hover:not([readonly]):not([focused])) [part='label'] {
      color: var(--lumo-secondary-text-color);
    }

    :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0;
    }

    :host(:active:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0.2;
    }
  }

  /* Trigger when not focusing using the keyboard */
  :host([focused]:not([focus-ring]):not([readonly])) [part='input-field']::after {
    transform: scaleX(0);
    transition-duration: 0.15s, 1s;
  }

  /* Focus-ring */
  :host([focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  /* Read-only and disabled */
  :host(:is([readonly], [disabled])) ::slotted(:is(input, textarea):placeholder-shown) {
    opacity: 0;
  }

  /* Disabled style */
  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) [part='label'],
  :host([disabled]) [part='input-field'] ::slotted(*) {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  /* Invalid style */
  :host([invalid][focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-error-color-50pct);
  }

  :host([input-prevented]) [part='input-field'] {
    animation: shake 0.15s infinite;
  }

  @keyframes shake {
    25% {
      transform: translateX(4px);
    }
    75% {
      transform: translateX(-4px);
    }
  }

  /* Small theme */
  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-text-field-size: var(--lumo-size-s);
  }

  :host([theme~='small']) [part='label'] {
    font-size: var(--lumo-font-size-xs);
  }

  :host([theme~='small']) [part='error-message'] {
    font-size: var(--lumo-font-size-xxs);
  }

  /* Slotted content */
  [part='input-field'] ::slotted(:not(iron-icon):not(vaadin-icon):not(input):not(textarea)) {
    color: var(--lumo-secondary-text-color);
    font-weight: 400;
  }

  [part='clear-button']::before {
    content: var(--lumo-icons-cross);
  }
`,inputFieldShared$1=[requiredField,fieldButton,helper,inputField];registerStyles("",inputFieldShared$1,{moduleId:"lumo-input-field-shared-styles"}),
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
registerStyles("vaadin-text-field",inputFieldShared$1,{moduleId:"lumo-text-field-styles"});
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ErrorController extends SlotController{constructor(e){super(e,"error-message",(()=>document.createElement("div")),((e,t)=>{this.__updateErrorId(t),this.__updateHasError()}),!0)}get errorId(){return this.node&&this.node.id}setErrorMessage(e){this.errorMessage=e,this.__updateHasError()}setInvalid(e){this.invalid=e,this.__updateHasError()}initCustomNode(e){this.__updateErrorId(e),e.textContent&&!this.errorMessage&&(this.errorMessage=e.textContent.trim()),this.__updateHasError()}teardownNode(e){let t=this.getSlotChild();t||e===this.defaultNode||(t=this.attachDefaultNode(),this.initNode(t)),this.__updateHasError()}__isNotEmpty(e){return Boolean(e&&""!==e.trim())}__updateHasError(){const e=this.node,t=Boolean(this.invalid&&this.__isNotEmpty(this.errorMessage));e&&(e.textContent=t?this.errorMessage:"",e.hidden=!t,t?e.setAttribute("role","alert"):e.removeAttribute("role")),this.host.toggleAttribute("has-error-message",t)}__updateErrorId(e){e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class FieldAriaController{constructor(e){this.host=e,this.__required=!1}setTarget(e){this.__target=e,this.__setAriaRequiredAttribute(this.__required),this.__setLabelIdToAriaAttribute(this.__labelId),this.__setErrorIdToAriaAttribute(this.__errorId),this.__setHelperIdToAriaAttribute(this.__helperId)}setRequired(e){this.__setAriaRequiredAttribute(e),this.__required=e}setLabelId(e){this.__setLabelIdToAriaAttribute(e,this.__labelId),this.__labelId=e}setErrorId(e){this.__setErrorIdToAriaAttribute(e,this.__errorId),this.__errorId=e}setHelperId(e){this.__setHelperIdToAriaAttribute(e,this.__helperId),this.__helperId=e}get __isGroupField(){return this.__target===this.host}__setLabelIdToAriaAttribute(e,t){this.__setAriaAttributeId("aria-labelledby",e,t)}__setErrorIdToAriaAttribute(e,t){this.__isGroupField?this.__setAriaAttributeId("aria-labelledby",e,t):this.__setAriaAttributeId("aria-describedby",e,t)}__setHelperIdToAriaAttribute(e,t){this.__isGroupField?this.__setAriaAttributeId("aria-labelledby",e,t):this.__setAriaAttributeId("aria-describedby",e,t)}__setAriaRequiredAttribute(e){this.__target&&(["input","textarea"].includes(this.__target.localName)||(e?this.__target.setAttribute("aria-required","true"):this.__target.removeAttribute("aria-required")))}__setAriaAttributeId(e,t,i){this.__target&&(i&&removeValueFromAttribute(this.__target,e,i),t&&addValueToAttribute(this.__target,e,t))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class HelperController extends SlotController{constructor(e){super(e,"helper",null,null,!0)}get helperId(){return this.node&&this.node.id}initCustomNode(e){this.__updateHelperId(e),this.__observeHelper(e);const t=this.__hasHelper(e);this.__toggleHasHelper(t)}teardownNode(e){this.__helperIdObserver&&this.__helperIdObserver.disconnect();const t=this.getSlotChild();if(t&&t!==this.defaultNode){const e=this.__hasHelper(t);this.__toggleHasHelper(e)}else this.__applyDefaultHelper(this.helperText,t)}setHelperText(e){this.helperText=e;const t=this.getSlotChild();t&&t!==this.defaultNode||this.__applyDefaultHelper(e,t)}__hasHelper(e){return!!e&&(e.children.length>0||e.nodeType===Node.ELEMENT_NODE&&customElements.get(e.localName)||this.__isNotEmpty(e.textContent))}__isNotEmpty(e){return e&&""!==e.trim()}__applyDefaultHelper(e,t){const i=this.__isNotEmpty(e);i&&!t&&(this.slotFactory=()=>document.createElement("div"),t=this.attachDefaultNode(),this.__updateHelperId(t),this.__observeHelper(t)),t&&(t.textContent=e),this.__toggleHasHelper(i)}__observeHelper(e){this.__helperObserver=new MutationObserver((e=>{e.forEach((e=>{const t=e.target,i=t===this.node;if("attributes"===e.type)i&&t.id!==this.defaultId&&this.__updateHelperId(t);else if(i||t.parentElement===this.node){const e=this.__hasHelper(this.node);this.__toggleHasHelper(e)}}))})),this.__helperObserver.observe(e,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}__toggleHasHelper(e){this.host.toggleAttribute("has-helper",e),this.dispatchEvent(new CustomEvent("helper-changed",{detail:{hasHelper:e,node:this.node}}))}__updateHelperId(e){e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ValidateMixin=dedupingMixin((e=>class extends e{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},required:{type:Boolean,reflectToAttribute:!0}}}validate(){const e=this.checkValidity();return this._setInvalid(!e),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:e}})),e}checkValidity(){return!this.required||!!this.value}_setInvalid(e){this._shouldSetInvalid(e)&&(this.invalid=e)}_shouldSetInvalid(e){return!0}})),FieldMixin=e=>class extends(ValidateMixin(LabelMixin(ControllerMixin(e)))){static get properties(){return{ariaTarget:{type:Object,observer:"_ariaTargetChanged"},errorMessage:{type:String,observer:"_errorMessageChanged"},helperText:{type:String,observer:"_helperTextChanged"}}}static get observers(){return["_invalidChanged(invalid)","_requiredChanged(required)"]}get _errorId(){return this._errorController.errorId}get _errorNode(){return this._errorController.node}get _helperId(){return this._helperController.helperId}get _helperNode(){return this._helperController.node}constructor(){super(),this._fieldAriaController=new FieldAriaController(this),this._helperController=new HelperController(this),this._errorController=new ErrorController(this),this._labelController.addEventListener("label-changed",(e=>{const{hasLabel:t,node:i}=e.detail;this.__labelChanged(t,i)})),this._helperController.addEventListener("helper-changed",(e=>{const{hasHelper:t,node:i}=e.detail;this.__helperChanged(t,i)}))}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}__helperChanged(e,t){e?this._fieldAriaController.setHelperId(t.id):this._fieldAriaController.setHelperId(null)}__labelChanged(e,t){e?this._fieldAriaController.setLabelId(t.id):this._fieldAriaController.setLabelId(null)}_errorMessageChanged(e){this._errorController.setErrorMessage(e)}_helperTextChanged(e){this._helperController.setHelperText(e)}_ariaTargetChanged(e){e&&this._fieldAriaController.setTarget(e)}_requiredChanged(e){this._fieldAriaController.setRequired(e)}_invalidChanged(e){this._errorController.setInvalid(e),setTimeout((()=>{e?this._fieldAriaController.setErrorId(this._errorController.errorId):this._fieldAriaController.setErrorId(null)}))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,InputConstraintsMixin=dedupingMixin((e=>class extends(DelegateStateMixin(ValidateMixin(InputMixin(e)))){static get constraints(){return["required"]}static get delegateAttrs(){return[...super.delegateAttrs,"required"]}ready(){super.ready(),this._createConstraintsObserver()}checkValidity(){return this.inputElement&&this._hasValidConstraints(this.constructor.constraints.map((e=>this[e])))?this.inputElement.checkValidity():!this.invalid}_hasValidConstraints(e){return e.some((e=>this.__isValidConstraint(e)))}_createConstraintsObserver(){this._createMethodObserver(`_constraintsChanged(stateTarget, ${this.constructor.constraints.join(", ")})`)}_constraintsChanged(e,...t){if(!e)return;const i=this._hasValidConstraints(t),o=this.__previousHasConstraints&&!i;(this._hasValue||this.invalid)&&i?this.validate():o&&this._setInvalid(!1),this.__previousHasConstraints=i}_onChange(e){e.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:e},bubbles:e.bubbles,cancelable:e.cancelable}))}__isValidConstraint(e){return Boolean(e)||0===e}})),stylesMap=new WeakMap;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function getRootStyles(e){return stylesMap.has(e)||stylesMap.set(e,new Set),stylesMap.get(e)}function insertStyles(e,t){const i=document.createElement("style");i.textContent=e,t===document?document.head.appendChild(i):t.insertBefore(i,t.firstChild)}const SlotStylesMixin=dedupingMixin((e=>class extends e{get slotStyles(){return{}}connectedCallback(){super.connectedCallback(),this.__applySlotStyles()}__applySlotStyles(){const e=this.getRootNode(),t=getRootStyles(e);this.slotStyles.forEach((i=>{t.has(i)||(insertStyles(i,e),t.add(i))}))}})),InputControlMixin=e=>class extends(SlotStylesMixin(DelegateFocusMixin(InputConstraintsMixin(FieldMixin(KeyboardMixin(e)))))){static get properties(){return{allowedCharPattern:{type:String,observer:"_allowedCharPatternChanged"},autoselect:{type:Boolean,value:!1},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},name:{type:String,reflectToAttribute:!0},placeholder:{type:String,reflectToAttribute:!0},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},title:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"name","type","placeholder","readonly","invalid","title"]}constructor(){super(),this._boundOnPaste=this._onPaste.bind(this),this._boundOnDrop=this._onDrop.bind(this),this._boundOnBeforeInput=this._onBeforeInput.bind(this)}get clearElement(){return console.warn(`Please implement the 'clearElement' property in <${this.localName}>`),null}get slotStyles(){return["\n          :is(input[slot='input'], textarea[slot='textarea'])::placeholder {\n            font: inherit;\n            color: inherit;\n          }\n        "]}ready(){super.ready(),this.clearElement&&(this.clearElement.addEventListener("click",(e=>this._onClearButtonClick(e))),this.clearElement.addEventListener("mousedown",(e=>this._onClearButtonMouseDown(e))))}_onClearButtonClick(e){e.preventDefault(),this.__clear()}_onClearButtonMouseDown(e){e.preventDefault(),isTouch||this.inputElement.focus()}_onFocus(e){super._onFocus(e),this.autoselect&&this.inputElement&&this.inputElement.select()}_onEscape(e){super._onEscape(e),this.clearButtonVisible&&this.value&&(e.stopPropagation(),this.__clear())}_onChange(e){e.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:e},bubbles:e.bubbles,cancelable:e.cancelable}))}__clear(){this.clear(),this.inputElement.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.inputElement.dispatchEvent(new Event("change",{bubbles:!0}))}_addInputListeners(e){super._addInputListeners(e),e.addEventListener("paste",this._boundOnPaste),e.addEventListener("drop",this._boundOnDrop),e.addEventListener("beforeinput",this._boundOnBeforeInput)}_removeInputListeners(e){super._removeInputListeners(e),e.removeEventListener("paste",this._boundOnPaste),e.removeEventListener("drop",this._boundOnDrop),e.removeEventListener("beforeinput",this._boundOnBeforeInput)}_onKeyDown(e){super._onKeyDown(e),this.allowedCharPattern&&!this.__shouldAcceptKey(e)&&(e.preventDefault(),this._markInputPrevented())}_markInputPrevented(){this.setAttribute("input-prevented",""),this._preventInputDebouncer=Debouncer.debounce(this._preventInputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")}))}__shouldAcceptKey(e){return e.metaKey||e.ctrlKey||!e.key||1!==e.key.length||this.__allowedCharRegExp.test(e.key)}_onPaste(e){if(this.allowedCharPattern){const t=e.clipboardData.getData("text");this.__allowedTextRegExp.test(t)||(e.preventDefault(),this._markInputPrevented())}}_onDrop(e){if(this.allowedCharPattern){const t=e.dataTransfer.getData("text");this.__allowedTextRegExp.test(t)||(e.preventDefault(),this._markInputPrevented())}}_onBeforeInput(e){this.allowedCharPattern&&e.data&&!this.__allowedTextRegExp.test(e.data)&&(e.preventDefault(),this._markInputPrevented())}_allowedCharPatternChanged(e){if(e)try{this.__allowedCharRegExp=new RegExp(`^${e}$`),this.__allowedTextRegExp=new RegExp(`^${e}*$`)}catch(e){console.error(e)}}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,InputFieldMixin=e=>class extends(InputControlMixin(e)){static get properties(){return{autocomplete:{type:String},autocorrect:{type:String},autocapitalize:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"autocapitalize","autocomplete","autocorrect"]}_inputElementChanged(e){super._inputElementChanged(e),e&&(e.value&&e.value!==this.value&&(console.warn(`Please define value on the <${this.localName}> component!`),e.value=""),this.value&&(e.value=this.value))}get __data(){return this.__dataValue||{}}set __data(e){this.__dataValue=e}_setFocused(e){super._setFocused(e),e||this.validate()}_onInput(e){super._onInput(e),this.invalid&&this.validate()}_valueChanged(e,t){super._valueChanged(e,t),void 0!==t&&this.invalid&&this.validate()}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,PatternMixin=e=>class extends(InputConstraintsMixin(e)){static get properties(){return{pattern:{type:String},preventInvalidInput:{type:Boolean,observer:"_preventInvalidInputChanged"}}}static get delegateAttrs(){return[...super.delegateAttrs,"pattern"]}static get constraints(){return[...super.constraints,"pattern"]}_checkInputValue(){if(this.preventInvalidInput){const e=this.inputElement;e&&e.value.length>0&&!this.checkValidity()&&(e.value=this.value||"",this.setAttribute("input-prevented",""),this._inputDebouncer=Debouncer.debounce(this._inputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")})))}}_onInput(e){this._checkInputValue(),super._onInput(e)}_preventInvalidInputChanged(e){e&&console.warn('WARNING: Since Vaadin 23.2, "preventInvalidInput" is deprecated. Please use "allowedCharPattern" instead.')}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let o$3=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(e$2&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n$3.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n$3.set(t,e))}return e}toString(){return this.cssText}};const r$2=e=>new o$3("string"==typeof e?e:e+"",void 0,s$3),i$1=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1]),e[0]);return new o$3(i,e,s$3)},S$1=(e,t)=>{e$2?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const i=document.createElement("style"),o=t$1.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,e.appendChild(i)}))},c$1=e$2?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r$2(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(e,t){switch(t){case Boolean:e=e?h$1:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},a$1=(e,t)=>t!==e&&(t==t||e==e),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const o=this._$Ep(i,t);void 0!==o&&(this._$Ev.set(o,i),e.push(o))})),e}static createProperty(e,t=l$2){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const n=this[e];this[t]=o,this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return!1;this[d$1]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(c$1(e))}else void 0!==e&&t.push(c$1(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=l$2){var o;const n=this.constructor._$Ep(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:n$2).toAttribute(t,i.type);this._$El=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$El=null}}_$AK(e,t){var i;const o=this.constructor,n=o._$Ev.get(e);if(void 0!==n&&this._$El!==n){const e=o.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:n$2;this._$El=n,this[n]=s.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let o=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||a$1)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.6.3");const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:e=>e}):void 0,o$1="$lit$",n$1=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$1,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=e=>null===e||"object"!=typeof e&&"function"!=typeof e,c=Array.isArray,v=e=>c(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(e,t)=>{const i=e.length-1,o=[];let n,s=2===t?"<svg>":"",r=f;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===f?"!--"===l[1]?r=_:void 0!==l[1]?r=m:void 0!==l[2]?(y.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=p):void 0!==l[3]&&(r=p):r===p?">"===l[0]?(r=null!=n?n:f,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?p:'"'===l[3]?$:g):r===$||r===g?r=p:r===_||r===m?r=f:(r=p,n=void 0);const I=r===p&&e[t+1].startsWith("/>")?" ":"";s+=r===f?i+h:c>=0?(o.push(a),i.slice(0,c)+o$1+i.slice(c)+n$1+I):i+n$1+(-2===c?(o.push(void 0),t):I)}return[P(e,s+(e[i]||"<?>")+(2===t?"</svg>":"")),o]};class N{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,s=0;const r=e.length-1,a=this.parts,[l,c]=V(e,t);if(this.el=N.createElement(l,i),C.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(o=C.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const e=[];for(const t of o.getAttributeNames())if(t.endsWith(o$1)||t.startsWith(n$1)){const i=c[s++];if(e.push(t),void 0!==i){const e=o.getAttribute(i.toLowerCase()+o$1).split(n$1),t=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:t[2],strings:e,ctor:"."===t[1]?H:"?"===t[1]?L:"@"===t[1]?z:k})}else a.push({type:6,index:n})}for(const t of e)o.removeAttribute(t)}if(y.test(o.tagName)){const e=o.textContent.split(n$1),t=e.length-1;if(t>0){o.textContent=s$1?s$1.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],u()),C.nextNode(),a.push({type:2,index:++n});o.append(e[t],u())}}}else if(8===o.nodeType)if(o.data===l$1)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(n$1,e+1));)a.push({type:7,index:n}),e+=n$1.length-1}n++}}static createElement(e,t){const i=r.createElement("template");return i.innerHTML=e,i}}function S(e,t,i=e,o){var n,s,r,a;if(t===T)return t;let l=void 0!==o?null===(n=i._$Co)||void 0===n?void 0:n[o]:i._$Cl;const c=d(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,i,o)),void 0!==o?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(t=S(e,l._$AS(e,t.values),l,o)),t}class M{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:i},parts:o}=this._$AD,n=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:r).importNode(i,!0);C.currentNode=n;let s=C.nextNode(),a=0,l=0,c=o[0];for(;void 0!==c;){if(a===c.index){let t;2===c.type?t=new R(s,s.nextSibling,this,e):1===c.type?t=new c.ctor(s,c.name,c.strings,this,e):6===c.type&&(t=new Z(s,this,e)),this._$AV.push(t),c=o[++l]}a!==(null==c?void 0:c.index)&&(s=C.nextNode(),a++)}return C.currentNode=r,n}v(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class R{constructor(e,t,i,o){var n;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cp=null===(n=null==o?void 0:o.isConnected)||void 0===n||n}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),d(e)?e===A||null==e||""===e?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==T&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):v(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=e:this.$(r.createTextNode(e)),this._$AH=e}g(e){var t;const{values:i,_$litType$:o}=e,n="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=N.createElement(P(o.h,o.h[0]),this.options)),o);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===n)this._$AH.v(i);else{const e=new M(n,this),t=e.u(this.options);e.v(i),this.$(t),this._$AH=e}}_$AC(e){let t=E.get(e.strings);return void 0===t&&E.set(e.strings,t=new N(e)),t}T(e){c(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new R(this.k(u()),this.k(u()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cp=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class k{constructor(e,t,i,o,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,o){const n=this.strings;let s=!1;if(void 0===n)e=S(this,e,t,0),s=!d(e)||e!==this._$AH&&e!==T,s&&(this._$AH=e);else{const o=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=S(this,o[i+r],t,r),a===T&&(a=this._$AH[r]),s||(s=!d(a)||a!==this._$AH[r]),a===A?e=A:e!==A&&(e+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class H extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4}j(e){e&&e!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name)}}class z extends k{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=S(this,e,t,0))&&void 0!==i?i:A)===T)return;const o=this._$AH,n=e===A&&o!==A||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,s=e!==A&&(o===A||n);n&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class Z{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}}const B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.8.0");const D=(e,t,i)=>{var o,n;const s=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:t;let r=s._$litPart$;if(void 0===r){const e=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;s._$litPart$=r=new R(t.insertBefore(u(),e),e,void 0,null!=i?i:{})}return r._$AI(e),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=D(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s}),(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const clearButton=i$1`
  [part='clear-button'] {
    display: none;
    cursor: default;
  }

  [part='clear-button']::before {
    content: '✕';
  }

  :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
    display: block;
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,fieldShared=i$1`
  :host {
    display: inline-flex;
    outline: none;
  }

  :host::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
    /* Size and position this element on the same vertical position as the input-field element
          to make vertical align for the host element work as expected */
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-label])) [part='label'] {
    display: none;
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,inputFieldContainer=i$1`
  [class$='container'] {
    display: flex;
    flex-direction: column;
    min-width: 100%;
    max-width: 100%;
    width: var(--vaadin-field-default-width, 12em);
  }
`
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,inputFieldShared=[fieldShared,inputFieldContainer,clearButton];
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
registerStyles("vaadin-text-field",inputFieldShared,{moduleId:"vaadin-text-field-styles"});class TextField extends(PatternMixin(InputFieldMixin(ThemableMixin(ElementMixin(PolymerElement))))){static get is(){return"vaadin-text-field"}static get template(){return html`
      <style>
        [part='input-field'] {
          flex-grow: 0;
        }
      </style>

      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[_theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
      <slot name="tooltip"></slot>
    `}static get properties(){return{maxlength:{type:Number},minlength:{type:Number}}}static get delegateAttrs(){return[...super.delegateAttrs,"maxlength","minlength"]}static get constraints(){return[...super.constraints,"maxlength","minlength"]}constructor(){super(),this._setType("text")}get clearElement(){return this.$.clearButton}ready(){super.ready(),this.addController(new InputController(this,(e=>{this._setInputElement(e),this._setFocusElement(e),this.stateTarget=e,this.ariaTarget=e}))),this.addController(new LabelledInputController(this.inputElement,this._labelController)),this._tooltipController=new TooltipController(this),this._tooltipController.setPosition("top"),this.addController(this._tooltipController)}}customElements.define(TextField.is,TextField);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridFilter extends class extends PolymerElement{}{static get template(){return html`
      <style>
        :host {
          display: inline-flex;
          max-width: 100%;
        }

        #filter {
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <slot name="filter">
        <vaadin-text-field id="filter" value="{{value}}"></vaadin-text-field>
      </slot>
    `}static get is(){return"vaadin-grid-filter"}static get properties(){return{path:String,value:{type:String,notify:!0},_connected:Boolean}}connectedCallback(){super.connectedCallback(),this._connected=!0}static get observers(){return["_filterChanged(path, value, _connected)"]}ready(){super.ready();const e=this.firstElementChild;e&&"filter"!==e.getAttribute("slot")&&(console.warn('Make sure you have assigned slot="filter" to the child elements of <vaadin-grid-filter>'),e.setAttribute("slot","filter"))}_filterChanged(e,t,i){void 0!==e&&void 0!==t&&i&&(void 0===this._previousValue&&""===t||(this._previousValue=t,this._debouncerFilterChanged=Debouncer.debounce(this._debouncerFilterChanged,timeOut.after(200),(()=>{this.dispatchEvent(new CustomEvent("filter-changed",{bubbles:!0}))}))))}focus(){this.$.filter.focus()}}customElements.define(GridFilter.is,GridFilter);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridFilterColumn extends GridColumn{static get is(){return"vaadin-grid-filter-column"}static get properties(){return{path:String,header:String}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)"]}constructor(){super(),this.__boundOnFilterValueChanged=this.__onFilterValueChanged.bind(this)}_defaultHeaderRenderer(e,t){let i=e.firstElementChild,o=i?i.firstElementChild:void 0;i||(i=document.createElement("vaadin-grid-filter"),o=document.createElement("vaadin-text-field"),o.setAttribute("slot","filter"),o.setAttribute("theme","small"),o.setAttribute("style","max-width: 100%;"),o.setAttribute("focus-target",""),o.addEventListener("value-changed",this.__boundOnFilterValueChanged),i.appendChild(o),e.appendChild(i)),i.path=this.path,i.value=this._filterValue,o.__rendererValue=this._filterValue,o.value=this._filterValue,o.label=this.__getHeader(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}__onFilterValueChanged(e){e.detail.value!==e.target.__rendererValue&&(this._filterValue=e.detail.value)}__getHeader(e,t){return e||(t?this._generateHeader(t):void 0)}}customElements.define(GridFilterColumn.is,GridFilterColumn),registerStyles("vaadin-grid-sorter",i$3`
    :host {
      justify-content: flex-start;
      align-items: baseline;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: var(--lumo-clickable-cursor);
    }

    [part='content'] {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part='indicators'] {
      margin-left: var(--lumo-space-s);
    }

    [part='indicators']::before {
      transform: scale(0.8);
    }

    :host(:not([direction]):not(:hover)) [part='indicators'] {
      color: var(--lumo-tertiary-text-color);
    }

    :host([direction]) {
      color: var(--lumo-primary-text-color);
    }

    [part='order'] {
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='indicators'] {
      margin-right: var(--lumo-space-s);
      margin-left: 0;
    }
  `,{moduleId:"lumo-grid-sorter"});
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const template=document.createElement("template");template.innerHTML="\n  <style>\n    @font-face {\n      font-family: 'vaadin-grid-sorter-icons';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');\n      font-weight: normal;\n      font-style: normal;\n    }\n  </style>\n",document.head.appendChild(template.content);class GridSorter extends(ThemableMixin(DirMixin(PolymerElement))){static get template(){return html`
      <style>
        :host {
          display: inline-flex;
          cursor: pointer;
          max-width: 100%;
        }

        [part='content'] {
          flex: 1 1 auto;
        }

        [part='indicators'] {
          position: relative;
          align-self: center;
          flex: none;
        }

        [part='order'] {
          display: inline;
          vertical-align: super;
        }

        [part='indicators']::before {
          font-family: 'vaadin-grid-sorter-icons';
          display: inline-block;
        }

        :host(:not([direction])) [part='indicators']::before {
          content: '\\e901';
        }

        :host([direction='asc']) [part='indicators']::before {
          content: '\\e900';
        }

        :host([direction='desc']) [part='indicators']::before {
          content: '\\e902';
        }
      </style>

      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">[[_getDisplayOrder(_order)]]</span>
      </div>
    `}static get is(){return"vaadin-grid-sorter"}static get properties(){return{path:String,direction:{type:String,reflectToAttribute:!0,notify:!0,value:null},_order:{type:Number,value:null},_isConnected:{type:Boolean,observer:"__isConnectedChanged"}}}static get observers(){return["_pathOrDirectionChanged(path, direction)"]}ready(){super.ready(),this.addEventListener("click",this._onClick.bind(this))}connectedCallback(){super.connectedCallback(),this._isConnected=!0}disconnectedCallback(){super.disconnectedCallback(),this._isConnected=!1,!this.parentNode&&this._grid&&this._grid.__removeSorters([this])}_pathOrDirectionChanged(){this.__dispatchSorterChangedEvenIfPossible()}__isConnectedChanged(e,t){!1!==t&&this.__dispatchSorterChangedEvenIfPossible()}__dispatchSorterChangedEvenIfPossible(){void 0!==this.path&&void 0!==this.direction&&this._isConnected&&(this.dispatchEvent(new CustomEvent("sorter-changed",{detail:{shiftClick:Boolean(this._shiftClick),fromSorterClick:Boolean(this._fromSorterClick)},bubbles:!0,composed:!0})),this._fromSorterClick=!1,this._shiftClick=!1)}_getDisplayOrder(e){return null===e?"":e+1}_onClick(e){if(e.defaultPrevented)return;const t=this.getRootNode().activeElement;this!==t&&this.contains(t)||(e.preventDefault(),this._shiftClick=e.shiftKey,this._fromSorterClick=!0,"asc"===this.direction?this.direction="desc":"desc"===this.direction?this.direction=null:this.direction="asc")}}customElements.define(GridSorter.is,GridSorter);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridSortColumn extends GridColumn{static get is(){return"vaadin-grid-sort-column"}static get properties(){return{path:String,direction:{type:String,notify:!0}}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)"]}constructor(){super(),this.__boundOnDirectionChanged=this.__onDirectionChanged.bind(this)}_defaultHeaderRenderer(e,t){let i=e.firstElementChild;i||(i=document.createElement("vaadin-grid-sorter"),i.addEventListener("direction-changed",this.__boundOnDirectionChanged),e.appendChild(i)),i.path=this.path,i.__rendererDirection=this.direction,i.direction=this.direction,i.textContent=this.__getHeader(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}__onDirectionChanged(e){e.detail.value!==e.target.__rendererDirection&&(this.direction=e.detail.value)}__getHeader(e,t){return e||(t?this._generateHeader(t):void 0)}}customElements.define(GridSortColumn.is,GridSortColumn);var __decorate$7=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpUsersGrid=class extends YpBaseElement{updated(e){super.updated(e),e.has("groupId")&&this._groupIdChanged(),e.has("communityId")&&this._communityIdChanged(),e.has("domainId")&&this._domainIdChanged(),e.has("adminUsers")&&this.users&&(this.showReload=!1,this._reload()),this._setupHeaderText()}static get styles(){return[super.styles,i$5`
        .userItem {
          padding-right: 16px;
        }

        .id {
          width: 40px;
        }

        .name {
          width: 200px;
        }

        md-circular-progress {
          margin-top: 8px;
          margin-left: 16px;
        }

        .email {
          width: 190px;
          overflow-wrap: break-word;
        }

        .organization {
          width: 150px;
        }

        .addRemoveButtons {
          width: 150px;
        }

        md-menu-item {
          z-index: 500;
        }

        vaadin-grid {
          --lumo-base-color: var(--md-sys-color-surface);
          --lumo-body-text-color: var(--md-sys-color-on-surface);
          --lumo-primary-color: var(--md-sys-color-primary);
          --lumo-primary-color-10pct: var(--md-sys-color-surface-variant);
          --lumo-primary-color-50pct: var(--md-sys-color-primary);
          --lumo-primary-contrast-color: var(--md-sys-color-on-tertiary);
          --lumo-tint: var(--md-sys-color-on-surface);
          --lumo-tint-10pct: var(--md-sys-color-on-surface);
          --lumo-tint-20pct: var(--md-sys-color-on-surface);
          --lumo-tint-30pct: var(--md-sys-color-on-surface);
          --lumo-tint-40pct: var(--md-sys-color-on-surface);
          --lumo-tint-50pct: var(--md-sys-color-on-surface);
          --lumo-tint-60pct: var(--md-sys-color-on-surface);
          --lumo-tint-70pct: var(--md-sys-color-on-surface);
          --lumo-tint-80pct: var(--md-sys-color-on-surface);
          --lumo-tint-90pct: var(--md-sys-color-on-surface);
          --lumo-header-text-color: var(--md-sys-color-on-surface);
          --lumo-body-text-color: var(--md-sys-color-on-surface);
          --lumo-secondary-text-color: var(--md-sys-color-on-surface);
          --lumo-tertiary-text-color: var(--md-sys-color-on-surface);
          --lumo-disabled-text-color: var(--md-sys-color-on-surface);
          --lumo-primary-text-color: var(--md-sys-color-on-surface);
          --lumo-error-text-color: var(--md-sys-color-error);
          --lumo-success-text-color: var(--md-sys-color-on-surface);
          --lumo-link-color: var(--md-sys-color-on-surface);
        }

        #selectOrganizationDialog {
        }

        [hidden] {
          display: none !important;
        }

        paper-listbox {
          margin-right: 8px !important;
        }

        .headerBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          margin: 0;
          padding: 0 0;
          padding-top: 12px;
          padding-bottom: 10px;
        }

        paper-button {
          margin-left: 24px;
        }

        .inputBox {
          margin-left: 16px;
          padding-left: 8px;
          padding-right: 8px;
          padding-bottom: 4px;
          margin-bottom: 4px;
          align-self: flex-start;
          margin-top: 2px;
          margin-right: 12px;
        }

        #grid {
          margin-top: 0;
          margin-bottom: 0;
        }

        .headerText {
          padding: 0 0 !important;
        }

        .collectionName {
          font-size: 22px;
          margin-bottom: 1px;
          margin-top: 4px;
        }

        .innerHeader {
          font-size: 17px;
        }

        .closeButton {
          width: 50px;
          height: 50px;
          margin-left: 4px;
          margin-right: 4px;
        }

        vaadin-grid {
          width: 100%;
          max-width: 1024px;
        }

        .topContainer {
          width: 100%;
          max-width: 1024px;
        }

        md-radio {
          margin-right: 8px;
          margin-bottom: 8px;
        }

        @media (max-width: 600px) {
          .closeButton {
            width: 45px;
            height: 45px;
          }

          .inputBox {
            margin-top: 6px;
          }

          paper-listbox {
            margin-right: 8px;
          }

          #dialog {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          .headerText {
            font-size: 20px;
            line-height: 1.2em;
            text-align: center;
          }
        }

        paper-spinner {
          margin-left: 16px;
          margin-top: 8px;
        }

        .inviteButton {
          margin: 16px;
        }

        #inviteUserEmail {
          margin-right: 16px;
        }

        @media (max-width: 600px) {
          .inviteButton {
            margin-top: 4px;
            margin-bottom: 12px;
            height: 48px;
            margin-right: 8px;
          }
        }

        .typeOfInvite {
          margin-left: 4px;
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .emailClass {
          margin-left: 6px;
          margin-right: 6px;
        }
      `]}renderSelectionHeader(e,t){j(x`
        <div style="position: relative;">
          <md-icon-button
            id="user-all-anchor"
            .ariaLabel="${this.t("openSelectedItemsMenu")}"
            @click="${this._openAllMenu.bind(this)}"
            ><md-icon>more_vert</md-icon></md-icon-button
          >
          <md-menu
            .menuCorner="${Corner.START_END}"
            class="helpButton"
            id="allUsersMenu"
            positioning="popover"
            anchor="user-all-anchor"
            @selected="${this._menuSelection}"
            ?disabled="${this.selectedUsersEmpty}"
          >
            ${this.selectedUsersEmpty?x``:x`
                  <md-menu-item
                    ?hidden="${this.adminUsers}"
                    @click="${this._removeAndDeleteContentSelectedUsers.bind(this)}"
                  >
                    ${this.t("removeSelectedAndDeleteContent")}
                    ${this.selectedUsersCount}
                  </md-menu-item>
                  <md-menu-item
                    ?hidden="${this.adminUsers}"
                    @click="${this._removeSelectedUsersFromCollection.bind(this)}"
                  >
                    <div ?hidden="${!this.groupId}">
                      ${this.t("removeSelectedFromGroup")}
                      ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!this.communityId}">
                      ${this.t("removeSelectedFromCommunity")}
                      ${this.selectedUsersCount}
                    </div>
                    <div ?hidden="${!this.domainId}">
                      ${this.t("removeSelectedFromDomain")}
                      ${this.selectedUsersCount}
                    </div>
                  </md-menu-item>
                  <md-menu-item
                    ?hidden="${!this.adminUsers}"
                    @click="${this._removeSelectedAdmins.bind(this)}"
                  >
                    ${this.t("removeSelectedAdmins")} ${this.selectedUsersCount}
                  </md-menu-item>
                `}
          </md-menu>
        </div>
      `,e)}selectionRenderer(e,t,i){j(x`
        <div style="position: relative;">
          <md-icon-button
            .ariaLabel="${this.t("openOneItemMenu")}"
            data-args="${i.item.id}"
            id="user-item-${i.item.id}-anchor"
            @click="${this._setSelected.bind(this)}"
            ><md-icon>more_vert</md-icon></md-icon-button
          >
        </div>
        <md-menu
          .menuCorner="${Corner.START_END}"
          positioning="popover"
          id="userItemMenu${i.item.id}"
          anchor="user-item-${i.item.id}-anchor"
          class="helpButton"
        >
          <md-menu-item
            data-args="${i.item.id}"
            ?hidden="${this.adminUsers}"
            @click="${this._removeUserFromCollection.bind(this)}"
          >
            <div ?hidden="${!this.groupId}">${this.t("removeFromGroup")}</div>
            <div ?hidden="${!this.communityId}">
              ${this.t("removeFromCommunity")}
            </div>
            <div ?hidden="${!this.domainId}">${this.t("removeFromDomain")}</div>
          </md-menu-item>
          <md-menu-item
            data-args="${i.item.id}"
            ?hidden="${this.adminUsers}"
            @click="${this._removeAndDeleteUserContent.bind(this)}"
          >
            <div ?hidden="${!this.groupId}">
              ${this.t("removeFromGroupDeleteContent")}
            </div>
            <div ?hidden="${!this.communityId}">
              ${this.t("removeFromCommunityDeleteContent")}
            </div>
            <div ?hidden="${!this.domainId}">
              ${this.t("removeFromDomainDeleteContent")}
            </div>
          </md-menu-item>
          <md-menu-item
            data-args="${i.item.id}"
            ?hidden="${!this.adminUsers}"
            @click="${this._removeAdmin.bind(this)}"
          >
            ${this.t("users.removeAdmin")}
          </md-menu-item>

          <md-menu-item
            data-args="${i.item.id}"
            ?hidden="${this._userOrganizationName(i.item)}"
            @click="${this._addToOrganization.bind(this)}"
          >
            ${this.t("users.addToOrganization")}
          </md-menu-item>
          <md-menu-item
            data-args="${i.item.id}"
            ?hidden="${!this._userOrganizationName(i.item)}"
            data-args-org="${this._userOrganizationId(i.item)}"
            @click="${this._removeFromOrganization.bind(this)}"
          >
            ${this.t("users.removeFromOrganization")}
          </md-menu-item>
        </md-menu>
      `,e)}_reloadFromButton(){this.showReload=!1,this._reload()}render(){return x`
      <div class="layout horizontal topContainer">
        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName}</div>
          </div>
          <div class="innerHeader">
            ${this.headerText}
            <span ?hidden="${!this.totalUserCount}"
              >(${this.totalUserCount})</span
            >
          </div>
        </div>
        <div ?hidden="${!this.spinnerActive}">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>

        <div class="flex"></div>
        <div ?hidden="${!this.showReload}">
          <md-icon-button
            aria-label="${this.t("reload")}"
            class="closeButton"
            @click="${this._reloadFromButton}"
            ><md-icon>autorenew</md-icon></md-icon-button
          >
        </div>
        <div ?hidden="${null!=this.domainId}">
          <div
            ?hidden="${this.adminUsers}"
            class="layout horizontal wrap inputBox"
          >
            <md-outlined-text-field
              id="inviteUserEmail"
              label="${this.t("email")}"
              class="emailClass"
              .value="${""}"
            ></md-outlined-text-field>
            <div
              id="typeOfInvite"
              name="typeOfInvite"
              class="typeOfInvite layout vertical"
              selected="${this.inviteType}"
            >
              <label>
                <md-radio
                  id="sendInviteByEmail"
                  name="inviteSelection"
                  @click="${()=>this.inviteType="sendInviteByEmail"}"
                  checked
                ></md-radio>
                ${this.t("sendInviteByEmail")}</label
              ><label>
                <md-radio
                  id="addUserDirectly"
                  name="inviteSelection"
                  @click="${()=>this.inviteType="addUserDirectly"}"
                ></md-radio
                >${this.t("addUserDirectlyIfExist")}</label
              >
            </div>
            <md-filled-button class="inviteButton" @click="${this._inviteUser}"
              >${this.t("users.inviteUser")}</md-filled-button
            >
          </div>
        </div>

        <div
          ?hidden="${!this.adminUsers}"
          class="layout horizontal wrap inputBox"
        >
          <md-outlined-text-field
            label="${this.t("email")}"
            class="emailClass"
            id="addAdminEmail"
          ></md-outlined-text-field>
          <md-filled-button class="inviteButton" @click="${this._addAdmin}"
            >${this.t("users.addAdmin")}</md-filled-button
          >
        </div>
      </div>

      <vaadin-grid
        id="grid"
        aria-label="${this.headerText}"
        .items="${this.users}"
        .selectedItems="${this.selectedUsers}"
        @selected-items-changed="${this._selectedUsersChanged.bind(this)}"
        multi-sort
        multi-sort-priority="append"
      >
        <vaadin-grid-selection-column
          auto-select
        ></vaadin-grid-selection-column>
        <vaadin-grid-sort-column path="id"></vaadin-grid-sort-column>
        <vaadin-grid-filter-column
          flex-grow="2"
          width="140px"
          path="name"
          header="${this.t("name")}"
        ></vaadin-grid-filter-column>
        <vaadin-grid-filter-column
          path="email"
          flex-grow="1"
          width="150px"
          header="${this.t("email")}"
        ></vaadin-grid-filter-column>
        <vaadin-grid-column
          flex-grow="1"
          width="150px"
          header="${this.t("organization")}"
          .renderer="${(e,t,i)=>{e.innerHTML=`\n              <div\n                class="organization"\n                ?hidden="${!this._userOrganizationName(i.item)}"\n              >\n                <div class="organizationName">\n                  ${this._userOrganizationName(i.item)||""}\n                </div>\n              </div>\n            `}}"
        ></vaadin-grid-column>
        <vaadin-grid-column
          width="70px"
          .renderer=${this.selectionRenderer.bind(this)}
          flex-grow="1"
          .headerRenderer=${this.renderSelectionHeader.bind(this)}
        ></vaadin-grid-column>
      </vaadin-grid>

      <md-dialog id="selectOrganizationDialog">
        <div slot="headline">${this.t("users.selectOrganization")}</div>
        ${this.availableOrganizations?x`
              <div slot="content">
                <md-list>
                  ${this.availableOrganizations.map((e=>x`
                      <md-list-item
                        interactive
                        @click="${this._selectOrganization.bind(this)}"
                        id="${e.id}"
                        >${e.name}</md-list-item
                      >
                    `))}
                </md-list>
              </div>
            `:T$2}
        <div slot="actions">
          <md-filled-button @click="${this.closeOrganizationDialog}"
            >${this.t("Close")}</md-filled-button
          >
        </div>
      </md-dialog>
    `}get spinnerActive(){return!this.totalUserCount||this.forceSpinner}async _generateRequest(e=void 0){e?this.lastFethedId=e:e=this.lastFethedId;const t=this.adminUsers?"admin_users":"users",i=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${e}/${t}`,"GET");this._usersResponse({detail:i})}async _ajaxError(e=void 0){this.forceSpinner=!1}constructor(e){super(),this.adminUsers=!1,this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.showReload=!1,this.forceSpinner=!1,this.inviteType="sendInviteByEmail",this.collectionName=e}connectedCallback(){super.connectedCallback(),this._setGridSize(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}async _reload(){try{await this._generateRequest(),this.forceSpinner=!0}catch(e){this._ajaxError()}finally{this.forceSpinner=!1}}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=window.setTimeout((()=>{this.resizeTimeout=void 0,this._setGridSize()}),66))}_setGridSize(){this.gridElement&&(window.innerWidth<=600?this.gridElement.style.height=`${window.innerHeight}px`:this.gridElement.style.height=.8*window.innerHeight+"px")}_menuSelection(e){const t=this.shadowRoot?.querySelectorAll("md-menu");t?.forEach((e=>{e.select("")}))}get totalUserCount(){return this.users?YpFormattingHelpers.number(this.users.length):null}_selectedUsersChanged(e){e.detail&&e.detail.value&&(this.selectedUsers=e.detail.value),this.selectedUsers&&this.selectedUsers.length>0?(this.selectedUsersEmpty=!1,this.selectedUsersCount=this.selectedUsers.length,this.selectedUserIds=this.selectedUsers.map((e=>e.id))):(this.selectedUsersEmpty=!0,this.selectedUsersCount=0,this.selectedUserIds=[])}_userOrganizationId(e){return e&&e.OrganizationUsers&&e.OrganizationUsers.length>0?e.OrganizationUsers[0].id:null}_userOrganizationName(e){return e&&e.OrganizationUsers&&e.OrganizationUsers.length>0?e.OrganizationUsers[0].name:null}_availableOrganizations(){return window.appUser.adminRights?.OrganizationAdmins||[]}async _addToOrganization(e){this.userIdForSelectingOrganization=parseInt(e.target.getAttribute("data-args")),this.availableOrganizations=this._availableOrganizations(),this.shadowRoot.getElementById("selectOrganizationDialog").show()}closeOrganizationDialog(){this.shadowRoot.getElementById("selectOrganizationDialog").close()}async _removeFromOrganization(e){const t=e.target,i=t.getAttribute("data-args"),o=t.getAttribute("data-args-org");try{await window.adminServerApi.removeUserFromOrganization(parseInt(o),parseInt(i)),this._reload()}catch(e){this._ajaxError(e)}}async _selectOrganization(e){const t=e.target.id;try{await window.adminServerApi.addUserToOrganization(parseInt(t),this.userIdForSelectingOrganization),this.shadowRoot.getElementById("selectOrganizationDialog").close(),this._reload()}catch(e){this._ajaxError(e)}}async _removeAdmin(e){const t=parseInt(e.target.getAttribute("data-args"));try{"groups"===this.modelType&&this.groupId?await window.adminServerApi.removeAdmin("groups",this.groupId,t):"communities"===this.modelType&&this.communityId?await window.adminServerApi.removeAdmin("communities",this.communityId,t):"domains"===this.modelType&&this.domainId?await window.adminServerApi.removeAdmin("domains",this.domainId,t):console.warn("Can't find model type or ids"),this._reload()}catch(e){this._ajaxError(e)}}_removeSelectedAdmins(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToRemoveAdmins"),this._reallyRemoveSelectedAdmins.bind(this),!0,!1)}))}_removeAndDeleteContentSelectedUsers(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveAndDeleteSelectedUserContent"),this._reallyRemoveAndDeleteContentSelectedUsers.bind(this),!0,!0)}))}_removeSelectedUsersFromCollection(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveSelectedUsers"),this._reallyRemoveSelectedUsersFromCollection.bind(this),!0,!0)}))}_removeUserFromCollection(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveUser"),this._reallyRemoveUserFromCollection.bind(this),!0,!1)}))}_removeAndDeleteUserContent(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveAndDeleteUser"),this._reallyRemoveAndDeleteUserContent.bind(this),!0,!0)}))}async _removeMaster(e,t=void 0){let i,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else{if("domains"!==this.modelType||!this.domainId)return void console.error("Can't find model type or ids");o=this.domainId}if(t&&t.length>0)i=`/api/${this.modelType}/${o}/${e}`;else{if(!this.selectedUserId)return void console.error("No user ids to remove");i=`/api/${this.modelType}/${o}/${this.selectedUserId}/${e}`}const n=t?{userIds:t}:{};try{this.forceSpinner=!0,await window.adminServerApi.adminMethod(i,"DELETE",n),this._manyItemsResponse(!0)}catch(e){console.error(e),this._ajaxError(e)}finally{this.forceSpinner=!1}if(this.selectedUserId){const e=this._findUserFromId(this.selectedUserId);e&&this.gridElement instanceof GridElement&&this.gridElement.deselectItem(e)}}async _reallyRemoveSelectedAdmins(){await this._removeMaster("remove_many_admins",this.selectedUserIds)}async _reallyRemoveAndDeleteContentSelectedUsers(){await this._removeMaster("remove_many_users_and_delete_content",this.selectedUserIds)}async _reallyRemoveSelectedUsersFromCollection(){await this._removeMaster("remove_many_users",this.selectedUserIds)}async _reallyRemoveUserFromCollection(){await this._removeMaster("remove_user")}async _reallyRemoveAndDeleteUserContent(){await this._removeMaster("remove_and_delete_user_content")}_setupUserIdFromEvent(e){const t=e.target;let i=t.parentElement.getAttribute("data-args");i||(i=t.getAttribute("data-args")),i&&(this.selectedUserId=parseInt(i))}_openAllMenu(e){this.$$("#allUsersMenu").open=!0}_setSelected(e){const t=e.target.getAttribute("data-args");if(t){const e=this._findUserFromId(parseInt(t));e&&this.$$("#grid").selectItem(e)}setTimeout((()=>{this.$$(`#userItemMenu${t}`).open=!0}))}_findUserFromId(e){let t;return this.users.forEach((i=>{i.id==e&&(t=i)})),t}async _addAdmin(e){try{let e;if("groups"===this.modelType&&this.groupId&&this.addAdminEmail)e=await window.adminServerApi.addAdmin("groups",this.groupId,this.addAdminEmail.value);else if("communities"===this.modelType&&this.communityId&&this.addAdminEmail&&this.addAdminEmail.value)e=await window.adminServerApi.addAdmin("communities",this.communityId,this.addAdminEmail.value);else{if(!("domains"===this.modelType&&this.domainId&&this.addAdminEmail&&this.addAdminEmail.value))return void console.warn("Can't find model type or ids");e=await window.adminServerApi.addAdmin("domains",this.domainId,this.addAdminEmail.value)}this._addAdminResponse()}catch(e){this._ajaxError(e)}}async _inviteUser(e){try{let e;if("groups"===this.modelType&&this.groupId&&this.inviteUserEmail&&this.inviteUserEmail.value)e=await window.adminServerApi.inviteUser("groups",this.groupId,this.inviteUserEmail.value,this.inviteType);else{if("communities"!==this.modelType||!this.communityId||!this.inviteUserEmail.value)return void console.warn("Can't find model type or ids");e=await window.adminServerApi.inviteUser("communities",this.communityId,this.inviteUserEmail.value,this.inviteType)}this._inviteUserResponse()}catch(e){this._ajaxError(e)}}_manyItemsResponse(e=!1){this.forceSpinner=!1,this.showReload=!0,e&&window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading")),setTimeout((()=>{this._reload()}),500)}_removeAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminRemoved")),this._reload()}_removeManyAdminResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeManyUsersResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeAndDeleteCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalAndDeletionInProgress"),void 0,!0,!1,!0)})),this._removeUserResponse()}_removeAndDeleteManyCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsAndDeletionsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeUserResponse(){window.appGlobals.notifyUserViaToast(this.t("userRemoved")),this._reload()}_addAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminAdded")+" "+this.addAdminEmail.value),this.addAdminEmail.value="",this._reload()}_addOrganizationResponse(e){window.appGlobals.notifyUserViaToast(this.t("organizationUserAdded")+" "+e.detail.response.email),this._reload()}_removeOrganizationResponse(e){window.appGlobals.notifyUserViaToast(this.t("organizationUserRemoved")+" "+e.detail.response.email),this._reload()}_inviteUserResponse(){window.appGlobals.notifyUserViaToast(this.t("users.userInvited")+" "+this.inviteUserEmail.value),this.$$("#inviteUserEmail").value="",this._reload()}_domainIdChanged(){this.domainId&&(this._reset(),this.modelType="domains",this._generateRequest(this.domainId))}_groupIdChanged(){this.groupId&&(this._reset(),this.modelType="groups",this._generateRequest(this.groupId))}_communityIdChanged(){this.communityId&&(this._reset(),this.modelType="communities",this._generateRequest(this.communityId))}_usersResponse(e){this.forceSpinner=!1,this.users=e.detail,this._resetSelectedAndClearCache()}setup(e,t,i,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.users=void 0,this.adminUsers=o,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),this._setupHeaderText()}_reset(){this.users=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedUsers=[],this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.$$("#grid").clearCache()}_setupHeaderText(){this.adminUsers?this.usersCountText=this.t("adminsCount"):this.usersCountText=this.t("usersCount"),this.groupId?this.adminUsers?this.headerText=this.t("group.admins"):this.headerText=this.t("group.users"):this.communityId?this.adminUsers?this.headerText=this.t("community.admins"):this.headerText=this.t("community.users"):this.domainId&&(this.adminUsers?this.headerText=this.t("domainAdmins"):this.headerText=this.t("domainUsers"))}};__decorate$7([e$7("#addAdminEmail")],YpUsersGrid.prototype,"addAdminEmail",void 0),__decorate$7([e$7("#inviteUserEmail")],YpUsersGrid.prototype,"inviteUserEmail",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"headerText",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"users",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"groupId",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"communityId",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"domainId",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"adminUsers",void 0),__decorate$7([n$8({type:Object})],YpUsersGrid.prototype,"selected",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"modelType",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"availableOrganizations",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"userIdForSelectingOrganization",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"selectedUsers",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"selectedUsersCount",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"selectedUsersEmpty",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"selectedUserIds",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"selectedUserId",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"collectionName",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"usersCountText",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"showReload",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"forceSpinner",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"lastFethedId",void 0),__decorate$7([e$7("#grid")],YpUsersGrid.prototype,"gridElement",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"inviteType",void 0),YpUsersGrid=__decorate$7([t$5("yp-users-grid")],YpUsersGrid);var __decorate$6=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpContentModeration=class extends YpBaseElement{constructor(){super(...arguments),this.multiSortEnabled=!1,this.opened=!1,this.showReload=!1,this.forceSpinner=!1,this.selectedItemsEmpty=!0,this.selectedItemsCount=0,this.typeOfModeration="moderate_all_content",this.allowGridEventsAfterMenuOpen=!1}updated(e){super.updated(e),(e.has("groupId")||e.has("communityId")||e.has("domainId")||e.has("userId"))&&this._refreshAfterChange(),e.has("activeItem")&&this._activeItemChanged(this.activeItem,e.get("activeItem"))}static get styles(){return[super.styles,i$5`
        :host {
          width: 100%;
          height: 100%;
          margin: 0;
          top: unset !important;
          left: unset !important;
        }

        .itemItem {
          padding-right: 16px;
        }

        .id {
          width: 40px;
        }

        .name {
          width: 200px;
        }

        .email {
          width: 190px;
          overflow-wrap: break-word;
        }

        .addDeletedButtons {
          width: 150px;
        }

        [hidden] {
          display: none !important;
        }

        paper-listbox {
          margin-right: 8px !important;
        }

        .headerBox {
          background-color: var(--md-sys-primary-container);
          color: var(--md-sys-on-primary-container);
          margin: 0;
          padding: 0 0;
          padding-top: 12px;
          padding-bottom: 10px;
        }

        md-text-button {
          margin-left: 8px;
        }

        #grid {
          margin-top: 0;
        }

        .headerText {
          padding: 0 0 !important;
        }

        .collectionName {
          font-size: 22px;
          margin-bottom: 1px;
          margin-top: 4px;
        }

        .innerHeader {
          font-size: 17px;
        }

        .closeButton {
          width: 50px;
          height: 50px;
          margin-left: 4px;
          margin-right: 4px;
        }

        md-checkbox {
          margin-top: 16px;
          margin-right: 24px;
        }

        @media (max-width: 600px) {
          .closeButton {
            width: 45px;
            height: 45px;
          }

          paper-listbox {
            margin-right: 8px;
          }

          #dialog {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .headerText {
            font-size: 20px;
            line-height: 1.2em;
            text-align: center;
          }
        }

        .details {
          display: flex;
          margin: 8px;
        }

        yp-point {
          min-height: 100px;
          max-width: 500px;
          margin-bottom: 8px;
        }

        yp-header {
          margin-bottom: 8px;
        }

        md-text-button {
          font-size: 18px;
          margin-top: 16px;
        }

        .analysis {
          margin-top: 12px;
        }

        .leftColumn {
          padding-right: 16px;
        }

        .mainScore {
        }

        .linkIcon {
        }

        vaadin-grid {
          font-size: 14px;
        }
      `]}renderContent(e,t,i){const o=i.item;return j(x`
      <div class="layout horizontal">
        <yp-magic-text
          .contentId="${o.id}"
          .content="${o.pointTextContent}"
          textType="pointContent"
        ></yp-magic-text>
        <yp-magic-text
          .contentId="${o.id}"
          .content="${o.postNameContent}"
          textType="postName"
        ></yp-magic-text>
        &nbsp;
        <yp-magic-text
          .contentId="${o.id}"
          .content="${o.postTextContent}"
          textType="postContent"
        ></yp-magic-text>
        &nbsp;
        <yp-magic-text
          .contentId="${o.id}"
          .content="${o.postTranscriptContent}"
          textType="postTranscriptContent"
        ></yp-magic-text>
      </div>
    `,e)}renderItemDetail(e,t,i){const o=i.item;return j(x`
      <div class="details layout vertical center-center detailArea">
        <div class="layout horizontal">
          ${o.is_post?x`
                <div class="layout vertical center-center">
                  <yp-header
                    hideActions
                    .post="${o}"
                    .postName="${o.name}"
                    headerMode
                  ></yp-header>
                  <a href="/yp/${o.id}" target="_blank"
                    ><paper-icon-button
                      .ariaLabel="${this.t("linkToContentItem")}"
                      class="linkIcon"
                      icon="link"
                    ></paper-icon-button
                  ></a>
                </div>
              `:T$2}
          ${o.is_point?x`
                <div class="layout vertical center-center">
                  <yp-point
                    hideActions
                    .point="${o}"
                  ></yp-point>
                  <a
                    ?hidden="${!o.post_id}"
                    href="/yp/[[item.post_id]]/${o.id}"
                    target="_blank"
                    ><md-icon-button
                      .ariaLabel="${this.t("linkToContentItem")}"
                      class="linkIcon"
                      ><md-icon>link</md-icon></md-icon-button
                    ></a
                  >
                </div>
              `:T$2}
        </div>

        ${o.moderation_data?x`
              <div class="layout horizontal analysis">
                <div
                  class="layout vertical leftColumn"
                  ?hidden="${null!=this.userId}"
                >
                  <div
                    class="mainScore"
                    ?hidden="${!o.moderation_data.moderation.toxicityScore}"
                  >
                    Toxicity Score:
                    ${this._toPercent(o.moderation_data.moderation.toxicityScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.identityAttackScore}"
                  >
                    Identity Attack Score:
                    ${this._toPercent(o.moderation_data.moderation.identityAttackScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.threatScore}"
                  >
                    Threat Score:
                    ${this._toPercent(o.moderation_data.moderation.threatScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.insultScore}"
                  >
                    Insult Score:
                    ${this._toPercent(o.moderation_data.moderation.insultScore)}
                  </div>
                </div>
                <div
                  class="layout vertical"
                  ?hidden="${null!=this.userId}"
                >
                  <div
                    class="mainScore"
                    ?hidden="${!o.moderation_data.moderation.severeToxicityScore}"
                  >
                    Severe Toxicity Score:
                    ${this._toPercent(o.moderation_data.moderation.severeToxicityScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.profanityScore}"
                  >
                    Profanity Score:
                    ${this._toPercent(o.moderation_data.moderation.profanityScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.sexuallyExplicitScore}"
                  >
                    Sexually Excplicit Score:
                    ${this._toPercent(o.moderation_data.moderation.sexuallyExplicitScore)}
                  </div>
                  <div
                    ?hidden="${!o.moderation_data.moderation.flirtationScore}"
                  >
                    Flirtation Score:
                    ${this._toPercent(o.moderation_data.moderation.flirtationScore)}
                  </div>
                </div>
              </div>
            `:T$2}
      </div>
    `,e)}renderActionHeader(e,t){return j(x`
      <md-menu
        class="helpButton"
        ?disabled="${this.selectedItemsEmpty}"
        @opened="${this._refreshGridAsyncDelay}"
      >
        <md-icon-button
          .ariaLabel="${this.t("openSelectedItemsMenu")}"
          icon="more_vert"
          slot="trigger"
          @click="${this._menuOpened}"
        ></md-icon-button>
        <md-menu-item
          ?hidden="${null!=this.userId}"
          @click="${this._approveSelected}"
        >
          ${this.t("approveSelectedContent")} ${this.selectedItemsCount}
        </md-menu-item>
        <md-menu-item
          ?hidden="${!this.onlyFlaggedItems}"
          @click="${this._clearSelectedFlags}"
        >
          ${this.t("clearSelectedFlags")} ${this.selectedItemsCount}
        </md-menu-item>
        <md-menu-item
          ?hidden="${null!=this.userId}"
          @click="${this._blockSelected}"
        >
          ${this.t("blockSelectedContent")} ${this.selectedItemsCount}
        </md-menu-item>
        <md-menu-item
          ?hidden="${!this.userId}"
          @click="${this._anonymizeSelected}"
        >
          ${this.t("anonymizeSelectedContent")} ${this.selectedItemsCount}
        </md-menu-item>
        <md-menu-item @click="${this._deleteSelected}">
          ${this.t("deleteSelectedContent")} ${this.selectedItemsCount}
        </md-menu-item>
      </md-menu>
    `,e)}renderAction(e,t,i){const o=i.item;return j(x`
      <md-menu class="helpButton" @opened="${this._refreshGridAsyncDelay}">
        <md-icon-button
          .ariaLabel="${this.t("openOneItemMenu")}"
          icon="more_vert"
          data-args="${o.id}"
          @click="${this._setSelected}"
          slot="trigger"
        ></md-icon-button>
        <md-menu-item
          data-args="${o.id}"
          data-model-class="${o.type}"
          ?hidden="${null!=this.userId}"
          @click="${this._approve}"
        >
          ${this.t("approveContent")}
        </md-menu-item>
        <md-menu-item
          data-args="${o.id}"
          data-model-class="${o.type}"
          ?hidden="${!this.onlyFlaggedItems}"
          @click="${this._clearFlags}"
        >
          ${this.t("clearFlags")}
        </md-menu-item>
        <md-menu-item
          data-args="${o.id}"
          data-model-class="${o.type}"
          ?hidden="${null!=this.userId}"
          @click="${this._block}"
        >
          ${this.t("blockContent")}
        </md-menu-item>
        <md-menu-item
          data-args="${o.id}"
          data-model-class="${o.type}"
          ?hidden="${!this.userId}"
          @click="${this._anonymize}"
        >
          ${this.t("anonymizeContent")}
        </md-menu-item>
        <md-menu-item
          data-args="${o.id}"
          data-model-class="${o.type}"
          @click="${this._delete}"
        >
          ${this.t("deleteContent")}
        </md-menu-item>
      </md-menu>
    `,e)}render(){return x`
      <div class="layout horizontal headerBox wrap">
        <div>
          <md-icon-button
            .ariaLabel="${this.t("close")}"
            id="dismissBtn"
            icon="close"
            class="closeButton"
            dialogDismiss
          ></md-icon-button>
        </div>

        <div class="headerText layout vertical">
          <div class="layout horizontal">
            <div class="collectionName">${this.collectionName}</div>
          </div>
          <div class="innerHeader">
            ${this.headerText}
            <span ?hidden="${!this.totalItemsCount}"
              >(${this.totalItemsCount} ${this.itemsCountText})</span
            >
          </div>
        </div>
        <div ?hidden="${!this.spinnerActive}">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
        <div class="flex"></div>
        <div class="checkBox" ?hidden="${!this.wide}">
          <md-checkbox ?checked="${this.multiSortEnabled}"
            >${this.t("multiSortEnabled")}</md-checkbox
          >
        </div>
        <div ?hidden="${!this.showReload}">
          <md-icon-button
            .ariaLabel="${this.t("reload")}"
            icon="autorenew"
            class="closeButton"
            @click="${this._reload}"
          ><md-icon>autorenew</md-icon></md-icon-button>
        </div>
      </div>

      <vaadin-grid
        id="grid"
        theme="row-dividers"
        column-reordering-allowed
        multi-sort="${this.multiSortEnabled}"
        .activeItem="${this.activeItem}"
        .ariaLabel="${this.headerText}"
        .rowDetailsRenderer="${this.renderItemDetail}"
        .items="${this.items}"
        .selectedItems="${this.selectedItems}"
      >

      <vaadin-grid-selection-column> </vaadin-grid-selection-column>

      <vaadin-grid-sort-column
        width="130px"
        flexGrow="0"
        path="firstReportedDateFormatted"
        .header="${this.t("firstReported")}"
        ?hidden="${this.onlyFlaggedItems}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="130px"
        flexGrow="0"
        path="lastReportedAtDateFormatted"
        .header="${this.t("lastReported")}"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="start"
        flexGrow="0"
        path="type"
        .renderer="${(e,t,i)=>this._getType(i.item.type)}"
        .header="${this.t("type")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="start"
        flexGrow="0"
        .renderer="${(e,t,i)=>i.item.status}"
        path="status"
        .header="${this.t("publishStatus")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="center"
        flexGrow="0"
        path="counter_flags"
        .renderer="${(e,t,i)=>i.item.counter_flags}"
        .header="${this.t("flags")}"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="130px"
        textAlign="start"
        flexGrow="0"
        path="source"
        .renderer="${(e,t,i)=>i.item.source}"
        .header="${this.t("source")}"
        ?hidden="${!this.onlyFlaggedItems}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="105px"
        textAlign="center"
        flexGrow="0"
        path="toxicityScoreRaw"
        .renderer="${(e,t,i)=>i.item.toxicityScore}"
        .header="${this.t("toxicityScore")}?"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="150px"
        textAlign="start"
        flexGrow="1"
        path="groupName"
        .renderer="${(e,t,i)=>i.item.groupName}"
        .header="${this.t("groupName")}"
        ?hidden="${!this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-filter-column
        width="200px"
        flexGrow="4"
        path="content"
        .renderer="${this.renderContent.bind(this)}"
        .header="${this.t("content")}"
        ?hidden="${!this.wide}"
      >
      </vaadin-grid-filter-column>

      <vaadin-grid-filter-column
        flexGrow="1"
        path="user_email"
        width="150px"
        .renderer="${(e,t,i)=>i.item.user_email}"
        .header="${this.t("creator")}"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-filter-column>

      <vaadin-grid-filter-column
        flexGrow="0"
        path="lastReportedByEmail"
        width="150px"
        .header="${this.t("flaggedBy")}"
        ?hidden="${!this.onlyFlaggedItems}"
      >
      </vaadin-grid-filter-column>

      <vaadin-grid-column
        width="70px"
        flexGrow="0"
        .headerRenderer="${this.renderActionHeader.bind(this)}"
        .renderer="${this.renderAction.bind(this)}"
      >
      </vaadin-grid>
    `}get spinnerActive(){return!this.totalItemsCount||this.forceSpinner}_ajaxError(e=void 0){this.forceSpinner=!1}async _reload(){this.forceSpinner=!0,await this._refreshAfterChange(),this.forceSpinner=!1}async _masterRequest(e,t=void 0){let i,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else if("domains"===this.modelType&&this.domainId)o=this.domainId;else{if("users"!==this.modelType||!this.userId)return void console.error("Can't find model type or ids");o=this.userId}try{if(t&&t.length>0)i=`/api/${this.modelType}/${o}/${e}/process_many_moderation_item`,await window.adminServerApi.adminMethod(i,"PUT",t);else{if(!this.selectedItemId||!this.selectedModelClass)return void console.error("No item ids to process");i=`/api/${this.modelType}/${o}/${this.selectedItemId}/${this.selectedModelClass}/${e}/process_one_moderation_item`,await window.adminServerApi.adminMethod(i,"PUT")}this.forceSpinner=!0,this._resetSelectedAndClearCache()}catch(e){this._ajaxError(e)}}async _generateRequest(e){try{const t=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${e}/${this.typeOfModeration}`,"GET");this.items=t}catch(e){this._ajaxError(e)}}_itemsResponse(e){this.forceSpinner=!1,this.items=e,this._resetSelectedAndClearCache()}get onlyFlaggedItems(){return"flagged_content"===this.typeOfModeration}_manyItemsResponse(){this.forceSpinner=!1,this.showReload=!0,window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading"))}_singleItemResponse(){this._reload()}_menuSelection(){this.renderRoot.querySelectorAll("md-menu").forEach((e=>{e.open=!1})),this._refreshGridAsync()}async _reallyAnonymize(){await this._masterRequest("anonymize")}async _reallyAnonymizeSelected(){await this._masterRequest("anonymize",this.selectedItemIdsAndType)}async _reallyDelete(){await this._masterRequest("delete")}async _reallyDeleteSelected(){await this._masterRequest("delete",this.selectedItemIdsAndType)}async _approve(e){this._setupItemIdFromEvent(e),await this._masterRequest("approve")}async _approveSelected(e){this._setupItemIdFromEvent(e),await this._masterRequest("approve",this.selectedItemIdsAndType)}async _block(e){this._setupItemIdFromEvent(e),await this._masterRequest("block")}async _blockSelected(e){this._setupItemIdFromEvent(e),await this._masterRequest("block",this.selectedItemIdsAndType)}async _clearFlags(e){this._setupItemIdFromEvent(e),await this._masterRequest("clearFlags")}async _clearSelectedFlags(e){this._setupItemIdFromEvent(e),await this._masterRequest("clearFlags",this.selectedItemIdsAndType)}async _refreshAfterChange(){this.domainId&&(this._reset(),this.modelType="domains",await this._generateRequest(this.domainId)),this.groupId&&(this._reset(),this.modelType="groups",await this._generateRequest(this.groupId)),this.communityId&&(this._reset(),this.modelType="communities",await this._generateRequest(this.communityId)),this.userId&&(this._reset(),this.modelType="users",await this._generateRequest(this.userId)),this._setupHeaderText()}_domainIdChanged(){}_groupIdChanged(){}_communityIdChanged(){}_userIdChanged(){}_getType(e){return"post"===e?this.t("posts.yp"):"point"===e?this.t("point.point"):this.t("unknown")}_activeItemChanged(e,t){e&&this.$$("#grid").openItemDetails(e),t&&this.$$("#grid").closeItemDetails(t),this._refreshGridAsync()}_refreshGridAsync(){this._refreshGridAsyncBase(10)}_refreshGridAsyncDelay(){this.allowGridEventsAfterMenuOpen&&this._refreshGridAsyncBase(250)}_refreshGridAsyncBase(e){setTimeout((()=>{this.$$("#grid").notifyResize()}),e)}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}firstUpdated(e){super.firstUpdated(e),this._setGridSize()}_toPercent(e){return e?Math.round(100*e)+"%":null}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=setTimeout((()=>{this.resizeTimeout=null,this._setGridSize()}),66))}_setGridSize(){window.innerWidth<=600?(this.$$("#grid").style.width=window.innerWidth.toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px"):(this.$$("#grid").style.width=(window.innerWidth-16).toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px")}get totalItemsCount(){return this.items?YpFormattingHelpers.number(this.items.length):null}_selectedItemsChanged(){this.selectedItems&&this.selectedItems.length>0?(this.selectedItemsEmpty=!1,this.selectedItemsCount=this.selectedItems.length):(this.selectedItemsEmpty=!0,this.selectedItemsCount=0),this.selectedItemIdsAndType=this.selectedItems.map((e=>({id:e.id,modelType:e.type}))),this._refreshGridAsyncDelay()}_setupItemIdFromEvent(e){const t=e.target;if(null!=t){let e=t.parentElement.getAttribute("data-args");e||(e=t.getAttribute("data-args")),e&&(this.selectedItemId=parseInt(e));let i=t.parentElement.getAttribute("data-model-class");i||(i=t.getAttribute("data-model-class")),this.selectedModelClass=i,this._refreshGridAsync()}}_deleteSelected(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureDeleteSelectedContent"),this._reallyDeleteSelected.bind(this),!0,!0)}))}_delete(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureDeleteContent"),this._reallyDelete.bind(this),!0,!1)}))}_anonymizeSelected(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureAnonymizeSelectedContent"),this._reallyAnonymizeSelected.bind(this),!0,!0)}))}_anonymize(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureAnonymizeContent"),this._reallyAnonymize.bind(this),!0,!1)}))}_menuOpened(){this.allowGridEventsAfterMenuOpen=!0}_setSelected(e){const t=e.target.getAttribute("data-args");if(t){const e=this._findItemFromId(parseInt(t));e&&this.$$("#grid").selectItem(e),this.allowGridEventsAfterMenuOpen=!0,this._refreshGridAsync()}}_findItemFromId(e){let t;return this.items?this.items.forEach((i=>{i.id==e&&(t=i)})):console.warn("No item for _findItemFromId"),t}setup(e,t,i,o,n){this.typeOfModeration=o||"flagged_content",this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.userId=void 0,this.items=void 0,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),n&&(this.userId=n),this._setupHeaderText()}open(e){this.collectionName=e}_reset(){this.items=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedItemsCount=0,this.selectedItemsEmpty=!0,this.selectedItemIdsAndType=[],this.selectedItems=[],this.$$("#grid").clearCache()}_setupHeaderText(){this.onlyFlaggedItems?this.itemsCountText=this.t("contentItemsFlagged"):this.itemsCountText=this.t("items"),this.groupId?this.headerText=this.t("groupContentModeration"):this.communityId?this.headerText=this.t("communityContentModeration"):this.domainId?this.headerText=this.t("domainContentModeration"):this.userId&&(this.headerText=this.t("userContentModeration"))}};__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"multiSortEnabled",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"opened",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"showReload",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"forceSpinner",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"selectedItemsEmpty",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"items",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"selectedItems",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"headerText",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"groupId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"communityId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"domainId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"userId",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"selected",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"modelType",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"selectedItemsCount",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"selectedItemIdsAndType",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"selectedItemId",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"selectedModelClass",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"collectionName",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"itemsCountText",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"resizeTimeout",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"typeOfModeration",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"activeItem",void 0),YpContentModeration=__decorate$6([t$5("yp-content-moderation")],YpContentModeration);var __decorate$5=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpPagesGrid=class extends YpBaseElement{updated(e){super.updated(e),(e.has("groupId")||e.has("communityId")||e.has("domainId"))&&this._updateCollection()}static get styles(){return[super.styles,i$5`
        #dialog {
          width: 90%;
          max-height: 90%;
        }

        .pageItem {
          padding-right: 16px;
        }

        #editPageLocale {
          width: 80%;
          max-height: 80%;
        }

        #editPageLocale[rtl] {
          direction: rtl;
        }

        .locale {
          width: 30px;
          cursor: pointer;
        }

        .localeInput {
          width: 60px;
          margin-right: 12px;
          margin-left: 16px;
        }

        .pageItem {
          padding-top: 8px;
        }

        [hidden] {
          display: none !important;
        }

        .localeInputContasiner {
          padding: 2px;
          margin-bottom: 8px;
          border: solid 1px #999;
        }

        .buttons {
          margin-right: 16px;
        }

        .pageItem {
          margin-right: 16px;
        }

        .addLocaleButton {
          margin-right: 16px;
        }

        #addPageButton {
          margin: 24px;
        }
      `]}titleChanged(){this.currentlyEditingTitle=this.$$("#title").value}contentChanged(){this.currentlyEditingContent=this.$$("#content").value}render(){return this.pages?x`
        <h2>${this.headerText}</h2>
        <div id="scrollable">
          ${this.pages?.map((e=>x`
              <div class="layout horizontal">
                <div class="pageItem id">${e.id}</div>
                <div class="pageItem title">${e.title.en}</div>

                ${this._toLocaleArray(e.title).map((t=>x`
                    <div class="layout vertical center-center">
                      <md-text-button
                        class="locale"
                        data-args-page="${JSON.stringify(e)}"
                        data-args-locale="${t.locale}"
                        @click="${this._editPageLocale}"
                        >${t.locale}</md-text-button
                      >
                    </div>
                  `))}

                <md-outlined-text-field
                  class="localeInput"
                  id="localeInput"
                  length="2"
                  maxlength="2"
                ></md-outlined-text-field>

                <md-text-button
                  data-args="${e.id}"
                  class="addLocaleButton"
                  @click="${this._addLocale}"
                  >${this.t("pages.addLocale")}</md-text-button
                >
                <md-text-button
                  ?hidden="${e.published}"
                  data-args="${e.id}"
                  @click="${this._publishPage}"
                  >${this.t("pages.publish")}</md-text-button
                >

                <md-text-button
                  data-args="${e.id}"
                  ?hidden="${!e.published}"
                  @click="${this._unPublishPage}"
                  >${this.t("pages.unPublish")}</md-text-button
                >

                <md-text-button
                  data-args="${e.id}"
                  @click="${this._deletePage}"
                  >${this.t("pages.deletePage")}</md-text-button
                >
              </div>
            `))}
        </div>

        <div class="layout horizontal">
          <md-filled-button id="addPageButton" @click="${this._addPage}"
            >${this.t("pages.addPage")}</md-filled-button
          >
        </div>

        <md-dialog
          id="editPageLocale"
          modal
          class="layout vertical"
          ?rtl="${this.rtl}"
        >
          <h2 slot="headline">${this.t("pages.editPageLocale")}</h2>
          <div slot="content" class="layout vertical">
            <md-outlined-text-field
              @change="${this.titleChanged}"
              id="title"
              name="title"
              type="text"
              .label="${this.t("pages.title")}"
              .value="${this.currentlyEditingTitle||""}"
              maxlength="60"
              charCounter
              class="mainInput"
            >
            </md-outlined-text-field>

            <md-outlined-text-field
              @change="${this.contentChanged}"
              id="content"
              name="content"
              type="textarea"
              .value="${this.currentlyEditingContent||""}"
              .label="${this.t("pages.content")}"
              rows="7"
              maxRows="10"
            >
            </md-outlined-text-field>
          </div>

          <div class="buttons" slot="actions">
            <md-text-button @click="${this._closePageLocale}" dialogDismiss
              >${this.t("close")}</md-text-button
            >
            <md-text-button @click="${this._updatePageLocale}" dialogDismiss
              >${this.t("save")}</md-text-button
            >
          </div>
        </md-dialog>
      `:T$2}_toLocaleArray(e){return Object.keys(e).map((t=>({locale:t,value:e[t]}))).sort(((e,t)=>e.value.localeCompare(t.value)))}async _editPageLocale(e){const t=e.target,i=t.getAttribute("data-args-page");this.currentlyEditingPage=JSON.parse(i),this.currentlyEditingLocale=t.getAttribute("data-args-locale"),this.currentlyEditingContent=this.currentlyEditingPage.content[this.currentlyEditingLocale],this.currentlyEditingTitle=this.currentlyEditingPage.title[this.currentlyEditingLocale];const o=this.shadowRoot.querySelector("#editPageLocale");o&&(o.open=!0)}_closePageLocale(){this.currentlyEditingPage=void 0,this.currentlyEditingLocale=void 0,this.currentlyEditingContent=void 0,this.currentlyEditingTitle=void 0,this.$$("#editPageLocale").close()}async _dispatchAdminServerApiRequest(e,t,i,o={}){let n=e?`/${e}/${t}`:`/${t}`,s="";if("groups"===this.modelType&&this.groupId)s=`/api/${this.modelType}/${this.groupId}${n}`;else if("communities"===this.modelType&&this.communityId)s=`/api/${this.modelType}/${this.communityId}${n}`;else{if("domains"!==this.modelType||!this.domainId)return void console.warn("Can't find model type or ids");s=`/api/${this.modelType}/${this.domainId}${n}`}try{return await window.adminServerApi.adminMethod(s,i,o)}catch(e){console.error("Error dispatching admin server API request:",e)}}async _updatePageLocale(){await this._dispatchAdminServerApiRequest(this.currentlyEditingPage.id,"update_page_locale","PUT",{locale:this.currentlyEditingLocale,content:this.currentlyEditingContent,title:this.currentlyEditingTitle}),this._updateCollection(),this._closePageLocale()}async _publishPage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"publish_page","PUT"),this._publishPageResponse()}async _publishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pagePublished")),await this._unPublishPageResponse()}async _unPublishPage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"un_publish_page","PUT"),this._unPublishPageResponse()}async _unPublishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageUnPublished")),await this._updateCollection()}async _refreshPages(){await this._dispatchAdminServerApiRequest(void 0,"pages","GET")}async _deletePage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"delete_page","DELETE"),this._deletePageResponse()}async _deletePageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageDeleted")),await this._updateCollection()}async _addLocale(e){if(this.newLocaleInput&&this.newLocaleInput.value.length>1){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"update_page_locale","PUT",{locale:this.newLocaleInput.value.toLowerCase(),content:"",title:""}),this._updateCollection()}}async _addPage(){const e=this.shadowRoot.querySelector("#addPageButton");e&&(e.disabled=!0),await this._dispatchAdminServerApiRequest(void 0,"add_page","POST"),this._generateRequest(),e&&(e.disabled=!1)}async _newPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.newPageCreated")),await this._refreshPages()}async _updatePageResponse(){window.appGlobals.notifyUserViaToast(this.t("posts.updated")),await this._refreshPages()}_updateCollection(){this.domainId&&(this.modelType="domains",this._generateRequest(this.domainId)),this.groupId&&(this.modelType="groups",this._generateRequest(this.groupId)),this.communityId&&(this.modelType="communities",this._generateRequest(this.communityId))}async _generateRequest(e=void 0){this.pages=await this._dispatchAdminServerApiRequest(void 0,"pages_for_admin","GET")}_pagesResponse(e){this.pages=e.detail.response}setup(e,t,i,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.pages=void 0,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),this._setupHeaderText()}open(){const e=this.shadowRoot.querySelector("#dialog");e&&(e.open=!0)}_setupHeaderText(){this.groupId?this.headerText=this.t("group.pages"):this.communityId?this.headerText=this.t("community.pages"):this.domainId&&(this.headerText=this.t("domain.pages"))}};__decorate$5([n$8({type:Array})],YpPagesGrid.prototype,"pages",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"headerText",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"domainId",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"communityId",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"groupId",void 0),__decorate$5([n$8({type:Object})],YpPagesGrid.prototype,"currentlyEditingPage",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"modelType",void 0),__decorate$5([e$7("#localeInput")],YpPagesGrid.prototype,"newLocaleInput",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingLocale",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingTitle",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingContent",void 0),YpPagesGrid=__decorate$5([t$5("yp-pages-grid")],YpPagesGrid);var __decorate$4=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminTranslations=class extends YpAdminPage{static get styles(){return[super.styles,ShadowStyles,i$5`
        #mainSelect {
          text-align: right;
          margin-right: 22px;
          margin-top: 8px;
        }

        .wordCloudContainer {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        md-linear-progress {
          margin-bottom: 8px;
        }

        .timeButtons {
          margin-top: 8px;
        }

        .item {
          max-width: 960px;
          width: 960px;
          margin-bottom: 16px;
          padding: 8px;
        }

        .originalText {
          width: 400px;
          flex: 1;
          padding: 8px;
        }

        .textType {
          width: 120px;
          padding: 8px;
        }

        .translatedText {
          flex: 2;
        }

        .innerTranslatedText {
          padding: 8px;
        }

        .dont-break-out {
          /* These are technically the same, but use both */
          overflow-wrap: break-word;
          word-wrap: break-word;

          -ms-word-break: break-all;
          /* This is the dangerous one in WebKit, as it breaks things wherever */
          word-break: break-all;
          /* Instead use this non-standard one: */
          word-break: break-word;

          /* Adds a hyphen where the word breaks, if supported (No Blink) */
          -ms-hyphens: auto;
          -moz-hyphens: auto;
          -webkit-hyphens: auto;
          hyphens: auto;
        }

        md-linear-progress {
          width: 800px;
          margin-top: -4px;
          padding-top: 0;
          margin-bottom: 12px;
        }

        .progressPlaceHolder {
          margin-top: -4px;
          padding-top: 0;
          height: 4px;
          margin-bottom: 12px;
        }

        md-outlined-select {
          margin-bottom: 32px;
        }

        .contentId {
          margin-top: 4px;
        }
      `]}async getTranslationText(){this.waitingOnData=!0,this.items=(await window.adminServerApi.getTextForTranslations(this.collectionType,this.collectionId,this.targetLocale)).items,this.waitingOnData=!1}constructor(){super(),this.waitingOnData=!1,this.editActive={},this.waitingOnData=!1,this.baseMaxLength=300,this.supportedLanguages=YpLanguages.allLanguages}connectedCallback(){super.connectedCallback()}selectLanguage(e){e.target&&e.target.value&&(this.targetLocale=e.target.value,this.getTranslationText())}openEdit(e){this.editActive[e.indexKey]=!0,this.requestUpdate()}cancelEdit(e){delete this.editActive[e.indexKey],this.requestUpdate()}saveItem(e,t=void 0){e&&!t&&(e.translatedText=this.$$(`#editFor${e.indexKey}`).value);const i={contentId:e.contentId,content:e.originalText,textType:e.textType,translatedText:e.translatedText,extraId:e.extraId,targetLocale:this.targetLocale};window.adminServerApi.updateTranslation(this.collectionType,this.collectionId,i),this.cancelEdit(e)}async autoTranslate(e){const t=`${this.getUrlFromTextType(e)}?contentId=${e.contentId}&textType=${e.textType}&targetLanguage=${this.targetLocale}`,i=await window.serverApi.getTranslation(t);i&&(e.translatedText=i.content,this.saveItem(e,{saveDirectly:!0}),this.requestUpdate())}getUrlFromTextType(e){let t;switch(e.textType){case"postName":case"postContent":case"postTranscriptContent":t=`/api/posts/${e.contentId}/translatedText`;break;case"pointContent":case"pointAdminPointContent":t=`/api/points/${e.contentId}/translatedText`;break;case"domainName":case"domainContent":t=`/api/domains/${e.contentId}/translatedText`;break;case"customRatingName":t=`/api/ratings/${e.contentId}/${e.extraId}/translatedText`;break;case"communityName":case"communityContent":t=`/api/communities/${e.contentId}/translatedText`;break;case"alternativeTextForNewIdeaButtonClosed":case"alternativeTextForNewIdeaButtonHeader":case"customThankYouTextNewYps":case"alternativePointForHeader":case"customTitleQuestionText":case"customAdminPointsTitle":case"urlToReviewActionText":case"alternativePointAgainstHeader":case"customThankYouTextNewPoints":case"alternativePointForLabel":case"alternativePointAgainstLabel":case"groupName":case"groupContent":t=`/api/groups/${e.contentId}/translatedText`;break;case"categoryName":t=`/api/categories/${e.contentId}/translatedText`;break;case"statusChangeContent":t=`/api/posts/${e.extraId}/${e.contentId}/translatedStatusText`;break;default:return null}return t}get languages(){if(YpLanguages.allLanguages){let e=[];const t=[];let i=["en","is","fr","de","es","ar"];window.appGlobals.highlightedLanguages&&(i=window.appGlobals.highlightedLanguages.split(",")),i=i.map((e=>e.replace("-","_").toLowerCase()));for(let o=0;o<YpLanguages.allLanguages.length;o++){const n=YpLanguages.allLanguages[o];i.indexOf(n.code)>-1?t.push({language:n.code,name:`${n.nativeName} (${n.englishName})`}):e.push({language:n.code,name:`${n.nativeName} (${n.englishName})`})}return e=e.sort((function(e,t){return e.name<t.name?-1:e.name>t.name?1:0})),t.concat(e)}return[]}getMaxLength(e,t){return"groupName"===e.textType||"postName"===e.textType||"communityName"===e.textType?60:"groupContent"==e.textType||"communityContent"==e.textType?t:2500}textChanged(e){const t=e.target.value,i=new RegExp(/(?:https?|http?):\/\/[\n\S]+/g),o=t.match(i);if(o&&o.length>0){let e=0;for(let t=0;t<Math.min(o.length,10);t+=1)e+=o[t].length;let t=300;t+=e,t-=Math.min(e,30*o.length),this.baseMaxLength=t}}renderItem(e){return x`
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType layout vertical">
          <div>${this.t(e.textType)}</div>
          <div class="contentId">id: ${e.contentId}</div>
        </div>
        <div class="originalText dont-break-out">
          ${e.originalText}
        </div>

        <div class="layout vertical translatedText dont-break-out">
          ${this.editActive&&this.editActive[e.indexKey]?x`
                <md-outlined-text-field
                  type="textarea"
                  rows="5"
                  id="editFor${e.indexKey}"
                  .maxLength="${this.getMaxLength(e,this.baseMaxLength)}"
                  charCounter
                  @input="${this.textChanged}"
                  label="${this.t("editTranslation")}"
                  .value="${e.translatedText?e.translatedText:""}"
                >
                </md-outlined-text-field>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${()=>this.cancelEdit(e)}"
                  >${this.t("cancel")}</md-filled-button>
                  <md-filled-button

                    @click="${()=>this.saveItem(e)}"
                  >${this.t("save")}</md-filled-button>
                </div>
              `:x`
                <div class="innerTranslatedText">
                  ${e.translatedText?e.translatedText:this.t("noTranslation")}
                </div>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${()=>this.openEdit(e)}"
                  >${this.t("edit")}</md-filled-button>
                  <md-filled-button

                    ?hidden="${null!=e.translatedText}"
                    @click="${()=>this.autoTranslate(e)}"
                  >${this.t("autoTranslate")}</md-filled-button>
                </div>
              `}
        </div>
      </div>
    `}render(){return x`
      <div class="container layout vertical center-center">
        ${this.waitingOnData?x`
              <md-linear-progress
                indeterminate
                ?hidden="${!this.waitingOnData}"
              ></md-linear-progress>
            `:x` <div class="progressPlaceHolder"></div> `}
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <md-outlined-select
              .label="${this.t("selectLanguage")}"
              id="mainSelect"
              class="layout selfEnd"
              @change="${this.selectLanguage}"
            >
              ${this.languages.map((e=>x`
                  <md-select-option .value="${e.language}"
                    >${e.name}</md-select-option
                  >
                `))}
            </md-outlined-select>
          </div>
          ${this.items?this.items.map((e=>this.renderItem(e))):T$2}
        </div>
      </div>
    `}};__decorate$4([n$8({type:Array})],YpAdminTranslations.prototype,"items",void 0),__decorate$4([n$8({type:Boolean})],YpAdminTranslations.prototype,"waitingOnData",void 0),__decorate$4([n$8({type:Object})],YpAdminTranslations.prototype,"editActive",void 0),__decorate$4([n$8({type:Object})],YpAdminTranslations.prototype,"collection",void 0),__decorate$4([n$8({type:String})],YpAdminTranslations.prototype,"targetLocale",void 0),__decorate$4([n$8({type:Number})],YpAdminTranslations.prototype,"baseMaxLength",void 0),YpAdminTranslations=__decorate$4([t$5("yp-admin-translations")],YpAdminTranslations);var __decorate$3=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminReports=class extends YpAdminPage{constructor(){super(...arguments),this.action="/api/communities",this.selectedTab=0,this.downloadDisabled=!1,this.autoTranslateActive=!1,this.fraudAuditSelectionActive=!1,this.waitingOnFraudAudits=!1}refresh(){this.reportUrl=void 0,this.reportGenerationUrl=void 0,this.error=void 0,this.progress=void 0,this.selectedFraudAuditId=void 0,this.fraudAuditsAvailable=void 0,this.waitingOnFraudAudits=!1,this.fraudAuditSelectionActive=!1,this._tabChanged()}connectedCallback(){super.connectedCallback(),"group"==this.collectionType&&this.collection&&this.collection.configuration.allOurIdeas?this.allOurIdeasQuestionId=this.collection.configuration.allOurIdeas?.earl?.question_id:this.allOurIdeasQuestionId=void 0,this.addGlobalListener("yp-refresh-admin-content",this.refresh.bind(this))}disconnectedCallback(){this.removeGlobalListener("yp-refresh-admin-content",this.refresh.bind(this)),super.disconnectedCallback()}fraudItemSelection(e){this.selectedFraudAuditId=parseInt(e.target.getAttribute("data-args")),this.startReportCreation()}startReportCreation(){let e=this.action;const t={selectedFraudAuditId:this.selectedFraudAuditId};this.progress=0,fetch(e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((e=>e.json())).then((e=>this.startReportCreationResponse(e))).catch((e=>{console.error("Error:",e),this.progress=void 0}))}startReportCreationResponse(e){this.jobId=e.jobId,this.progress=5;let t="group"==this.collectionType?`/api/groups/${this.collectionId}`:`/api/communities/${this.collectionId}`;this.allOurIdeasQuestionId?(t=`/api/allOurIdeas/${this.collectionId}`,this.reportCreationProgressUrl=`${t}/${this.jobId}/report_creation_progress?questionId=${this.allOurIdeasQuestionId}`):this.reportCreationProgressUrl=`${t}/${this.jobId}/report_creation_progress`,this.pollLaterForProgress()}pollLaterForProgress(){setTimeout((()=>{this.reportCreationProgress()}),1e3)}reportCreationProgress(){fetch(this.reportCreationProgressUrl).then((e=>e.json())).then((e=>this.reportCreationProgressResponse(e))).catch((e=>console.error("Error:",e)))}formatAuditReportDates(e){return e.map((e=>(e.date&&(e.date=new Date(e.date).toLocaleString()),e)))}fraudAuditsAjaxResponse(e){this.waitingOnFraudAudits=!1,this.fraudAuditsAvailable=this.formatAuditReportDates(e.detail.response)}reportCreationProgressResponse(e){!e.error&&null!=e.progress&&e.progress<100&&this.pollLaterForProgress(),this.progress=e.progress,e.error&&(this.error=this.t(e.error)),e.data&&(this.reportUrl=e.data.reportUrl,setTimeout((()=>{this.downloadDisabled=!0}),354e4))}updated(e){(e.has("type")||e.has("selectedFraudAuditId"))&&(this.fraudAuditSelectionActive="fraudAuditReport"===this.type&&!this.selectedFraudAuditId)}startGeneration(){if("fraudAuditReport"==this.type){this.waitingOnFraudAudits=!0,this.progress=0;const e=window.adminServerApi.adminMethod(this.reportGenerationUrl,"GET");this.waitingOnFraudAudits=!1,this.progress=void 0,this.fraudAuditsAvailable=this.formatAuditReportDates(e)}else this.startReportCreationAjax(this.reportGenerationUrl)}startReportCreationAjax(e){this.progress=0,fetch(e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({})}).then((e=>e.json())).then((e=>this.startReportCreationResponse(e))).catch((e=>console.error("Error:",e)))}getFraudAuditsAjax(e){fetch(e).then((e=>e.json())).then((e=>this.fraudAuditsAjaxResponse({detail:{response:e}}))).catch((e=>console.error("Error:",e)))}static get styles(){return[super.styles,i$5`
        md-filled-button {
          margin-top: 32px;
          margin-bottom: 16px;
        }

        md-outlined-button {
          margin-top: 32px;
          margin-bottom: 16px;
        }

        md-linear-progress {
          width: 320px;
          margin-top: 8px;
        }

        md-tabs {
          max-width: 650px;
          width: 605px;
        }
        @media (max-width: 650px) {
          md-tabs {
            width: 100%;
          }
        }
      `]}firstUpdated(e){setTimeout((()=>{this._tabChanged()}))}_tabChanged(){const e=this.$$("#tabs");this.selectedTab=e.activeTabIndex,this.reportGenerationUrl=void 0,this.reportUrl=void 0,"group"==this.collectionType?(0===e.activeTabIndex?(this.type="xls",this.toastText=this.t("haveCreatedXLsReport")):1===e.activeTabIndex&&(this.type="docx",this.toastText=this.t("haveCreatedDocxReport")),this.reportGenerationUrl=`/api/groups/${this.collectionId}/${this.type}/start_report_creation`,this.allOurIdeasQuestionId&&(this.reportGenerationUrl=`/api/allOurIdeas/${this.collectionId}/${this.type}/start_report_creation?questionId=${this.allOurIdeasQuestionId}`)):"community"==this.collectionType&&(0===e.activeTabIndex?(this.type="usersxls",this.reportGenerationUrl=`/api/communities/${this.collectionId}/${this.type}/start_report_creation`,this.toastText=this.t("haveCreatedXLsReport")):1===e.activeTabIndex&&(this.type="fraudAuditReport",this.reportGenerationUrl=`/api/communities/${this.collectionId}/getFraudAudits`,this.toastText=this.t("haveCreatedFraudAuditReport"))),window.autoTranslate&&(this.reportGenerationUrl+=`?translateLanguage=${this.language}`)}renderStart(){return x`
      <div class="layout vertical center-center startButton">
        <md-outlined-button @click="${this.startGeneration}">
          ${this.t("startReportCreation")}
        </md-outlined-button>
        ${void 0!==this.progress?x`<md-linear-progress
              .value="${this.progress/100}"
            ></md-linear-progress> `:T$2}
      </div>
    `}renderDownload(){return x`
      ${this.fraudAuditSelectionActive?x`
            ${this.waitingOnFraudAudits?x`<md-linear-progress indeterminate></md-linear-progress>`:x`
                  <div class="auditContainer layout vertical center-center">
                    ${this.fraudAuditsAvailable?.map((e=>x`
                        <md-text-button
                          raised
                          class="layout horizontal fraudItemSelection"
                          data-args="${e.logId}"
                          @click="${this.fraudItemSelection}"
                        >
                          ${e.date}<br />${e.userName}
                        </md-text-button>
                      `))}
                  </div>
                `}
          `:x`
            <div class="error" ?hidden="${!this.error}">${this.error}</div>
            ${this.reportUrl?x`
                  <a
                    href="${this.reportUrl}"
                    target="_blank"
                    ?hidden="${this.downloadDisabled}"
                  >
                    <md-filled-button
                      id="downloadReportButton"
                      ?disabled="${this.downloadDisabled}"
                      raised
                    >
                      ${this.t("downloadReport")}
                    </md-filled-button>
                  </a>
                  <div class="infoText reportText">
                    ${this.t("reportLinkInfo")}
                  </div>
                  <div
                    class="infoText expiredText"
                    ?hidden="${!this.downloadDisabled}"
                  >
                    ${this.t("downloadHasExpired")}
                  </div>
                `:T$2}
          `}
    `}render(){return x`
      <div class="layout vertical center-center">
        <md-tabs
          id="tabs"
          @change="${this._tabChanged}"
          .activeTabIndex="${this.selectedTab}"
          id="paperTabs"
        >
          ${"group"==this.collectionType?x`
                <md-secondary-tab
                  >${this.t("createXlsReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
                <md-secondary-tab
                  ?hidden="${null!=this.allOurIdeasQuestionId}"
                  >${this.t("createDocxReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
              `:T$2}
          ${"community"==this.collectionType?x`
                <md-secondary-tab
                  >${this.t("createXlsUsersReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
                <md-secondary-tab
                  ?hidden="${!this.collection.configuration.enableFraudDetection}"
                  >${this.t("downloadFraudAuditReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
              `:T$2}
        </md-tabs>
      </div>
      <div class="layout vertical center-center">
        ${!this.reportGenerationUrl||this.reportUrl||this.fraudAuditsAvailable?this.renderDownload():this.renderStart()}
      </div>
    `}};__decorate$3([n$8({type:String})],YpAdminReports.prototype,"action",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"type",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"progress",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"selectedTab",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"error",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"jobId",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportUrl",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportGenerationUrl",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"downloadDisabled",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"allOurIdeasQuestionId",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"toastText",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"autoTranslateActive",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"selectedFraudAuditId",void 0),__decorate$3([r$6()],YpAdminReports.prototype,"fraudAuditSelectionActive",void 0),__decorate$3([n$8({type:Array})],YpAdminReports.prototype,"fraudAuditsAvailable",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"waitingOnFraudAudits",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportCreationProgressUrl",void 0),YpAdminReports=__decorate$3([t$5("yp-admin-reports")],YpAdminReports);var __decorate$2=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpOrganizationEdit=class extends YpEditBase{constructor(){super(...arguments),this.organizationAccess="public",this.action="/organizations"}static get styles(){return[super.styles,i$5`
        :host {
          display: block;
        }

        .additionalSettings {
          padding-top: 16px;
        }

        md-outlined-text-field {
          margin-bottom: 16px;
        }

        .half {
          width: 50%;
        }
      `]}connectedCallback(){super.connectedCallback(),this.action=`/organizations/${this.domainId}`}render(){return x`
      <yp-edit-dialog
        id="editDialog"
        .title="${this.editHeaderText}"
        icon="business-center"
        .action="${this.action}"
        method="${this.method}"
        .saveText="${this.saveText}"
        .snackbarText="${this.snackbarText}"
      >
        <h2 slot="h2">${this.editHeaderText}</h2>

        <div class="layout vertical">
          <md-outlined-text-field
            id="name"
            name="name"
            type="text"
            label="${this.t("name")}"
            .value="${this.organization?.name||""}"
            maxlength="60"
            charCounter
            class="mainInput"
          ></md-outlined-text-field>

          <md-outlined-text-field
            type="textarea"
            id="description"
            name="description"
            .value="${this.organization?.description||""}"
            label="${this.t("description")}"
            charCounter
            rows="2"
            max-rows="5"
            maxlength="300"
            class="mainInput"
          ></md-outlined-text-field>

          <md-outlined-text-field
            id="website"
            name="website"
            type="text"
            label="${this.t("website")}"
            .value="${this.organization?.website||""}"
            maxlength="256"
            charCounter
            class="mainInput"
          ></md-outlined-text-field>
        </div>

        <div class="layout horizontal center-center">
          <div class="layout vertical additionalSettings half">
            <yp-file-upload
              id="logoImageUpload"
              raised
              buttonIcon="photo_camera"
              .buttonText="${this.t("image.logo.upload")}"
              target="/api/images?itemType=organization-logo"
              method="POST"
              @success="${this._logoImageUploaded}"
            >
            </yp-file-upload>
          </div>
        </div>

        ${this.uploadedLogoImageId?x` <input
              type="hidden"
              name="uploadedLogoImageId"
              .value="${this.uploadedLogoImageId}"
            />`:T$2}
      </yp-edit-dialog>
    `}clear(){this.organization={id:-1,name:"",description:"",website:""},this.uploadedLogoImageId=void 0,this.$$("#logoImageUpload").clear()}setup(e,t,i){this.clear(),e?(this.organization=e,this.action=`/organizations/${this.organization.id}`):(this.organization={id:-1,name:"",description:""},this.action=`/organizations/${this.domainId}`),this.new=t,this.refreshFunction=i,this.setupTranslation()}setupTranslation(){this.new?(this.editHeaderText=this.t("organization.new"),this.snackbarText=this.t("organization.toast.created"),this.saveText=this.t("create")):(this.editHeaderText=this.t("Update organization info"),this.snackbarText=this.t("organization.toast.updated"),this.saveText=this.t("update"))}};__decorate$2([n$8({type:Object})],YpOrganizationEdit.prototype,"organization",void 0),__decorate$2([n$8({type:String})],YpOrganizationEdit.prototype,"organizationAccess",void 0),__decorate$2([n$8({type:Number})],YpOrganizationEdit.prototype,"domainId",void 0),__decorate$2([n$8({type:String})],YpOrganizationEdit.prototype,"action",void 0),__decorate$2([n$8({type:Number})],YpOrganizationEdit.prototype,"uploadedLogoImageId",void 0),YpOrganizationEdit=__decorate$2([t$5("yp-organization-edit")],YpOrganizationEdit);var __decorate$1=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpOrganizationGrid=class extends YpBaseElement{static get styles(){return[super.styles,i$5`
        .header {
          font-weight: bold;
          padding: 10px;
          background-color: #f0f0f0;
        }

        .addOrgButton {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        .list {
          display: table;
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
        }

        .pageItem {
          display: table-cell;
          padding: 10px;
          text-align: left;
        }

        .id {
          width: 60px;
        }

        .title {
          width: 200px;
        }

        .email {
          width: 240px;
        }

        .locale {
          width: 30px;
          cursor: pointer;
        }

        md-button {
          display: table-cell;
          padding: 10px;
          border: 1px solid #ddd;
        }

        .orgLogo {
          height: 75px;
          width: 75px;
        }

        [hidden] {
          display: none !important;
        }
      `]}constructor(){super()}async connectedCallback(){super.connectedCallback(),this.refresh()}async refresh(){this.organizations=await window.adminServerApi.adminMethod(`/api/organizations/${this.domainId}/domainOrganizations`,"GET")}render(){return x`
      <div class="header">${this.t("organizationsAdmin")}</div>
      <md-list class="list">
        ${this.organizations?.map((e=>x`
            <md-list-item class="layout horizontal">
              <div class="pageItem">
                <img
                  src="${this._organizationImageUrl(e)}"
                  class="orgLogo"
                />
              </div>
              <div class="pageItem id">${e.name}</div>
              <div class="pageItem description">
                ${e.description}
              </div>
              <div class="pageItem website">${e.website}</div>

              <div class="layout horizontal">
                <md-text-button
                  @click="${()=>this._editOrganization(e)}"
                >
                  ${this.t("update")}
                </md-text-button>
                <md-icon-button
                  @click="${()=>this._deleteOrganization(e)}"
                  .label="${this.t("delete")}"
                  ><md-icon>delete</md-icon></md-icon-button
                >
              </div>
            </md-list-item>
          `))}
      </md-list>

      <div class="layout vertical center-center">
        <md-outlined-button
          class="addOrgButton"
          @click="${this._createOrganization}"
          >${this.t("createOrganization")}</md-outlined-button
        >
      </div>

      <yp-organization-edit
        id="editDialog"
        .domainId="${this.domainId}"
      ></yp-organization-edit>
    `}_deleteOrganization(e){this.organizationToDeleteId=e.id,window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDeleteThisOrganization"),this._reallyDeleteOrganization.bind(this),!0,!1)}))}async _reallyDeleteOrganization(){try{await window.adminServerApi.adminMethod(`/api/organizations/${this.organizationToDeleteId}`,"DELETE"),this.refresh()}catch(e){console.error(e)}}_afterEdit(){this.shadowRoot.getElementById("editDialog").close(),this.refresh()}_createOrganization(){const e=this.shadowRoot.getElementById("editDialog");e.setup(void 0,!0,this._afterEdit.bind(this)),e.open(!0,{})}_editOrganization(e){const t=this.shadowRoot.getElementById("editDialog");t.organization=e,t.setup(e,!1,this._afterEdit.bind(this)),t.open(!1,{})}_organizationImageUrl(e){return e.OrganizationLogoImages?YpMediaHelpers.getImageFormatUrl(e.OrganizationLogoImages,2):null}};__decorate$1([n$8({type:Array})],YpOrganizationGrid.prototype,"organizations",void 0),__decorate$1([n$8({type:String})],YpOrganizationGrid.prototype,"headerText",void 0),__decorate$1([n$8({type:String})],YpOrganizationGrid.prototype,"domainId",void 0),__decorate$1([n$8({type:Object})],YpOrganizationGrid.prototype,"selected",void 0),YpOrganizationGrid=__decorate$1([t$5("yp-organization-grid")],YpOrganizationGrid);var __decorate=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminApp=class extends YpBaseElement{static get styles(){return[super.styles,i$5`
        :host {
          width: 100vw;
          height: 100vh;
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .backContainer {
          margin-top: 0px;
          margin-left: 16px;
        }

        .backIcon {
          margin-bottom: 8px;
          margin-top: 4px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .drawer {
          width: 300px;
        }

        .headerContainer {
          width: 100%;
          margin-bottom: 8px;
          vertical-align: middle;
          margin-left: 16px;
        }

        .mainHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .collectionLogoImage {
          width: 140px;
          height: 79px;
        }

        .collectionName {
          padding: 8px;
          text-align: center;
          line-height: 1.5;
        }

        .splashImage {
          width: 500px;
          height: 500px;
          margin-top: 32px;
          margin-bottom: 1024px;
        }

        .splashHeader {
          font-size: 1.75rem;
          font-family: monospace;
          margin-top: 64px;
          color: var(--md-sys-color-primary);
        }

        @media (max-width: 1000px) {
          .mainHeaderText {
            margin-top: 48px;
            margin-bottom: 8px;
          }

          .splashImage {
            width: 100%;
            margin-top: 0;
          }

          .splashHeader {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 400px) {
          .splashHeader {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }
        }

        .ypSmallLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
          min-height: 100vh;
          margin-bottom: 64px;
          margin-top: 32px;
          margin-left: 32px;
        }

        .loadingText {
          margin-top: 48px;
        }

        .titleInPrimaryColor {
          color: var(--md-sys-color-primary);
        }

        .titleInSecondaryColor {
          color: var(--md-sys-color-secondary);
        }

        .nickname {
          font-size: 1.5rem;
          margin-top: 8px;
        }

        .score {
          font-size: 1.5rem;
          margin-top: 16px;
        }

        md-list-item {
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(--md-sys-color-primary);
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        yp-promotion-dashboard {
          max-width: 1000px;
        }

        @media (max-width: 1000px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          yp-promotion-dashboard {
            max-width: 100%;
          }
        }
      `]}constructor(){super(),this.page="configuration",this.route="",this.userYpCollection=[],this.adminConfirmed=!1,this.haveCheckedAdminRights=!1,this.anchor=null,this._scrollPositionMap={},this._setupEventListeners(),this.updatePageFromPath()}updatePageFromPath(){let e=window.location.pathname;e=e.replace("/admin",""),e.endsWith("/")&&(e=e.substring(0,e.length-1)),e.startsWith("/")&&(e=e.substring(1,e.length));const t=e.split("/");this.collectionType=t[0],"new"==t[1]&&t[2]?(this.collectionId="new",window.appGlobals.originalQueryParameters.createCommunityForGroup?this.parentCollectionId=window.appGlobals.domain?.id:this.parentCollectionId=parseInt(t[2]),this.page="configuration"):(this.collectionId=parseInt(t[1]),t.length>3?this.page=t[3]:t.length>2?this.page=t[2]:this.page="configuration")}firstUpdated(e){super.firstUpdated(e)}connectedCallback(){super.connectedCallback(),this.updateLocation()}updateLocation(){let e=window.location.pathname;e=e.replace("/admin","");const t=e.split("/"),i="/:page".split("/"),o={};structuredClone(this.routeData);for(let e=0;e<i.length;e++){const n=i[e];if(!n&&""!==n)break;const s=t.shift();if(!s&&""!==s)return;if(":"==n.charAt(0))o[n.slice(1)]=s;else if(n!==s)return}let n=t.join("/");t.length>0&&(n="/"+n),this.subRoute=n,this.route=e,this.routeData=o,this.updatePageFromPath()}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}_pageChanged(){this.page&&window.appGlobals.analytics.sendToAnalyticsTrackers("send","pageview",location.pathname)}tabChanged(e){0==e.detail.activeIndex?this.page="configuration":1==e.detail.activeIndex?this.page="moderation":3==e.detail.activeIndex?this.page="users":4==e.detail.activeIndex&&(this.page="admins")}_setupEventListeners(){this.addGlobalListener("yp-logged-in",this._setAdminFromParent.bind(this))}_refreshAdminRights(){window.appUser.recheckAdminRights()}_removeEventListeners(){this.addGlobalListener("yp-logged-in",this._setAdminFromParent.bind(this))}_refreshGroup(){this._refreshByName("#groupPage")}_refreshCommunity(){this._refreshByName("#communityPage")}_refreshDomain(){this._refreshByName("#domainPage")}_refreshByName(e){this.$$(e)}updated(e){super.updated(e),e.has("page")&&this._pageChanged(),e.has("collectionType")&&this.collectionId&&"new"!=this.collectionId?this.getCollection():e.has("collectionId")&&"new"==this.collectionId&&this._setAdminFromParent(),e.has("collection")}_needsUpdate(){this.requestUpdate()}updateFromCollection(){this.collection&&(this.collection={...this.collection})}renderGroupConfigPage(){return x`<yp-admin-config-group
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .subRoute="${this.subRoute}"
      @yp-request-update-on-parent="${this.updateFromCollection}"
      .parentCollectionId="${this.parentCollectionId}"
    >
    </yp-admin-config-group>`}renderCommunityConfigPage(){return x`
      <yp-admin-config-community
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        .parentCollectionId="${this.parentCollectionId}"
      >
      </yp-admin-config-community>
    `}renderDomainConfigPage(){return x`
      <yp-admin-config-domain
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
      >
      </yp-admin-config-domain>
    `}_renderPage(){if(!this.adminConfirmed)return T$2;switch(this.page){case"translations":return x`
            ${this.collection?x`<yp-admin-translations
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-admin-translations>`:T$2}
          `;case"organizations":return x`
            ${this.collection?x`<yp-organization-grid
                  .domain="${this.collection}"
                  .domainId="${this.collectionId}"
                >
                </yp-organizations-grid>`:T$2}
          `;case"reports":return x`
            ${this.collection?x`<yp-admin-reports
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-yp-admin-reports>`:T$2}
          `;case"communities":return x`
            ${this.collection?x`<yp-admin-communities .domain="${this.collection}">
                </yp-admin-communities>`:T$2}
          `;case"user":return x`
            ${x`<yp-admin-user-settings .user="${this.user}">
                </yp-admin-user-settings>`}
          `;case"groups":return x`
            ${this.collection?x`<yp-admin-groups .community="${this.collection}">
                </yp-admin-groups>`:T$2}
          `;case"configuration":switch(this.collectionType){case"domain":return x`
                ${this.collection?this.renderDomainConfigPage():T$2}
              `;case"community":return x`
                ${this.collection||"new"===this.collectionId?this.renderCommunityConfigPage():T$2}
              `;case"group":return x`
                ${this.collection||"new"===this.collectionId?this.renderGroupConfigPage():T$2}
              `;default:return x``}case"users":case"admins":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .domainId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$2}
              `;case"community":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .communityId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$2}
              `;case"group":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .groupId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$2}
              `;default:return x``}case"moderation":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-content-moderation
                      .domainId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$2}
              `;case"community":return x`
                ${this.collection?x`<yp-content-moderation
                      .communityId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$2}
              `;case"group":return x`
                ${this.collection?x`<yp-content-moderation
                      .groupId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$2}
              `;default:return x``}case"pages":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-pages-grid
                      .domainId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$2}
              `;case"community":return x`
                ${this.collection?x`<yp-pages-grid
                      .communityId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$2}
              `;case"group":return x`
                ${this.collection?x`<yp-pages-grid
                      .groupId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$2}
              `;default:return x``}default:return x``}}async getCollection(){const e=await window.serverApi.getCollection(this.collectionType,this.collectionId);"group"==this.collectionType?this.collection=e.group:this.collection=e,this._setAdminConfirmed()}async _getAdminCollection(){switch(this.collectionType){case"community":const e=await window.serverApi.getCollection("domain",this.parentCollectionId);this._setAdminConfirmedFromParent(e);break;case"group":if(window.appGlobals.originalQueryParameters.createCommunityForGroup){const e=await window.serverApi.getCollection("domain",this.parentCollectionId);this._setAdminConfirmedFromParent(e)}else{const e=await window.serverApi.getCollection("community",this.parentCollectionId);this._setAdminConfirmedFromParent(e)}break;default:this.fire("yp-network-error",{message:this.t("unauthorized")})}}async _setAdminFromParent(){window.appGlobals.originalQueryParameters.createCommunityForGroup&&(this.parentCollectionId=window.appGlobals.domain?.id),window.appUser.loggedIn()?this._getAdminCollection():(await new Promise((e=>setTimeout(e,250))),window.appUser.loggedIn()?this._getAdminCollection():window.appUser.openUserlogin())}_setAdminConfirmedFromParent(e){let t=!1;if(e){switch(this.collectionType){case"community":t=YpAccessHelpers.checkDomainAccess(e),t||!e.configuration.onlyAdminsCanCreateCommunities&&window.appUser.user&&(t=!0);break;case"group":t=window.appGlobals.originalQueryParameters.createCommunityForGroup?YpAccessHelpers.checkDomainAccess(e):YpAccessHelpers.checkCommunityAccess(e),t||!e.configuration.onlyAdminsCanCreateGroups&&window.appUser.user&&(t=!0)}this.adminConfirmed=t,t||this.fire("yp-network-error",{message:this.t("unauthorized")})}}_setAdminConfirmed(){if(this.collection)switch(this.collectionType){case"domain":this.adminConfirmed=YpAccessHelpers.checkDomainAccess(this.collection);break;case"community":this.adminConfirmed=YpAccessHelpers.checkCommunityAccess(this.collection);break;case"group":this.adminConfirmed=YpAccessHelpers.checkGroupAccess(this.collection);break;case"post":this.adminConfirmed=YpAccessHelpers.checkPostAccess(this.collection)}this.collection&&this.haveCheckedAdminRights&&!this.adminConfirmed&&this.fire("yp-network-error",{message:this.t("unauthorized")})}getParentCollectionType(){switch(this.collectionType){case"group":return"community";case"community":return"domain";default:return""}}exitToMainApp(){this.active=!1,"new"===this.collectionId?window.appGlobals.originalQueryParameters.createCommunityForGroup?YpNavHelpers.redirectTo(`/domain/${this.parentCollectionId}`):YpNavHelpers.redirectTo(`/${this.getParentCollectionType()}/${this.parentCollectionId}`):YpNavHelpers.redirectTo(`/${this.collectionType}/${this.collectionId}`)}render(){return x`
      <div class="layout horizontal" ?hidden="${!this.adminConfirmed}">
        ${this.renderNavigationBar()}
        <div class="rightPanel">
          <main>
            <div class="mainPageContainer">${this._renderPage()}</div>
          </main>
        </div>
      </div>
      <md-linear-progress
        indeterminate
        ?hidden="${this.adminConfirmed}"
      ></md-linear-progress>
    `}_isPageSelectedClass(e){return e===this.page?"selectedContainer":""}_getListHeadline(e){if("configuration"===e){if("domain"===this.collectionType)return this.t("Domain Configuration");if("community"===this.collectionType)return this.t("Community Configuration");if("group"===this.collectionType)return this.t("Group Configuration");if("post"===this.collectionType)return this.t("Yp Configuration");if("profile_image"===this.collectionType)return this.t("Profile Image Configuration")}else{if("translations"===e)return this.t("Translations");if("organizations"===e)return this.t("Organizations");if("reports"===e)return this.t("reports");if("users"===e)return this.t("Users");if("admins"===e)return this.t("Admins");if("moderation"===e)return this.t("Moderation");if("aiAnalysis"===e)return this.t("aiAnalysis");if("pages"==e)return this.t("Pages");if("groups"==e)return this.t("Groups");if("communities"==e)return this.t("Communities");if("user"==e)return this.t("Settings");if("badges"==e)return this.t("Badges");if("profile_images"==e)return this.t("Profile Images");if("back"==e){if("community"===this.collectionType)return this.t("Back to domain");if("group"===this.collectionType)return this.t("Back to community");if("post"===this.collectionType||"profile_image"===this.collectionType)return this.t("Back to group")}}return""}_getListSupportingText(e){if("configuration"===e){if("domain"===this.collectionType)return this.t("Configure your domain");if("community"===this.collectionType)return this.t("Configure your community");if("group"===this.collectionType)return this.t("Configure your group");if("post"===this.collectionType)return this.t("Configure your yp");if("profile_image"===this.collectionType)return this.t("Configure profile image")}else{if("reports"===e)return this.t("reportsInfo");if("organizations"===e)return this.t("organizationsAdmin");if("translations"===e){if("domain"===this.collectionType)return this.t("Translate your domain");if("community"===this.collectionType)return this.t("Translate your community");if("group"===this.collectionType)return this.t("Translate your group");if("post"===this.collectionType)return this.t("Translate your yp")}else if("back"===e){if("community"===this.collectionType)return this.t("Back to domain");if("group"===this.collectionType)return this.t("Back to community");if("post"===this.collectionType)return this.t("Back to group");if("profile_image"===this.collectionType)return this.t("Back to group")}else if("users"===e){if("domain"===this.collectionType)return this.t("Manage domain users");if("community"===this.collectionType)return this.t("Manage community users");if("group"===this.collectionType)return this.t("Manage group users")}else if("admins"===e){if("domain"===this.collectionType)return this.t("Manage domain admins");if("community"===this.collectionType)return this.t("Manage community admins");if("group"===this.collectionType)return this.t("Manage group admins")}else{if("aiAnalysis"===e)return this.t("aiAnalysis");if("moderation"===e){if("domain"===this.collectionType)return this.t("Moderate domain");if("community"===this.collectionType)return this.t("Moderate community");if("group"===this.collectionType)return this.t("Moderate group")}else if("pages"===e){if("domain"===this.collectionType)return this.t("Manage domain pages");if("community"===this.collectionType)return this.t("Manage community pages");if("group"===this.collectionType)return this.t("Manage group pages")}else{if("posts"===e)return this.t("Manage posts");if("groups"===e)return this.t("Manage groups");if("communities"===e)return this.t("Manage communities");if("user"===e)return this.t("Theme, language, etc.");if("badges"===e)return this.t("Manage badges");if("profile_images"===e)return this.t("Manage profile images")}}}return""}_getListIcon(e){return"configuration"===e?"settings":"translations"===e?"translate":"organizations"===e?"add_business":"reports"===e?"download":"users"===e?"supervised_user_circle":"admins"===e?"supervisor_account":"moderation"===e?"checklist":"aiAnalysis"===e?"document_scanner":"pages"===e?"description":"posts"===e?"rocket_launch":"groups"===e?"videogroup_asset":"communities"===e?"category":"badges"===e?"workspace_premium":"profile_images"===e?"supervised_user_circle":"user"===e?"person":"back"===e?"arrow_back":""}setPage(e){"group"===this.collectionType?"back"==e?YpNavHelpers.redirectTo(`/admin/community/${this.parentCollectionId}/groups`):"profile_images"==e?YpNavHelpers.redirectTo(`/admin/group/${this.collectionId}/profile_images`):"posts"==e?YpNavHelpers.redirectTo(`/group/${this.collectionId}/posts`):this.page=e:"community"===this.collectionType&&"back"==e?YpNavHelpers.redirectTo(`/admin/domain/${this.collection.domain_id}/communities`):this.page=e,this.fireGlobal("yp-refresh-admin-content")}renderMenuListItem(e){return x`
      <md-list-item
        type="button"
        @click="${()=>this.setPage(e)}"
        class="${this._isPageSelectedClass(e)}"
      >
        <div slot="headline">${this._getListHeadline(e)||""}</div>
        <div slot="supporting-text">
          ${this._getListSupportingText(e)||""}
        </div>
        <md-icon slot="start">${this._getListIcon(e)||""}</md-icon>
      </md-list-item>
    `}get isAllOurIdeasGroupType(){return!!this.collection&&("group"===this.collectionType&&this.collection.configuration.groupType==YpAdminConfigGroup.GroupType.allOurIdeas)}renderNavigationBar(){return this.wide?x`
        <div class="drawer">
          <div class="layout horizontal backContainer">
            <md-icon-button class="backIcon" @click="${this.exitToMainApp}">
              <md-icon>close</md-icon>
            </md-icon-button>
          </div>
          <div
            class="layout horizontal headerContainer"
            ?hidden="${"new"==this.collectionId}"
          >
            <div class="analyticsHeaderText layout vertical center-center">
              <yp-image
                class="collectionLogoImage"
                sizing="contain"
                .src="${this.collection?YpCollectionHelpers.logoImagePath(this.collectionType,this.collection):""}"
              ></yp-image>
              <div class="collectionName">
                ${this.collection?this.collection.name:""}
              </div>
            </div>
          </div>

          <md-list>
            ${this.renderMenuListItem("configuration")}
            ${"new"!=this.collectionId?x`
                  ${"post"!==this.collectionType?x`
                        <md-divider></md-divider>

                        ${this.renderMenuListItem("users")}
                        ${this.renderMenuListItem("admins")}
                        ${this.isAllOurIdeasGroupType?T$2:this.renderMenuListItem("moderation")}
                        ${this.renderMenuListItem("pages")}
                        ${"domain"!=this.collectionType?x`
                              ${this.renderMenuListItem("reports")}
                              ${this.renderMenuListItem("translations")}
                            `:x` ${this.renderMenuListItem("organizations")}`}
                        ${this.isAllOurIdeasGroupType?T$2:this.renderMenuListItem("aiAnalysis")}
                      `:x``}
                `:T$2}
          </md-list>
        </div>
      `:x`
        <div class="navContainer">
          <md-navigation-bar @navigation-bar-activated="${this.tabChanged}">
            <md-navigation-tab .label="${this.t("Config")}"
              ><md-icon slot="activeIcon">settings</md-icon>
              <md-icon slot="inactiveIcon"
                >rocket_launch</md-icon
              ></md-navigation-tab
            >

            <md-navigation-tab .label="${this.t("Moderation")}">
              <md-icon slot="activeIcon">checklist</md-icon>
              <md-icon slot="inactiveIcon">checklist</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Users")}">
              <md-icon slot="activeIcon">group</md-icon>
              <md-icon slot="inactiveIcon">group</md-icon>
            </md-navigation-tab>

            <md-navigation-tab .label="${this.t("Admins")}">
              <md-icon slot="activeIcon">supervisor_account</md-icon>
              <md-icon slot="inactiveIcon">supervisor_account</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `}};__decorate([n$8({type:String})],YpAdminApp.prototype,"page",void 0),__decorate([n$8({type:Object})],YpAdminApp.prototype,"user",void 0),__decorate([n$8({type:Boolean,reflect:!0})],YpAdminApp.prototype,"active",void 0),__decorate([n$8({type:String})],YpAdminApp.prototype,"route",void 0),__decorate([n$8({type:String})],YpAdminApp.prototype,"subRoute",void 0),__decorate([n$8({type:Object})],YpAdminApp.prototype,"routeData",void 0),__decorate([n$8({type:Array})],YpAdminApp.prototype,"userYpCollection",void 0),__decorate([n$8({type:String})],YpAdminApp.prototype,"forwardToYpId",void 0),__decorate([n$8({type:String})],YpAdminApp.prototype,"headerTitle",void 0),__decorate([n$8({type:String})],YpAdminApp.prototype,"collectionType",void 0),__decorate([n$8({type:Number})],YpAdminApp.prototype,"collectionId",void 0),__decorate([n$8({type:Number})],YpAdminApp.prototype,"parentCollectionId",void 0),__decorate([n$8({type:Object})],YpAdminApp.prototype,"parentCollection",void 0),__decorate([n$8({type:Object})],YpAdminApp.prototype,"collection",void 0),__decorate([n$8({type:Boolean})],YpAdminApp.prototype,"adminConfirmed",void 0),__decorate([n$8({type:Boolean})],YpAdminApp.prototype,"haveCheckedAdminRights",void 0),YpAdminApp=__decorate([t$5("yp-admin-app")],YpAdminApp);export{YpAdminApp};