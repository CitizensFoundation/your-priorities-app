import{n as n$4,E as YpBaseElementWithLogin,h as e$3,u as YpMediaHelpers,F as YpImage,x,T as T$1,G as YpCollectionHelpers,w as o$4,H as o$5,i as i$2,t as t$2,a as YpBaseElement,I as YpThemeManager,J as c$2,q as YpNavHelpers,K as Corner,r as r$3,m as mixinDelegatesAria,s as s$4,_ as __decorate$j,e as e$4,M as redispatchEvent,o as o$6,O as j,B as YpFormattingHelpers,S as ShadowStyles,A as YpLanguages,Y as YpEditBase,p as YpAccessHelpers}from"./C7SxjuPo.js";import"./DxTi1fYn.js";import{G as Grid,a as addListener,b as GridColumn,r as registerStyles,i as i$3,T as ThemableMixin,h as html,D as DirMixin,P as PolymerElement,S as SlotController,c as removeValueFromAttribute,d as addValueToAttribute,e as dedupingMixin,L as LabelMixin,C as ControllerMixin,f as DelegateStateMixin,I as InputMixin,g as DelegateFocusMixin,K as KeyboardMixin,j as isTouch$1,k as Debouncer,t as timeOut,l as InputController,m as LabelledInputController,n as TooltipController,E as ElementMixin}from"./Be90JmBT.js";import{Y as YpStreamingLlmBase,A as AoiAdminServerApi,a as AoiGenerateAiLogos}from"./CgS5BnV-.js";var __decorate$i=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class YpAdminPage extends YpBaseElementWithLogin{}__decorate$i([n$4({type:String})],YpAdminPage.prototype,"collectionType",void 0),__decorate$i([n$4({type:Number})],YpAdminPage.prototype,"collectionId",void 0),__decorate$i([n$4({type:Object})],YpAdminPage.prototype,"collection",void 0);var __decorate$h=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const defaultLtpPromptsConfiguration=()=>Object.fromEntries(Array.from({length:10},((e,t)=>[t+1,""]))),defaultLtpConfiguration={crt:{prompts:defaultLtpPromptsConfiguration(),promptsTests:defaultLtpPromptsConfiguration()}};class YpAdminConfigBase extends YpAdminPage{constructor(){super(),this.selectedTab=0,this.configChanged=!1,this.method="POST",this.generatingAiImageInBackground=!1,this.hasVideoUpload=!1,this.hasAudioUpload=!1,this.connectedVideoToCollection=!1,this.descriptionMaxLength=300,this.tabsHidden=!1,this.gettingImageColor=!1,this.imageIdsUploadedByUser=[],this.videoIdsUploadedByUser=[]}async _formResponse(e){this.configChanged=!1}_selectTab(e){this.selectedTab=e.target.activeTabIndex}async getColorFromLogo(){try{this.gettingImageColor=!0;let e=this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages);const t=new Image;t.src=e+"?"+(new Date).getTime(),t.setAttribute("crossOrigin",""),await t.decode();let i=await YpImage.getThemeColorsFromImage(t);this.gettingImageColor=!1,console.error("New theme color",i),i&&(i=i.replace("#",""),this.fireGlobal("yp-theme-color-detected",i),this.detectedThemeColor=i,this._configChanged())}catch(e){console.log(e)}}_updateCollection(e){this.collection=e.detail}connectedCallback(){super.connectedCallback(),this.setupBootListener(),this.addGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.addGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),window.appGlobals.hasVideoUpload&&(this.hasVideoUpload=!0),window.appGlobals.hasAudioUpload&&(this.hasAudioUpload=!0),this.addListener("yp-form-response",this._formResponse),this.addListener("yp-updated-collection",this._updateCollection)}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.removeGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),this.removeListener("yp-form-response",this._formResponse),this.removeListener("yp-updated-collection",this._updateCollection)}_logoImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedLogoImageId=t.id,this.imageIdsUploadedByUser.push(t.id),this.imagePreviewUrl=JSON.parse(t.formats)[0],JSON.parse(t.formats),this._configChanged()}_headerImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedHeaderImageId=t.id,this.configChanged=!0}_statusSelected(e){const t=e.target.selectedIndex;this.status=this.collectionStatusOptions[t].name,this._configChanged()}get statusIndex(){if(this.status){for(let e=0;e<this.collectionStatusOptions.length;e++)if(this.collectionStatusOptions[e].name==this.status)return e;return-1}return-1}get collectionStatusOptions(){return this.language?[{name:"active",translatedName:this.t("status.active")},{name:"featured",translatedName:this.t("status.featured")},{name:"archived",translatedName:this.t("status.archived")},{name:"hidden",translatedName:this.t("status.hidden")}]:[]}_ltpConfigChanged(e){setTimeout((()=>{const e=this.$$("#jsoneditor").json;this.collection.configuration.ltp=e,this._configChanged(),this.requestUpdate()}),25)}tabsPostSetup(e){}get disableSaveButtonForCollection(){if("group"==this.collectionType&&this.collection&&this.collection.configuration){if(1===this.collection.configuration.groupType){const e=this.collection.configuration?.allOurIdeas?.earl?.question_id;return void 0===e}return!1}return!1}_themeChanged(e){this.collection.configuration.theme={...this.collection.configuration.theme,...e.detail},this.requestUpdate()}renderSaveButton(){return x`
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
        `:T$1}renderTabPages(){if(this.tabsHidden)return T$1;let e=[];return this.configTabs?.forEach(((t,i)=>{e.push(this.renderTabPage(t.items,i))})),x`${e}`}_generateLogo(e){e.preventDefault(),e.stopPropagation(),this.requestUpdate();this.$$("#aiImageGenerator").open()}renderTabPage(e,t){return x`<div
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
    </div>`}get collectionVideoURL(){if(this.collection&&this.collection.configuration){const e=this.collectionVideos;if(e){const t=YpMediaHelpers.getVideoURL(e);if(t)return this.collectionVideoId=e[0].id,t}}else;}get collectionVideoPosterURL(){if(this.collection&&this.collection.configuration&&this.collection.configuration.useVideoCover){const e=YpMediaHelpers.getVideoPosterURL(this.collectionVideos,YpCollectionHelpers.logoImages(this.collectionType,this.collection));return e||void 0}}get collectionVideos(){switch(this.collectionType){case"domain":return this.collection.DomainLogoVideos;case"community":return this.collection.CommunityLogoVideos;case"group":return this.collection.GroupLogoVideos;default:return}}clearVideos(){switch(this.collectionVideoId=void 0,this.videoPreviewUrl=void 0,this.collectionType){case"domain":this.collection.DomainLogoVideos=[];break;case"community":this.collection.CommunityLogoVideos=[];break;case"group":this.collection.GroupLogoVideos=[]}this.requestUpdate()}clearHeaderImage(){switch(this.uploadedHeaderImageId=void 0,this.collectionType){case"domain":this.collection.DomainHeaderImages=[];break;case"community":this.collection.CommunityHeaderImages=[];break;case"group":this.collection.GroupHeaderImages=[]}this.currentHeaderImages=void 0,this.requestUpdate()}clearImages(){switch(this.uploadedLogoImageId=void 0,this.imagePreviewUrl=void 0,this.collectionType){case"domain":this.collection.DomainLogoImages=[];break;case"community":this.collection.CommunityLogoImages=[];break;case"group":this.collection.GroupLogoImages=[]}this.currentLogoImages=void 0,this.requestUpdate()}renderCoverMediaContent(){return this.collection?.configuration?.welcomeHTML?x`<div id="welcomeHTML">
        ${o$4(this.collection.configuration.welcomeHTML)}
      </div>`:this.collectionVideoURL&&this.collection?.configuration.useVideoCover?x`
        <video
          id="videoPlayer"
          data-id="${o$5(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="mainImage"
          src="${this.collectionVideoURL}"
          playsinline
          poster="${o$5(this.collectionVideoPosterURL)}"
        ></video>
      `:this.videoPreviewUrl&&this.collection?.configuration.useVideoCover?x`
        <video
          id="videoPlayer"
          data-id="${o$5(this.collectionVideoId)}"
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
            sizing="cover"
            .skipCloudFlare="${!0}"
            src="${this.imagePreviewUrl}"
          ></yp-image>
          ${this.gettingImageColor?x`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `:T$1}
        </div>
      `:this.currentLogoImages&&this.currentLogoImages.length>0?x`
        <div style="position: relative;">
          <yp-image
            class="image"
            sizing="cover"
            src="${YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
          ></yp-image>
          ${this.gettingImageColor?x`
                <md-linear-progress
                  class="imagePicker"
                  indeterminate
                ></md-linear-progress>
              `:T$1}
        </div>
      `:x`
        <yp-image
          class="image"
          sizing="contain"
          src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ypPlaceHolder2.jpg"
        ></yp-image>
      `}async reallyDeleteCurrentLogoImage(){!this.imagePreviewUrl&&this.currentLogoImages?this.currentLogoImages.forEach((async e=>{await window.adminServerApi.deleteImage(e.id,this.collectionType,this.collectionId,this.imageIdsUploadedByUser.includes(e.id))})):this.imagePreviewUrl&&this.uploadedLogoImageId?await window.adminServerApi.deleteImage(this.uploadedLogoImageId,this.collectionType,this.collectionId,this.imageIdsUploadedByUser.includes(this.uploadedLogoImageId)):console.warn("No image to delete"),this.clearImages()}async reallyDeleteCurrentHeaderImage(){this.currentHeaderImages?this.currentHeaderImages.forEach((async e=>{await window.adminServerApi.deleteImage(e.id,this.collectionType,this.collectionId,this.imageIdsUploadedByUser.includes(e.id))})):console.warn("No image to delete"),this.clearHeaderImage()}async reallyDeleteCurrentVideo(){!this.videoPreviewUrl&&this.collectionVideoId?await window.adminServerApi.deleteVideo(this.collectionVideoId,this.collectionType,this.collectionId,this.videoIdsUploadedByUser.includes(this.collectionVideoId)):this.videoPreviewUrl&&this.uploadedVideoId?await window.adminServerApi.deleteVideo(this.uploadedVideoId,this.collectionType,this.collectionId,this.videoIdsUploadedByUser.includes(this.uploadedVideoId)):console.warn("No video to delete"),this.clearVideos()}deleteCurrentLogoImage(e){e.preventDefault(),e.stopPropagation(),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteLogoImage"),this.reallyDeleteCurrentLogoImage.bind(this))}))}deleteCurrentHeaderImage(e){e.preventDefault(),e.stopPropagation(),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteLogoImage"),this.reallyDeleteCurrentHeaderImage.bind(this))}))}deleteCurrentVideo(e){e.preventDefault(),e.stopPropagation(),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteVideo"),this.reallyDeleteCurrentVideo.bind(this))}))}renderLogoMedia(){return x`
      <div class="layout vertical logoImagePlaceholder">
        ${this.renderCoverMediaContent()}
        ${this.currentLogoImages&&this.currentLogoImages.length>0||this.imagePreviewUrl?x`<md-filled-tonal-icon-button
              class="deleteImageButton"
              @click="${this.deleteCurrentLogoImage}"
              ><md-icon>delete</md-icon></md-filled-tonal-icon-button
            >`:T$1}
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
                ></md-linear-progress>`:T$1}
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
                >`:T$1}
            <yp-file-upload
              ?hidden="${!this.hasVideoUpload}"
              id="videoFileUpload"
              raised
              style="position: static;"
              useIconButton
              videoUpload
              autoChooseFirstVideoFrameAsPost
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
          id="headerImageUpload"
          raised
          target="/api/images?itemType=domain-header"
          method="POST"
          buttonIcon="photo_camera"
          .buttonText="${this.t("image.header.upload")}"
          @success="${this._headerImageUploaded}"
        >
        </yp-file-upload>
        ${this.currentHeaderImages&&this.currentHeaderImages.length>0?x`
              <md-icon-button @click="${this.deleteCurrentHeaderImage}">
                <md-icon>delete</md-icon>
              </md-icon-button>
            `:T$1}
      </div>
    `}static get styles(){return[super.styles,i$2`
        .saveButton {
          margin-left: 16px;
        }

        .deleteImageButton {
          position: absolute;
          top: 8px;
          left: 8px;
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

        #videoPlayer {
          width: 432px;
          height: 243px;
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
        ${e?T$1:x`
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
    `}_descriptionChanged(e){const t=e.target.value,i=new RegExp(/(?:https?|http?):\/\/[\n\S]+/g),o=t.match(i);if(o&&o.length>0){let e=0;for(var n=0;n<Math.min(o.length,10);n++)e+=o[n].length;let t=300;t+=e,t-=Math.min(e,30*o.length),this.descriptionMaxLength=t}}render(){let e,t,i,o;return"new"===this.collectionId?("community"===this.collectionType?e="domain":"group"===this.collectionType?e="community":"domain"===this.collectionType&&(e="domain"),t=this.parentCollectionId):this.collection&&(e=this.collectionType,t=this.collectionId),i=this.nameInput?.value,o=this.descriptionInput?.value,this.configTabs?x`
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
        `:T$1}_logoGeneratingInBackground(e){this.generatingAiImageInBackground=!0}_gotAiImage(e){this.generatingAiImageInBackground=!1,this.imagePreviewUrl=e.detail.imageUrl,this.uploadedLogoImageId=e.detail.imageId,this.imageIdsUploadedByUser.push(e.detail.imageId),this.configChanged=!0}updated(e){super.updated(e),e.has("collection")&&this.collection&&(this.configTabs=this.setupConfigTabs()),e.has("collectionId")&&this.collectionId&&("new"==this.collectionId?this.method="POST":this.method="PUT")}async _getHelpPages(e=void 0,t=void 0){this.collectionId&&"new"!=this.collectionId?this.translatedPages=await window.serverApi.getHelpPages(e||this.collectionType,t||this.collectionId):console.error("Collection id setup for get help pages")}firstUpdated(e){super.firstUpdated(e),this._updateEmojiBindings()}_getLocalizePageTitle(e){let t="en";return window.appGlobals.locale&&e.title[window.appGlobals.locale]&&(t=window.appGlobals.locale),e.title[t]}beforeSave(){}afterSave(){}sendUpdateCollectionEvents(){"domain"==this.collectionType?this.fireGlobal("yp-refresh-domain"):"community"==this.collectionType?this.fireGlobal("yp-refresh-community"):"group"==this.collectionType&&this.fireGlobal("yp-refresh-group")}async _save(e){e.preventDefault(),e.stopPropagation(),this.beforeSave(),console.error("Saving collection",this.collection);const t=this.$$("#form");if(t.validate())this.$$("#spinner").hidden=!1,await t.submit(),this.$$("#spinner").hidden=!0,this.sendUpdateCollectionEvents(),this.afterSave();else{this.fire("yp-form-invalid");const e=this.t("form.invalid");this._showErrorDialog(e)}}_showErrorDialog(e){this.fire("yp-error",e)}_configChanged(){this.configChanged=!0,this.requestUpdate()}_videoUploaded(e){this.uploadedVideoId=e.detail.videoId,this.videoIdsUploadedByUser.push(e.detail.videoId),this.collection.configuration.useVideoCover=!0,this.videoPreviewUrl=e.detail.detail.videoUrl,this.connectedVideoToCollection=!0,this._configChanged(),this.requestUpdate()}_getSaveCollectionPath(path){try{return eval(`this.collection.${path}`)}catch(e){return}}_clear(){this.collection=void 0,this.uploadedLogoImageId=void 0,this.uploadedHeaderImageId=void 0,this.imagePreviewUrl=void 0,this.collectionVideoId=void 0,this.uploadedVideoId=void 0,this.videoPreviewUrl=void 0,this.connectedVideoToCollection=!1,this.imageIdsUploadedByUser=[],this.videoIdsUploadedByUser=[],this.$$("#headerImageUpload").clear(),this.$$("#logoImageUpload").clear(),this.$$("#videoFileUpload")&&this.$$("#videoFileUpload").clear()}_updateEmojiBindings(){setTimeout((()=>{const e=this.$$("#description"),t=this.$$("#emojiSelectorDescription");e&&t?t.inputTarget=e:console.error("Could not find emoji selector or description input")}),500)}_getCurrentValue(question){if(this.collection&&this.collection.configuration&&-1==["textheader","textdescription"].indexOf(question.type)){const looseConfig=this.collection.configuration;if(question.text.indexOf(".")>-1)try{return eval(`this.collection.configuration.${question.text}`)}catch(e){console.error(e)}else{const e=looseConfig[question.text];if(void 0!==e)return e}}}}__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"configTabs",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"selectedTab",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"configChanged",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"method",void 0),__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"currentLogoImages",void 0),__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"currentHeaderImages",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"collectionVideoId",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"generatingAiImageInBackground",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"action",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"subRoute",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"hasVideoUpload",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"status",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"hasAudioUpload",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"uploadedLogoImageId",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"uploadedHeaderImageId",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"uploadedVideoId",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"connectedVideoToCollection",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"editHeaderText",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"toastText",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"saveText",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"imagePreviewUrl",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"videoPreviewUrl",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"themeId",void 0),__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"translatedPages",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"descriptionMaxLength",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"tabsHidden",void 0),__decorate$h([n$4({type:Number})],YpAdminConfigBase.prototype,"parentCollectionId",void 0),__decorate$h([n$4({type:Object})],YpAdminConfigBase.prototype,"parentCollection",void 0),__decorate$h([e$3("#name")],YpAdminConfigBase.prototype,"nameInput",void 0),__decorate$h([e$3("#description")],YpAdminConfigBase.prototype,"descriptionInput",void 0),__decorate$h([n$4({type:Boolean})],YpAdminConfigBase.prototype,"gettingImageColor",void 0),__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"imageIdsUploadedByUser",void 0),__decorate$h([n$4({type:Array})],YpAdminConfigBase.prototype,"videoIdsUploadedByUser",void 0),__decorate$h([n$4({type:String})],YpAdminConfigBase.prototype,"detectedThemeColor",void 0);const clamp=(e,t=0,i=1)=>e>i?i:e<t?t:e,round=(e,t=0,i=Math.pow(10,t))=>Math.round(i*e)/i,hexToHsva=e=>rgbaToHsva(hexToRgba(e)),hexToRgba=e=>("#"===e[0]&&(e=e.substring(1)),e.length<6?{r:parseInt(e[0]+e[0],16),g:parseInt(e[1]+e[1],16),b:parseInt(e[2]+e[2],16),a:4===e.length?round(parseInt(e[3]+e[3],16)/255,2):1}:{r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16),a:8===e.length?round(parseInt(e.substring(6,8),16)/255,2):1}),hsvaToHex=e=>rgbaToHex(hsvaToRgba(e)),hsvaToHsla=({h:e,s:t,v:i,a:o})=>{const n=(200-t)*i/100;return{h:round(e),s:round(n>0&&n<200?t*i/100/(n<=100?n:200-n)*100:0),l:round(n/2),a:round(o,2)}},hsvaToHslString=e=>{const{h:t,s:i,l:o}=hsvaToHsla(e);return`hsl(${t}, ${i}%, ${o}%)`},hsvaToRgba=({h:e,s:t,v:i,a:o})=>{e=e/360*6,t/=100,i/=100;const n=Math.floor(e),a=i*(1-t),r=i*(1-(e-n)*t),s=i*(1-(1-e+n)*t),d=n%6;return{r:round(255*[i,r,a,a,s,i][d]),g:round(255*[s,i,i,r,a,a][d]),b:round(255*[a,a,s,i,i,r][d]),a:round(o,2)}},format=e=>{const t=e.toString(16);return t.length<2?"0"+t:t},rgbaToHex=({r:e,g:t,b:i,a:o})=>{const n=o<1?format(round(255*o)):"";return"#"+format(e)+format(t)+format(i)+n},rgbaToHsva=({r:e,g:t,b:i,a:o})=>{const n=Math.max(e,t,i),a=n-Math.min(e,t,i),r=a?n===e?(t-i)/a:n===t?2+(i-e)/a:4+(e-t)/a:0;return{h:round(60*(r<0?r+6:r)),s:round(n?a/n*100:0),v:round(n/255*100),a:o}},equalColorObjects=(e,t)=>{if(e===t)return!0;for(const i in e)if(e[i]!==t[i])return!1;return!0},equalHex=(e,t)=>e.toLowerCase()===t.toLowerCase()||equalColorObjects(hexToRgba(e),hexToRgba(t)),cache={},tpl=e=>{let t=cache[e];return t||(t=document.createElement("template"),t.innerHTML=e,cache[e]=t),t},fire=(e,t,i)=>{e.dispatchEvent(new CustomEvent(t,{bubbles:!0,detail:i}))};let hasTouched=!1;const isTouch=e=>"touches"in e,isValid=e=>!(hasTouched&&!isTouch(e))&&(hasTouched||(hasTouched=isTouch(e)),!0),pointerMove=(e,t)=>{const i=isTouch(t)?t.touches[0]:t,o=e.el.getBoundingClientRect();fire(e.el,"move",e.getMove({x:clamp((i.pageX-(o.left+window.pageXOffset))/o.width),y:clamp((i.pageY-(o.top+window.pageYOffset))/o.height)}))},keyMove=(e,t)=>{const i=t.keyCode;i>40||e.xy&&i<37||i<33||(t.preventDefault(),fire(e.el,"move",e.getMove({x:39===i?.01:37===i?-.01:34===i?.05:33===i?-.05:35===i?1:36===i?-1:0,y:40===i?.01:38===i?-.01:0},!0)))};class Slider{constructor(e,t,i,o){const n=tpl(`<div role="slider" tabindex="0" part="${t}" ${i}><div part="${t}-pointer"></div></div>`);e.appendChild(n.content.cloneNode(!0));const a=e.querySelector(`[part=${t}]`);a.addEventListener("mousedown",this),a.addEventListener("touchstart",this),a.addEventListener("keydown",this),this.el=a,this.xy=o,this.nodes=[a.firstChild,a]}set dragging(e){const t=e?document.addEventListener:document.removeEventListener;t(hasTouched?"touchmove":"mousemove",this),t(hasTouched?"touchend":"mouseup",this)}handleEvent(e){switch(e.type){case"mousedown":case"touchstart":if(e.preventDefault(),!isValid(e)||!hasTouched&&0!=e.button)return;this.el.focus(),pointerMove(this,e),this.dragging=!0;break;case"mousemove":case"touchmove":e.preventDefault(),pointerMove(this,e);break;case"mouseup":case"touchend":this.dragging=!1;break;case"keydown":keyMove(this,e)}}style(e){e.forEach(((e,t)=>{for(const i in e)this.nodes[t].style.setProperty(i,e[i])}))}}class Hue extends Slider{constructor(e){super(e,"hue",'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',!1)}update({h:e}){this.h=e,this.style([{left:e/360*100+"%",color:hsvaToHslString({h:e,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuenow",`${round(e)}`)}getMove(e,t){return{h:t?clamp(this.h+360*e.x,0,360):360*e.x}}}class Saturation extends Slider{constructor(e){super(e,"saturation",'aria-label="Color"',!0)}update(e){this.hsva=e,this.style([{top:100-e.v+"%",left:`${e.s}%`,color:hsvaToHslString(e)},{"background-color":hsvaToHslString({h:e.h,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuetext",`Saturation ${round(e.s)}%, Brightness ${round(e.v)}%`)}getMove(e,t){return{s:t?clamp(this.hsva.s+100*e.x,0,100):100*e.x,v:t?clamp(this.hsva.v-100*e.y,0,100):Math.round(100-100*e.y)}}}var css=':host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}',hueCss="[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}",saturationCss="[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}";const $isSame=Symbol("same"),$color=Symbol("color"),$hsva=Symbol("hsva"),$update=Symbol("update"),$parts=Symbol("parts"),$css=Symbol("css"),$sliders=Symbol("sliders");class ColorPicker extends HTMLElement{static get observedAttributes(){return["color"]}get[$css](){return[css,hueCss,saturationCss]}get[$sliders](){return[Saturation,Hue]}get color(){return this[$color]}set color(e){if(!this[$isSame](e)){const t=this.colorModel.toHsva(e);this[$update](t),this[$color]=e}}constructor(){super();const e=tpl(`<style>${this[$css].join("")}</style>`),t=this.attachShadow({mode:"open"});t.appendChild(e.content.cloneNode(!0)),t.addEventListener("move",this),this[$parts]=this[$sliders].map((e=>new e(t)))}connectedCallback(){if(this.hasOwnProperty("color")){const e=this.color;delete this.color,this.color=e}else this.color||(this.color=this.colorModel.defaultColor)}attributeChangedCallback(e,t,i){const o=this.colorModel.fromAttr(i);this[$isSame](o)||(this.color=o)}handleEvent(e){const t=this[$hsva],i={...t,...e.detail};let o;this[$update](i),equalColorObjects(i,t)||this[$isSame](o=this.colorModel.fromHsva(i))||(this[$color]=o,fire(this,"color-changed",{value:o}))}[$isSame](e){return this.color&&this.colorModel.equal(e,this.color)}[$update](e){this[$hsva]=e,this[$parts].forEach((t=>t.update(e)))}}const colorModel={defaultColor:"#000",toHsva:hexToHsva,fromHsva:({h:e,s:t,v:i})=>hsvaToHex({h:e,s:t,v:i,a:1}),equal:equalHex,fromAttr:e=>e};class HexBase extends ColorPicker{get colorModel(){return colorModel}}class HexColorPicker extends HexBase{}customElements.define("hex-color-picker",HexColorPicker);var __decorate$g=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpThemeColorInput=class extends YpBaseElement{constructor(){super(...arguments),this.disableSelection=!1,this.isColorPickerActive=!1,this.handleOutsideClick=e=>{if(!this.isColorPickerActive){const t=e.composedPath(),i=this.shadowRoot.querySelector("hex-color-picker");t.includes(i)||this.closePalette()}}}static get styles(){return[super.styles,i$2`
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
      `]}isValidHex(e){return!!e&&/^#([0-9A-F]{3}){1,2}$/i.test(e)}handleColorInput(e){const t=e.target.value;/^[0-9A-Fa-f]{0,6}$/.test(t)&&6===t.length?(this.color=t.replace("#",""),this.fire("input",{color:`${this.color}`})):e.target.value=this.color||"",console.error(`Invalid color: ${t}`)}_onPaste(e){}openPalette(){const e=this.shadowRoot.querySelector("hex-color-picker");e.hidden=!1,this.isColorPickerActive=!1,e.addEventListener("mousedown",(()=>this.isColorPickerActive=!0)),e.addEventListener("mouseup",(()=>this.isColorPickerActive=!1)),setTimeout((()=>document.addEventListener("click",this.handleOutsideClick,!0)),0)}closePalette(){const e=this.shadowRoot.querySelector("hex-color-picker");e&&(e.hidden=!0,document.removeEventListener("click",this.handleOutsideClick,!0))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleOutsideClick,!0);const e=this.shadowRoot.querySelector("hex-color-picker");e&&(e.removeEventListener("mousedown",(()=>this.isColorPickerActive=!0)),e.removeEventListener("mouseup",(()=>this.isColorPickerActive=!1)))}handleKeyDown(e){if(["Backspace","Tab","End","Home","ArrowLeft","ArrowRight","Delete","Control","Meta","v"].includes(e.key)||e.ctrlKey&&"v"===e.key||e.metaKey&&"v"===e.key)return;/^[0-9A-Fa-f]$/.test(e.key)||e.preventDefault()}handleColorChanged(e){this.color=e.detail.value.replace("#",""),this.fire("input",{color:`${this.color}`})}clearColor(){this.color=void 0,this.fire("input",{color:void 0})}render(){return x`
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
    `}};__decorate$g([n$4({type:String})],YpThemeColorInput.prototype,"color",void 0),__decorate$g([n$4({type:String})],YpThemeColorInput.prototype,"label",void 0),__decorate$g([n$4({type:Boolean})],YpThemeColorInput.prototype,"disableSelection",void 0),YpThemeColorInput=__decorate$g([t$2("yp-theme-color-input")],YpThemeColorInput);var __decorate$f=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpThemeSelector=class extends YpBaseElement{constructor(){super(...arguments),this.selectedThemeScheme="tonal",this.selectedThemeVariant="monochrome",this.disableSelection=!1,this.disableMultiInputs=!1,this.useLowestContainerSurface=!1,this.disableOneThemeColorInputs=!1,this.hasLogoImage=!1,this.channel=new BroadcastChannel("hex_color")}static get styles(){return[super.styles,i$2`
        md-checkbox {
          margin-right: 8px;
        }

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
      `]}connectedCallback(){super.connectedCallback(),this.themeConfiguration&&(this.oneDynamicThemeColor=this.themeConfiguration.oneDynamicColor,this.selectedThemeScheme=this.themeConfiguration.oneColorScheme||this.selectedThemeScheme,this.selectedThemeVariant=this.themeConfiguration.variant||this.selectedThemeVariant,this.themePrimaryColor=this.themeConfiguration.primaryColor,this.themeSecondaryColor=this.themeConfiguration.secondaryColor,this.themeTertiaryColor=this.themeConfiguration.tertiaryColor,this.themeNeutralColor=this.themeConfiguration.neutralColor,this.themeNeutralVariantColor=this.themeConfiguration.neutralVariantColor,this.useLowestContainerSurface=this.themeConfiguration.useLowestContainerSurface||!1,this.fontStyles=this.themeConfiguration.fontStyles,this.fontImports=this.themeConfiguration.fontImports),this.addGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}themeColorDetected(e){this.oneDynamicThemeColor=e.detail,console.error("Theme Color Detected:",this.oneDynamicThemeColor)}updated(e){let t=!1;["oneDynamicThemeColor","selectedThemeScheme","selectedThemeVariant","themePrimaryColor","themeSecondaryColor","themeTertiaryColor","themeNeutralColor","themeNeutralVariantColor","useLowestContainerSurface","fontStyles","fontImports"].forEach((i=>{e.has(i)&&(t=!0,this.updateDisabledInputs())})),e.has("oneDynamicThemeColor"),t&&(this.themeConfiguration={oneDynamicColor:this.oneDynamicThemeColor,oneColorScheme:this.selectedThemeScheme,variant:this.selectedThemeVariant,primaryColor:this.themePrimaryColor,secondaryColor:this.themeSecondaryColor,tertiaryColor:this.themeTertiaryColor,neutralColor:this.themeNeutralColor,neutralVariantColor:this.themeNeutralVariantColor,useLowestContainerSurface:this.useLowestContainerSurface,fontStyles:this.fontStyles,fontImports:this.fontImports},(this.themeConfiguration.oneDynamicColor||!this.themeConfiguration.oneDynamicColor&&this.themeConfiguration.primaryColor&&this.themeConfiguration.secondaryColor&&this.themeConfiguration.tertiaryColor&&this.themeConfiguration.neutralColor&&this.themeConfiguration.neutralVariantColor)&&this.fireGlobal("yp-theme-configuration-updated",this.themeConfiguration),this.fire("yp-theme-configuration-changed",this.themeConfiguration))}isValidHex(e){return!!e&&/^#([0-9A-F]{3}){1,2}$/i.test(e)}setThemeSchema(e){const t=e.target.selectedIndex;this.selectedThemeScheme=YpThemeManager.themeScemesOptionsWithName[t].value}setThemeVariant(e){const t=e.target.selectedIndex;this.selectedThemeVariant=YpThemeManager.themeVariantsOptionsWithName[t].value}handleColorInput(e){const t=e.target.value;/^[0-9A-Fa-f]{0,6}$/.test(t)?this.oneDynamicThemeColor=t:e.target.value=this.oneDynamicThemeColor||""}updateDisabledInputs(){this.disableOneThemeColorInputs=[this.themePrimaryColor,this.themeSecondaryColor,this.themeTertiaryColor,this.themeNeutralColor,this.themeNeutralVariantColor].some((e=>this.isValidHex(e))),this.disableMultiInputs=this.isValidHex(this.oneDynamicThemeColor)}get currentThemeSchemaIndex(){return YpThemeManager.themeScemesOptionsWithName.findIndex((e=>e.value===this.selectedThemeScheme))||0}updateFontStyles(e){this.fontStyles=e.target.value||"",this.fontStyles=this.fontStyles.replace("<style>","").replace("</style>","").trim()}updateFontImports(e){this.fontImports=e.target.value||"",this.fontImports=this.fontImports.replace("<style>","").replace("</style>",""),this.fontImports=this.fontImports.replace("<a href","").replace("</a>","").trim()}async setLowestContainerSurface(e){this.useLowestContainerSurface=this.$$("#useLowestContainerSurface").checked}render(){return x`
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

            <label>
              <md-checkbox
                id="useLowestContainerSurface"
                @change="${this.setLowestContainerSurface}"
                ?checked="${this.useLowestContainerSurface}"
              >
              </md-checkbox>

              ${this.t("useLowestContainerSurface")}
            </label>

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

    --md-sys-typescale-headline-font: "Roboto";
    --md-sys-typescale-title-font: "Roboto";
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
      ${c$2([{text:"Primary",color:"--md-sys-color-primary",contrast:"--md-sys-color-on-primary"},{text:"Primary Container",color:"--md-sys-color-primary-container",contrast:"--md-sys-color-on-primary-container"},{text:"Secondary",color:"--md-sys-color-secondary",contrast:"--md-sys-color-on-secondary"},{text:"Secondary Container",color:"--md-sys-color-secondary-container",contrast:"--md-sys-color-on-secondary-container"},{text:"Tertiary",color:"--md-sys-color-tertiary",contrast:"--md-sys-color-on-tertiary"},{text:"Tertiary Container",color:"--md-sys-color-tertiary-container",contrast:"--md-sys-color-on-tertiary-container"},{text:"Error",color:"--md-sys-color-error",contrast:"--md-sys-color-on-error"},{text:"Error Container",color:"--md-sys-color-error-container",contrast:"--md-sys-color-on-error-container"},{text:"Background",color:"--md-sys-color-background",contrast:"--md-sys-color-on-background"},{text:"Surface Dim",color:"--md-sys-color-surface-dim",contrast:"--md-sys-color-on-surface"},{text:"Surface",color:"--md-sys-color-surface",contrast:"--md-sys-color-on-surface"},{text:"Surface Bright",color:"--md-sys-color-surface-bright",contrast:"--md-sys-color-on-surface"},{text:"Surface Variant",color:"--md-sys-color-surface-variant",contrast:"--md-sys-color-on-surface-variant"},{text:"Surface Container Lowest",color:"--md-sys-color-surface-container-lowest",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Low",color:"--md-sys-color-surface-container-low",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container",color:"--md-sys-color-surface-container",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container High",color:"--md-sys-color-surface-container-high",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Highest",color:"--md-sys-color-surface-container-highest",contrast:"--md-sys-color-on-surface-container"},{text:"Inverse Primary",color:"--md-sys-color-inverse-primary",contrast:"--md-sys-color-inverse-on-primary"},{text:"Inverse Surface",color:"--md-sys-color-inverse-surface",contrast:"--md-sys-color-inverse-on-surface"}],(({text:e})=>e),(({text:e,color:t,contrast:i})=>x` <div
          class="color"
          style="color:var(${i});background-color:var(${t})"
        >
          ${e}
        </div>`))}
    </div>`}};__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"oneDynamicThemeColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"themePrimaryColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"themeSecondaryColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"themeTertiaryColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"themeNeutralColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"themeNeutralVariantColor",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"fontStyles",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"fontImports",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"selectedThemeScheme",void 0),__decorate$f([n$4({type:String})],YpThemeSelector.prototype,"selectedThemeVariant",void 0),__decorate$f([n$4({type:Object})],YpThemeSelector.prototype,"themeConfiguration",void 0),__decorate$f([n$4({type:Boolean})],YpThemeSelector.prototype,"disableSelection",void 0),__decorate$f([n$4({type:Boolean})],YpThemeSelector.prototype,"disableMultiInputs",void 0),__decorate$f([n$4({type:Boolean})],YpThemeSelector.prototype,"useLowestContainerSurface",void 0),__decorate$f([n$4({type:Boolean})],YpThemeSelector.prototype,"disableOneThemeColorInputs",void 0),__decorate$f([n$4({type:Boolean})],YpThemeSelector.prototype,"hasLogoImage",void 0),YpThemeSelector=__decorate$f([t$2("yp-theme-selector")],YpThemeSelector);var __decorate$e=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminCommunities=class extends YpBaseElementWithLogin{newCommunity(){YpNavHelpers.redirectTo(`/community/new/${this.domain.id}`)}static get styles(){return[super.styles,i$2`
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
    `}};__decorate$e([n$4({type:Object})],YpAdminCommunities.prototype,"domain",void 0),YpAdminCommunities=__decorate$e([t$2("yp-admin-communities")],YpAdminCommunities);var __decorate$d=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminConfigDomain=class extends YpAdminConfigBase{constructor(){super(),this.action="/domains"}static get styles(){return[super.styles,i$2`
        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        .actionButtonContainer {
          margin-left: 16px;
          margin-top: 16px;
        }

        md-radio {
          margin-right: 4px;
        }
      `]}renderHeader(){return this.collection?x`
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
        `:T$1}renderHiddenInputs(){return x`
      ${(this.collection?.configuration).ltp?x`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `:T$1}
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$1}
    `}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(e){e.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.DomainLogoImages,this.currentHeaderImages=this.collection.DomainHeaderImages,this._setupTranslations(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.DomainLogoVideos&&this.collection.DomainLogoVideos.length>0&&(this.uploadedVideoId=this.collection.DomainLogoVideos[0].id)),e.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(e)}_collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(this.action=`/domains/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",counter_points:0,counter_posts:0,counter_users:0,access:2,default_locale:"en",configuration:{}}):this.action=`/domains/${this.collectionId}`}_setupTranslations(){window.location.href.includes("organization")?"new"==this.collectionId?(this.editHeaderText=this.t("newOrganization"),this.toastText=this.t("organizationToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("editOrganization"),this.toastText=this.t("organizationToastUpdated")):"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},"completeAndAddToDomain"),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No domain found on custom redirect")}_finishRedirect(e){YpNavHelpers.redirectTo("/domain/"+e.id),window.appGlobals.activity("completed","editDomain")}setupConfigTabs(){const e=[];return e.push({name:"basic",icon:"code",items:[{text:"defaultLocale",type:"html",templateData:x`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.collection.default_locale}"
            >
            </yp-language-selector>
          `},{text:"status",type:"html",templateData:x`
            <div class="layout vertical accessContainer">
              <div class="accessHeader">${this.t("access")}</div>
              <label>
                <md-radio
                  @change="${this._configChanged}"
                  value="0"
                  ?checked="${0==this.collection.access}"
                  name="access"
                ></md-radio>
                ${this.t("public")}
              </label>
              <label>
                <md-radio
                  @change="${this._configChanged}"
                  ?checked="${2==this.collection.access}"
                  value="2"
                  name="access"
                ></md-radio>
                ${this.t("private")}
              </label>
            </div>
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
          `},{text:"onlyAdminsCanCreateCommunities",type:"checkbox",value:this.collection.only_admins_can_create_communities,translationToken:"domain.onlyAdminsCanCreateCommunities"},{text:"hideAllTabs",type:"checkbox"},{text:"hideDomainNews",type:"checkbox"},{text:"useFixedTopAppBar",type:"checkbox"},{text:"disableArrowBasedTopNavigation",type:"checkbox"},{text:"useLoginOnDomainIfNotLoggedIn",type:"checkbox"},{text:"welcomeHtmlInsteadOfCommunitiesList",type:"textarea",rows:5},{text:"hideAppBarIfWelcomeHtml",type:"checkbox"}]}),e.push({name:"webApp",icon:"get_app",items:[{text:"appHomeScreenShortName",type:"textfield",maxLength:12},{text:"appHomeScreenIconImageUpload",type:"html",templateData:x`
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
          `}]}),e.push({name:"authApis",icon:"api",items:[{text:"Facebook Client Id",name:"facebookClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_id"),maxLength:60},{text:"Facebook Client Secret",name:"facebookClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_secret"),maxLength:60},{text:"Google Client Id",name:"googleClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_id"),maxLength:60},{text:"Google Client Secret",name:"googleClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_secret"),maxLength:60},{text:"Discord Client Id",name:"discordClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_id"),maxLength:60},{text:"Discord Client Secret",name:"discordClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_secret"),maxLength:60},{text:"Twitter Client Id",name:"twitterClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_id"),maxLength:60},{text:"Twitter Client Secret",name:"twitterClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_secret"),maxLength:60}]}),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};__decorate$d([n$4({type:Number})],YpAdminConfigDomain.prototype,"appHomeScreenIconImageId",void 0),YpAdminConfigDomain=__decorate$d([t$2("yp-admin-config-domain")],YpAdminConfigDomain);var __decorate$c=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminConfigCommunity=class extends YpAdminConfigBase{constructor(){super(),this.hasSamlLoginProvider=!1,this.communityAccess="public",this.hideHostnameInput=!1,this.action="/communities"}_generateRandomHostname(){return"c"+Math.random().toString(36).substr(2,9)}static get styles(){return[super.styles,i$2`
        .accessContainer {
        }

        .accessHeader {
          font-weight: bold;
          margin: 8px;
        }

        label {
          padding: 8px;
        }

        .actionButtonContainer {
          margin-left: 16px;
          margin-top: 16px;
        }

        md-radio {
          margin-right: 4px;
        }
      `]}renderHostname(){return this.hideHostnameInput?x`
        <input
          type="hidden"
          name="hostname"
          value="${o$5(this.collection.hostname)}"
        />
      `:x`
        <div class="layout vertical">
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
      `}renderHeader(){return this.collection?x`
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()}
            <div class="layout vertical">
              ${this.renderNameAndDescription()} ${this.renderHostname()}
            </div>
            <div class="layout vertical center-center">
              <div class="layout horizontal center-center">
                ${this.renderSaveButton()}
              </div>
              <div
                ?hidden="${"new"==this.collectionId}"
                class="actionButtonContainer layout horizontal center-center"
              >
                ${this.renderActionMenu()}
              </div>
              <div class="flex"></div>
            </div>
          </div>
        `:T$1}renderActionMenu(){return x`
      <div style="position: relative;">
        <md-outlined-icon-button
          .ariaLabelSelected="${this.t("actions")}"
          id="menuAnchor"
          type="button"
          @click="${()=>this.$$("#actionMenu").open=!0}"
          ><md-icon>menu</md-icon></md-outlined-icon-button
        >
        <md-menu
          id="actionMenu"
          positioning="popover"
          .menuCorner="${Corner.START_END}"
          anchor="menuAnchor"
        >
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="newCategoryMenuItem"
          >
            <div slot="headline">New Category</div>
          </md-menu-item>
          <md-menu-item @click="${this._menuSelection}" id="deleteMenuItem">
            <div slot="headline">Delete</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="cloneMenuItem"
          >
            <div slot="headline">Clone</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="promotersMenuItem"
          >
            <div slot="headline">Promoters</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="deleteContentMenuItem"
          >
            <div slot="headline">Delete Content</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="anonymizeMenuItem"
          >
            <div slot="headline">Anonymize</div>
          </md-menu-item>
        </md-menu>
      </div>
    `}_onDeleted(){this.dispatchEvent(new CustomEvent("yp-refresh-domain",{bubbles:!0,composed:!0})),YpNavHelpers.redirectTo("/domain/"+this.collection.domain_id)}_openDelete(){window.appGlobals.activity("open","group.delete"),window.appDialogs.getDialogAsync("apiActionDialog",(e=>{e.setup("/api/communities/"+this.collection.id,this.t("communityDeleteConfirmation"),this._onDeleted.bind(this)),e.open({finalDeleteWarning:!0})}))}_menuSelection(e){e.target,this._openDelete()}renderHiddenAccessSettings(){return this.communityAccess?x`
        <input type="hidden" name="${this.communityAccess}" value="on" />
      `:T$1}renderHiddenInputsNotActive(){return x`
      <input type="hidden" name="themeId" value="${o$5(this.themeId)}" />
    `}renderHiddenInputs(){return x`
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$1}
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
          `:T$1}

      <input
        type="hidden"
        name="ssnLoginListDataId"
        value="${o$5(this.ssnLoginListDataId)}"
      />

      <input type="hidden" name="status" value="${this.status||""}" />

      <input
        type="hidden"
        name="is_community_folder"
        value="${o$5(this.collection.is_community_folder)}"
      />

      <input
        type="hidden"
        name="in_community_folder_id"
        value="${o$5(this.inCommunityFolderId)}"
      />

      <input
        type="hidden"
        name="welcomePageId"
        value="${o$5(this.welcomePageId)}"
      />

      <input
        type="hidden"
        name="signupTermsPageId"
        value="${o$5(this.signupTermsPageId)}"
      />

      ${this.renderHiddenAccessSettings()}
    `}_hostnameChanged(){const e=this.$$("#hostname").value;this.hostnameExample=e?e+"."+window.appGlobals.domain.domain_name:"your-hostname.."+window.appGlobals.domain.domain_name,this._configChanged()}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0,this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0,this.inCommunityFolderId=void 0,this.signupTermsPageId=void 0,this.welcomePageId=void 0,this.availableCommunityFolders=void 0,this.$$("#appHomeScreenIconImageUpload").clear()}updated(e){e.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),e.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.CommunityLogoImages,this.currentHeaderImages=this.collection.CommunityHeaderImages,this._communityChanged(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration),super.updated(e)}languageChanged(){this._setupTranslations()}_communityChanged(){this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0&&(this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id),this._getHelpPages("community"),this.collection&&(0===this.collection.access?this.communityAccess="public":1===this.collection.access?this.communityAccess="closed":2===this.collection.access&&(this.communityAccess="secret"),this.collection.status&&(this.status=this.collection.status),this.collection.in_community_folder_id&&(this.inCommunityFolderId=this.collection.in_community_folder_id),this.collection.configuration&&(this.collection.configuration.signupTermsPageId&&(this.signupTermsPageId=this.collection.configuration.signupTermsPageId),this.collection.configuration.welcomePageId&&(this.welcomePageId=this.collection.configuration.welcomePageId))),window.appGlobals.hasVideoUpload?this.hasVideoUpload=!0:this.hasVideoUpload=!1,window.appGlobals.domain&&window.appGlobals.domain.samlLoginProvided?this.hasSamlLoginProvider=!0:this.hasSamlLoginProvider=!1,this.collection&&this.collection.configuration&&this.collection.configuration.ssnLoginListDataId&&(this.ssnLoginListDataId=this.collection.configuration.ssnLoginListDataId,this._getSsnListCount()),this.requestUpdate()}_deleteSsnLoginList(){this.collection&&this.ssnLoginListDataId&&(window.adminServerApi.deleteSsnLoginList(this.collection.id,this.ssnLoginListDataId),this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0)}_ssnLoginListDataUploaded(e){this.ssnLoginListDataId=JSON.parse(e.detail.xhr.response).ssnLoginListDataId,this._getSsnListCount(),this._configChanged()}async _getSsnListCount(){if(this.collection&&this.ssnLoginListDataId){const e=await window.adminServerApi.getSsnListCount(this.collection.id,this.ssnLoginListDataId);this.ssnLoginListDataCount=e.count}}async _collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(this.action=`/communities/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",access:2,status:"active",only_admins_can_create_groups:!0,counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},hostname:"",is_community_folder:"newFolder"==this.collectionId},await this.checkDomainName()):this.action=`/communities/${this.collectionId}`}async checkDomainName(){const e=await window.serverApi.getCollection("domain",this.parentCollectionId);if(this.collection.Domain=e,this.collection&&this.collection.Domain&&this.collection.Domain?.domain_name){this.collection.Domain.domain_name.includes(".")?this.hideHostnameInput=!1:(this.collection.hostname||(this.collection.hostname=this._generateRandomHostname()),this.hideHostnameInput=!0)}}async _checkCommunityFolders(e){let t;t=e.Domain?e.Domain:window.appGlobals.domain;const i=await window.adminServerApi.getCommunityFolders(t.id);var o;i&&this.collection?.id&&(i.forEach(((e,t)=>{e.id==this.collection?.id&&(o=t)})),o&&i.splice(o,1));i&&i.length>0?(i.unshift({id:-1,name:this.t("none")}),this.availableCommunityFolders=i):this.availableCommunityFolders=void 0}_setupTranslations(){"new"==this.collectionId?(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("newCommunityFolder"):this.editHeaderText=this.t("community.new"),this.saveText=this.t("create"),this.toastText=this.t("communityToastCreated")):(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("updateCommunityFolder"):this.editHeaderText=this.t("Update community info"),this.saveText=this.t("save"),this.toastText=this.t("communityToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?t.hostnameTaken?window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("hostnameTaken"),void 0)})):this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},"completeAndAddToCommunity"),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No community found on custom redirect")}_finishRedirect(e){"new"==this.collectionId&&window.appUser.recheckAdminRights(),e.is_community_folder?YpNavHelpers.redirectTo("/community_folder/"+e.id):YpNavHelpers.redirectTo("/community/"+e.id),window.appGlobals.activity("completed","editCommunity")}_accessRadioChanged(e){this.communityAccess=e.target.value,this._configChanged()}_getAccessTab(){return{name:"access",icon:"code",items:[{text:"status",type:"html",templateData:x`
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
          `},{text:"mediaUploads",type:"html",templateData:this.renderHeaderImageUploads()},{text:"alwaysHideLogoImage",type:"checkbox"},{text:"facebookPixelId",type:"textfield",maxLength:40},{text:"redirectToGroupId",type:"textfield",maxLength:40},{text:"defaultLocationLongLat",type:"textfield",maxLength:100,value:this.collection.defaultLocationLongLat},{text:"inCommunityFolder",type:"html",templateData:x`
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
                `:T$1}
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
                `:T$1}
          `}]}}setupConfigTabs(){const e=[];return e.push(this._getAccessTab()),e.push(this._getBasicTab()),e.push(this._getLookAndFeelTab()),e.push(this._getWebAppTab()),e.push(this._getSamlTab()),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"appHomeScreenIconImageId",void 0),__decorate$c([n$4({type:String})],YpAdminConfigCommunity.prototype,"hostnameExample",void 0),__decorate$c([n$4({type:Boolean})],YpAdminConfigCommunity.prototype,"hasSamlLoginProvider",void 0),__decorate$c([n$4({type:Array})],YpAdminConfigCommunity.prototype,"availableCommunityFolders",void 0),__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataId",void 0),__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataCount",void 0),__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"inCommunityFolderId",void 0),__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"signupTermsPageId",void 0),__decorate$c([n$4({type:Number})],YpAdminConfigCommunity.prototype,"welcomePageId",void 0),__decorate$c([n$4({type:String})],YpAdminConfigCommunity.prototype,"communityAccess",void 0),__decorate$c([n$4({type:Boolean})],YpAdminConfigCommunity.prototype,"hideHostnameInput",void 0),YpAdminConfigCommunity=__decorate$c([t$2("yp-admin-config-community")],YpAdminConfigCommunity);var __decorate$b=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminHtmlEditor=class extends YpBaseElement{constructor(){super(...arguments),this.content="",this.media=[],this.selectedTab=0,this.mediaLoaded={},this.generatingAiImageInBackground=!1,this.hasVideoUpload=!1,this.browserPreviewType="desktop",this.imageIdsUploadedByUser=[],this.videoIdsUploadedByUser=[]}_selectTab(e){this.selectedTab=e.currentTarget.activeTabIndex}getConfiguration(){return console.log(JSON.stringify({content:this.content,media:this.media})),{content:this.content,media:this.media}}connectedCallback(){super.connectedCallback(),this.addGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),window.appGlobals.hasVideoUpload&&(this.hasVideoUpload=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0}))}static get styles(){return[super.styles,i$2`
        md-tabs {
          width: 100%;
          margin-bottom: 16px;
        }

        .previewTypeRadios {
          margin: 16px;
        }

        .deleteMediaButton {
          top: 4px;
          left: 4px;
          position: absolute;
        }

        .insertMediaButton {
          bottom: 4px;
          right: 4px;
          position: absolute;
        }

        .mediaHeader {
          font-size: 20px;
          margin: 24px;
          margin-bottom: 8px;
        }

        .uploadIcon {
          margin-left: 4px;
          margin-right: 4px;
        }

        .videoUploadIcon {
          margin-top: 16px;
        }

        .previewHtml {
          width: 100%;
          height: 100%;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          margin-top: 16px;
        }

        .previewHtml[mobile-view] {
          width: 360px;
          max-width: 360px;
          height: 100%;
        }

        .mediaContainer {
          position: relative;
          height: 150px;
          max-height: 150px;
          margin: 16px;
          background-color: var(--md-sys-color-surface-variant);
        }

        .mediaImage,
        .mediaVideo {
          max-width: 100%;
          max-height: 150px;
        }

        md-filled-icon-button {
          margin: 4px;
        }
      `]}_generateLogo(e){e.preventDefault(),e.stopPropagation(),this.requestUpdate();this.$$("#aiImageGenerator").open()}firstUpdated(e){}renderAiImageGenerator(){return x`<yp-generate-ai-image
      id="aiImageGenerator"
      .collectionType="${"new"===this.collectionId?"community":"group"}"
      .collectionId="${"new"===this.collectionId?this.parentCollectionId:this.group.id}"
      disableBackgroundGeneration
      @got-image="${this._gotAiImage}"
    >
    </yp-generate-ai-image>`}_setMediaLoaded(e,t){this.mediaLoaded={...this.mediaLoaded,[e]:t},this.requestUpdate()}_logoImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);const i=t.id,o=JSON.parse(t.formats)[0];o?(this.media.push({id:i,type:"image",url:o}),this.imageIdsUploadedByUser.push(i),this.requestUpdate(),this.contentChanged()):console.error("No image url in response")}_gotAiImage(e){const t=e.detail.imageUrl;if(t){const i=e.detail.imageId;this.media.push({id:i,type:"image",url:t}),this.imageIdsUploadedByUser.push(i),this.requestUpdate(),this.contentChanged()}else console.error("No image url in response")}_removeHtmlTag(e,t){if("image"===t){const t=new RegExp(`<img[^>]+src=["']${e}["'][^>]*>`,"gi");this.content=this.content.replace(t,"")}else if("video"===t){const t=new RegExp(`<video[^>]*>\\s*<source[^>]+src=["']${e}["'][^>]*>\\s*</video>`,"gi");this.content=this.content.replace(t,"")}this.contentChanged()}_videoUploaded(e){const t=e.detail.videoId,i=e.detail.detail.videoUrl;i?(this.media.push({id:t,type:"video",url:i}),this.videoIdsUploadedByUser.push(t),this.requestUpdate(),this.contentChanged()):console.error("No video url in response")}async reallyDeleteCurrentLogoImage(){if(this.mediaIdToDelete){await window.adminServerApi.deleteImage(this.mediaIdToDelete,"group",this.collectionId,this.imageIdsUploadedByUser.includes(this.mediaIdToDelete),!0);const e=this.media.find((e=>e.id===this.mediaIdToDelete));this._removeHtmlTag(e.url,e.type),this.media=this.media.filter((e=>e.id!==this.mediaIdToDelete)),this.imageIdsUploadedByUser=this.imageIdsUploadedByUser.filter((e=>e!==this.mediaIdToDelete)),this.mediaIdToDelete=void 0,this.contentChanged()}else console.warn("No image to delete")}async reallyDeleteCurrentVideo(){if(this.mediaIdToDelete){await window.adminServerApi.deleteVideo(this.mediaIdToDelete,"group",this.collectionId,this.videoIdsUploadedByUser.includes(this.mediaIdToDelete),!0);const e=this.media.find((e=>e.id===this.mediaIdToDelete));this._removeHtmlTag(e.url,e.type),this.media=this.media.filter((e=>e.id!==this.mediaIdToDelete)),this.videoIdsUploadedByUser=this.videoIdsUploadedByUser.filter((e=>e!==this.mediaIdToDelete)),this.mediaIdToDelete=void 0,this.contentChanged()}else console.warn("No video to delete")}deleteCurrentLogoImage(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteLogoImage"),this.reallyDeleteCurrentLogoImage.bind(this))}))}deleteCurrentVideo(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("confirmDeleteVideo"),this.reallyDeleteCurrentVideo.bind(this))}))}_removeMedia(e){this.mediaIdToDelete=e.id,"image"===e.type?this.deleteCurrentLogoImage():"video"===e.type&&this.deleteCurrentVideo(),this.debouncedSave()}renderMedia(){return x`
      ${this.renderImageUploadOptions()}

      <div class="layout horizontal wrap">
        ${this.media.map((e=>x`
            ${e.url?x`
                  <div class="mediaContainer">
                    ${"image"===e.type?x`
                          <img
                            class="mediaImage"
                            src="${e.url}"
                            @load="${()=>this._setMediaLoaded(e.id,!0)}"
                            @error="${()=>this._setMediaLoaded(e.id,!1)}"
                          />
                        `:"video"===e.type?x`
                          <video
                            class="mediaVideo"
                            controls
                            @loadedmetadata="${()=>this._setMediaLoaded(e.id,!0)}"
                            @error="${()=>this._setMediaLoaded(e.id,!1)}"
                          >
                            <source src="${e.url}" type="video/mp4" />
                          </video>
                        `:T$1}
                    <div
                      style="display: ${this.mediaLoaded[e.id]?"flex":"none"};"
                    >
                      <md-filled-tonal-icon-button
                        class="deleteMediaButton"
                        @click="${()=>this._removeMedia(e)}"
                        title="${this.t("deleteMedia")}"
                      >
                        <md-icon>delete</md-icon>
                      </md-filled-tonal-icon-button>
                      <md-filled-icon-button
                        class="insertMediaButton"
                        @click="${()=>this._insertMediaIntoHtml(e)}"
                        title="${this.t("insertMedia")}"
                      >
                        <md-icon>post_add</md-icon>
                      </md-filled-icon-button>
                    </div>
                  </div>
                `:T$1}
          `))}
      </div>
    `}_insertMediaIntoHtml(e){if("image"===e.type){const t=`<img src="${e.url}" alt="" style="width:300px;"/>\n`;this.content=t+this.content,this.contentChanged()}else if("video"===e.type){const t=`<video controls style="width:300px;"><source src="${e.url}" type="video/mp4"/></video>\n`;this.content=t+this.content,this.contentChanged()}this.requestUpdate()}contentChanged(){this.fire("configuration-changed"),this.debouncedSave()}renderImageUploadOptions(){return x`
      <div class="layout vertical logoImagePlaceholder">
        <div class="layout horizontal center-center logoUploadButtons">
          <yp-file-upload
            id="logoImageUpload"
            raised
            hideStatus
            class="uploadIcon"
            useIconButton
            target="/api/images?itemType=group-html-media"
            method="POST"
            buttonIcon="photo_camera"
            .buttonText="${this.t("image.logo.upload")}"
            @success="${this._logoImageUploaded}"
          >
          </yp-file-upload>
          <div class="aiGenerationIconContainer uploadIcon">
            <md-filled-icon-button
              ?hidden="${!this.hasLlm}"
              id="generateButton"
              @click="${this._generateLogo}"
              ><md-icon>smart_toy</md-icon></md-filled-icon-button
            >
          </div>

          <yp-file-upload
            ?hidden="${!this.hasVideoUpload}"
            id="videoFileUpload"
            raised
            useIconButton
            videoUpload
            autoChooseFirstVideoFrameAsPost
            class="uploadIcon videoUploadIcon"
            method="POST"
            buttonIcon="videocam"
            .buttonText="${this.t("uploadVideo")}"
            @success="${this._videoUploaded}"
          >
          </yp-file-upload>
        </div>
      </div>
    `}render(){return x`
      <div class="layout vertical center-center">
        <md-tabs
          @change="${this._selectTab}"
          .activeTabIndex="${this.selectedTab}"
        >
          <md-primary-tab
            >${this.t("simpleHtmlEditor")}
            <md-icon slot="icon">edit_note</md-icon></md-primary-tab
          >
          <md-primary-tab
            >${this.t("editHtmlDirectly")}
            <md-icon slot="icon">html</md-icon></md-primary-tab
          >
          <md-primary-tab
            >${this.t("previewHtml")}
            <md-icon slot="icon">preview</md-icon></md-primary-tab
          >
        </md-tabs>
      </div>

      ${0===this.selectedTab?x`
            <yp-simple-html-editor
              .value="${this.content}"
              @change="${this.changed}"
            ></yp-simple-html-editor>
          `:T$1}
      ${1===this.selectedTab?x`
            <md-filled-text-field
              data-type="text"
              type="textarea"
              .label="${this.t("editHtmlDirectly")}"
              .value="${this.content}"
              minlength="2"
              @change="${this.changed}"
              rows="14"
              style="width: 100%;--md-filled-field-container-color: var(--md-sys-color-surface);"
            >
            </md-filled-text-field>
          `:T$1}
      ${2===this.selectedTab?x` <div
              hidden
              class="layout vertical center-center previewTypeRadios"
            >
              <label>
                <md-radio
                  name="browserPreviewType"
                  @click="${()=>this.browserPreviewType="desktop"}"
                  ?checked="${"desktop"===this.browserPreviewType}"
                ></md-radio>
                ${this.t("sendInviteByEmail")}</label
              ><label>
                <md-radio
                  name="browserPreviewType"
                  @click="${()=>this.browserPreviewType="mobile"}"
                  ?checked="${"mobile"===this.browserPreviewType}"
                ></md-radio
                >${this.t("addUserDirectlyIfExist")}</label
              >
            </div>
            <div
              class="previewHtml"
              ?mobile-view=${"mobile"===this.browserPreviewType}
            >
              ${o$4(this.content)}
            </div>`:T$1}

      <div class="layout horizontal center-center">
        <div class="mediaHeader">${this.t("addMedia")}</div>
      </div>
      ${this.renderMedia()} ${this.renderAiImageGenerator()}
    `}changed(e){e.currentTarget?this.content=e.currentTarget.value:this.content=e.detail.value,this.contentChanged()}debouncedSave(){this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout((()=>{}),1e4)}};__decorate$b([n$4({type:String})],YpAdminHtmlEditor.prototype,"content",void 0),__decorate$b([n$4({type:Array})],YpAdminHtmlEditor.prototype,"media",void 0),__decorate$b([n$4({type:Number})],YpAdminHtmlEditor.prototype,"selectedTab",void 0),__decorate$b([r$3()],YpAdminHtmlEditor.prototype,"mediaLoaded",void 0),__decorate$b([n$4({type:Boolean})],YpAdminHtmlEditor.prototype,"generatingAiImageInBackground",void 0),__decorate$b([n$4({type:Object})],YpAdminHtmlEditor.prototype,"group",void 0),__decorate$b([n$4({type:Number})],YpAdminHtmlEditor.prototype,"parentCollectionId",void 0),__decorate$b([n$4({type:Number})],YpAdminHtmlEditor.prototype,"mediaIdToDelete",void 0),__decorate$b([n$4({type:String})],YpAdminHtmlEditor.prototype,"collectionId",void 0),__decorate$b([n$4({type:Boolean})],YpAdminHtmlEditor.prototype,"hasVideoUpload",void 0),__decorate$b([n$4({type:String})],YpAdminHtmlEditor.prototype,"browserPreviewType",void 0),__decorate$b([n$4({type:Array})],YpAdminHtmlEditor.prototype,"imageIdsUploadedByUser",void 0),__decorate$b([n$4({type:Array})],YpAdminHtmlEditor.prototype,"videoIdsUploadedByUser",void 0),YpAdminHtmlEditor=__decorate$b([t$2("yp-admin-html-editor")],YpAdminHtmlEditor);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles$5=i$2`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}
`,chipBaseClass=mixinDelegatesAria(s$4);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Chip extends chipBaseClass{get rippleDisabled(){return this.disabled||this.softDisabled}constructor(){super(),this.disabled=!1,this.softDisabled=!1,this.alwaysFocusable=!1,this.label="",this.hasIcon=!1,this.addEventListener("click",this.handleClick.bind(this))}focus(e){this.disabled&&!this.alwaysFocusable||super.focus(e)}render(){return x`
      <div class="container ${e$4(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `}updated(e){e.has("disabled")&&void 0!==e.get("disabled")&&this.dispatchEvent(new Event("update-focus",{bubbles:!0}))}getContainerClasses(){return{disabled:this.disabled||this.softDisabled,"has-icon":this.hasIcon}}renderContainerContent(){return x`
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
      <span class="label">
        <span class="label-text" id="label">
          ${this.label?this.label:x`<slot></slot>`}
        </span>
      </span>
      <span class="touch"></span>
    `}handleIconChange(e){const t=e.target;this.hasIcon=t.assignedElements({flatten:!0}).length>0}handleClick(e){if(this.softDisabled||this.disabled&&this.alwaysFocusable)return e.stopImmediatePropagation(),void e.preventDefault()}}Chip.shadowRootOptions={...s$4.shadowRootOptions,delegatesFocus:!0},__decorate$j([n$4({type:Boolean,reflect:!0})],Chip.prototype,"disabled",void 0),__decorate$j([n$4({type:Boolean,attribute:"soft-disabled",reflect:!0})],Chip.prototype,"softDisabled",void 0),__decorate$j([n$4({type:Boolean,attribute:"always-focusable"})],Chip.prototype,"alwaysFocusable",void 0),__decorate$j([n$4()],Chip.prototype,"label",void 0),__decorate$j([n$4({type:Boolean,reflect:!0,attribute:"has-icon"})],Chip.prototype,"hasIcon",void 0);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ARIA_LABEL_REMOVE="aria-label-remove";class MultiActionChip extends Chip{get ariaLabelRemove(){if(this.hasAttribute(ARIA_LABEL_REMOVE))return this.getAttribute(ARIA_LABEL_REMOVE);const{ariaLabel:e}=this;return e||this.label?`Remove ${e||this.label}`:null}set ariaLabelRemove(e){e!==this.ariaLabelRemove&&(null===e?this.removeAttribute(ARIA_LABEL_REMOVE):this.setAttribute(ARIA_LABEL_REMOVE,e),this.requestUpdate())}constructor(){super(),this.handleTrailingActionFocus=this.handleTrailingActionFocus.bind(this),this.addEventListener("keydown",this.handleKeyDown.bind(this))}focus(e){(this.alwaysFocusable||!this.disabled)&&e?.trailing&&this.trailingAction?this.trailingAction.focus(e):super.focus(e)}renderContainerContent(){return x`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `}handleKeyDown(e){const t="ArrowLeft"===e.key,i="ArrowRight"===e.key;if(!t&&!i)return;if(!this.primaryAction||!this.trailingAction)return;const o="rtl"===getComputedStyle(this).direction?t:i,n=this.primaryAction?.matches(":focus-within"),a=this.trailingAction?.matches(":focus-within");if(o&&a||!o&&n)return;e.preventDefault(),e.stopPropagation();(o?this.trailingAction:this.primaryAction).focus()}handleTrailingActionFocus(){const{primaryAction:e,trailingAction:t}=this;e&&t&&(e.tabIndex=-1,t.addEventListener("focusout",(()=>{e.tabIndex=0}),{once:!0}))}}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function renderRemoveButton({ariaLabel:e,disabled:t,focusListener:i,tabbable:o=!1}){return x`
    <span id="remove-label" hidden aria-hidden="true">Remove</span>
    <button
      class="trailing action"
      aria-label=${e||T$1}
      aria-labelledby=${e?T$1:"remove-label label"}
      tabindex=${o?T$1:-1}
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
  `}function handleRemoveClick(e){if(this.disabled||this.softDisabled)return;e.stopPropagation();!this.dispatchEvent(new Event("remove",{cancelable:!0}))||this.remove()}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class FilterChip extends MultiActionChip{constructor(){super(...arguments),this.elevated=!1,this.removable=!1,this.selected=!1,this.hasSelectedIcon=!1}get primaryId(){return"button"}getContainerClasses(){return{...super.getContainerClasses(),elevated:this.elevated,selected:this.selected,"has-trailing":this.removable,"has-icon":this.hasIcon||this.selected}}renderPrimaryAction(e){const{ariaLabel:t}=this;return x`
      <button
        class="primary action"
        id="button"
        aria-label=${t||T$1}
        aria-pressed=${this.selected}
        aria-disabled=${this.softDisabled||T$1}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        @click=${this.handleClickOnChild}
        >${e}</button
      >
    `}renderLeadingIcon(){return this.selected?x`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `:super.renderLeadingIcon()}renderTrailingAction(e){return this.removable?renderRemoveButton({focusListener:e,ariaLabel:this.ariaLabelRemove,disabled:this.disabled||this.softDisabled}):T$1}renderOutline(){return this.elevated?x`<md-elevation part="elevation"></md-elevation>`:super.renderOutline()}handleClickOnChild(e){if(this.disabled||this.softDisabled)return;const t=this.selected;this.selected=!this.selected;!redispatchEvent(this,e)&&(this.selected=t)}}__decorate$j([n$4({type:Boolean})],FilterChip.prototype,"elevated",void 0),__decorate$j([n$4({type:Boolean})],FilterChip.prototype,"removable",void 0),__decorate$j([n$4({type:Boolean,reflect:!0})],FilterChip.prototype,"selected",void 0),__decorate$j([n$4({type:Boolean,reflect:!0,attribute:"has-selected-icon"})],FilterChip.prototype,"hasSelectedIcon",void 0),__decorate$j([e$3(".primary.action")],FilterChip.prototype,"primaryAction",void 0),__decorate$j([e$3(".trailing.action")],FilterChip.prototype,"trailingAction",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles$4=i$2`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}
`,styles$3=i$2`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}
`,styles$2=i$2`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host(:is([disabled],[soft-disabled])){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{min-width:0;padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);font-weight:var(--_label-text-weight);height:100%;line-height:var(--_label-text-line-height);overflow:hidden;user-select:none}.label-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button{text-transform:inherit}a,button:not(:disabled,[aria-disabled=true]){cursor:inherit}
`,styles$1=i$2`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}
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
 */let MdFilterChip=class extends FilterChip{};MdFilterChip.styles=[styles$2,styles$5,styles$1,styles$3,styles$4],MdFilterChip=__decorate$j([t$2("md-filter-chip")],MdFilterChip);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ChipSet extends s$4{get chips(){return this.childElements.filter((e=>e instanceof Chip))}constructor(){super(),this.internals=this.attachInternals(),this.addEventListener("focusin",this.updateTabIndices.bind(this)),this.addEventListener("update-focus",this.updateTabIndices.bind(this)),this.addEventListener("keydown",this.handleKeyDown.bind(this)),this.internals.role="toolbar"}render(){return x`<slot @slotchange=${this.updateTabIndices}></slot>`}handleKeyDown(e){const t="ArrowLeft"===e.key,i="ArrowRight"===e.key,o="Home"===e.key,n="End"===e.key;if(!(t||i||o||n))return;const{chips:a}=this;if(a.length<2)return;if(e.preventDefault(),o||n){return a[o?0:a.length-1].focus({trailing:n}),void this.updateTabIndices()}const r="rtl"===getComputedStyle(this).direction?t:i,s=a.find((e=>e.matches(":focus-within")));if(!s){return(r?a[0]:a[a.length-1]).focus({trailing:!r}),void this.updateTabIndices()}const d=a.indexOf(s);let l=r?d+1:d-1;for(;l!==d;){l>=a.length?l=0:l<0&&(l=a.length-1);const e=a[l];if(!e.disabled||e.alwaysFocusable){e.focus({trailing:!r}),this.updateTabIndices();break}r?l++:l--}}updateTabIndices(){const{chips:e}=this;let t;for(const i of e){const e=i.alwaysFocusable||!i.disabled;i.matches(":focus-within")&&e?t=i:(e&&!t&&(t=i),i.tabIndex=-1)}t&&(t.tabIndex=0)}}__decorate$j([o$6()],ChipSet.prototype,"childElements",void 0);
/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const styles=i$2`:host{display:flex;flex-wrap:wrap;gap:8px}
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let MdChipSet=class extends ChipSet{};MdChipSet.styles=[styles],MdChipSet=__decorate$j([t$2("md-chip-set")],MdChipSet);var __decorate$a=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let AoiEarlIdeasEditor=class extends YpStreamingLlmBase{constructor(){super(),this.openForAnswers=!1,this.isGeneratingWithAi=!1,this.isSubmittingIdeas=!1,this.isFetchingChoices=!1,this.currentIdeasFilter="latest",this.scrollElementSelector="#answers",this.serverApi=new AoiAdminServerApi,this.shouldContinueGenerating=!0,this.currentGeneratingIndex=void 0}connectedCallback(){this.createGroupObserver(),this.setupBootListener(),this.imageGenerator=new AoiGenerateAiLogos(this.themeColor),this.configuration.earl&&this.configuration.earl.question_id?(this.disableWebsockets=!0,this.isCreatingIdeas=!1,this.getChoices()):this.isCreatingIdeas=!0,super.connectedCallback(),this.addEventListener("yp-ws-closed",this.socketClosed),this.addEventListener("yp-ws-error",this.socketError),this.addGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this))}disconnectedCallback(){this.removeEventListener("yp-ws-closed",this.socketClosed),this.removeEventListener("yp-ws-error",this.socketError),this.removeGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this)),super.disconnectedCallback()}themeUpdated(e){this.imageGenerator=new AoiGenerateAiLogos(e.detail.oneDynamicColor||e.detail.primaryColor||this.themeColor),this.requestUpdate()}socketClosed(){this.isGeneratingWithAi=!1}socketError(){this.isGeneratingWithAi=!1}async getChoices(){this.choices=await this.serverApi.getChoices(this.domainId,this.communityId,this.configuration.earl.question_id)}createGroupObserver(){const e={set:(e,t,i,o)=>(console.error(`Property ${String(t)} set to`,i),this.handleGroupChange(),Reflect.set(e,t,i,o))};this.group=new Proxy(this.group,e)}handleGroupChange(){console.error("Group changed",this.group)}async addChatBotElement(e){switch(e.type){case"start":case"moderation_error":break;case"error":this.isGeneratingWithAi=!1;break;case"end":this.isGeneratingWithAi=!1,this.answersElement.value+="\n";break;case"stream":if(e.message&&"undefined"!=e.message){this.answersElement.value+=e.message,this.answersElement.value=this.answersElement.value.replace(/\n\n/g,"\n");break}console.warn("stream message is undefined")}this.scrollDown()}get answers(){return this.$$("#answers")?.value.split("\n").map((e=>e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"))).filter((e=>e.length>0))}hasMoreThanOneIdea(){}openMenuFor(e){console.log("openMenuFor",e)}generateIdeas(){this.isGeneratingWithAi=!0;try{this.serverApi.startGenerateIdeas(this.configuration.earl.question.name,this.domainId,this.communityId,this.wsClientId,this.answers)}catch(e){console.error(e)}}async submitIdeasForCreation(){this.isSubmittingIdeas=!0;try{const{question_id:e}=await this.serverApi.submitIdeasForCreation(this.domainId,this.communityId,this.answers,this.configuration.earl.question.name);this.configuration.earl.question_id=e,this.configuration.earl.active=!0,this.configuration.earl.configuration||(this.configuration.earl.configuration={}),this.configuration.earl.question||(this.configuration.earl.question={}),this.configuration.earl.question.id=e,this.fire("configuration-changed",this.configuration),this.requestUpdate(),this.getChoices()}catch(e){console.error(e)}finally{this.isSubmittingIdeas=!1}}toggleIdeaActivity(e){return async()=>{this.isTogglingIdeaActive=e.id;try{e.active=!e.active,await this.serverApi.updateActive(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,e.active)}catch(e){console.error(e)}finally{this.isTogglingIdeaActive=void 0}this.requestUpdate()}}applyFilter(e){this.currentIdeasFilter=e}get sortedChoices(){if(this.choices)switch(this.currentIdeasFilter){case"latest":return this.choices.sort(((e,t)=>t.id-e.id));case"highestScore":return this.choices.sort(((e,t)=>t.score-e.score));case"activeDeactive":return this.choices.sort(((e,t)=>t.active<e.active?-1:t.active>e.active?1:0))}}updated(e){super.updated(e)}async generateAiIcons(){this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let e=0;e<this.choices.length&&this.shouldContinueGenerating;e+=5){const t=[];for(let i=e;i<e+5&&i<this.choices.length;i++){const e=this.choices[i];if(e.data?.imageUrl)continue;const o=new AoiGenerateAiLogos(this.themeColor);this.communityId?(o.collectionType="community",o.collectionId=this.communityId):this.domainId&&(o.collectionType="domain",o.collectionId=this.domainId),e.data.isGeneratingImage=!0,this.requestUpdate();const n=o.generateIcon(e.data.content,this.$$("#aiStyleInput").value).then((t=>{if(e.data.isGeneratingImage=void 0,t.error)console.error(t.error);else if(this.shouldContinueGenerating)return t.imageUrl?this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,{content:e.data.content,imageUrl:t.imageUrl,choiceId:e.id}).then((()=>{e.data.imageUrl=t.imageUrl,this.requestUpdate()})):void 0})).catch((t=>{e.data.isGeneratingImage=!1,console.error(t)}));t.push(n)}await Promise.all(t)}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}async generateAiIconsOld(){this.imageGenerator.collectionType="community",this.imageGenerator.collectionId=this.communityId,this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let e=0;e<this.choices.length&&this.shouldContinueGenerating;e++){const t=this.choices[e];if(!t.data?.imageUrl){this.currentGeneratingIndex=e;try{t.data.isGeneratingImage=!0;const{imageUrl:e,error:i}=await this.imageGenerator.generateIcon(t.data.content,this.$$("#aiStyleInput").value);if(t.data.isGeneratingImage=void 0,i){console.error(i);continue}if(!this.shouldContinueGenerating)break;await this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,t.id,{content:t.data.content,imageUrl:e,choiceId:t.id}),t.data.imageUrl=e,console.error("imageUrl",e,"error",i),this.requestUpdate()}catch(e){t.data.isGeneratingImage=!1,console.error(e)}}}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}stopGenerating(){this.shouldContinueGenerating=!1,this.isGeneratingWithAi=!1,this.choices&&void 0!==this.currentGeneratingIndex&&(this.choices[this.currentGeneratingIndex].data.isGeneratingImage=!1,this.requestUpdate())}get allChoicesHaveIcons(){return this.choices?.every((e=>e.data.imageUrl))}async deleteImageUrl(e){e.data.imageUrl=void 0,await this.serverApi.updateChoice(this.domainId,this.communityId,this.configuration.earl.question_id,e.id,{content:e.data.content,imageUrl:void 0,choiceId:e.id}),this.requestUpdate()}static get styles(){return[super.styles,i$2`
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
          white-space: normal;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        @supports (white-space: collapse balance) {
          .iconContainer md-elevated-button {
            white-space: collapse balance;
          }
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
          ${o$4(this.t("generateAnswersInfo"))}
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
      />`:T$1}aiStyleChanged(){this.group.configuration.theme||(this.group.configuration.theme={}),this.fire("theme-config-changed",{iconPrompt:this.aiStyleInputElement?.value})}renderAnswerData(e){return x`
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
    `}render(){return this.choices?this.renderEditIdeas():this.renderCreateIdeas()}};__decorate$a([n$4({type:Number})],AoiEarlIdeasEditor.prototype,"groupId",void 0),__decorate$a([n$4({type:Number})],AoiEarlIdeasEditor.prototype,"communityId",void 0),__decorate$a([n$4({type:Boolean})],AoiEarlIdeasEditor.prototype,"openForAnswers",void 0),__decorate$a([n$4({type:Number})],AoiEarlIdeasEditor.prototype,"domainId",void 0),__decorate$a([n$4({type:Object})],AoiEarlIdeasEditor.prototype,"configuration",void 0),__decorate$a([n$4({type:Boolean})],AoiEarlIdeasEditor.prototype,"isCreatingIdeas",void 0),__decorate$a([n$4({type:Array})],AoiEarlIdeasEditor.prototype,"choices",void 0),__decorate$a([n$4({type:Boolean})],AoiEarlIdeasEditor.prototype,"isGeneratingWithAi",void 0),__decorate$a([n$4({type:Boolean})],AoiEarlIdeasEditor.prototype,"isSubmittingIdeas",void 0),__decorate$a([n$4({type:Number})],AoiEarlIdeasEditor.prototype,"isTogglingIdeaActive",void 0),__decorate$a([n$4({type:Boolean})],AoiEarlIdeasEditor.prototype,"isFetchingChoices",void 0),__decorate$a([n$4({type:Object})],AoiEarlIdeasEditor.prototype,"group",void 0),__decorate$a([e$3("#aiStyleInput")],AoiEarlIdeasEditor.prototype,"aiStyleInputElement",void 0),__decorate$a([n$4({type:String})],AoiEarlIdeasEditor.prototype,"currentIdeasFilter",void 0),__decorate$a([e$3("#answers")],AoiEarlIdeasEditor.prototype,"answersElement",void 0),AoiEarlIdeasEditor=__decorate$a([t$2("aoi-earl-ideas-editor")],AoiEarlIdeasEditor);var __decorate$9=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r},YpAdminConfigGroup_1;const defaultModerationPrompt="Only allow ideas that are relevant to the question.",defaultAiAnalysisJson={analyses:[{ideasLabel:"Three most popular ideas",ideasIdsRange:3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]},{ideasLabel:"Three least popular ideas",ideasIdsRange:-3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]}]};let YpAdminConfigGroup=YpAdminConfigGroup_1=class extends YpAdminConfigBase{constructor(){super(),this.groupAccess="open_to_community",this.groupTypeIndex=0,this.endorsementButtonsDisabled=!1,this.questionNameHasChanged=!1,this.groupTypeOptions=["ideaGenerationGroupType","allOurIdeasGroupType","htmlContentGroupType","policySynthAgentsWorkflow"],this.groupAccessOptions={0:"public",1:"closed",2:"secret",3:"open_to_community"},this.action="/groups",this.group=this.collection,this.group&&!this.group.configuration&&(this.group.configuration={})}static get styles(){return[super.styles,i$2`
        .mainImage {
          width: 432px;
          height: 243px;
        }

        yp-admin-html-editor {
        }

        .socialMediaCreateInfo {
          font-size: 12px;
          font-style: italic;
          text-align: center;
          padding: 8px;
          max-width: 425px;
        }

        .aboutAccess {
          font-size: 14px;
          padding: 8px;
          margin-top: -24px;
          font-style: italic;
          max-width: 600px;
        }

        .actionButtonContainer {
          margin-left: 16px;
          margin-top: 16px;
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
            <div class="layout vertical center-center">
              <div class="layout horizontal center-center">
                ${this.renderSaveButton()}
              </div>
              <div
                ?hidden="${"new"==this.collectionId}"
                class="actionButtonContainer layout horizontal center-center"
              >
                ${this.renderActionMenu()}
              </div>
              <div class="flex"></div>
            </div>
          </div>
          <input
            type="hidden"
            name="appHomeScreenIconImageId"
            value="${this.appHomeScreenIconImageId?.toString()||""}"
          />
        `:T$1}getAccessTokenName(){return"open_to_community"==this.groupAccess||"public"==this.groupAccess?"open_to_community":"secret"}renderHiddenInputs(){return x`
      ${this.collection?.configuration.theme?x`
            <input
              type="hidden"
              name="theme"
              value="${JSON.stringify(this.collection?.configuration.theme)}"
            />
          `:T$1}
      <input
        type="hidden"
        name="objectives"
        value="${this.collection?.description}"
      />

      ${window.appGlobals.originalQueryParameters.createCommunityForGroup?x`
            <input type="hidden" name="createCommunityForGroup" value="true" />
          `:T$1}
      ${(this.collection?.configuration).ltp?x`
            <input
              type="hidden"
              name="ltp"
              value="${JSON.stringify((this.collection?.configuration).ltp)}"
            />
          `:T$1}
      ${(this.collection?.configuration).allOurIdeas?x`
            <input
              type="hidden"
              name="allOurIdeas"
              value="${JSON.stringify((this.collection?.configuration).allOurIdeas)}"
            />
          `:T$1}
      ${(this.collection?.configuration).staticHtml?x`
            <input
              type="hidden"
              name="staticHtml"
              value="${JSON.stringify((this.collection?.configuration).staticHtml)}"
            />
          `:T$1}

      <input type="hidden" name="${this.getAccessTokenName()}" value="1" />

      <input type="hidden" name="groupType" value="${this.groupTypeIndex}" />

      <input type="hidden" name="status" value="${this.status||""}" />

      ${this.endorsementButtons?x`
            <input
              type="hidden"
              name="endorsementButtons"
              value="${this.endorsementButtons}"
            />
          `:T$1}
      ${this.detectedThemeColor?x`<input
            type="hidden"
            name="themeColor"
            value="${this.detectedThemeColor}"
          />`:T$1}
    `}_descriptionChanged(e){const t=e.target.value;this.group.description=t,this.group.objectives=t,super._descriptionChanged(e),this._configChanged()}connectedCallback(){super.connectedCallback(),this.group=this.collection,this.group&&!this.group.configuration&&(this.group.configuration={})}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(e){e.has("collection")&&this.collection&&(this.group=this.collection,this.group&&!this.group.configuration&&(this.group.configuration={}),this.currentLogoImages=this.collection.GroupLogoImages,this.currentHeaderImages=this.collection.GroupHeaderImages,this.collection.description=this.group.objectives,this.group.description=this.group.objectives,this.groupAccess=this.groupAccessOptions[this.group.access],this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.configuration.allOurIdeas&&this.collection.configuration.allOurIdeas.earl&&this.collection.configuration.allOurIdeas.earl.question&&(this.aoiQuestionName=this.collection.configuration.allOurIdeas.earl.question.name),this.groupTypeIndex=this.group.configuration.groupType||0,this.endorsementButtons=this.group.configuration.endorsementButtons,this.collection.status&&(this.status=this.collection.status),this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0?this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id:this.collection.GroupLogoVideos&&this.collection.GroupLogoVideos.length>0&&(this.uploadedVideoId=this.collection.GroupLogoVideos[0].id)),e.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(e)}async _collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(window.appGlobals.originalQueryParameters.createCommunityForGroup?(this.parentCollectionId=window.appGlobals.domain.id,this.action=`/groups/${this.parentCollectionId}/create_community_for_group`):this.action=`/groups/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",objectives:void 0,access:3,status:"hidden",counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},community_id:this.parentCollectionId,hostname:"",is_group_folder:"newFolder"==this.collectionId},this.group=this.collection):this.action=`/groups/${this.collectionId}`}_setupTranslations(){"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(e){super._formResponse(e);const t=e.detail;t?this.uploadedVideoId&&this.connectedVideoToCollection?(await window.adminServerApi.addVideoToCollection(t.id,{videoId:this.uploadedVideoId},this.collectionType),this._finishRedirect(t)):this._finishRedirect(t):console.warn("No domain found on custom redirect")}_finishRedirect(e){YpNavHelpers.redirectTo("/group/"+e.id),window.appGlobals.activity("completed","editGroup")}_getAccessTab(){const e="new"==this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup,t={name:"access",icon:"code",items:[{text:"groupAccess",type:"html",templateData:x`
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
          `}]};return this.groupTypeIndex!==YpAdminConfigGroup_1.GroupType.allOurIdeas&&this.groupTypeIndex!==YpAdminConfigGroup_1.GroupType.htmlContent&&t.items.concat([{text:"allowAnonymousUsers",type:"checkbox",value:this.group.configuration.allowAnonymousUsers,translationToken:"allowAnonymousUsers"},{text:"anonymousAskRegistrationQuestions",type:"checkbox",value:this.group.configuration.anonymousAskRegistrationQuestions,translationToken:"anonymousAskRegistrationQuestions"},{text:"allowAnonymousAutoLogin",type:"checkbox",value:this.group.configuration.allowAnonymousAutoLogin,translationToken:"allowAnonymousAutoLogin",disabled:!this.group.configuration.allowAnonymousUsers},{text:"allowOneTimeLoginWithName",type:"checkbox",value:this.group.configuration.allowOneTimeLoginWithName,translationToken:"allowOneTimeLoginWithName"},{text:"disableFacebookLoginForGroup",type:"checkbox",value:this.group.configuration.disableFacebookLoginForGroup,translationToken:"disableFacebookLoginForGroup"},{text:"forceSecureSamlLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlLogin,translationToken:"forceSecureSamlLogin",disabled:!this.hasSamlLoginProvider},{text:"forceSecureSamlEmployeeLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlEmployeeLogin,translationToken:"forceSecureSamlEmployeeLogin",disabled:!this.hasSamlLoginProvider},{text:"registrationQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.registrationQuestions,translationToken:"registrationQuestions"}]),t}_groupAccessChanged(e){this.groupAccess=e.target.value,this._configChanged()}_getThemeTab(){return{name:"themeSettings",icon:"palette",items:[{text:"inheritThemeFromCommunity",type:"checkbox",value:this.group.configuration.inheritThemeFromCommunity,translationToken:"inheritThemeFromCommunity",onChange:"_inheritThemeChanged"},{text:"mediaUploads",type:"html",templateData:this.renderHeaderImageUploads()},{text:"themeSelector",type:"html",templateData:x`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              .disableSelection="${this.group.configuration.inheritThemeFromCommunity}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.group.configuration.theme}"
            ></yp-theme-selector>
          `},{text:"hideGroupType",type:"checkbox"}]}}_inheritThemeChanged(e){this.group.configuration.inheritThemeFromCommunity=e.target.checked}_getPostSettingsTab(){return this.isGroupFolder?null:{name:"postSettings",icon:"create",items:[{text:"canAddNewPosts",type:"checkbox",value:void 0===this.group.configuration.canAddNewPosts||this.group.configuration.canAddNewPosts,translationToken:"group.canAddNewPosts"},{text:"locationHidden",type:"checkbox",value:this.group.configuration.locationHidden,translationToken:"group.locationHidden"},{text:"allowGenerativeImages",type:"checkbox",value:this.group.configuration.allowGenerativeImages,translationToken:"allowGenerativeImages"},{text:"showWhoPostedPosts",type:"checkbox",value:this.group.configuration.showWhoPostedPosts,translationToken:"group.showWhoPostedPosts"},{text:"askUserIfNameShouldBeDisplayed",type:"checkbox",value:this.group.configuration.askUserIfNameShouldBeDisplayed,translationToken:"askUserIfNameShouldBeDisplayed"},{text:"disableDebate",type:"checkbox",value:this.group.configuration.disableDebate,translationToken:"disableDebate"},{text:"allowAdminsToDebate",type:"checkbox",value:this.group.configuration.allowAdminsToDebate,translationToken:"allowAdminsToDebate"},{text:"postDescriptionLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.postDescriptionLimit,translationToken:"postDescriptionLimit",charCounter:!0},{text:"allowPostVideoUploads",type:"checkbox",value:this.hasVideoUpload,translationToken:"allowPostVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPostUploadLimitSec,translationToken:"videoPostUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPostAudioUploads",type:"checkbox",value:this.hasAudioUpload,translationToken:"allowPostAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPostUploadLimitSec,translationToken:"audioPostUploadLimitSec",disabled:!this.hasAudioUpload},{text:"customTitleQuestionText",type:"textfield",maxLength:60,value:this.group.configuration.customTitleQuestionText,translationToken:"customTitleQuestionText"},{text:"hideNameInputAndReplaceWith",type:"textfield",maxLength:60,value:this.group.configuration.hideNameInputAndReplaceWith,translationToken:"hideNameInputAndReplaceWith"},{text:"customTabTitleNewLocation",type:"textfield",maxLength:60,value:this.group.configuration.customTabTitleNewLocation,translationToken:"customTabTitleNewLocation"},{text:"customCategoryQuestionText",type:"textfield",maxLength:30,value:this.group.configuration.customCategoryQuestionText,translationToken:"customCategoryQuestionText",charCounter:!0},{text:"customFilterText",type:"textfield",maxLength:17,value:this.group.configuration.customFilterText,translationToken:"customFilterText",charCounter:!0},{text:"makeCategoryRequiredOnNewPost",type:"checkbox",value:this.group.configuration.makeCategoryRequiredOnNewPost,translationToken:"makeCategoryRequiredOnNewPost"},{text:"showVideoUploadDisclaimer",type:"checkbox",value:this.group.configuration.showVideoUploadDisclaimer,translationToken:"showVideoUploadDisclaimer"},{text:"moreContactInformation",type:"checkbox",value:this.group.configuration.moreContactInformation,translationToken:"moreContactInformation"},{text:"moreContactInformationAddress",type:"checkbox",value:this.group.configuration.moreContactInformationAddress,translationToken:"moreContactInformationAddress"},{text:"attachmentsEnabled",type:"checkbox",value:this.group.configuration.attachmentsEnabled,translationToken:"attachmentsEnabled"},{text:"useContainImageMode",type:"checkbox",value:this.group.configuration.useContainImageMode,translationToken:"useContainImageMode"},{text:"hideNewestFromFilter",type:"checkbox",value:this.group.configuration.hideNewestFromFilter,translationToken:"hideNewestFromFilter"},{text:"hideNewPost",type:"checkbox",value:this.group.configuration.hideNewPost,translationToken:"hideNewPost"},{text:"hideRecommendationOnNewsFeed",type:"checkbox",value:this.group.configuration.hideRecommendationOnNewsFeed,translationToken:"hideRecommendationOnNewsFeed"},{text:"hideNewPostOnPostPage",type:"checkbox",value:this.group.configuration.hideNewPostOnPostPage,translationToken:"hideNewPostOnPostPage"},{text:"hidePostCover",type:"checkbox",value:this.group.configuration.hidePostCover,translationToken:"hidePostCover"},{text:"hidePostDescription",type:"checkbox",value:this.group.configuration.hidePostDescription,translationToken:"hidePostDescription"},{text:"hidePostActionsInGrid",type:"checkbox",value:this.group.configuration.hidePostActionsInGrid,translationToken:"hidePostActionsInGrid"},{text:"hideDebateIcon",type:"checkbox",value:this.group.configuration.hideDebateIcon,translationToken:"hideDebateIcon"},{text:"hideSharing",type:"checkbox",value:this.group.configuration.hideSharing,translationToken:"hideSharing"},{text:"hideEmoji",type:"checkbox",value:this.group.configuration.hideEmoji,translationToken:"hideEmoji"},{text:"hidePostFilterAndSearch",type:"checkbox",value:this.group.configuration.hidePostFilterAndSearch,translationToken:"hidePostFilterAndSearch"},{text:"hideMediaInput",type:"checkbox",value:this.group.configuration.hideMediaInput,translationToken:"hideMediaInput"},{text:"hidePostImageUploads",type:"checkbox",value:this.group.configuration.hidePostImageUploads,translationToken:"hidePostImageUploads",disabled:!this.hasVideoUpload},{text:"disablePostPageLink",type:"checkbox",value:this.group.configuration.disablePostPageLink,translationToken:"disablePostPageLink"},{text:"defaultLocationLongLat",type:"textfield",maxLength:100,value:this.group.configuration.defaultLocationLongLat,translationToken:"defaultLocationLongLat",style:"width: 300px;"},{text:"forcePostSortMethodAs",type:"textfield",maxLength:12,value:this.group.configuration.forcePostSortMethodAs,translationToken:"forcePostSortMethodAs"},{text:"descriptionTruncateAmount",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.descriptionTruncateAmount,translationToken:"descriptionTruncateAmount"},{text:"descriptionSimpleFormat",type:"checkbox",value:this.group.configuration.descriptionSimpleFormat,translationToken:"descriptionSimpleFormat"},{text:"transcriptSimpleFormat",type:"checkbox",value:this.group.configuration.transcriptSimpleFormat,translationToken:"transcriptSimpleFormat"},{text:"allPostsBlockedByDefault",type:"checkbox",value:this.group.configuration.allPostsBlockedByDefault,translationToken:"allPostsBlockedByDefault"},{text:"exportSubCodesForRadiosAndCheckboxes",type:"checkbox",value:this.group.configuration.exportSubCodesForRadiosAndCheckboxes,translationToken:"exportSubCodesForRadiosAndCheckboxes"},{text:"structuredQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.structuredQuestions,translationToken:"structuredQuestions",onChange:"_structuredQuestionsChanged"},{text:"structuredQuestionsJsonErrorInfo",type:"textdescription",translationToken:"structuredQuestionsJsonFormatNotValid",hidden:!this.structuredQuestionsJsonError},{text:"structuredQuestionsInfo",type:"textdescription",translationToken:"structuredQuestionsInfo"},{text:"uploadDocxSurveyFormat",type:"html",templateData:x`
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
          `},{text:"canVote",type:"checkbox",value:this.group.configuration.canVote,translationToken:"group.canVote"},{text:"hideVoteCount",type:"checkbox",value:this.group.configuration.hideVoteCount,translationToken:"hideVoteCount"},{text:"hideVoteCountUntilVoteCompleted",type:"checkbox",value:this.group.configuration.hideVoteCountUntilVoteCompleted,translationToken:"hideVoteCountUntilVoteCompleted"},{text:"hideDownVoteForPost",type:"checkbox",value:this.group.configuration.hideDownVoteForPost,translationToken:"hideDownVoteForPost"},{text:"maxNumberOfGroupVotes",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.maxNumberOfGroupVotes,translationToken:"maxNumberOfGroupVotes"},{text:"customVoteUpHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteUpHoverText,translationToken:"customVoteUpHoverText"},{text:"customVoteDownHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteDownHoverText,translationToken:"customVoteDownHoverText"},{text:"customRatingsText",type:"textarea",rows:2,maxRows:2,value:this.group.configuration.customRatingsText,translationToken:"customRatings"},{text:"customRatingsInfo",type:"textdescription"}]}}get endorsementButtonsOptions(){return this.t?[{name:"hearts",translatedName:this.t("endorsementButtonsHeart")},{name:"arrows",translatedName:this.t("endorsementArrows")},{name:"thumbs",translatedName:this.t("endorsementThumbs")},{name:"hats",translatedName:this.t("endorsementHats")}]:[]}_endorsementButtonsSelected(e){const t=e.target.selectedIndex;this.endorsementButtons=this.endorsementButtonsOptions[t].name,this._configChanged()}get endorsementButtonsIndex(){if(this.endorsementButtonsOptions){for(let e=0;e<this.endorsementButtonsOptions.length;e++)if(this.endorsementButtonsOptions[e].name==this.endorsementButtons)return e;return-1}return-1}_customRatingsTextChanged(e){}_getPointSettingsTab(){return{name:"pointSettings",icon:"stars",items:[{text:"newPointOptional",type:"checkbox",value:this.group.configuration.newPointOptional,translationToken:"newPointOptional"},{text:"hideNewPointOnNewIdea",type:"checkbox",value:this.group.configuration.hideNewPointOnNewIdea,translationToken:"hideNewPointOnNewIdea"},{text:"hidePointAuthor",type:"checkbox",value:this.group.configuration.hidePointAuthor,translationToken:"hidePointAuthor"},{text:"hidePointForAgainstIcons",type:"checkbox",value:this.group.configuration.hidePointForAgainstIcons,translationToken:"hidePointForAgainstIcons"},{text:"hidePointFor",type:"checkbox",value:this.group.configuration.hidePointFor,translationToken:"hidePointFor"},{text:"hidePointAgainst",type:"checkbox",value:this.group.configuration.hidePointAgainst,translationToken:"hidePointAgainst"},{text:"pointCharLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.pointCharLimit,translationToken:"pointCharLimit"},{text:"alternativePointForHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForHeader,translationToken:"alternativePointForHeader"},{text:"alternativePointAgainstHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstHeader,translationToken:"alternativePointAgainstHeader"},{text:"alternativePointForLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForLabel,translationToken:"alternativePointForLabel"},{text:"alternativePointAgainstLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstLabel,translationToken:"alternativePointAgainstLabel"},{text:"allowPointVideoUploads",type:"checkbox",value:this.group.configuration.allowPostVideoUploads,translationToken:"allowPointVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPointUploadLimitSec,translationToken:"videoPointUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPointAudioUploads",type:"checkbox",value:this.group.configuration.allowPointAudioUploads,translationToken:"allowPointAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPointUploadLimitSec,translationToken:"audioPointUploadLimitSec",disabled:!this.hasAudioUpload},{text:"disableMachineTranscripts",type:"checkbox",value:this.group.configuration.disableMachineTranscripts,translationToken:"disableMachineTranscripts"},{text:"allowAdminAnswersToPoints",type:"checkbox",value:this.group.configuration.allowAdminAnswersToPoints,translationToken:"allowAdminAnswersToPoints"},{text:"customAdminCommentsTitle",type:"textfield",maxLength:50,charCounter:!0,value:this.group.configuration.customAdminCommentsTitle,translationToken:"customAdminCommentsTitle"}]}}_getAdditionalConfigTab(){return{name:"additionalGroupConfig",icon:"settings",items:[{text:"defaultLocale",type:"html",templateData:x`
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
          `},{text:"urlToReviewActionText",type:"textfield",maxLength:30,charCounter:!0,value:this.group.configuration.urlToReviewActionText,translationToken:"urlToReviewActionText"},{text:"isDataVisualizationGroup",type:"checkbox",value:this.group.configuration.isDataVisualizationGroup,translationToken:"isDataVisualizationGroup",onTap:"_isDataVisualizationGroupClick"},{text:"dataForVisualization",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.dataForVisualization,translationToken:"dataForVisualization",hidden:!this.isDataVisualizationGroup,onChange:"_dataForVisualizationChanged"},{text:"dataForVisualizationJsonError",type:"textdescription",hidden:!this.dataForVisualizationJsonError,translationToken:"structuredQuestionsJsonFormatNotValid"},{text:"moveGroupTo",type:"html",templateData:x`
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
          `}]}}renderActionMenu(){return x`
      <div style="position: relative;">
        <md-outlined-icon-button
          .ariaLabelSelected="${this.t("actions")}"
          id="menuAnchor"
          type="button"
          @click="${()=>this.$$("#actionMenu").open=!0}"
          ><md-icon>menu</md-icon></md-outlined-icon-button
        >
        <md-menu
          id="actionMenu"
          positioning="popover"
          .menuCorner="${Corner.START_END}"
          anchor="menuAnchor"
        >
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="newCategoryMenuItem"
          >
            <div slot="headline">New Category</div>
          </md-menu-item>
          <md-menu-item @click="${this._menuSelection}" id="deleteMenuItem">
            <div slot="headline">Delete</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="cloneMenuItem"
          >
            <div slot="headline">Clone</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="promotersMenuItem"
          >
            <div slot="headline">Promoters</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="deleteContentMenuItem"
          >
            <div slot="headline">Delete Content</div>
          </md-menu-item>
          <md-menu-item
            hidden
            @click="${this._menuSelection}"
            id="anonymizeMenuItem"
          >
            <div slot="headline">Anonymize</div>
          </md-menu-item>
        </md-menu>
      </div>
    `}_onDeleted(){this.dispatchEvent(new CustomEvent("yp-refresh-community",{bubbles:!0,composed:!0})),YpNavHelpers.redirectTo("/community/"+this.group.community_id)}_openDelete(){window.appGlobals.activity("open","group.delete"),window.appDialogs.getDialogAsync("apiActionDialog",(e=>{e.setup("/api/groups/"+this.group.id,this.t("groupDeleteConfirmation"),this._onDeleted.bind(this)),e.open({finalDeleteWarning:!0})}))}_menuSelection(e){e.target,this._openDelete()}earlConfigChanged(e){this.group.configuration.allOurIdeas=this.$$("aoi-earl-ideas-editor").configuration,this.requestUpdate()}async staticHtmlConfigChanged(e){this.group.configuration.staticHtml=this.$$("yp-admin-html-editor").getConfiguration(),this.configTabs=this.setupConfigTabs(),console.log(JSON.stringify(this.group.configuration.staticHtml,null,2)),this.requestUpdate()}themeConfigChanged(e){this.group.configuration.theme={...this.group.configuration.theme,...e.detail},this.requestUpdate()}renderCreateEarl(e,t){return x`<aoi-earl-ideas-editor
      id="createEarl"
      .domainId="${e}"
      .communityId="${t}"
      @configuration-changed="${this.earlConfigChanged}"
      @theme-config-changed="${this.themeConfigChanged}"
      .group="${this.group}"
      .configuration="${this.group.configuration.allOurIdeas}"
    ></aoi-earl-ideas-editor>`}renderHtmlContent(e,t){return x`<yp-admin-html-editor
      id="createStaticHtml"
      .domainId="${e}"
      .communityId="${t}"
      .parentCollectionId="${this.parentCollectionId}"
      .collectionId="${this.collectionId}"
      @configuration-changed="${this.staticHtmlConfigChanged}"
      .group="${this.group}"
      .content="${this.group.configuration.staticHtml?.content||""}"
      .media="${this.group.configuration.staticHtml?.media||[]}"
    ></yp-admin-html-editor>`}setupEarlConfigIfNeeded(){const e=this.group.configuration.allOurIdeas;e.earl||(e.earl={active:!0,configuration:{accept_new_ideas:!0,hide_results:!1,hide_analysis:!1,hide_skip:!1,enableAiModeration:!1,allowAnswersNotForVoting:!1,hide_explain:!1,minimum_ten_votes_to_show_results:!0,target_votes:30,analysis_config:defaultAiAnalysisJson,moderationPrompt:defaultModerationPrompt,welcome_html:"",welcome_message:"",external_goal_params_whitelist:"",external_goal_trigger_url:""}},this.group.configuration.allowAnonymousUsers=!0,this.configTabs=this.setupConfigTabs(),this.requestUpdate()),e.earl.question||(e.earl.question={})}questionNameChanged(e){this.setupEarlConfigIfNeeded();const t=e.currentTarget.value,i=this.group.configuration.allOurIdeas,o=this.$$("#createEarl");t&&t.length>=3?o.openForAnswers=!0:o.openForAnswers=!1,i.earl.question.name=t,this.aoiQuestionName=t,console.error("questionNameChanged",t),this.set(this.group.configuration.allOurIdeas.earl,"question.name",t),this.questionNameHasChanged=!0,this.configTabs=this.setupConfigTabs(),this._configChanged(),this.requestUpdate()}afterSave(){if(super.afterSave(),this.questionNameHasChanged){let e,t;"new"===this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup?t=this.parentCollectionId:e="new"===this.collectionId?this.parentCollectionId:this.group.community_id;(new AoiAdminServerApi).updateName(t,e,this.group.configuration.allOurIdeas.earl.question.id,this.group.configuration.allOurIdeas.earl.question.name)}}_getHtmlContentTab(){let e,t,i=this.group.configuration.staticHtml;return i||(i=this.group.configuration.staticHtml={content:"",media:[]}),"new"===this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup?(t=this.parentCollectionId,this.group.configuration.disableCollectionUpLink=!0):e="new"===this.collectionId?this.parentCollectionId:this.group.community_id,{name:"htmlContent",icon:"code",items:[{text:"htmlContent",type:"html",templateData:this.renderHtmlContent(t,e)}]}}_getAllOurIdeaTab(){let e,t,i=this.group.configuration.allOurIdeas;return i||(i=this.group.configuration.allOurIdeas={}),"new"===this.collectionId&&window.appGlobals.originalQueryParameters.createCommunityForGroup?(t=this.parentCollectionId,this.group.configuration.disableCollectionUpLink=!0):e="new"===this.collectionId?this.parentCollectionId:this.group.community_id,{name:"allOurIdeas",icon:"lightbulb",items:[{text:"questionName",type:"textarea",maxLength:140,rows:2,charCounter:!0,value:this.aoiQuestionName,translationToken:"questionName",onChange:this.questionNameChanged},{text:"earlConfig",type:"html",templateData:this.renderCreateEarl(t,e)}]}}set(e,t,i){const o=t.split(".");let n=e;o.forEach(((e,t)=>{t===o.length-1?n[e]=i:(n[e]||(n[e]={}),n=n[e])}))}_updateEarl(e,t,i=!1){let o=e.detail.value;if(i)try{o=JSON.parse(o)}catch(e){console.error("Error parsing JSON",e)}this.set(this.group.configuration.allOurIdeas.earl,t,o),this._configChanged(),this.requestUpdate()}_getAllOurIdeaOptionsTab(){let e=this.group.configuration.allOurIdeas?.earl;return e&&(e.configuration.analysis_config||(e.configuration.analysis_config=defaultAiAnalysisJson)),{name:"allOurIdeasOptions",icon:"settings",items:[{text:"active",type:"checkbox",onChange:e=>this._updateEarl(e,"active"),value:e?.active,translationToken:"wikiSurveyActive"},{text:"welcome_message",type:"textarea",rows:5,maxLength:300,value:e?.configuration?.welcome_message,onChange:e=>this._updateEarl(e,"configuration.welcome_message"),translationToken:"welcomeMessage"},{text:"allowAnonymousUsers",type:"checkbox",value:void 0===this.group.configuration.allowAnonymousUsers||this.group.configuration.allowAnonymousUsers,translationToken:"allowAnonymousUsersToVote"},{text:"accept_new_ideas",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.accept_new_ideas"),value:void 0===e?.configuration?.accept_new_ideas||e?.configuration?.accept_new_ideas,translationToken:"acceptNewIdeas"},{text:"enableAiModeration",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.enableAiModeration"),value:e?.configuration?.enableAiModeration,translationToken:"enableAiModeration"},{text:"allowAnswersNotForVoting",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.allowAnswersNotForVoting"),value:e?.configuration?.allowAnswersNotForVoting,translationToken:"allowAnswersNotForVoting"},{text:"minimum_ten_votes_to_show_results",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.minimum_ten_votes_to_show_results"),value:e?.configuration?.minimum_ten_votes_to_show_results,translationToken:"minimumTenVotesToShowResults"},{text:"disableCollectionUpLink",type:"checkbox",value:this.group.configuration.disableCollectionUpLink,translationToken:"disableCollectionUpLink"},{text:"hide_results",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_results"),value:e?.configuration?.hide_results,translationToken:"hideAoiResults"},{text:"hide_analysis",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_analysis"),value:e?.configuration?.hide_analysis,translationToken:"hideAoiAnalysis"},{text:"hide_skip",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_skip"),value:e?.configuration?.hide_skip,translationToken:"hideSkipButton"},{text:"hide_explain",type:"checkbox",onChange:e=>this._updateEarl(e,"configuration.hide_explain"),value:e?.configuration?.hide_explain,translationToken:"hideAoiExplainButton"},{text:"welcome_html",type:"textarea",rows:5,value:e?.configuration?.welcome_html,onChange:e=>this._updateEarl(e,"configuration.welcome_html"),translationToken:"welcomeHtml"},{text:"moderationPrompt",type:"textarea",rows:5,value:e?.configuration?.moderationPrompt?e?.configuration?.moderationPrompt:defaultModerationPrompt,onChange:e=>this._updateEarl(e,"configuration.moderationPrompt"),translationToken:"aoiModerationPrompt"},{text:"targetVotes",type:"textfield",maxLength:3,pattern:"[0-9]",value:e?.configuration?.target_votes,translationToken:"targetVotes",onChange:e=>this._updateEarl(e,"configuration.target_votes",!0),charCounter:!0},{text:"externalGoalParamsWhitelist",type:"textfield",pattern:"[0-9]",value:e?.configuration?.external_goal_params_whitelist,onChange:e=>this._updateEarl(e,"configuration.external_goal_params_whitelist",!0),translationToken:"externalGoalParamsWhitelist"},{text:"externalGoalTriggerUrl",type:"textfield",value:e?.configuration?.external_goal_trigger_url,onChange:e=>this._updateEarl(e,"configuration.external_goal_trigger_url",!0),translationToken:"externalGoalTriggerUrl"},{text:"analysis_config",type:"textarea",rows:7,value:e?.configuration?.analysis_config?JSON.stringify(e?.configuration?.analysis_config,null,2):JSON.stringify(defaultAiAnalysisJson,null,2),onChange:e=>this._updateEarl(e,"configuration.analysis_config",!0),translationToken:"aoiAiAnalysisConfig"},{type:"html",templateData:x`<div
            class="layout vertical center-center"
            style="margin-top: -8px"
          >
            <div style="max-width: 700px">
              ${o$4(this.t("aiAnalysisConfigInfo"))}
            </div>
          </div>`}]}}_categorySelected(e){e.detail.value}_categoryImageSrc(e){return`path/to/category/icons/${e.id}.png`}_welcomePageSelected(e){const t=e.detail.index;this.welcomePageId=this.translatedPages[t].id}_isDataVisualizationGroupClick(e){}_dataForVisualizationChanged(e){}_moveGroupToSelected(e){const t=e.detail.index;this.moveGroupToId=this.groupMoveToOptions[t].id}setupConfigTabs(){const e=[];if(this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.ideaGeneration){const t=this._getPostSettingsTab();this.isGroupFolder||e.push(t),e.push(this._getVoteSettingsTab()),e.push(this._getPointSettingsTab()),e.push(this._getAdditionalConfigTab())}else this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.allOurIdeas?(e.push(this._getAllOurIdeaTab()),e.push(this._getAllOurIdeaOptionsTab())):this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.htmlContent&&e.push(this._getHtmlContentTab());return e.push(this._getAccessTab()),e.push(this._getThemeTab()),this.tabsPostSetup(e),e}_appHomeScreenIconImageUploaded(e){var t=JSON.parse(e.detail.xhr.response);this.appHomeScreenIconImageId=t.id,this._configChanged()}};YpAdminConfigGroup.GroupType={ideaGeneration:0,allOurIdeas:1,htmlContent:2,policySynthAgentsWorkflow:3},__decorate$9([n$4({type:Number})],YpAdminConfigGroup.prototype,"appHomeScreenIconImageId",void 0),__decorate$9([n$4({type:String})],YpAdminConfigGroup.prototype,"hostnameExample",void 0),__decorate$9([n$4({type:Number})],YpAdminConfigGroup.prototype,"signupTermsPageId",void 0),__decorate$9([n$4({type:Number})],YpAdminConfigGroup.prototype,"welcomePageId",void 0),__decorate$9([n$4({type:String})],YpAdminConfigGroup.prototype,"aoiQuestionName",void 0),__decorate$9([n$4({type:String})],YpAdminConfigGroup.prototype,"groupAccess",void 0),__decorate$9([n$4({type:Number})],YpAdminConfigGroup.prototype,"groupTypeIndex",void 0),__decorate$9([n$4({type:Object})],YpAdminConfigGroup.prototype,"group",void 0),YpAdminConfigGroup=YpAdminConfigGroup_1=__decorate$9([t$2("yp-admin-config-group")],YpAdminConfigGroup);var __decorate$8=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminGroups=class extends YpBaseElementWithLogin{newGroup(){YpNavHelpers.redirectTo(`/group/new/${this.community.id}`)}static get styles(){return[super.styles,i$2`
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
    `}};__decorate$8([n$4({type:Object})],YpAdminGroups.prototype,"community",void 0),YpAdminGroups=__decorate$8([t$2("yp-admin-groups")],YpAdminGroups);
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const GridElement=Grid;console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-grid" is deprecated. Use "@vaadin/grid" instead.');
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
const GridSelectionColumnBaseMixin=e=>class extends e{static get properties(){return{width:{type:String,value:"58px"},flexGrow:{type:Number,value:0},selectAll:{type:Boolean,value:!1,notify:!0},autoSelect:{type:Boolean,value:!1},dragSelect:{type:Boolean,value:!1},_indeterminate:Boolean,_selectAllHidden:Boolean}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, _indeterminate, _selectAllHidden)"]}_defaultHeaderRenderer(e,t){let i=e.firstElementChild;i||(i=document.createElement("vaadin-checkbox"),i.setAttribute("aria-label","Select All"),i.classList.add("vaadin-grid-select-all-checkbox"),e.appendChild(i),i.addEventListener("checked-changed",this.__onSelectAllCheckedChanged.bind(this)));const o=this.__isChecked(this.selectAll,this._indeterminate);i.__rendererChecked=o,i.checked=o,i.hidden=this._selectAllHidden,i.indeterminate=this._indeterminate}_defaultRenderer(e,t,{item:i,selected:o}){let n=e.firstElementChild;n||(n=document.createElement("vaadin-checkbox"),n.setAttribute("aria-label","Select Row"),e.appendChild(n),n.addEventListener("checked-changed",this.__onSelectRowCheckedChanged.bind(this)),addListener(e,"track",this.__onCellTrack.bind(this)),e.addEventListener("mousedown",this.__onCellMouseDown.bind(this)),e.addEventListener("click",this.__onCellClick.bind(this))),n.__item=i,n.__rendererChecked=o,n.checked=o}__onSelectAllCheckedChanged(e){e.target.checked!==e.target.__rendererChecked&&(this._indeterminate||e.target.checked?this._selectAll():this._deselectAll())}__onSelectRowCheckedChanged(e){e.target.checked!==e.target.__rendererChecked&&(e.target.checked?this._selectItem(e.target.__item):this._deselectItem(e.target.__item))}__onCellTrack(e){if(this.dragSelect)if(this.__dragCurrentY=e.detail.y,this.__dragDy=e.detail.dy,"start"===e.detail.state){const t=this._grid._getVisibleRows().find((t=>t.contains(e.currentTarget.assignedSlot)));this.__dragSelect=!this._grid._isSelected(t._item),this.__dragStartIndex=t.index,this.__dragStartItem=t._item,this.__dragAutoScroller()}else"end"===e.detail.state&&(this.__dragStartItem&&(this.__dragSelect?this._selectItem(this.__dragStartItem):this._deselectItem(this.__dragStartItem)),setTimeout((()=>{this.__dragStartIndex=void 0})))}__onCellMouseDown(e){this.dragSelect&&e.preventDefault()}__onCellClick(e){void 0!==this.__dragStartIndex&&e.preventDefault()}__dragAutoScroller(){if(void 0===this.__dragStartIndex)return;const e=this._grid._getVisibleRows(),t=e.find((e=>{const t=e.getBoundingClientRect();return this.__dragCurrentY>=t.top&&this.__dragCurrentY<=t.bottom}));let i=t?t.index:void 0;const o=this.__getScrollableArea();this.__dragCurrentY<o.top?i=this._grid._firstVisibleIndex:this.__dragCurrentY>o.bottom&&(i=this._grid._lastVisibleIndex),void 0!==i&&e.forEach((e=>{(i>this.__dragStartIndex&&e.index>=this.__dragStartIndex&&e.index<=i||i<this.__dragStartIndex&&e.index<=this.__dragStartIndex&&e.index>=i)&&(this.__dragSelect?this._selectItem(e._item):this._deselectItem(e._item),this.__dragStartItem=void 0)}));const n=.15*o.height;if(this.__dragDy<0&&this.__dragCurrentY<o.top+n){const e=o.top+n-this.__dragCurrentY,t=Math.min(1,e/n);this._grid.$.table.scrollTop-=10*t}if(this.__dragDy>0&&this.__dragCurrentY>o.bottom-n){const e=this.__dragCurrentY-(o.bottom-n),t=Math.min(1,e/n);this._grid.$.table.scrollTop+=10*t}setTimeout((()=>this.__dragAutoScroller()),10)}__getScrollableArea(){const e=this._grid.$.table.getBoundingClientRect(),t=this._grid.$.header.getBoundingClientRect(),i=this._grid.$.footer.getBoundingClientRect();return{top:e.top+t.height,bottom:e.bottom-i.height,left:e.left,right:e.right,height:e.height-t.height-i.height,width:e.width}}_selectAll(){}_deselectAll(){}_selectItem(e){}_deselectItem(e){}__isChecked(e,t){return t||e}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */;class GridSelectionColumn extends(GridSelectionColumnBaseMixin(GridColumn)){static get is(){return"vaadin-grid-selection-column"}static get properties(){return{__previousActiveItem:Object}}static get observers(){return["__onSelectAllChanged(selectAll)"]}constructor(){super(),this.__boundOnActiveItemChanged=this.__onActiveItemChanged.bind(this),this.__boundOnDataProviderChanged=this.__onDataProviderChanged.bind(this),this.__boundOnSelectedItemsChanged=this.__onSelectedItemsChanged.bind(this)}disconnectedCallback(){this._grid.removeEventListener("active-item-changed",this.__boundOnActiveItemChanged),this._grid.removeEventListener("data-provider-changed",this.__boundOnDataProviderChanged),this._grid.removeEventListener("filter-changed",this.__boundOnSelectedItemsChanged),this._grid.removeEventListener("selected-items-changed",this.__boundOnSelectedItemsChanged),super.disconnectedCallback()}connectedCallback(){super.connectedCallback(),this._grid&&(this._grid.addEventListener("active-item-changed",this.__boundOnActiveItemChanged),this._grid.addEventListener("data-provider-changed",this.__boundOnDataProviderChanged),this._grid.addEventListener("filter-changed",this.__boundOnSelectedItemsChanged),this._grid.addEventListener("selected-items-changed",this.__boundOnSelectedItemsChanged))}__onSelectAllChanged(e){void 0!==e&&this._grid&&(this.__selectAllInitialized?this._selectAllChangeLock||(e&&this.__hasArrayDataProvider()?this.__withFilteredItemsArray((e=>{this._grid.selectedItems=e})):this._grid.selectedItems=[]):this.__selectAllInitialized=!0)}__arrayContains(e,t){return Array.isArray(e)&&Array.isArray(t)&&t.every((t=>e.includes(t)))}_selectAll(){this.selectAll=!0}_deselectAll(){this.selectAll=!1}_selectItem(e){this._grid.selectItem(e)}_deselectItem(e){this._grid.deselectItem(e)}__onActiveItemChanged(e){const t=e.detail.value;if(this.autoSelect){const e=t||this.__previousActiveItem;e&&this._grid._toggleItem(e)}this.__previousActiveItem=t}__hasArrayDataProvider(){return Array.isArray(this._grid.items)&&!!this._grid.dataProvider}__onSelectedItemsChanged(){this._selectAllChangeLock=!0,this.__hasArrayDataProvider()&&this.__withFilteredItemsArray((e=>{this._grid.selectedItems.length?this.__arrayContains(this._grid.selectedItems,e)?(this.selectAll=!0,this._indeterminate=!1):(this.selectAll=!1,this._indeterminate=!0):(this.selectAll=!1,this._indeterminate=!1)})),this._selectAllChangeLock=!1}__onDataProviderChanged(){this._selectAllHidden=!Array.isArray(this._grid.items)}__withFilteredItemsArray(e){const t={page:0,pageSize:1/0,sortOrders:[],filters:this._grid._mapFilters()};this._grid.dataProvider(t,(t=>e(t)))}}customElements.define(GridSelectionColumn.is,GridSelectionColumn),registerStyles("vaadin-input-container",i$3`
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
registerStyles("vaadin-text-field",inputFieldShared$1,{moduleId:"lumo-text-field-styles"});
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class ErrorController extends SlotController{constructor(e){super(e,"error-message",(()=>document.createElement("div")),((e,t)=>{this.__updateErrorId(t),this.__updateHasError()}),!0)}get errorId(){return this.node&&this.node.id}setErrorMessage(e){this.errorMessage=e,this.__updateHasError()}setInvalid(e){this.invalid=e,this.__updateHasError()}initCustomNode(e){this.__updateErrorId(e),e.textContent&&!this.errorMessage&&(this.errorMessage=e.textContent.trim()),this.__updateHasError()}teardownNode(e){let t=this.getSlotChild();t||e===this.defaultNode||(t=this.attachDefaultNode(),this.initNode(t)),this.__updateHasError()}__isNotEmpty(e){return Boolean(e&&""!==e.trim())}__updateHasError(){const e=this.node,t=Boolean(this.invalid&&this.__isNotEmpty(this.errorMessage));e&&(e.textContent=t?this.errorMessage:"",e.hidden=!t,t?e.setAttribute("role","alert"):e.removeAttribute("role")),this.host.toggleAttribute("has-error-message",t)}__updateErrorId(e){e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class FieldAriaController{constructor(e){this.host=e,this.__required=!1}setTarget(e){this.__target=e,this.__setAriaRequiredAttribute(this.__required),this.__setLabelIdToAriaAttribute(this.__labelId),this.__setErrorIdToAriaAttribute(this.__errorId),this.__setHelperIdToAriaAttribute(this.__helperId)}setRequired(e){this.__setAriaRequiredAttribute(e),this.__required=e}setLabelId(e){this.__setLabelIdToAriaAttribute(e,this.__labelId),this.__labelId=e}setErrorId(e){this.__setErrorIdToAriaAttribute(e,this.__errorId),this.__errorId=e}setHelperId(e){this.__setHelperIdToAriaAttribute(e,this.__helperId),this.__helperId=e}get __isGroupField(){return this.__target===this.host}__setLabelIdToAriaAttribute(e,t){this.__setAriaAttributeId("aria-labelledby",e,t)}__setErrorIdToAriaAttribute(e,t){this.__isGroupField?this.__setAriaAttributeId("aria-labelledby",e,t):this.__setAriaAttributeId("aria-describedby",e,t)}__setHelperIdToAriaAttribute(e,t){this.__isGroupField?this.__setAriaAttributeId("aria-labelledby",e,t):this.__setAriaAttributeId("aria-describedby",e,t)}__setAriaRequiredAttribute(e){this.__target&&(["input","textarea"].includes(this.__target.localName)||(e?this.__target.setAttribute("aria-required","true"):this.__target.removeAttribute("aria-required")))}__setAriaAttributeId(e,t,i){this.__target&&(i&&removeValueFromAttribute(this.__target,e,i),t&&addValueToAttribute(this.__target,e,t))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */class HelperController extends SlotController{constructor(e){super(e,"helper",null,null,!0)}get helperId(){return this.node&&this.node.id}initCustomNode(e){this.__updateHelperId(e),this.__observeHelper(e);const t=this.__hasHelper(e);this.__toggleHasHelper(t)}teardownNode(e){this.__helperIdObserver&&this.__helperIdObserver.disconnect();const t=this.getSlotChild();if(t&&t!==this.defaultNode){const e=this.__hasHelper(t);this.__toggleHasHelper(e)}else this.__applyDefaultHelper(this.helperText,t)}setHelperText(e){this.helperText=e;const t=this.getSlotChild();t&&t!==this.defaultNode||this.__applyDefaultHelper(e,t)}__hasHelper(e){return!!e&&(e.children.length>0||e.nodeType===Node.ELEMENT_NODE&&customElements.get(e.localName)||this.__isNotEmpty(e.textContent))}__isNotEmpty(e){return e&&""!==e.trim()}__applyDefaultHelper(e,t){const i=this.__isNotEmpty(e);i&&!t&&(this.slotFactory=()=>document.createElement("div"),t=this.attachDefaultNode(),this.__updateHelperId(t),this.__observeHelper(t)),t&&(t.textContent=e),this.__toggleHasHelper(i)}__observeHelper(e){this.__helperObserver=new MutationObserver((e=>{e.forEach((e=>{const t=e.target,i=t===this.node;if("attributes"===e.type)i&&t.id!==this.defaultId&&this.__updateHelperId(t);else if(i||t.parentElement===this.node){const e=this.__hasHelper(this.node);this.__toggleHasHelper(e)}}))})),this.__helperObserver.observe(e,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}__toggleHasHelper(e){this.host.toggleAttribute("has-helper",e),this.dispatchEvent(new CustomEvent("helper-changed",{detail:{hasHelper:e,node:this.node}}))}__updateHelperId(e){e.id||(e.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */const ValidateMixin=dedupingMixin((e=>class extends e{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},required:{type:Boolean,reflectToAttribute:!0}}}validate(){const e=this.checkValidity();return this._setInvalid(!e),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:e}})),e}checkValidity(){return!this.required||!!this.value}_setInvalid(e){this._shouldSetInvalid(e)&&(this.invalid=e)}_shouldSetInvalid(e){return!0}})),FieldMixin=e=>class extends(ValidateMixin(LabelMixin(ControllerMixin(e)))){static get properties(){return{ariaTarget:{type:Object,observer:"_ariaTargetChanged"},errorMessage:{type:String,observer:"_errorMessageChanged"},helperText:{type:String,observer:"_helperTextChanged"}}}static get observers(){return["_invalidChanged(invalid)","_requiredChanged(required)"]}get _errorId(){return this._errorController.errorId}get _errorNode(){return this._errorController.node}get _helperId(){return this._helperController.helperId}get _helperNode(){return this._helperController.node}constructor(){super(),this._fieldAriaController=new FieldAriaController(this),this._helperController=new HelperController(this),this._errorController=new ErrorController(this),this._labelController.addEventListener("label-changed",(e=>{const{hasLabel:t,node:i}=e.detail;this.__labelChanged(t,i)})),this._helperController.addEventListener("helper-changed",(e=>{const{hasHelper:t,node:i}=e.detail;this.__helperChanged(t,i)}))}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}__helperChanged(e,t){e?this._fieldAriaController.setHelperId(t.id):this._fieldAriaController.setHelperId(null)}__labelChanged(e,t){e?this._fieldAriaController.setLabelId(t.id):this._fieldAriaController.setLabelId(null)}_errorMessageChanged(e){this._errorController.setErrorMessage(e)}_helperTextChanged(e){this._helperController.setHelperText(e)}_ariaTargetChanged(e){e&&this._fieldAriaController.setTarget(e)}_requiredChanged(e){this._fieldAriaController.setRequired(e)}_invalidChanged(e){this._errorController.setInvalid(e),setTimeout((()=>{e?this._fieldAriaController.setErrorId(this._errorController.errorId):this._fieldAriaController.setErrorId(null)}))}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,InputConstraintsMixin=dedupingMixin((e=>class extends(DelegateStateMixin(ValidateMixin(InputMixin(e)))){static get constraints(){return["required"]}static get delegateAttrs(){return[...super.delegateAttrs,"required"]}ready(){super.ready(),this._createConstraintsObserver()}checkValidity(){return this.inputElement&&this._hasValidConstraints(this.constructor.constraints.map((e=>this[e])))?this.inputElement.checkValidity():!this.invalid}_hasValidConstraints(e){return e.some((e=>this.__isValidConstraint(e)))}_createConstraintsObserver(){this._createMethodObserver(`_constraintsChanged(stateTarget, ${this.constructor.constraints.join(", ")})`)}_constraintsChanged(e,...t){if(!e)return;const i=this._hasValidConstraints(t),o=this.__previousHasConstraints&&!i;(this._hasValue||this.invalid)&&i?this.validate():o&&this._setInvalid(!1),this.__previousHasConstraints=i}_onChange(e){e.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:e},bubbles:e.bubbles,cancelable:e.cancelable}))}__isValidConstraint(e){return Boolean(e)||0===e}})),stylesMap=new WeakMap;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */function getRootStyles(e){return stylesMap.has(e)||stylesMap.set(e,new Set),stylesMap.get(e)}function insertStyles(e,t){const i=document.createElement("style");i.textContent=e,t===document?document.head.appendChild(i):t.insertBefore(i,t.firstChild)}const SlotStylesMixin=dedupingMixin((e=>class extends e{get slotStyles(){return{}}connectedCallback(){super.connectedCallback(),this.__applySlotStyles()}__applySlotStyles(){const e=this.getRootNode(),t=getRootStyles(e);this.slotStyles.forEach((i=>{t.has(i)||(insertStyles(i,e),t.add(i))}))}})),InputControlMixin=e=>class extends(SlotStylesMixin(DelegateFocusMixin(InputConstraintsMixin(FieldMixin(KeyboardMixin(e)))))){static get properties(){return{allowedCharPattern:{type:String,observer:"_allowedCharPatternChanged"},autoselect:{type:Boolean,value:!1},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},name:{type:String,reflectToAttribute:!0},placeholder:{type:String,reflectToAttribute:!0},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},title:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"name","type","placeholder","readonly","invalid","title"]}constructor(){super(),this._boundOnPaste=this._onPaste.bind(this),this._boundOnDrop=this._onDrop.bind(this),this._boundOnBeforeInput=this._onBeforeInput.bind(this)}get clearElement(){return console.warn(`Please implement the 'clearElement' property in <${this.localName}>`),null}get slotStyles(){return["\n          :is(input[slot='input'], textarea[slot='textarea'])::placeholder {\n            font: inherit;\n            color: inherit;\n          }\n        "]}ready(){super.ready(),this.clearElement&&(this.clearElement.addEventListener("click",(e=>this._onClearButtonClick(e))),this.clearElement.addEventListener("mousedown",(e=>this._onClearButtonMouseDown(e))))}_onClearButtonClick(e){e.preventDefault(),this.__clear()}_onClearButtonMouseDown(e){e.preventDefault(),isTouch$1||this.inputElement.focus()}_onFocus(e){super._onFocus(e),this.autoselect&&this.inputElement&&this.inputElement.select()}_onEscape(e){super._onEscape(e),this.clearButtonVisible&&this.value&&(e.stopPropagation(),this.__clear())}_onChange(e){e.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:e},bubbles:e.bubbles,cancelable:e.cancelable}))}__clear(){this.clear(),this.inputElement.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.inputElement.dispatchEvent(new Event("change",{bubbles:!0}))}_addInputListeners(e){super._addInputListeners(e),e.addEventListener("paste",this._boundOnPaste),e.addEventListener("drop",this._boundOnDrop),e.addEventListener("beforeinput",this._boundOnBeforeInput)}_removeInputListeners(e){super._removeInputListeners(e),e.removeEventListener("paste",this._boundOnPaste),e.removeEventListener("drop",this._boundOnDrop),e.removeEventListener("beforeinput",this._boundOnBeforeInput)}_onKeyDown(e){super._onKeyDown(e),this.allowedCharPattern&&!this.__shouldAcceptKey(e)&&(e.preventDefault(),this._markInputPrevented())}_markInputPrevented(){this.setAttribute("input-prevented",""),this._preventInputDebouncer=Debouncer.debounce(this._preventInputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")}))}__shouldAcceptKey(e){return e.metaKey||e.ctrlKey||!e.key||1!==e.key.length||this.__allowedCharRegExp.test(e.key)}_onPaste(e){if(this.allowedCharPattern){const t=e.clipboardData.getData("text");this.__allowedTextRegExp.test(t)||(e.preventDefault(),this._markInputPrevented())}}_onDrop(e){if(this.allowedCharPattern){const t=e.dataTransfer.getData("text");this.__allowedTextRegExp.test(t)||(e.preventDefault(),this._markInputPrevented())}}_onBeforeInput(e){this.allowedCharPattern&&e.data&&!this.__allowedTextRegExp.test(e.data)&&(e.preventDefault(),this._markInputPrevented())}_allowedCharPatternChanged(e){if(e)try{this.__allowedCharRegExp=new RegExp(`^${e}$`),this.__allowedTextRegExp=new RegExp(`^${e}*$`)}catch(e){console.error(e)}}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,InputFieldMixin=e=>class extends(InputControlMixin(e)){static get properties(){return{autocomplete:{type:String},autocorrect:{type:String},autocapitalize:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"autocapitalize","autocomplete","autocorrect"]}_inputElementChanged(e){super._inputElementChanged(e),e&&(e.value&&e.value!==this.value&&(console.warn(`Please define value on the <${this.localName}> component!`),e.value=""),this.value&&(e.value=this.value))}get __data(){return this.__dataValue||{}}set __data(e){this.__dataValue=e}_setFocused(e){super._setFocused(e),e||this.validate()}_onInput(e){super._onInput(e),this.invalid&&this.validate()}_valueChanged(e,t){super._valueChanged(e,t),void 0!==t&&this.invalid&&this.validate()}}
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,PatternMixin=e=>class extends(InputConstraintsMixin(e)){static get properties(){return{pattern:{type:String},preventInvalidInput:{type:Boolean,observer:"_preventInvalidInputChanged"}}}static get delegateAttrs(){return[...super.delegateAttrs,"pattern"]}static get constraints(){return[...super.constraints,"pattern"]}_checkInputValue(){if(this.preventInvalidInput){const e=this.inputElement;e&&e.value.length>0&&!this.checkValidity()&&(e.value=this.value||"",this.setAttribute("input-prevented",""),this._inputDebouncer=Debouncer.debounce(this._inputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")})))}}_onInput(e){this._checkInputValue(),super._onInput(e)}_preventInvalidInputChanged(e){e&&console.warn('WARNING: Since Vaadin 23.2, "preventInvalidInput" is deprecated. Please use "allowedCharPattern" instead.')}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */let o$3=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(e$2&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n$3.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n$3.set(t,e))}return e}toString(){return this.cssText}};const r$2=e=>new o$3("string"==typeof e?e:e+"",void 0,s$3),i$1=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1]),e[0]);return new o$3(i,e,s$3)},S$1=(e,t)=>{e$2?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const i=document.createElement("style"),o=t$1.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,e.appendChild(i)}))},c$1=e$2?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return r$2(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(e,t){switch(t){case Boolean:e=e?h$1:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},a$1=(e,t)=>t!==e&&(t==t||e==e),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,i)=>{const o=this._$Ep(i,t);void 0!==o&&(this._$Ev.set(o,i),e.push(o))})),e}static createProperty(e,t=l$2){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,o=this.getPropertyDescriptor(e,i,t);void 0!==o&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(o){const n=this[e];this[t]=o,this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return!1;this[d$1]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(c$1(e))}else void 0!==e&&t.push(c$1(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)}))}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=l$2){var o;const n=this.constructor._$Ep(e,i);if(void 0!==n&&!0===i.reflect){const a=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:n$2).toAttribute(t,i.type);this._$El=e,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$El=null}}_$AK(e,t){var i;const o=this.constructor,n=o._$Ev.get(e);if(void 0!==n&&this._$El!==n){const e=o.getPropertyOptions(n),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:n$2;this._$El=n,this[n]=a.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let o=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||a$1)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((e,t)=>this[t]=e)),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach(((e,t)=>this._$EO(t,this[t],e))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.6.3");const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:e=>e}):void 0,o$1="$lit$",n$1=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$1,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=e=>null===e||"object"!=typeof e&&"function"!=typeof e,c=Array.isArray,v=e=>c(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(e,t)=>{const i=e.length-1,o=[];let n,a=2===t?"<svg>":"",r=f;for(let t=0;t<i;t++){const i=e[t];let s,d,l=-1,c=0;for(;c<i.length&&(r.lastIndex=c,d=r.exec(i),null!==d);)c=r.lastIndex,r===f?"!--"===d[1]?r=_:void 0!==d[1]?r=m:void 0!==d[2]?(y.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=p):void 0!==d[3]&&(r=p):r===p?">"===d[0]?(r=null!=n?n:f,l=-1):void 0===d[1]?l=-2:(l=r.lastIndex-d[2].length,s=d[1],r=void 0===d[3]?p:'"'===d[3]?$:g):r===$||r===g?r=p:r===_||r===m?r=f:(r=p,n=void 0);const u=r===p&&e[t+1].startsWith("/>")?" ":"";a+=r===f?i+h:l>=0?(o.push(s),i.slice(0,l)+o$1+i.slice(l)+n$1+u):i+n$1+(-2===l?(o.push(void 0),t):u)}return[P(e,a+(e[i]||"<?>")+(2===t?"</svg>":"")),o]};class N{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,a=0;const r=e.length-1,s=this.parts,[d,l]=V(e,t);if(this.el=N.createElement(d,i),C.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(o=C.nextNode())&&s.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const e=[];for(const t of o.getAttributeNames())if(t.endsWith(o$1)||t.startsWith(n$1)){const i=l[a++];if(e.push(t),void 0!==i){const e=o.getAttribute(i.toLowerCase()+o$1).split(n$1),t=/([.?@])?(.*)/.exec(i);s.push({type:1,index:n,name:t[2],strings:e,ctor:"."===t[1]?H:"?"===t[1]?L:"@"===t[1]?z:k})}else s.push({type:6,index:n})}for(const t of e)o.removeAttribute(t)}if(y.test(o.tagName)){const e=o.textContent.split(n$1),t=e.length-1;if(t>0){o.textContent=s$1?s$1.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],u()),C.nextNode(),s.push({type:2,index:++n});o.append(e[t],u())}}}else if(8===o.nodeType)if(o.data===l$1)s.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(n$1,e+1));)s.push({type:7,index:n}),e+=n$1.length-1}n++}}static createElement(e,t){const i=r.createElement("template");return i.innerHTML=e,i}}function S(e,t,i=e,o){var n,a,r,s;if(t===T)return t;let l=void 0!==o?null===(n=i._$Co)||void 0===n?void 0:n[o]:i._$Cl;const c=d(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(a=null==l?void 0:l._$AO)||void 0===a||a.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,i,o)),void 0!==o?(null!==(r=(s=i)._$Co)&&void 0!==r?r:s._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(t=S(e,l._$AS(e,t.values),l,o)),t}class M{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:i},parts:o}=this._$AD,n=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:r).importNode(i,!0);C.currentNode=n;let a=C.nextNode(),s=0,d=0,l=o[0];for(;void 0!==l;){if(s===l.index){let t;2===l.type?t=new R(a,a.nextSibling,this,e):1===l.type?t=new l.ctor(a,l.name,l.strings,this,e):6===l.type&&(t=new Z(a,this,e)),this._$AV.push(t),l=o[++d]}s!==(null==l?void 0:l.index)&&(a=C.nextNode(),s++)}return C.currentNode=r,n}v(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class R{constructor(e,t,i,o){var n;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cp=null===(n=null==o?void 0:o.isConnected)||void 0===n||n}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),d(e)?e===A||null==e||""===e?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==T&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):v(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=e:this.$(r.createTextNode(e)),this._$AH=e}g(e){var t;const{values:i,_$litType$:o}=e,n="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=N.createElement(P(o.h,o.h[0]),this.options)),o);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===n)this._$AH.v(i);else{const e=new M(n,this),t=e.u(this.options);e.v(i),this.$(t),this._$AH=e}}_$AC(e){let t=E.get(e.strings);return void 0===t&&E.set(e.strings,t=new N(e)),t}T(e){c(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new R(this.k(u()),this.k(u()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cp=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class k{constructor(e,t,i,o,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,o){const n=this.strings;let a=!1;if(void 0===n)e=S(this,e,t,0),a=!d(e)||e!==this._$AH&&e!==T,a&&(this._$AH=e);else{const o=e;let r,s;for(e=n[0],r=0;r<n.length-1;r++)s=S(this,o[i+r],t,r),s===T&&(s=this._$AH[r]),a||(a=!d(s)||s!==this._$AH[r]),s===A?e=A:e!==A&&(e+=(null!=s?s:"")+n[r+1]),this._$AH[r]=s}a&&!o&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class H extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4}j(e){e&&e!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name)}}class z extends k{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=S(this,e,t,0))&&void 0!==i?i:A)===T)return;const o=this._$AH,n=e===A&&o!==A||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,a=e!==A&&(o===A||n);n&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class Z{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}}const B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.8.0");const D=(e,t,i)=>{var o,n;const a=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:t;let r=a._$litPart$;if(void 0===r){const e=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;a._$litPart$=r=new R(t.insertBefore(u(),e),e,void 0,null!=i?i:{})}return r._$AI(e),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=D(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s}),(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */,inputFieldShared=[fieldShared,inputFieldContainer,clearButton];
/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
class GridFilterColumn extends GridColumn{static get is(){return"vaadin-grid-filter-column"}static get properties(){return{path:String,header:String}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)"]}constructor(){super(),this.__boundOnFilterValueChanged=this.__onFilterValueChanged.bind(this)}_defaultHeaderRenderer(e,t){let i=e.firstElementChild,o=i?i.firstElementChild:void 0;i||(i=document.createElement("vaadin-grid-filter"),o=document.createElement("vaadin-text-field"),o.setAttribute("slot","filter"),o.setAttribute("theme","small"),o.setAttribute("style","max-width: 100%;"),o.setAttribute("focus-target",""),o.addEventListener("value-changed",this.__boundOnFilterValueChanged),i.appendChild(o),e.appendChild(i)),i.path=this.path,i.value=this._filterValue,o.__rendererValue=this._filterValue,o.value=this._filterValue,o.label=this.__getHeader(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}__onFilterValueChanged(e){e.detail.value!==e.target.__rendererValue&&(this._filterValue=e.detail.value)}__getHeader(e,t){return e||(t?this._generateHeader(t):void 0)}}customElements.define(GridFilterColumn.is,GridFilterColumn);var __decorate$7=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpUsersGrid=class extends YpBaseElement{updated(e){super.updated(e),e.has("groupId")&&this._groupIdChanged(),e.has("communityId")&&this._communityIdChanged(),e.has("domainId")&&this._domainIdChanged(),e.has("adminUsers")&&this.users&&(this.showReload=!1,this._reload()),this._setupHeaderText()}static get styles(){return[super.styles,i$2`
        .userItem {
          padding-right: 16px;
        }

        .id {
          width: 40px;
        }

        .name {
          width: 200px;
        }

        vaadin-grid {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-medium-font-family-name);
          font-size: var(--md-sys-typescale-body-medium-font-size);
          font-weight: var(--md-sys-typescale-body-medium-font-weight);
          line-height: var(--md-sys-typescale-body-medium-line-height);
        }

        vaadin-grid::part(header-cell) {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: var(--md-sys-typescale-title-small-font-weight);
        }

        vaadin-grid::part(cell) {
          color: var(--md-sys-color-on-surface-container);
        }

        vaadin-grid::part(body-cell) {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        vaadin-grid::part(row) {
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);
        }

        vaadin-grid::part(row):nth-child(even) {
          background-color: var(--md-sys-color-surface-variant);
        }

        vaadin-grid::part(row:hover) {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        vaadin-grid::part(selected-row) {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        /* Ensure proper spacing and alignment */
        vaadin-grid-cell-content {
          padding: 12px 16px;
        }

        /* Style for the sort indicators */
        vaadin-grid-sorter {
          color: var(--md-sys-color-on-surface-variant);
        }

        vaadin-grid-sorter[direction] {
          color: var(--md-sys-color-primary);
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
            `:T$1}
        <div slot="actions">
          <md-filled-button @click="${this.closeOrganizationDialog}"
            >${this.t("Close")}</md-filled-button
          >
        </div>
      </md-dialog>
    `}get spinnerActive(){return!this.totalUserCount||this.forceSpinner}async _generateRequest(e=void 0){e?this.lastFethedId=e:e=this.lastFethedId;const t=this.adminUsers?"admin_users":"users",i=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${e}/${t}`,"GET");this._usersResponse({detail:i})}async _ajaxError(e=void 0){this.forceSpinner=!1}constructor(e){super(),this.adminUsers=!1,this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.showReload=!1,this.forceSpinner=!1,this.inviteType="sendInviteByEmail",this.collectionName=e}connectedCallback(){super.connectedCallback(),this._setGridSize(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}async _reload(){try{await this._generateRequest(),this.forceSpinner=!0}catch(e){this._ajaxError()}finally{this.forceSpinner=!1}}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=window.setTimeout((()=>{this.resizeTimeout=void 0,this._setGridSize()}),66))}_setGridSize(){this.gridElement&&(window.innerWidth<=600?this.gridElement.style.height=`${window.innerHeight}px`:this.gridElement.style.height=.8*window.innerHeight+"px")}_menuSelection(e){const t=this.shadowRoot?.querySelectorAll("md-menu");t?.forEach((e=>{e.select("")}))}get totalUserCount(){return this.users?YpFormattingHelpers.number(this.users.length):null}_selectedUsersChanged(e){e.detail&&e.detail.value&&(this.selectedUsers=e.detail.value),this.selectedUsers&&this.selectedUsers.length>0?(this.selectedUsersEmpty=!1,this.selectedUsersCount=this.selectedUsers.length,this.selectedUserIds=this.selectedUsers.map((e=>e.id))):(this.selectedUsersEmpty=!0,this.selectedUsersCount=0,this.selectedUserIds=[])}_userOrganizationId(e){return e&&e.OrganizationUsers&&e.OrganizationUsers.length>0?e.OrganizationUsers[0].id:null}_userOrganizationName(e){return e&&e.OrganizationUsers&&e.OrganizationUsers.length>0?e.OrganizationUsers[0].name:null}_availableOrganizations(){return window.appUser.adminRights?.OrganizationAdmins||[]}async _addToOrganization(e){this.userIdForSelectingOrganization=parseInt(e.target.getAttribute("data-args")),this.availableOrganizations=this._availableOrganizations(),this.shadowRoot.getElementById("selectOrganizationDialog").show()}closeOrganizationDialog(){this.shadowRoot.getElementById("selectOrganizationDialog").close()}async _removeFromOrganization(e){const t=e.target,i=t.getAttribute("data-args"),o=t.getAttribute("data-args-org");try{await window.adminServerApi.removeUserFromOrganization(parseInt(o),parseInt(i)),this._reload()}catch(e){this._ajaxError(e)}}async _selectOrganization(e){const t=e.target.id;try{await window.adminServerApi.addUserToOrganization(parseInt(t),this.userIdForSelectingOrganization),this.shadowRoot.getElementById("selectOrganizationDialog").close(),this._reload()}catch(e){this._ajaxError(e)}}async _removeAdmin(e){const t=parseInt(e.target.getAttribute("data-args"));try{"groups"===this.modelType&&this.groupId?await window.adminServerApi.removeAdmin("groups",this.groupId,t):"communities"===this.modelType&&this.communityId?await window.adminServerApi.removeAdmin("communities",this.communityId,t):"domains"===this.modelType&&this.domainId?await window.adminServerApi.removeAdmin("domains",this.domainId,t):console.warn("Can't find model type or ids"),this._reload()}catch(e){this._ajaxError(e)}}_removeSelectedAdmins(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToRemoveAdmins"),this._reallyRemoveSelectedAdmins.bind(this),!0,!1)}))}_removeAndDeleteContentSelectedUsers(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveAndDeleteSelectedUserContent"),this._reallyRemoveAndDeleteContentSelectedUsers.bind(this),!0,!0)}))}_removeSelectedUsersFromCollection(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveSelectedUsers"),this._reallyRemoveSelectedUsersFromCollection.bind(this),!0,!0)}))}_removeUserFromCollection(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveUser"),this._reallyRemoveUserFromCollection.bind(this),!0,!1)}))}_removeAndDeleteUserContent(e){this._setupUserIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureRemoveAndDeleteUser"),this._reallyRemoveAndDeleteUserContent.bind(this),!0,!0)}))}async _removeMaster(e,t=void 0){let i,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else{if("domains"!==this.modelType||!this.domainId)return void console.error("Can't find model type or ids");o=this.domainId}if(t&&t.length>0)i=`/api/${this.modelType}/${o}/${e}`;else{if(!this.selectedUserId)return void console.error("No user ids to remove");i=`/api/${this.modelType}/${o}/${this.selectedUserId}/${e}`}const n=t?{userIds:t}:{};try{this.forceSpinner=!0,await window.adminServerApi.adminMethod(i,"DELETE",n),this._manyItemsResponse(!0)}catch(e){console.error(e),this._ajaxError(e)}finally{this.forceSpinner=!1}if(this.selectedUserId){const e=this._findUserFromId(this.selectedUserId);e&&this.gridElement instanceof GridElement&&this.gridElement.deselectItem(e)}}async _reallyRemoveSelectedAdmins(){await this._removeMaster("remove_many_admins",this.selectedUserIds)}async _reallyRemoveAndDeleteContentSelectedUsers(){await this._removeMaster("remove_many_users_and_delete_content",this.selectedUserIds)}async _reallyRemoveSelectedUsersFromCollection(){await this._removeMaster("remove_many_users",this.selectedUserIds)}async _reallyRemoveUserFromCollection(){await this._removeMaster("remove_user")}async _reallyRemoveAndDeleteUserContent(){await this._removeMaster("remove_and_delete_user_content")}_setupUserIdFromEvent(e){const t=e.target;let i=t.parentElement.getAttribute("data-args");i||(i=t.getAttribute("data-args")),i&&(this.selectedUserId=parseInt(i))}_openAllMenu(e){this.$$("#allUsersMenu").open=!0}_setSelected(e){const t=e.target.getAttribute("data-args");if(t){const e=this._findUserFromId(parseInt(t));e&&this.$$("#grid").selectItem(e)}setTimeout((()=>{this.$$(`#userItemMenu${t}`).open=!0}))}_findUserFromId(e){let t;return this.users.forEach((i=>{i.id==e&&(t=i)})),t}async _addAdmin(e){try{let e;if("groups"===this.modelType&&this.groupId&&this.addAdminEmail)e=await window.adminServerApi.addAdmin("groups",this.groupId,this.addAdminEmail.value);else if("communities"===this.modelType&&this.communityId&&this.addAdminEmail&&this.addAdminEmail.value)e=await window.adminServerApi.addAdmin("communities",this.communityId,this.addAdminEmail.value);else{if(!("domains"===this.modelType&&this.domainId&&this.addAdminEmail&&this.addAdminEmail.value))return void console.warn("Can't find model type or ids");e=await window.adminServerApi.addAdmin("domains",this.domainId,this.addAdminEmail.value)}this._addAdminResponse()}catch(e){this._ajaxError(e)}}async _inviteUser(e){try{let e;if("groups"===this.modelType&&this.groupId&&this.inviteUserEmail&&this.inviteUserEmail.value)e=await window.adminServerApi.inviteUser("groups",this.groupId,this.inviteUserEmail.value,this.inviteType);else{if("communities"!==this.modelType||!this.communityId||!this.inviteUserEmail.value)return void console.warn("Can't find model type or ids");e=await window.adminServerApi.inviteUser("communities",this.communityId,this.inviteUserEmail.value,this.inviteType)}this._inviteUserResponse()}catch(e){this._ajaxError(e)}}_manyItemsResponse(e=!1){this.forceSpinner=!1,this.showReload=!0,e&&window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading")),setTimeout((()=>{this._reload()}),500)}_removeAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminRemoved")),this._reload()}_removeManyAdminResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeManyUsersResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeAndDeleteCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalAndDeletionInProgress"),void 0,!0,!1,!0)})),this._removeUserResponse()}_removeAndDeleteManyCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("removalsAndDeletionsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeUserResponse(){window.appGlobals.notifyUserViaToast(this.t("userRemoved")),this._reload()}_addAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminAdded")+" "+this.addAdminEmail.value),this.addAdminEmail.value="",this._reload()}_addOrganizationResponse(e){window.appGlobals.notifyUserViaToast(this.t("organizationUserAdded")+" "+e.detail.response.email),this._reload()}_removeOrganizationResponse(e){window.appGlobals.notifyUserViaToast(this.t("organizationUserRemoved")+" "+e.detail.response.email),this._reload()}_inviteUserResponse(){window.appGlobals.notifyUserViaToast(this.t("users.userInvited")+" "+this.inviteUserEmail.value),this.$$("#inviteUserEmail").value="",this._reload()}_domainIdChanged(){this.domainId&&(this._reset(),this.modelType="domains",this._generateRequest(this.domainId))}_groupIdChanged(){this.groupId&&(this._reset(),this.modelType="groups",this._generateRequest(this.groupId))}_communityIdChanged(){this.communityId&&(this._reset(),this.modelType="communities",this._generateRequest(this.communityId))}_usersResponse(e){this.forceSpinner=!1,this.users=e.detail,this._resetSelectedAndClearCache()}setup(e,t,i,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.users=void 0,this.adminUsers=o,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),this._setupHeaderText()}_reset(){this.users=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedUsers=[],this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.$$("#grid").clearCache()}_setupHeaderText(){this.adminUsers?this.usersCountText=this.t("adminsCount"):this.usersCountText=this.t("usersCount"),this.groupId?this.adminUsers?this.headerText=this.t("group.admins"):this.headerText=this.t("group.users"):this.communityId?this.adminUsers?this.headerText=this.t("community.admins"):this.headerText=this.t("community.users"):this.domainId&&(this.adminUsers?this.headerText=this.t("domainAdmins"):this.headerText=this.t("domainUsers"))}};__decorate$7([e$3("#addAdminEmail")],YpUsersGrid.prototype,"addAdminEmail",void 0),__decorate$7([e$3("#inviteUserEmail")],YpUsersGrid.prototype,"inviteUserEmail",void 0),__decorate$7([n$4({type:String})],YpUsersGrid.prototype,"headerText",void 0),__decorate$7([n$4({type:Array})],YpUsersGrid.prototype,"users",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"groupId",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"communityId",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"domainId",void 0),__decorate$7([n$4({type:Boolean})],YpUsersGrid.prototype,"adminUsers",void 0),__decorate$7([n$4({type:Object})],YpUsersGrid.prototype,"selected",void 0),__decorate$7([n$4({type:String})],YpUsersGrid.prototype,"modelType",void 0),__decorate$7([n$4({type:Array})],YpUsersGrid.prototype,"availableOrganizations",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"userIdForSelectingOrganization",void 0),__decorate$7([n$4({type:Array})],YpUsersGrid.prototype,"selectedUsers",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"selectedUsersCount",void 0),__decorate$7([n$4({type:Boolean})],YpUsersGrid.prototype,"selectedUsersEmpty",void 0),__decorate$7([n$4({type:Array})],YpUsersGrid.prototype,"selectedUserIds",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"selectedUserId",void 0),__decorate$7([n$4({type:String})],YpUsersGrid.prototype,"collectionName",void 0),__decorate$7([n$4({type:String})],YpUsersGrid.prototype,"usersCountText",void 0),__decorate$7([n$4({type:Boolean})],YpUsersGrid.prototype,"showReload",void 0),__decorate$7([n$4({type:Boolean})],YpUsersGrid.prototype,"forceSpinner",void 0),__decorate$7([n$4({type:Number})],YpUsersGrid.prototype,"lastFethedId",void 0),__decorate$7([e$3("#grid")],YpUsersGrid.prototype,"gridElement",void 0),__decorate$7([n$4({type:String})],YpUsersGrid.prototype,"inviteType",void 0),YpUsersGrid=__decorate$7([t$2("yp-users-grid")],YpUsersGrid);var __decorate$6=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpContentModeration=class extends YpBaseElement{constructor(){super(...arguments),this.multiSortEnabled=!1,this.opened=!1,this.showReload=!1,this.forceSpinner=!1,this.selectedItemsEmpty=!0,this.selectedItemsCount=0,this.typeOfModeration="moderate_all_content",this.allowGridEventsAfterMenuOpen=!1}updated(e){super.updated(e),(e.has("groupId")||e.has("communityId")||e.has("domainId")||e.has("userId"))&&this._refreshAfterChange(),e.has("activeItem")&&this._activeItemChanged(this.activeItem,e.get("activeItem"))}static get styles(){return[super.styles,i$2`
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

        vaadin-grid {
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          font-family: var(--md-sys-typescale-body-medium-font-family-name);
          font-size: var(--md-sys-typescale-body-medium-font-size);
          font-weight: var(--md-sys-typescale-body-medium-font-weight);
          line-height: var(--md-sys-typescale-body-medium-line-height);
        }

        vaadin-grid::part(header-cell) {
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: var(--md-sys-typescale-title-small-font-weight);
        }

        vaadin-grid::part(cell) {
          color: var(--md-sys-color-on-surface-container);
        }

        vaadin-grid::part(body-cell) {
          background-color: var(--md-sys-color-surface-container-lowest);
          border-bottom: 1px solid var(--md-sys-color-outline-variant);
        }

        vaadin-grid::part(row) {
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);
        }

        vaadin-grid::part(row):nth-child(even) {
          background-color: var(--md-sys-color-surface-variant);
        }

        vaadin-grid::part(row:hover) {
          background-color: var(--md-sys-color-surface-container-highest);
        }

        vaadin-grid::part(selected-row) {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }

        /* Ensure proper spacing and alignment */
        vaadin-grid-cell-content {
          padding: 12px 16px;
        }

        /* Style for the sort indicators */
        vaadin-grid-sorter {
          color: var(--md-sys-color-on-surface-variant);
        }

        vaadin-grid-sorter[direction] {
          color: var(--md-sys-color-primary);
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
              `:T$1}
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
              `:T$1}
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
            `:T$1}
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
        .renderer="${(e,t,i)=>{e.textContent=this._getType(i.item.type)}}"
        .header="${this.t("type")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="start"
        flexGrow="0"
        .renderer="${(e,t,i)=>{e.textContent=i.item.status||"unknown"}}"
        path="status"
        .header="${this.t("publishStatus")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="center"
        flexGrow="0"
        path="counter_flags"
        .renderer="${(e,t,i)=>{e.textContent=`${i.item.counter_flags}`}}"
        .header="${this.t("flags")}"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="130px"
        textAlign="start"
        flexGrow="0"
        path="source"
        .renderer="${(e,t,i)=>{e.textContent=i.item.source||"n/a"}}"
        .header="${this.t("source")}"
        ?hidden="${!this.onlyFlaggedItems}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="105px"
        textAlign="center"
        flexGrow="0"
        path="toxicityScoreRaw"
        .renderer="${(e,t,i)=>{e.textContent=`${i.item.toxicityScore||"n/a"}`}}"
        .header="${this.t("toxicityScore")}?"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="150px"
        textAlign="start"
        flexGrow="1"
        path="groupName"
        .renderer="${(e,t,i)=>{e.textContent=`${i.item.groupName}`}}"
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
        .renderer="${(e,t,i)=>{e.textContent=`${i.item.user_email||"n/a"}`}}"
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
    `}get spinnerActive(){return!this.totalItemsCount||this.forceSpinner}_ajaxError(e=void 0){this.forceSpinner=!1}async _reload(){this.forceSpinner=!0,await this._refreshAfterChange(),this.forceSpinner=!1}async _masterRequest(e,t=void 0){let i,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else if("domains"===this.modelType&&this.domainId)o=this.domainId;else{if("users"!==this.modelType||!this.userId)return void console.error("Can't find model type or ids");o=this.userId}try{if(t&&t.length>0)i=`/api/${this.modelType}/${o}/${e}/process_many_moderation_item`,await window.adminServerApi.adminMethod(i,"PUT",t);else{if(!this.selectedItemId||!this.selectedModelClass)return void console.error("No item ids to process");i=`/api/${this.modelType}/${o}/${this.selectedItemId}/${this.selectedModelClass}/${e}/process_one_moderation_item`,await window.adminServerApi.adminMethod(i,"PUT")}this.forceSpinner=!0,this._resetSelectedAndClearCache()}catch(e){this._ajaxError(e)}}async _generateRequest(e){try{const t=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${e}/${this.typeOfModeration}`,"GET");this.items=t}catch(e){this._ajaxError(e)}}_itemsResponse(e){this.forceSpinner=!1,this.items=e,this._resetSelectedAndClearCache()}get onlyFlaggedItems(){return"flagged_content"===this.typeOfModeration}_manyItemsResponse(){this.forceSpinner=!1,this.showReload=!0,window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading"))}_singleItemResponse(){this._reload()}_menuSelection(){this.renderRoot.querySelectorAll("md-menu").forEach((e=>{e.open=!1})),this._refreshGridAsync()}async _reallyAnonymize(){await this._masterRequest("anonymize")}async _reallyAnonymizeSelected(){await this._masterRequest("anonymize",this.selectedItemIdsAndType)}async _reallyDelete(){await this._masterRequest("delete")}async _reallyDeleteSelected(){await this._masterRequest("delete",this.selectedItemIdsAndType)}async _approve(e){this._setupItemIdFromEvent(e),await this._masterRequest("approve")}async _approveSelected(e){this._setupItemIdFromEvent(e),await this._masterRequest("approve",this.selectedItemIdsAndType)}async _block(e){this._setupItemIdFromEvent(e),await this._masterRequest("block")}async _blockSelected(e){this._setupItemIdFromEvent(e),await this._masterRequest("block",this.selectedItemIdsAndType)}async _clearFlags(e){this._setupItemIdFromEvent(e),await this._masterRequest("clearFlags")}async _clearSelectedFlags(e){this._setupItemIdFromEvent(e),await this._masterRequest("clearFlags",this.selectedItemIdsAndType)}async _refreshAfterChange(){this.domainId&&(this._reset(),this.modelType="domains",await this._generateRequest(this.domainId)),this.groupId&&(this._reset(),this.modelType="groups",await this._generateRequest(this.groupId)),this.communityId&&(this._reset(),this.modelType="communities",await this._generateRequest(this.communityId)),this.userId&&(this._reset(),this.modelType="users",await this._generateRequest(this.userId)),this._setupHeaderText()}_domainIdChanged(){}_groupIdChanged(){}_communityIdChanged(){}_userIdChanged(){}_getType(e){return"post"===e?this.t("posts.posts"):"point"===e?this.t("point.point"):this.t("unknown")}_activeItemChanged(e,t){e&&this.$$("#grid").openItemDetails(e),t&&this.$$("#grid").closeItemDetails(t),this._refreshGridAsync()}_refreshGridAsync(){this._refreshGridAsyncBase(10)}_refreshGridAsyncDelay(){this.allowGridEventsAfterMenuOpen&&this._refreshGridAsyncBase(250)}_refreshGridAsyncBase(e){setTimeout((()=>{this.$$("#grid").notifyResize()}),e)}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}firstUpdated(e){super.firstUpdated(e),this._setGridSize()}_toPercent(e){return e?Math.round(100*e)+"%":null}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=setTimeout((()=>{this.resizeTimeout=null,this._setGridSize()}),66))}_setGridSize(){window.innerWidth<=600?(this.$$("#grid").style.width=window.innerWidth.toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px"):(this.$$("#grid").style.width=(window.innerWidth-16).toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px")}get totalItemsCount(){return this.items?YpFormattingHelpers.number(this.items.length):null}_selectedItemsChanged(){this.selectedItems&&this.selectedItems.length>0?(this.selectedItemsEmpty=!1,this.selectedItemsCount=this.selectedItems.length):(this.selectedItemsEmpty=!0,this.selectedItemsCount=0),this.selectedItemIdsAndType=this.selectedItems.map((e=>({id:e.id,modelType:e.type}))),this._refreshGridAsyncDelay()}_setupItemIdFromEvent(e){const t=e.target;if(null!=t){let e=t.parentElement.getAttribute("data-args");e||(e=t.getAttribute("data-args")),e&&(this.selectedItemId=parseInt(e));let i=t.parentElement.getAttribute("data-model-class");i||(i=t.getAttribute("data-model-class")),this.selectedModelClass=i,this._refreshGridAsync()}}_deleteSelected(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureDeleteSelectedContent"),this._reallyDeleteSelected.bind(this),!0,!0)}))}_delete(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureDeleteContent"),this._reallyDelete.bind(this),!0,!1)}))}_anonymizeSelected(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureAnonymizeSelectedContent"),this._reallyAnonymizeSelected.bind(this),!0,!0)}))}_anonymize(e){this._setupItemIdFromEvent(e),window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureAnonymizeContent"),this._reallyAnonymize.bind(this),!0,!1)}))}_menuOpened(){this.allowGridEventsAfterMenuOpen=!0}_setSelected(e){const t=e.target.getAttribute("data-args");if(t){const e=this._findItemFromId(parseInt(t));e&&this.$$("#grid").selectItem(e),this.allowGridEventsAfterMenuOpen=!0,this._refreshGridAsync()}}_findItemFromId(e){let t;return this.items?this.items.forEach((i=>{i.id==e&&(t=i)})):console.warn("No item for _findItemFromId"),t}setup(e,t,i,o,n){this.typeOfModeration=o||"flagged_content",this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.userId=void 0,this.items=void 0,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),n&&(this.userId=n),this._setupHeaderText()}open(e){this.collectionName=e}_reset(){this.items=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedItemsCount=0,this.selectedItemsEmpty=!0,this.selectedItemIdsAndType=[],this.selectedItems=[],this.$$("#grid").clearCache()}_setupHeaderText(){this.onlyFlaggedItems?this.itemsCountText=this.t("contentItemsFlagged"):this.itemsCountText=this.t("items"),this.groupId?this.headerText=this.t("groupContentModeration"):this.communityId?this.headerText=this.t("communityContentModeration"):this.domainId?this.headerText=this.t("domainContentModeration"):this.userId&&(this.headerText=this.t("userContentModeration"))}};__decorate$6([n$4({type:Boolean})],YpContentModeration.prototype,"multiSortEnabled",void 0),__decorate$6([n$4({type:Boolean})],YpContentModeration.prototype,"opened",void 0),__decorate$6([n$4({type:Boolean})],YpContentModeration.prototype,"showReload",void 0),__decorate$6([n$4({type:Boolean})],YpContentModeration.prototype,"forceSpinner",void 0),__decorate$6([n$4({type:Boolean})],YpContentModeration.prototype,"selectedItemsEmpty",void 0),__decorate$6([n$4({type:Array})],YpContentModeration.prototype,"items",void 0),__decorate$6([n$4({type:Array})],YpContentModeration.prototype,"selectedItems",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"headerText",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"groupId",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"communityId",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"domainId",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"userId",void 0),__decorate$6([n$4({type:Object})],YpContentModeration.prototype,"selected",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"modelType",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"selectedItemsCount",void 0),__decorate$6([n$4({type:Array})],YpContentModeration.prototype,"selectedItemIdsAndType",void 0),__decorate$6([n$4({type:Number})],YpContentModeration.prototype,"selectedItemId",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"selectedModelClass",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"collectionName",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"itemsCountText",void 0),__decorate$6([n$4({type:Object})],YpContentModeration.prototype,"resizeTimeout",void 0),__decorate$6([n$4({type:String})],YpContentModeration.prototype,"typeOfModeration",void 0),__decorate$6([n$4({type:Object})],YpContentModeration.prototype,"activeItem",void 0),YpContentModeration=__decorate$6([t$2("yp-content-moderation")],YpContentModeration);var __decorate$5=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpPagesGrid=class extends YpBaseElement{updated(e){super.updated(e),(e.has("groupId")||e.has("communityId")||e.has("domainId"))&&this._updateCollection()}static get styles(){return[super.styles,i$2`
        #dialog {
          width: 90%;
          max-height: 90%;
        }

        .pageItem {
          padding-right: 16px;
          padding-top: 8px;
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

        .localeInputContasiner {
          padding: 2px;
          margin-bottom: 8px;
          border: solid 1px #999;
        }

        .buttons {
          margin-right: 16px;
        }

        .addLocaleButton {
          margin-right: 16px;
        }

        .pageControls {
          display: flex;
          gap: 8px;
        }

        #addPageButton {
          margin: 24px;
        }

        .pageRow {
          display: flex;
          align-items: center;
          margin: 16px;
        }

        .title {
          width: 200px;
          max-width: 200px;
        }
      `]}titleChanged(){this.currentlyEditingTitle=this.$$("#title").value}contentChanged(){this.currentlyEditingContent=this.$$("#content").value}render(){return this.pages?x`
        <h2>${this.headerText}</h2>
        <div id="scrollable">
          ${this.pages?.map((e=>x`
              <div class="pageRow">
                <div class="pageItem id">${e.id}</div>
                <div class="pageItem title">${e.title.en}</div>
                <div class="pageControls">
                  ${this._toLocaleArray(e.title).map((t=>x`
                      <md-text-button
                        class="locale"
                        data-args-page="${JSON.stringify(e)}"
                        data-args-locale="${t.locale}"
                        @click="${this._editPageLocale}"
                        >${t.locale}</md-text-button
                      >
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
      `:T$1}_toLocaleArray(e){return Object.keys(e).map((t=>({locale:t,value:e[t]}))).sort(((e,t)=>e.value.localeCompare(t.value)))}async _editPageLocale(e){const t=e.target,i=t.getAttribute("data-args-page");this.currentlyEditingPage=JSON.parse(i),this.currentlyEditingLocale=t.getAttribute("data-args-locale"),this.currentlyEditingContent=this.currentlyEditingPage.content[this.currentlyEditingLocale],this.currentlyEditingTitle=this.currentlyEditingPage.title[this.currentlyEditingLocale];const o=this.shadowRoot.querySelector("#editPageLocale");o&&(o.open=!0)}_closePageLocale(){this.currentlyEditingPage=void 0,this.currentlyEditingLocale=void 0,this.currentlyEditingContent=void 0,this.currentlyEditingTitle=void 0,this.$$("#editPageLocale").close()}async _dispatchAdminServerApiRequest(e,t,i,o={}){let n=e?`/${e}/${t}`:`/${t}`,a="";if("groups"===this.modelType&&this.groupId)a=`/api/${this.modelType}/${this.groupId}${n}`;else if("communities"===this.modelType&&this.communityId)a=`/api/${this.modelType}/${this.communityId}${n}`;else{if("domains"!==this.modelType||!this.domainId)return void console.warn("Can't find model type or ids");a=`/api/${this.modelType}/${this.domainId}${n}`}try{return await window.adminServerApi.adminMethod(a,i,o)}catch(e){console.error("Error dispatching admin server API request:",e)}}async _updatePageLocale(){await this._dispatchAdminServerApiRequest(this.currentlyEditingPage.id,"update_page_locale","PUT",{locale:this.currentlyEditingLocale,content:this.currentlyEditingContent,title:this.currentlyEditingTitle}),this._updateCollection(),this._closePageLocale()}async _publishPage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"publish_page","PUT"),this._publishPageResponse()}async _publishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pagePublished")),await this._unPublishPageResponse()}async _unPublishPage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"un_publish_page","PUT"),this._unPublishPageResponse()}async _unPublishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageUnPublished")),await this._updateCollection()}async _refreshPages(){await this._dispatchAdminServerApiRequest(void 0,"pages","GET")}async _deletePage(e){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"delete_page","DELETE"),this._deletePageResponse()}async _deletePageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageDeleted")),await this._updateCollection()}async _addLocale(e){if(this.newLocaleInput&&this.newLocaleInput.value.length>1){const t=e.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(t),"update_page_locale","PUT",{locale:this.newLocaleInput.value.toLowerCase(),content:"",title:""}),this._updateCollection()}}async _addPage(){const e=this.shadowRoot.querySelector("#addPageButton");e&&(e.disabled=!0),await this._dispatchAdminServerApiRequest(void 0,"add_page","POST"),this._generateRequest(),e&&(e.disabled=!1)}async _newPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.newPageCreated")),await this._refreshPages()}async _updatePageResponse(){window.appGlobals.notifyUserViaToast(this.t("posts.updated")),await this._refreshPages()}_updateCollection(){this.domainId&&(this.modelType="domains",this._generateRequest(this.domainId)),this.groupId&&(this.modelType="groups",this._generateRequest(this.groupId)),this.communityId&&(this.modelType="communities",this._generateRequest(this.communityId))}async _generateRequest(e=void 0){this.pages=await this._dispatchAdminServerApiRequest(void 0,"pages_for_admin","GET")}_pagesResponse(e){this.pages=e.detail.response}setup(e,t,i,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.pages=void 0,e&&(this.groupId=e),t&&(this.communityId=t),i&&(this.domainId=i),this._setupHeaderText()}open(){const e=this.shadowRoot.querySelector("#dialog");e&&(e.open=!0)}_setupHeaderText(){this.groupId?this.headerText=this.t("group.pages"):this.communityId?this.headerText=this.t("community.pages"):this.domainId&&(this.headerText=this.t("domain.pages"))}};__decorate$5([n$4({type:Array})],YpPagesGrid.prototype,"pages",void 0),__decorate$5([n$4({type:String})],YpPagesGrid.prototype,"headerText",void 0),__decorate$5([n$4({type:Number})],YpPagesGrid.prototype,"domainId",void 0),__decorate$5([n$4({type:Number})],YpPagesGrid.prototype,"communityId",void 0),__decorate$5([n$4({type:Number})],YpPagesGrid.prototype,"groupId",void 0),__decorate$5([n$4({type:Object})],YpPagesGrid.prototype,"currentlyEditingPage",void 0),__decorate$5([n$4({type:String})],YpPagesGrid.prototype,"modelType",void 0),__decorate$5([e$3("#localeInput")],YpPagesGrid.prototype,"newLocaleInput",void 0),__decorate$5([n$4({type:String})],YpPagesGrid.prototype,"currentlyEditingLocale",void 0),__decorate$5([n$4({type:String})],YpPagesGrid.prototype,"currentlyEditingTitle",void 0),__decorate$5([n$4({type:String})],YpPagesGrid.prototype,"currentlyEditingContent",void 0),YpPagesGrid=__decorate$5([t$2("yp-pages-grid")],YpPagesGrid);var __decorate$4=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminTranslations=class extends YpAdminPage{static get styles(){return[super.styles,ShadowStyles,i$2`
        #mainSelect {
          text-align: right;
          margin-right: 22px;
          margin-top: 8px;
        }

        md-outlined-button {
          margin: 16px;
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
                  <md-outlined-button

                    @click="${()=>this.cancelEdit(e)}"
                  >${this.t("cancel")}</md-outlined-button>
                  <md-outlined-button

                    @click="${()=>this.saveItem(e)}"
                  >${this.t("save")}</md-outlined-button>
                </div>
              `:x`
                <div class="innerTranslatedText">
                  ${e.translatedText?e.translatedText:this.t("noTranslation")}
                </div>
                <div class="layout horizontal endAligned">
                  <md-outlined-button

                    @click="${()=>this.openEdit(e)}"
                  >${this.t("edit")}</md-outlined-button>
                  <md-outlined-button

                    ?hidden="${null!=e.translatedText}"
                    @click="${()=>this.autoTranslate(e)}"
                  >${this.t("autoTranslate")}</md-outlined-button>
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
          ${this.items?this.items.map((e=>this.renderItem(e))):T$1}
        </div>
      </div>
    `}};__decorate$4([n$4({type:Array})],YpAdminTranslations.prototype,"items",void 0),__decorate$4([n$4({type:Boolean})],YpAdminTranslations.prototype,"waitingOnData",void 0),__decorate$4([n$4({type:Object})],YpAdminTranslations.prototype,"editActive",void 0),__decorate$4([n$4({type:Object})],YpAdminTranslations.prototype,"collection",void 0),__decorate$4([n$4({type:String})],YpAdminTranslations.prototype,"targetLocale",void 0),__decorate$4([n$4({type:Number})],YpAdminTranslations.prototype,"baseMaxLength",void 0),YpAdminTranslations=__decorate$4([t$2("yp-admin-translations")],YpAdminTranslations);var __decorate$3=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminReports=class extends YpAdminPage{constructor(){super(...arguments),this.action="/api/communities",this.selectedTab=0,this.downloadDisabled=!1,this.autoTranslateActive=!1,this.fraudAuditSelectionActive=!1,this.waitingOnFraudAudits=!1}refresh(){this.reportUrl=void 0,this.reportGenerationUrl=void 0,this.error=void 0,this.progress=void 0,this.selectedFraudAuditId=void 0,this.fraudAuditsAvailable=void 0,this.waitingOnFraudAudits=!1,this.fraudAuditSelectionActive=!1,this._tabChanged()}connectedCallback(){super.connectedCallback(),"group"==this.collectionType&&this.collection&&this.collection.configuration.allOurIdeas?this.allOurIdeasQuestionId=this.collection.configuration.allOurIdeas?.earl?.question_id:this.allOurIdeasQuestionId=void 0,this.addGlobalListener("yp-refresh-admin-content",this.refresh.bind(this))}disconnectedCallback(){this.removeGlobalListener("yp-refresh-admin-content",this.refresh.bind(this)),super.disconnectedCallback()}fraudItemSelection(e){this.selectedFraudAuditId=parseInt(e.target.getAttribute("data-args")),this.startReportCreation()}startReportCreation(){let e=this.action;const t={selectedFraudAuditId:this.selectedFraudAuditId};this.progress=0,fetch(e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((e=>e.json())).then((e=>this.startReportCreationResponse(e))).catch((e=>{console.error("Error:",e),this.progress=void 0}))}startReportCreationResponse(e){this.jobId=e.jobId,this.progress=5;let t="group"==this.collectionType?`/api/groups/${this.collectionId}`:`/api/communities/${this.collectionId}`;this.allOurIdeasQuestionId?(t=`/api/allOurIdeas/${this.collectionId}`,this.reportCreationProgressUrl=`${t}/${this.jobId}/report_creation_progress?questionId=${this.allOurIdeasQuestionId}`):this.reportCreationProgressUrl=`${t}/${this.jobId}/report_creation_progress`,this.pollLaterForProgress()}pollLaterForProgress(){setTimeout((()=>{this.reportCreationProgress()}),1e3)}reportCreationProgress(){fetch(this.reportCreationProgressUrl).then((e=>e.json())).then((e=>this.reportCreationProgressResponse(e))).catch((e=>console.error("Error:",e)))}formatAuditReportDates(e){return e.map((e=>(e.date&&(e.date=new Date(e.date).toLocaleString()),e)))}fraudAuditsAjaxResponse(e){this.waitingOnFraudAudits=!1,this.fraudAuditsAvailable=this.formatAuditReportDates(e.detail.response)}reportCreationProgressResponse(e){!e.error&&null!=e.progress&&e.progress<100&&this.pollLaterForProgress(),this.progress=e.progress,e.error&&(this.error=this.t(e.error)),e.data&&(this.reportUrl=e.data.reportUrl,setTimeout((()=>{this.downloadDisabled=!0}),354e4))}updated(e){(e.has("type")||e.has("selectedFraudAuditId"))&&(this.fraudAuditSelectionActive="fraudAuditReport"===this.type&&!this.selectedFraudAuditId)}startGeneration(){if("fraudAuditReport"==this.type){this.waitingOnFraudAudits=!0,this.progress=0;const e=window.adminServerApi.adminMethod(this.reportGenerationUrl,"GET");this.waitingOnFraudAudits=!1,this.progress=void 0,this.fraudAuditsAvailable=this.formatAuditReportDates(e)}else this.startReportCreationAjax(this.reportGenerationUrl)}startReportCreationAjax(e){this.progress=0,fetch(e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({})}).then((e=>e.json())).then((e=>this.startReportCreationResponse(e))).catch((e=>console.error("Error:",e)))}getFraudAuditsAjax(e){fetch(e).then((e=>e.json())).then((e=>this.fraudAuditsAjaxResponse({detail:{response:e}}))).catch((e=>console.error("Error:",e)))}static get styles(){return[super.styles,i$2`
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
            ></md-linear-progress> `:T$1}
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
                `:T$1}
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
              `:T$1}
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
              `:T$1}
        </md-tabs>
      </div>
      <div class="layout vertical center-center">
        ${!this.reportGenerationUrl||this.reportUrl||this.fraudAuditsAvailable?this.renderDownload():this.renderStart()}
      </div>
    `}};__decorate$3([n$4({type:String})],YpAdminReports.prototype,"action",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"type",void 0),__decorate$3([n$4({type:Number})],YpAdminReports.prototype,"progress",void 0),__decorate$3([n$4({type:Number})],YpAdminReports.prototype,"selectedTab",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"error",void 0),__decorate$3([n$4({type:Number})],YpAdminReports.prototype,"jobId",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"reportUrl",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"reportGenerationUrl",void 0),__decorate$3([n$4({type:Boolean})],YpAdminReports.prototype,"downloadDisabled",void 0),__decorate$3([n$4({type:Number})],YpAdminReports.prototype,"allOurIdeasQuestionId",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"toastText",void 0),__decorate$3([n$4({type:Boolean})],YpAdminReports.prototype,"autoTranslateActive",void 0),__decorate$3([n$4({type:Number})],YpAdminReports.prototype,"selectedFraudAuditId",void 0),__decorate$3([r$3()],YpAdminReports.prototype,"fraudAuditSelectionActive",void 0),__decorate$3([n$4({type:Array})],YpAdminReports.prototype,"fraudAuditsAvailable",void 0),__decorate$3([n$4({type:Boolean})],YpAdminReports.prototype,"waitingOnFraudAudits",void 0),__decorate$3([n$4({type:String})],YpAdminReports.prototype,"reportCreationProgressUrl",void 0),YpAdminReports=__decorate$3([t$2("yp-admin-reports")],YpAdminReports);var __decorate$2=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpOrganizationEdit=class extends YpEditBase{constructor(){super(...arguments),this.organizationAccess="public",this.action="/organizations"}static get styles(){return[super.styles,i$2`
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
            />`:T$1}
      </yp-edit-dialog>
    `}clear(){this.organization={id:-1,name:"",description:"",website:""},this.uploadedLogoImageId=void 0,this.$$("#logoImageUpload").clear()}setup(e,t,i){this.clear(),e?(this.organization=e,this.action=`/organizations/${this.organization.id}`):(this.organization={id:-1,name:"",description:""},this.action=`/organizations/${this.domainId}`),this.new=t,this.refreshFunction=i,this.setupTranslation()}setupTranslation(){this.new?(this.editHeaderText=this.t("organization.new"),this.snackbarText=this.t("organization.toast.created"),this.saveText=this.t("create")):(this.editHeaderText=this.t("Update organization info"),this.snackbarText=this.t("organization.toast.updated"),this.saveText=this.t("update"))}};__decorate$2([n$4({type:Object})],YpOrganizationEdit.prototype,"organization",void 0),__decorate$2([n$4({type:String})],YpOrganizationEdit.prototype,"organizationAccess",void 0),__decorate$2([n$4({type:Number})],YpOrganizationEdit.prototype,"domainId",void 0),__decorate$2([n$4({type:String})],YpOrganizationEdit.prototype,"action",void 0),__decorate$2([n$4({type:Number})],YpOrganizationEdit.prototype,"uploadedLogoImageId",void 0),YpOrganizationEdit=__decorate$2([t$2("yp-organization-edit")],YpOrganizationEdit);var __decorate$1=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpOrganizationGrid=class extends YpBaseElement{static get styles(){return[super.styles,i$2`
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
    `}_deleteOrganization(e){this.organizationToDeleteId=e.id,window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDeleteThisOrganization"),this._reallyDeleteOrganization.bind(this),!0,!1)}))}async _reallyDeleteOrganization(){try{await window.adminServerApi.adminMethod(`/api/organizations/${this.organizationToDeleteId}`,"DELETE"),this.refresh()}catch(e){console.error(e)}}_afterEdit(){this.shadowRoot.getElementById("editDialog").close(),this.refresh()}_createOrganization(){const e=this.shadowRoot.getElementById("editDialog");e.setup(void 0,!0,this._afterEdit.bind(this)),e.open(!0,{})}_editOrganization(e){const t=this.shadowRoot.getElementById("editDialog");t.organization=e,t.setup(e,!1,this._afterEdit.bind(this)),t.open(!1,{})}_organizationImageUrl(e){return e.OrgLogoImgs?YpMediaHelpers.getImageFormatUrl(e.OrgLogoImgs,2):null}};__decorate$1([n$4({type:Array})],YpOrganizationGrid.prototype,"organizations",void 0),__decorate$1([n$4({type:String})],YpOrganizationGrid.prototype,"headerText",void 0),__decorate$1([n$4({type:String})],YpOrganizationGrid.prototype,"domainId",void 0),__decorate$1([n$4({type:Object})],YpOrganizationGrid.prototype,"selected",void 0),YpOrganizationGrid=__decorate$1([t$2("yp-organization-grid")],YpOrganizationGrid);var __decorate=function(e,t,i,o){for(var n,a=arguments.length,r=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,s=e.length-1;s>=0;s--)(n=e[s])&&(r=(a<3?n(r):a>3?n(t,i,r):n(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let YpAdminApp=class extends YpBaseElement{static get styles(){return[super.styles,i$2`
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
      `]}constructor(){super(),this.page="configuration",this.route="",this.userYpCollection=[],this.adminConfirmed=!1,this.haveCheckedAdminRights=!1,this.anchor=null,this._scrollPositionMap={},this._setupEventListeners(),this.updatePageFromPath()}updatePageFromPath(){let e=window.location.pathname;e=e.replace("/admin",""),e.endsWith("/")&&(e=e.substring(0,e.length-1)),e.startsWith("/")&&(e=e.substring(1,e.length));const t=e.split("/");this.collectionType=t[0],"organization"==t[0]&&(this.collectionType="domain"),"new"==t[1]&&t[2]?(this.collectionId="new",window.appGlobals.originalQueryParameters.createCommunityForGroup?this.parentCollectionId=window.appGlobals.domain?.id:this.parentCollectionId=parseInt(t[2]),this.page="configuration"):(this.collectionId=parseInt(t[1]),t.length>3?this.page=t[3]:t.length>2?this.page=t[2]:this.page="configuration")}firstUpdated(e){super.firstUpdated(e)}connectedCallback(){super.connectedCallback(),this.updateLocation()}updateLocation(){let e=window.location.pathname;e=e.replace("/admin","");const t=e.split("/"),i="/:page".split("/"),o={};structuredClone(this.routeData);for(let e=0;e<i.length;e++){const n=i[e];if(!n&&""!==n)break;const a=t.shift();if(!a&&""!==a)return;if(":"==n.charAt(0))o[n.slice(1)]=a;else if(n!==a)return}let n=t.join("/");t.length>0&&(n="/"+n),this.subRoute=n,this.route=e,this.routeData=o,this.updatePageFromPath()}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}_pageChanged(){this.page&&window.appGlobals.analytics.sendToAnalyticsTrackers("send","pageview",location.pathname)}tabChanged(e){0==e.detail.activeIndex?this.page="configuration":1==e.detail.activeIndex?this.page="moderation":3==e.detail.activeIndex?this.page="users":4==e.detail.activeIndex&&(this.page="admins")}_setupEventListeners(){this.addGlobalListener("yp-logged-in",this._setAdminFromParent.bind(this))}_refreshAdminRights(){window.appUser.recheckAdminRights()}_removeEventListeners(){this.addGlobalListener("yp-logged-in",this._setAdminFromParent.bind(this))}_refreshGroup(){this._refreshByName("#groupPage")}_refreshCommunity(){this._refreshByName("#communityPage")}_refreshDomain(){this._refreshByName("#domainPage")}_refreshByName(e){this.$$(e)}updated(e){super.updated(e),e.has("page")&&this._pageChanged(),e.has("collectionType")&&this.collectionId&&"new"!=this.collectionId?this.getCollection():e.has("collectionId")&&"new"==this.collectionId&&this._setAdminFromParent(),e.has("collection")}_needsUpdate(){this.requestUpdate()}updateFromCollection(){this.collection&&(this.collection={...this.collection})}renderGroupConfigPage(){return x`<yp-admin-config-group
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
        .parentCollectionId="${this.parentCollectionId}"
      >
      </yp-admin-config-domain>
    `}_renderPage(){if(!this.adminConfirmed)return T$1;switch(this.page){case"translations":return x`
            ${this.collection?x`<yp-admin-translations
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-admin-translations>`:T$1}
          `;case"organizations":return x`
            ${this.collection?x`<yp-organization-grid
                  .domain="${this.collection}"
                  .domainId="${this.collectionId}"
                >
                </yp-organizations-grid>`:T$1}
          `;case"reports":return x`
            ${this.collection?x`<yp-admin-reports
                  .collectionType="${this.collectionType}"
                  .collection="${this.collection}"
                  .collectionId="${this.collectionId}"
                >
                </yp-yp-admin-reports>`:T$1}
          `;case"communities":return x`
            ${this.collection?x`<yp-admin-communities .domain="${this.collection}">
                </yp-admin-communities>`:T$1}
          `;case"user":return x`
            ${x`<yp-admin-user-settings .user="${this.user}">
                </yp-admin-user-settings>`}
          `;case"groups":return x`
            ${this.collection?x`<yp-admin-groups .community="${this.collection}">
                </yp-admin-groups>`:T$1}
          `;case"configuration":switch(this.collectionType){case"domain":return x`
                ${this.collection||"new"===this.collectionId?this.renderDomainConfigPage():T$1}
              `;case"community":return x`
                ${this.collection||"new"===this.collectionId?this.renderCommunityConfigPage():T$1}
              `;case"group":return x`
                ${this.collection||"new"===this.collectionId?this.renderGroupConfigPage():T$1}
              `;default:return x``}case"users":case"admins":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .domainId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$1}
              `;case"community":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .communityId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$1}
              `;case"group":return x`
                ${this.collection?x`<yp-users-grid
                      .adminUsers="${"admins"==this.page}"
                      .groupId="${this.collectionId}"
                    >
                    </yp-users-grid>`:T$1}
              `;default:return x``}case"moderation":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-content-moderation
                      .domainId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$1}
              `;case"community":return x`
                ${this.collection?x`<yp-content-moderation
                      .communityId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$1}
              `;case"group":return x`
                ${this.collection?x`<yp-content-moderation
                      .groupId="${this.collectionId}"
                    >
                    </yp-content-moderation>`:T$1}
              `;default:return x``}case"pages":switch(this.collectionType){case"domain":return x`
                ${this.collection?x`<yp-pages-grid
                      .domainId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$1}
              `;case"community":return x`
                ${this.collection?x`<yp-pages-grid
                      .communityId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$1}
              `;case"group":return x`
                ${this.collection?x`<yp-pages-grid
                      .groupId="${this.collectionId}"
                    >
                    </yp-pages-grid>`:T$1}
              `;default:return x``}default:return x``}}async getCollection(){const e=await window.serverApi.getCollection(this.collectionType,this.collectionId);"group"==this.collectionType?(this.collection=e.group,this.collection.configuration||(this.collection.configuration={})):this.collection=e,this._setAdminConfirmed()}async _getAdminCollection(){switch(this.collectionType){case"community":case"domain":const e=await window.serverApi.getCollection("domain",this.parentCollectionId);this._setAdminConfirmedFromParent(e);break;case"group":if(window.appGlobals.originalQueryParameters.createCommunityForGroup){const e=await window.serverApi.getCollection("domain",this.parentCollectionId);this._setAdminConfirmedFromParent(e)}else{const e=await window.serverApi.getCollection("community",this.parentCollectionId);this._setAdminConfirmedFromParent(e)}break;default:this.fire("yp-network-error",{message:this.t("unauthorized")})}}async _setAdminFromParent(){window.appGlobals.originalQueryParameters.createCommunityForGroup&&(this.parentCollectionId=window.appGlobals.domain?.id);await(async e=>new Promise(((t,i)=>{const o=setInterval((()=>{window.appUser.loggedIn()?(clearInterval(o),t(!0)):--e<=0&&(clearInterval(o),t(!1))}),100)})))(7)?this._getAdminCollection():window.appUser.openUserlogin()}_setAdminConfirmedFromParent(e){let t=!1;if(e){switch(this.collectionType){case"community":case"domain":t=YpAccessHelpers.checkDomainAccess(e),t||!e.configuration.onlyAdminsCanCreateCommunities&&window.appUser.user&&(t=!0);break;case"group":t=window.appGlobals.originalQueryParameters.createCommunityForGroup?YpAccessHelpers.checkDomainAccess(e):YpAccessHelpers.checkCommunityAccess(e),t||!e.configuration.onlyAdminsCanCreateGroups&&window.appUser.user&&(t=!0)}this.adminConfirmed=t,t||this.fire("yp-network-error",{message:this.t("unauthorized")})}}_setAdminConfirmed(){if(this.collection)switch(this.collectionType){case"domain":this.adminConfirmed=YpAccessHelpers.checkDomainAccess(this.collection);break;case"community":this.adminConfirmed=YpAccessHelpers.checkCommunityAccess(this.collection);break;case"group":this.adminConfirmed=YpAccessHelpers.checkGroupAccess(this.collection);break;case"post":this.adminConfirmed=YpAccessHelpers.checkPostAccess(this.collection)}this.collection&&this.haveCheckedAdminRights&&!this.adminConfirmed&&this.fire("yp-network-error",{message:this.t("unauthorized")})}getParentCollectionType(){switch(this.collectionType){case"group":return"community";case"community":case"domain":return"domain";default:return""}}exitToMainApp(){this.active=!1,"new"===this.collectionId?window.appGlobals.originalQueryParameters.createCommunityForGroup?YpNavHelpers.redirectTo(`/domain/${this.parentCollectionId}`):YpNavHelpers.redirectTo(`/${this.getParentCollectionType()}/${this.parentCollectionId}`):YpNavHelpers.redirectTo(`/${this.collectionType}/${this.collectionId}`)}render(){return x`
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
                        ${this.isAllOurIdeasGroupType?T$1:this.renderMenuListItem("moderation")}
                        ${this.renderMenuListItem("pages")}
                        ${"domain"!=this.collectionType?x`
                              ${this.renderMenuListItem("reports")}
                              ${this.renderMenuListItem("translations")}
                            `:x` ${this.renderMenuListItem("organizations")}`}
                        ${this.isAllOurIdeasGroupType,T$1}
                      `:x``}
                `:T$1}
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
      `}};__decorate([n$4({type:String})],YpAdminApp.prototype,"page",void 0),__decorate([n$4({type:Object})],YpAdminApp.prototype,"user",void 0),__decorate([n$4({type:Boolean,reflect:!0})],YpAdminApp.prototype,"active",void 0),__decorate([n$4({type:String})],YpAdminApp.prototype,"route",void 0),__decorate([n$4({type:String})],YpAdminApp.prototype,"subRoute",void 0),__decorate([n$4({type:Object})],YpAdminApp.prototype,"routeData",void 0),__decorate([n$4({type:Array})],YpAdminApp.prototype,"userYpCollection",void 0),__decorate([n$4({type:String})],YpAdminApp.prototype,"forwardToYpId",void 0),__decorate([n$4({type:String})],YpAdminApp.prototype,"headerTitle",void 0),__decorate([n$4({type:String})],YpAdminApp.prototype,"collectionType",void 0),__decorate([n$4({type:Number})],YpAdminApp.prototype,"collectionId",void 0),__decorate([n$4({type:Number})],YpAdminApp.prototype,"parentCollectionId",void 0),__decorate([n$4({type:Object})],YpAdminApp.prototype,"parentCollection",void 0),__decorate([n$4({type:Object})],YpAdminApp.prototype,"collection",void 0),__decorate([n$4({type:Boolean})],YpAdminApp.prototype,"adminConfirmed",void 0),__decorate([n$4({type:Boolean})],YpAdminApp.prototype,"haveCheckedAdminRights",void 0),YpAdminApp=__decorate([t$2("yp-admin-app")],YpAdminApp);export{YpAdminApp};
