import{n as n$8,d as YpBaseElementWithLogin,f as e$7,g as YpMediaHelpers,h as YpImage,x,T as T$2,j as YpCollectionHelpers,o as o$8,k as o$9,i as i$5,t as t$5,Y as YpBaseElement,l as YpThemeManager,m as c$4,p as YpNavHelpers,q as requestUpdateOnAriaChange,s as s$8,_ as __decorate$i,e as e$8,u as redispatchEvent,v as o$a,w as YpStreamingLlmBase,A as AoiAdminServerApi,y as AoiGenerateAiLogos,z as resolveUrl,B as pathFromUrl,C as strictTemplatePolicy,D as resolveCss,E as wrap$1,F as microTask$1,G as legacyUndefined,H as removeNestedTemplates,I as fastDomIf,J as sanitizeDOMValue,K as orderedComputed,L as legacyOptimizations,M as rootPath,N as syncInitialRender,O as legacyWarnings,P as useAdoptedStyleSheetsWithBuiltCSS,Q as supportsAdoptingStyleSheets$1,R as allowTemplateFromDomModule,S as FlattenedNodesObserver,U as j,V as Corner,W as YpFormattingHelpers,X as ShadowStyles,Z as YpLanguages,r as r$6,c as YpEditBase,$ as YpAccessHelpers}from"./D5jv2R-d.js";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let dedupeId$1=0;const dedupingMixin=function(t){let i=t.A;i||(i=new WeakMap,t.A=i);let e=dedupeId$1++;return function(o){let s=o.Z;if(s&&s[e])return o;let n=i,r=n.get(o);if(!r){r=t(o),n.set(o,r);let i=Object.create(r.Z||s||null);i[e]=!0,r.Z=i}return r}};var __decorate$h=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};class YpAdminPage extends YpBaseElementWithLogin{}__decorate$h([n$8({type:String})],YpAdminPage.prototype,"collectionType",void 0),__decorate$h([n$8({type:Number})],YpAdminPage.prototype,"collectionId",void 0),__decorate$h([n$8({type:Object})],YpAdminPage.prototype,"collection",void 0);var __decorate$g=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};const defaultLtpPromptsConfiguration=()=>Object.fromEntries(Array.from({length:10},((t,i)=>[i+1,""]))),defaultLtpConfiguration={crt:{prompts:defaultLtpPromptsConfiguration(),promptsTests:defaultLtpPromptsConfiguration()}};class YpAdminConfigBase extends YpAdminPage{constructor(){super(),this.selectedTab=0,this.configChanged=!1,this.method="POST",this.hasVideoUpload=!1,this.hasAudioUpload=!1,this.descriptionMaxLength=300,this.tabsHidden=!1,this.gettingImageColor=!1}async _formResponse(t){this.configChanged=!1}_selectTab(t){this.selectedTab=t.target.activeTabIndex}async getColorFromLogo(){try{this.gettingImageColor=!0;let t=this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages);const i=new Image;i.src=t+"?"+(new Date).getTime(),i.setAttribute("crossOrigin",""),await i.decode();let e=await YpImage.getThemeColorsFromImage(i);this.gettingImageColor=!1,console.error("New theme color",e),e&&(e=e.replace("#",""),this.fireGlobal("yp-theme-color-detected",e),this.detectedThemeColor=e,this._configChanged())}catch(t){console.log(t)}}_updateCollection(t){this.collection=t.detail}connectedCallback(){super.connectedCallback(),this.setupBootListener(),this.addGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.addGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),window.appGlobals.hasVideoUpload&&(this.hasVideoUpload=!0),window.appGlobals.hasAudioUpload&&(this.hasAudioUpload=!0),this.addListener("yp-form-response",this._formResponse),this.addListener("yp-updated-collection",this._updateCollection)}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-has-video-upload",(()=>{this.hasVideoUpload=!0})),this.removeGlobalListener("yp-has-audio-upload",(()=>{this.hasAudioUpload=!0})),this.removeListener("yp-form-response",this._formResponse),this.removeListener("yp-updated-collection",this._updateCollection)}_logoImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.uploadedLogoImageId=i.id,this.imagePreviewUrl=JSON.parse(i.formats)[0],JSON.parse(i.formats),this._configChanged()}_headerImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.uploadedHeaderImageId=i.id,this.configChanged=!0}_statusSelected(t){const i=t.target.selectedIndex;this.status=this.collectionStatusOptions[i].name,this._configChanged()}get statusIndex(){if(this.status){for(let t=0;t<this.collectionStatusOptions.length;t++)if(this.collectionStatusOptions[t].name==this.status)return t;return-1}return-1}get collectionStatusOptions(){return this.language?[{name:"active",translatedName:this.t("status.active")},{name:"featured",translatedName:this.t("status.featured")},{name:"archived",translatedName:this.t("status.archived")},{name:"hidden",translatedName:this.t("status.hidden")}]:[]}_ltpConfigChanged(t){setTimeout((()=>{const t=this.$$("#jsoneditor").json;this.collection.configuration.ltp=t,this._configChanged(),this.requestUpdate()}),25)}tabsPostSetup(t){}get disableSaveButtonForCollection(){if("group"==this.collectionType&&this.collection&&this.collection.configuration){if(1===this.collection.configuration.groupType){const t=this.collection.configuration?.allOurIdeas?.earl?.question_id;return void 0===t}return!1}return!1}_themeChanged(t){this.collection.configuration.theme={...this.collection.configuration.theme,...t.detail},this.requestUpdate()}renderSaveButton(){return x`
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
              ${this.configTabs.map((t=>x`
                  <md-secondary-tab
                    >${this.t(t.name)}<md-icon
                      >${t.icon}</md-icon
                    ></md-secondary-tab
                  >
                `))}
            </md-tabs>
          </div>
        `:T$2}renderTabPages(){if(this.tabsHidden)return T$2;let t=[];return this.configTabs?.forEach(((i,e)=>{t.push(this.renderTabPage(i.items,e))})),x`${t}`}_generateLogo(t){t.preventDefault(),t.stopPropagation(),this.requestUpdate();this.$$("#aiImageGenerator").open()}renderTabPage(t,i){return x`<div
      ?hidden="${this.selectedTab!=i}"
      class="layout vertical center-center"
    >
      <div class="innerTabContainer">
        ${t.map(((t,i)=>x`
            ${"html"==t.type?x`<div class="adminItem">${t.templateData}</div>`:x`
                  <div class="layout vertical center-center">
                    <yp-structured-question-edit
                      index="${i}"
                      id="configQuestion_${i}"
                      @yp-answer-content-changed="${t.onChange||this._configChanged}"
                      debounceTimeMs="10"
                      .name="${t.name||t.text||""}"
                      ?disabled="${!!t.disabled}"
                      .value="${void 0!==t.value?t.value:void 0!==this._getCurrentValue(t)?this._getCurrentValue(t):t.defaultValue||""}"
                      .question="${{...t,text:t.translationToken?this.t(t.translationToken):this.t(t.text),uniqueId:`u${i}`}}"
                    >
                    </yp-structured-question-edit>
                  </div>
                `}
          `))}
      </div>
    </div>`}get collectionVideoURL(){if(this.collection&&this.collection.configuration&&this.collection.configuration.useVideoCover){const t=this.collectionVideos;if(t){const i=YpMediaHelpers.getVideoURL(t);if(i)return this.collectionVideoId=t[0].id,i}}else;}get collectionVideoPosterURL(){if(this.collection&&this.collection.configuration&&this.collection.configuration.useVideoCover){const t=YpMediaHelpers.getVideoPosterURL(this.collectionVideos,YpCollectionHelpers.logoImages(this.collectionType,this.collection));return t||void 0}}get collectionVideos(){switch(this.collectionType){case"domain":return this.collection.DomainLogoVideos;case"community":return this.collection.CommunityLogoVideos;case"group":return this.collection.GroupLogoVideos;default:return}}renderCoverMediaContent(){return this.collection?.configuration?.welcomeHTML?x`<div id="welcomeHTML">
        ${o$8(this.collection.configuration.welcomeHTML)}
      </div>`:this.collectionVideoURL?x`
        <video
          id="videoPlayer"
          data-id="${o$9(this.collectionVideoId)}"
          controls
          preload="metadata"
          class="image"
          src="${this.collectionVideoURL}"
          playsinline
          poster="${o$9(this.collectionVideoPosterURL)}"
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
      `:this.currentLogoImages?x`
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
      `}renderLogoMedia(){return x`
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
          <md-filled-icon-button
            ?hidden="${!this.hasLlm}"
            id="generateButton"
            @click="${this._generateLogo}"
            ><md-icon>smart_toy</md-icon></md-filled-icon-button
          >
          <yp-file-upload
            ?hidden="${!this.hasVideoUpload}"
            id="videoFileUpload"
            raised
            useIconButton
            videoUpload
            method="POST"
            buttonIcon="videocam"
            .buttonText="${this.t("uploadVideo")}"
            @success="${this._videoUploaded}"
          >
          </yp-file-upload>
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

        md-outlined-text-field {
          width: 400px;
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

        #generateButton {
          margin-left: 16px;
          margin-right: 16px;
          margin-bottom: 16px;
        }

        #logoImageUpload {
          margin-bottom: 16px;
      `]}renderVideoUpload(){return x`
      <div class="layout vertical uploadSection">
        <yp-file-upload
          id="videoFileUpload"
          raised
          videoUpload
          method="POST"
          buttonIcon="videocam"
          .buttonText="${this.t("uploadVideo")}"
          @success="${this._videoUploaded}"
        >
        </yp-file-upload>
        <label>
          <md-checkbox
            name="useVideoCover"
            ?disabled="${!this.uploadedVideoId}"
            ?checked="${this.collection.configuration.useVideoCover}"
          >
          </md-checkbox>
          ${this.t("useVideoCover")}
        </label>
      </div>
    `}renderNameAndDescription(t=!1){return x`
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
        ${t?T$2:x`
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
    `}_descriptionChanged(t){const i=t.target.value,e=new RegExp(/(?:https?|http?):\/\/[\n\S]+/g),o=i.match(e);if(o&&o.length>0){let t=0;for(var s=0;s<Math.min(o.length,10);s++)t+=o[s].length;let i=300;i+=t,i-=Math.min(t,30*o.length),this.descriptionMaxLength=i}}render(){let t,i,e,o;return"new"===this.collectionId?("community"===this.collectionType?t="domain":"group"===this.collectionType&&(t="community"),i=this.parentCollectionId):this.collection&&(t=this.collectionType,i=this.collectionId),e=this.nameInput?.value,o=this.descriptionInput?.value,this.configTabs?x`
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
            .collectionType="${t}"
            .collectionId="${i}"
            .name="${e}"
            .description="${o}"
            @got-image="${this._gotAiImage}"
          >
          </yp-generate-ai-image>
        `:T$2}_gotAiImage(t){this.imagePreviewUrl=t.detail.imageUrl,this.uploadedLogoImageId=t.detail.imageId,this.configChanged=!0}updated(t){super.updated(t),t.has("collection")&&this.collection&&(this.configTabs=this.setupConfigTabs()),t.has("collectionId")&&this.collectionId&&("new"==this.collectionId?this.method="POST":this.method="PUT")}async _getHelpPages(t=void 0,i=void 0){this.collectionId&&"new"!=this.collectionId?this.translatedPages=await window.serverApi.getHelpPages(t||this.collectionType,i||this.collectionId):console.error("Collection id setup for get help pages")}_getLocalizePageTitle(t){let i="en";return window.appGlobals.locale&&t.title[window.appGlobals.locale]&&(i=window.appGlobals.locale),t.title[i]}beforeSave(){}afterSave(){}sendUpdateCollectionEvents(){"domain"==this.collectionType?this.fireGlobal("yp-refresh-domain"):"community"==this.collectionType?this.fireGlobal("yp-refresh-community"):"group"==this.collectionType&&this.fireGlobal("yp-refresh-group")}async _save(t){t.preventDefault(),t.stopPropagation(),this.beforeSave(),console.error("Saving collection",this.collection);const i=this.$$("#form");if(i.validate())this.$$("#spinner").hidden=!1,await i.submit(),this.$$("#spinner").hidden=!0,this.sendUpdateCollectionEvents(),this.afterSave();else{this.fire("yp-form-invalid");const t=this.t("form.invalid");this._showErrorDialog(t)}}_showErrorDialog(t){this.fire("yp-error",t)}_configChanged(){this.configChanged=!0}_videoUploaded(t){this.uploadedVideoId=t.detail.videoId,this.collection.configuration.useVideoCover=!0,this._configChanged(),this.requestUpdate()}_getSaveCollectionPath(path){try{return eval(`this.collection.${path}`)}catch(t){return}}_clear(){this.collection=void 0,this.uploadedLogoImageId=void 0,this.uploadedHeaderImageId=void 0,this.imagePreviewUrl=void 0,this.collectionVideoId=void 0,this.$$("#headerImageUpload").clear(),this.$$("#logoImageUpload").clear(),this.$$("#videoFileUpload")&&this.$$("#videoFileUpload").clear()}_getCurrentValue(question){if(this.collection&&this.collection.configuration&&-1==["textheader","textdescription"].indexOf(question.type)){const looseConfig=this.collection.configuration;if(question.text.indexOf(".")>-1)try{return eval(`this.collection.configuration.${question.text}`)}catch(t){console.error(t)}else{const t=looseConfig[question.text];if(void 0!==t)return t}}}}__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"configTabs",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"selectedTab",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"configChanged",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"method",void 0),__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"currentLogoImages",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"collectionVideoId",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"action",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"subRoute",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"hasVideoUpload",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"status",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"hasAudioUpload",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedLogoImageId",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedHeaderImageId",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"uploadedVideoId",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"editHeaderText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"toastText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"saveText",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"imagePreviewUrl",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"themeId",void 0),__decorate$g([n$8({type:Array})],YpAdminConfigBase.prototype,"translatedPages",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"descriptionMaxLength",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"tabsHidden",void 0),__decorate$g([n$8({type:Number})],YpAdminConfigBase.prototype,"parentCollectionId",void 0),__decorate$g([n$8({type:Object})],YpAdminConfigBase.prototype,"parentCollection",void 0),__decorate$g([e$7("#name")],YpAdminConfigBase.prototype,"nameInput",void 0),__decorate$g([e$7("#description")],YpAdminConfigBase.prototype,"descriptionInput",void 0),__decorate$g([n$8({type:Boolean})],YpAdminConfigBase.prototype,"gettingImageColor",void 0),__decorate$g([n$8({type:String})],YpAdminConfigBase.prototype,"detectedThemeColor",void 0);const clamp=(t,i=0,e=1)=>t>e?e:t<i?i:t,round=(t,i=0,e=Math.pow(10,i))=>Math.round(e*t)/e,hexToHsva=t=>rgbaToHsva(hexToRgba(t)),hexToRgba=t=>("#"===t[0]&&(t=t.substring(1)),t.length<6?{r:parseInt(t[0]+t[0],16),g:parseInt(t[1]+t[1],16),b:parseInt(t[2]+t[2],16),a:4===t.length?round(parseInt(t[3]+t[3],16)/255,2):1}:{r:parseInt(t.substring(0,2),16),g:parseInt(t.substring(2,4),16),b:parseInt(t.substring(4,6),16),a:8===t.length?round(parseInt(t.substring(6,8),16)/255,2):1}),hsvaToHex=t=>rgbaToHex(hsvaToRgba(t)),hsvaToHsla=({h:t,s:i,v:e,a:o})=>{const s=(200-i)*e/100;return{h:round(t),s:round(s>0&&s<200?i*e/100/(s<=100?s:200-s)*100:0),l:round(s/2),a:round(o,2)}},hsvaToHslString=t=>{const{h:i,s:e,l:o}=hsvaToHsla(t);return`hsl(${i}, ${e}%, ${o}%)`},hsvaToRgba=({h:t,s:i,v:e,a:o})=>{t=t/360*6,i/=100,e/=100;const s=Math.floor(t),n=e*(1-i),r=e*(1-(t-s)*i),a=e*(1-(1-t+s)*i),I=s%6;return{r:round(255*[e,r,n,n,a,e][I]),g:round(255*[a,e,e,r,n,n][I]),b:round(255*[n,n,a,e,e,r][I]),a:round(o,2)}},format=t=>{const i=t.toString(16);return i.length<2?"0"+i:i},rgbaToHex=({r:t,g:i,b:e,a:o})=>{const s=o<1?format(round(255*o)):"";return"#"+format(t)+format(i)+format(e)+s},rgbaToHsva=({r:t,g:i,b:e,a:o})=>{const s=Math.max(t,i,e),n=s-Math.min(t,i,e),r=n?s===t?(i-e)/n:s===i?2+(e-t)/n:4+(t-i)/n:0;return{h:round(60*(r<0?r+6:r)),s:round(s?n/s*100:0),v:round(s/255*100),a:o}},equalColorObjects=(t,i)=>{if(t===i)return!0;for(const e in t)if(t[e]!==i[e])return!1;return!0},equalHex=(t,i)=>t.toLowerCase()===i.toLowerCase()||equalColorObjects(hexToRgba(t),hexToRgba(i)),cache={},tpl=t=>{let i=cache[t];return i||(i=document.createElement("template"),i.innerHTML=t,cache[t]=i),i},fire=(t,i,e)=>{t.dispatchEvent(new CustomEvent(i,{bubbles:!0,detail:e}))};let hasTouched=!1;const isTouch$1=t=>"touches"in t,isValid=t=>!(hasTouched&&!isTouch$1(t))&&(hasTouched||(hasTouched=isTouch$1(t)),!0),pointerMove=(t,i)=>{const e=isTouch$1(i)?i.touches[0]:i,o=t.el.getBoundingClientRect();fire(t.el,"move",t.getMove({x:clamp((e.pageX-(o.left+window.pageXOffset))/o.width),y:clamp((e.pageY-(o.top+window.pageYOffset))/o.height)}))},keyMove=(t,i)=>{const e=i.keyCode;e>40||t.xy&&e<37||e<33||(i.preventDefault(),fire(t.el,"move",t.getMove({x:39===e?.01:37===e?-.01:34===e?.05:33===e?-.05:35===e?1:36===e?-1:0,y:40===e?.01:38===e?-.01:0},!0)))};class Slider{constructor(t,i,e,o){const s=tpl(`<div role="slider" tabindex="0" part="${i}" ${e}><div part="${i}-pointer"></div></div>`);t.appendChild(s.content.cloneNode(!0));const n=t.querySelector(`[part=${i}]`);n.addEventListener("mousedown",this),n.addEventListener("touchstart",this),n.addEventListener("keydown",this),this.el=n,this.xy=o,this.nodes=[n.firstChild,n]}set dragging(t){const i=t?document.addEventListener:document.removeEventListener;i(hasTouched?"touchmove":"mousemove",this),i(hasTouched?"touchend":"mouseup",this)}handleEvent(t){switch(t.type){case"mousedown":case"touchstart":if(t.preventDefault(),!isValid(t)||!hasTouched&&0!=t.button)return;this.el.focus(),pointerMove(this,t),this.dragging=!0;break;case"mousemove":case"touchmove":t.preventDefault(),pointerMove(this,t);break;case"mouseup":case"touchend":this.dragging=!1;break;case"keydown":keyMove(this,t)}}style(t){t.forEach(((t,i)=>{for(const e in t)this.nodes[i].style.setProperty(e,t[e])}))}}class Hue extends Slider{constructor(t){super(t,"hue",'aria-label="Hue" aria-valuemin="0" aria-valuemax="360"',!1)}update({h:t}){this.h=t,this.style([{left:t/360*100+"%",color:hsvaToHslString({h:t,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuenow",`${round(t)}`)}getMove(t,i){return{h:i?clamp(this.h+360*t.x,0,360):360*t.x}}}class Saturation extends Slider{constructor(t){super(t,"saturation",'aria-label="Color"',!0)}update(t){this.hsva=t,this.style([{top:100-t.v+"%",left:`${t.s}%`,color:hsvaToHslString(t)},{"background-color":hsvaToHslString({h:t.h,s:100,v:100,a:1})}]),this.el.setAttribute("aria-valuetext",`Saturation ${round(t.s)}%, Brightness ${round(t.v)}%`)}getMove(t,i){return{s:i?clamp(this.hsva.s+100*t.x,0,100):100*t.x,v:i?clamp(this.hsva.v-100*t.y,0,100):Math.round(100-100*t.y)}}}var css$1=':host{display:flex;flex-direction:column;position:relative;width:200px;height:200px;user-select:none;-webkit-user-select:none;cursor:default}:host([hidden]){display:none!important}[role=slider]{position:relative;touch-action:none;user-select:none;-webkit-user-select:none;outline:0}[role=slider]:last-child{border-radius:0 0 8px 8px}[part$=pointer]{position:absolute;z-index:1;box-sizing:border-box;width:28px;height:28px;display:flex;place-content:center center;transform:translate(-50%,-50%);background-color:#fff;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.2)}[part$=pointer]::after{content:"";width:100%;height:100%;border-radius:inherit;background-color:currentColor}[role=slider]:focus [part$=pointer]{transform:translate(-50%,-50%) scale(1.1)}',hueCss="[part=hue]{flex:0 0 24px;background:linear-gradient(to right,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red 100%)}[part=hue-pointer]{top:50%;z-index:2}",saturationCss="[part=saturation]{flex-grow:1;border-color:transparent;border-bottom:12px solid #000;border-radius:8px 8px 0 0;background-image:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,rgba(255,255,255,0));box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}[part=saturation-pointer]{z-index:3}";const $isSame=Symbol("same"),$color=Symbol("color"),$hsva=Symbol("hsva"),$update=Symbol("update"),$parts=Symbol("parts"),$css=Symbol("css"),$sliders=Symbol("sliders");class ColorPicker extends HTMLElement{static get observedAttributes(){return["color"]}get[$css](){return[css$1,hueCss,saturationCss]}get[$sliders](){return[Saturation,Hue]}get color(){return this[$color]}set color(t){if(!this[$isSame](t)){const i=this.colorModel.toHsva(t);this[$update](i),this[$color]=t}}constructor(){super();const t=tpl(`<style>${this[$css].join("")}</style>`),i=this.attachShadow({mode:"open"});i.appendChild(t.content.cloneNode(!0)),i.addEventListener("move",this),this[$parts]=this[$sliders].map((t=>new t(i)))}connectedCallback(){if(this.hasOwnProperty("color")){const t=this.color;delete this.color,this.color=t}else this.color||(this.color=this.colorModel.defaultColor)}attributeChangedCallback(t,i,e){const o=this.colorModel.fromAttr(e);this[$isSame](o)||(this.color=o)}handleEvent(t){const i=this[$hsva],e={...i,...t.detail};let o;this[$update](e),equalColorObjects(e,i)||this[$isSame](o=this.colorModel.fromHsva(e))||(this[$color]=o,fire(this,"color-changed",{value:o}))}[$isSame](t){return this.color&&this.colorModel.equal(t,this.color)}[$update](t){this[$hsva]=t,this[$parts].forEach((i=>i.update(t)))}}const colorModel={defaultColor:"#000",toHsva:hexToHsva,fromHsva:({h:t,s:i,v:e})=>hsvaToHex({h:t,s:i,v:e,a:1}),equal:equalHex,fromAttr:t=>t};class HexBase extends ColorPicker{get colorModel(){return colorModel}}class HexColorPicker extends HexBase{}customElements.define("hex-color-picker",HexColorPicker);var __decorate$f=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpThemeColorInput=class extends YpBaseElement{constructor(){super(...arguments),this.disableSelection=!1,this.isColorPickerActive=!1,this.handleOutsideClick=t=>{if(!this.isColorPickerActive){const i=t.composedPath(),e=this.shadowRoot.querySelector("hex-color-picker");i.includes(e)||this.closePalette()}}}static get styles(){return[super.styles,i$5`
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
      `]}isValidHex(t){return!!t&&/^#([0-9A-F]{3}){1,2}$/i.test(t)}handleColorInput(t){const i=t.target.value;/^[0-9A-Fa-f]{0,6}$/.test(i)&&6===i.length?(this.color=i.replace("#",""),this.fire("input",{color:`${this.color}`})):t.target.value=this.color||"",console.error(`Invalid color: ${i}`)}_onPaste(t){t.preventDefault();let i="";t.clipboardData&&t.clipboardData.getData&&(i=t.clipboardData.getData("text/plain"));const e=i.replace(/[^0-9A-Fa-f]/g,"");this.isValidHex(`#${e}`)&&(this.color=e,this.fire("input",{color:`#${this.color}`}))}openPalette(){const t=this.shadowRoot.querySelector("hex-color-picker");t.hidden=!1,this.isColorPickerActive=!1,t.addEventListener("mousedown",(()=>this.isColorPickerActive=!0)),t.addEventListener("mouseup",(()=>this.isColorPickerActive=!1)),setTimeout((()=>document.addEventListener("click",this.handleOutsideClick,!0)),0)}closePalette(){const t=this.shadowRoot.querySelector("hex-color-picker");t&&(t.hidden=!0,document.removeEventListener("click",this.handleOutsideClick,!0))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleOutsideClick,!0);const t=this.shadowRoot.querySelector("hex-color-picker");t&&(t.removeEventListener("mousedown",(()=>this.isColorPickerActive=!0)),t.removeEventListener("mouseup",(()=>this.isColorPickerActive=!1)))}handleKeyDown(t){if(["Backspace","Tab","End","Home","ArrowLeft","ArrowRight","Delete"].includes(t.key))return;/^[0-9A-Fa-f]$/.test(t.key)||t.preventDefault()}handleColorChanged(t){this.color=t.detail.value.replace("#",""),this.fire("input",{color:`${this.color}`})}clearColor(){this.color=void 0,this.fire("input",{color:void 0})}render(){return x`
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
    `}};__decorate$f([n$8({type:String})],YpThemeColorInput.prototype,"color",void 0),__decorate$f([n$8({type:String})],YpThemeColorInput.prototype,"label",void 0),__decorate$f([n$8({type:Boolean})],YpThemeColorInput.prototype,"disableSelection",void 0),YpThemeColorInput=__decorate$f([t$5("yp-theme-color-input")],YpThemeColorInput);var __decorate$e=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpThemeSelector=class extends YpBaseElement{constructor(){super(...arguments),this.selectedThemeScheme="tonal",this.selectedThemeVariant="monochrome",this.disableSelection=!1,this.disableMultiInputs=!1,this.disableOneThemeColorInputs=!1,this.hasLogoImage=!1,this.channel=new BroadcastChannel("hex_color")}static get styles(){return[super.styles,i$5`
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
      `]}connectedCallback(){super.connectedCallback(),this.themeConfiguration&&(this.oneDynamicThemeColor=this.themeConfiguration.oneDynamicColor,this.selectedThemeScheme=this.themeConfiguration.oneColorScheme||this.selectedThemeScheme,this.selectedThemeVariant=this.themeConfiguration.variant||this.selectedThemeVariant,this.themePrimaryColor=this.themeConfiguration.primaryColor,this.themeSecondaryColor=this.themeConfiguration.secondaryColor,this.themeTertiaryColor=this.themeConfiguration.tertiaryColor,this.themeNeutralColor=this.themeConfiguration.neutralColor,this.themeNeutralVariantColor=this.themeConfiguration.neutralVariantColor,this.fontStyles=this.themeConfiguration.fontStyles,this.fontImports=this.themeConfiguration.fontImports),this.addGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-theme-color-detected",this.themeColorDetected.bind(this))}themeColorDetected(t){this.oneDynamicThemeColor=t.detail,console.error("Theme Color Detected:",this.oneDynamicThemeColor)}updated(t){let i=!1;["oneDynamicThemeColor","selectedThemeScheme","selectedThemeVariant","themePrimaryColor","themeSecondaryColor","themeTertiaryColor","themeNeutralColor","themeNeutralVariantColor","fontStyles","fontImports"].forEach((e=>{t.has(e)&&(i=!0,this.updateDisabledInputs(),this.fire("config-updated"))})),t.has("oneDynamicThemeColor")&&this.channel.postMessage(this.oneDynamicThemeColor),i&&(this.themeConfiguration={oneDynamicColor:this.oneDynamicThemeColor,oneColorScheme:this.selectedThemeScheme,variant:this.selectedThemeVariant,primaryColor:this.themePrimaryColor,secondaryColor:this.themeSecondaryColor,tertiaryColor:this.themeTertiaryColor,neutralColor:this.themeNeutralColor,neutralVariantColor:this.themeNeutralVariantColor,fontStyles:this.fontStyles,fontImports:this.fontImports},(this.themeConfiguration.oneDynamicColor||!this.themeConfiguration.oneDynamicColor&&this.themeConfiguration.primaryColor&&this.themeConfiguration.secondaryColor&&this.themeConfiguration.tertiaryColor&&this.themeConfiguration.neutralColor&&this.themeConfiguration.neutralVariantColor)&&this.fireGlobal("yp-theme-configuration-updated",this.themeConfiguration),this.fire("yp-theme-configuration-changed",this.themeConfiguration))}isValidHex(t){return!!t&&/^#([0-9A-F]{3}){1,2}$/i.test(t)}setThemeSchema(t){const i=t.target.selectedIndex;this.selectedThemeScheme=YpThemeManager.themeScemesOptionsWithName[i].value}setThemeVariant(t){const i=t.target.selectedIndex;this.selectedThemeVariant=YpThemeManager.themeVariantsOptionsWithName[i].value}handleColorInput(t){const i=t.target.value;/^[0-9A-Fa-f]{0,6}$/.test(i)?this.oneDynamicThemeColor=i:t.target.value=this.oneDynamicThemeColor||""}updateDisabledInputs(){this.disableOneThemeColorInputs=[this.themePrimaryColor,this.themeSecondaryColor,this.themeTertiaryColor,this.themeNeutralColor,this.themeNeutralVariantColor].some((t=>this.isValidHex(t))),this.disableMultiInputs=this.isValidHex(this.oneDynamicThemeColor)}get currentThemeSchemaIndex(){return YpThemeManager.themeScemesOptionsWithName.findIndex((t=>t.value===this.selectedThemeScheme))||0}updateFontStyles(t){this.fontStyles=t.target.value||"",this.fontStyles=this.fontStyles.replace("<style>","").replace("</style>","").trim()}updateFontImports(t){this.fontImports=t.target.value||"",this.fontImports=this.fontImports.replace("<style>","").replace("</style>",""),this.fontImports=this.fontImports.replace("<a href","").replace("</a>","").trim()}render(){return x`
      <div class="layout horizontal">
        <div class="layout vertical center-center leftContainer">
          <div class="dynamicColors">
            <div class="colorTypeTitle">${this.t("Dynamic Colors")}</div>
            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("One Dynamic Color")}"
              .color="${this.oneDynamicThemeColor}"
              .disableSelection="${this.disableSelection||this.disableOneThemeColorInputs}"
              @input="${t=>{this.oneDynamicThemeColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              label="Theme Scheme"
              .disabled="${this.disableSelection||this.disableOneThemeColorInputs}"
              @change="${this.setThemeSchema}"
              .selectedIndex="${this.currentThemeSchemaIndex}"
            >
              ${YpThemeManager.themeScemesOptionsWithName.map((t=>x`
                  <md-select-option value="${t.value}">
                    <div slot="headline">${t.name}</div>
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
              @input="${t=>{this.themePrimaryColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Secondary Color")}"
              .color="${this.themeSecondaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${t=>{this.themeSecondaryColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Tertiary Color")}"
              .color="${this.themeTertiaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${t=>{this.themeTertiaryColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Color")}"
              .color="${this.themeNeutralColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${t=>{this.themeNeutralColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Variant Color")}"
              .color="${this.themeNeutralVariantColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${t=>{this.themeNeutralVariantColor=t.detail.color}}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              hidden
              label="Theme Variant"
              .disabled="${this.disableMultiInputs}"
              @change="${this.setThemeVariant}"
            >
              ${YpThemeManager.themeVariantsOptionsWithName.map((t=>x`
                  <md-select-option value="${t.value}">
                    <div slot="headline">${t.name}</div>
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
      ${c$4([{text:"Primary",color:"--md-sys-color-primary",contrast:"--md-sys-color-on-primary"},{text:"Primary Container",color:"--md-sys-color-primary-container",contrast:"--md-sys-color-on-primary-container"},{text:"Secondary",color:"--md-sys-color-secondary",contrast:"--md-sys-color-on-secondary"},{text:"Secondary Container",color:"--md-sys-color-secondary-container",contrast:"--md-sys-color-on-secondary-container"},{text:"Tertiary",color:"--md-sys-color-tertiary",contrast:"--md-sys-color-on-tertiary"},{text:"Tertiary Container",color:"--md-sys-color-tertiary-container",contrast:"--md-sys-color-on-tertiary-container"},{text:"Error",color:"--md-sys-color-error",contrast:"--md-sys-color-on-error"},{text:"Error Container",color:"--md-sys-color-error-container",contrast:"--md-sys-color-on-error-container"},{text:"Background",color:"--md-sys-color-background",contrast:"--md-sys-color-on-background"},{text:"Surface Dim",color:"--md-sys-color-surface-dim",contrast:"--md-sys-color-on-surface"},{text:"Surface",color:"--md-sys-color-surface",contrast:"--md-sys-color-on-surface"},{text:"Surface Bright",color:"--md-sys-color-surface-bright",contrast:"--md-sys-color-on-surface"},{text:"Surface Variant",color:"--md-sys-color-surface-variant",contrast:"--md-sys-color-on-surface-variant"},{text:"Surface Container Lowest",color:"--md-sys-color-surface-container-lowest",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Low",color:"--md-sys-color-surface-container-low",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container",color:"--md-sys-color-surface-container",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container High",color:"--md-sys-color-surface-container-high",contrast:"--md-sys-color-on-surface-container"},{text:"Surface Container Highest",color:"--md-sys-color-surface-container-highest",contrast:"--md-sys-color-on-surface-container"},{text:"Inverse Primary",color:"--md-sys-color-inverse-primary",contrast:"--md-sys-color-inverse-on-primary"},{text:"Inverse Surface",color:"--md-sys-color-inverse-surface",contrast:"--md-sys-color-inverse-on-surface"}],(({text:t})=>t),(({text:t,color:i,contrast:e})=>x` <div
          class="color"
          style="color:var(${e});background-color:var(${i})"
        >
          ${t}
        </div>`))}
    </div>`}};__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"oneDynamicThemeColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themePrimaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeSecondaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeTertiaryColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeNeutralColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"themeNeutralVariantColor",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"fontStyles",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"fontImports",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"selectedThemeScheme",void 0),__decorate$e([n$8({type:String})],YpThemeSelector.prototype,"selectedThemeVariant",void 0),__decorate$e([n$8({type:Object})],YpThemeSelector.prototype,"themeConfiguration",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableSelection",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableMultiInputs",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"disableOneThemeColorInputs",void 0),__decorate$e([n$8({type:Boolean})],YpThemeSelector.prototype,"hasLogoImage",void 0),YpThemeSelector=__decorate$e([t$5("yp-theme-selector")],YpThemeSelector);var __decorate$d=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminCommunities=class extends YpBaseElementWithLogin{newCommunity(){YpNavHelpers.redirectTo(`/community/new/${this.domain.id}`)}static get styles(){return[super.styles,i$5`
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
      `]}gotoCommunity(t){YpNavHelpers.redirectTo(`/community/${t.id}`)}renderCommunity(t){const i=YpMediaHelpers.getImageFormatUrl(t.CommunityLogoImages);return x`
      <div
        class="layout horizontal communityItem"
        @click="${()=>this.gotoCommunity(t)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${i}"
        ></yp-image>
        <div class="layout vertical">
          <div class="communityText">${t.name}</div>
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
          ${this.domain.Communities.map((t=>this.renderCommunity(t)))}
        </div>
      </div>
    `}};__decorate$d([n$8({type:Object})],YpAdminCommunities.prototype,"domain",void 0),YpAdminCommunities=__decorate$d([t$5("yp-admin-communities")],YpAdminCommunities);var __decorate$c=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminConfigDomain=class extends YpAdminConfigBase{constructor(){super(),this.action="/domains"}static get styles(){return[super.styles,i$5``]}renderHeader(){return this.collection?x`
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
    `}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(t){t.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.DomainLogoImages,this._setupTranslations(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.DomainLogoVideos&&this.collection.DomainLogoVideos.length>0&&(this.uploadedVideoId=this.collection.DomainLogoVideos[0].id)),t.has("collectionId")&&this.collectionId&&("new"==this.collectionId?this.action="/domains":this.action=`/domains/${this.collectionId}`),super.updated(t)}_setupTranslations(){"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(t){super._formResponse(t);const i=t.detail;i?this.uploadedVideoId?(await window.adminServerApi.addVideoToCollection(i.id,{videoId:this.uploadedVideoId},"completeAndAddToDomain"),this._finishRedirect(i)):this._finishRedirect(i):console.warn("No domain found on custom redirect")}_finishRedirect(t){YpNavHelpers.redirectTo("/domain/"+t.id),window.appGlobals.activity("completed","editDomain")}setupConfigTabs(){const t=[];return t.push({name:"basic",icon:"code",items:[{text:"defaultLocale",type:"html",templateData:x`
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
          `},{text:"onlyAdminsCanCreateCommunities",type:"checkbox",value:this.collection.only_admins_can_create_communities,translationToken:"domain.onlyAdminsCanCreateCommunities"},{text:"hideAllTabs",type:"checkbox"},{text:"hideDomainNews",type:"checkbox"},{text:"welcomeHtmlInsteadOfCommunitiesList ",type:"textarea",rows:5}]}),t.push({name:"webApp",icon:"get_app",items:[{text:"appHomeScreenShortName",type:"textfield",maxLength:12},{text:"appHomeScreenIconImageUpload",type:"html",templateData:x`
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
          `}]}),t.push({name:"authApis",icon:"api",items:[{text:"Facebook Client Id",name:"facebookClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_id"),maxLength:60},{text:"Facebook Client Secret",name:"facebookClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.facebook.client_secret"),maxLength:60},{text:"Google Client Id",name:"googleClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_id"),maxLength:60},{text:"Google Client Secret",name:"googleClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.google.client_secret"),maxLength:60},{text:"Discord Client Id",name:"discordClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_id"),maxLength:60},{text:"Discord Client Secret",name:"discordClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.discord.client_secret"),maxLength:60},{text:"Twitter Client Id",name:"twitterClientId",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_id"),maxLength:60},{text:"Twitter Client Secret",name:"twitterClientSecret",type:"textfield",value:this._getSaveCollectionPath("secret_api_keys.twitter.client_secret"),maxLength:60}]}),this.tabsPostSetup(t),t}_appHomeScreenIconImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.appHomeScreenIconImageId=i.id,this._configChanged()}};__decorate$c([n$8({type:Number})],YpAdminConfigDomain.prototype,"appHomeScreenIconImageId",void 0),YpAdminConfigDomain=__decorate$c([t$5("yp-admin-config-domain")],YpAdminConfigDomain);var __decorate$b=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminConfigCommunity=class extends YpAdminConfigBase{constructor(){super(),this.hasSamlLoginProvider=!1,this.communityAccess="public",this.action="/communities"}static get styles(){return[super.styles,i$5`
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
    `}_hostnameChanged(){const t=this.$$("#hostname").value;this.hostnameExample=t?t+"."+window.appGlobals.domain.domain_name:"your-hostname.."+window.appGlobals.domain.domain_name,this._configChanged()}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0,this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0,this.inCommunityFolderId=void 0,this.signupTermsPageId=void 0,this.welcomePageId=void 0,this.availableCommunityFolders=void 0,this.$$("#appHomeScreenIconImageUpload").clear()}updated(t){t.has("collection")&&this.collection&&(this.currentLogoImages=this.collection.CommunityLogoImages,this._communityChanged(),this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration),t.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(t)}languageChanged(){this._setupTranslations()}_communityChanged(){this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0&&(this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id),this._getHelpPages("community"),this.collection&&(0===this.collection.access?this.communityAccess="public":1===this.collection.access?this.communityAccess="closed":2===this.collection.access&&(this.communityAccess="secret"),this.collection.status&&(this.status=this.collection.status),this.collection.in_community_folder_id&&(this.inCommunityFolderId=this.collection.in_community_folder_id),this.collection.configuration&&(this.collection.configuration.signupTermsPageId&&(this.signupTermsPageId=this.collection.configuration.signupTermsPageId),this.collection.configuration.welcomePageId&&(this.welcomePageId=this.collection.configuration.welcomePageId))),window.appGlobals.hasVideoUpload?this.hasVideoUpload=!0:this.hasVideoUpload=!1,window.appGlobals.domain&&window.appGlobals.domain.samlLoginProvided?this.hasSamlLoginProvider=!0:this.hasSamlLoginProvider=!1,this.collection&&this.collection.configuration&&this.collection.configuration.ssnLoginListDataId&&(this.ssnLoginListDataId=this.collection.configuration.ssnLoginListDataId,this._getSsnListCount()),this.requestUpdate()}_deleteSsnLoginList(){this.collection&&this.ssnLoginListDataId&&(window.adminServerApi.deleteSsnLoginList(this.collection.id,this.ssnLoginListDataId),this.ssnLoginListDataId=void 0,this.ssnLoginListDataCount=void 0)}_ssnLoginListDataUploaded(t){this.ssnLoginListDataId=JSON.parse(t.detail.xhr.response).ssnLoginListDataId,this._getSsnListCount(),this._configChanged()}async _getSsnListCount(){if(this.collection&&this.ssnLoginListDataId){const t=await window.adminServerApi.getSsnListCount(this.collection.id,this.ssnLoginListDataId);this.ssnLoginListDataCount=t.count}}_collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(this.action=`/communities/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",access:0,status:"active",only_admins_can_create_groups:!0,counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},hostname:"",is_community_folder:"newFolder"==this.collectionId}):this.action=`/communities/${this.collectionId}`}async _checkCommunityFolders(t){let i;i=t.Domain?t.Domain:window.appGlobals.domain;const e=await window.adminServerApi.getCommunityFolders(i.id);var o;e&&this.collection?.id&&(e.forEach(((t,i)=>{t.id==this.collection?.id&&(o=i)})),o&&e.splice(o,1));e&&e.length>0?(e.unshift({id:-1,name:this.t("none")}),this.availableCommunityFolders=e):this.availableCommunityFolders=void 0}_setupTranslations(){"new"==this.collectionId?(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("newCommunityFolder"):this.editHeaderText=this.t("community.new"),this.saveText=this.t("create"),this.toastText=this.t("communityToastCreated")):(this.collection&&this.collection.is_community_folder?this.editHeaderText=this.t("updateCommunityFolder"):this.editHeaderText=this.t("Update community info"),this.saveText=this.t("save"),this.toastText=this.t("communityToastUpdated"))}async _formResponse(t){super._formResponse(t);const i=t.detail;i?i.hostnameTaken?window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("hostnameTaken"),void 0)})):this.uploadedVideoId?(await window.adminServerApi.addVideoToCollection(i.id,{videoId:this.uploadedVideoId},"completeAndAddToCommunity"),this._finishRedirect(i)):this._finishRedirect(i):console.warn("No community found on custom redirect")}_finishRedirect(t){"new"==this.collectionId&&window.appUser.recheckAdminRights(),t.is_community_folder?YpNavHelpers.redirectTo("/community_folder/"+t.id):YpNavHelpers.redirectTo("/community/"+t.id),window.appGlobals.activity("completed","editCommunity")}_accessRadioChanged(t){this.communityAccess=t.target.value,this._configChanged()}_getAccessTab(){return{name:"access",icon:"code",items:[{text:"status",type:"html",templateData:x`
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
              ${this.collectionStatusOptions?.map(((t,i)=>x`
                  <md-select-option ?selected="${this.statusIndex==i}"
                    >${t.translatedName}</md-select-option
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
              ${this.availableCommunityFolders?.map(((t,i)=>x`
                  <md-select-option
                    ?selected="${this.inCommunityFolderId==t.id}"
                    >${t.name}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.availableCommunityFolders},{text:"signupTermsSelectPage",type:"html",templateData:x`
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._signupTermsPageSelected}"
            >
              ${this.translatedPages?.map(((t,i)=>x`
                  <md-select-option
                    ?selected="${this.signupTermsPageId==t.id}"
                    >${this._getLocalizePageTitle(t)}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.translatedPages},{text:"welcomePageSelect",type:"html",templateData:x`
            <md-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(((t,i)=>x`
                  <md-select-option ?selected="${this.welcomePageId==t.id}"
                    >${this._getLocalizePageTitle(t)}</md-select-option
                  >
                `))}
            </md-select>
          `,hidden:!this.translatedPages}]}}_welcomePageSelected(t){const i=t.detail.index;this.welcomePageId=this.translatedPages[i].id}get welcomePageIndex(){if(this.translatedPages){for(let t=0;t<this.translatedPages.length;t++)if(this.translatedPages[t].id==this.welcomePageId)return t;return-1}return-1}_signupTermsPageSelected(t){const i=t.detail.index;this.signupTermsPageId=this.translatedPages[i].id}get signupTermsPageIndex(){if(this.translatedPages){for(let t=0;t<this.translatedPages.length;t++)if(this.translatedPages[t].id==this.signupTermsPageId)return t;return-1}return-1}_communityFolderSelected(t){const i=t.detail.index;this.inCommunityFolderId=this.availableCommunityFolders[i].id}get communityFolderIndex(){if(this.availableCommunityFolders){for(let t=0;t<this.availableCommunityFolders.length;t++)if(this.availableCommunityFolders[t].id==this.inCommunityFolderId)return t;return-1}return-1}_getLookAndFeelTab(){return{name:"lookAndFeel",icon:"code",items:[{text:"themeSelector",type:"html",templateData:x`
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
          `}]}}setupConfigTabs(){const t=[];return t.push(this._getAccessTab()),t.push(this._getBasicTab()),t.push(this._getLookAndFeelTab()),t.push(this._getWebAppTab()),t.push(this._getSamlTab()),this.tabsPostSetup(t),t}_appHomeScreenIconImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.appHomeScreenIconImageId=i.id,this._configChanged()}};__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"appHomeScreenIconImageId",void 0),__decorate$b([n$8({type:String})],YpAdminConfigCommunity.prototype,"hostnameExample",void 0),__decorate$b([n$8({type:Boolean})],YpAdminConfigCommunity.prototype,"hasSamlLoginProvider",void 0),__decorate$b([n$8({type:Array})],YpAdminConfigCommunity.prototype,"availableCommunityFolders",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"ssnLoginListDataCount",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"inCommunityFolderId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"signupTermsPageId",void 0),__decorate$b([n$8({type:Number})],YpAdminConfigCommunity.prototype,"welcomePageId",void 0),__decorate$b([n$8({type:String})],YpAdminConfigCommunity.prototype,"communityAccess",void 0),YpAdminConfigCommunity=__decorate$b([t$5("yp-admin-config-community")],YpAdminConfigCommunity);
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
const isCEPolyfill="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,removeNodes=(t,i,e=null)=>{for(;i!==e;){const e=i.nextSibling;t.removeChild(i),i=e}},marker=`{{lit-${String(Math.random()).slice(2)}}}`,nodeMarker=`\x3c!--${marker}--\x3e`,markerRegex=new RegExp(`${marker}|${nodeMarker}`),boundAttributeSuffix="$lit$";class Template{constructor(t,i){this.parts=[],this.element=i;const e=[],o=[],s=document.createTreeWalker(i.content,133,null,!1);let n=0,r=-1,a=0;const{strings:I,values:{length:g}}=t;for(;a<g;){const t=s.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const i=t.attributes,{length:e}=i;let o=0;for(let t=0;t<e;t++)endsWith(i[t].name,boundAttributeSuffix)&&o++;for(;o-- >0;){const i=I[a],e=lastAttributeNameRegex.exec(i)[2],o=e.toLowerCase()+boundAttributeSuffix,s=t.getAttribute(o);t.removeAttribute(o);const n=s.split(markerRegex);this.parts.push({type:"attribute",index:r,name:e,strings:n}),a+=n.length-1}}"TEMPLATE"===t.tagName&&(o.push(t),s.currentNode=t.content)}else if(3===t.nodeType){const i=t.data;if(i.indexOf(marker)>=0){const o=t.parentNode,s=i.split(markerRegex),n=s.length-1;for(let i=0;i<n;i++){let e,n=s[i];if(""===n)e=createMarker();else{const t=lastAttributeNameRegex.exec(n);null!==t&&endsWith(t[2],boundAttributeSuffix)&&(n=n.slice(0,t.index)+t[1]+t[2].slice(0,-boundAttributeSuffix.length)+t[3]),e=document.createTextNode(n)}o.insertBefore(e,t),this.parts.push({type:"node",index:++r})}""===s[n]?(o.insertBefore(createMarker(),t),e.push(t)):t.data=s[n],a+=n}}else if(8===t.nodeType)if(t.data===marker){const i=t.parentNode;null!==t.previousSibling&&r!==n||(r++,i.insertBefore(createMarker(),t)),n=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(e.push(t),r--),a++}else{let i=-1;for(;-1!==(i=t.data.indexOf(marker,i+1));)this.parts.push({type:"node",index:-1}),a++}}else s.currentNode=o.pop()}for(const t of e)t.parentNode.removeChild(t)}}const endsWith=(t,i)=>{const e=t.length-i.length;return e>=0&&t.slice(e)===i},isTemplatePartActive=t=>-1!==t.index,createMarker=()=>document.createComment(""),lastAttributeNameRegex=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,walkerNodeFilter=133;function removeNodesFromTemplate(t,i){const{element:{content:e},parts:o}=t,s=document.createTreeWalker(e,walkerNodeFilter,null,!1);let n=nextActiveIndexInTemplateParts(o),r=o[n],a=-1,I=0;const g=[];let l=null;for(;s.nextNode();){a++;const t=s.currentNode;for(t.previousSibling===l&&(l=null),i.has(t)&&(g.push(t),null===l&&(l=t)),null!==l&&I++;void 0!==r&&r.index===a;)r.index=null!==l?-1:r.index-I,n=nextActiveIndexInTemplateParts(o,n),r=o[n]}g.forEach((t=>t.parentNode.removeChild(t)))}const countNodes=t=>{let i=11===t.nodeType?0:1;const e=document.createTreeWalker(t,walkerNodeFilter,null,!1);for(;e.nextNode();)i++;return i},nextActiveIndexInTemplateParts=(t,i=-1)=>{for(let e=i+1;e<t.length;e++){const i=t[e];if(isTemplatePartActive(i))return e}return-1};function insertNodeIntoTemplate(t,i,e=null){const{element:{content:o},parts:s}=t;if(null==e)return void o.appendChild(i);const n=document.createTreeWalker(o,walkerNodeFilter,null,!1);let r=nextActiveIndexInTemplateParts(s),a=0,I=-1;for(;n.nextNode();){I++;for(n.currentNode===e&&(a=countNodes(i),e.parentNode.insertBefore(i,e));-1!==r&&s[r].index===I;){if(a>0){for(;-1!==r;)s[r].index+=a,r=nextActiveIndexInTemplateParts(s,r);return}r=nextActiveIndexInTemplateParts(s,r)}}}
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
 */const directives=new WeakMap,isDirective=t=>"function"==typeof t&&directives.has(t),noChange={},nothing={};
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
class TemplateInstance{constructor(t,i,e){this.M=[],this.template=t,this.processor=i,this.options=e}update(t){let i=0;for(const e of this.M)void 0!==e&&e.setValue(t[i]),i++;for(const t of this.M)void 0!==t&&t.commit()}_clone(){const t=isCEPolyfill?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),i=[],e=this.template.parts,o=document.createTreeWalker(t,133,null,!1);let s,n=0,r=0,a=o.nextNode();for(;n<e.length;)if(s=e[n],isTemplatePartActive(s)){for(;r<s.index;)r++,"TEMPLATE"===a.nodeName&&(i.push(a),o.currentNode=a.content),null===(a=o.nextNode())&&(o.currentNode=i.pop(),a=o.nextNode());if("node"===s.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(a.previousSibling),this.M.push(t)}else this.M.push(...this.processor.handleAttributeExpressions(a,s.name,s.strings,this.options));n++}else this.M.push(void 0),n++;return isCEPolyfill&&(document.adoptNode(t),customElements.upgrade(t)),t}}
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
 */const policy$1=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),commentMarker=` ${marker} `;class TemplateResult{constructor(t,i,e,o){this.strings=t,this.values=i,this.type=e,this.processor=o}getHTML(){const t=this.strings.length-1;let i="",e=!1;for(let o=0;o<t;o++){const t=this.strings[o],s=t.lastIndexOf("\x3c!--");e=(s>-1||e)&&-1===t.indexOf("--\x3e",s+1);const n=lastAttributeNameRegex.exec(t);i+=null===n?t+(e?commentMarker:nodeMarker):t.substr(0,n.index)+n[1]+n[2]+boundAttributeSuffix+n[3]+marker}return i+=this.strings[t],i}getTemplateElement(){const t=document.createElement("template");let i=this.getHTML();return void 0!==policy$1&&(i=policy$1.createHTML(i)),t.innerHTML=i,t}}
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
 */const isPrimitive=t=>null===t||!("object"==typeof t||"function"==typeof t),isIterable=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class AttributeCommitter{constructor(t,i,e){this.dirty=!0,this.element=t,this.name=i,this.strings=e,this.parts=[];for(let t=0;t<e.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new AttributePart(this)}_getValue(){const t=this.strings,i=t.length-1,e=this.parts;if(1===i&&""===t[0]&&""===t[1]){const t=e[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!isIterable(t))return t}let o="";for(let s=0;s<i;s++){o+=t[s];const i=e[s];if(void 0!==i){const t=i.value;if(isPrimitive(t)||!isIterable(t))o+="string"==typeof t?t:String(t);else for(const i of t)o+="string"==typeof i?i:String(i)}}return o+=t[i],o}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class AttributePart{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===noChange||isPrimitive(t)&&t===this.value||(this.value=t,isDirective(t)||(this.committer.dirty=!0))}commit(){for(;isDirective(this.value);){const t=this.value;this.value=noChange,t(this)}this.value!==noChange&&this.committer.commit()}}class NodePart{constructor(t){this.value=void 0,this.N=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(createMarker()),this.endNode=t.appendChild(createMarker())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.O(this.startNode=createMarker()),t.O(this.endNode=createMarker())}insertAfterPart(t){t.O(this.startNode=createMarker()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.N=t}commit(){if(null===this.startNode.parentNode)return;for(;isDirective(this.N);){const t=this.N;this.N=noChange,t(this)}const t=this.N;t!==noChange&&(isPrimitive(t)?t!==this.value&&this.D(t):t instanceof TemplateResult?this.G(t):t instanceof Node?this.W(t):isIterable(t)?this.Y(t):t===nothing?(this.value=nothing,this.clear()):this.D(t))}O(t){this.endNode.parentNode.insertBefore(t,this.endNode)}W(t){this.value!==t&&(this.clear(),this.O(t),this.value=t)}D(t){const i=this.startNode.nextSibling,e="string"==typeof(t=t??"")?t:String(t);i===this.endNode.previousSibling&&3===i.nodeType?i.data=e:this.W(document.createTextNode(e)),this.value=t}G(t){const i=this.options.templateFactory(t);if(this.value instanceof TemplateInstance&&this.value.template===i)this.value.update(t.values);else{const e=new TemplateInstance(i,t.processor,this.options),o=e._clone();e.update(t.values),this.W(o),this.value=e}}Y(t){Array.isArray(this.value)||(this.value=[],this.clear());const i=this.value;let e,o=0;for(const s of t)e=i[o],void 0===e&&(e=new NodePart(this.options),i.push(e),0===o?e.appendIntoPart(this):e.insertAfterPart(i[o-1])),e.setValue(s),e.commit(),o++;o<i.length&&(i.length=o,this.clear(e&&e.endNode))}clear(t=this.startNode){removeNodes(this.startNode.parentNode,t.nextSibling,this.endNode)}}class BooleanAttributePart{constructor(t,i,e){if(this.value=void 0,this.N=void 0,2!==e.length||""!==e[0]||""!==e[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=i,this.strings=e}setValue(t){this.N=t}commit(){for(;isDirective(this.N);){const t=this.N;this.N=noChange,t(this)}if(this.N===noChange)return;const t=!!this.N;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.N=noChange}}class PropertyCommitter extends AttributeCommitter{constructor(t,i,e){super(t,i,e),this.single=2===e.length&&""===e[0]&&""===e[1]}_createPart(){return new PropertyPart(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class PropertyPart extends AttributePart{}let eventOptionsSupported=!1;(()=>{try{const t={get capture(){return eventOptionsSupported=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class EventPart{constructor(t,i,e){this.value=void 0,this.N=void 0,this.element=t,this.eventName=i,this.eventContext=e,this.S=t=>this.handleEvent(t)}setValue(t){this.N=t}commit(){for(;isDirective(this.N);){const t=this.N;this.N=noChange,t(this)}if(this.N===noChange)return;const t=this.N,i=this.value,e=null==t||null!=i&&(t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive),o=null!=t&&(null==i||e);e&&this.element.removeEventListener(this.eventName,this.S,this.H),o&&(this.H=getOptions(t),this.element.addEventListener(this.eventName,this.S,this.H)),this.value=t,this.N=noChange}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const getOptions=t=>t&&(eventOptionsSupported?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
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
 */;function templateFactory(t){let i=templateCaches.get(t.type);void 0===i&&(i={stringsArray:new WeakMap,keyString:new Map},templateCaches.set(t.type,i));let e=i.stringsArray.get(t.strings);if(void 0!==e)return e;const o=t.strings.join(marker);return e=i.keyString.get(o),void 0===e&&(e=new Template(t,t.getTemplateElement()),i.keyString.set(o,e)),i.stringsArray.set(t.strings,e),e}const templateCaches=new Map,parts=new WeakMap,render$1=(t,i,e)=>{let o=parts.get(i);void 0===o&&(removeNodes(i,i.firstChild),parts.set(i,o=new NodePart(Object.assign({templateFactory},e))),o.appendInto(i)),o.setValue(t),o.commit()};
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
class DefaultTemplateProcessor{handleAttributeExpressions(t,i,e,o){const s=i[0];if("."===s){return new PropertyCommitter(t,i.slice(1),e).parts}if("@"===s)return[new EventPart(t,i.slice(1),o.eventContext)];if("?"===s)return[new BooleanAttributePart(t,i.slice(1),e)];return new AttributeCommitter(t,i,e).parts}handleTextExpression(t){return new NodePart(t)}}const defaultTemplateProcessor=new DefaultTemplateProcessor;
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
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const html$1=(t,...i)=>new TemplateResult(t,i,"html",defaultTemplateProcessor)
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
 */,getTemplateCacheKey=(t,i)=>`${t}--${i}`;let compatibleShadyCSSVersion=!0;void 0===window.ShadyCSS?compatibleShadyCSSVersion=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),compatibleShadyCSSVersion=!1);const shadyTemplateFactory=t=>i=>{const e=getTemplateCacheKey(i.type,t);let o=templateCaches.get(e);void 0===o&&(o={stringsArray:new WeakMap,keyString:new Map},templateCaches.set(e,o));let s=o.stringsArray.get(i.strings);if(void 0!==s)return s;const n=i.strings.join(marker);if(s=o.keyString.get(n),void 0===s){const e=i.getTemplateElement();compatibleShadyCSSVersion&&window.ShadyCSS.prepareTemplateDom(e,t),s=new Template(i,e),o.keyString.set(n,s)}return o.stringsArray.set(i.strings,s),s},TEMPLATE_TYPES=["html","svg"],removeStylesFromLitTemplates=t=>{TEMPLATE_TYPES.forEach((i=>{const e=templateCaches.get(getTemplateCacheKey(i,t));void 0!==e&&e.keyString.forEach((t=>{const{element:{content:i}}=t,e=new Set;Array.from(i.querySelectorAll("style")).forEach((t=>{e.add(t)})),removeNodesFromTemplate(t,e)}))}))},shadyRenderSet=new Set,prepareTemplateStyles=(t,i,e)=>{shadyRenderSet.add(t);const o=e?e.element:document.createElement("template"),s=i.querySelectorAll("style"),{length:n}=s;if(0===n)return void window.ShadyCSS.prepareTemplateStyles(o,t);const r=document.createElement("style");for(let t=0;t<n;t++){const i=s[t];i.parentNode.removeChild(i),r.textContent+=i.textContent}removeStylesFromLitTemplates(t);const a=o.content;e?insertNodeIntoTemplate(e,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(o,t);const I=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==I)i.insertBefore(I.cloneNode(!0),i.firstChild);else if(e){a.insertBefore(r,a.firstChild);const t=new Set;t.add(r),removeNodesFromTemplate(e,t)}},render=(t,i,e)=>{if(!e||"object"!=typeof e||!e.scopeName)throw new Error("The `scopeName` option is required.");const o=e.scopeName,s=parts.has(i),n=compatibleShadyCSSVersion&&11===i.nodeType&&!!i.host,r=n&&!shadyRenderSet.has(o),a=r?document.createDocumentFragment():i;if(render$1(t,a,Object.assign({templateFactory:shadyTemplateFactory(o)},e)),r){const t=parts.get(a);parts.delete(a);const e=t.value instanceof TemplateInstance?t.value.template:void 0;prepareTemplateStyles(o,a,e),removeNodes(i,i.firstChild),i.appendChild(a),parts.set(i,t)}!s&&n&&window.ShadyCSS.styleElement(i.host)};
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
var _a;window.JSCompiler_renameProperty=(t,i)=>t;const defaultConverter={toAttribute(t,i){switch(i){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){switch(i){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},notEqual=(t,i)=>i!==t&&(i==i||t==t),defaultPropertyDeclaration={attribute:!0,type:String,converter:defaultConverter,reflect:!1,hasChanged:notEqual},STATE_HAS_UPDATED=1,STATE_UPDATE_REQUESTED=4,STATE_IS_REFLECTING_TO_ATTRIBUTE=8,STATE_IS_REFLECTING_TO_PROPERTY=16,finalized="finalized";class UpdatingElement extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((i,e)=>{const o=this._attributeNameForProperty(e,i);void 0!==o&&(this._attributeToPropertyMap.set(o,e),t.push(o))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,i)=>this._classProperties.set(i,t)))}}static createProperty(t,i=defaultPropertyDeclaration){if(this._ensureClassProperties(),this._classProperties.set(t,i),i.noAccessor||this.prototype.hasOwnProperty(t))return;const e="symbol"==typeof t?Symbol():`__${t}`,o=this.getPropertyDescriptor(t,e,i);void 0!==o&&Object.defineProperty(this.prototype,t,o)}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(o){const s=this[t];this[i]=o,this.requestUpdateInternal(t,s,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||defaultPropertyDeclaration}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(finalized)||t.finalize(),this[finalized]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,i=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const e of i)this.createProperty(e,t[e])}}static _attributeNameForProperty(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,i,e=notEqual){return e(t,i)}static _propertyValueFromAttribute(t,i){const e=i.type,o=i.converter||defaultConverter,s="function"==typeof o?o:o.fromAttribute;return s?s(t,e):t}static _propertyValueToAttribute(t,i){if(void 0===i.reflect)return;const e=i.type,o=i.converter;return(o&&o.toAttribute||defaultConverter.toAttribute)(t,e)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,i)=>{if(this.hasOwnProperty(i)){const t=this[i];delete this[i],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(i,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,i)=>this[i]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,i,e){i!==e&&this._attributeToProperty(t,e)}_propertyToAttribute(t,i,e=defaultPropertyDeclaration){const o=this.constructor,s=o._attributeNameForProperty(t,e);if(void 0!==s){const t=o._propertyValueToAttribute(i,e);if(void 0===t)return;this._updateState=this._updateState|STATE_IS_REFLECTING_TO_ATTRIBUTE,null==t?this.removeAttribute(s):this.setAttribute(s,t),this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_ATTRIBUTE}}_attributeToProperty(t,i){if(this._updateState&STATE_IS_REFLECTING_TO_ATTRIBUTE)return;const e=this.constructor,o=e._attributeToPropertyMap.get(t);if(void 0!==o){const t=e.getPropertyOptions(o);this._updateState=this._updateState|STATE_IS_REFLECTING_TO_PROPERTY,this[o]=e._propertyValueFromAttribute(i,t),this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_PROPERTY}}requestUpdateInternal(t,i,e){let o=!0;if(void 0!==t){const s=this.constructor;e=e||s.getPropertyOptions(t),s._valueHasChanged(this[t],i,e.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,i),!0!==e.reflect||this._updateState&STATE_IS_REFLECTING_TO_PROPERTY||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,e))):o=!1}!this._hasRequestedUpdate&&o&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,i){return this.requestUpdateInternal(t,i),this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|STATE_UPDATE_REQUESTED;try{await this._updatePromise}catch(t){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&STATE_UPDATE_REQUESTED}get hasUpdated(){return this._updateState&STATE_HAS_UPDATED}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const i=this._changedProperties;try{t=this.shouldUpdate(i),t?this.update(i):this._markUpdated()}catch(i){throw t=!1,this._markUpdated(),i}t&&(this._updateState&STATE_HAS_UPDATED||(this._updateState=this._updateState|STATE_HAS_UPDATED,this.firstUpdated(i)),this.updated(i))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~STATE_UPDATE_REQUESTED}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,i)=>this._propertyToAttribute(i,this[i],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}_a=finalized,UpdatingElement[_a]=!0;
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
const supportsAdoptingStyleSheets=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,constructionToken=Symbol();class CSSResult{constructor(t,i){if(i!==constructionToken)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(supportsAdoptingStyleSheets?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const unsafeCSS=t=>new CSSResult(String(t),constructionToken),textFromCSSResult=t=>{if(t instanceof CSSResult)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)},css=(t,...i)=>{const e=i.reduce(((i,e,o)=>i+textFromCSSResult(e)+t[o+1]),t[0]);return new CSSResult(e,constructionToken)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const renderNotImplemented={};class LitElement extends UpdatingElement{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const i=(t,e)=>t.reduceRight(((t,e)=>Array.isArray(e)?i(e,t):(t.add(e),t)),e),e=i(t,new Set),o=[];e.forEach((t=>o.unshift(t))),this._styles=o}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!supportsAdoptingStyleSheets){const i=Array.prototype.slice.call(t.cssRules).reduce(((t,i)=>t+i.cssText),"");return unsafeCSS(i)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?supportsAdoptingStyleSheets?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const i=this.render();super.update(t),i!==renderNotImplemented&&this.constructor.render(i,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const i=document.createElement("style");i.textContent=t.cssText,this.renderRoot.appendChild(i)})))}render(){return renderNotImplemented}}LitElement.finalized=!0,LitElement.render=render,LitElement.shadowRootOptions={mode:"open"};
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */
var __extends=(extendStatics=function(t,i){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var e in i)i.hasOwnProperty(e)&&(t[e]=i[e])},extendStatics(t,i)},function(t,i){function e(){this.constructor=t}extendStatics(t,i),t.prototype=null===i?Object.create(i):(e.prototype=i.prototype,new e)}),extendStatics,_hasOwnProperty=Object.prototype.hasOwnProperty;function hasOwnProperty$1(t,i){return _hasOwnProperty.call(t,i)}function _objectKeys(t){if(Array.isArray(t)){for(var i=new Array(t.length),e=0;e<i.length;e++)i[e]=""+e;return i}if(Object.keys)return Object.keys(t);var o=[];for(var s in t)hasOwnProperty$1(t,s)&&o.push(s);return o}function _deepClone(t){switch(typeof t){case"object":return JSON.parse(JSON.stringify(t));case"undefined":return null;default:return t}}function isInteger(t){for(var i,e=0,o=t.length;e<o;){if(!((i=t.charCodeAt(e))>=48&&i<=57))return!1;e++}return!0}function escapePathComponent(t){return-1===t.indexOf("/")&&-1===t.indexOf("~")?t:t.replace(/~/g,"~0").replace(/\//g,"~1")}function unescapePathComponent(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}function hasUndefined(t){if(void 0===t)return!0;if(t)if(Array.isArray(t)){for(var i=0,e=t.length;i<e;i++)if(hasUndefined(t[i]))return!0}else if("object"==typeof t)for(var o=_objectKeys(t),s=o.length,n=0;n<s;n++)if(hasUndefined(t[o[n]]))return!0;return!1}function patchErrorMessageFormatter(t,i){var e=[t];for(var o in i){var s="object"==typeof i[o]?JSON.stringify(i[o],null,2):i[o];void 0!==s&&e.push(o+": "+s)}return e.join("\n")}var PatchError=function(t){function i(i,e,o,s,n){var r=this.constructor,a=t.call(this,patchErrorMessageFormatter(i,{name:e,index:o,operation:s,tree:n}))||this;return a.name=e,a.index=o,a.operation=s,a.tree=n,Object.setPrototypeOf(a,r.prototype),a.message=patchErrorMessageFormatter(i,{name:e,index:o,operation:s,tree:n}),a}return __extends(i,t),i}(Error),JsonPatchError=PatchError,deepClone=_deepClone,objOps={add:function(t,i,e){return t[i]=this.value,{newDocument:e}},remove:function(t,i,e){var o=t[i];return delete t[i],{newDocument:e,removed:o}},replace:function(t,i,e){var o=t[i];return t[i]=this.value,{newDocument:e,removed:o}},move:function(t,i,e){var o=getValueByPointer(e,this.path);o&&(o=_deepClone(o));var s=applyOperation(e,{op:"remove",path:this.from}).removed;return applyOperation(e,{op:"add",path:this.path,value:s}),{newDocument:e,removed:o}},copy:function(t,i,e){var o=getValueByPointer(e,this.from);return applyOperation(e,{op:"add",path:this.path,value:_deepClone(o)}),{newDocument:e}},test:function(t,i,e){return{newDocument:e,test:_areEquals(t[i],this.value)}},_get:function(t,i,e){return this.value=t[i],{newDocument:e}}},arrOps={add:function(t,i,e){return isInteger(i)?t.splice(i,0,this.value):t[i]=this.value,{newDocument:e,index:i}},remove:function(t,i,e){return{newDocument:e,removed:t.splice(i,1)[0]}},replace:function(t,i,e){var o=t[i];return t[i]=this.value,{newDocument:e,removed:o}},move:objOps.move,copy:objOps.copy,test:objOps.test,_get:objOps._get};function getValueByPointer(t,i){if(""==i)return t;var e={op:"_get",path:i};return applyOperation(t,e),e.value}function applyOperation(t,i,e,o,s,n){if(void 0===e&&(e=!1),void 0===o&&(o=!0),void 0===s&&(s=!0),void 0===n&&(n=0),e&&("function"==typeof e?e(i,0,t,i.path):validator(i,0)),""===i.path){var r={newDocument:t};if("add"===i.op)return r.newDocument=i.value,r;if("replace"===i.op)return r.newDocument=i.value,r.removed=t,r;if("move"===i.op||"copy"===i.op)return r.newDocument=getValueByPointer(t,i.from),"move"===i.op&&(r.removed=t),r;if("test"===i.op){if(r.test=_areEquals(t,i.value),!1===r.test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",n,i,t);return r.newDocument=t,r}if("remove"===i.op)return r.removed=t,r.newDocument=null,r;if("_get"===i.op)return i.value=t,r;if(e)throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",n,i,t);return r}o||(t=_deepClone(t));var a=(i.path||"").split("/"),I=t,g=1,l=a.length,c=void 0,d=void 0,h=void 0;for(h="function"==typeof e?e:validator;;){if((d=a[g])&&-1!=d.indexOf("~")&&(d=unescapePathComponent(d)),s&&("__proto__"==d||"prototype"==d&&g>0&&"constructor"==a[g-1]))throw new TypeError("JSON-Patch: modifying `__proto__` or `constructor/prototype` prop is banned for security reasons, if this was on purpose, please set `banPrototypeModifications` flag false and pass it to this function. More info in fast-json-patch README");if(e&&void 0===c&&(void 0===I[d]?c=a.slice(0,g).join("/"):g==l-1&&(c=i.path),void 0!==c&&h(i,0,t,c)),g++,Array.isArray(I)){if("-"===d)d=I.length;else{if(e&&!isInteger(d))throw new JsonPatchError("Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index","OPERATION_PATH_ILLEGAL_ARRAY_INDEX",n,i,t);isInteger(d)&&(d=~~d)}if(g>=l){if(e&&"add"===i.op&&d>I.length)throw new JsonPatchError("The specified index MUST NOT be greater than the number of elements in the array","OPERATION_VALUE_OUT_OF_BOUNDS",n,i,t);if(!1===(r=arrOps[i.op].call(i,I,d,t)).test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",n,i,t);return r}}else if(g>=l){if(!1===(r=objOps[i.op].call(i,I,d,t)).test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",n,i,t);return r}if(I=I[d],e&&g<l&&(!I||"object"!=typeof I))throw new JsonPatchError("Cannot perform operation at the desired path","OPERATION_PATH_UNRESOLVABLE",n,i,t)}}function applyPatch(t,i,e,o,s){if(void 0===o&&(o=!0),void 0===s&&(s=!0),e&&!Array.isArray(i))throw new JsonPatchError("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");o||(t=_deepClone(t));for(var n=new Array(i.length),r=0,a=i.length;r<a;r++)n[r]=applyOperation(t,i[r],e,!0,s,r),t=n[r].newDocument;return n.newDocument=t,n}function applyReducer(t,i,e){var o=applyOperation(t,i);if(!1===o.test)throw new JsonPatchError("Test operation failed","TEST_OPERATION_FAILED",e,i,t);return o.newDocument}function validator(t,i,e,o){if("object"!=typeof t||null===t||Array.isArray(t))throw new JsonPatchError("Operation is not an object","OPERATION_NOT_AN_OBJECT",i,t,e);if(!objOps[t.op])throw new JsonPatchError("Operation `op` property is not one of operations defined in RFC-6902","OPERATION_OP_INVALID",i,t,e);if("string"!=typeof t.path)throw new JsonPatchError("Operation `path` property is not a string","OPERATION_PATH_INVALID",i,t,e);if(0!==t.path.indexOf("/")&&t.path.length>0)throw new JsonPatchError('Operation `path` property must start with "/"',"OPERATION_PATH_INVALID",i,t,e);if(("move"===t.op||"copy"===t.op)&&"string"!=typeof t.from)throw new JsonPatchError("Operation `from` property is not present (applicable in `move` and `copy` operations)","OPERATION_FROM_REQUIRED",i,t,e);if(("add"===t.op||"replace"===t.op||"test"===t.op)&&void 0===t.value)throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_REQUIRED",i,t,e);if(("add"===t.op||"replace"===t.op||"test"===t.op)&&hasUndefined(t.value))throw new JsonPatchError("Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)","OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED",i,t,e);if(e)if("add"==t.op){var s=t.path.split("/").length,n=o.split("/").length;if(s!==n+1&&s!==n)throw new JsonPatchError("Cannot perform an `add` operation at the desired path","OPERATION_PATH_CANNOT_ADD",i,t,e)}else if("replace"===t.op||"remove"===t.op||"_get"===t.op){if(t.path!==o)throw new JsonPatchError("Cannot perform the operation at a path that does not exist","OPERATION_PATH_UNRESOLVABLE",i,t,e)}else if("move"===t.op||"copy"===t.op){var r=validate([{op:"_get",path:t.from,value:void 0}],e);if(r&&"OPERATION_PATH_UNRESOLVABLE"===r.name)throw new JsonPatchError("Cannot perform the operation from a path that does not exist","OPERATION_FROM_UNRESOLVABLE",i,t,e)}}function validate(t,i,e){try{if(!Array.isArray(t))throw new JsonPatchError("Patch sequence must be an array","SEQUENCE_NOT_AN_ARRAY");if(i)applyPatch(_deepClone(i),_deepClone(t),e||!0);else{e=e||validator;for(var o=0;o<t.length;o++)e(t[o],o,i,void 0)}}catch(t){if(t instanceof JsonPatchError)return t;throw t}}function _areEquals(t,i){if(t===i)return!0;if(t&&i&&"object"==typeof t&&"object"==typeof i){var e,o,s,n=Array.isArray(t),r=Array.isArray(i);if(n&&r){if((o=t.length)!=i.length)return!1;for(e=o;0!=e--;)if(!_areEquals(t[e],i[e]))return!1;return!0}if(n!=r)return!1;var a=Object.keys(t);if((o=a.length)!==Object.keys(i).length)return!1;for(e=o;0!=e--;)if(!i.hasOwnProperty(a[e]))return!1;for(e=o;0!=e--;)if(!_areEquals(t[s=a[e]],i[s]))return!1;return!0}return t!=t&&i!=i}var core=Object.freeze({__proto__:null,JsonPatchError,_areEquals,applyOperation,applyPatch,applyReducer,deepClone,getValueByPointer,validate,validator}),beforeDict=new WeakMap,Mirror=function(t){this.observers=new Map,this.obj=t},ObserverInfo=function(t,i){this.callback=t,this.observer=i};
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
      `]}static get properties(){return{json:{type:Object},mode:{type:String},modes:{type:Array},name:{type:String},search:{type:Boolean,reflect:!0},indentation:{type:Number},history:{type:Boolean}}}constructor(){super(),this.json={},this.modes=[],this.search=!1,this.history=!1}firstUpdated(){this.shadowRoot&&(this._injectTheme("#ace_editor\\.css"),this._injectTheme("#ace-tm"),this._injectTheme("#ace_searchbox"),ace.config.loadModule(["theme","ace/theme/jsoneditor"],(()=>{this._injectTheme("#ace-jsoneditor")}))),this._initializeEditor()}updated(t){super.updated(t),t.has("mode")&&this.editor.setMode(this.mode),t.has("name")&&this.editor.setName(this.name),t.has("json")&&(this._observer&&unobserve(t.get("json"),this._observer),this.json&&(this._observer=observe(this.json,this._refresh.bind(this))),this._refresh())}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this.editor&&(this._observer=observe(this.json,this._refresh))}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this._observer&&unobserve(this.json,this._observer)}render(){return html$1`<div id="jsonEditorContainer"></div> `}_initializeEditor(){this._jsonEditorContainer=this.shadowRoot.querySelector("#jsonEditorContainer");const t={mode:this.mode,history:this.history,name:this.name,modes:this.modes,search:this.search,indentation:this.indentation,onChange:()=>{if(this.editor)try{const t=compare$1(this.json,this.editor.get());this.dispatchEvent(new CustomEvent("change",{detail:{json:this.json,patches:t}})),this._observer&&unobserve(this.json,this._observer),applyPatch(this.json,t),this._observer=observe(this.json,this._refresh)}catch(t){this.dispatchEvent(new CustomEvent("error",{detail:{level:"fleshy",error:t}}))}},onError:t=>{this.dispatchEvent(new CustomEvent("error",{detail:{level:"upstream",error:t}}))}};this.editor=new JSONEditor(this._jsonEditorContainer,t),this.editor.set(this.json);let i=JSONEditorAPI.length-1;for(;i;)this[JSONEditorAPI[i]]=this.editor[JSONEditorAPI[i]].bind(this.editor),i-=1}_refresh(){this.editor.set(this.json)}_injectTheme(t){const i=document.querySelector(t);this.shadowRoot.appendChild(this._cloneStyle(i))}_cloneStyle(t){const i=document.createElement("style");return i.id=t.id,i.textContent=t.textContent,i}}window.customElements.define("fleshy-jsoneditor",FleshyJsoneditor);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const styles$5=i$5`.elevated{--md-elevation-level: var(--_elevated-container-elevation);--md-elevation-shadow-color: var(--_elevated-container-shadow-color)}.elevated::before{background:var(--_elevated-container-color)}.elevated:hover{--md-elevation-level: var(--_elevated-hover-container-elevation)}.elevated:focus-within{--md-elevation-level: var(--_elevated-focus-container-elevation)}.elevated:active{--md-elevation-level: var(--_elevated-pressed-container-elevation)}.elevated.disabled{--md-elevation-level: var(--_elevated-disabled-container-elevation)}.elevated.disabled::before{background:var(--_elevated-disabled-container-color);opacity:var(--_elevated-disabled-container-opacity)}@media(forced-colors: active){.elevated md-elevation{border:1px solid CanvasText}.elevated.disabled md-elevation{border-color:GrayText}}/*# sourceMappingURL=elevated-styles.css.map */
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;class Chip extends s$8{constructor(){super(...arguments),this.disabled=!1,this.alwaysFocusable=!1,this.label="",this.hasIcon=!1}get rippleDisabled(){return this.disabled}focus(t){this.disabled&&!this.alwaysFocusable||super.focus(t)}render(){return x`
      <div class="container ${e$8(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `}updated(t){t.has("disabled")&&void 0!==t.get("disabled")&&this.dispatchEvent(new Event("update-focus",{bubbles:!0}))}getContainerClasses(){return{disabled:this.disabled,"has-icon":this.hasIcon}}renderContainerContent(){return x`
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
    `}handleIconChange(t){const i=t.target;this.hasIcon=i.assignedElements({flatten:!0}).length>0}}requestUpdateOnAriaChange(Chip),Chip.shadowRootOptions={...s$8.shadowRootOptions,delegatesFocus:!0},__decorate$i([n$8({type:Boolean,reflect:!0})],Chip.prototype,"disabled",void 0),__decorate$i([n$8({type:Boolean,attribute:"always-focusable"})],Chip.prototype,"alwaysFocusable",void 0),__decorate$i([n$8()],Chip.prototype,"label",void 0),__decorate$i([n$8({type:Boolean,reflect:!0,attribute:"has-icon"})],Chip.prototype,"hasIcon",void 0);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ARIA_LABEL_REMOVE="aria-label-remove";class MultiActionChip extends Chip{get ariaLabelRemove(){if(this.hasAttribute(ARIA_LABEL_REMOVE))return this.getAttribute(ARIA_LABEL_REMOVE);const{ariaLabel:t}=this;return`Remove ${t||this.label}`}set ariaLabelRemove(t){t!==this.ariaLabelRemove&&(null===t?this.removeAttribute(ARIA_LABEL_REMOVE):this.setAttribute(ARIA_LABEL_REMOVE,t),this.requestUpdate())}constructor(){super(),this.handleTrailingActionFocus=this.handleTrailingActionFocus.bind(this),this.addEventListener("keydown",this.handleKeyDown.bind(this))}focus(t){(this.alwaysFocusable||!this.disabled)&&t?.trailing&&this.trailingAction?this.trailingAction.focus(t):super.focus(t)}renderContainerContent(){return x`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `}handleKeyDown(t){const i="ArrowLeft"===t.key,e="ArrowRight"===t.key;if(!i&&!e)return;if(!this.primaryAction||!this.trailingAction)return;const o="rtl"===getComputedStyle(this).direction?i:e,s=this.primaryAction?.matches(":focus-within"),n=this.trailingAction?.matches(":focus-within");if(o&&n||!o&&s)return;t.preventDefault(),t.stopPropagation();(o?this.trailingAction:this.primaryAction).focus()}handleTrailingActionFocus(){const{primaryAction:t,trailingAction:i}=this;t&&i&&(t.tabIndex=-1,i.addEventListener("focusout",(()=>{t.tabIndex=0}),{once:!0}))}}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function renderRemoveButton({ariaLabel:t,disabled:i,focusListener:e,tabbable:o=!1}){return x`
    <button
      class="trailing action"
      aria-label=${t}
      tabindex=${o?T$2:-1}
      @click=${handleRemoveClick}
      @focus=${e}>
      <md-focus-ring part="trailing-focus-ring"></md-focus-ring>
      <md-ripple ?disabled=${i}></md-ripple>
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
  `}function handleRemoveClick(t){if(this.disabled)return;t.stopPropagation();!this.dispatchEvent(new Event("remove",{cancelable:!0}))||this.remove()}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class FilterChip extends MultiActionChip{constructor(){super(...arguments),this.elevated=!1,this.removable=!1,this.selected=!1,this.hasSelectedIcon=!1}get primaryId(){return"button"}getContainerClasses(){return{...super.getContainerClasses(),elevated:this.elevated,selected:this.selected,"has-trailing":this.removable,"has-icon":this.hasIcon||this.selected}}renderPrimaryAction(t){const{ariaLabel:i}=this;return x`
      <button
        class="primary action"
        id="button"
        aria-label=${i||T$2}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled&&!this.alwaysFocusable}
        @click=${this.handleClick}
        >${t}</button
      >
    `}renderLeadingIcon(){return this.selected?x`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `:super.renderLeadingIcon()}renderTrailingAction(t){return this.removable?renderRemoveButton({focusListener:t,ariaLabel:this.ariaLabelRemove,disabled:this.disabled}):T$2}renderOutline(){return this.elevated?x`<md-elevation></md-elevation>`:super.renderOutline()}handleClick(t){if(this.disabled)return;const i=this.selected;this.selected=!this.selected;!redispatchEvent(this,t)&&(this.selected=i)}}__decorate$i([n$8({type:Boolean})],FilterChip.prototype,"elevated",void 0),__decorate$i([n$8({type:Boolean})],FilterChip.prototype,"removable",void 0),__decorate$i([n$8({type:Boolean,reflect:!0})],FilterChip.prototype,"selected",void 0),__decorate$i([n$8({type:Boolean,reflect:!0,attribute:"has-selected-icon"})],FilterChip.prototype,"hasSelectedIcon",void 0),__decorate$i([e$7(".primary.action")],FilterChip.prototype,"primaryAction",void 0),__decorate$i([e$7(".trailing.action")],FilterChip.prototype,"trailingAction",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const styles$4=i$5`:host{--_container-height: var(--md-filter-chip-container-height, 32px);--_disabled-label-text-color: var(--md-filter-chip-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filter-chip-disabled-label-text-opacity, 0.38);--_elevated-container-elevation: var(--md-filter-chip-elevated-container-elevation, 1);--_elevated-container-shadow-color: var(--md-filter-chip-elevated-container-shadow-color, var(--md-sys-color-shadow, #000));--_elevated-disabled-container-color: var(--md-filter-chip-elevated-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_elevated-disabled-container-elevation: var(--md-filter-chip-elevated-disabled-container-elevation, 0);--_elevated-disabled-container-opacity: var(--md-filter-chip-elevated-disabled-container-opacity, 0.12);--_elevated-focus-container-elevation: var(--md-filter-chip-elevated-focus-container-elevation, 1);--_elevated-hover-container-elevation: var(--md-filter-chip-elevated-hover-container-elevation, 2);--_elevated-pressed-container-elevation: var(--md-filter-chip-elevated-pressed-container-elevation, 1);--_elevated-selected-container-color: var(--md-filter-chip-elevated-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_label-text-font: var(--md-filter-chip-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filter-chip-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-filter-chip-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-filter-chip-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_selected-focus-label-text-color: var(--md-filter-chip-selected-focus-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-label-text-color: var(--md-filter-chip-selected-hover-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-color: var(--md-filter-chip-selected-hover-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-state-layer-opacity: var(--md-filter-chip-selected-hover-state-layer-opacity, 0.08);--_selected-label-text-color: var(--md-filter-chip-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-label-text-color: var(--md-filter-chip-selected-pressed-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-state-layer-color: var(--md-filter-chip-selected-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_selected-pressed-state-layer-opacity: var(--md-filter-chip-selected-pressed-state-layer-opacity, 0.12);--_elevated-container-color: var(--md-filter-chip-elevated-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_disabled-outline-color: var(--md-filter-chip-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-outline-opacity: var(--md-filter-chip-disabled-outline-opacity, 0.12);--_disabled-selected-container-color: var(--md-filter-chip-disabled-selected-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-selected-container-opacity: var(--md-filter-chip-disabled-selected-container-opacity, 0.12);--_focus-outline-color: var(--md-filter-chip-focus-outline-color, var(--md-sys-color-on-surface-variant, #49454f));--_outline-color: var(--md-filter-chip-outline-color, var(--md-sys-color-outline, #79747e));--_outline-width: var(--md-filter-chip-outline-width, 1px);--_selected-container-color: var(--md-filter-chip-selected-container-color, var(--md-sys-color-secondary-container, #e8def8));--_selected-outline-width: var(--md-filter-chip-selected-outline-width, 0px);--_focus-label-text-color: var(--md-filter-chip-focus-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-label-text-color: var(--md-filter-chip-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filter-chip-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-filter-chip-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-filter-chip-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-label-text-color: var(--md-filter-chip-pressed-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-filter-chip-pressed-state-layer-color, var(--md-sys-color-on-secondary-container, #1d192b));--_pressed-state-layer-opacity: var(--md-filter-chip-pressed-state-layer-opacity, 0.12);--_icon-size: var(--md-filter-chip-icon-size, 18px);--_disabled-leading-icon-color: var(--md-filter-chip-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filter-chip-disabled-leading-icon-opacity, 0.38);--_selected-focus-leading-icon-color: var(--md-filter-chip-selected-focus-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-leading-icon-color: var(--md-filter-chip-selected-hover-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-leading-icon-color: var(--md-filter-chip-selected-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-leading-icon-color: var(--md-filter-chip-selected-pressed-leading-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-leading-icon-color: var(--md-filter-chip-focus-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-leading-icon-color: var(--md-filter-chip-hover-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_leading-icon-color: var(--md-filter-chip-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_pressed-leading-icon-color: var(--md-filter-chip-pressed-leading-icon-color, var(--md-sys-color-primary, #6750a4));--_disabled-trailing-icon-color: var(--md-filter-chip-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filter-chip-disabled-trailing-icon-opacity, 0.38);--_selected-focus-trailing-icon-color: var(--md-filter-chip-selected-focus-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-hover-trailing-icon-color: var(--md-filter-chip-selected-hover-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-pressed-trailing-icon-color: var(--md-filter-chip-selected-pressed-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_selected-trailing-icon-color: var(--md-filter-chip-selected-trailing-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_focus-trailing-icon-color: var(--md-filter-chip-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filter-chip-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-trailing-icon-color: var(--md-filter-chip-pressed-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-color: var(--md-filter-chip-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_container-shape-start-start: var(--md-filter-chip-container-shape-start-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-start-end: var(--md-filter-chip-container-shape-start-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-end: var(--md-filter-chip-container-shape-end-end, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_container-shape-end-start: var(--md-filter-chip-container-shape-end-start, var(--md-filter-chip-container-shape, var(--md-sys-shape-corner-small, 8px)));--_leading-space: var(--md-filter-chip-leading-space, 16px);--_trailing-space: var(--md-filter-chip-trailing-space, 16px);--_icon-label-space: var(--md-filter-chip-icon-label-space, 8px);--_with-leading-icon-leading-space: var(--md-filter-chip-with-leading-icon-leading-space, 8px);--_with-trailing-icon-trailing-space: var(--md-filter-chip-with-trailing-icon-trailing-space, 8px)}.selected.elevated::before{background:var(--_elevated-selected-container-color)}.checkmark{height:var(--_icon-size);width:var(--_icon-size)}.disabled .checkmark{opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){.disabled .checkmark{opacity:1}}/*# sourceMappingURL=filter-styles.css.map */
`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,styles$3=i$5`.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}:where(.selected)::before{background:var(--_selected-container-color)}:where(.selected) .outline{border-width:var(--_selected-outline-width)}:where(.selected.disabled)::before{background:var(--_disabled-selected-container-color);opacity:var(--_disabled-selected-container-opacity)}:where(.selected) .label{color:var(--_selected-label-text-color)}:where(.selected:hover) .label{color:var(--_selected-hover-label-text-color)}:where(.selected:focus) .label{color:var(--_selected-focus-label-text-color)}:where(.selected:active) .label{color:var(--_selected-pressed-label-text-color)}:where(.selected) .leading.icon{color:var(--_selected-leading-icon-color)}:where(.selected:hover) .leading.icon{color:var(--_selected-hover-leading-icon-color)}:where(.selected:focus) .leading.icon{color:var(--_selected-focus-leading-icon-color)}:where(.selected:active) .leading.icon{color:var(--_selected-pressed-leading-icon-color)}@media(forced-colors: active){:where(.selected:not(.elevated))::before{border:1px solid CanvasText}:where(.selected) .outline{border-width:1px}}/*# sourceMappingURL=selectable-styles.css.map */
`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,styles$2=i$5`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);display:inline-flex;height:var(--_container-height);cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}:host([disabled]){pointer-events:none}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}.container{border-radius:inherit;box-sizing:border-box;display:flex;height:100%;position:relative;width:100%}.container::before{border-radius:inherit;content:"";inset:0;pointer-events:none;position:absolute}.container:not(.disabled){cursor:pointer}.container.disabled{pointer-events:none}.cell{display:flex}.action{align-items:baseline;appearance:none;background:none;border:none;border-radius:inherit;display:flex;outline:none;padding:0;position:relative;text-decoration:none}.primary.action{padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space)}.has-icon .primary.action{padding-inline-start:var(--_with-leading-icon-leading-space)}.touch{height:48px;inset:50% 0 0;position:absolute;transform:translateY(-50%);width:100%}:host([touch-target=none]) .touch{display:none}.outline{border:var(--_outline-width) solid var(--_outline-color);border-radius:inherit;inset:0;pointer-events:none;position:absolute}:where(:focus) .outline{border-color:var(--_focus-outline-color)}:where(.disabled) .outline{border-color:var(--_disabled-outline-color);opacity:var(--_disabled-outline-opacity)}md-ripple{border-radius:inherit}.label,.icon,.touch{z-index:1}.label{align-items:center;color:var(--_label-text-color);display:flex;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);height:100%;text-overflow:ellipsis;user-select:none;white-space:nowrap}:where(:hover) .label{color:var(--_hover-label-text-color)}:where(:focus) .label{color:var(--_focus-label-text-color)}:where(:active) .label{color:var(--_pressed-label-text-color)}:where(.disabled) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.icon{align-self:center;display:flex;fill:currentColor;position:relative}.icon ::slotted(:first-child){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size)}.leading.icon{color:var(--_leading-icon-color)}.leading.icon ::slotted(*),.leading.icon svg{margin-inline-end:var(--_icon-label-space)}:where(:hover) .leading.icon{color:var(--_hover-leading-icon-color)}:where(:focus) .leading.icon{color:var(--_focus-leading-icon-color)}:where(:active) .leading.icon{color:var(--_pressed-leading-icon-color)}:where(.disabled) .leading.icon{color:var(--_disabled-leading-icon-color);opacity:var(--_disabled-leading-icon-opacity)}@media(forced-colors: active){:where(.disabled) :is(.label,.outline,.leading.icon){color:GrayText;opacity:1}}a,button:not(:disabled){cursor:inherit}/*# sourceMappingURL=shared-styles.css.map */
`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,styles$1=i$5`.trailing.action{align-items:center;justify-content:center;padding-inline-start:var(--_icon-label-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}.trailing.action :is(md-ripple,md-focus-ring){border-radius:50%;height:calc(1.3333333333*var(--_icon-size));width:calc(1.3333333333*var(--_icon-size))}.trailing.action md-focus-ring{inset:unset}.has-trailing .primary.action{padding-inline-end:0}.trailing.icon{color:var(--_trailing-icon-color);height:var(--_icon-size);width:var(--_icon-size)}:where(:hover) .trailing.icon{color:var(--_hover-trailing-icon-color)}:where(:focus) .trailing.icon{color:var(--_focus-trailing-icon-color)}:where(:active) .trailing.icon{color:var(--_pressed-trailing-icon-color)}:where(.disabled) .trailing.icon{color:var(--_disabled-trailing-icon-color);opacity:var(--_disabled-trailing-icon-opacity)}:where(.selected) .trailing.icon{color:var(--_selected-trailing-icon-color)}:where(.selected:hover) .trailing.icon{color:var(--_selected-hover-trailing-icon-color)}:where(.selected:focus) .trailing.icon{color:var(--_selected-focus-trailing-icon-color)}:where(.selected:active) .trailing.icon{color:var(--_selected-pressed-trailing-icon-color)}@media(forced-colors: active){.trailing.icon{color:ButtonText}:where(.disabled) .trailing.icon{color:GrayText;opacity:1}}/*# sourceMappingURL=trailing-icon-styles.css.map */
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let MdFilterChip=class extends FilterChip{};MdFilterChip.styles=[styles$2,styles$5,styles$1,styles$3,styles$4],MdFilterChip=__decorate$i([t$5("md-filter-chip")],MdFilterChip);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ChipSet extends s$8{get chips(){return this.childElements.filter((t=>t instanceof Chip))}constructor(){super(),this.internals=this.attachInternals(),this.addEventListener("focusin",this.updateTabIndices.bind(this)),this.addEventListener("update-focus",this.updateTabIndices.bind(this)),this.addEventListener("keydown",this.handleKeyDown.bind(this)),this.internals.role="toolbar"}render(){return x`<slot @slotchange=${this.updateTabIndices}></slot>`}handleKeyDown(t){const i="ArrowLeft"===t.key,e="ArrowRight"===t.key,o="Home"===t.key,s="End"===t.key;if(!(i||e||o||s))return;const{chips:n}=this;if(n.length<2)return;if(t.preventDefault(),o||s){return n[o?0:n.length-1].focus({trailing:s}),void this.updateTabIndices()}const r="rtl"===getComputedStyle(this).direction?i:e,a=n.find((t=>t.matches(":focus-within")));if(!a){return(r?n[0]:n[n.length-1]).focus({trailing:!r}),void this.updateTabIndices()}const I=n.indexOf(a);let g=r?I+1:I-1;for(;g!==I;){g>=n.length?g=0:g<0&&(g=n.length-1);const t=n[g];if(!t.disabled||t.alwaysFocusable){t.focus({trailing:!r}),this.updateTabIndices();break}r?g++:g--}}updateTabIndices(){const{chips:t}=this;let i;for(const e of t){const t=e.alwaysFocusable||!e.disabled;e.matches(":focus-within")&&t?i=e:(t&&!i&&(i=e),e.tabIndex=-1)}i&&(i.tabIndex=0)}}__decorate$i([o$a()],ChipSet.prototype,"childElements",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const styles=i$5`:host{display:flex;flex-wrap:wrap;gap:8px}/*# sourceMappingURL=chip-set-styles.css.map */
`
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let MdChipSet=class extends ChipSet{};MdChipSet.styles=[styles],MdChipSet=__decorate$i([t$5("md-chip-set")],MdChipSet);var __decorate$a=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let AoiEarlIdeasEditor=class extends YpStreamingLlmBase{constructor(){super(),this.isGeneratingWithAi=!1,this.isSubmittingIdeas=!1,this.isFetchingChoices=!1,this.currentIdeasFilter="latest",this.scrollElementSelector="#answers",this.serverApi=new AoiAdminServerApi,this.shouldContinueGenerating=!0,this.currentGeneratingIndex=void 0}connectedCallback(){this.createGroupObserver(),this.setupBootListener(),this.imageGenerator=new AoiGenerateAiLogos(this.themeColor),this.configuration.earl&&this.configuration.earl.question_id?(this.disableWebsockets=!0,this.isCreatingIdeas=!1,this.getChoices()):this.isCreatingIdeas=!0,super.connectedCallback(),this.addEventListener("yp-ws-closed",this.socketClosed),this.addEventListener("yp-ws-error",this.socketError),this.addGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this))}disconnectedCallback(){this.removeEventListener("yp-ws-closed",this.socketClosed),this.removeEventListener("yp-ws-error",this.socketError),this.removeGlobalListener("yp-theme-configuration-updated",this.themeUpdated.bind(this)),super.disconnectedCallback()}themeUpdated(t){this.imageGenerator=new AoiGenerateAiLogos(t.detail.oneDynamicColor||t.detail.primaryColor||this.themeColor),this.requestUpdate()}socketClosed(){this.isGeneratingWithAi=!1}socketError(){this.isGeneratingWithAi=!1}async getChoices(){this.choices=await this.serverApi.getChoices(this.communityId,this.configuration.earl.question_id)}createGroupObserver(){const t={set:(t,i,e,o)=>(console.error(`Property ${String(i)} set to`,e),this.handleGroupChange(),Reflect.set(t,i,e,o))};this.group=new Proxy(this.group,t)}handleGroupChange(){console.error("Group changed",this.group)}async addChatBotElement(t){switch(t.type){case"start":case"moderation_error":break;case"error":this.isGeneratingWithAi=!1;break;case"end":this.isGeneratingWithAi=!1,this.answersElement.value+="\n";break;case"stream":if(t.message&&"undefined"!=t.message){this.answersElement.value+=t.message,this.answersElement.value=this.answersElement.value.replace(/\n\n/g,"\n");break}console.warn("stream message is undefined")}this.scrollDown()}get answers(){return this.$$("#answers")?.value.split("\n").map((t=>t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t"))).filter((t=>t.length>0))}hasMoreThanOneIdea(){}openMenuFor(t){console.log("openMenuFor",t)}generateIdeas(){this.isGeneratingWithAi=!0;try{this.serverApi.startGenerateIdeas(this.configuration.earl.question.name,this.communityId,this.wsClientId,this.answers)}catch(t){console.error(t)}}async submitIdeasForCreation(){this.isSubmittingIdeas=!0;try{const{question_id:t}=await this.serverApi.submitIdeasForCreation(this.communityId,this.answers,this.configuration.earl.question.name);this.configuration.earl.question_id=t,this.configuration.earl.active=!0,this.configuration.earl.configuration||(this.configuration.earl.configuration={}),this.configuration.earl.question||(this.configuration.earl.question={}),this.configuration.earl.question.id=t,this.fire("configuration-changed",this.configuration),this.requestUpdate(),this.getChoices()}catch(t){console.error(t)}finally{this.isSubmittingIdeas=!1}}toggleIdeaActivity(t){return async()=>{this.isTogglingIdeaActive=t.id;try{t.active=!t.active,await this.serverApi.updateActive(this.communityId,this.configuration.earl.question_id,t.id,t.active)}catch(t){console.error(t)}finally{this.isTogglingIdeaActive=void 0}this.requestUpdate()}}applyFilter(t){this.currentIdeasFilter=t}get sortedChoices(){if(this.choices)switch(this.currentIdeasFilter){case"latest":return this.choices.sort(((t,i)=>i.id-t.id));case"highestScore":return this.choices.sort(((t,i)=>i.score-t.score));case"activeDeactive":return this.choices.sort(((t,i)=>i.active<t.active?-1:i.active>t.active?1:0))}}updated(t){super.updated(t)}async generateAiIcons(){this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let t=0;t<this.choices.length&&this.shouldContinueGenerating;t+=5){const i=[];for(let e=t;e<t+5&&e<this.choices.length;e++){const t=this.choices[e];if(t.data?.imageUrl)continue;const o=new AoiGenerateAiLogos(this.themeColor);o.collectionType="community",o.collectionId=this.communityId,t.data.isGeneratingImage=!0,this.requestUpdate();const s=o.generateIcon(t.data.content,this.$$("#aiStyleInput").value).then((i=>{if(t.data.isGeneratingImage=void 0,i.error)console.error(i.error);else if(this.shouldContinueGenerating)return i.imageUrl?this.serverApi.updateChoice(this.communityId,this.configuration.earl.question_id,t.id,{content:t.data.content,imageUrl:i.imageUrl,choiceId:t.id}).then((()=>{t.data.imageUrl=i.imageUrl,this.requestUpdate()})):void 0})).catch((i=>{t.data.isGeneratingImage=!1,console.error(i)}));i.push(s)}await Promise.all(i)}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}async generateAiIconsOld(){this.imageGenerator.collectionType="community",this.imageGenerator.collectionId=this.communityId,this.isGeneratingWithAi=!0,this.shouldContinueGenerating=!0;for(let t=0;t<this.choices.length&&this.shouldContinueGenerating;t++){const i=this.choices[t];if(!i.data?.imageUrl){this.currentGeneratingIndex=t;try{i.data.isGeneratingImage=!0;const{imageUrl:t,error:e}=await this.imageGenerator.generateIcon(i.data.content,this.$$("#aiStyleInput").value);if(i.data.isGeneratingImage=void 0,e){console.error(e);continue}if(!this.shouldContinueGenerating)break;await this.serverApi.updateChoice(this.communityId,this.configuration.earl.question_id,i.id,{content:i.data.content,imageUrl:t,choiceId:i.id}),i.data.imageUrl=t,console.error("imageUrl",t,"error",e),this.requestUpdate()}catch(t){i.data.isGeneratingImage=!1,console.error(t)}}}this.isGeneratingWithAi=!1,this.currentGeneratingIndex=void 0}stopGenerating(){this.shouldContinueGenerating=!1,this.isGeneratingWithAi=!1,this.choices&&void 0!==this.currentGeneratingIndex&&(this.choices[this.currentGeneratingIndex].data.isGeneratingImage=!1,this.requestUpdate())}get allChoicesHaveIcons(){return this.choices?.every((t=>t.data.imageUrl))}async deleteImageUrl(t){t.data.imageUrl=void 0,await this.serverApi.updateChoice(this.communityId,this.configuration.earl.question_id,t.id,{content:t.data.content,imageUrl:void 0,choiceId:t.id}),this.requestUpdate()}static get styles(){return[super.styles,i$5`
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
      <div class="layout vertical center-center">
        <md-filled-text-field
          type="textarea"
          id="answers"
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
                  ?disabled="${this.isGeneratingWithAi}"
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
    `}renderIcon(t){return t.data.isGeneratingImage?x`
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `:t.data.imageUrl?x` <img
        class="iconImage"
        src="${t.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!t.data.imageUrl}"
      />`:T$2}aiStyleChanged(){this.group.configuration.theme||(this.group.configuration.theme={}),this.fire("theme-config-changed",{iconPrompt:this.aiStyleInputElement?.value})}renderAnswerData(t){return x`
      <div class="iconContainer">
        <md-elevated-button
          id="leftAnswerButton"
          class="leftAnswer"
          trailing-icon
        >
          ${this.renderIcon(t)}
          <yp-magic-text
            id="answerText"
            .contentId="${this.groupId}"
            .extraId="${t.data.choiceId}"
            textOnly
            truncate="140"
            .content="${t.data.content}"
            .contentLanguage="${this.group.language}"
            textType="aoiChoiceContent"
          ></yp-magic-text>
        </md-elevated-button>
        <md-filled-tonal-icon-button
          ?hidden="${!t.data.imageUrl}"
          @click="${()=>this.deleteImageUrl(t)}"
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

          ${this.sortedChoices?.map(((t,i)=>x`<div class="layout horizontal ideaContainer">
              <div>${this.renderAnswerData(t)}</div>
              <div class="origin">
                ${t.user_created?this.t("User"):this.t("Seed")}
              </div>
              <div class="wins">${t.wins}</div>
              <div class="losses">${t.losses}</div>
              <div class="score">${Math.round(t.score)}</div>
              <div class="buttons layout vertical center-center">
                <label>
                  <md-checkbox
                    class="activeCheckbox"
                    .checked="${t.active}"
                    @click="${this.toggleIdeaActivity(t)}"
                  ></md-checkbox>
                  <span class="activeCheckboxText">${this.t("active")}</span>
                </label>

                <md-linear-progress
                  class="toggleActiveProgress"
                  indeterminate
                  ?hidden="${this.isTogglingIdeaActive!==t.id}"
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
    `}render(){return this.choices?this.renderEditIdeas():this.renderCreateIdeas()}};__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"groupId",void 0),__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"communityId",void 0),__decorate$a([n$8({type:Object})],AoiEarlIdeasEditor.prototype,"configuration",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isCreatingIdeas",void 0),__decorate$a([n$8({type:Array})],AoiEarlIdeasEditor.prototype,"choices",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isGeneratingWithAi",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isSubmittingIdeas",void 0),__decorate$a([n$8({type:Number})],AoiEarlIdeasEditor.prototype,"isTogglingIdeaActive",void 0),__decorate$a([n$8({type:Boolean})],AoiEarlIdeasEditor.prototype,"isFetchingChoices",void 0),__decorate$a([n$8({type:Object})],AoiEarlIdeasEditor.prototype,"group",void 0),__decorate$a([e$7("#aiStyleInput")],AoiEarlIdeasEditor.prototype,"aiStyleInputElement",void 0),__decorate$a([n$8({type:String})],AoiEarlIdeasEditor.prototype,"currentIdeasFilter",void 0),__decorate$a([e$7("#answers")],AoiEarlIdeasEditor.prototype,"answersElement",void 0),AoiEarlIdeasEditor=__decorate$a([t$5("aoi-earl-ideas-editor")],AoiEarlIdeasEditor);var __decorate$9=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r},YpAdminConfigGroup_1;const defaultModerationPrompt="Only allow ideas that are relevant to the question.",defaultAiAnalysisJson={analyses:[{ideasLabel:"Three most popular ideas",ideasIdsRange:3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three most popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]},{ideasLabel:"Three least popular ideas",ideasIdsRange:-3,analysisTypes:[{label:"Main points for",contextPrompt:"You will analyze and report main points in favor of the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points in favor of those ideas. Output in the format of a very short idea name then three sub bullets with the points in favor of. Never use bold markup code."},{label:"Main points against",contextPrompt:"You will analyze and report main points against the three least popular ideas to a given question and output bullet points in markdown. Please do not write out a summary of each answer, Only output points against those ideas. Output in the format of a very short idea name then three sub bullets with the points against. Never use bold markup code."}]}]};let YpAdminConfigGroup=YpAdminConfigGroup_1=class extends YpAdminConfigBase{constructor(){super(),this.groupAccess="open_to_community",this.groupTypeIndex=1,this.endorsementButtonsDisabled=!1,this.questionNameHasChanged=!1,this.groupTypeOptions=["ideaGenerationGroupType","allOurIdeasGroupType"],this.groupAccessOptions={0:"public",1:"closed",2:"secret",3:"open_to_community"},this.action="/groups",this.group=this.collection}static get styles(){return[super.styles,i$5`
        .mainImage {
          width: 432px;
          height: 243px;
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
      `]}_setGroupType(t){const i=t.target.selectedIndex;this.groupTypeIndex=i,this.group.configuration.groupType=i,this._configChanged(),this.configTabs=this.setupConfigTabs(),this.requestUpdate(),this.fire("yp-request-update-on-parent")}renderGroupTypeSelection(){return x`
      <md-outlined-select
        .label="${this.t("selectGroupType")}"
        @change="${this._setGroupType}"
      >
        ${this.groupTypeOptions.map(((t,i)=>x`
            <md-select-option ?selected="${this.groupTypeIndex==i}"
              >${this.t(t)}</md-select-option
            >
          `))}
      </md-outlined-select>
    `}renderHeader(){return this.collection?x`
          <div class="layout horizontal wrap topInputContainer">
            ${this.renderLogoMedia()}
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
    `}_descriptionChanged(t){const i=t.target.value;this.group.description=i,this.group.objectives=i,super._descriptionChanged(t)}connectedCallback(){super.connectedCallback(),this.group=this.collection}_clear(){super._clear(),this.appHomeScreenIconImageId=void 0}updated(t){t.has("collection")&&this.collection&&(this.group=this.collection,this.currentLogoImages=this.collection.GroupLogoImages,this.collection.description=this.group.objectives,this.group.description=this.group.objectives,this.groupAccess=this.groupAccessOptions[this.group.access],this.collection.configuration.ltp?this.collection.configuration.ltp.crt.prompts||(this.collection.configuration.ltp.crt.prompts=defaultLtpPromptsConfiguration()):this.collection.configuration.ltp=defaultLtpConfiguration,this.collection.configuration.allOurIdeas&&this.collection.configuration.allOurIdeas.earl&&this.collection.configuration.allOurIdeas.earl.question&&(this.aoiQuestionName=this.collection.configuration.allOurIdeas.earl.question.name),this.groupTypeIndex=this.group.configuration.groupType||0,this.endorsementButtons=this.group.configuration.endorsementButtons,this.collection.status&&(this.status=this.collection.status),this._setupTranslations(),this.collection.CommunityLogoVideos&&this.collection.CommunityLogoVideos.length>0?this.uploadedVideoId=this.collection.CommunityLogoVideos[0].id:this.collection.GroupLogoVideos&&this.collection.GroupLogoVideos.length>0&&(this.uploadedVideoId=this.collection.GroupLogoVideos[0].id)),t.has("collectionId")&&this.collectionId&&this._collectionIdChanged(),super.updated(t)}_collectionIdChanged(){"new"==this.collectionId||"newFolder"==this.collectionId?(this.action=`/groups/${this.parentCollectionId}`,this.collection={id:-1,name:"",description:"",objectives:"",access:0,status:"active",counter_points:0,counter_posts:0,counter_users:0,configuration:{ltp:defaultLtpConfiguration},community_id:this.parentCollectionId,hostname:"",is_group_folder:"newFolder"==this.collectionId},this.group=this.collection):this.action=`/groups/${this.collectionId}`}_setupTranslations(){"new"==this.collectionId?(this.editHeaderText=this.t("domain.new"),this.toastText=this.t("domainToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("domain.edit"),this.toastText=this.t("domainToastUpdated"))}async _formResponse(t){super._formResponse(t);const i=t.detail;i?this.uploadedVideoId?(await window.adminServerApi.addVideoToCollection(i.id,{videoId:this.uploadedVideoId},"domain"),this._finishRedirect(i)):this._finishRedirect(i):console.warn("No domain found on custom redirect")}_finishRedirect(t){YpNavHelpers.redirectTo("/group/"+t.id),window.appGlobals.activity("completed","editGroup")}_getAccessTab(){const t={name:"access",icon:"code",items:[{text:"groupAccess",type:"html",templateData:x`
            <div id="access" name="access" class="layout vertical access">
              <div class="accessHeader">
                ${this.t("access")} ${this.groupAccess}
              </div>
              <label>
                <md-radio
                  value="open_to_community"
                  name="access"
                  @change="${this._groupAccessChanged}"
                  ?checked="${"open_to_community"==this.groupAccess}"
                ></md-radio
                >${this.t("group.openToCommunity")}</label
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
          `},{text:"status",type:"html",templateData:x`
            <md-outlined-select
              .label="${this.t("status.select")}"
              @change="${this._statusSelected}"
              .selectedIndex="${this.statusIndex}"
            >
              ${this.collectionStatusOptions?.map(((t,i)=>x`
                  <md-select-option ?selected="${this.statusIndex==i}"
                    >${t.translatedName}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `}]};return this.groupTypeIndex!==YpAdminConfigGroup_1.GroupType.allOurIdeas&&t.items.concat([{text:"allowAnonymousUsers",type:"checkbox",value:this.group.configuration.allowAnonymousUsers,translationToken:"allowAnonymousUsers"},{text:"anonymousAskRegistrationQuestions",type:"checkbox",value:this.group.configuration.anonymousAskRegistrationQuestions,translationToken:"anonymousAskRegistrationQuestions"},{text:"allowAnonymousAutoLogin",type:"checkbox",value:this.group.configuration.allowAnonymousAutoLogin,translationToken:"allowAnonymousAutoLogin",disabled:!this.group.configuration.allowAnonymousUsers},{text:"allowOneTimeLoginWithName",type:"checkbox",value:this.group.configuration.allowOneTimeLoginWithName,translationToken:"allowOneTimeLoginWithName"},{text:"disableFacebookLoginForGroup",type:"checkbox",value:this.group.configuration.disableFacebookLoginForGroup,translationToken:"disableFacebookLoginForGroup"},{text:"forceSecureSamlLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlLogin,translationToken:"forceSecureSamlLogin",disabled:!this.hasSamlLoginProvider},{text:"forceSecureSamlEmployeeLogin",type:"checkbox",value:this.group.configuration.forceSecureSamlEmployeeLogin,translationToken:"forceSecureSamlEmployeeLogin",disabled:!this.hasSamlLoginProvider},{text:"registrationQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.registrationQuestions,translationToken:"registrationQuestions"}]),t}_groupAccessChanged(t){this.groupAccess=t.target.value,this._configChanged()}_getThemeTab(){return{name:"themeSettings",icon:"palette",items:[{text:"inheritThemeFromCommunity",type:"checkbox",value:this.group.configuration.inheritThemeFromCommunity,translationToken:"inheritThemeFromCommunity",onChange:"_inheritThemeChanged"},{text:"themeSelector",type:"html",templateData:x`
            <yp-theme-selector
              @config-updated="${this._configChanged}"
              ?hasLogoImage="${this.imagePreviewUrl||YpMediaHelpers.getImageFormatUrl(this.currentLogoImages)}"
              .disableSelection="${this.group.configuration.inheritThemeFromCommunity}"
              @get-color-from-logo="${this.getColorFromLogo}"
              @yp-theme-configuration-changed="${this._themeChanged}"
              .themeConfiguration="${this.group.configuration.theme}"
            ></yp-theme-selector>
          `}]}}_inheritThemeChanged(t){this.group.configuration.inheritThemeFromCommunity=t.target.checked}_getPostSettingsTab(){return this.isGroupFolder?null:{name:"postSettings",icon:"create",items:[{text:"canAddNewPosts",type:"checkbox",value:this.group.configuration.canAddNewPosts,translationToken:"group.canAddNewPosts"},{text:"locationHidden",type:"checkbox",value:this.group.configuration.locationHidden,translationToken:"group.locationHidden"},{text:"allowGenerativeImages",type:"checkbox",value:this.group.configuration.allowGenerativeImages,translationToken:"allowGenerativeImages"},{text:"showWhoPostedPosts",type:"checkbox",value:this.group.configuration.showWhoPostedPosts,translationToken:"group.showWhoPostedPosts"},{text:"askUserIfNameShouldBeDisplayed",type:"checkbox",value:this.group.configuration.askUserIfNameShouldBeDisplayed,translationToken:"askUserIfNameShouldBeDisplayed"},{text:"disableDebate",type:"checkbox",value:this.group.configuration.disableDebate,translationToken:"disableDebate"},{text:"allowAdminsToDebate",type:"checkbox",value:this.group.configuration.allowAdminsToDebate,translationToken:"allowAdminsToDebate"},{text:"postDescriptionLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.postDescriptionLimit,translationToken:"postDescriptionLimit",charCounter:!0},{text:"allowPostVideoUploads",type:"checkbox",value:this.hasVideoUpload,translationToken:"allowPostVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPostUploadLimitSec,translationToken:"videoPostUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPostAudioUploads",type:"checkbox",value:this.hasAudioUpload,translationToken:"allowPostAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPostUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPostUploadLimitSec,translationToken:"audioPostUploadLimitSec",disabled:!this.hasAudioUpload},{text:"customTitleQuestionText",type:"textfield",maxLength:60,value:this.group.configuration.customTitleQuestionText,translationToken:"customTitleQuestionText"},{text:"hideNameInputAndReplaceWith",type:"textfield",maxLength:60,value:this.group.configuration.hideNameInputAndReplaceWith,translationToken:"hideNameInputAndReplaceWith"},{text:"customTabTitleNewLocation",type:"textfield",maxLength:60,value:this.group.configuration.customTabTitleNewLocation,translationToken:"customTabTitleNewLocation"},{text:"customCategoryQuestionText",type:"textfield",maxLength:30,value:this.group.configuration.customCategoryQuestionText,translationToken:"customCategoryQuestionText",charCounter:!0},{text:"customFilterText",type:"textfield",maxLength:17,value:this.group.configuration.customFilterText,translationToken:"customFilterText",charCounter:!0},{text:"makeCategoryRequiredOnNewPost",type:"checkbox",value:this.group.configuration.makeCategoryRequiredOnNewPost,translationToken:"makeCategoryRequiredOnNewPost"},{text:"showVideoUploadDisclaimer",type:"checkbox",value:this.group.configuration.showVideoUploadDisclaimer,translationToken:"showVideoUploadDisclaimer"},{text:"moreContactInformation",type:"checkbox",value:this.group.configuration.moreContactInformation,translationToken:"moreContactInformation"},{text:"moreContactInformationAddress",type:"checkbox",value:this.group.configuration.moreContactInformationAddress,translationToken:"moreContactInformationAddress"},{text:"attachmentsEnabled",type:"checkbox",value:this.group.configuration.attachmentsEnabled,translationToken:"attachmentsEnabled"},{text:"useContainImageMode",type:"checkbox",value:this.group.configuration.useContainImageMode,translationToken:"useContainImageMode"},{text:"hideNewestFromFilter",type:"checkbox",value:this.group.configuration.hideNewestFromFilter,translationToken:"hideNewestFromFilter"},{text:"hideNewPost",type:"checkbox",value:this.group.configuration.hideNewPost,translationToken:"hideNewPost"},{text:"hideRecommendationOnNewsFeed",type:"checkbox",value:this.group.configuration.hideRecommendationOnNewsFeed,translationToken:"hideRecommendationOnNewsFeed"},{text:"hideNewPostOnPostPage",type:"checkbox",value:this.group.configuration.hideNewPostOnPostPage,translationToken:"hideNewPostOnPostPage"},{text:"hidePostCover",type:"checkbox",value:this.group.configuration.hidePostCover,translationToken:"hidePostCover"},{text:"hidePostDescription",type:"checkbox",value:this.group.configuration.hidePostDescription,translationToken:"hidePostDescription"},{text:"hidePostActionsInGrid",type:"checkbox",value:this.group.configuration.hidePostActionsInGrid,translationToken:"hidePostActionsInGrid"},{text:"hideDebateIcon",type:"checkbox",value:this.group.configuration.hideDebateIcon,translationToken:"hideDebateIcon"},{text:"hideSharing",type:"checkbox",value:this.group.configuration.hideSharing,translationToken:"hideSharing"},{text:"hideEmoji",type:"checkbox",value:this.group.configuration.hideEmoji,translationToken:"hideEmoji"},{text:"hidePostFilterAndSearch",type:"checkbox",value:this.group.configuration.hidePostFilterAndSearch,translationToken:"hidePostFilterAndSearch"},{text:"hideMediaInput",type:"checkbox",value:this.group.configuration.hideMediaInput,translationToken:"hideMediaInput"},{text:"hidePostImageUploads",type:"checkbox",value:this.group.configuration.hidePostImageUploads,translationToken:"hidePostImageUploads",disabled:!this.hasVideoUpload},{text:"disablePostPageLink",type:"checkbox",value:this.group.configuration.disablePostPageLink,translationToken:"disablePostPageLink"},{text:"defaultLocationLongLat",type:"textfield",maxLength:100,value:this.group.configuration.defaultLocationLongLat,translationToken:"defaultLocationLongLat",style:"width: 300px;"},{text:"forcePostSortMethodAs",type:"textfield",maxLength:12,value:this.group.configuration.forcePostSortMethodAs,translationToken:"forcePostSortMethodAs"},{text:"descriptionTruncateAmount",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.descriptionTruncateAmount,translationToken:"descriptionTruncateAmount"},{text:"descriptionSimpleFormat",type:"checkbox",value:this.group.configuration.descriptionSimpleFormat,translationToken:"descriptionSimpleFormat"},{text:"transcriptSimpleFormat",type:"checkbox",value:this.group.configuration.transcriptSimpleFormat,translationToken:"transcriptSimpleFormat"},{text:"allPostsBlockedByDefault",type:"checkbox",value:this.group.configuration.allPostsBlockedByDefault,translationToken:"allPostsBlockedByDefault"},{text:"exportSubCodesForRadiosAndCheckboxes",type:"checkbox",value:this.group.configuration.exportSubCodesForRadiosAndCheckboxes,translationToken:"exportSubCodesForRadiosAndCheckboxes"},{text:"structuredQuestions",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.structuredQuestions,translationToken:"structuredQuestions",onChange:"_structuredQuestionsChanged"},{text:"structuredQuestionsJsonErrorInfo",type:"textdescription",translationToken:"structuredQuestionsJsonFormatNotValid",hidden:!this.structuredQuestionsJsonError},{text:"structuredQuestionsInfo",type:"textdescription",translationToken:"structuredQuestionsInfo"},{text:"uploadDocxSurveyFormat",type:"html",templateData:x`
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
          `}]}}_defaultDataImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.group.configuration.defaultDataImageId=i.id,this.configChanged=!0}_defaultPostImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.group.configuration.uploadedDefaultPostImageId=i.id,this.configChanged=!0}_haveUploadedDocxSurvey(t){const i=t.detail;if(i.xhr&&i.xhr.response){let t=JSON.parse(i.xhr.response);t.jsonContent=JSON.stringify(JSON.parse(t.jsonContent)),this.group.configuration.structuredQuestions=t.jsonContent}}_getVoteSettingsTab(){return{name:"voteSettings",icon:"thumbs_up_down",items:[{text:"endorsementButtons",type:"html",templateData:x`
            <md-outlined-select
              .label="${this.t("endorsementButtons")}"
              .disabled="${this.endorsementButtonsDisabled}"
              @change="${this._endorsementButtonsSelected}"
            >
              ${this.endorsementButtonsOptions?.map(((t,i)=>x`
                  <md-select-option
                    ?selected="${this.endorsementButtonsIndex==i}"
                    >${t.translatedName}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"canVote",type:"checkbox",value:this.group.configuration.canVote,translationToken:"group.canVote"},{text:"hideVoteCount",type:"checkbox",value:this.group.configuration.hideVoteCount,translationToken:"hideVoteCount"},{text:"hideVoteCountUntilVoteCompleted",type:"checkbox",value:this.group.configuration.hideVoteCountUntilVoteCompleted,translationToken:"hideVoteCountUntilVoteCompleted"},{text:"hideDownVoteForPost",type:"checkbox",value:this.group.configuration.hideDownVoteForPost,translationToken:"hideDownVoteForPost"},{text:"maxNumberOfGroupVotes",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.maxNumberOfGroupVotes,translationToken:"maxNumberOfGroupVotes"},{text:"customVoteUpHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteUpHoverText,translationToken:"customVoteUpHoverText"},{text:"customVoteDownHoverText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customVoteDownHoverText,translationToken:"customVoteDownHoverText"},{text:"customRatingsText",type:"textarea",rows:2,maxRows:2,value:this.group.configuration.customRatingsText,translationToken:"customRatings"},{text:"customRatingsInfo",type:"textdescription"}]}}get endorsementButtonsOptions(){return this.t?[{name:"hearts",translatedName:this.t("endorsementButtonsHeart")},{name:"arrows",translatedName:this.t("endorsementArrows")},{name:"thumbs",translatedName:this.t("endorsementThumbs")},{name:"hats",translatedName:this.t("endorsementHats")}]:[]}_endorsementButtonsSelected(t){const i=t.target.selectedIndex;this.endorsementButtons=this.endorsementButtonsOptions[i].name,this._configChanged()}get endorsementButtonsIndex(){if(this.endorsementButtonsOptions){for(let t=0;t<this.endorsementButtonsOptions.length;t++)if(this.endorsementButtonsOptions[t].name==this.endorsementButtons)return t;return-1}return-1}_customRatingsTextChanged(t){}_getPointSettingsTab(){return{name:"pointSettings",icon:"stars",items:[{text:"newPointOptional",type:"checkbox",value:this.group.configuration.newPointOptional,translationToken:"newPointOptional"},{text:"hideNewPointOnNewIdea",type:"checkbox",value:this.group.configuration.hideNewPointOnNewIdea,translationToken:"hideNewPointOnNewIdea"},{text:"hidePointAuthor",type:"checkbox",value:this.group.configuration.hidePointAuthor,translationToken:"hidePointAuthor"},{text:"hidePointAgainst",type:"checkbox",value:this.group.configuration.hidePointAgainst,translationToken:"hidePointAgainst"},{text:"pointCharLimit",type:"textfield",maxLength:4,pattern:"[0-9]",value:this.group.configuration.pointCharLimit,translationToken:"pointCharLimit"},{text:"alternativePointForHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForHeader,translationToken:"alternativePointForHeader"},{text:"alternativePointAgainstHeader",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstHeader,translationToken:"alternativePointAgainstHeader"},{text:"alternativePointForLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointForLabel,translationToken:"alternativePointForLabel"},{text:"alternativePointAgainstLabel",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.alternativePointAgainstLabel,translationToken:"alternativePointAgainstLabel"},{text:"allowPointVideoUploads",type:"checkbox",value:this.group.configuration.allowPostVideoUploads,translationToken:"allowPointVideoUploads",disabled:!this.hasVideoUpload},{text:"videoPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.videoPointUploadLimitSec,translationToken:"videoPointUploadLimitSec",disabled:!this.hasVideoUpload},{text:"allowPointAudioUploads",type:"checkbox",value:this.group.configuration.allowPointAudioUploads,translationToken:"allowPointAudioUploads",disabled:!this.hasAudioUpload},{text:"audioPointUploadLimitSec",type:"textfield",maxLength:3,pattern:"[0-9]",value:this.group.configuration.audioPointUploadLimitSec,translationToken:"audioPointUploadLimitSec",disabled:!this.hasAudioUpload},{text:"disableMachineTranscripts",type:"checkbox",value:this.group.configuration.disableMachineTranscripts,translationToken:"disableMachineTranscripts"},{text:"allowAdminAnswersToPoints",type:"checkbox",value:this.group.configuration.allowAdminAnswersToPoints,translationToken:"allowAdminAnswersToPoints"},{text:"customAdminCommentsTitle",type:"textfield",maxLength:50,charCounter:!0,value:this.group.configuration.customAdminCommentsTitle,translationToken:"customAdminCommentsTitle"}]}}_getAdditionalConfigTab(){return{name:"additionalGroupConfig",icon:"settings",items:[{text:"defaultLocale",type:"html",templateData:x`
            <yp-language-selector
              name="defaultLocale"
              noUserEvents
              @changed="${this._configChanged}"
              .selectedLocale="${this.group.configuration.defaultLocale}"
            >
            </yp-language-selector>
          `},{text:"hideStatsAndMembership",type:"checkbox",value:this.group.configuration.hideStatsAndMembership,translationToken:"hideStatsAndMembership"},{text:"customBackURL",type:"textfield",maxLength:256,value:this.group.configuration.customBackURL,translationToken:"customBackURL"},{text:"customBackName",type:"textfield",maxLength:20,value:this.group.configuration.customBackName,translationToken:"customBackName"},{text:"optionalSortOrder",type:"textfield",maxLength:4,value:this.group.configuration.optionalSortOrder,translationToken:"optionalSortOrder"},{text:"disableNameAutoTranslation",type:"checkbox",value:this.group.configuration.disableNameAutoTranslation,translationToken:"disableNameAutoTranslation"},{text:"hideAllTabs",type:"checkbox",value:this.group.configuration.hideAllTabs,translationToken:"hideAllTabs"},{text:"hideGroupLevelTabs",type:"checkbox",value:this.group.configuration.hideGroupLevelTabs,translationToken:"hideGroupLevelTabs"},{text:"hideHelpIcon",type:"checkbox",value:this.group.configuration.hideHelpIcon,translationToken:"hideHelpIcon"},{text:"useCommunityTopBanner",type:"checkbox",value:this.group.configuration.useCommunityTopBanner,translationToken:"useCommunityTopBanner"},{text:"makeMapViewDefault",type:"checkbox",value:this.group.configuration.makeMapViewDefault,translationToken:"makeMapViewDefault"},{text:"simpleFormatDescription",type:"checkbox",value:this.group.configuration.simpleFormatDescription,translationToken:"simpleFormatDescription"},{text:"resourceLibraryLinkMode",type:"checkbox",value:this.group.configuration.resourceLibraryLinkMode,translationToken:"resourceLibraryLinkMode"},{text:"collapsableTranscripts",type:"checkbox",value:this.group.configuration.collapsableTranscripts,translationToken:"collapsableTranscripts"},{text:"allowWhatsAppSharing",type:"checkbox",value:this.group.configuration.allowWhatsAppSharing,translationToken:"allowWhatsAppSharing"},{text:"actAsLinkToCommunityId",type:"textfield",maxLength:8,pattern:"[0-9]",value:this.group.configuration.actAsLinkToCommunityId,translationToken:"actAsLinkToCommunityId"},{text:"maxDaysBackForRecommendations",type:"textfield",maxLength:5,pattern:"[0-9]",value:this.group.configuration.maxDaysBackForRecommendations,translationToken:"maxDaysBackForRecommendations"},{text:"customUserNamePrompt",type:"textfield",maxLength:45,charCounter:!0,value:this.group.configuration.customUserNamePrompt,translationToken:"customUserNamePrompt"},{text:"customTermsIntroText",type:"textfield",maxLength:100,charCounter:!0,value:this.group.configuration.customTermsIntroText,translationToken:"customTermsIntroText"},{text:"externalGoalTriggerUrl",type:"textfield",value:this.group.configuration.externalGoalTriggerUrl,translationToken:"externalGoalTriggerUrl"},{text:"externalId",type:"textfield",value:this.group.configuration.externalId,translationToken:"externalId"},{text:"usePostListFormatOnDesktop",type:"checkbox",value:this.group.configuration.usePostListFormatOnDesktop,translationToken:"usePostListFormatOnDesktop"},{text:"usePostTags",type:"checkbox",value:this.group.configuration.usePostTags,translationToken:"usePostTags"},{text:"usePostTagsForPostListItems",type:"checkbox",value:this.group.configuration.usePostTagsForPostListItems,translationToken:"usePostTagsForPostListItems"},{text:"usePostTagsForPostCards",type:"checkbox",value:this.group.configuration.usePostTagsForPostCards,translationToken:"usePostTagsForPostCards"},{text:"forceShowDebateCountOnPost",type:"checkbox",value:this.group.configuration.forceShowDebateCountOnPost,translationToken:"forceShowDebateCountOnPost"},{text:"closeNewsfeedSubmissions",type:"checkbox",value:this.group.configuration.closeNewsfeedSubmissions,translationToken:"closeNewsfeedSubmissions"},{text:"hideNewsfeeds",type:"checkbox",value:this.group.configuration.hideNewsfeeds,translationToken:"hideNewsfeeds"},{text:"welcomeSelectPage",type:"html",hidden:!this.pages,templateData:x`
            <md-outlined-select
              .label="${this.t("welcomeSelectPage")}"
              @selected="${this._welcomePageSelected}"
            >
              ${this.translatedPages?.map(((t,i)=>x`
                  <md-select-option ?selected="${this.welcomePageId==t.id}"
                    >${this._getLocalizePageTitle(t)}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"urlToReview",type:"textfield",value:this.group.configuration.urlToReview,translationToken:"urlToReview"},{text:"urlToReviewActionText",type:"textfield",maxLength:30,charCounter:!0,value:this.group.configuration.urlToReviewActionText,translationToken:"urlToReviewActionText"},{text:"isDataVisualizationGroup",type:"checkbox",value:this.group.configuration.isDataVisualizationGroup,translationToken:"isDataVisualizationGroup",onTap:"_isDataVisualizationGroupClick"},{text:"dataForVisualization",type:"textarea",rows:4,maxRows:8,value:this.group.configuration.dataForVisualization,translationToken:"dataForVisualization",hidden:!this.isDataVisualizationGroup,onChange:"_dataForVisualizationChanged"},{text:"dataForVisualizationJsonError",type:"textdescription",hidden:!this.dataForVisualizationJsonError,translationToken:"structuredQuestionsJsonFormatNotValid"},{text:"moveGroupTo",type:"html",templateData:x`
            <md-outlined-select
              name="moveGroupTo"
              .label="${this.t("moveGroupTo")}"
              @selected="${this._moveGroupToSelected}"
            >
              ${this.groupMoveToOptions?.map((t=>x`
                  <md-select-option
                    ?selected="${this.moveGroupToId==t.id}"
                    >${t.name}</md-select-option
                  >
                `))}
            </md-outlined-select>
          `},{text:"categories.the_all",type:"html",templateData:x`
            <div class="subHeaders">${this.t("categories.the_all")}</div>
            <md-outlined-select
              .label="${this.t("selectCategory")}"
              @selected="${this._categorySelected}"
            >
              ${this.group.Categories?.map((t=>x`
                  <md-select-option value="${t.id}">
                    <md-icon
                      slot="icon"
                      src="${this._categoryImageSrc(t)}"
                    ></md-icon>
                    ${t.name}
                  </md-select-option>
                `))}
            </md-outlined-select>
          `}]}}earlConfigChanged(t){this.group.configuration.allOurIdeas=this.$$("aoi-earl-ideas-editor").configuration,this.requestUpdate()}themeConfigChanged(t){this.group.configuration.theme={...this.group.configuration.theme,...t.detail},this.requestUpdate()}renderCreateEarl(t){return x`<aoi-earl-ideas-editor
      .communityId="${t}"
      @configuration-changed="${this.earlConfigChanged}"
      @theme-config-changed="${this.themeConfigChanged}"
      .group="${this.group}"
      .configuration="${this.group.configuration.allOurIdeas}"
    ></aoi-earl-ideas-editor>`}questionNameChanged(t){const i=t.currentTarget.value,e=this.group.configuration.allOurIdeas;e.earl||(e.earl={active:!0,configuration:{accept_new_ideas:!0,hide_results:!1,hide_analysis:!1,hide_skip:!1,enableAiModeration:!0,allowNewIdeasForVoting:!0,hide_explain:!1,minimum_ten_votes_to_show_results:!0,target_votes:30,analysis_config:defaultAiAnalysisJson,moderationPrompt:defaultModerationPrompt,welcome_html:"",welcome_message:"",external_goal_params_whitelist:"",external_goal_trigger_url:""}},this.configTabs=this.setupConfigTabs(),this.requestUpdate()),e.earl.question||(e.earl.question={}),e.earl.question.name=i,this.aoiQuestionName=i,console.error("questionNameChanged",i),this.set(this.group.configuration.allOurIdeas.earl,"question.name",i),this.questionNameHasChanged=!0,this.configTabs=this.setupConfigTabs(),this._configChanged(),this.requestUpdate()}afterSave(){if(super.afterSave(),this.questionNameHasChanged){let t;t="new"===this.collectionId?this.parentCollectionId:this.group.community_id;(new AoiAdminServerApi).updateName(t,this.group.configuration.allOurIdeas.earl.question.id,this.group.configuration.allOurIdeas.earl.question.name)}}_getAllOurIdeaTab(){let t,i=this.group.configuration.allOurIdeas;return i||(i=this.group.configuration.allOurIdeas={}),t="new"===this.collectionId?this.parentCollectionId:this.group.community_id,{name:"allOurIdeas",icon:"lightbulb",items:[{text:"questionName",type:"textarea",maxLength:140,rows:2,charCounter:!0,value:this.aoiQuestionName,translationToken:"questionName",onChange:this.questionNameChanged},{text:"earlConfig",type:"html",templateData:this.renderCreateEarl(t)}]}}set(t,i,e){const o=i.split(".");let s=t;o.forEach(((t,i)=>{i===o.length-1?s[t]=e:(s[t]||(s[t]={}),s=s[t])}))}_updateEarl(t,i,e=!1){let o=t.detail.value;if(e)try{o=JSON.parse(o)}catch(t){console.error("Error parsing JSON",t)}this.set(this.group.configuration.allOurIdeas.earl,i,o),this._configChanged(),this.requestUpdate()}_getAllOurIdeaOptionsTab(){let t=this.group.configuration.allOurIdeas?.earl;return t&&(t.configuration.analysis_config||(t.configuration.analysis_config=defaultAiAnalysisJson)),{name:"allOurIdeasOptions",icon:"settings",items:[{text:"active",type:"checkbox",onChange:t=>this._updateEarl(t,"active"),value:t?.active,translationToken:"active"},{text:"accept_new_ideas",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.accept_new_ideas"),value:void 0===t?.configuration?.accept_new_ideas||t?.configuration?.accept_new_ideas,translationToken:"acceptNewIdeas"},{text:"allowNewIdeasForVoting",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.allowNewIdeasForVoting"),value:t?.configuration?.allowNewIdeasForVoting,translationToken:"allowNewIdeasForVoting"},{text:"enableAiModeration",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.enableAiModeration"),value:t?.configuration?.enableAiModeration,translationToken:"enableAiModeration"},{text:"minimum_ten_votes_to_show_results",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.minimum_ten_votes_to_show_results"),value:t?.configuration?.minimum_ten_votes_to_show_results,translationToken:"minimumTenVotesToShowResults"},{text:"hide_results",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.hide_results"),value:t?.configuration?.hide_results,translationToken:"hideAoiResults"},{text:"hide_analysis",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.hide_analysis"),value:t?.configuration?.hide_analysis,translationToken:"hideAoiAnalysis"},{text:"hide_skip",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.hide_skip"),value:t?.configuration?.hide_skip,translationToken:"hideSkipButton"},{text:"hide_explain",type:"checkbox",onChange:t=>this._updateEarl(t,"configuration.hide_explain"),value:t?.configuration?.hide_explain,translationToken:"hideAoiExplainButton"},{text:"welcome_message",type:"textarea",rows:5,maxLength:300,value:t?.configuration?.welcome_message,onChange:t=>this._updateEarl(t,"configuration.welcome_message"),translationToken:"welcomeMessage"},{text:"welcome_html",type:"textarea",rows:5,value:t?.configuration?.welcome_html,onChange:t=>this._updateEarl(t,"configuration.welcome_html"),translationToken:"welcomeHtml"},{text:"moderationPrompt",type:"textarea",rows:5,value:t?.configuration?.moderationPrompt?t?.configuration?.moderationPrompt:defaultModerationPrompt,onChange:t=>this._updateEarl(t,"configuration.moderationPrompt",!0),translationToken:"aoiModerationPrompt"},{text:"analysis_config",type:"textarea",rows:7,value:t?.configuration?.analysis_config?JSON.stringify(t?.configuration?.analysis_config,null,2):JSON.stringify(defaultAiAnalysisJson,null,2),onChange:t=>this._updateEarl(t,"configuration.analysis_config",!0),translationToken:"aoiAiAnalysisConfig"},{text:"targetVotes",type:"textfield",maxLength:3,pattern:"[0-9]",value:t?.configuration?.target_votes,translationToken:"targetVotes",onChange:t=>this._updateEarl(t,"configuration.target_votes",!0),charCounter:!0},{text:"externalGoalParamsWhitelist",type:"textfield",pattern:"[0-9]",value:t?.configuration?.external_goal_params_whitelist,onChange:t=>this._updateEarl(t,"configuration.external_goal_params_whitelist",!0),translationToken:"externalGoalParamsWhitelist"},{text:"externalGoalTriggerUrl",type:"textfield",value:t?.configuration?.external_goal_trigger_url,onChange:t=>this._updateEarl(t,"configuration.external_goal_trigger_url",!0),translationToken:"externalGoalTriggerUrl"}]}}_categorySelected(t){t.detail.value}_categoryImageSrc(t){return`path/to/category/icons/${t.id}.png`}_welcomePageSelected(t){const i=t.detail.index;this.welcomePageId=this.translatedPages[i].id}_isDataVisualizationGroupClick(t){}_dataForVisualizationChanged(t){}_moveGroupToSelected(t){const i=t.detail.index;this.moveGroupToId=this.groupMoveToOptions[i].id}setupConfigTabs(){const t=[];if(this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.ideaGeneration){const i=this._getPostSettingsTab();this.isGroupFolder||t.push(i),t.push(this._getVoteSettingsTab()),t.push(this._getPointSettingsTab()),t.push(this._getAdditionalConfigTab())}else this.groupTypeIndex==YpAdminConfigGroup_1.GroupType.allOurIdeas&&(t.push(this._getAllOurIdeaTab()),t.push(this._getAllOurIdeaOptionsTab()));return t.push(this._getAccessTab()),t.push(this._getThemeTab()),this.tabsPostSetup(t),t}_appHomeScreenIconImageUploaded(t){var i=JSON.parse(t.detail.xhr.response);this.appHomeScreenIconImageId=i.id,this._configChanged()}};YpAdminConfigGroup.GroupType={ideaGeneration:0,allOurIdeas:1},__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"appHomeScreenIconImageId",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"hostnameExample",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"signupTermsPageId",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"welcomePageId",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"aoiQuestionName",void 0),__decorate$9([n$8({type:String})],YpAdminConfigGroup.prototype,"groupAccess",void 0),__decorate$9([n$8({type:Number})],YpAdminConfigGroup.prototype,"groupTypeIndex",void 0),__decorate$9([n$8({type:Object})],YpAdminConfigGroup.prototype,"group",void 0),YpAdminConfigGroup=YpAdminConfigGroup_1=__decorate$9([t$5("yp-admin-config-group")],YpAdminConfigGroup);var __decorate$8=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminGroups=class extends YpBaseElementWithLogin{newGroup(){YpNavHelpers.redirectTo(`/group/new/${this.community.id}`)}static get styles(){return[super.styles,i$5`
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
      `]}gotoGroup(t){YpNavHelpers.redirectTo(`/group/${t.id}`)}renderGroup(t){const i=YpMediaHelpers.getImageFormatUrl(t.GroupLogoImages);return x`
      <div
        class="layout horizontal groupItem"
        @click="${()=>this.gotoGroup(t)}"
      >
        <yp-image
          class="mainImage"
          sizing="contain"
          .src="${i}"
        ></yp-image>
        <div class="layout vertical">
          <div class="groupText">${t.name}</div>
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
          ${this.community.Groups.map((t=>this.renderGroup(t)))}
        </div>
      </div>
    `}};__decorate$8([n$8({type:Object})],YpAdminGroups.prototype,"community",void 0),YpAdminGroups=__decorate$8([t$5("yp-admin-groups")],YpAdminGroups);
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Lumo extends HTMLElement{static get version(){return"23.3.30"}}customElements.define("vaadin-lumo-styles",Lumo);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=window,e$5=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$7=Symbol(),n$7=new WeakMap;let o$7=class{constructor(t,i,e){if(this._$cssResult$=!0,e!==s$7)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(e$5&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n$7.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$7.set(i,t))}return t}toString(){return this.cssText}};const r$5=t=>new o$7("string"==typeof t?t:t+"",void 0,s$7),i$3=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,e,o)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[o+1]),t[0]);return new o$7(e,t,s$7)},S$3=(t,i)=>{e$5?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((i=>{const e=document.createElement("style"),o=t$3.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}))},c$3=e$5?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return r$5(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var s$6;const e$4=window,r$4=e$4.trustedTypes,h$3=r$4?r$4.emptyScript:"",o$6=e$4.reactiveElementPolyfillSupport,n$6={toAttribute(t,i){switch(i){case Boolean:t=t?h$3:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},a$3=(t,i)=>i!==t&&(i==i||t==t),l$5={attribute:!0,type:String,converter:n$6,reflect:!1,hasChanged:a$3},d$3="finalized";let u$3=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,e)=>{const o=this._$Ep(e,i);void 0!==o&&(this._$Ev.set(o,e),t.push(o))})),t}static createProperty(t,i=l$5){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const e="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,e,i);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(o){const s=this[t];this[i]=o,this.requestUpdate(t,s,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$5}static finalize(){if(this.hasOwnProperty(d$3))return!1;this[d$3]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const e of i)this.createProperty(e,t[e])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(c$3(t))}else void 0!==t&&i.push(c$3(t));return i}static _$Ep(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,e;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(e=t.hostConnected)||void 0===e||e.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$3(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$EO(t,i,e=l$5){var o;const s=this.constructor._$Ep(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==(null===(o=e.converter)||void 0===o?void 0:o.toAttribute)?e.converter:n$6).toAttribute(i,e.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,i){var e;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(e=t.converter)||void 0===e?void 0:e.fromAttribute)?t.converter:n$6;this._$El=s,this[s]=n.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,e){let o=!0;void 0!==t&&(((e=e||this.constructor.getPropertyOptions(t)).hasChanged||a$3)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===e.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,e))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(e)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(e)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$2;u$3[d$3]=!0,u$3.elementProperties=new Map,u$3.elementStyles=[],u$3.shadowRootOptions={mode:"open"},null==o$6||o$6({ReactiveElement:u$3}),(null!==(s$6=e$4.reactiveElementVersions)&&void 0!==s$6?s$6:e$4.reactiveElementVersions=[]).push("1.6.3");const i$2=window,s$5=i$2.trustedTypes,e$3=s$5?s$5.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$5="$lit$",n$5=`lit$${(Math.random()+"").slice(9)}$`,l$4="?"+n$5,h$2=`<${l$4}>`,r$3=document,u$2=()=>r$3.createComment(""),d$2=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c$2=Array.isArray,v$1=t=>c$2(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a$2="[ \t\n\f\r]",f$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_$1=/-->/g,m$1=/>/g,p$1=RegExp(`>|${a$2}(?:([^\\s"'>=/]+)(${a$2}*=${a$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g$1=/'/g,$$1=/"/g,y$1=/^(?:script|style|textarea|title)$/i,T$1=Symbol.for("lit-noChange"),A$1=Symbol.for("lit-nothing"),E$1=new WeakMap,C$1=r$3.createTreeWalker(r$3,129,null,!1);function P$1(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$3?e$3.createHTML(i):i}const V$1=(t,i)=>{const e=t.length-1,o=[];let s,n=2===i?"<svg>":"",r=f$1;for(let i=0;i<e;i++){const e=t[i];let a,I,g=-1,l=0;for(;l<e.length&&(r.lastIndex=l,I=r.exec(e),null!==I);)l=r.lastIndex,r===f$1?"!--"===I[1]?r=_$1:void 0!==I[1]?r=m$1:void 0!==I[2]?(y$1.test(I[2])&&(s=RegExp("</"+I[2],"g")),r=p$1):void 0!==I[3]&&(r=p$1):r===p$1?">"===I[0]?(r=null!=s?s:f$1,g=-1):void 0===I[1]?g=-2:(g=r.lastIndex-I[2].length,a=I[1],r=void 0===I[3]?p$1:'"'===I[3]?$$1:g$1):r===$$1||r===g$1?r=p$1:r===_$1||r===m$1?r=f$1:(r=p$1,s=void 0);const c=r===p$1&&t[i+1].startsWith("/>")?" ":"";n+=r===f$1?e+h$2:g>=0?(o.push(a),e.slice(0,g)+o$5+e.slice(g)+n$5+c):e+n$5+(-2===g?(o.push(void 0),i):c)}return[P$1(t,n+(t[e]||"<?>")+(2===i?"</svg>":"")),o]};let N$1=class t{constructor({strings:i,_$litType$:e},o){let s;this.parts=[];let n=0,r=0;const a=i.length-1,I=this.parts,[g,l]=V$1(i,e);if(this.el=t.createElement(g,o),C$1.currentNode=this.el.content,2===e){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(s=C$1.nextNode())&&I.length<a;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const i of s.getAttributeNames())if(i.endsWith(o$5)||i.startsWith(n$5)){const e=l[r++];if(t.push(i),void 0!==e){const t=s.getAttribute(e.toLowerCase()+o$5).split(n$5),i=/([.?@])?(.*)/.exec(e);I.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?H$1:"?"===i[1]?L$1:"@"===i[1]?z$1:k$1})}else I.push({type:6,index:n})}for(const i of t)s.removeAttribute(i)}if(y$1.test(s.tagName)){const t=s.textContent.split(n$5),i=t.length-1;if(i>0){s.textContent=s$5?s$5.emptyScript:"";for(let e=0;e<i;e++)s.append(t[e],u$2()),C$1.nextNode(),I.push({type:2,index:++n});s.append(t[i],u$2())}}}else if(8===s.nodeType)if(s.data===l$4)I.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(n$5,t+1));)I.push({type:7,index:n}),t+=n$5.length-1}n++}}static createElement(t,i){const e=r$3.createElement("template");return e.innerHTML=t,e}};function S$2(t,i,e=t,o){var s,n,r,a;if(i===T$1)return i;let I=void 0!==o?null===(s=e._$Co)||void 0===s?void 0:s[o]:e._$Cl;const g=d$2(i)?void 0:i._$litDirective$;return(null==I?void 0:I.constructor)!==g&&(null===(n=null==I?void 0:I._$AO)||void 0===n||n.call(I,!1),void 0===g?I=void 0:(I=new g(t),I._$AT(t,e,o)),void 0!==o?(null!==(r=(a=e)._$Co)&&void 0!==r?r:a._$Co=[])[o]=I:e._$Cl=I),void 0!==I&&(i=S$2(t,I._$AS(t,i.values),I,o)),i}let M$1=class{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:e},parts:o}=this._$AD,s=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r$3).importNode(e,!0);C$1.currentNode=s;let n=C$1.nextNode(),r=0,a=0,I=o[0];for(;void 0!==I;){if(r===I.index){let i;2===I.type?i=new R$1(n,n.nextSibling,this,t):1===I.type?i=new I.ctor(n,I.name,I.strings,this,t):6===I.type&&(i=new Z$1(n,this,t)),this._$AV.push(i),I=o[++a]}r!==(null==I?void 0:I.index)&&(n=C$1.nextNode(),r++)}return C$1.currentNode=r$3,s}v(t){let i=0;for(const e of this._$AV)void 0!==e&&(void 0!==e.strings?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}},R$1=class t{constructor(t,i,e,o){var s;this.type=2,this._$AH=A$1,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=o,this._$Cp=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S$2(this,t,i),d$2(t)?t===A$1||null==t||""===t?(this._$AH!==A$1&&this._$AR(),this._$AH=A$1):t!==this._$AH&&t!==T$1&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v$1(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==A$1&&d$2(this._$AH)?this._$AA.nextSibling.data=t:this.$(r$3.createTextNode(t)),this._$AH=t}g(t){var i;const{values:e,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=N$1.createElement(P$1(o.h,o.h[0]),this.options)),o);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===s)this._$AH.v(e);else{const t=new M$1(s,this),i=t.u(this.options);t.v(e),this.$(i),this._$AH=t}}_$AC(t){let i=E$1.get(t.strings);return void 0===i&&E$1.set(t.strings,i=new N$1(t)),i}T(i){c$2(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,s=0;for(const n of i)s===e.length?e.push(o=new t(this.k(u$2()),this.k(u$2()),this,this.options)):o=e[s],o._$AI(n),s++;s<e.length&&(this._$AR(o&&o._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,i){var e;for(null===(e=this._$AP)||void 0===e||e.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}},k$1=class{constructor(t,i,e,o,s){this.type=1,this._$AH=A$1,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,e.length>2||""!==e[0]||""!==e[1]?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=A$1}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,e,o){const s=this.strings;let n=!1;if(void 0===s)t=S$2(this,t,i,0),n=!d$2(t)||t!==this._$AH&&t!==T$1,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=S$2(this,o[e+r],i,r),a===T$1&&(a=this._$AH[r]),n||(n=!d$2(a)||a!==this._$AH[r]),a===A$1?t=A$1:t!==A$1&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===A$1?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}},H$1=class extends k$1{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A$1?void 0:t}};const I$1=s$5?s$5.emptyScript:"";let L$1=class extends k$1{constructor(){super(...arguments),this.type=4}j(t){t&&t!==A$1?this.element.setAttribute(this.name,I$1):this.element.removeAttribute(this.name)}},z$1=class extends k$1{constructor(t,i,e,o,s){super(t,i,e,o,s),this.type=5}_$AI(t,i=this){var e;if((t=null!==(e=S$2(this,t,i,0))&&void 0!==e?e:A$1)===T$1)return;const o=this._$AH,s=t===A$1&&o!==A$1||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==A$1&&(o===A$1||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,e;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}},Z$1=class{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){S$2(this,t)}};const B$1=i$2.litHtmlPolyfillSupport;null==B$1||B$1(N$1,R$1),(null!==(t$2=i$2.litHtmlVersions)&&void 0!==t$2?t$2:i$2.litHtmlVersions=[]).push("2.8.0");const D$1=(t,i,e)=>{var o,s;const n=null!==(o=null==e?void 0:e.renderBefore)&&void 0!==o?o:i;let r=n._$litPart$;if(void 0===r){const t=null!==(s=null==e?void 0:e.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new R$1(i.insertBefore(u$2(),t),t,void 0,null!=e?e:{})}return r._$AI(t),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};var l$3,o$4;let s$4=class extends u$3{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const e=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=e.firstChild),e}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D$1(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return T$1}};s$4.finalized=!0,s$4._$litElement$=!0,null===(l$3=globalThis.litElementHydrateSupport)||void 0===l$3||l$3.call(globalThis,{LitElement:s$4});const n$4=globalThis.litElementPolyfillSupport;null==n$4||n$4({LitElement:s$4}),(null!==(o$4=globalThis.litElementVersions)&&void 0!==o$4?o$4:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const ThemePropertyMixin=t=>class extends t{static get properties(){return{theme:{type:String,reflectToAttribute:!0,observer:"__deprecatedThemePropertyChanged"},_theme:{type:String,readOnly:!0}}}J(t){this._set_theme(t)}}
/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,themeRegistry=[];function registerStyles(t,i,e={}){t&&hasThemes(t)&&console.warn(`The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`),i=flattenStyles(i),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(t,i,e):themeRegistry.push({themeFor:t,styles:i,include:e.include,moduleId:e.moduleId})}function getAllThemes(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():themeRegistry}function matchesThemeFor(t,i){return(t||"").split(" ").some((t=>new RegExp(`^${t.split("*").join(".*")}$`).test(i)))}function getIncludePriority(t=""){let i=0;return t.startsWith("lumo-")||t.startsWith("material-")?i=1:t.startsWith("vaadin-")&&(i=2),i}function flattenStyles(t=[]){return[t].flat(1/0).filter((t=>t instanceof o$7||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}function getIncludedStyles(t){const i=[];return t.include&&[].concat(t.include).forEach((t=>{const e=getAllThemes().find((i=>i.moduleId===t));e?i.push(...getIncludedStyles(e),...e.styles):console.warn(`Included moduleId ${t} not found in style registry`)}),t.styles),i}function addStylesToTemplate(t,i){const e=document.createElement("style");e.innerHTML=t.map((t=>t.cssText)).join("\n"),i.content.appendChild(e)}function getThemes(t){const i=`${t}-default-theme`,e=getAllThemes().filter((e=>e.moduleId!==i&&matchesThemeFor(e.themeFor,t))).map((t=>({...t,styles:[...getIncludedStyles(t),...t.styles],includePriority:getIncludePriority(t.moduleId)}))).sort(((t,i)=>i.includePriority-t.includePriority));return e.length>0?e:getAllThemes().filter((t=>t.moduleId===i))}function hasThemes(t){return classHasThemes(customElements.get(t))}function classHasThemes(t){return t&&Object.prototype.hasOwnProperty.call(t,"__themes")}const ThemableMixin=t=>class extends(ThemePropertyMixin(t)){static finalize(){if(super.finalize(),this.elementStyles)return;const t=this.prototype._template;t&&!classHasThemes(this)&&addStylesToTemplate(this.getStylesForThis(),t)}static finalizeStyles(t){const i=this.getStylesForThis();return t?[...super.finalizeStyles(t),...i]:i}static getStylesForThis(){const t=Object.getPrototypeOf(this.prototype),i=(t?t.constructor.U:[])||[];this.U=[...i,...getThemes(this.is)];const e=this.U.flatMap((t=>t.styles));return e.filter(((t,i)=>i===e.lastIndexOf(t)))}}
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
let modules={},lcModules={};function setModule(t,i){modules[t]=lcModules[t.toLowerCase()]=i}function findModule(t){return modules[t]||lcModules[t.toLowerCase()]}function styleOutsideTemplateCheck(t){t.querySelector("style")&&console.warn("dom-module %s has style outside template",t.id)}class DomModule extends HTMLElement{static get observedAttributes(){return["id"]}static import(t,i){if(t){let e=findModule(t);return e&&i?e.querySelector(i):e}return null}attributeChangedCallback(t,i,e,o){i!==e&&this.register()}get assetpath(){if(!this.P){const t=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,i=resolveUrl(this.getAttribute("assetpath")||"",t.baseURI);this.P=pathFromUrl(i)}return this.P}register(t){if(t=t||this.id){if(strictTemplatePolicy&&void 0!==findModule(t))throw setModule(t,null),new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);this.id=t,setModule(t,this),styleOutsideTemplateCheck(this)}}}DomModule.prototype.modules=modules,customElements.define("dom-module",DomModule);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const MODULE_STYLE_LINK_SELECTOR="link[rel=import][type~=css]",INCLUDE_ATTR="include",SHADY_UNSCOPED_ATTR="shady-unscoped";function importModule(t){return DomModule.import(t)}function styleForImport(t){let i=t.body?t.body:t;const e=resolveCss(i.textContent,t.baseURI),o=document.createElement("style");return o.textContent=e,o}function stylesFromModules(t){const i=t.trim().split(/\s+/),e=[];for(let t=0;t<i.length;t++)e.push(...stylesFromModule(i[t]));return e}function stylesFromModule(t){const i=importModule(t);if(!i)return console.warn("Could not find style data in module named",t),[];if(void 0===i._styles){const t=[];t.push(..._stylesFromModuleImports(i));const e=i.querySelector("template");e&&t.push(...stylesFromTemplate(e,i.assetpath)),i._styles=t}return i._styles}function stylesFromTemplate(t,i){if(!t._styles){const e=[],o=t.content.querySelectorAll("style");for(let t=0;t<o.length;t++){let s=o[t],n=s.getAttribute(INCLUDE_ATTR);n&&e.push(...stylesFromModules(n).filter((function(t,i,e){return e.indexOf(t)===i}))),i&&(s.textContent=resolveCss(s.textContent,i)),e.push(s)}t._styles=e}return t._styles}function stylesFromModuleImports(t){let i=importModule(t);return i?_stylesFromModuleImports(i):[]}function _stylesFromModuleImports(t){const i=[],e=t.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);for(let t=0;t<e.length;t++){let o=e[t];if(o.import){const t=o.import,e=o.hasAttribute(SHADY_UNSCOPED_ATTR);if(e&&!t._unscopedStyle){const i=styleForImport(t);i.setAttribute(SHADY_UNSCOPED_ATTR,""),t._unscopedStyle=i}else t._style||(t._style=styleForImport(t));i.push(e?t._unscopedStyle:t._style)}}return i}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function isPath(t){return t.indexOf(".")>=0}function root(t){let i=t.indexOf(".");return-1===i?t:t.slice(0,i)}function isAncestor(t,i){return 0===t.indexOf(i+".")}function isDescendant(t,i){return 0===i.indexOf(t+".")}function translate(t,i,e){return i+e.slice(t.length)}function normalize(t){if(Array.isArray(t)){let i=[];for(let e=0;e<t.length;e++){let o=t[e].toString().split(".");for(let t=0;t<o.length;t++)i.push(o[t])}return i.join(".")}return t}function split(t){return Array.isArray(t)?normalize(t).split("."):t.toString().split(".")}function get$1(t,i,e){let o=t,s=split(i);for(let t=0;t<s.length;t++){if(!o)return;o=o[s[t]]}return e&&(e.path=s.join(".")),o}function set(t,i,e){let o=t,s=split(i),n=s[s.length-1];if(s.length>1){for(let t=0;t<s.length-1;t++){if(o=o[s[t]],!o)return}o[n]=e}else o[i]=e;return s.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const caseMap={},DASH_TO_CAMEL=/-[a-z]/g,CAMEL_TO_DASH=/([A-Z])/g;function dashToCamelCase(t){return caseMap[t]||(caseMap[t]=t.indexOf("-")<0?t:t.replace(DASH_TO_CAMEL,(t=>t[1].toUpperCase())))}function camelToDashCase(t){return caseMap[t]||(caseMap[t]=t.replace(CAMEL_TO_DASH,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const microtask=microTask$1,PropertiesChanged=dedupingMixin((t=>class extends t{static createProperties(t){const i=this.prototype;for(let e in t)e in i||i._createPropertyAccessor(e)}static attributeNameForProperty(t){return t.toLowerCase()}static typeForProperty(t){}_createPropertyAccessor(t,i){this._addPropertyToAttributeMap(t),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.V=Object.assign({},this.V)),this.V[t]||(this.V[t]=!0,this._definePropertyAccessor(t,i))}_addPropertyToAttributeMap(t){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.K=Object.assign({},this.K));let i=this.K[t];return i||(i=this.constructor.attributeNameForProperty(t),this.K[i]=t),i}_definePropertyAccessor(t,i){Object.defineProperty(this,t,{get(){return this.F[t]},set:i?function(){}:function(i){this._setPendingProperty(t,i,!0)&&this._invalidateProperties()}})}constructor(){super(),this.tt=!1,this.it=!1,this.et=!1,this.F={},this.ot=null,this.nt=null,this.rt=null,this.It=0,this.gt=!1,this._initializeProperties()}ready(){this.it=!0,this._flushProperties()}_initializeProperties(){for(let t in this.V)this.hasOwnProperty(t)&&(this.rt=this.rt||{},this.rt[t]=this[t],delete this[t])}_initializeInstanceProperties(t){Object.assign(this,t)}_setProperty(t,i){this._setPendingProperty(t,i)&&this._invalidateProperties()}_getProperty(t){return this.F[t]}_setPendingProperty(t,i,e){let o=this.F[t],s=this._shouldPropertyChange(t,i,o);return s&&(this.ot||(this.ot={},this.nt={}),this.nt&&!(t in this.nt)&&(this.nt[t]=o),this.F[t]=i,this.ot[t]=i),s}_isPropertyPending(t){return!(!this.ot||!this.ot.hasOwnProperty(t))}_invalidateProperties(){!this.et&&this.it&&(this.et=!0,microtask.run((()=>{this.et&&(this.et=!1,this._flushProperties())})))}_enableProperties(){this.tt||(this.tt=!0,this.rt&&(this._initializeInstanceProperties(this.rt),this.rt=null),this.ready())}_flushProperties(){this.It++;const t=this.F,i=this.ot,e=this.nt;this._shouldPropertiesChange(t,i,e)&&(this.ot=null,this.nt=null,this._propertiesChanged(t,i,e)),this.It--}_shouldPropertiesChange(t,i,e){return Boolean(i)}_propertiesChanged(t,i,e){}_shouldPropertyChange(t,i,e){return e!==i&&(e==e||i==i)}attributeChangedCallback(t,i,e,o){i!==e&&this._attributeToProperty(t,e),super.attributeChangedCallback&&super.attributeChangedCallback(t,i,e,o)}_attributeToProperty(t,i,e){if(!this.gt){const o=this.K,s=o&&o[t]||t;this[s]=this._deserializeValue(i,e||this.constructor.typeForProperty(s))}}_propertyToAttribute(t,i,e){this.gt=!0,e=arguments.length<3?this[t]:e,this._valueToNodeAttribute(this,e,i||this.constructor.attributeNameForProperty(t)),this.gt=!1}_valueToNodeAttribute(t,i,e){const o=this._serializeValue(i);"class"!==e&&"name"!==e&&"slot"!==e||(t=wrap$1(t)),void 0===o?t.removeAttribute(e):t.setAttribute(e,""===o&&window.trustedTypes?window.trustedTypes.emptyScript:o)}_serializeValue(t){return"boolean"==typeof t?t?"":void 0:null!=t?t.toString():void 0}_deserializeValue(t,i){switch(i){case Boolean:return null!==t;case Number:return Number(t);default:return t}}})),nativeProperties={};let proto=HTMLElement.prototype;for(;proto;){let t=Object.getOwnPropertyNames(proto);for(let i=0;i<t.length;i++)nativeProperties[t[i]]=!0;proto=Object.getPrototypeOf(proto)}const isTrustedType=window.trustedTypes?t=>trustedTypes.isHTML(t)||trustedTypes.isScript(t)||trustedTypes.isScriptURL(t):()=>!1;function saveAccessorValue(t,i){if(!nativeProperties[i]){let e=t[i];void 0!==e&&(t.F?t._setPendingProperty(i,e):(t.lt?t.hasOwnProperty(JSCompiler_renameProperty("__dataProto",t))||(t.lt=Object.create(t.lt)):t.lt={},t.lt[i]=e))}}const PropertyAccessors=dedupingMixin((t=>{const i=PropertiesChanged(t);return class extends i{static createPropertiesForAttributes(){let t=this.observedAttributes;for(let i=0;i<t.length;i++)this.prototype._createPropertyAccessor(dashToCamelCase(t[i]))}static attributeNameForProperty(t){return camelToDashCase(t)}_initializeProperties(){this.lt&&(this._initializeProtoProperties(this.lt),this.lt=null),super._initializeProperties()}_initializeProtoProperties(t){for(let i in t)this._setProperty(i,t[i])}_ensureAttribute(t,i){const e=this;e.hasAttribute(t)||this._valueToNodeAttribute(e,i,t)}_serializeValue(t){if("object"==typeof t){if(t instanceof Date)return t.toString();if(t){if(isTrustedType(t))return t;try{return JSON.stringify(t)}catch(t){return""}}}return super._serializeValue(t)}_deserializeValue(t,i){let e;switch(i){case Object:try{e=JSON.parse(t)}catch(i){e=t}break;case Array:try{e=JSON.parse(t)}catch(i){e=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${t}`)}break;case Date:e=isNaN(t)?String(t):Number(t),e=new Date(e);break;default:e=super._deserializeValue(t,i)}return e}_definePropertyAccessor(t,i){saveAccessorValue(this,t),super._definePropertyAccessor(t,i)}_hasAccessor(t){return this.V&&this.V[t]}_isPropertyPending(t){return Boolean(this.ot&&t in this.ot)}}})),templateExtensions={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let placeholderBugDetect=!1,placeholderBug=!1;function hasPlaceholderBug(){if(!placeholderBugDetect){placeholderBugDetect=!0;const t=document.createElement("textarea");t.placeholder="a",placeholderBug=t.placeholder===t.textContent}return placeholderBug}function fixPlaceholder(t){hasPlaceholderBug()&&"textarea"===t.localName&&t.placeholder&&t.placeholder===t.textContent&&(t.textContent=null)}const copyAttributeWithTemplateEventPolicy=(()=>{const t=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:t=>t});return(i,e,o)=>{const s=e.getAttribute(o);t&&o.startsWith("on-")?i.setAttribute(o,t.createScript(s,o)):i.setAttribute(o,s)}})();function wrapTemplateExtension(t){let i=t.getAttribute("is");if(i&&templateExtensions[i]){let e=t;for(e.removeAttribute("is"),t=e.ownerDocument.createElement(i),e.parentNode.replaceChild(t,e),t.appendChild(e);e.attributes.length;){const{name:i}=e.attributes[0];copyAttributeWithTemplateEventPolicy(t,e,i),e.removeAttribute(i)}}return t}function findTemplateNode(t,i){let e=i.parentInfo&&findTemplateNode(t,i.parentInfo);if(!e)return t;for(let t=e.firstChild,o=0;t;t=t.nextSibling)if(i.parentIndex===o++)return t}function applyIdToMap(t,i,e,o){o.id&&(i[o.id]=e)}function applyEventListener(t,i,e){if(e.events&&e.events.length)for(let o,s=0,n=e.events;s<n.length&&(o=n[s]);s++)t._addMethodEventListenerToNode(i,o.name,o.value,t)}function applyTemplateInfo(t,i,e,o){e.templateInfo&&(i._templateInfo=e.templateInfo,i._parentTemplateInfo=o)}function createNodeEventHandler(t,i,e){t=t._methodHost||t;return function(i){t[e]?t[e](i,i.detail):console.warn("listener method `"+e+"` not defined")}}const TemplateStamp=dedupingMixin((t=>class extends t{static _parseTemplate(t,i){if(!t._templateInfo){let e=t._templateInfo={};e.nodeInfoList=[],e.nestedTemplate=Boolean(i),e.stripWhiteSpace=i&&i.stripWhiteSpace||t.hasAttribute&&t.hasAttribute("strip-whitespace"),this._parseTemplateContent(t,e,{parent:null})}return t._templateInfo}static _parseTemplateContent(t,i,e){return this._parseTemplateNode(t.content,i,e)}static _parseTemplateNode(t,i,e){let o=!1,s=t;return"template"!=s.localName||s.hasAttribute("preserve-content")?"slot"===s.localName&&(i.hasInsertionPoint=!0):o=this._parseTemplateNestedTemplate(s,i,e)||o,fixPlaceholder(s),s.firstChild&&this._parseTemplateChildNodes(s,i,e),s.hasAttributes&&s.hasAttributes()&&(o=this._parseTemplateNodeAttributes(s,i,e)||o),o||e.noted}static _parseTemplateChildNodes(t,i,e){if("script"!==t.localName&&"style"!==t.localName)for(let o,s=t.firstChild,n=0;s;s=o){if("template"==s.localName&&(s=wrapTemplateExtension(s)),o=s.nextSibling,s.nodeType===Node.TEXT_NODE){let e=o;for(;e&&e.nodeType===Node.TEXT_NODE;)s.textContent+=e.textContent,o=e.nextSibling,t.removeChild(e),e=o;if(i.stripWhiteSpace&&!s.textContent.trim()){t.removeChild(s);continue}}let r={parentIndex:n,parentInfo:e};this._parseTemplateNode(s,i,r)&&(r.infoIndex=i.nodeInfoList.push(r)-1),s.parentNode&&n++}}static _parseTemplateNestedTemplate(t,i,e){let o=t,s=this._parseTemplate(o,i);return(s.content=o.content.ownerDocument.createDocumentFragment()).appendChild(o.content),e.templateInfo=s,!0}static _parseTemplateNodeAttributes(t,i,e){let o=!1,s=Array.from(t.attributes);for(let n,r=s.length-1;n=s[r];r--)o=this._parseTemplateNodeAttribute(t,i,e,n.name,n.value)||o;return o}static _parseTemplateNodeAttribute(t,i,e,o,s){return"on-"===o.slice(0,3)?(t.removeAttribute(o),e.events=e.events||[],e.events.push({name:o.slice(3),value:s}),!0):"id"===o&&(e.id=s,!0)}static _contentForTemplate(t){let i=t._templateInfo;return i&&i.content||t.content}_stampTemplate(t,i){t&&!t.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(t);let e=(i=i||this.constructor._parseTemplate(t)).nodeInfoList,o=i.content||t.content,s=document.importNode(o,!0);s.ct=!i.hasInsertionPoint;let n=s.nodeList=new Array(e.length);s.$={};for(let t,o=0,r=e.length;o<r&&(t=e[o]);o++){let e=n[o]=findTemplateNode(s,t);applyIdToMap(this,s.$,e,t),applyTemplateInfo(this,e,t,i),applyEventListener(this,e,t)}return s}_addMethodEventListenerToNode(t,i,e,o){let s=createNodeEventHandler(o=o||t,i,e);return this._addEventListenerToNode(t,i,s),s}_addEventListenerToNode(t,i,e){t.addEventListener(i,e)}_removeEventListenerFromNode(t,i,e){t.removeEventListener(i,e)}}));
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
 */let dedupeId=0;const NOOP=[],TYPES={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},COMPUTE_INFO="__computeInfo",capitalAttributeRegex=/[A-Z]/;function ensureOwnEffectMap(t,i,e){let o=t[i];if(o){if(!t.hasOwnProperty(i)&&(o=t[i]=Object.create(t[i]),e))for(let t in o){let i=o[t],e=o[t]=Array(i.length);for(let t=0;t<i.length;t++)e[t]=i[t]}}else o=t[i]={};return o}function runEffects(t,i,e,o,s,n){if(i){let r=!1;const a=dedupeId++;for(let I in e){let g=i[s?root(I):I];if(g)for(let i,l=0,c=g.length;l<c&&(i=g[l]);l++)i.info&&i.info.lastRun===a||s&&!pathMatchesTrigger(I,i.trigger)||(i.info&&(i.info.lastRun=a),i.fn(t,I,e,o,i.info,s,n),r=!0)}return r}return!1}function runEffectsForProperty(t,i,e,o,s,n,r,a){let I=!1,g=i[r?root(o):o];if(g)for(let i,l=0,c=g.length;l<c&&(i=g[l]);l++)i.info&&i.info.lastRun===e||r&&!pathMatchesTrigger(o,i.trigger)||(i.info&&(i.info.lastRun=e),i.fn(t,o,s,n,i.info,r,a),I=!0);return I}function pathMatchesTrigger(t,i){if(i){let e=i.name;return e==t||!(!i.structured||!isAncestor(e,t))||!(!i.wildcard||!isDescendant(e,t))}return!0}function runObserverEffect(t,i,e,o,s){let n="string"==typeof s.method?t[s.method]:s.method,r=s.property;n?n.call(t,t.F[r],o[r]):s.dynamicFn||console.warn("observer method `"+s.method+"` not defined")}function runNotifyEffects(t,i,e,o,s){let n,r,a=t[TYPES.NOTIFY],I=dedupeId++;for(let r in i)i[r]&&(a&&runEffectsForProperty(t,a,I,r,e,o,s)||s&&notifyPath(t,r,e))&&(n=!0);n&&(r=t.dt)&&r._invalidateProperties&&r._invalidateProperties()}function notifyPath(t,i,e){let o=root(i);if(o!==i){return dispatchNotifyEvent(t,camelToDashCase(o)+"-changed",e[i],i),!0}return!1}function dispatchNotifyEvent(t,i,e,o){let s={value:e,queueProperty:!0};o&&(s.path=o),wrap$1(t).dispatchEvent(new CustomEvent(i,{detail:s}))}function runNotifyEffect(t,i,e,o,s,n){let r=(n?root(i):i)!=i?i:null,a=r?get$1(t,r):t.F[i];r&&void 0===a&&(a=e[i]),dispatchNotifyEvent(t,s.eventName,a,r)}function handleNotification(t,i,e,o,s){let n,r=t.detail,a=r&&r.path;a?(o=translate(e,o,a),n=r&&r.value):n=t.currentTarget[e],n=s?!n:n,i[TYPES.READ_ONLY]&&i[TYPES.READ_ONLY][o]||!i._setPendingPropertyOrPath(o,n,!0,Boolean(a))||r&&r.queueProperty||i._invalidateProperties()}function runReflectEffect(t,i,e,o,s){let n=t.F[i];sanitizeDOMValue&&(n=sanitizeDOMValue(n,s.attrName,"attribute",t)),t._propertyToAttribute(i,s.attrName,n)}function runComputedEffects(t,i,e,o){let s=t[TYPES.COMPUTE];if(s)if(orderedComputed){dedupeId++;const n=getComputedOrder(t),r=[];for(let t in i)enqueueEffectsFor(t,s,r,n,o);let a;for(;a=r.shift();)runComputedEffect(t,"",i,e,a)&&enqueueEffectsFor(a.methodInfo,s,r,n,o);Object.assign(e,t.nt),Object.assign(i,t.ot),t.ot=null}else{let n=i;for(;runEffects(t,s,n,e,o);)Object.assign(e,t.nt),Object.assign(i,t.ot),n=t.ot,t.ot=null}}const insertEffect=(t,i,e)=>{let o=0,s=i.length-1,n=-1;for(;o<=s;){const r=o+s>>1,a=e.get(i[r].methodInfo)-e.get(t.methodInfo);if(a<0)o=r+1;else{if(!(a>0)){n=r;break}s=r-1}}n<0&&(n=s+1),i.splice(n,0,t)},enqueueEffectsFor=(t,i,e,o,s)=>{const n=i[s?root(t):t];if(n)for(let i=0;i<n.length;i++){const r=n[i];r.info.lastRun===dedupeId||s&&!pathMatchesTrigger(t,r.trigger)||(r.info.lastRun=dedupeId,insertEffect(r.info,e,o))}};function getComputedOrder(t){let i=t.constructor.ht;if(!i){i=new Map;const e=t[TYPES.COMPUTE];let o,{counts:s,ready:n,total:r}=dependencyCounts(t);for(;o=n.shift();){i.set(o,i.size);const t=e[o];t&&t.forEach((t=>{const i=t.info.methodInfo;--r,0==--s[i]&&n.push(i)}))}if(0!==r){const i=t;console.warn(`Computed graph for ${i.localName} incomplete; circular?`)}t.constructor.ht=i}return i}function dependencyCounts(t){const i=t[COMPUTE_INFO],e={},o=t[TYPES.COMPUTE],s=[];let n=0;for(let t in i){const o=i[t];n+=e[t]=o.args.filter((t=>!t.literal)).length+(o.dynamicFn?1:0)}for(let t in o)i[t]||s.push(t);return{counts:e,ready:s,total:n}}function runComputedEffect(t,i,e,o,s){let n=runMethodEffect(t,i,e,o,s);if(n===NOOP)return!1;let r=s.methodInfo;return t.V&&t.V[r]?t._setPendingProperty(r,n,!0):(t[r]=n,!1)}function computeLinkedPaths(t,i,e){let o=t.Ct;if(o){let s;for(let n in o){let r=o[n];isDescendant(n,i)?(s=translate(n,r,i),t._setPendingPropertyOrPath(s,e,!0,!0)):isDescendant(r,i)&&(s=translate(r,n,i),t._setPendingPropertyOrPath(s,e,!0,!0))}}}function addBinding(t,i,e,o,s,n,r){e.bindings=e.bindings||[];let a={kind:o,target:s,parts:n,literal:r,isCompound:1!==n.length};if(e.bindings.push(a),shouldAddListener(a)){let{event:t,negate:i}=a.parts[0];a.listenerEvent=t||camelToDashCase(s)+"-changed",a.listenerNegate=i}let I=i.nodeInfoList.length;for(let e=0;e<a.parts.length;e++){let o=a.parts[e];o.compoundIndex=e,addEffectForBindingPart(t,i,a,o,I)}}function addEffectForBindingPart(t,i,e,o,s){if(!o.literal)if("attribute"===e.kind&&"-"===e.target[0])console.warn("Cannot set attribute "+e.target+' because "-" is not a valid attribute starting character');else{let n=o.dependencies,r={index:s,binding:e,part:o,evaluator:t};for(let e=0;e<n.length;e++){let o=n[e];"string"==typeof o&&(o=parseArg(o),o.wildcard=!0),t._addTemplatePropertyEffect(i,o.rootProperty,{fn:runBindingEffect,info:r,trigger:o})}}}function runBindingEffect(t,i,e,o,s,n,r){let a=r[s.index],I=s.binding,g=s.part;if(n&&g.source&&i.length>g.source.length&&"property"==I.kind&&!I.isCompound&&a.At&&a.V&&a.V[I.target]){let o=e[i];i=translate(g.source,I.target,i),a._setPendingPropertyOrPath(i,o,!1,!0)&&t._enqueueClient(a)}else{let r=s.evaluator._evaluateBinding(t,g,i,e,o,n);r!==NOOP&&applyBindingValue(t,a,I,g,r)}}function applyBindingValue(t,i,e,o,s){if(s=computeBindingValue(i,s,e,o),sanitizeDOMValue&&(s=sanitizeDOMValue(s,e.target,e.kind,i)),"attribute"==e.kind)t._valueToNodeAttribute(i,s,e.target);else{let o=e.target;i.At&&i.V&&i.V[o]?i[TYPES.READ_ONLY]&&i[TYPES.READ_ONLY][o]||i._setPendingProperty(o,s)&&t._enqueueClient(i):t._setUnmanagedPropertyToNode(i,o,s)}}function computeBindingValue(t,i,e,o){if(e.isCompound){let s=t.ut[e.target];s[o.compoundIndex]=i,i=s.join("")}return"attribute"!==e.kind&&("textContent"!==e.target&&("value"!==e.target||"input"!==t.localName&&"textarea"!==t.localName)||(i=i??"")),i}function shouldAddListener(t){return Boolean(t.target)&&"attribute"!=t.kind&&"text"!=t.kind&&!t.isCompound&&"{"===t.parts[0].mode}function setupBindings(t,i){let{nodeList:e,nodeInfoList:o}=i;if(o.length)for(let i=0;i<o.length;i++){let s=o[i],n=e[i],r=s.bindings;if(r)for(let i=0;i<r.length;i++){let e=r[i];setupCompoundStorage(n,e),addNotifyListener(n,t,e)}n.dt=t}}function setupCompoundStorage(t,i){if(i.isCompound){let e=t.ut||(t.ut={}),o=i.parts,s=new Array(o.length);for(let t=0;t<o.length;t++)s[t]=o[t].literal;let n=i.target;e[n]=s,i.literal&&"property"==i.kind&&("className"===n&&(t=wrap$1(t)),t[n]=i.literal)}}function addNotifyListener(t,i,e){if(e.listenerEvent){let o=e.parts[0];t.addEventListener(e.listenerEvent,(function(t){handleNotification(t,i,e.target,o.source,o.negate)}))}}function createMethodEffect(t,i,e,o,s,n){n=i.static||n&&("object"!=typeof n||n[i.methodName]);let r={methodName:i.methodName,args:i.args,methodInfo:s,dynamicFn:n};for(let s,n=0;n<i.args.length&&(s=i.args[n]);n++)s.literal||t._addPropertyEffect(s.rootProperty,e,{fn:o,info:r,trigger:s});return n&&t._addPropertyEffect(i.methodName,e,{fn:o,info:r}),r}function runMethodEffect(t,i,e,o,s){let n=t._methodHost||t,r=n[s.methodName];if(r){let o=t._marshalArgs(s.args,i,e);return o===NOOP?NOOP:r.apply(n,o)}s.dynamicFn||console.warn("method `"+s.methodName+"` not defined")}const emptyArray=[],IDENT="(?:[a-zA-Z_$][\\w.:$\\-*]*)",NUMBER="(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)",SQUOTE_STRING="(?:'(?:[^'\\\\]|\\\\.)*')",DQUOTE_STRING='(?:"(?:[^"\\\\]|\\\\.)*")',STRING="(?:"+SQUOTE_STRING+"|"+DQUOTE_STRING+")",ARGUMENT="(?:("+IDENT+"|"+NUMBER+"|"+STRING+")\\s*)",ARGUMENTS="(?:"+ARGUMENT+"(?:,\\s*"+ARGUMENT+")*)",ARGUMENT_LIST="(?:\\(\\s*(?:"+ARGUMENTS+"?)\\)\\s*)",BINDING="("+IDENT+"\\s*"+ARGUMENT_LIST+"?)",OPEN_BRACKET="(\\[\\[|{{)\\s*",CLOSE_BRACKET="(?:]]|}})",NEGATE="(?:(!)\\s*)?",EXPRESSION=OPEN_BRACKET+NEGATE+BINDING+CLOSE_BRACKET,bindingRegex=new RegExp(EXPRESSION,"g");function literalFromParts(t){let i="";for(let e=0;e<t.length;e++){i+=t[e].literal||""}return i}function parseMethod(t){let i=t.match(/([^\s]+?)\(([\s\S]*)\)/);if(i){let t={methodName:i[1],static:!0,args:emptyArray};if(i[2].trim()){return parseArgs(i[2].replace(/\\,/g,"&comma;").split(","),t)}return t}return null}function parseArgs(t,i){return i.args=t.map((function(t){let e=parseArg(t);return e.literal||(i.static=!1),e}),this),i}function parseArg(t){let i=t.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),e={name:i,value:"",literal:!1},o=i[0];switch("-"===o&&(o=i[1]),o>="0"&&o<="9"&&(o="#"),o){case"'":case'"':e.value=i.slice(1,-1),e.literal=!0;break;case"#":e.value=Number(i),e.literal=!0}return e.literal||(e.rootProperty=root(i),e.structured=isPath(i),e.structured&&(e.wildcard=".*"==i.slice(-2),e.wildcard&&(e.name=i.slice(0,-2)))),e}function getArgValue(t,i,e){let o=get$1(t,e);return void 0===o&&(o=i[e]),o}function notifySplices(t,i,e,o){const s={indexSplices:o};legacyUndefined&&!t._overrideLegacyUndefined&&(i.splices=s),t.notifyPath(e+".splices",s),t.notifyPath(e+".length",i.length),legacyUndefined&&!t._overrideLegacyUndefined&&(s.indexSplices=[])}function notifySplice(t,i,e,o,s,n){notifySplices(t,i,e,[{index:o,addedCount:s,removed:n,object:i,type:"splice"}])}function upper(t){return t[0].toUpperCase()+t.substring(1)}const PropertyEffects=dedupingMixin((t=>{const i=TemplateStamp(PropertyAccessors(t));return class extends i{constructor(){super(),this.At=!0,this.bt,this.Zt,this.Mt,this.Ct,this.Nt,this.ut,this.dt,this.yt,this.jt,this.F,this.ot,this.nt,this.wt,this.Tt,this.ft,this.Ot,this.Dt,this.xt,this.zt,this.Gt,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return TYPES}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.bt=!1,this.Zt=null,this.Mt=null,this.Ct=null,this.Nt=!1,this.ut=this.ut||null,this.dt=this.dt||null,this.yt={},this.jt=!1}_registerHost(){if(hostStack.length){let t=hostStack[hostStack.length-1];t._enqueueClient(this),this.dt=t}}_initializeProtoProperties(t){this.F=Object.create(t),this.ot=Object.create(t),this.nt={}}_initializeInstanceProperties(t){let i=this[TYPES.READ_ONLY];for(let e in t)i&&i[e]||(this.ot=this.ot||{},this.nt=this.nt||{},this.F[e]=this.ot[e]=t[e])}_addPropertyEffect(t,i,e){this._createPropertyAccessor(t,i==TYPES.READ_ONLY);let o=ensureOwnEffectMap(this,i,!0)[t];o||(o=this[i][t]=[]),o.push(e)}_removePropertyEffect(t,i,e){let o=ensureOwnEffectMap(this,i,!0)[t],s=o.indexOf(e);s>=0&&o.splice(s,1)}_hasPropertyEffect(t,i){let e=this[i];return Boolean(e&&e[t])}_hasReadOnlyEffect(t){return this._hasPropertyEffect(t,TYPES.READ_ONLY)}_hasNotifyEffect(t){return this._hasPropertyEffect(t,TYPES.NOTIFY)}_hasReflectEffect(t){return this._hasPropertyEffect(t,TYPES.REFLECT)}_hasComputedEffect(t){return this._hasPropertyEffect(t,TYPES.COMPUTE)}_setPendingPropertyOrPath(t,i,e,o){if(o||root(Array.isArray(t)?t[0]:t)!==t){if(!o){let e=get$1(this,t);if(!(t=set(this,t,i))||!super._shouldPropertyChange(t,i,e))return!1}if(this.Nt=!0,this._setPendingProperty(t,i,e))return computeLinkedPaths(this,t,i),!0}else{if(this.V&&this.V[t])return this._setPendingProperty(t,i,e);this[t]=i}return!1}_setUnmanagedPropertyToNode(t,i,e){e===t[i]&&"object"!=typeof e||("className"===i&&(t=wrap$1(t)),t[i]=e)}_setPendingProperty(t,i,e){let o=this.Nt&&isPath(t),s=o?this.yt:this.F;return!!this._shouldPropertyChange(t,i,s[t])&&(this.ot||(this.ot={},this.nt={}),t in this.nt||(this.nt[t]=this.F[t]),o?this.yt[t]=i:this.F[t]=i,this.ot[t]=i,(o||this[TYPES.NOTIFY]&&this[TYPES.NOTIFY][t])&&(this.Mt=this.Mt||{},this.Mt[t]=e),!0)}_setProperty(t,i){this._setPendingProperty(t,i,!0)&&this._invalidateProperties()}_invalidateProperties(){this.it&&this._flushProperties()}_enqueueClient(t){this.Zt=this.Zt||[],t!==this&&this.Zt.push(t)}_flushClients(){this.bt?this.kt():(this.bt=!0,this._readyClients(),this.it=!0)}kt(){let t=this.Zt;if(t){this.Zt=null;for(let i=0;i<t.length;i++){let e=t[i];e.tt?e.ot&&e._flushProperties():e._enableProperties()}}}_readyClients(){this.kt()}setProperties(t,i){for(let e in t)!i&&this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][e]||this._setPendingPropertyOrPath(e,t[e],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.bt||this._flushClients(),this.ot&&this._flushProperties()}_propertiesChanged(t,i,e){let o,s=this.Nt;this.Nt=!1,runComputedEffects(this,i,e,s),o=this.Mt,this.Mt=null,this._propagatePropertyChanges(i,e,s),this._flushClients(),runEffects(this,this[TYPES.REFLECT],i,e,s),runEffects(this,this[TYPES.OBSERVE],i,e,s),o&&runNotifyEffects(this,o,i,e,s),1==this.It&&(this.yt={})}_propagatePropertyChanges(t,i,e){this[TYPES.PROPAGATE]&&runEffects(this,this[TYPES.PROPAGATE],t,i,e),this.Gt&&this._runEffectsForTemplate(this.Gt,t,i,e)}_runEffectsForTemplate(t,i,e,o){const s=(i,o)=>{runEffects(this,t.propertyEffects,i,e,o,t.nodeList);for(let s=t.firstChild;s;s=s.nextSibling)this._runEffectsForTemplate(s,i,e,o)};t.runEffects?t.runEffects(s,i,o):s(i,o)}linkPaths(t,i){t=normalize(t),i=normalize(i),this.Ct=this.Ct||{},this.Ct[t]=i}unlinkPaths(t){t=normalize(t),this.Ct&&delete this.Ct[t]}notifySplices(t,i){let e={path:""};notifySplices(this,get$1(this,t,e),e.path,i)}get(t,i){return get$1(i||this,t)}set(t,i,e){e?set(e,t,i):this[TYPES.READ_ONLY]&&this[TYPES.READ_ONLY][t]||this._setPendingPropertyOrPath(t,i,!0)&&this._invalidateProperties()}push(t,...i){let e={path:""},o=get$1(this,t,e),s=o.length,n=o.push(...i);return i.length&&notifySplice(this,o,e.path,s,i.length,[]),n}pop(t){let i={path:""},e=get$1(this,t,i),o=Boolean(e.length),s=e.pop();return o&&notifySplice(this,e,i.path,e.length,0,[s]),s}splice(t,i,e,...o){let s,n={path:""},r=get$1(this,t,n);return i<0?i=r.length-Math.floor(-i):i&&(i=Math.floor(i)),s=2===arguments.length?r.splice(i):r.splice(i,e,...o),(o.length||s.length)&&notifySplice(this,r,n.path,i,o.length,s),s}shift(t){let i={path:""},e=get$1(this,t,i),o=Boolean(e.length),s=e.shift();return o&&notifySplice(this,e,i.path,0,0,[s]),s}unshift(t,...i){let e={path:""},o=get$1(this,t,e),s=o.unshift(...i);return i.length&&notifySplice(this,o,e.path,0,i.length,[]),s}notifyPath(t,i){let e;if(1==arguments.length){let o={path:""};i=get$1(this,t,o),e=o.path}else e=Array.isArray(t)?normalize(t):t;this._setPendingPropertyOrPath(e,i,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(t,i){this._addPropertyEffect(t,TYPES.READ_ONLY),i&&(this["_set"+upper(t)]=function(i){this._setProperty(t,i)})}_createPropertyObserver(t,i,e){let o={property:t,method:i,dynamicFn:Boolean(e)};this._addPropertyEffect(t,TYPES.OBSERVE,{fn:runObserverEffect,info:o,trigger:{name:t}}),e&&this._addPropertyEffect(i,TYPES.OBSERVE,{fn:runObserverEffect,info:o,trigger:{name:i}})}_createMethodObserver(t,i){let e=parseMethod(t);if(!e)throw new Error("Malformed observer expression '"+t+"'");createMethodEffect(this,e,TYPES.OBSERVE,runMethodEffect,null,i)}_createNotifyingProperty(t){this._addPropertyEffect(t,TYPES.NOTIFY,{fn:runNotifyEffect,info:{eventName:camelToDashCase(t)+"-changed",property:t}})}_createReflectedProperty(t){let i=this.constructor.attributeNameForProperty(t);"-"===i[0]?console.warn("Property "+t+" cannot be reflected to attribute "+i+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(t,TYPES.REFLECT,{fn:runReflectEffect,info:{attrName:i}})}_createComputedProperty(t,i,e){let o=parseMethod(i);if(!o)throw new Error("Malformed computed expression '"+i+"'");const s=createMethodEffect(this,o,TYPES.COMPUTE,runComputedEffect,t,e);ensureOwnEffectMap(this,COMPUTE_INFO)[t]=s}_marshalArgs(t,i,e){const o=this.F,s=[];for(let n=0,r=t.length;n<r;n++){let{name:r,structured:a,wildcard:I,value:g,literal:l}=t[n];if(!l)if(I){const t=isDescendant(r,i),s=getArgValue(o,e,t?i:r);g={path:t?i:r,value:s,base:t?get$1(o,r):s}}else g=a?getArgValue(o,e,r):o[r];if(legacyUndefined&&!this._overrideLegacyUndefined&&void 0===g&&t.length>1)return NOOP;s[n]=g}return s}static addPropertyEffect(t,i,e){this.prototype._addPropertyEffect(t,i,e)}static createPropertyObserver(t,i,e){this.prototype._createPropertyObserver(t,i,e)}static createMethodObserver(t,i){this.prototype._createMethodObserver(t,i)}static createNotifyingProperty(t){this.prototype._createNotifyingProperty(t)}static createReadOnlyProperty(t,i){this.prototype._createReadOnlyProperty(t,i)}static createReflectedProperty(t){this.prototype._createReflectedProperty(t)}static createComputedProperty(t,i,e){this.prototype._createComputedProperty(t,i,e)}static bindTemplate(t){return this.prototype._bindTemplate(t)}_bindTemplate(t,i){let e=this.constructor._parseTemplate(t),o=this.Wt==e;if(!o)for(let t in e.propertyEffects)this._createPropertyAccessor(t);if(i)if(e=Object.create(e),e.wasPreBound=o,this.Gt){const i=t._parentTemplateInfo||this.Gt,o=i.lastChild;e.parent=i,i.lastChild=e,e.previousSibling=o,o?o.nextSibling=e:i.firstChild=e}else this.Gt=e;else this.Wt=e;return e}static _addTemplatePropertyEffect(t,i,e){(t.hostProps=t.hostProps||{})[i]=!0;let o=t.propertyEffects=t.propertyEffects||{};(o[i]=o[i]||[]).push(e)}_stampTemplate(t,i){i=i||this._bindTemplate(t,!0),hostStack.push(this);let e=super._stampTemplate(t,i);if(hostStack.pop(),i.nodeList=e.nodeList,!i.wasPreBound){let t=i.childNodes=[];for(let i=e.firstChild;i;i=i.nextSibling)t.push(i)}return e.templateInfo=i,setupBindings(this,i),this.bt&&(this._runEffectsForTemplate(i,this.F,null,!1),this._flushClients()),e}_removeBoundDom(t){const i=t.templateInfo,{previousSibling:e,nextSibling:o,parent:s}=i;e?e.nextSibling=o:s&&(s.firstChild=o),o?o.previousSibling=e:s&&(s.lastChild=e),i.nextSibling=i.previousSibling=null;let n=i.childNodes;for(let t=0;t<n.length;t++){let i=n[t];wrap$1(wrap$1(i).parentNode).removeChild(i)}}static _parseTemplateNode(t,e,o){let s=i._parseTemplateNode.call(this,t,e,o);if(t.nodeType===Node.TEXT_NODE){let i=this._parseBindings(t.textContent,e);i&&(t.textContent=literalFromParts(i)||" ",addBinding(this,e,o,"text","textContent",i),s=!0)}return s}static _parseTemplateNodeAttribute(t,e,o,s,n){let r=this._parseBindings(n,e);if(r){let i=s,n="property";capitalAttributeRegex.test(s)?n="attribute":"$"==s[s.length-1]&&(s=s.slice(0,-1),n="attribute");let a=literalFromParts(r);return a&&"attribute"==n&&("class"==s&&t.hasAttribute("class")&&(a+=" "+t.getAttribute(s)),t.setAttribute(s,a)),"attribute"==n&&"disable-upgrade$"==i&&t.setAttribute(s,""),"input"===t.localName&&"value"===i&&t.setAttribute(i,""),t.removeAttribute(i),"property"===n&&(s=dashToCamelCase(s)),addBinding(this,e,o,n,s,r,a),!0}return i._parseTemplateNodeAttribute.call(this,t,e,o,s,n)}static _parseTemplateNestedTemplate(t,e,o){let s=i._parseTemplateNestedTemplate.call(this,t,e,o);const n=t.parentNode,r=o.templateInfo,a="dom-if"===n.localName,I="dom-repeat"===n.localName;removeNestedTemplates&&(a||I)&&(n.removeChild(t),(o=o.parentInfo).templateInfo=r,o.noted=!0,s=!1);let g=r.hostProps;if(fastDomIf&&a)g&&(e.hostProps=Object.assign(e.hostProps||{},g),removeNestedTemplates||(o.parentInfo.noted=!0));else{let t="{";for(let i in g){addBinding(this,e,o,"property","_host_"+i,[{mode:t,source:i,dependencies:[i],hostProp:!0}])}}return s}static _parseBindings(t,i){let e,o=[],s=0;for(;null!==(e=bindingRegex.exec(t));){e.index>s&&o.push({literal:t.slice(s,e.index)});let n=e[1][0],r=Boolean(e[2]),a=e[3].trim(),I=!1,g="",l=-1;"{"==n&&(l=a.indexOf("::"))>0&&(g=a.substring(l+2),a=a.substring(0,l),I=!0);let c=parseMethod(a),d=[];if(c){let{args:t,methodName:e}=c;for(let i=0;i<t.length;i++){let e=t[i];e.literal||d.push(e)}let o=i.dynamicFns;(o&&o[e]||c.static)&&(d.push(e),c.dynamicFn=!0)}else d.push(a);o.push({source:a,mode:n,negate:r,customEvent:I,signature:c,dependencies:d,event:g}),s=bindingRegex.lastIndex}if(s&&s<t.length){let i=t.substring(s);i&&o.push({literal:i})}return o.length?o:null}static _evaluateBinding(t,i,e,o,s,n){let r;return r=i.signature?runMethodEffect(t,e,o,s,i.signature):e!=i.source?get$1(t,i.source):n&&isPath(e)?get$1(t,e):t.F[e],i.negate&&(r=!r),r}}})),hostStack=[];
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function register$1(t){}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function normalizeProperties(t){const i={};for(let e in t){const o=t[e];i[e]="function"==typeof o?{type:o}:o}return i}const PropertiesMixin=dedupingMixin((t=>{const i=PropertiesChanged(t);function e(t){const i=Object.getPrototypeOf(t);return i.prototype instanceof s?i:null}function o(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",t))){let i=null;if(t.hasOwnProperty(JSCompiler_renameProperty("properties",t))){const e=t.properties;e&&(i=normalizeProperties(e))}t.Lt=i}return t.Lt}class s extends i{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){register$1(this.prototype);const t=this._properties;this.Yt=t?Object.keys(t).map((t=>this.prototype._addPropertyToAttributeMap(t))):[]}return this.Yt}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const t=e(this);t&&t.finalize(),this.St=!0,this._finalizeClass()}}static _finalizeClass(){const t=o(this);t&&this.createProperties(t)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const t=e(this);this.Rt=Object.assign({},t&&t._properties,o(this))}return this.Rt}static typeForProperty(t){const i=this._properties[t];return i&&i.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return s})),version="3.5.1",builtCSS=window.ShadyCSS&&window.ShadyCSS.cssBuild,ElementMixin$1=dedupingMixin((t=>{const i=PropertiesMixin(PropertyEffects(t));function e(t,i,e,o){e.computed&&(e.readOnly=!0),e.computed&&(t._hasReadOnlyEffect(i)?console.warn(`Cannot redefine computed property '${i}'.`):t._createComputedProperty(i,e.computed,o)),e.readOnly&&!t._hasReadOnlyEffect(i)?t._createReadOnlyProperty(i,!e.computed):!1===e.readOnly&&t._hasReadOnlyEffect(i)&&console.warn(`Cannot make readOnly property '${i}' non-readOnly.`),e.reflectToAttribute&&!t._hasReflectEffect(i)?t._createReflectedProperty(i):!1===e.reflectToAttribute&&t._hasReflectEffect(i)&&console.warn(`Cannot make reflected property '${i}' non-reflected.`),e.notify&&!t._hasNotifyEffect(i)?t._createNotifyingProperty(i):!1===e.notify&&t._hasNotifyEffect(i)&&console.warn(`Cannot make notify property '${i}' non-notify.`),e.observer&&t._createPropertyObserver(i,e.observer,o[e.observer]),t._addPropertyToAttributeMap(i)}return class extends i{static get polymerElementVersion(){return version}static _finalizeClass(){i._finalizeClass.call(this);const t=((e=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",e))||(e.Ht=e.hasOwnProperty(JSCompiler_renameProperty("observers",e))?e.observers:null),e.Ht);var e;t&&this.createObservers(t,this._properties),this._prepareTemplate()}static _prepareTemplate(){let t=this.template;t&&("string"==typeof t?(console.error("template getter must return HTMLTemplateElement"),t=null):legacyOptimizations||(t=t.cloneNode(!0))),this.prototype._template=t}static createProperties(t){for(let i in t)e(this.prototype,i,t[i],t)}static createObservers(t,i){const e=this.prototype;for(let o=0;o<t.length;o++)e._createMethodObserver(t[o],i)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let t=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof t&&(t=t()),this._template=void 0!==t?t:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(t){let i=null;if(t&&(!strictTemplatePolicy||allowTemplateFromDomModule)&&(i=DomModule.import(t,"template"),strictTemplatePolicy&&!i))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${t}`);return i}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(t){this._template=t}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const t=this.importMeta;if(t)this._importPath=pathFromUrl(t.url);else{const t=DomModule.import(this.is);this._importPath=t&&t.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=rootPath,this.importPath=this.constructor.importPath;let t=function(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",t))){t.Bt=null;let i=t._properties;for(let e in i){let o=i[e];"value"in o&&(t.Bt=t.Bt||{},t.Bt[e]=o)}}return t.Bt}(this.constructor);if(t)for(let i in t){let e=t[i];if(this._canApplyPropertyDefault(i)){let t="function"==typeof e.value?e.value.call(this):e.value;this._hasAccessor(i)?this._setPendingProperty(i,t,!0):this[i]=t}}}_canApplyPropertyDefault(t){return!this.hasOwnProperty(t)}static _processStyleText(t,i){return resolveCss(t,i)}static _finalizeTemplate(t){const i=this.prototype._template;if(i&&!i.Xt){i.Xt=!0;const e=this.importPath;!function(t,i,e,o){if(!builtCSS){const s=i.content.querySelectorAll("style"),n=stylesFromTemplate(i),r=stylesFromModuleImports(e),a=i.content.firstElementChild;for(let e=0;e<r.length;e++){let s=r[e];s.textContent=t._processStyleText(s.textContent,o),i.content.insertBefore(s,a)}let I=0;for(let i=0;i<n.length;i++){let e=n[i],r=s[I];r!==e?(e=e.cloneNode(!0),r.parentNode.insertBefore(e,r)):I++,e.textContent=t._processStyleText(e.textContent,o)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(i,e),useAdoptedStyleSheetsWithBuiltCSS&&builtCSS&&supportsAdoptingStyleSheets$1){const e=i.content.querySelectorAll("style");if(e){let i="";Array.from(e).forEach((t=>{i+=t.textContent,t.parentNode.removeChild(t)})),t._styleSheet=new CSSStyleSheet,t._styleSheet.replaceSync(i)}}}(this,i,t,e?resolveUrl(e):""),this.prototype._bindTemplate(i)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(t){const i=wrap$1(this);if(i.attachShadow)return t?(i.shadowRoot||(i.attachShadow({mode:"open",shadyUpgradeFragment:t}),i.shadowRoot.appendChild(t),this.constructor._styleSheet&&(i.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),syncInitialRender&&window.ShadyDOM&&window.ShadyDOM.flushInitial(i.shadowRoot),i.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(t){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,t)}resolveUrl(t,i){return!i&&this.importPath&&(i=resolveUrl(this.importPath)),resolveUrl(t,i)}static _parseTemplateContent(t,e,o){return e.dynamicFns=e.dynamicFns||this._properties,i._parseTemplateContent.call(this,t,e,o)}static _addTemplatePropertyEffect(t,e,o){return!legacyWarnings||e in this._properties||o.info.part.signature&&o.info.part.signature.static||o.info.part.hostProp||t.nestedTemplate||console.warn(`Property '${e}' used in template but not declared in 'properties'; attribute will not be observed.`),i._addTemplatePropertyEffect.call(this,t,e,o)}}})),policy=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:t=>t});
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
 */class LiteralString{constructor(t,i){assertValidTemplateStringParameters(t,i);const e=i.reduce(((i,e,o)=>i+literalValue(e)+t[o+1]),t[0]);this.value=e.toString()}toString(){return this.value}}function literalValue(t){if(t instanceof LiteralString)return t.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)}function htmlValue(t){if(t instanceof HTMLTemplateElement)return t.innerHTML;if(t instanceof LiteralString)return literalValue(t);throw new Error(`non-template value passed to Polymer's html function: ${t}`)}const html=function(t,...i){assertValidTemplateStringParameters(t,i);const e=document.createElement("template");let o=i.reduce(((i,e,o)=>i+htmlValue(e)+t[o+1]),t[0]);return policy&&(o=policy.createHTML(o)),e.innerHTML=o,e},assertValidTemplateStringParameters=(t,i)=>{if(!Array.isArray(t)||!Array.isArray(t.raw)||i.length!==t.length-1)throw new TypeError("Invalid call to the html template tag")},PolymerElement=ElementMixin$1(HTMLElement),DisabledMixin=dedupingMixin((t=>class extends t{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(t){this._setAriaDisabled(t)}_setAriaDisabled(t){t?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}}));
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let microtaskCurrHandle=0,microtaskLastHandle=0;const microtaskCallbacks=[];let microtaskNodeContent=0,microtaskScheduled=!1;const microtaskNode=document.createTextNode("");function microtaskFlush(){microtaskScheduled=!1;const t=microtaskCallbacks.length;for(let i=0;i<t;i++){const t=microtaskCallbacks[i];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}microtaskCallbacks.splice(0,t),microtaskLastHandle+=t}new window.MutationObserver(microtaskFlush).observe(microtaskNode,{characterData:!0});const timeOut={after:t=>({run:i=>window.setTimeout(i,t),cancel(t){window.clearTimeout(t)}}),run:(t,i)=>window.setTimeout(t,i),cancel(t){window.clearTimeout(t)}},animationFrame={run:t=>window.requestAnimationFrame(t),cancel(t){window.cancelAnimationFrame(t)}},idlePeriod={run:t=>window.requestIdleCallback?window.requestIdleCallback(t):window.setTimeout(t,16),cancel(t){window.cancelIdleCallback?window.cancelIdleCallback(t):window.clearTimeout(t)}},microTask={run(t){microtaskScheduled||(microtaskScheduled=!0,microtaskNode.textContent=microtaskNodeContent,microtaskNodeContent+=1),microtaskCallbacks.push(t);const i=microtaskCurrHandle;return microtaskCurrHandle+=1,i},cancel(t){const i=t-microtaskLastHandle;if(i>=0){if(!microtaskCallbacks[i])throw new Error(`invalid async handle: ${t}`);microtaskCallbacks[i]=null}}},passiveTouchGestures=!1,wrap=t=>t,HAS_NATIVE_TA="string"==typeof document.head.style.touchAction,GESTURE_KEY="__polymerGestures",HANDLED_OBJ="__polymerGesturesHandled",TOUCH_ACTION="__polymerGesturesTouchAction",TAP_DISTANCE=25,TRACK_DISTANCE=5,TRACK_LENGTH=2,MOUSE_EVENTS=["mousedown","mousemove","mouseup","click"],MOUSE_WHICH_TO_BUTTONS=[0,1,4,2],MOUSE_HAS_BUTTONS=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function isMouseEvent(t){return MOUSE_EVENTS.indexOf(t)>-1}let supportsPassive=!1;function PASSIVE_TOUCH(t){if(!isMouseEvent(t)&&"touchend"!==t)return HAS_NATIVE_TA&&supportsPassive&&passiveTouchGestures?{passive:!0}:void 0}!function(){try{const t=Object.defineProperty({},"passive",{get(){supportsPassive=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();const IS_TOUCH_ONLY=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/),canBeDisabled={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function hasLeftMouseButton(t){const i=t.type;if(!isMouseEvent(i))return!1;if("mousemove"===i){let i=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!MOUSE_HAS_BUTTONS&&(i=MOUSE_WHICH_TO_BUTTONS[t.which]||0),Boolean(1&i)}return 0===(void 0===t.button?0:t.button)}function isSyntheticClick(t){if("click"===t.type){if(0===t.detail)return!0;const i=_findOriginalTarget(t);if(!i.nodeType||i.nodeType!==Node.ELEMENT_NODE)return!0;const e=i.getBoundingClientRect(),o=t.pageX,s=t.pageY;return!(o>=e.left&&o<=e.right&&s>=e.top&&s<=e.bottom)}return!1}const POINTERSTATE={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function firstTouchAction(t){let i="auto";const e=getComposedPath(t);for(let t,o=0;o<e.length;o++)if(t=e[o],t[TOUCH_ACTION]){i=t[TOUCH_ACTION];break}return i}function trackDocument(t,i,e){t.movefn=i,t.upfn=e,document.addEventListener("mousemove",i),document.addEventListener("mouseup",e)}function untrackDocument(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}const getComposedPath=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],gestures={},recognizers=[];function deepTargetFind(t,i){let e=document.elementFromPoint(t,i),o=e;for(;o&&o.shadowRoot&&!window.ShadyDOM;){const s=o;if(o=o.shadowRoot.elementFromPoint(t,i),s===o)break;o&&(e=o)}return e}function _findOriginalTarget(t){const i=getComposedPath(t);return i.length>0?i[0]:t.target}function _handleNative(t){const i=t.type,e=t.currentTarget[GESTURE_KEY];if(!e)return;const o=e[i];if(!o)return;if(!t[HANDLED_OBJ]&&(t[HANDLED_OBJ]={},i.startsWith("touch"))){const e=t.changedTouches[0];if("touchstart"===i&&1===t.touches.length&&(POINTERSTATE.touch.id=e.identifier),POINTERSTATE.touch.id!==e.identifier)return;HAS_NATIVE_TA||"touchstart"!==i&&"touchmove"!==i||_handleTouchAction(t)}const s=t[HANDLED_OBJ];if(!s.skip){for(let i,e=0;e<recognizers.length;e++)i=recognizers[e],o[i.name]&&!s[i.name]&&i.flow&&i.flow.start.indexOf(t.type)>-1&&i.reset&&i.reset();for(let e,n=0;n<recognizers.length;n++)e=recognizers[n],o[e.name]&&!s[e.name]&&(s[e.name]=!0,e[i](t))}}function _handleTouchAction(t){const i=t.changedTouches[0],e=t.type;if("touchstart"===e)POINTERSTATE.touch.x=i.clientX,POINTERSTATE.touch.y=i.clientY,POINTERSTATE.touch.scrollDecided=!1;else if("touchmove"===e){if(POINTERSTATE.touch.scrollDecided)return;POINTERSTATE.touch.scrollDecided=!0;const e=firstTouchAction(t);let o=!1;const s=Math.abs(POINTERSTATE.touch.x-i.clientX),n=Math.abs(POINTERSTATE.touch.y-i.clientY);t.cancelable&&("none"===e?o=!0:"pan-x"===e?o=n>s:"pan-y"===e&&(o=s>n)),o?t.preventDefault():prevent("track")}}function addListener(t,i,e){return!!gestures[i]&&(_add(t,i,e),!0)}function _add(t,i,e){const o=gestures[i],s=o.deps,n=o.name;let r=t[GESTURE_KEY];r||(t[GESTURE_KEY]=r={});for(let i,e,o=0;o<s.length;o++)i=s[o],IS_TOUCH_ONLY&&isMouseEvent(i)&&"click"!==i||(e=r[i],e||(r[i]=e={_count:0}),0===e._count&&t.addEventListener(i,_handleNative,PASSIVE_TOUCH(i)),e[n]=(e[n]||0)+1,e._count=(e._count||0)+1);t.addEventListener(i,e),o.touchAction&&setTouchAction(t,o.touchAction)}function register(t){recognizers.push(t);for(let i=0;i<t.emits.length;i++)gestures[t.emits[i]]=t}function _findRecognizerByEvent(t){for(let i,e=0;e<recognizers.length;e++){i=recognizers[e];for(let e,o=0;o<i.emits.length;o++)if(e=i.emits[o],e===t)return i}return null}function setTouchAction(t,i){HAS_NATIVE_TA&&t instanceof HTMLElement&&microTask.run((()=>{t.style.touchAction=i})),t[TOUCH_ACTION]=i}function _fire(t,i,e){const o=new Event(i,{bubbles:!0,cancelable:!0,composed:!0});if(o.detail=e,wrap(t).dispatchEvent(o),o.defaultPrevented){const t=e.preventer||e.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function prevent(t){const i=_findRecognizerByEvent(t);i.info&&(i.info.prevent=!0)}function downupFire(t,i,e,o){i&&_fire(i,t,{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:o,prevent:t=>prevent(t)})}function trackHasMovedEnough(t,i,e){if(t.prevent)return!1;if(t.started)return!0;const o=Math.abs(t.x-i),s=Math.abs(t.y-e);return o>=TRACK_DISTANCE||s>=TRACK_DISTANCE}function trackFire(t,i,e){if(!i)return;const o=t.moves[t.moves.length-2],s=t.moves[t.moves.length-1],n=s.x-t.x,r=s.y-t.y;let a,I=0;o&&(a=s.x-o.x,I=s.y-o.y),_fire(i,"track",{state:t.state,x:e.clientX,y:e.clientY,dx:n,dy:r,ddx:a,ddy:I,sourceEvent:e,hover:()=>deepTargetFind(e.clientX,e.clientY)})}function trackForward(t,i,e){const o=Math.abs(i.clientX-t.x),s=Math.abs(i.clientY-t.y),n=_findOriginalTarget(e||i);!n||canBeDisabled[n.localName]&&n.hasAttribute("disabled")||(isNaN(o)||isNaN(s)||o<=TAP_DISTANCE&&s<=TAP_DISTANCE||isSyntheticClick(i))&&(t.prevent||_fire(n,"tap",{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:e}))}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */register({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){untrackDocument(this.info)},mousedown(t){if(!hasLeftMouseButton(t))return;const i=_findOriginalTarget(t),e=this;trackDocument(this.info,(t=>{hasLeftMouseButton(t)||(downupFire("up",i,t),untrackDocument(e.info))}),(t=>{hasLeftMouseButton(t)&&downupFire("up",i,t),untrackDocument(e.info)})),downupFire("down",i,t)},touchstart(t){downupFire("down",_findOriginalTarget(t),t.changedTouches[0],t)},touchend(t){downupFire("up",_findOriginalTarget(t),t.changedTouches[0],t)}}),register({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(t){this.moves.length>TRACK_LENGTH&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,untrackDocument(this.info)},mousedown(t){if(!hasLeftMouseButton(t))return;const i=_findOriginalTarget(t),e=this,o=t=>{const o=t.clientX,s=t.clientY;trackHasMovedEnough(e.info,o,s)&&(e.info.state=e.info.started?"mouseup"===t.type?"end":"track":"start","start"===e.info.state&&prevent("tap"),e.info.addMove({x:o,y:s}),hasLeftMouseButton(t)||(e.info.state="end",untrackDocument(e.info)),i&&trackFire(e.info,i,t),e.info.started=!0)};trackDocument(this.info,o,(t=>{e.info.started&&o(t),untrackDocument(e.info)})),this.info.x=t.clientX,this.info.y=t.clientY},touchstart(t){const i=t.changedTouches[0];this.info.x=i.clientX,this.info.y=i.clientY},touchmove(t){const i=_findOriginalTarget(t),e=t.changedTouches[0],o=e.clientX,s=e.clientY;trackHasMovedEnough(this.info,o,s)&&("start"===this.info.state&&prevent("tap"),this.info.addMove({x:o,y:s}),trackFire(this.info,i,e),this.info.state="track",this.info.started=!0)},touchend(t){const i=_findOriginalTarget(t),e=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:e.clientX,y:e.clientY}),trackFire(this.info,i,e))}}),register({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(t){hasLeftMouseButton(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click(t){hasLeftMouseButton(t)&&trackForward(this.info,t)},touchstart(t){const i=t.changedTouches[0];this.info.x=i.clientX,this.info.y=i.clientY},touchend(t){trackForward(this.info,t.changedTouches[0],t)}});const KeyboardMixin=dedupingMixin((t=>class extends t{ready(){super.ready(),this.addEventListener("keydown",(t=>{this._onKeyDown(t)})),this.addEventListener("keyup",(t=>{this._onKeyUp(t)}))}_onKeyDown(t){switch(t.key){case"Enter":this._onEnter(t);break;case"Escape":this._onEscape(t)}}_onKeyUp(t){}_onEnter(t){}_onEscape(t){}})),ActiveMixin=t=>class extends(DisabledMixin(KeyboardMixin(t))){get _activeKeys(){return[" "]}ready(){super.ready(),addListener(this,"down",(t=>{this._shouldSetActive(t)&&this._setActive(!0)})),addListener(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(t){return!this.disabled}_onKeyDown(t){super._onKeyDown(t),this._shouldSetActive(t)&&this._activeKeys.includes(t.key)&&(this._setActive(!0),document.addEventListener("keyup",(t=>{this._activeKeys.includes(t.key)&&this._setActive(!1)}),{once:!0}))}_setActive(t){this.toggleAttribute("active",t)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ControllerMixin=dedupingMixin((t=>class extends t{constructor(){super(),this.Jt=new Set}connectedCallback(){super.connectedCallback(),this.Jt.forEach((t=>{t.hostConnected&&t.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.Jt.forEach((t=>{t.hostDisconnected&&t.hostDisconnected()}))}addController(t){this.Jt.add(t),void 0!==this.$&&this.isConnected&&t.hostConnected&&t.hostConnected()}removeController(t){this.Jt.delete(t)}})),DEV_MODE_CODE_REGEXP=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,FlowClients=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function isMinified(){return uncommentAndRun((function(){return!0}))}function isDevelopmentMode(){try{return!!isForcedDevelopmentMode()||!!isLocalhost()&&(FlowClients?!isFlowProductionMode():!isMinified())}catch(t){return!1}}function isForcedDevelopmentMode(){return localStorage.getItem("vaadin.developmentmode.force")}function isLocalhost(){return["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0}function isFlowProductionMode(){if(FlowClients){if(Object.keys(FlowClients).map((t=>FlowClients[t])).filter((t=>t.productionMode)).length>0)return!0}return!1}function uncommentAndRun(t,i){if("function"!=typeof t)return;const e=DEV_MODE_CODE_REGEXP.exec(t.toString());if(e)try{t=new Function(e[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(i)}window.Vaadin=window.Vaadin||{};const runIfDevelopmentMode=function(t,i){if(window.Vaadin.developmentMode)return uncommentAndRun(t,i)};function maybeGatherAndSendStats(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=isDevelopmentMode());const usageStatistics=function(){if("function"==typeof runIfDevelopmentMode)return runIfDevelopmentMode(maybeGatherAndSendStats)};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/class Debouncer{static debounce(t,i,e){return t instanceof Debouncer?t._cancelAsync():t=new Debouncer,t.setConfig(i,e),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,i){this._asyncModule=t,this._callback=i,this._timer=this._asyncModule.run((()=>{this._timer=null,debouncerQueue.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),debouncerQueue.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}let debouncerQueue=new Set;function enqueueDebouncer(t){debouncerQueue.add(t)}function flushDebouncers(){const t=Boolean(debouncerQueue.size);return debouncerQueue.forEach((t=>{try{t.flush()}catch(t){setTimeout((()=>{throw t}))}})),t}const flush=()=>{let t;do{t=flushDebouncers()}while(t)};
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class DirHelper{static detectScrollType(){const t=document.createElement("div");t.textContent="ABCD",t.dir="rtl",t.style.fontSize="14px",t.style.width="4px",t.style.height="1px",t.style.position="absolute",t.style.top="-1000px",t.style.overflow="scroll",document.body.appendChild(t);let i="reverse";return t.scrollLeft>0?i="default":(t.scrollLeft=2,t.scrollLeft<2&&(i="negative")),document.body.removeChild(t),i}static getNormalizedScrollLeft(t,i,e){const{scrollLeft:o}=e;if("rtl"!==i||!t)return o;switch(t){case"negative":return e.scrollWidth-e.clientWidth+o;case"reverse":return e.scrollWidth-e.clientWidth-o;default:return o}}static setNormalizedScrollLeft(t,i,e,o){if("rtl"===i&&t)switch(t){case"negative":e.scrollLeft=e.clientWidth-e.scrollWidth+o;break;case"reverse":e.scrollLeft=e.scrollWidth-e.clientWidth-o;break;default:e.scrollLeft=o}else e.scrollLeft=o}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const directionSubscribers=[];function directionUpdater(){const t=getDocumentDir();directionSubscribers.forEach((i=>{alignDirs(i,t)}))}let scrollType;const directionObserver=new MutationObserver(directionUpdater);function alignDirs(t,i,e=t.getAttribute("dir")){i?t.setAttribute("dir",i):null!=e&&t.removeAttribute("dir")}function getDocumentDir(){return document.documentElement.getAttribute("dir")}directionObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const DirMixin=t=>class extends t{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:t=>t||"",toAttribute:t=>""===t?null:t}}}}static finalize(){super.finalize(),scrollType||(scrollType=DirHelper.detectScrollType())}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.Ut||(this.Pt(),alignDirs(this,getDocumentDir(),null))}attributeChangedCallback(t,i,e){if(super.attributeChangedCallback(t,i,e),"dir"!==t)return;const o=getDocumentDir(),s=e===o&&-1===directionSubscribers.indexOf(this),n=!e&&i&&-1===directionSubscribers.indexOf(this),r=e!==o&&i===o;s||n?(this.Pt(),alignDirs(this,o,e)):r&&this.Vt()}disconnectedCallback(){super.disconnectedCallback(),this.Ut=directionSubscribers.includes(this),this.Vt()}_valueToNodeAttribute(t,i,e){("dir"!==e||""!==i||t.hasAttribute("dir"))&&super._valueToNodeAttribute(t,i,e)}_attributeToProperty(t,i,e){"dir"!==t||i?super._attributeToProperty(t,i,e):this.dir=""}Pt(){directionSubscribers.includes(this)||directionSubscribers.push(this)}Vt(){directionSubscribers.includes(this)&&directionSubscribers.splice(directionSubscribers.indexOf(this),1)}Qt(t){return DirHelper.getNormalizedScrollLeft(scrollType,this.getAttribute("dir")||"ltr",t)}Et(t,i){return DirHelper.setNormalizedScrollLeft(scrollType,this.getAttribute("dir")||"ltr",t,i)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let statsJob;window.Vaadin=window.Vaadin||{},window.Vaadin.registrations=window.Vaadin.registrations||[],window.Vaadin.developmentModeCallback=window.Vaadin.developmentModeCallback||{},window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){usageStatistics()};const registered=new Set,ElementMixin=t=>class extends(DirMixin(t)){static get version(){return"23.3.30"}static finalize(){super.finalize();const{is:t}=this;t&&!registered.has(t)&&(window.Vaadin.registrations.push(this),registered.add(t),window.Vaadin.developmentModeCallback&&(statsJob=Debouncer.debounce(statsJob,idlePeriod,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),enqueueDebouncer(statsJob)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let uniqueId=0;function generateUniqueId(){return uniqueId++}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class SlotController extends EventTarget{static generateId(t,i){return`${t||"default"}-${i.localName}-${generateUniqueId()}`}constructor(t,i,e,o,s){super(),this.host=t,this.slotName=i,this.slotFactory=e,this.slotInitializer=o,s&&(this.defaultId=SlotController.generateId(i,t))}hostConnected(){if(!this.initialized){let t=this.getSlotChild();t?(this.node=t,this.initCustomNode(t)):t=this.attachDefaultNode(),this.initNode(t),this.observe(),this.initialized=!0}}attachDefaultNode(){const{host:t,slotName:i,slotFactory:e}=this;let o=this.defaultNode;return!o&&e&&(o=e(t),o instanceof Element&&(""!==i&&o.setAttribute("slot",i),this.node=o,this.defaultNode=o)),o&&t.appendChild(o),o}getSlotChild(){const{slotName:t}=this;return Array.from(this.host.childNodes).find((i=>i.nodeType===Node.ELEMENT_NODE&&i.slot===t||i.nodeType===Node.TEXT_NODE&&i.textContent.trim()&&""===t))}initNode(t){const{slotInitializer:i}=this;i&&i(this.host,t)}initCustomNode(t){}teardownNode(t){}observe(){const{slotName:t}=this,i=""===t?"slot:not([name])":`slot[name=${t}]`,e=this.host.shadowRoot.querySelector(i);this.Kt=new FlattenedNodesObserver(e,(t=>{const i=this.node,e=t.addedNodes.find((t=>t!==i));t.removedNodes.length&&t.removedNodes.forEach((t=>{this.teardownNode(t)})),e&&(i&&i.isConnected&&this.host.removeChild(i),this.node=e,e!==this.defaultNode&&(this.initCustomNode(e),this.initNode(e)))}))}}
/**
 * @license
 * Copyright (c) 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class TooltipController extends SlotController{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,void 0!==this.context&&(t.context=this.context),void 0!==this.manual&&(t.manual=this.manual),void 0!==this.opened&&(t.opened=this.opened),void 0!==this.position&&(t._position=this.position),void 0!==this.shouldShow&&(t.shouldShow=this.shouldShow)}setContext(t){this.context=t;const i=this.node;i&&(i.context=t)}setManual(t){this.manual=t;const i=this.node;i&&(i.manual=t)}setOpened(t){this.opened=t;const i=this.node;i&&(i.opened=t)}setPosition(t){this.position=t;const i=this.node;i&&(i._position=t)}setShouldShow(t){this.shouldShow=t;const i=this.node;i&&(i.shouldShow=t)}setTarget(t){this.target=t;const i=this.node;i&&(i.target=t)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let keyboardActive=!1;function isKeyboardActive(){return keyboardActive}function isElementHiddenDirectly(t){const i=t.style;if("hidden"===i.visibility||"none"===i.display)return!0;const e=window.getComputedStyle(t);return"hidden"===e.visibility||"none"===e.display}function isElementHidden(t){return null===t.offsetParent&&0===t.clientWidth&&0===t.clientHeight||isElementHiddenDirectly(t)}function isElementFocused(t){return t.getRootNode().activeElement===t}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */window.addEventListener("keydown",(()=>{keyboardActive=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{keyboardActive=!1}),{capture:!0});const DelegateStateMixin=dedupingMixin((t=>class extends t{static get properties(){return{stateTarget:{type:Object,observer:"_stateTargetChanged"}}}static get delegateAttrs(){return[]}static get delegateProps(){return[]}ready(){super.ready(),this._createDelegateAttrsObserver(),this._createDelegatePropsObserver()}_stateTargetChanged(t){t&&(this._ensureAttrsDelegated(),this._ensurePropsDelegated())}_createDelegateAttrsObserver(){this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(", ")})`)}_createDelegatePropsObserver(){this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(", ")})`)}_ensureAttrsDelegated(){this.constructor.delegateAttrs.forEach((t=>{this._delegateAttribute(t,this[t])}))}_ensurePropsDelegated(){this.constructor.delegateProps.forEach((t=>{this._delegateProperty(t,this[t])}))}_delegateAttrsChanged(...t){this.constructor.delegateAttrs.forEach(((i,e)=>{this._delegateAttribute(i,t[e])}))}_delegatePropsChanged(...t){this.constructor.delegateProps.forEach(((i,e)=>{this._delegateProperty(i,t[e])}))}_delegateAttribute(t,i){this.stateTarget&&("invalid"===t&&this._delegateAttribute("aria-invalid",!!i&&"true"),"boolean"==typeof i?this.stateTarget.toggleAttribute(t,i):i?this.stateTarget.setAttribute(t,i):this.stateTarget.removeAttribute(t))}_delegateProperty(t,i){this.stateTarget&&(this.stateTarget[t]=i)}})),InputMixin=dedupingMixin((t=>class extends t{static get properties(){return{inputElement:{type:Object,readOnly:!0,observer:"_inputElementChanged"},type:{type:String,readOnly:!0},value:{type:String,value:"",observer:"_valueChanged",notify:!0},_hasInputValue:{type:Boolean,value:!1,observer:"_hasInputValueChanged"}}}constructor(){super(),this._boundOnInput=this.Ft.bind(this),this._boundOnChange=this._onChange.bind(this)}clear(){this.value=""}_addInputListeners(t){t.addEventListener("input",this._boundOnInput),t.addEventListener("change",this._boundOnChange)}_removeInputListeners(t){t.removeEventListener("input",this._boundOnInput),t.removeEventListener("change",this._boundOnChange)}_forwardInputValue(t){this.inputElement&&(this.inputElement.value=null!=t?t:"")}_inputElementChanged(t,i){t?this._addInputListeners(t):i&&this._removeInputListeners(i)}_hasInputValueChanged(t,i){(t||i)&&this.dispatchEvent(new CustomEvent("has-input-value-changed"))}Ft(t){this._setHasInputValue(t),this._onInput(t)}_onInput(t){const i=t.composedPath()[0];this._t=t.isTrusted,this.value=i.value,this._t=!1}_onChange(t){}_toggleHasValue(t){this.toggleAttribute("has-value",t)}_valueChanged(t,i){this._toggleHasValue(this._hasValue),""===t&&void 0===i||this._t||this._forwardInputValue(t)}get _hasValue(){return null!=this.value&&""!==this.value}_setHasInputValue(t){const i=t.composedPath()[0];this._hasInputValue=i.value.length>0}})),CheckedMixin=dedupingMixin((t=>class extends(DelegateStateMixin(DisabledMixin(InputMixin(t)))){static get properties(){return{checked:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0}}}static get delegateProps(){return[...super.delegateProps,"checked"]}_onChange(t){const i=t.target;this._toggleChecked(i.checked),isElementFocused(i)||i.focus()}_toggleChecked(t){this.checked=t}})),FocusMixin=dedupingMixin((t=>class extends t{get _keyboardActive(){return isKeyboardActive()}ready(){this.addEventListener("focusin",(t=>{this._shouldSetFocus(t)&&this._setFocused(!0)})),this.addEventListener("focusout",(t=>{this._shouldRemoveFocus(t)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(t){this.toggleAttribute("focused",t),this.toggleAttribute("focus-ring",t&&this._keyboardActive)}_shouldSetFocus(t){return!0}_shouldRemoveFocus(t){return!0}})),TabindexMixin=t=>class extends(DisabledMixin(t)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(t,i){super._disabledChanged(t,i),t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):i&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(t){this.disabled&&-1!==t&&(this._lastTabIndex=t,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,DelegateFocusMixin=dedupingMixin((t=>class extends(FocusMixin(TabindexMixin(t))){static get properties(){return{autofocus:{type:Boolean},focusElement:{type:Object,readOnly:!0,observer:"_focusElementChanged"},_lastTabIndex:{value:0}}}constructor(){super(),this._boundOnBlur=this._onBlur.bind(this),this._boundOnFocus=this._onFocus.bind(this)}ready(){super.ready(),this.autofocus&&!this.disabled&&requestAnimationFrame((()=>{this.focus(),this.setAttribute("focus-ring","")}))}focus(){this.focusElement&&!this.disabled&&(this.focusElement.focus(),this._setFocused(!0))}blur(){this.focusElement&&(this.focusElement.blur(),this._setFocused(!1))}click(){this.focusElement&&!this.disabled&&this.focusElement.click()}_focusElementChanged(t,i){t?(t.disabled=this.disabled,this._addFocusListeners(t),this.$t(this.tabindex)):i&&this._removeFocusListeners(i)}_addFocusListeners(t){t.addEventListener("blur",this._boundOnBlur),t.addEventListener("focus",this._boundOnFocus)}_removeFocusListeners(t){t.removeEventListener("blur",this._boundOnBlur),t.removeEventListener("focus",this._boundOnFocus)}_onFocus(t){t.stopPropagation(),this.dispatchEvent(new Event("focus"))}_onBlur(t){t.stopPropagation(),this.dispatchEvent(new Event("blur"))}_shouldSetFocus(t){return t.target===this.focusElement}_disabledChanged(t,i){super._disabledChanged(t,i),this.focusElement&&(this.focusElement.disabled=t),t&&this.blur()}_tabindexChanged(t){this.$t(t)}$t(t){void 0!==t&&this.focusElement&&(this.focusElement.tabIndex=t,-1!==t&&(this.tabindex=void 0)),this.disabled&&t&&(-1!==t&&(this._lastTabIndex=t),this.tabindex=void 0)}}));
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
class InputController extends SlotController{constructor(t,i){super(t,"input",(()=>document.createElement("input")),((t,e)=>{t.value&&(e.value=t.value),t.type&&e.setAttribute("type",t.type),e.id=this.defaultId,"function"==typeof i&&i(e)}),!0)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class LabelController extends SlotController{constructor(t){super(t,"label",(()=>document.createElement("label")),((t,i)=>{this.qt(i),this.ti(this.label),this.ii(i)}),!0)}get labelId(){return this.node.id}initCustomNode(t){this.qt(t);const i=this.ei(t);this.oi(i)}teardownNode(t){this.si&&this.si.disconnect();let i=this.getSlotChild();i||t===this.defaultNode||(i=this.attachDefaultNode(),this.initNode(i));const e=this.ei(i);this.oi(e)}setLabel(t){this.label=t,this.ti(t)}ei(t){return!!t&&(t.children.length>0||this.ni(t.textContent))}ni(t){return Boolean(t&&""!==t.trim())}ii(t){this.si=new MutationObserver((t=>{t.forEach((t=>{const i=t.target,e=i===this.node;if("attributes"===t.type)e&&i.id!==this.defaultId&&this.qt(i);else if(e||i.parentElement===this.node){const t=this.ei(this.node);this.oi(t)}}))})),this.si.observe(t,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}oi(t){this.host.toggleAttribute("has-label",t),this.dispatchEvent(new CustomEvent("label-changed",{detail:{hasLabel:t,node:this.node}}))}ti(t){if(this.defaultNode&&(this.defaultNode.textContent=t,this.defaultNode===this.node)){const i=this.ni(t);this.oi(i)}}qt(t){t.id||(t.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const LabelMixin=dedupingMixin((t=>class extends(ControllerMixin(t)){static get properties(){return{label:{type:String,observer:"_labelChanged"}}}get _labelId(){return this._labelController.labelId}get _labelNode(){return this._labelController.node}constructor(){super(),this._labelController=new LabelController(this)}ready(){super.ready(),this.addController(this._labelController)}_labelChanged(t){this._labelController.setLabel(t)}}));
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class LabelledInputController{constructor(t,i){this.input=t,this.ri=this.ri.bind(this),i.addEventListener("label-changed",(t=>{this.ai(t.detail.node)})),this.ai(i.node)}ai(t){t&&(t.addEventListener("click",this.ri),this.input&&t.setAttribute("for",this.input.id))}ri(){const t=i=>{i.stopImmediatePropagation(),this.input.removeEventListener("click",t)};this.input.addEventListener("click",t)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class SlotTargetController{constructor(t,i,e){this.sourceSlot=t,this.targetFactory=i,this.copyCallback=e,t&&t.addEventListener("slotchange",(()=>{this.Ii?this.Ii=!1:this.gi()}))}hostConnected(){this.li=new MutationObserver((()=>this.gi())),this.Ii||this.gi()}gi(){this.li.disconnect();const t=this.targetFactory();if(!t)return;this.ci&&(this.ci.forEach((i=>{i.parentElement===t&&t.removeChild(i)})),delete this.ci);const i=this.sourceSlot.assignedNodes({flatten:!0}).filter((t=>!(t.nodeType===Node.TEXT_NODE&&""===t.textContent.trim())));i.length>0&&(t.innerHTML="",this.Ii=!0,this.di(i,t))}di(t,i){this.ci=this.ci||[],t.forEach((t=>{const e=t.cloneNode(!0);this.ci.push(e),i.appendChild(e),this.li.observe(t,{attributes:!0,childList:!0,subtree:!0,characterData:!0})})),"function"==typeof this.copyCallback&&this.copyCallback(t)}}
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
    `}static get properties(){return{indeterminate:{type:Boolean,notify:!0,value:!1,reflectToAttribute:!0},name:{type:String,value:""}}}static get delegateProps(){return[...super.delegateProps,"indeterminate"]}static get delegateAttrs(){return[...super.delegateAttrs,"name"]}constructor(){super(),this._setType("checkbox"),this.value="on"}ready(){super.ready(),this.addController(new InputController(this,(t=>{this._setInputElement(t),this._setFocusElement(t),this.stateTarget=t,this.ariaTarget=t}))),this.addController(new LabelledInputController(this.inputElement,this._labelController)),this.addController(new SlotTargetController(this.$.noop,(()=>this._labelController.node),(()=>this.hi()))),this._tooltipController=new TooltipController(this),this.addController(this._tooltipController)}hi(){console.warn('WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.\nPlease use <label slot="label"> wrapper or the label property instead.')}_shouldSetActive(t){return"a"!==t.target.localName&&super._shouldSetActive(t)}_toggleChecked(t){this.indeterminate&&(this.indeterminate=!1),super._toggleChecked(t)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function processTemplates(t){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(t):t.querySelector("template")&&console.warn(`WARNING: <template> inside <${t.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
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
  `,{moduleId:"lumo-grid"});const ColumnBaseMixin=t=>class extends t{static get properties(){return{resizable:{type:Boolean,value(){if("vaadin-grid-column-group"===this.localName)return;const t=this.parentNode;return t&&"vaadin-grid-column-group"===t.localName&&t.resizable||!1}},frozen:{type:Boolean,value:!1},frozenToEnd:{type:Boolean,value:!1},hidden:{type:Boolean,value:!1},header:{type:String},textAlign:{type:String},_lastFrozen:{type:Boolean,value:!1},_firstFrozenToEnd:{type:Boolean,value:!1},_order:Number,_reorderStatus:Boolean,_emptyCells:Array,_headerCell:Object,_footerCell:Object,_grid:Object,Ci:{type:Boolean,value:!0},headerRenderer:Function,_headerRenderer:{type:Function,computed:"_computeHeaderRenderer(headerRenderer, header, __initialized)"},footerRenderer:Function,_footerRenderer:{type:Function,computed:"_computeFooterRenderer(footerRenderer, __initialized)"},Ai:{type:Boolean,value:!0}}}static get observers(){return["_widthChanged(width, _headerCell, _footerCell, _cells.*)","_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)","_frozenToEndChanged(frozenToEnd, _headerCell, _footerCell, _cells.*)","_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)","_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)","_orderChanged(_order, _headerCell, _footerCell, _cells.*)","_lastFrozenChanged(_lastFrozen)","_firstFrozenToEndChanged(_firstFrozenToEnd)","_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)","_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)","_resizableChanged(resizable, _headerCell)","_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)","_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)"]}connectedCallback(){super.connectedCallback(),requestAnimationFrame((()=>{this._grid&&this._allCells.forEach((t=>{t._content.parentNode||this._grid.appendChild(t._content)}))}))}disconnectedCallback(){super.disconnectedCallback(),requestAnimationFrame((()=>{this._grid||this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)}))})),this._gridValue=void 0}ready(){super.ready(),processTemplates(this)}_findHostGrid(){let t=this;for(;t&&!/^vaadin.*grid(-pro)?$/.test(t.localName);)t=t.assignedSlot?t.assignedSlot.parentNode:t.parentNode;return t||void 0}get _grid(){return this._gridValue||(this._gridValue=this._findHostGrid()),this._gridValue}get _allCells(){return[].concat(this._cells||[]).concat(this._emptyCells||[]).concat(this._headerCell).concat(this._footerCell).filter((t=>t))}_renderHeaderAndFooter(){this._renderHeaderCellContent(this._headerRenderer,this._headerCell),this._renderFooterCellContent(this._footerRenderer,this._footerCell)}_flexGrowChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("flexGrow"),this._allCells.forEach((i=>{i.style.flexGrow=t}))}_orderChanged(t){this._allCells.forEach((i=>{i.style.order=t}))}_widthChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("width"),this._allCells.forEach((i=>{i.style.width=t}))}_frozenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozen",t),this._allCells.forEach((i=>i.toggleAttribute("frozen",t))),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_frozenToEndChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("frozenToEnd",t),this._allCells.forEach((i=>{this._grid&&i.parentElement===this._grid.$.sizer||i.toggleAttribute("frozen-to-end",t)})),this._grid&&this._grid._frozenCellsChanged&&this._grid._frozenCellsChanged()}_lastFrozenChanged(t){this._allCells.forEach((i=>i.toggleAttribute("last-frozen",t))),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._lastFrozen=t)}_firstFrozenToEndChanged(t){this._allCells.forEach((i=>{this._grid&&i.parentElement===this._grid.$.sizer||i.toggleAttribute("first-frozen-to-end",t)})),this.parentElement&&this.parentElement._columnPropChanged&&(this.parentElement._firstFrozenToEnd=t)}_generateHeader(t){return t.substr(t.lastIndexOf(".")+1).replace(/([A-Z])/g,"-$1").toLowerCase().replace(/-/g," ").replace(/^./,(t=>t.toUpperCase()))}_reorderStatusChanged(t){this._allCells.forEach((i=>i.setAttribute("reorder-status",t)))}_resizableChanged(t,i){void 0!==t&&void 0!==i&&i&&[i].concat(this._emptyCells).forEach((i=>{if(i){const e=i.querySelector('[part~="resize-handle"]');if(e&&i.removeChild(e),t){const t=document.createElement("div");t.setAttribute("part","resize-handle"),i.appendChild(t)}}}))}_textAlignChanged(t){if(void 0===t||void 0===this._grid)return;if(-1===["start","end","center"].indexOf(t))return void console.warn('textAlign can only be set as "start", "end" or "center"');let i;"ltr"===getComputedStyle(this._grid).direction?"start"===t?i="left":"end"===t&&(i="right"):"start"===t?i="right":"end"===t&&(i="left"),this._allCells.forEach((e=>{e._content.style.textAlign=t,getComputedStyle(e._content).textAlign!==t&&(e._content.style.textAlign=i)}))}_hiddenChanged(t){this.parentElement&&this.parentElement._columnPropChanged&&this.parentElement._columnPropChanged("hidden",t),!!t!=!!this._previousHidden&&this._grid&&(!0===t&&this._allCells.forEach((t=>{t._content.parentNode&&t._content.parentNode.removeChild(t._content)})),this._grid._debouncerHiddenChanged=Debouncer.debounce(this._grid._debouncerHiddenChanged,animationFrame,(()=>{this._grid&&this._grid._renderColumnTree&&this._grid._renderColumnTree(this._grid._columnTree)})),this._grid._debounceUpdateFrozenColumn&&this._grid._debounceUpdateFrozenColumn(),this._grid._resetKeyboardNavigation&&this._grid._resetKeyboardNavigation()),this._previousHidden=t}_runRenderer(t,i,e){const o=[i._content,this];e&&e.item&&o.push(e),t.apply(this,o)}ui(t,i){!this.hidden&&this._grid&&i.forEach((i=>{if(!i.parentElement)return;const e=this._grid.mi(i.parentElement);t&&(i._renderer!==t&&this._clearCellContent(i),i._renderer=t,(e.item||t===this._headerRenderer||t===this._footerRenderer)&&this._runRenderer(t,i,e))}))}_clearCellContent(t){t._content.innerHTML="",delete t._content._$litPart$}_renderHeaderCellContent(t,i){i&&t&&(this.ui(t,[i]),this._grid&&i.parentElement&&this._grid.bi(i.parentElement))}_onHeaderRendererOrBindingChanged(t,i,...e){this._renderHeaderCellContent(t,i)}_renderBodyCellsContent(t,i){i&&t&&this.ui(t,i)}_onRendererOrBindingChanged(t,i,...e){this._renderBodyCellsContent(t,i)}_renderFooterCellContent(t,i){i&&t&&(this.ui(t,[i]),this._grid&&i.parentElement&&this._grid.bi(i.parentElement))}_onFooterRendererOrBindingChanged(t,i){this._renderFooterCellContent(t,i)}pi(t,i){t.textContent!==i&&(t.textContent=i)}Zi(){this.pi(this._headerCell._content,this.header)}_defaultHeaderRenderer(){this.path&&this.pi(this._headerCell._content,this._generateHeader(this.path))}_defaultRenderer(t,i,{item:e}){this.path&&this.pi(t,this.get(this.path,e))}_defaultFooterRenderer(){}_computeHeaderRenderer(t,i){return t||(null!=i?this.Zi:this._defaultHeaderRenderer)}_computeRenderer(t){return t||this._defaultRenderer}_computeFooterRenderer(t){return t||this._defaultFooterRenderer}};class GridColumn extends(ColumnBaseMixin(DirMixin(PolymerElement))){static get is(){return"vaadin-grid-column"}static get properties(){return{width:{type:String,value:"100px"},flexGrow:{type:Number,value:1},renderer:Function,_renderer:{type:Function,computed:"_computeRenderer(renderer, __initialized)"},path:{type:String},autoWidth:{type:Boolean,value:!1},_focusButtonMode:{type:Boolean,value:!1},_cells:Array}}}customElements.define(GridColumn.is,GridColumn),
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
let scheduled=!1,beforeRenderQueue=[],afterRenderQueue=[];function schedule(){scheduled=!0,requestAnimationFrame((function(){scheduled=!1,flushQueue(beforeRenderQueue),setTimeout((function(){runQueue(afterRenderQueue)}))}))}function flushQueue(t){for(;t.length;)callMethod(t.shift())}function runQueue(t){for(let i=0,e=t.length;i<e;i++)callMethod(t.shift())}function callMethod(t){const i=t[0],e=t[1],o=t[2];try{e.apply(i,o)}catch(t){setTimeout((()=>{throw t}))}}function beforeNextRender(t,i,e){scheduled||schedule(),beforeRenderQueue.push([t,i,e])}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const testUserAgent=t=>t.test(navigator.userAgent),testPlatform=t=>t.test(navigator.platform),testVendor=t=>t.test(navigator.vendor),isAndroid=testUserAgent(/Android/),isChrome=testUserAgent(/Chrome/)&&testVendor(/Google Inc/),isFirefox=testUserAgent(/Firefox/),isIPad=testPlatform(/^iPad/)||testPlatform(/^Mac/)&&navigator.maxTouchPoints>1,isIPhone=testPlatform(/^iPhone/),isIOS=isIPhone||isIPad,isSafari=testUserAgent(/^((?!chrome|android).)*safari/i),isTouch=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(t){return!1}})(),IOS=navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/),IOS_TOUCH_SCROLLING=IOS&&IOS[1]>=8,DEFAULT_PHYSICAL_COUNT=3,ironList={_ratio:.5,_scrollerPaddingTop:0,_scrollPosition:0,_physicalSize:0,_physicalAverage:0,_physicalAverageCount:0,_physicalTop:0,_virtualCount:0,_estScrollHeight:0,_scrollHeight:0,_viewportHeight:0,_viewportWidth:0,_physicalItems:null,_physicalSizes:null,_firstVisibleIndexVal:null,_lastVisibleIndexVal:null,_maxPages:2,_templateCost:0,get _physicalBottom(){return this._physicalTop+this._physicalSize},get _scrollBottom(){return this._scrollPosition+this._viewportHeight},get _virtualEnd(){return this._virtualStart+this._physicalCount-1},get _hiddenContentSize(){return this._physicalSize-this._viewportHeight},get _maxScrollTop(){return this._estScrollHeight-this._viewportHeight+this._scrollOffset},get _maxVirtualStart(){const t=this._virtualCount;return Math.max(0,t-this._physicalCount)},get _virtualStart(){return this._virtualStartVal||0},set _virtualStart(t){t=this._clamp(t,0,this._maxVirtualStart),this._virtualStartVal=t},get _physicalStart(){return this._physicalStartVal||0},set _physicalStart(t){(t%=this._physicalCount)<0&&(t=this._physicalCount+t),this._physicalStartVal=t},get _physicalEnd(){return(this._physicalStart+this._physicalCount-1)%this._physicalCount},get _physicalCount(){return this._physicalCountVal||0},set _physicalCount(t){this._physicalCountVal=t},get _optPhysicalSize(){return 0===this._viewportHeight?1/0:this._viewportHeight*this._maxPages},get _isVisible(){return Boolean(this.offsetWidth||this.offsetHeight)},get firstVisibleIndex(){let t=this._firstVisibleIndexVal;if(null==t){let i=this._physicalTop+this._scrollOffset;t=this._iterateItems(((t,e)=>{if(i+=this._getPhysicalSizeIncrement(t),i>this._scrollPosition)return e}))||0,this._firstVisibleIndexVal=t}return t},get lastVisibleIndex(){let t=this._lastVisibleIndexVal;if(null==t){let i=this._physicalTop+this._scrollOffset;this._iterateItems(((e,o)=>{i<this._scrollBottom&&(t=o),i+=this._getPhysicalSizeIncrement(e)})),this._lastVisibleIndexVal=t}return t},get _scrollOffset(){return this._scrollerPaddingTop+this.scrollOffset},_scrollHandler(){const t=Math.max(0,Math.min(this._maxScrollTop,this._scrollTop));let i=t-this._scrollPosition;const e=i>=0;if(this._scrollPosition=t,this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,Math.abs(i)>this._physicalSize&&this._physicalSize>0){i-=this._scrollOffset;const t=Math.round(i/this._physicalAverage);this._virtualStart+=t,this._physicalStart+=t,this._physicalTop=Math.min(Math.floor(this._virtualStart)*this._physicalAverage,this._scrollPosition),this._update()}else if(this._physicalCount>0){const t=this._getReusables(e);e?(this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length):(this._virtualStart-=t.indexes.length,this._physicalStart-=t.indexes.length),this._update(t.indexes,e?null:t.indexes),this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,0),microTask)}},_getReusables(t){let i,e,o;const s=[],n=this._hiddenContentSize*this._ratio,r=this._virtualStart,a=this._virtualEnd,I=this._physicalCount;let g=this._physicalTop+this._scrollOffset;const l=this._physicalBottom+this._scrollOffset,c=this._scrollPosition,d=this._scrollBottom;for(t?(i=this._physicalStart,e=c-g):(i=this._physicalEnd,e=l-d);o=this._getPhysicalSizeIncrement(i),e-=o,!(s.length>=I||e<=n);)if(t){if(a+s.length+1>=this._virtualCount)break;if(g+o>=c-this._scrollOffset)break;s.push(i),g+=o,i=(i+1)%I}else{if(r-s.length<=0)break;if(g+this._physicalSize-o<=d)break;s.push(i),g-=o,i=0===i?I-1:i-1}return{indexes:s,physicalTop:g-this._scrollOffset}},_update(t,i){if(!(t&&0===t.length||0===this._physicalCount)){if(this._assignModels(t),this._updateMetrics(t),i)for(;i.length;){const t=i.pop();this._physicalTop-=this._getPhysicalSizeIncrement(t)}this._positionItems(),this._updateScrollerSize()}},_isClientFull(){return 0!==this._scrollBottom&&this._physicalBottom-1>=this._scrollBottom&&this._physicalTop<=this._scrollPosition},_increasePoolIfNeeded(t){const i=this._clamp(this._physicalCount+t,DEFAULT_PHYSICAL_COUNT,this._virtualCount-this._virtualStart)-this._physicalCount;let e=Math.round(.5*this._physicalCount);if(!(i<0)){if(i>0){const t=window.performance.now();[].push.apply(this._physicalItems,this._createPool(i));for(let t=0;t<i;t++)this._physicalSizes.push(0);this._physicalCount+=i,this._physicalStart>this._physicalEnd&&this._isIndexRendered(this._focusedVirtualIndex)&&this._getPhysicalIndex(this._focusedVirtualIndex)<this._physicalEnd&&(this._physicalStart+=i),this._update(),this._templateCost=(window.performance.now()-t)/i,e=Math.round(.5*this._physicalCount)}this._virtualEnd>=this._virtualCount-1||0===e||(this._isClientFull()?this._physicalSize<this._optPhysicalSize&&this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,this._clamp(Math.round(50/this._templateCost),1,e)),idlePeriod):this._debounce("_increasePoolIfNeeded",this._increasePoolIfNeeded.bind(this,e),microTask))}},_render(){if(this.isAttached&&this._isVisible)if(0!==this._physicalCount){const t=this._getReusables(!0);this._physicalTop=t.physicalTop,this._virtualStart+=t.indexes.length,this._physicalStart+=t.indexes.length,this._update(t.indexes),this._update(),this._increasePoolIfNeeded(0)}else this._virtualCount>0&&(this.updateViewportBoundaries(),this._increasePoolIfNeeded(DEFAULT_PHYSICAL_COUNT))},_itemsChanged(t){"items"===t.path&&(this._virtualStart=0,this._physicalTop=0,this._virtualCount=this.items?this.items.length:0,this._physicalIndexForKey={},this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._physicalCount=this._physicalCount||0,this._physicalItems=this._physicalItems||[],this._physicalSizes=this._physicalSizes||[],this._physicalStart=0,this._scrollTop>this._scrollOffset&&this._resetScrollPosition(0),this._debounce("_render",this._render,animationFrame))},_iterateItems(t,i){let e,o,s,n;if(2===arguments.length&&i){for(n=0;n<i.length;n++)if(e=i[n],o=this._computeVidx(e),null!=(s=t.call(this,e,o)))return s}else{for(e=this._physicalStart,o=this._virtualStart;e<this._physicalCount;e++,o++)if(null!=(s=t.call(this,e,o)))return s;for(e=0;e<this._physicalStart;e++,o++)if(null!=(s=t.call(this,e,o)))return s}},_computeVidx(t){return t>=this._physicalStart?this._virtualStart+(t-this._physicalStart):this._virtualStart+(this._physicalCount-this._physicalStart)+t},_positionItems(){this._adjustScrollPosition();let t=this._physicalTop;this._iterateItems((i=>{this.translate3d(0,`${t}px`,0,this._physicalItems[i]),t+=this._physicalSizes[i]}))},_getPhysicalSizeIncrement(t){return this._physicalSizes[t]},_adjustScrollPosition(){const t=0===this._virtualStart?this._physicalTop:Math.min(this._scrollPosition+this._physicalTop,0);if(0!==t){this._physicalTop-=t;const i=this._scrollPosition;!IOS_TOUCH_SCROLLING&&i>0&&this._resetScrollPosition(i-t)}},_resetScrollPosition(t){this.scrollTarget&&t>=0&&(this._scrollTop=t,this._scrollPosition=this._scrollTop)},_updateScrollerSize(t){this._estScrollHeight=this._physicalBottom+Math.max(this._virtualCount-this._physicalCount-this._virtualStart,0)*this._physicalAverage,((t=(t=t||0===this._scrollHeight)||this._scrollPosition>=this._estScrollHeight-this._physicalSize)||Math.abs(this._estScrollHeight-this._scrollHeight)>=this._viewportHeight)&&(this.$.items.style.height=`${this._estScrollHeight}px`,this._scrollHeight=this._estScrollHeight)},scrollToIndex(t){if("number"!=typeof t||t<0||t>this.items.length-1)return;if(flush(),0===this._physicalCount)return;t=this._clamp(t,0,this._virtualCount-1),(!this._isIndexRendered(t)||t>=this._maxVirtualStart)&&(this._virtualStart=t-1),this._assignModels(),this._updateMetrics(),this._physicalTop=this._virtualStart*this._physicalAverage;let i=this._physicalStart,e=this._virtualStart,o=0;const s=this._hiddenContentSize;for(;e<t&&o<=s;)o+=this._getPhysicalSizeIncrement(i),i=(i+1)%this._physicalCount,e+=1;this._updateScrollerSize(!0),this._positionItems(),this._resetScrollPosition(this._physicalTop+this._scrollOffset+o),this._increasePoolIfNeeded(0),this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null},_resetAverage(){this._physicalAverage=0,this._physicalAverageCount=0},_resizeHandler(){this._debounce("_render",(()=>{this._firstVisibleIndexVal=null,this._lastVisibleIndexVal=null,this._isVisible?(this.updateViewportBoundaries(),this.toggleScrollListener(!0),this._resetAverage(),this._render()):this.toggleScrollListener(!1)}),animationFrame)},_isIndexRendered(t){return t>=this._virtualStart&&t<=this._virtualEnd},_getPhysicalIndex(t){return(this._physicalStart+(t-this._virtualStart))%this._physicalCount},_clamp:(t,i,e)=>Math.min(e,Math.max(i,t)),_debounce(t,i,e){this._debouncers=this._debouncers||{},this._debouncers[t]=Debouncer.debounce(this._debouncers[t],e,i.bind(this)),enqueueDebouncer(this._debouncers[t])}},MAX_VIRTUAL_COUNT=1e5,OFFSET_ADJUST_MIN_THRESHOLD=1e3;class IronListAdapter{constructor({createElements:t,updateElement:i,scrollTarget:e,scrollContainer:o,elementsContainer:s,reorderElements:n}){this.isAttached=!0,this._vidxOffset=0,this.createElements=t,this.updateElement=i,this.scrollTarget=e,this.scrollContainer=o,this.elementsContainer=s||o,this.reorderElements=n,this._maxPages=1.3,this.Mi=200,this.Ni=Array(10),this.timeouts={SCROLL_REORDER:500,IGNORE_WHEEL:500,FIX_INVALID_ITEM_POSITIONING:100},this.vi=new ResizeObserver((()=>this._resizeHandler())),"visible"===getComputedStyle(this.scrollTarget).overflow&&(this.scrollTarget.style.overflow="auto"),"static"===getComputedStyle(this.scrollContainer).position&&(this.scrollContainer.style.position="relative"),this.vi.observe(this.scrollTarget),this.scrollTarget.addEventListener("scroll",(()=>this._scrollHandler())),this._scrollLineHeight=this._getScrollLineHeight(),this.scrollTarget.addEventListener("wheel",(t=>this.yi(t))),this.reorderElements&&(this.scrollTarget.addEventListener("mousedown",(()=>{this.ji=!0})),this.scrollTarget.addEventListener("mouseup",(()=>{this.ji=!1,this.wi&&this.Ti()})))}get scrollOffset(){return 0}get adjustedFirstVisibleIndex(){return this.firstVisibleIndex+this._vidxOffset}get adjustedLastVisibleIndex(){return this.lastVisibleIndex+this._vidxOffset}scrollToIndex(t){if("number"!=typeof t||isNaN(t)||0===this.size||!this.scrollTarget.offsetHeight)return;t=this._clamp(t,0,this.size-1);const i=this.fi().length;let e=Math.floor(t/this.size*this._virtualCount);this._virtualCount-e<i?(e=this._virtualCount-(this.size-t),this._vidxOffset=this.size-this._virtualCount):e<i?t<OFFSET_ADJUST_MIN_THRESHOLD?(e=t,this._vidxOffset=0):(e=OFFSET_ADJUST_MIN_THRESHOLD,this._vidxOffset=t-e):this._vidxOffset=t-e,this.Oi=!0,super.scrollToIndex(e),this.adjustedFirstVisibleIndex!==t&&this._scrollTop<this._maxScrollTop&&!this.grid&&(this._scrollTop-=this.Di(t)||0),this._scrollHandler()}flush(){0!==this.scrollTarget.offsetHeight&&(this._resizeHandler(),flush(),this._scrollHandler(),this.xi&&this.xi.flush(),this.zi&&this.zi.flush(),this.Gi&&this.Gi.flush())}update(t=0,i=this.size-1){this.fi().forEach((e=>{e.ki>=t&&e.ki<=i&&this.Wi(e,e.ki,!0)}))}_updateMetrics(t){flush();let i=0,e=0;const o=this._physicalAverageCount,s=this._physicalAverage;this._iterateItems(((t,o)=>{e+=this._physicalSizes[t],this._physicalSizes[t]=Math.ceil(this.Li(this._physicalItems[t])),i+=this._physicalSizes[t],this._physicalAverageCount+=this._physicalSizes[t]?1:0}),t),this._physicalSize=this._physicalSize+i-e,this._physicalAverageCount!==o&&(this._physicalAverage=Math.round((s*o+i)/this._physicalAverageCount))}Li(t){const i=getComputedStyle(t),e=parseFloat(i.height)||0;if("border-box"===i.boxSizing)return e;return e+(parseFloat(i.paddingBottom)||0)+(parseFloat(i.paddingTop)||0)+(parseFloat(i.borderBottomWidth)||0)+(parseFloat(i.borderTopWidth)||0)}Wi(t,i,e){t.style.paddingTop&&(t.style.paddingTop=""),this.Yi||t.Si===i&&!e||(this.updateElement(t,i),t.Si=i);const o=t.offsetHeight;if(0===o)t.style.paddingTop=`${this.Mi}px`,requestAnimationFrame((()=>this._resizeHandler()));else{this.Ni.push(o),this.Ni.shift();const t=this.Ni.filter((t=>void 0!==t));this.Mi=Math.round(t.reduce(((t,i)=>t+i),0)/t.length)}}Di(t){const i=this.fi().find((i=>i.ki===t));return i?this.scrollTarget.getBoundingClientRect().top-i.getBoundingClientRect().top:void 0}get size(){return this.Ri}set size(t){if(t===this.size)return;let i,e;if(this.xi&&this.xi.cancel(),this._debouncers&&this._debouncers._increasePoolIfNeeded&&this._debouncers._increasePoolIfNeeded.cancel(),this.Yi=!0,t>0&&(i=this.adjustedFirstVisibleIndex,e=this.Di(i)),this.Ri=t,this._itemsChanged({path:"items"}),flush(),t>0){i=Math.min(i,t-1),this.scrollToIndex(i);const o=this.Di(i);void 0!==e&&void 0!==o&&(this._scrollTop+=e-o)}this.elementsContainer.children.length||requestAnimationFrame((()=>this._resizeHandler())),this.Yi=!1,this._resizeHandler(),flush()}get _scrollTop(){return this.scrollTarget.scrollTop}set _scrollTop(t){this.scrollTarget.scrollTop=t}get items(){return{length:Math.min(this.size,MAX_VIRTUAL_COUNT)}}get offsetHeight(){return this.scrollTarget.offsetHeight}get $(){return{items:this.scrollContainer}}updateViewportBoundaries(){const t=window.getComputedStyle(this.scrollTarget);this._scrollerPaddingTop=this.scrollTarget===this?0:parseInt(t["padding-top"],10),this._isRTL=Boolean("rtl"===t.direction),this._viewportWidth=this.elementsContainer.offsetWidth,this._viewportHeight=this.scrollTarget.offsetHeight,this._scrollPageHeight=this._viewportHeight-this._scrollLineHeight,this.grid&&this._updateGridMetrics()}setAttribute(){}_createPool(t){const i=this.createElements(t),e=document.createDocumentFragment();return i.forEach((t=>{t.style.position="absolute",e.appendChild(t),this.vi.observe(t)})),this.elementsContainer.appendChild(e),i}_assignModels(t){this._iterateItems(((t,i)=>{const e=this._physicalItems[t];e.hidden=i>=this.size,e.hidden?delete e.Si:(e.ki=i+(this._vidxOffset||0),this.Wi(e,e.ki))}),t)}_isClientFull(){return setTimeout((()=>{this.Hi=!0})),this.Hi||super._isClientFull()}translate3d(t,i,e,o){o.style.transform=`translateY(${i})`}toggleScrollListener(){}_scrollHandler(){if(0===this.scrollTarget.offsetHeight)return;this._adjustVirtualIndexOffset(this._scrollTop-(this.Bi||0));const t=this.scrollTarget.scrollTop-this._scrollPosition;if(super._scrollHandler(),0!==this._physicalCount){const i=t>=0,e=this._getReusables(!i);e.indexes.length&&(this._physicalTop=e.physicalTop,i?(this._virtualStart-=e.indexes.length,this._physicalStart-=e.indexes.length):(this._virtualStart+=e.indexes.length,this._physicalStart+=e.indexes.length),this._resizeHandler())}t&&(this.xi=Debouncer.debounce(this.xi,timeOut.after(this.timeouts.FIX_INVALID_ITEM_POSITIONING),(()=>this.Xi()))),this.reorderElements&&(this.zi=Debouncer.debounce(this.zi,timeOut.after(this.timeouts.SCROLL_REORDER),(()=>this.Ti()))),this.Bi=this._scrollTop,0===this._scrollTop&&0!==this.firstVisibleIndex&&Math.abs(t)>0&&this.scrollToIndex(0)}Xi(){if(!this.scrollTarget.isConnected)return;const t=this._physicalTop>this._scrollTop,i=this._physicalBottom<this._scrollBottom,e=0===this.adjustedFirstVisibleIndex,o=this.adjustedLastVisibleIndex===this.size-1;if(t&&!e||i&&!o){const t=i,e=this._ratio;this._ratio=0,this._scrollPosition=this._scrollTop+(t?-1:1),this._scrollHandler(),this._ratio=e}}yi(t){if(t.ctrlKey||this._hasScrolledAncestor(t.target,t.deltaX,t.deltaY))return;let i=t.deltaY;if(t.deltaMode===WheelEvent.DOM_DELTA_LINE?i*=this._scrollLineHeight:t.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(i*=this._scrollPageHeight),this._deltaYAcc=this._deltaYAcc||0,this._wheelAnimationFrame)return this._deltaYAcc+=i,void t.preventDefault();i+=this._deltaYAcc,this._deltaYAcc=0,this._wheelAnimationFrame=!0,this.Gi=Debouncer.debounce(this.Gi,animationFrame,(()=>{this._wheelAnimationFrame=!1}));const e=Math.abs(t.deltaX)+Math.abs(i);this._canScroll(this.scrollTarget,t.deltaX,i)?(t.preventDefault(),this.scrollTarget.scrollTop+=i,this.scrollTarget.scrollLeft+=t.deltaX,this._hasResidualMomentum=!0,this._ignoreNewWheel=!0,this._debouncerIgnoreNewWheel=Debouncer.debounce(this._debouncerIgnoreNewWheel,timeOut.after(this.timeouts.IGNORE_WHEEL),(()=>{this._ignoreNewWheel=!1}))):this._hasResidualMomentum&&e<=this._previousMomentum||this._ignoreNewWheel?t.preventDefault():e>this._previousMomentum&&(this._hasResidualMomentum=!1),this._previousMomentum=e}_hasScrolledAncestor(t,i,e){return t!==this.scrollTarget&&t!==this.scrollTarget.getRootNode().host&&(!(!this._canScroll(t,i,e)||-1===["auto","scroll"].indexOf(getComputedStyle(t).overflow))||(t!==this&&t.parentElement?this._hasScrolledAncestor(t.parentElement,i,e):void 0))}_canScroll(t,i,e){return e>0&&t.scrollTop<t.scrollHeight-t.offsetHeight||e<0&&t.scrollTop>0||i>0&&t.scrollLeft<t.scrollWidth-t.offsetWidth||i<0&&t.scrollLeft>0}_getScrollLineHeight(){const t=document.createElement("div");t.style.fontSize="initial",t.style.display="none",document.body.appendChild(t);const i=window.getComputedStyle(t).fontSize;return document.body.removeChild(t),i?window.parseInt(i):void 0}fi(){return Array.from(this.elementsContainer.children).filter((t=>!t.hidden))}Ti(){if(this.ji)return void(this.wi=!0);this.wi=!1;const t=this._virtualStart+(this._vidxOffset||0),i=this.fi(),e=i.find((t=>t.contains(this.elementsContainer.getRootNode().activeElement)||t.contains(this.scrollTarget.getRootNode().activeElement)))||i[0];if(!e)return;const o=e.ki-t,s=i.indexOf(e)-o;if(s>0)for(let t=0;t<s;t++)this.elementsContainer.appendChild(i[t]);else if(s<0)for(let t=i.length+s;t<i.length;t++)this.elementsContainer.insertBefore(i[t],i[0]);if(isSafari){const{transform:t}=this.scrollTarget.style;this.scrollTarget.style.transform="translateZ(0)",setTimeout((()=>{this.scrollTarget.style.transform=t}))}}_adjustVirtualIndexOffset(t){if(this._virtualCount>=this.size)this._vidxOffset=0;else if(this.Oi)this.Oi=!1;else if(Math.abs(t)>1e4){const t=this._scrollTop/(this.scrollTarget.scrollHeight-this.scrollTarget.offsetHeight),i=t*this.size;this._vidxOffset=Math.round(i-t*this._virtualCount)}else{const t=this._vidxOffset,i=OFFSET_ADJUST_MIN_THRESHOLD,e=100;0===this._scrollTop?(this._vidxOffset=0,t!==this._vidxOffset&&super.scrollToIndex(0)):this.firstVisibleIndex<i&&this._vidxOffset>0&&(this._vidxOffset-=Math.min(this._vidxOffset,e),super.scrollToIndex(this.firstVisibleIndex+(t-this._vidxOffset)));const o=this.size-this._virtualCount;this._scrollTop>=this._maxScrollTop&&this._maxScrollTop>0?(this._vidxOffset=o,t!==this._vidxOffset&&super.scrollToIndex(this._virtualCount-1)):this.firstVisibleIndex>this._virtualCount-i&&this._vidxOffset<o&&(this._vidxOffset+=Math.min(o-this._vidxOffset,e),super.scrollToIndex(this.firstVisibleIndex-(this._vidxOffset-t)))}}}Object.setPrototypeOf(IronListAdapter.prototype,ironList);class Virtualizer{constructor(t){this.Ji=new IronListAdapter(t)}get size(){return this.Ji.size}set size(t){this.Ji.size=t}scrollToIndex(t){this.Ji.scrollToIndex(t)}update(t=0,i=this.size-1){this.Ji.update(t,i)}flush(){this.Ji.flush()}get firstVisibleIndex(){return this.Ji.adjustedFirstVisibleIndex}get lastVisibleIndex(){return this.Ji.adjustedLastVisibleIndex}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const A11yMixin=t=>class extends t{static get observers(){return["_a11yUpdateGridSize(size, _columnTree, _columnTree.*)"]}_a11yGetHeaderRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer||t.path||t.header)))).length}_a11yGetFooterRowCount(t){return t.filter((t=>t.some((t=>t.headerRenderer)))).length}_a11yUpdateGridSize(t,i){if(void 0===t||void 0===i)return;const e=i[i.length-1];this.$.table.setAttribute("aria-rowcount",t+this._a11yGetHeaderRowCount(i)+this._a11yGetFooterRowCount(i)),this.$.table.setAttribute("aria-colcount",e&&e.length||0),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows()}_a11yUpdateHeaderRows(){Array.from(this.$.header.children).forEach(((t,i)=>t.setAttribute("aria-rowindex",i+1)))}_a11yUpdateFooterRows(){Array.from(this.$.footer.children).forEach(((t,i)=>t.setAttribute("aria-rowindex",this._a11yGetHeaderRowCount(this._columnTree)+this.size+i+1)))}_a11yUpdateRowRowindex(t,i){t.setAttribute("aria-rowindex",i+this._a11yGetHeaderRowCount(this._columnTree)+1)}_a11yUpdateRowSelected(t,i){t.setAttribute("aria-selected",Boolean(i)),Array.from(t.children).forEach((t=>t.setAttribute("aria-selected",Boolean(i))))}_a11yUpdateRowExpanded(t){this.Ui(t)?t.setAttribute("aria-expanded","false"):this.Pi(t)?t.setAttribute("aria-expanded","true"):t.removeAttribute("aria-expanded")}_a11yUpdateRowLevel(t,i){i>0||this.Pi(t)||this.Ui(t)?t.setAttribute("aria-level",i+1):t.removeAttribute("aria-level")}_a11ySetRowDetailsCell(t,i){Array.from(t.children).forEach((t=>{t!==i&&t.setAttribute("aria-controls",i.id)}))}_a11yUpdateCellColspan(t,i){t.setAttribute("aria-colspan",Number(i))}_a11yUpdateSorters(){Array.from(this.querySelectorAll("vaadin-grid-sorter")).forEach((t=>{let i=t.parentNode;for(;i&&"vaadin-grid-cell-content"!==i.localName;)i=i.parentNode;if(i&&i.assignedSlot){i.assignedSlot.parentNode.setAttribute("aria-sort",{asc:"ascending",desc:"descending"}[String(t.direction)]||"none")}}))}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ActiveItemMixin=t=>class extends t{static get properties(){return{activeItem:{type:Object,notify:!0,value:null}}}ready(){super.ready(),this.$.scroller.addEventListener("click",this._onClick.bind(this)),this.addEventListener("cell-activate",this._activateItem.bind(this)),this.addEventListener("row-activate",this._activateItem.bind(this))}_activateItem(t){const i=t.detail.model,e=i?i.item:null;e&&(this.activeItem=this._itemsEqual(this.activeItem,e)?null:e)}_onClick(t){if(t.defaultPrevented)return;const i=t.composedPath(),e=i[i.indexOf(this.$.table)-3];if(!e||e.getAttribute("part").indexOf("details-cell")>-1)return;const o=e._content,s=this.getRootNode().activeElement;o.contains(s)||this._isFocusable(t.target)||t.target instanceof HTMLLabelElement||this.dispatchEvent(new CustomEvent("cell-activate",{detail:{model:this.mi(e.parentElement)}}))}_isFocusable(t){return isFocusable(t)}},isFocusable=t=>{if(!t.parentNode)return!1;const i=Array.from(t.parentNode.querySelectorAll("[tabindex], button, input, select, textarea, object, iframe, a[href], area[href]")).filter((t=>{const i=t.getAttribute("part");return!(i&&i.includes("body-cell"))})).includes(t);return!t.disabled&&i&&t.offsetParent&&"hidden"!==getComputedStyle(t).visibility};function get(t,i){return t.split(".").reduce(((t,i)=>t[i]),i)}function checkPaths(t,i,e){if(0===e.length)return!1;let o=!0;return t.forEach((({path:t})=>{if(!t||-1===t.indexOf("."))return;void 0===get(t.replace(/\.[^.]*$/,""),e[0])&&(console.warn(`Path "${t}" used for ${i} does not exist in all of the items, ${i} is disabled.`),o=!1)})),o}function multiSort(t,i){return t.sort(((t,e)=>i.map((i=>"asc"===i.direction?compare(get(i.path,t),get(i.path,e)):"desc"===i.direction?compare(get(i.path,e),get(i.path,t)):0)).reduce(((t,i)=>0!==t?t:i),0)))}function normalizeEmptyValue(t){return[void 0,null].indexOf(t)>=0?"":isNaN(t)?t.toString():t}function compare(t,i){return(t=normalizeEmptyValue(t))<(i=normalizeEmptyValue(i))?-1:t>i?1:0}function filter(t,i){return t.filter((t=>i.every((i=>{const e=normalizeEmptyValue(get(i.path,t)),o=normalizeEmptyValue(i.value).toString().toLowerCase();return e.toString().toLowerCase().includes(o)}))))}const createArrayDataProvider=t=>(i,e)=>{let o=t?[...t]:[];i.filters&&checkPaths(i.filters,"filtering",o)&&(o=filter(o,i.filters)),Array.isArray(i.sortOrders)&&i.sortOrders.length&&checkPaths(i.sortOrders,"sorting",o)&&(o=multiSort(o,i.sortOrders));const s=Math.min(o.length,i.pageSize),n=i.page*s,r=n+s;e(o.slice(n,r),o.length)},ArrayDataProviderMixin=t=>class extends t{static get properties(){return{items:Array}}static get observers(){return["__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)"]}Vi(t){const i=createArrayDataProvider(this.items);i.Qi=t,this.setProperties({_arrayDataProvider:i,size:t.length,dataProvider:i})}Ei(t,i,e){e&&(this._arrayDataProvider?t!==this._arrayDataProvider?this.setProperties({_arrayDataProvider:void 0,items:void 0}):i?this._arrayDataProvider.Qi===i?(this.clearCache(),this.size=this._effectiveSize):this.Vi(i):(this.setProperties({_arrayDataProvider:void 0,dataProvider:void 0,size:0}),this.clearCache()):i&&this.Vi(i))}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function updateColumnOrders(t,i,e){let o=1;t.forEach((t=>{o%10==0&&(o+=1),t._order=e+o*i,o+=1}))}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ColumnReorderingMixin=t=>class extends t{static get properties(){return{columnReorderingAllowed:{type:Boolean,value:!1},_orderBaseScope:{type:Number,value:1e7}}}static get observers(){return["_updateOrders(_columnTree)"]}ready(){super.ready(),addListener(this,"track",this._onTrackEvent),this._reorderGhost=this.shadowRoot.querySelector('[part="reorder-ghost"]'),this.addEventListener("touchstart",this._onTouchStart.bind(this)),this.addEventListener("touchmove",this._onTouchMove.bind(this)),this.addEventListener("touchend",this._onTouchEnd.bind(this)),this.addEventListener("contextmenu",this._onContextMenu.bind(this))}_onContextMenu(t){this.hasAttribute("reordering")&&(t.preventDefault(),isTouch||this._onTrackEnd())}_onTouchStart(t){this._startTouchReorderTimeout=setTimeout((()=>{this._onTrackStart({detail:{x:t.touches[0].clientX,y:t.touches[0].clientY}})}),100)}_onTouchMove(t){this._draggedColumn&&t.preventDefault(),clearTimeout(this._startTouchReorderTimeout)}_onTouchEnd(){clearTimeout(this._startTouchReorderTimeout),this._onTrackEnd()}_onTrackEvent(t){if("start"===t.detail.state){const i=t.composedPath(),e=i[i.indexOf(this.$.header)-2];if(!e||!e._content)return;if(e._content.contains(this.getRootNode().activeElement))return;if(this.$.scroller.hasAttribute("column-resizing"))return;this._touchDevice||this._onTrackStart(t)}else"track"===t.detail.state?this._onTrack(t):"end"===t.detail.state&&this._onTrackEnd(t)}_onTrackStart(t){if(!this.columnReorderingAllowed)return;const i=t.composedPath&&t.composedPath();if(i&&i.some((t=>t.hasAttribute&&t.hasAttribute("draggable"))))return;const e=this._cellFromPoint(t.detail.x,t.detail.y);if(e&&e.getAttribute("part").includes("header-cell")){for(this.toggleAttribute("reordering",!0),this._draggedColumn=e._column;1===this._draggedColumn.parentElement.childElementCount;)this._draggedColumn=this._draggedColumn.parentElement;this._setSiblingsReorderStatus(this._draggedColumn,"allowed"),this._draggedColumn._reorderStatus="dragging",this._updateGhost(e),this._reorderGhost.style.visibility="visible",this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._autoScroller()}}_onTrack(t){if(!this._draggedColumn)return;const i=this._cellFromPoint(t.detail.x,t.detail.y);if(!i)return;const e=this._getTargetColumn(i,this._draggedColumn);if(this._isSwapAllowed(this._draggedColumn,e)&&this._isSwappableByPosition(e,t.detail.x)){const t=this._columnTree.findIndex((t=>t.includes(e))),i=this._getColumnsInOrder(t),o=i.indexOf(this._draggedColumn),s=i.indexOf(e),n=o<s?1:-1;for(let t=o;t!==s;t+=n)this._swapColumnOrders(this._draggedColumn,i[t+n])}this._updateGhostPosition(t.detail.x,this._touchDevice?t.detail.y-50:t.detail.y),this._lastDragClientX=t.detail.x}_onTrackEnd(){this._draggedColumn&&(this.toggleAttribute("reordering",!1),this._draggedColumn._reorderStatus="",this._setSiblingsReorderStatus(this._draggedColumn,""),this._draggedColumn=null,this._lastDragClientX=null,this._reorderGhost.style.visibility="hidden",this.dispatchEvent(new CustomEvent("column-reorder",{detail:{columns:this._getColumnsInOrder()}})))}_getColumnsInOrder(t=this._columnTree.length-1){return this._columnTree[t].filter((t=>!t.hidden)).sort(((t,i)=>t._order-i._order))}_cellFromPoint(t,i){t=t||0,i=i||0,this._draggedColumn||this.$.scroller.toggleAttribute("no-content-pointer-events",!0);const e=this.shadowRoot.elementFromPoint(t,i);if(this.$.scroller.toggleAttribute("no-content-pointer-events",!1),e&&e._column)return e}_updateGhostPosition(t,i){const e=this._reorderGhost.getBoundingClientRect(),o=t-e.width/2,s=i-e.height/2,n=parseInt(this._reorderGhost._left||0),r=parseInt(this._reorderGhost._top||0);this._reorderGhost._left=n-(e.left-o),this._reorderGhost._top=r-(e.top-s),this._reorderGhost.style.transform=`translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`}_updateGhost(t){const i=this._reorderGhost;i.textContent=t._content.innerText;const e=window.getComputedStyle(t);return["boxSizing","display","width","height","background","alignItems","padding","border","flex-direction","overflow"].forEach((t=>{i.style[t]=e[t]})),i}_updateOrders(t){void 0!==t&&(t[0].forEach((t=>{t._order=0})),updateColumnOrders(t[0],this._orderBaseScope,0))}_setSiblingsReorderStatus(t,i){Array.from(t.parentNode.children).filter((i=>/column/.test(i.localName)&&this._isSwapAllowed(i,t))).forEach((t=>{t._reorderStatus=i}))}_autoScroller(){if(this._lastDragClientX){const t=this._lastDragClientX-this.getBoundingClientRect().right+50,i=this.getBoundingClientRect().left-this._lastDragClientX+50;t>0?this.$.table.scrollLeft+=t/10:i>0&&(this.$.table.scrollLeft-=i/10)}this._draggedColumn&&setTimeout((()=>this._autoScroller()),10)}_isSwapAllowed(t,i){if(t&&i){const e=t!==i,o=t.parentElement===i.parentElement,s=t.frozen&&i.frozen||t.frozenToEnd&&i.frozenToEnd||!t.frozen&&!t.frozenToEnd&&!i.frozen&&!i.frozenToEnd;return e&&o&&s}}_isSwappableByPosition(t,i){const e=Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).find((i=>t.contains(i._column))),o=this.$.header.querySelector("tr:not([hidden]) [reorder-status=dragging]").getBoundingClientRect(),s=e.getBoundingClientRect();return s.left>o.left?i>s.right-o.width:i<s.left+o.width}_swapColumnOrders(t,i){[t._order,i._order]=[i._order,t._order],this._debounceUpdateFrozenColumn(),this._updateFirstAndLastColumn()}_getTargetColumn(t,i){if(t&&i){let e=t._column;for(;e.parentElement!==i.parentElement&&e!==this;)e=e.parentElement;return e.parentElement===i.parentElement?e:t._column}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ColumnResizingMixin=t=>class extends t{ready(){super.ready();const t=this.$.scroller;addListener(t,"track",this._onHeaderTrack.bind(this)),t.addEventListener("touchmove",(i=>t.hasAttribute("column-resizing")&&i.preventDefault())),t.addEventListener("contextmenu",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault())),t.addEventListener("mousedown",(t=>"resize-handle"===t.target.getAttribute("part")&&t.preventDefault()))}_onHeaderTrack(t){const i=t.target;if("resize-handle"===i.getAttribute("part")){let e=i.parentElement._column;for(this.$.scroller.toggleAttribute("column-resizing",!0);"vaadin-grid-column-group"===e.localName;)e=e._childColumns.slice(0).sort(((t,i)=>t._order-i._order)).filter((t=>!t.hidden)).pop();const o=t.detail.x,s=Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]')),n=s.find((t=>t._column===e));if(n.offsetWidth){const t=getComputedStyle(n._content),i=10+parseInt(t.paddingLeft)+parseInt(t.paddingRight)+parseInt(t.borderLeftWidth)+parseInt(t.borderRightWidth)+parseInt(t.marginLeft)+parseInt(t.marginRight);let s;const r=n.offsetWidth,a=n.getBoundingClientRect();s=n.hasAttribute("frozen-to-end")?r+(this.Ki?o-a.right:a.left-o):r+(this.Ki?a.left-o:o-a.right),e.width=`${Math.max(i,s)}px`,e.flexGrow=0}s.sort(((t,i)=>t._column._order-i._column._order)).forEach(((t,i,e)=>{i<e.indexOf(n)&&(t._column.width=`${t.offsetWidth}px`,t._column.flexGrow=0)}));const r=this._frozenToEndCells[0];if(r&&this.$.table.scrollWidth>this.$.table.offsetWidth){const t=r.getBoundingClientRect(),i=o-(this.Ki?t.right:t.left);(this.Ki&&i<=0||!this.Ki&&i>=0)&&(this.$.table.scrollLeft+=i)}"end"===t.detail.state&&(this.$.scroller.toggleAttribute("column-resizing",!1),this.dispatchEvent(new CustomEvent("column-resize",{detail:{resizedColumn:e}}))),this._resizeHandler()}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,ItemCache=class t{constructor(t,i,e){this.grid=t,this.parentCache=i,this.parentItem=e,this.itemCaches={},this.items={},this.effectiveSize=0,this.size=0,this.pendingRequests={}}isLoading(){return Boolean(Object.keys(this.pendingRequests).length||Object.keys(this.itemCaches).filter((t=>this.itemCaches[t].isLoading()))[0])}getItemForIndex(t){const{cache:i,scaledIndex:e}=this.getCacheAndIndex(t);return i.items[e]}updateSize(){this.effectiveSize=!this.parentItem||this.grid._isExpanded(this.parentItem)?this.size+Object.keys(this.itemCaches).reduce(((t,i)=>{const e=this.itemCaches[i];return e.updateSize(),t+e.effectiveSize}),0):0}ensureSubCacheForScaledIndex(i){if(!this.itemCaches[i]){const e=new t(this.grid,this,this.items[i]);this.itemCaches[i]=e,this.grid._loadPage(0,e)}}getCacheAndIndex(t){let i=t;const e=Object.keys(this.itemCaches);for(let t=0;t<e.length;t++){const o=Number(e[t]),s=this.itemCaches[o];if(i<=o)return{cache:this,scaledIndex:i};if(i<=o+s.effectiveSize)return s.getCacheAndIndex(i-o-1);i-=s.effectiveSize}return{cache:this,scaledIndex:i}}},DataProviderMixin=t=>class extends t{static get properties(){return{size:{type:Number,notify:!0},pageSize:{type:Number,value:50,observer:"_pageSizeChanged"},dataProvider:{type:Object,notify:!0,observer:"_dataProviderChanged"},loading:{type:Boolean,notify:!0,readOnly:!0,reflectToAttribute:!0},_cache:{type:Object,value(){return new ItemCache(this)}},_hasData:{type:Boolean,value:!1},itemHasChildrenPath:{type:String,value:"children"},itemIdPath:{type:String,value:null},expandedItems:{type:Object,notify:!0,value:()=>[]},Fi:{type:Object,computed:"__computeExpandedKeys(itemIdPath, expandedItems.*)"}}}static get observers(){return["_sizeChanged(size)","_expandedItemsChanged(expandedItems.*)"]}_sizeChanged(t){const i=t-this._cache.size;this._cache.size+=i,this._cache.effectiveSize+=i,this._effectiveSize=this._cache.effectiveSize}_getItem(t,i){if(t>=this._effectiveSize)return;i.index=t;const{cache:e,scaledIndex:o}=this._cache.getCacheAndIndex(t),s=e.items[o];s?(i.toggleAttribute("loading",!1),this._updateItem(i,s),this._isExpanded(s)&&e.ensureSubCacheForScaledIndex(o)):(i.toggleAttribute("loading",!0),this._loadPage(this._getPageForIndex(o),e))}getItemId(t){return this.itemIdPath?this.get(this.itemIdPath,t):t}_isExpanded(t){return this.Fi.has(this.getItemId(t))}_expandedItemsChanged(){this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,this._i()}$i(t,i){const e=i.base||[],o=new Set;return e.forEach((t=>{o.add(this.getItemId(t))})),o}expandItem(t){this._isExpanded(t)||(this.expandedItems=[...this.expandedItems,t])}collapseItem(t){this._isExpanded(t)&&(this.expandedItems=this.expandedItems.filter((i=>!this._itemsEqual(i,t))))}_getIndexLevel(t){let{cache:i}=this._cache.getCacheAndIndex(t),e=0;for(;i.parentCache;)i=i.parentCache,e+=1;return e}_loadPage(t,i){if(!i.pendingRequests[t]&&this.dataProvider){this._setLoading(!0),i.pendingRequests[t]=!0;const e={page:t,pageSize:this.pageSize,sortOrders:this._mapSorters(),filters:this._mapFilters(),parentItem:i.parentItem};this.dataProvider(e,((o,s)=>{void 0!==s?i.size=s:e.parentItem&&(i.size=o.length);const n=Array.from(this.$.items.children).map((t=>t._item));o.forEach(((e,o)=>{const s=t*this.pageSize+o;i.items[s]=e,this._isExpanded(e)&&n.indexOf(e)>-1&&i.ensureSubCacheForScaledIndex(s)})),this._hasData=!0,delete i.pendingRequests[t],this._debouncerApplyCachedData=Debouncer.debounce(this._debouncerApplyCachedData,timeOut.after(0),(()=>{this._setLoading(!1),this._cache.updateSize(),this._effectiveSize=this._cache.effectiveSize,Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._cache.getItemForIndex(t.index)&&this._getItem(t.index,t)})),this.qi(),this.te()})),this._cache.isLoading()||this._debouncerApplyCachedData.flush(),this.ie()}))}}_getPageForIndex(t){return Math.floor(t/this.pageSize)}clearCache(){this._cache=new ItemCache(this),this._cache.size=this.size||0,this._cache.updateSize(),this._hasData=!1,this._i(),this._effectiveSize||this._loadPage(0,this._cache)}_pageSizeChanged(t,i){void 0!==i&&t!==i&&this.clearCache()}_checkSize(){void 0===this.size&&0===this._effectiveSize&&console.warn("The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.")}_dataProviderChanged(t,i){void 0!==i&&this.clearCache(),this._ensureFirstPageLoaded(),this._debouncerCheckSize=Debouncer.debounce(this._debouncerCheckSize,timeOut.after(2e3),this._checkSize.bind(this))}_ensureFirstPageLoaded(){this._hasData||this._loadPage(0,this._cache)}_itemsEqual(t,i){return this.getItemId(t)===this.getItemId(i)}_getItemIndexInArray(t,i){let e=-1;return i.forEach(((i,o)=>{this._itemsEqual(i,t)&&(e=o)})),e}scrollToIndex(t){super.scrollToIndex(t),isNaN(t)||!this._cache.isLoading()&&this.clientHeight||(this.ee=t)}qi(){if(this.ee&&this.$.items.children.length){const t=this.ee;delete this.ee,this.scrollToIndex(t)}}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,DropMode={BETWEEN:"between",ON_TOP:"on-top",ON_TOP_OR_BETWEEN:"on-top-or-between",ON_GRID:"on-grid"},DropLocation={ON_TOP:"on-top",ABOVE:"above",BELOW:"below",EMPTY:"empty"},usesDnDPolyfill=!("draggable"in document.createElement("div")),DragAndDropMixin=t=>class extends t{static get properties(){return{dropMode:String,rowsDraggable:Boolean,dragFilter:Function,dropFilter:Function,oe:{value:50}}}static get observers(){return["_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)"]}ready(){super.ready(),this.$.table.addEventListener("dragstart",this._onDragStart.bind(this)),this.$.table.addEventListener("dragend",this._onDragEnd.bind(this)),this.$.table.addEventListener("dragover",this._onDragOver.bind(this)),this.$.table.addEventListener("dragleave",this._onDragLeave.bind(this)),this.$.table.addEventListener("drop",this._onDrop.bind(this)),this.$.table.addEventListener("dragenter",(t=>{this.dropMode&&(t.preventDefault(),t.stopPropagation())}))}_onDragStart(t){if(this.rowsDraggable){let i=t.target;if("vaadin-grid-cell-content"===i.localName&&(i=i.assignedSlot.parentNode.parentNode),i.parentNode!==this.$.items)return;if(t.stopPropagation(),this.toggleAttribute("dragging-rows",!0),this._safari){const t=i.style.transform;i.style.top=/translateY\((.*)\)/.exec(t)[1],i.style.transform="none",requestAnimationFrame((()=>{i.style.top="",i.style.transform=t}))}const e=i.getBoundingClientRect();usesDnDPolyfill?t.dataTransfer.setDragImage(i):t.dataTransfer.setDragImage(i,t.clientX-e.left,t.clientY-e.top);let o=[i];this._isSelected(i._item)&&(o=this.se().filter((t=>this._isSelected(t._item))).filter((t=>!this.dragFilter||this.dragFilter(this.mi(t))))),t.dataTransfer.setData("text",this.ne(o)),i.setAttribute("dragstart",o.length>1?o.length:""),this.style.setProperty("--_grid-drag-start-x",t.clientX-e.left+20+"px"),this.style.setProperty("--_grid-drag-start-y",t.clientY-e.top+10+"px"),requestAnimationFrame((()=>{i.removeAttribute("dragstart"),this.updateStyles({"--_grid-drag-start-x":"","--_grid-drag-start-y":""})}));const s=new CustomEvent("grid-dragstart",{detail:{draggedItems:o.map((t=>t._item)),setDragData:(i,e)=>t.dataTransfer.setData(i,e),setDraggedItemsCount:t=>i.setAttribute("dragstart",t)}});s.originalEvent=t,this.dispatchEvent(s)}}_onDragEnd(t){this.toggleAttribute("dragging-rows",!1),t.stopPropagation();const i=new CustomEvent("grid-dragend");i.originalEvent=t,this.dispatchEvent(i)}_onDragLeave(t){t.stopPropagation(),this._clearDragStyles()}_onDragOver(t){if(this.dropMode){if(this._dropLocation=void 0,this._dragOverItem=void 0,this.ae(t.clientY))return void this._clearDragStyles();let i=t.composedPath().find((t=>"tr"===t.localName));if(this._effectiveSize&&this.dropMode!==DropMode.ON_GRID)if(i&&i.parentNode===this.$.items){const e=i.getBoundingClientRect();if(this._dropLocation=DropLocation.ON_TOP,this.dropMode===DropMode.BETWEEN){const i=t.clientY-e.top<e.bottom-t.clientY;this._dropLocation=i?DropLocation.ABOVE:DropLocation.BELOW}else this.dropMode===DropMode.ON_TOP_OR_BETWEEN&&(t.clientY-e.top<e.height/3?this._dropLocation=DropLocation.ABOVE:t.clientY-e.top>e.height/3*2&&(this._dropLocation=DropLocation.BELOW))}else{if(i)return;if(this.dropMode!==DropMode.BETWEEN&&this.dropMode!==DropMode.ON_TOP_OR_BETWEEN)return;i=Array.from(this.$.items.children).filter((t=>!t.hidden)).pop(),this._dropLocation=DropLocation.BELOW}else this._dropLocation=DropLocation.EMPTY;if(i&&i.hasAttribute("drop-disabled"))return void(this._dropLocation=void 0);t.stopPropagation(),t.preventDefault(),this._dropLocation===DropLocation.EMPTY?this.toggleAttribute("dragover",!0):i?(this._dragOverItem=i._item,i.getAttribute("dragover")!==this._dropLocation&&i.setAttribute("dragover",this._dropLocation)):this._clearDragStyles()}}ae(t){if(this.Ie)return!0;const i=this.$.header.getBoundingClientRect().bottom,e=this.$.footer.getBoundingClientRect().top,o=i-t+this.oe,s=t-e+this.oe;let n=0;if(s>0?n=2*s:o>0&&(n=2*-o),n){const t=this.$.table.scrollTop;this.$.table.scrollTop+=n;if(t!==this.$.table.scrollTop)return this.Ie=!0,setTimeout((()=>{this.Ie=!1}),20),!0}}se(){const t=this.$.header.getBoundingClientRect().bottom,i=this.$.footer.getBoundingClientRect().top;return Array.from(this.$.items.children).filter((e=>{const o=e.getBoundingClientRect();return o.bottom>t&&o.top<i}))}_clearDragStyles(){this.removeAttribute("dragover"),Array.from(this.$.items.children).forEach((t=>t.removeAttribute("dragover")))}_onDrop(t){if(this.dropMode){t.stopPropagation(),t.preventDefault();const i=t.dataTransfer.types&&Array.from(t.dataTransfer.types).map((i=>({type:i,data:t.dataTransfer.getData(i)})));this._clearDragStyles();const e=new CustomEvent("grid-drop",{bubbles:t.bubbles,cancelable:t.cancelable,detail:{dropTargetItem:this._dragOverItem,dropLocation:this._dropLocation,dragData:i}});e.originalEvent=t,this.dispatchEvent(e)}}ne(t){return t.map((t=>Array.from(t.children).filter((t=>!t.hidden&&-1===t.getAttribute("part").indexOf("details-cell"))).sort(((t,i)=>t._column._order>i._column._order?1:-1)).map((t=>t._content.textContent.trim())).filter((t=>t)).join("\t"))).join("\n")}_dragDropAccessChanged(){this.filterDragAndDrop()}filterDragAndDrop(){Array.from(this.$.items.children).filter((t=>!t.hidden)).forEach((t=>{this._filterDragAndDrop(t,this.mi(t))}))}_filterDragAndDrop(t,i){const e=this.loading||t.hasAttribute("loading"),o=!this.rowsDraggable||e||this.dragFilter&&!this.dragFilter(i),s=!this.dropMode||e||this.dropFilter&&!this.dropFilter(i);Array.from(t.children).map((t=>t._content)).forEach((t=>{o?t.removeAttribute("draggable"):t.setAttribute("draggable",!0)})),t.toggleAttribute("drag-disabled",!!o),t.toggleAttribute("drop-disabled",!!s)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;function arrayEquals(t,i){if(!t||!i||t.length!==i.length)return!1;for(let e=0,o=t.length;e<o;e++)if(t[e]instanceof Array&&i[e]instanceof Array){if(!arrayEquals(t[e],i[e]))return!1}else if(t[e]!==i[e])return!1;return!0}const DynamicColumnsMixin=t=>class extends t{static get properties(){return{_columnTree:Object}}ready(){super.ready(),this._addNodeObserver()}_hasColumnGroups(t){for(let i=0;i<t.length;i++)if("vaadin-grid-column-group"===t[i].localName)return!0;return!1}_getChildColumns(t){return FlattenedNodesObserver.getFlattenedNodes(t).filter(this._isColumnElement)}_flattenColumnGroups(t){return t.map((t=>"vaadin-grid-column-group"===t.localName?this._getChildColumns(t):[t])).reduce(((t,i)=>t.concat(i)),[])}_getColumnTree(){const t=FlattenedNodesObserver.getFlattenedNodes(this).filter(this._isColumnElement),i=[t];let e=t;for(;this._hasColumnGroups(e);)e=this._flattenColumnGroups(e),i.push(e);return i}_updateColumnTree(){const t=this._getColumnTree();arrayEquals(t,this._columnTree)||(this._columnTree=t)}_addNodeObserver(){this._observer=new FlattenedNodesObserver(this,(t=>{const i=t=>t.filter(this._isColumnElement).length>0;if(i(t.addedNodes)||i(t.removedNodes)){const i=t.removedNodes.flatMap((t=>t._allCells)),e=t=>i.filter((i=>i&&i._content.contains(t))).length;this.ge(this._sorters.filter(e)),this.le(this._filters.filter(e)),this._updateColumnTree()}this._debouncerCheckImports=Debouncer.debounce(this._debouncerCheckImports,timeOut.after(2e3),this._checkImports.bind(this)),this._ensureFirstPageLoaded()}))}_checkImports(){["vaadin-grid-column-group","vaadin-grid-filter","vaadin-grid-filter-column","vaadin-grid-tree-toggle","vaadin-grid-selection-column","vaadin-grid-sort-column","vaadin-grid-sorter"].forEach((t=>{const i=this.querySelector(t);!i||i instanceof PolymerElement||console.warn(`Make sure you have imported the required module for <${t}> element.`)}))}_updateFirstAndLastColumn(){Array.from(this.shadowRoot.querySelectorAll("tr")).forEach((t=>this._updateFirstAndLastColumnForRow(t)))}_updateFirstAndLastColumnForRow(t){Array.from(t.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).sort(((t,i)=>t._column._order-i._column._order)).forEach(((t,i,e)=>{t.toggleAttribute("first-column",0===i),t.toggleAttribute("last-column",i===e.length-1)}))}_isColumnElement(t){return t.nodeType===Node.ELEMENT_NODE&&/\bcolumn\b/.test(t.localName)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,EventContextMixin=t=>class extends t{getEventContext(t){const i={},e=t.ce||t.composedPath(),o=e[e.indexOf(this.$.table)-3];return o?(i.section=["body","header","footer","details"].find((t=>o.getAttribute("part").indexOf(t)>-1)),o._column&&(i.column=o._column),"body"!==i.section&&"details"!==i.section||Object.assign(i,this.mi(o.parentElement)),i):i}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,FilterMixin=t=>class extends t{static get properties(){return{_filters:{type:Array,value:()=>[]}}}ready(){super.ready(),this.addEventListener("filter-changed",this._filterChanged.bind(this))}_filterChanged(t){t.stopPropagation(),this.de(t.target),this.he()}le(t){0!==t.length&&(this._filters=this._filters.filter((i=>t.indexOf(i)<0)),this.he())}de(t){-1===this._filters.indexOf(t)&&this._filters.push(t)}he(){this.dataProvider&&this.isAttached&&this.clearCache()}_mapFilters(){return this._filters.map((t=>({path:t.path,value:t.value})))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;function deserializeAttributeValue(t){return t?new Set(t.split(" ")):new Set}function serializeAttributeValue(t){return[...t].join(" ")}function addValueToAttribute(t,i,e){const o=deserializeAttributeValue(t.getAttribute(i));o.add(e),t.setAttribute(i,serializeAttributeValue(o))}function removeValueFromAttribute(t,i,e){const o=deserializeAttributeValue(t.getAttribute(i));o.delete(e),0!==o.size?t.setAttribute(i,serializeAttributeValue(o)):t.removeAttribute(i)}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const KeyboardNavigationMixin=t=>class extends t{static get properties(){return{_headerFocusable:{type:Object,observer:"_focusableChanged"},_itemsFocusable:{type:Object,observer:"_focusableChanged"},_footerFocusable:{type:Object,observer:"_focusableChanged"},_navigatingIsHidden:Boolean,_focusedItemIndex:{type:Number,value:0},_focusedColumnOrder:Number,_focusedCell:{type:Object,observer:"_focusedCellChanged"},interacting:{type:Boolean,value:!1,reflectToAttribute:!0,readOnly:!0,observer:"_interactingChanged"}}}ready(){super.ready(),this._ios||this._android||(this.addEventListener("keydown",this._onKeyDown),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("focusin",this._onFocusIn),this.addEventListener("focusout",this._onFocusOut),this.$.table.addEventListener("focusin",this._onContentFocusIn.bind(this)),this.addEventListener("mousedown",(()=>{this.toggleAttribute("navigating",!1),this._isMousedown=!0,this._focusedColumnOrder=void 0})),this.addEventListener("mouseup",(()=>{this._isMousedown=!1})))}get Ce(){return this.Ae(this._itemsFocusable)||this.Ae(this._headerFocusable)||this.Ae(this._footerFocusable)}set Ce(t){["_itemsFocusable","_footerFocusable","_headerFocusable"].forEach((i=>{const e=this[i];if(t){const t=e&&e.parentElement;this.ue(e)?this[i]=t:this.ue(t)&&(this[i]=t.parentElement)}else if(!t&&this.Ae(e)){const t=e.firstElementChild;this[i]=t._focusButton||t}}))}_focusableChanged(t,i){i&&i.setAttribute("tabindex","-1"),t&&this._updateGridSectionFocusTarget(t)}_focusedCellChanged(t,i){i&&removeValueFromAttribute(i,"part","focused-cell"),t&&addValueToAttribute(t,"part","focused-cell")}_interactingChanged(){this._updateGridSectionFocusTarget(this._headerFocusable),this._updateGridSectionFocusTarget(this._itemsFocusable),this._updateGridSectionFocusTarget(this._footerFocusable)}me(){if(!this._itemsFocusable)return;const t=this.shadowRoot.activeElement===this._itemsFocusable;this._getVisibleRows().forEach((t=>{if(t.index===this._focusedItemIndex)if(this.Ce)this._itemsFocusable=t;else{let i=this._itemsFocusable.parentElement,e=this._itemsFocusable;if(i){this.ue(i)&&(e=i,i=i.parentElement);const o=[...i.children].indexOf(e);this._itemsFocusable=this.be(t,t.children[o])}}})),t&&this._itemsFocusable.focus()}_onKeyDown(t){const i=t.key;let e;switch(i){case"ArrowUp":case"ArrowDown":case"ArrowLeft":case"ArrowRight":case"PageUp":case"PageDown":case"Home":case"End":e="Navigation";break;case"Enter":case"Escape":case"F2":e="Interaction";break;case"Tab":e="Tab";break;case" ":e="Space"}this._detectInteracting(t),this.interacting&&"Interaction"!==e&&(e=void 0),e&&this[`_on${e}KeyDown`](t,i)}_ensureScrolledToIndex(t){[...this.$.items.children].find((i=>i.index===t))?this.pe(t):this.scrollToIndex(t)}Ui(t){if(this.itemHasChildrenPath){const i=t._item;return i&&this.get(this.itemHasChildrenPath,i)&&!this._isExpanded(i)}}Pi(t){return this._isExpanded(t._item)}Ze(t){return t.matches('[part~="details-cell"]')}ue(t){return t instanceof HTMLTableCellElement}Ae(t){return t instanceof HTMLTableRowElement}Me(t){return Array.prototype.indexOf.call(t.parentNode.children,t)}_onNavigationKeyDown(t,i){t.preventDefault();const e=this._lastVisibleIndex-this._firstVisibleIndex-1;let o=0,s=0;switch(i){case"ArrowRight":o=this.Ki?-1:1;break;case"ArrowLeft":o=this.Ki?1:-1;break;case"Home":this.Ce||t.ctrlKey?s=-1/0:o=-1/0;break;case"End":this.Ce||t.ctrlKey?s=1/0:o=1/0;break;case"ArrowDown":s=1;break;case"ArrowUp":s=-1;break;case"PageDown":s=e;break;case"PageUp":s=-e}const n=t.composedPath().find((t=>this.Ae(t))),r=t.composedPath().find((t=>this.ue(t)));if(this.Ce&&!n||!this.Ce&&!r)return;const a=this.Ki?"ArrowLeft":"ArrowRight",I=this.Ki?"ArrowRight":"ArrowLeft";if(i===a){if(this.Ce)return this.Ui(n)?void this.expandItem(n._item):(this.Ce=!1,void this._onCellNavigation(n.firstElementChild,0,0))}else if(i===I)if(this.Ce){if(this.Pi(n))return void this.collapseItem(n._item)}else{const t=[...n.children].sort(((t,i)=>t._order-i._order));if(r===t[0]||this.Ze(r))return this.Ce=!0,void this._onRowNavigation(n,0)}this.Ce?this._onRowNavigation(n,s):this._onCellNavigation(r,o,s)}_onRowNavigation(t,i){const{dstRow:e}=this.Ne(i,t);e&&e.focus()}ve(t,i){return t.parentNode===this.$.items?void 0!==i?i:t.index:this.Me(t)}Ne(t,i,e){const o=this.ve(i,this._focusedItemIndex),s=i.parentNode,n=(s===this.$.items?this._effectiveSize:s.children.length)-1;let r=Math.max(0,Math.min(o+t,n));if(s!==this.$.items){if(r>o)for(;r<n&&s.children[r].hidden;)r+=1;else if(r<o)for(;r>0&&s.children[r].hidden;)r-=1;return this.toggleAttribute("navigating",!0),{dstRow:s.children[r]}}let a=!1;if(e){const n=this.Ze(e);if(s===this.$.items){const e=i._item,s=this._cache.getItemForIndex(r);a=n?0===t:1===t&&this._isDetailsOpened(e)||-1===t&&r!==o&&this._isDetailsOpened(s),a!==n&&(1===t&&a||-1===t&&!a)&&(r=o)}}return this._ensureScrolledToIndex(r),this._focusedItemIndex=r,this.toggleAttribute("navigating",!0),{dstRow:[...s.children].find((t=>!t.hidden&&t.index===r)),dstIsRowDetails:a}}_onCellNavigation(t,i,e){const o=t.parentNode,{dstRow:s,dstIsRowDetails:n}=this.Ne(e,o,t);if(!s)return;const r=this.Me(t),a=this.Ze(t),I=o.parentNode,g=this.ve(o,this._focusedItemIndex);if(void 0===this._focusedColumnOrder&&(this._focusedColumnOrder=a?0:this._getColumns(I,g).filter((t=>!t.hidden))[r]._order),n){[...s.children].find((t=>this.Ze(t))).focus()}else{const t=this.ve(s,this._focusedItemIndex),o=this._getColumns(I,t).filter((t=>!t.hidden)),n=o.map((t=>t._order)).sort(((t,i)=>t-i)),r=n.length-1,g=n.indexOf(n.slice(0).sort(((t,i)=>Math.abs(t-this._focusedColumnOrder)-Math.abs(i-this._focusedColumnOrder)))[0]),l=0===e&&a?g:Math.max(0,Math.min(g+i,r));l!==g&&(this._focusedColumnOrder=void 0);const c=o.reduce(((t,i,e)=>(t[i._order]=e,t)),{}),d=c[n[l]],h=s.children[d];this._scrollHorizontallyToCell(h),h.focus()}}_onInteractionKeyDown(t,i){const e=t.composedPath()[0],o="input"===e.localName&&!/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(e.type);let s;switch(i){case"Enter":s=!this.interacting||!o;break;case"Escape":s=!1;break;case"F2":s=!this.interacting}const{cell:n}=this._getGridEventLocation(t);if(this.interacting!==s&&null!==n)if(s){const i=n._content.querySelector("[focus-target]")||[...n._content.querySelectorAll("*")].find((t=>this._isFocusable(t)));i&&(t.preventDefault(),i.focus(),this._setInteracting(!0),this.toggleAttribute("navigating",!1))}else t.preventDefault(),this._focusedColumnOrder=void 0,n.focus(),this._setInteracting(!1),this.toggleAttribute("navigating",!0);"Escape"===i&&this._hideTooltip(!0)}_predictFocusStepTarget(t,i){const e=[this.$.table,this._headerFocusable,this._itemsFocusable,this._footerFocusable,this.$.focusexit];let o=e.indexOf(t);for(o+=i;o>=0&&o<=e.length-1;){let t=e[o];if(t&&!this.Ce&&(t=e[o].parentNode),t&&!t.hidden)break;o+=i}let s=e[o];if(s&&!this.ye(s)){const t=this._getColumnsInOrder().find((t=>this.je(t)));if(t)if(s===this._headerFocusable)s=t._headerCell;else if(s===this._itemsFocusable){const i=s._column._cells.indexOf(s);s=t._cells[i]}else s===this._footerFocusable&&(s=t._footerCell)}return s}je(t){return!(!t.frozen&&!t.frozenToEnd)||this.ye(t._sizerCell)}ye(t){return t.offsetLeft+t.offsetWidth>=this._scrollLeft&&t.offsetLeft<=this._scrollLeft+this.clientWidth}_onTabKeyDown(t){const i=this._predictFocusStepTarget(t.composedPath()[0],t.shiftKey?-1:1);if(i){if(t.stopPropagation(),i===this.$.table)this.$.table.focus();else if(i===this.$.focusexit)this.$.focusexit.focus();else if(i===this._itemsFocusable){let e=i;const o=this.Ae(i)?i:i.parentNode;if(this._ensureScrolledToIndex(this._focusedItemIndex),o.index!==this._focusedItemIndex&&this.ue(i)){const t=Array.from(o.children).indexOf(this._itemsFocusable),i=Array.from(this.$.items.children).find((t=>!t.hidden&&t.index===this._focusedItemIndex));i&&(e=i.children[t])}t.preventDefault(),e.focus()}else t.preventDefault(),i.focus();this.toggleAttribute("navigating",!0)}}_onSpaceKeyDown(t){t.preventDefault();const i=t.composedPath()[0],e=this.Ae(i);!e&&i._content&&i._content.firstElementChild||this.dispatchEvent(new CustomEvent(e?"row-activate":"cell-activate",{detail:{model:this.mi(e?i:i.parentElement)}}))}_onKeyUp(t){if(!/^( |SpaceBar)$/.test(t.key)||this.interacting)return;t.preventDefault();const i=t.composedPath()[0];if(i._content&&i._content.firstElementChild){const e=this.hasAttribute("navigating");i._content.firstElementChild.dispatchEvent(new MouseEvent("click",{shiftKey:t.shiftKey,bubbles:!0,composed:!0,cancelable:!0})),this.toggleAttribute("navigating",e)}}_onFocusIn(t){this._isMousedown||this.toggleAttribute("navigating",!0);const i=t.composedPath()[0];i===this.$.table||i===this.$.focusexit?(this._predictFocusStepTarget(i,i===this.$.table?1:-1).focus(),this._setInteracting(!1)):this._detectInteracting(t)}_onFocusOut(t){this.toggleAttribute("navigating",!1),this._detectInteracting(t),this._hideTooltip(),this._focusedCell=null}_onContentFocusIn(t){const{section:i,cell:e,row:o}=this._getGridEventLocation(t);if(e||this.Ce){if(this._detectInteracting(t),i&&(e||o))if(this._activeRowGroup=i,this.$.header===i?this._headerFocusable=this.be(o,e):this.$.items===i?this._itemsFocusable=this.be(o,e):this.$.footer===i&&(this._footerFocusable=this.be(o,e)),e){const i=this.getEventContext(t);this.we=this.loading&&"body"===i.section,this.we||e.dispatchEvent(new CustomEvent("cell-focus",{bubbles:!0,composed:!0,detail:{context:i}})),this._focusedCell=e._focusButton||e,isKeyboardActive()&&t.target===e&&this._showTooltip(t)}else this._focusedCell=null;this._detectFocusedItemIndex(t)}}te(){this.we&&this.shadowRoot.activeElement===this._itemsFocusable&&this._itemsFocusable.dispatchEvent(new Event("focusin",{bubbles:!0,composed:!0}))}be(t,i){return this.Ce?t:i._focusButton||i}_detectInteracting(t){const i=t.composedPath().some((t=>"vaadin-grid-cell-content"===t.localName));this._setInteracting(i),this.Te()}_detectFocusedItemIndex(t){const{section:i,row:e}=this._getGridEventLocation(t);i===this.$.items&&(this._focusedItemIndex=e.index)}_updateGridSectionFocusTarget(t){if(!t)return;const i=this._getGridSectionFromFocusTarget(t),e=this.interacting&&i===this._activeRowGroup;t.tabIndex=e?-1:0}_preventScrollerRotatingCellFocus(t,i){t.index===this._focusedItemIndex&&this.hasAttribute("navigating")&&this._activeRowGroup===this.$.items&&(this._navigatingIsHidden=!0,this.toggleAttribute("navigating",!1)),i===this._focusedItemIndex&&this._navigatingIsHidden&&(this._navigatingIsHidden=!1,this.toggleAttribute("navigating",!0))}_getColumns(t,i){let e=this._columnTree.length-1;return t===this.$.header?e=i:t===this.$.footer&&(e=this._columnTree.length-1-i),this._columnTree[e]}fe(t){return this.$.table.contains(t)&&t.offsetHeight}_resetKeyboardNavigation(){if(["header","footer"].forEach((t=>{if(!this.fe(this[`_${t}Focusable`])){const i=[...this.$[t].children].find((t=>t.offsetHeight)),e=i?[...i.children].find((t=>!t.hidden)):null;i&&e&&(this[`_${t}Focusable`]=this.be(i,e))}})),!this.fe(this._itemsFocusable)&&this.$.items.firstElementChild){const t=this.Oe(),i=t?[...t.children].find((t=>!t.hidden)):null;i&&t&&(delete this._focusedColumnOrder,this._itemsFocusable=this.be(t,i))}else this.me()}_scrollHorizontallyToCell(t){if(t.hasAttribute("frozen")||t.hasAttribute("frozen-to-end")||this.Ze(t))return;const i=t.getBoundingClientRect(),e=t.parentNode,o=Array.from(e.children).indexOf(t),s=this.$.table.getBoundingClientRect();let n=s.left,r=s.right;for(let t=o-1;t>=0;t--){const i=e.children[t];if(!i.hasAttribute("hidden")&&!this.Ze(i)&&(i.hasAttribute("frozen")||i.hasAttribute("frozen-to-end"))){n=i.getBoundingClientRect().right;break}}for(let t=o+1;t<e.children.length;t++){const i=e.children[t];if(!i.hasAttribute("hidden")&&!this.Ze(i)&&(i.hasAttribute("frozen")||i.hasAttribute("frozen-to-end"))){r=i.getBoundingClientRect().left;break}}i.left<n&&(this.$.table.scrollLeft+=Math.round(i.left-n)),i.right>r&&(this.$.table.scrollLeft+=Math.round(i.right-r))}_getGridEventLocation(t){const i=t.composedPath(),e=i.indexOf(this.$.table);return{section:e>=1?i[e-1]:null,row:e>=2?i[e-2]:null,cell:e>=3?i[e-3]:null}}_getGridSectionFromFocusTarget(t){return t===this._headerFocusable?this.$.header:t===this._itemsFocusable?this.$.items:t===this._footerFocusable?this.$.footer:null}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,RowDetailsMixin=t=>class extends t{static get properties(){return{detailsOpenedItems:{type:Array,value:()=>[]},rowDetailsRenderer:Function,_detailsCells:{type:Array}}}static get observers(){return["_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)","_rowDetailsRendererChanged(rowDetailsRenderer)"]}ready(){super.ready(),this._detailsCellResizeObserver=new ResizeObserver((t=>{t.forEach((({target:t})=>{this._updateDetailsCellHeight(t.parentElement)})),this.De.Ji._resizeHandler()}))}_rowDetailsRendererChanged(t){t&&this._columnTree&&Array.from(this.$.items.children).forEach((t=>{if(!t.querySelector("[part~=details-cell]")){this._updateRow(t,this._columnTree[this._columnTree.length-1]);const i=this._isDetailsOpened(t._item);this._toggleDetailsCell(t,i)}}))}_detailsOpenedItemsChanged(t,i){"detailsOpenedItems.length"!==t.path&&t.value&&[...this.$.items.children].forEach((t=>{(t.hasAttribute("details-opened")||i&&this._isDetailsOpened(t._item))&&this._updateItem(t,t._item)}))}_configureDetailsCell(t){t.setAttribute("part","cell details-cell"),t.toggleAttribute("frozen",!0),this._detailsCellResizeObserver.observe(t)}_toggleDetailsCell(t,i){const e=t.querySelector('[part~="details-cell"]');e&&(e.hidden=!i,e.hidden||this.rowDetailsRenderer&&(e._renderer=this.rowDetailsRenderer))}_updateDetailsCellHeight(t){const i=t.querySelector('[part~="details-cell"]');i&&(this.xe(t,i),requestAnimationFrame((()=>this.xe(t,i))))}xe(t,i){i.hidden?t.style.removeProperty("padding-bottom"):t.style.setProperty("padding-bottom",`${i.offsetHeight}px`)}_updateDetailsCellHeights(){[...this.$.items.children].forEach((t=>{this._updateDetailsCellHeight(t)}))}_isDetailsOpened(t){return this.detailsOpenedItems&&-1!==this._getItemIndexInArray(t,this.detailsOpenedItems)}openItemDetails(t){this._isDetailsOpened(t)||(this.detailsOpenedItems=[...this.detailsOpenedItems,t])}closeItemDetails(t){this._isDetailsOpened(t)&&(this.detailsOpenedItems=this.detailsOpenedItems.filter((i=>!this._itemsEqual(i,t))))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,observer=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.resizables?t.target.resizables.forEach((i=>{i._onResize(t.contentRect)})):t.target._onResize(t.contentRect)}))}))})),ResizeMixin=dedupingMixin((t=>class extends t{connectedCallback(){if(super.connectedCallback(),observer.observe(this),this._observeParent){const t=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;t.resizables||(t.resizables=new Set,observer.observe(t)),t.resizables.add(this),this.ze=t}}disconnectedCallback(){super.disconnectedCallback(),observer.unobserve(this);const t=this.ze;if(this._observeParent&&t){const i=t.resizables;i&&(i.delete(this),0===i.size&&observer.unobserve(t)),this.ze=null}}get _observeParent(){return!1}_onResize(t){}notifyResize(){console.warn("WARNING: Since Vaadin 23, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}})),timeouts={SCROLLING:500},ScrollMixin=t=>class extends(ResizeMixin(t)){static get properties(){return{_frozenCells:{type:Array,value:()=>[]},_frozenToEndCells:{type:Array,value:()=>[]},_rowWithFocusedElement:Element}}get _scrollTop(){return this.$.table.scrollTop}set _scrollTop(t){this.$.table.scrollTop=t}get _scrollLeft(){return this.$.table.scrollLeft}ready(){super.ready(),this.scrollTarget=this.$.table,this.$.items.addEventListener("focusin",(t=>{const i=t.composedPath().indexOf(this.$.items);this._rowWithFocusedElement=t.composedPath()[i-1]})),this.$.items.addEventListener("focusout",(()=>{this._rowWithFocusedElement=void 0})),this.$.table.addEventListener("scroll",(()=>this._afterScroll()))}_onResize(){if(this._updateOverflow(),this.Te(),this._firefox){const t=!isElementHidden(this);t&&!1===this.Ge&&(this._scrollTop=this.ke||0),this.Ge=t}}scrollToIndex(t){t=Math.min(this._effectiveSize-1,Math.max(0,t)),this.De.scrollToIndex(t),this.pe(t)}pe(t){const i=[...this.$.items.children].find((i=>i.index===t));if(i){const t=i.getBoundingClientRect(),e=this.$.footer.getBoundingClientRect().top,o=this.$.header.getBoundingClientRect().bottom;t.bottom>e?this.$.table.scrollTop+=t.bottom-e:t.top<o&&(this.$.table.scrollTop-=o-t.top)}}_scheduleScrolling(){this._scrollingFrame||(this._scrollingFrame=requestAnimationFrame((()=>this.$.scroller.toggleAttribute("scrolling",!0)))),this._debounceScrolling=Debouncer.debounce(this._debounceScrolling,timeOut.after(timeouts.SCROLLING),(()=>{cancelAnimationFrame(this._scrollingFrame),delete this._scrollingFrame,this.$.scroller.toggleAttribute("scrolling",!1)}))}_afterScroll(){if(this.Te(),this.hasAttribute("reordering")||this._scheduleScrolling(),this.hasAttribute("navigating")||this._hideTooltip(!0),this._updateOverflow(),this._firefox){!isElementHidden(this)&&!1!==this.Ge&&(this.ke=this._scrollTop)}}_updateOverflow(){let t="";const i=this.$.table;i.scrollTop<i.scrollHeight-i.clientHeight&&(t+=" bottom"),i.scrollTop>0&&(t+=" top");const e=this.Qt(i);e>0&&(t+=" start"),e<i.scrollWidth-i.clientWidth&&(t+=" end"),this.Ki&&(t=t.replace(/start|end/gi,(t=>"start"===t?"end":"start"))),i.scrollLeft<i.scrollWidth-i.clientWidth&&(t+=" right"),i.scrollLeft>0&&(t+=" left"),this._debounceOverflow=Debouncer.debounce(this._debounceOverflow,animationFrame,(()=>{const i=t.trim();i.length>0&&this.getAttribute("overflow")!==i?this.setAttribute("overflow",i):0===i.length&&this.hasAttribute("overflow")&&this.removeAttribute("overflow")}))}_frozenCellsChanged(){this._debouncerCacheElements=Debouncer.debounce(this._debouncerCacheElements,microTask,(()=>{Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach((t=>{t.style.transform=""})),this._frozenCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen]")),this._frozenToEndCells=Array.prototype.slice.call(this.$.table.querySelectorAll("[frozen-to-end]")),this.Te()})),this._debounceUpdateFrozenColumn()}_debounceUpdateFrozenColumn(){this.We=Debouncer.debounce(this.We,microTask,(()=>this._updateFrozenColumn()))}_updateFrozenColumn(){if(!this._columnTree)return;const t=this._columnTree[this._columnTree.length-1].slice(0);let i,e;t.sort(((t,i)=>t._order-i._order));for(let o=0;o<t.length;o++){const s=t[o];s._lastFrozen=!1,s._firstFrozenToEnd=!1,void 0===e&&s.frozenToEnd&&!s.hidden&&(e=o),s.frozen&&!s.hidden&&(i=o)}void 0!==i&&(t[i]._lastFrozen=!0),void 0!==e&&(t[e]._firstFrozenToEnd=!0)}Te(){const t=this.$.table.scrollWidth,i=this.$.table.clientWidth,e=Math.max(0,this.$.table.scrollLeft),o=this.Qt(this.$.table),s=`translate(${-e}px, 0)`;this.$.header.style.transform=s,this.$.footer.style.transform=s,this.$.items.style.transform=s;const n=this.Ki?o+i-t:e,r=`translate(${n}px, 0)`;for(let t=0;t<this._frozenCells.length;t++)this._frozenCells[t].style.transform=r;const a=`translate(${this.Ki?o:e+i-t}px, 0)`;for(let t=0;t<this._frozenToEndCells.length;t++)this._frozenToEndCells[t].style.transform=a;this.hasAttribute("navigating")&&this.Ce&&this.$.table.style.setProperty("--_grid-horizontal-scroll-position",-n+"px")}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,SelectionMixin=t=>class extends t{static get properties(){return{selectedItems:{type:Object,notify:!0,value:()=>[]},Le:{type:Object,computed:"__computeSelectedKeys(itemIdPath, selectedItems.*)"}}}static get observers(){return["__selectedItemsChanged(itemIdPath, selectedItems.*)"]}_isSelected(t){return this.Le.has(this.getItemId(t))}selectItem(t){this._isSelected(t)||(this.selectedItems=[...this.selectedItems,t])}deselectItem(t){this._isSelected(t)&&(this.selectedItems=this.selectedItems.filter((i=>!this._itemsEqual(i,t))))}_toggleItem(t){this._isSelected(t)?this.deselectItem(t):this.selectItem(t)}Ye(){this.requestContentUpdate()}Se(t,i){const e=i.base||[],o=new Set;return e.forEach((t=>{o.add(this.getItemId(t))})),o}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let defaultMultiSortPriority="prepend";const SortMixin=t=>class extends t{static get properties(){return{multiSort:{type:Boolean,value:!1},multiSortPriority:{type:String,value:()=>defaultMultiSortPriority},multiSortOnShiftClick:{type:Boolean,value:!1},_sorters:{type:Array,value:()=>[]},_previousSorters:{type:Array,value:()=>[]}}}static setDefaultMultiSortPriority(t){defaultMultiSortPriority=["append","prepend"].includes(t)?t:"prepend"}ready(){super.ready(),this.addEventListener("sorter-changed",this._onSorterChanged)}_onSorterChanged(t){const i=t.target;t.stopPropagation(),i._grid=this,this.Re(i,t.detail.shiftClick,t.detail.fromSorterClick),this.He()}ge(t){0!==t.length&&(this._sorters=this._sorters.filter((i=>t.indexOf(i)<0)),this.multiSort&&this.Be(),this.He())}Be(){this._sorters.forEach(((t,i)=>{t._order=this._sorters.length>1?i:null}))}Xe(t){t.direction?this._sorters.includes(t)||this._sorters.push(t):this._removeArrayItem(this._sorters,t),this.Be()}Je(t){this._removeArrayItem(this._sorters,t),t.direction&&this._sorters.unshift(t),this.Be()}Re(t,i,e){if(t.direction||-1!==this._sorters.indexOf(t))if(t._order=null,this.multiSort&&(!this.multiSortOnShiftClick||!e)||this.multiSortOnShiftClick&&i)"append"===this.multiSortPriority?this.Xe(t):this.Je(t);else if(t.direction||this.multiSortOnShiftClick){const i=this._sorters.filter((i=>i!==t));this._sorters=t.direction?[t]:[],i.forEach((t=>{t._order=null,t.direction=null}))}}He(){this.dataProvider&&this.isAttached&&JSON.stringify(this._previousSorters)!==JSON.stringify(this._mapSorters())&&this.clearCache(),this._a11yUpdateSorters(),this._previousSorters=this._mapSorters()}_mapSorters(){return this._sorters.map((t=>({path:t.path,direction:t.direction})))}_removeArrayItem(t,i){const e=t.indexOf(i);e>-1&&t.splice(e,1)}}
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,StylingMixin=t=>class extends t{static get properties(){return{cellClassNameGenerator:Function}}static get observers(){return["__cellClassNameGeneratorChanged(cellClassNameGenerator)"]}Ue(){this.generateCellClassNames()}generateCellClassNames(){Array.from(this.$.items.children).filter((t=>!t.hidden&&!t.hasAttribute("loading"))).forEach((t=>this._generateCellClassNames(t,this.mi(t))))}_generateCellClassNames(t,i){Array.from(t.children).forEach((t=>{if(t.Pe&&t.Pe.forEach((i=>t.classList.remove(i))),this.cellClassNameGenerator){const e=this.cellClassNameGenerator(t._column,i);t.Pe=e&&e.split(" ").filter((t=>t.length>0)),t.Pe&&t.Pe.forEach((i=>t.classList.add(i)))}}))}}
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
    `}static get is(){return"vaadin-grid"}static get observers(){return["_columnTreeChanged(_columnTree, _columnTree.*)","_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)"]}static get properties(){return{_safari:{type:Boolean,value:isSafari},_ios:{type:Boolean,value:isIOS},_firefox:{type:Boolean,value:isFirefox},_android:{type:Boolean,value:isAndroid},_touchDevice:{type:Boolean,value:isTouch},allRowsVisible:{type:Boolean,value:!1,reflectToAttribute:!0},_recalculateColumnWidthOnceLoadingFinished:{type:Boolean,value:!0},isAttached:{value:!1},Ve:{type:Boolean,value:!0}}}constructor(){super(),this.addEventListener("animationend",this._onAnimationEnd)}connectedCallback(){super.connectedCallback(),this.isAttached=!0,this.recalculateColumnWidths()}disconnectedCallback(){super.disconnectedCallback(),this.isAttached=!1,this._hideTooltip(!0)}Oe(){return this._getVisibleRows().find((t=>this._isInViewport(t)))}get _firstVisibleIndex(){const t=this.Oe();return t?t.index:void 0}Qe(){return this._getVisibleRows().reverse().find((t=>this._isInViewport(t)))}get _lastVisibleIndex(){const t=this.Qe();return t?t.index:void 0}_isInViewport(t){const i=this.$.table.getBoundingClientRect(),e=t.getBoundingClientRect(),o=this.$.header.getBoundingClientRect().height,s=this.$.footer.getBoundingClientRect().height;return e.bottom>i.top+o&&e.top<i.bottom-s}_getVisibleRows(){return Array.from(this.$.items.children).filter((t=>!t.hidden)).sort(((t,i)=>t.index-i.index))}ready(){super.ready(),this.De=new Virtualizer({createElements:this._createScrollerRows.bind(this),updateElement:this._updateScrollerItem.bind(this),scrollContainer:this.$.items,scrollTarget:this.$.table,reorderElements:!0}),new ResizeObserver((()=>setTimeout((()=>{this.Ee(),this._recalculateColumnWidthOnceVisible&&(this._recalculateColumnWidthOnceVisible=!1,this.recalculateColumnWidths())})))).observe(this.$.table),processTemplates(this),this._tooltipController=new TooltipController(this),this.addController(this._tooltipController),this._tooltipController.setManual(!0)}attributeChangedCallback(t,i,e){super.attributeChangedCallback(t,i,e),"dir"===t&&(this.Ki="rtl"===e)}Ke(t){if(this.$.items.contains(t)&&"td"===t.localName)return{item:t.parentElement._item,column:t._column}}Fe({item:t,column:i}){const e=this._getVisibleRows().find((i=>i._item===t)),o=e&&[...e.children].find((t=>t._column===i));o&&o.focus()}_effectiveSizeChanged(t,i,e,o){if(i&&e&&o){const e=this.shadowRoot.activeElement,o=this.Ke(e);i.size=t,i.update(),i.flush(),o&&e.parentElement.hidden&&this.Fe(o),this._resetKeyboardNavigation()}}_e(){return!!Array.from(this.$.items.children).filter((t=>t.clientHeight)).length}ie(){this._recalculateColumnWidthOnceLoadingFinished&&!this._cache.isLoading()&&this._e()&&(this._recalculateColumnWidthOnceLoadingFinished=!1,this.recalculateColumnWidths())}$e(t){if(this.qe.has(t))return this.qe.get(t);const i=this.io(t);return this.qe.set(t,i),i}io(t){const i=t.width,e=t.flexGrow;t.width="auto",t.flexGrow=0;const o=t._allCells.filter((t=>!this.$.items.contains(t)||this._isInViewport(t.parentElement))).reduce(((t,i)=>Math.max(t,i.offsetWidth+1)),0);return t.flexGrow=e,t.width=i,o}eo(t,i){if(null==t||t===this)return 0;const e=Math.max(this.$e(t),this.eo((t.assignedSlot||t).parentElement,t));if(!i)return e;const o=e,s=t._visibleChildColumns.map((t=>this.$e(t))).reduce(((t,i)=>t+i),0),n=Math.max(0,o-s),r=this.$e(i)/s*n;return this.$e(i)+r}_recalculateColumnWidths(t){this.De.flush(),[...this.$.header.children,...this.$.footer.children].forEach((t=>{t.bi&&t.bi.flush()})),this._debouncerHiddenChanged&&this._debouncerHiddenChanged.flush(),this.qe=new Map,t.forEach((t=>{t.width=`${this.eo(t)}px`}))}recalculateColumnWidths(){if(!this._columnTree)return;if(isElementHidden(this))return void(this._recalculateColumnWidthOnceVisible=!0);if(this._cache.isLoading())return void(this._recalculateColumnWidthOnceLoadingFinished=!0);const t=this._getColumns().filter((t=>!t.hidden&&t.autoWidth));this._recalculateColumnWidths(t)}_createScrollerRows(t){const i=[];for(let e=0;e<t;e++){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this._columnTree&&this._updateRow(t,this._columnTree[this._columnTree.length-1],"body",!1,!0),i.push(t)}return this._columnTree&&this._columnTree[this._columnTree.length-1].forEach((t=>t.isConnected&&t.notifyPath&&t.notifyPath("_cells.*",t._cells))),beforeNextRender(this,(()=>{this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._afterScroll(),this.ie()})),i}_createCell(t,i){const e=`vaadin-grid-cell-content-${this._contentIndex=this._contentIndex+1||0}`,o=document.createElement("vaadin-grid-cell-content");o.setAttribute("slot",e);const s=document.createElement(t);s.id=e.replace("-content-","-"),s.setAttribute("role","td"===t?"gridcell":"columnheader"),isAndroid||isIOS||(s.addEventListener("mouseenter",(t=>{this.$.scroller.hasAttribute("scrolling")||this._showTooltip(t)})),s.addEventListener("mouseleave",(()=>{this._hideTooltip()})),s.addEventListener("mousedown",(()=>{this._hideTooltip(!0)})));const n=document.createElement("slot");if(n.setAttribute("name",e),i&&i._focusButtonMode){const t=document.createElement("div");t.setAttribute("role","button"),t.setAttribute("tabindex","-1"),s.appendChild(t),s._focusButton=t,s.focus=function(){s._focusButton.focus()},t.appendChild(n)}else s.setAttribute("tabindex","-1"),s.appendChild(n);return s._content=o,o.addEventListener("mousedown",(()=>{if(isChrome){const t=i=>{const e=o.contains(this.getRootNode().activeElement),n=i.composedPath().includes(o);!e&&n&&s.focus(),document.removeEventListener("mouseup",t,!0)};document.addEventListener("mouseup",t,!0)}else setTimeout((()=>{o.contains(this.getRootNode().activeElement)||s.focus()}))})),s}_updateRow(t,i,e,o,s){e=e||"body";const n=document.createDocumentFragment();Array.from(t.children).forEach((t=>{t._vacant=!0})),t.innerHTML="",i.filter((t=>!t.hidden)).forEach(((i,r,a)=>{let I;if("body"===e){if(i._cells=i._cells||[],I=i._cells.find((t=>t._vacant)),I||(I=this._createCell("td",i),i._cells.push(I)),I.setAttribute("part","cell body-cell"),t.appendChild(I),t===this.$.sizer&&(i._sizerCell=I),r===a.length-1&&this.rowDetailsRenderer){this._detailsCells=this._detailsCells||[];const i=this._detailsCells.find((t=>t._vacant))||this._createCell("td");-1===this._detailsCells.indexOf(i)&&this._detailsCells.push(i),i._content.parentElement||n.appendChild(i._content),this._configureDetailsCell(i),t.appendChild(i),this._a11ySetRowDetailsCell(t,i),i._vacant=!1}i.notifyPath&&!s&&i.notifyPath("_cells.*",i._cells)}else{const s="header"===e?"th":"td";o||"vaadin-grid-column-group"===i.localName?(I=i[`_${e}Cell`]||this._createCell(s),I._column=i,t.appendChild(I),i[`_${e}Cell`]=I):(i._emptyCells=i._emptyCells||[],I=i._emptyCells.find((t=>t._vacant))||this._createCell(s),I._column=i,t.appendChild(I),-1===i._emptyCells.indexOf(I)&&i._emptyCells.push(I)),I.setAttribute("part",`cell ${e}-cell`)}I._content.parentElement||n.appendChild(I._content),I._vacant=!1,I._column=i})),"body"!==e&&this.bi(t),this.appendChild(n),this._frozenCellsChanged(),this._updateFirstAndLastColumnForRow(t)}bi(t){t.bi=Debouncer.debounce(t.bi,microTask,(()=>this.oo(t)))}oo(t){if(!t)return;const i=Array.from(t.children).filter((i=>{const e=i._column;if(e._emptyCells&&e._emptyCells.indexOf(i)>-1)return!1;if(t.parentElement===this.$.header){if(e.headerRenderer)return!0;if(null===e.header)return!1;if(e.path||void 0!==e.header)return!0}else if(e.footerRenderer)return!0;return!1}));t.hidden!==!i.length&&(t.hidden=!i.length),this._resetKeyboardNavigation()}_updateScrollerItem(t,i){this._preventScrollerRotatingCellFocus(t,i),this._columnTree&&(t.toggleAttribute("first",0===i),t.toggleAttribute("last",i===this._effectiveSize-1),t.toggleAttribute("odd",i%2),this._a11yUpdateRowRowindex(t,i),this._getItem(i,t))}_columnTreeChanged(t){this._renderColumnTree(t),this.recalculateColumnWidths()}_renderColumnTree(t){for(Array.from(this.$.items.children).forEach((i=>this._updateRow(i,t[t.length-1],null,!1,!0)));this.$.header.children.length<t.length;){const t=document.createElement("tr");t.setAttribute("part","row"),t.setAttribute("role","row"),t.setAttribute("tabindex","-1"),this.$.header.appendChild(t);const i=document.createElement("tr");i.setAttribute("part","row"),i.setAttribute("role","row"),i.setAttribute("tabindex","-1"),this.$.footer.appendChild(i)}for(;this.$.header.children.length>t.length;)this.$.header.removeChild(this.$.header.firstElementChild),this.$.footer.removeChild(this.$.footer.firstElementChild);Array.from(this.$.header.children).forEach(((i,e)=>this._updateRow(i,t[e],"header",e===t.length-1))),Array.from(this.$.footer.children).forEach(((i,e)=>this._updateRow(i,t[t.length-1-e],"footer",0===e))),this._updateRow(this.$.sizer,t[t.length-1]),this._resizeHandler(),this._frozenCellsChanged(),this._updateFirstAndLastColumn(),this._resetKeyboardNavigation(),this._a11yUpdateHeaderRows(),this._a11yUpdateFooterRows(),this.Ee(),this.generateCellClassNames(),this.so()}Ee(){this._firefox&&parseFloat(navigator.userAgent.match(/Firefox\/(\d{2,3}.\d)/)[1])<99&&(this.$.items.style.paddingBottom=0,this.allRowsVisible||(this.$.items.style.paddingBottom=`${this.$.footer.offsetHeight}px`))}_updateItem(t,i){t._item=i;const e=this.mi(t);this._toggleDetailsCell(t,e.detailsOpened),this._a11yUpdateRowLevel(t,e.level),this._a11yUpdateRowSelected(t,e.selected),t.toggleAttribute("expanded",e.expanded),t.toggleAttribute("selected",e.selected),t.toggleAttribute("details-opened",e.detailsOpened),this._generateCellClassNames(t,e),this._filterDragAndDrop(t,e),Array.from(t.children).forEach((t=>{if(t._renderer){const i=t._column||this;t._renderer.call(i,t._content,i,e)}})),this._updateDetailsCellHeight(t),this._a11yUpdateRowExpanded(t,e.expanded)}_resizeHandler(){this._updateDetailsCellHeights(),this.Ee(),this.Te()}_onAnimationEnd(t){0===t.animationName.indexOf("vaadin-grid-appear")&&(t.stopPropagation(),this.ie(),requestAnimationFrame((()=>{this.qi()})))}mi(t){return{index:t.index,item:t._item,level:this._getIndexLevel(t.index),expanded:this._isExpanded(t._item),selected:this._isSelected(t._item),detailsOpened:!!this.rowDetailsRenderer&&this._isDetailsOpened(t._item)}}_showTooltip(t){const i=this._tooltipController.node;i&&i.isConnected&&(this._tooltipController.setTarget(t.target),this._tooltipController.setContext(this.getEventContext(t)),i._stateController.open({focus:"focusin"===t.type,hover:"mouseenter"===t.type}))}_hideTooltip(t){const i=this._tooltipController.node;i&&i._stateController.close(t)}requestContentUpdate(){this.so(),this._i()}so(){(this._columnTree||[]).forEach((t=>{t.forEach((t=>{t._renderHeaderAndFooter&&t._renderHeaderAndFooter()}))}))}_i(t,i){this.De&&this.De.update(t,i)}notifyResize(){console.warn("WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.")}}customElements.define(Grid.is,Grid);
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
class GridSelectionColumn extends GridColumn{static get is(){return"vaadin-grid-selection-column"}static get properties(){return{width:{type:String,value:"58px"},flexGrow:{type:Number,value:0},selectAll:{type:Boolean,value:!1,notify:!0},autoSelect:{type:Boolean,value:!1},no:Boolean,ro:Object,ao:Boolean}}static get observers(){return["__onSelectAllChanged(selectAll)","_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, __indeterminate, __selectAllHidden)"]}constructor(){super(),this.Io=this.lo.bind(this),this.co=this.do.bind(this),this.ho=this.Co.bind(this)}disconnectedCallback(){this._grid.removeEventListener("active-item-changed",this.Io),this._grid.removeEventListener("data-provider-changed",this.co),this._grid.removeEventListener("filter-changed",this.ho),this._grid.removeEventListener("selected-items-changed",this.ho),super.disconnectedCallback()}connectedCallback(){super.connectedCallback(),this._grid&&(this._grid.addEventListener("active-item-changed",this.Io),this._grid.addEventListener("data-provider-changed",this.co),this._grid.addEventListener("filter-changed",this.ho),this._grid.addEventListener("selected-items-changed",this.ho))}_defaultHeaderRenderer(t,i){let e=t.firstElementChild;e||(e=document.createElement("vaadin-checkbox"),e.setAttribute("aria-label","Select All"),e.classList.add("vaadin-grid-select-all-checkbox"),e.addEventListener("checked-changed",this.Ao.bind(this)),t.appendChild(e));const o=this.uo(this.selectAll,this.no);e.mo=o,e.checked=o,e.hidden=this.ao,e.indeterminate=this.no}_defaultRenderer(t,i,{item:e,selected:o}){let s=t.firstElementChild;s||(s=document.createElement("vaadin-checkbox"),s.setAttribute("aria-label","Select Row"),s.addEventListener("checked-changed",this.bo.bind(this)),t.appendChild(s)),s.po=e,s.mo=o,s.checked=o}Zo(t){void 0!==t&&this._grid&&(this.Mo?this._selectAllChangeLock||(t&&this.No()?this.vo((t=>{this._grid.selectedItems=t})):this._grid.selectedItems=[]):this.Mo=!0)}yo(t,i){return Array.isArray(t)&&Array.isArray(i)&&i.every((i=>t.includes(i)))}Ao(t){t.target.checked!==t.target.mo&&(this.selectAll=this.no||t.target.checked)}bo(t){t.target.checked!==t.target.mo&&(t.target.checked?this._grid.selectItem(t.target.po):this._grid.deselectItem(t.target.po))}uo(t,i){return i||t}lo(t){const i=t.detail.value;if(this.autoSelect){const t=i||this.ro;t&&this._grid._toggleItem(t)}this.ro=i}No(){return Array.isArray(this._grid.items)&&!!this._grid.dataProvider}Co(){this._selectAllChangeLock=!0,this.No()&&this.vo((t=>{this._grid.selectedItems.length?this.yo(this._grid.selectedItems,t)?(this.selectAll=!0,this.no=!1):(this.selectAll=!1,this.no=!0):(this.selectAll=!1,this.no=!1)})),this._selectAllChangeLock=!1}do(){this.ao=!Array.isArray(this._grid.items)}vo(t){const i={page:0,pageSize:1/0,sortOrders:[],filters:this._grid._mapFilters()};this._grid.dataProvider(i,(i=>t(i)))}}customElements.define(GridSelectionColumn.is,GridSelectionColumn),registerStyles("vaadin-input-container",i$3`
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
    `}static get properties(){return{disabled:{type:Boolean,reflectToAttribute:!0},readonly:{type:Boolean,reflectToAttribute:!0},invalid:{type:Boolean,reflectToAttribute:!0}}}ready(){super.ready(),this.addEventListener("pointerdown",(t=>{t.target===this&&t.preventDefault()})),this.addEventListener("click",(t=>{t.target===this&&this.shadowRoot.querySelector("slot:not([name])").assignedNodes({flatten:!0}).forEach((t=>t.focus&&t.focus()))}))}}customElements.define(InputContainer.is,InputContainer);
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
class ErrorController extends SlotController{constructor(t){super(t,"error-message",(()=>document.createElement("div")),((t,i)=>{this.jo(i),this.wo()}),!0)}get errorId(){return this.node&&this.node.id}setErrorMessage(t){this.errorMessage=t,this.wo()}setInvalid(t){this.invalid=t,this.wo()}initCustomNode(t){this.jo(t),t.textContent&&!this.errorMessage&&(this.errorMessage=t.textContent.trim()),this.wo()}teardownNode(t){let i=this.getSlotChild();i||t===this.defaultNode||(i=this.attachDefaultNode(),this.initNode(i)),this.wo()}ni(t){return Boolean(t&&""!==t.trim())}wo(){const t=this.node,i=Boolean(this.invalid&&this.ni(this.errorMessage));t&&(t.textContent=i?this.errorMessage:"",t.hidden=!i,i?t.setAttribute("role","alert"):t.removeAttribute("role")),this.host.toggleAttribute("has-error-message",i)}jo(t){t.id||(t.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class FieldAriaController{constructor(t){this.host=t,this.To=!1}setTarget(t){this.fo=t,this.Oo(this.To),this.Do(this.xo),this.zo(this.Go),this.ko(this.Wo)}setRequired(t){this.Oo(t),this.To=t}setLabelId(t){this.Do(t,this.xo),this.xo=t}setErrorId(t){this.zo(t,this.Go),this.Go=t}setHelperId(t){this.ko(t,this.Wo),this.Wo=t}get Lo(){return this.fo===this.host}Do(t,i){this.Yo("aria-labelledby",t,i)}zo(t,i){this.Lo?this.Yo("aria-labelledby",t,i):this.Yo("aria-describedby",t,i)}ko(t,i){this.Lo?this.Yo("aria-labelledby",t,i):this.Yo("aria-describedby",t,i)}Oo(t){this.fo&&(["input","textarea"].includes(this.fo.localName)||(t?this.fo.setAttribute("aria-required","true"):this.fo.removeAttribute("aria-required")))}Yo(t,i,e){this.fo&&(e&&removeValueFromAttribute(this.fo,t,e),i&&addValueToAttribute(this.fo,t,i))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class HelperController extends SlotController{constructor(t){super(t,"helper",null,null,!0)}get helperId(){return this.node&&this.node.id}initCustomNode(t){this.So(t),this.Ro(t);const i=this.Ho(t);this.Bo(i)}teardownNode(t){this.Xo&&this.Xo.disconnect();const i=this.getSlotChild();if(i&&i!==this.defaultNode){const t=this.Ho(i);this.Bo(t)}else this.Jo(this.helperText,i)}setHelperText(t){this.helperText=t;const i=this.getSlotChild();i&&i!==this.defaultNode||this.Jo(t,i)}Ho(t){return!!t&&(t.children.length>0||t.nodeType===Node.ELEMENT_NODE&&customElements.get(t.localName)||this.ni(t.textContent))}ni(t){return t&&""!==t.trim()}Jo(t,i){const e=this.ni(t);e&&!i&&(this.slotFactory=()=>document.createElement("div"),i=this.attachDefaultNode(),this.So(i),this.Ro(i)),i&&(i.textContent=t),this.Bo(e)}Ro(t){this.Uo=new MutationObserver((t=>{t.forEach((t=>{const i=t.target,e=i===this.node;if("attributes"===t.type)e&&i.id!==this.defaultId&&this.So(i);else if(e||i.parentElement===this.node){const t=this.Ho(this.node);this.Bo(t)}}))})),this.Uo.observe(t,{attributes:!0,attributeFilter:["id"],childList:!0,subtree:!0,characterData:!0})}Bo(t){this.host.toggleAttribute("has-helper",t),this.dispatchEvent(new CustomEvent("helper-changed",{detail:{hasHelper:t,node:this.node}}))}So(t){t.id||(t.id=this.defaultId)}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const ValidateMixin=dedupingMixin((t=>class extends t{static get properties(){return{invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},required:{type:Boolean,reflectToAttribute:!0}}}validate(){const t=this.checkValidity();return this._setInvalid(!t),this.dispatchEvent(new CustomEvent("validated",{detail:{valid:t}})),t}checkValidity(){return!this.required||!!this.value}_setInvalid(t){this._shouldSetInvalid(t)&&(this.invalid=t)}_shouldSetInvalid(t){return!0}})),FieldMixin=t=>class extends(ValidateMixin(LabelMixin(ControllerMixin(t)))){static get properties(){return{ariaTarget:{type:Object,observer:"_ariaTargetChanged"},errorMessage:{type:String,observer:"_errorMessageChanged"},helperText:{type:String,observer:"_helperTextChanged"}}}static get observers(){return["_invalidChanged(invalid)","_requiredChanged(required)"]}get _errorId(){return this._errorController.errorId}get _errorNode(){return this._errorController.node}get _helperId(){return this._helperController.helperId}get _helperNode(){return this._helperController.node}constructor(){super(),this._fieldAriaController=new FieldAriaController(this),this._helperController=new HelperController(this),this._errorController=new ErrorController(this),this._labelController.addEventListener("label-changed",(t=>{const{hasLabel:i,node:e}=t.detail;this.Po(i,e)})),this._helperController.addEventListener("helper-changed",(t=>{const{hasHelper:i,node:e}=t.detail;this.Vo(i,e)}))}ready(){super.ready(),this.addController(this._fieldAriaController),this.addController(this._helperController),this.addController(this._errorController)}Vo(t,i){t?this._fieldAriaController.setHelperId(i.id):this._fieldAriaController.setHelperId(null)}Po(t,i){t?this._fieldAriaController.setLabelId(i.id):this._fieldAriaController.setLabelId(null)}_errorMessageChanged(t){this._errorController.setErrorMessage(t)}_helperTextChanged(t){this._helperController.setHelperText(t)}_ariaTargetChanged(t){t&&this._fieldAriaController.setTarget(t)}_requiredChanged(t){this._fieldAriaController.setRequired(t)}_invalidChanged(t){this._errorController.setInvalid(t),setTimeout((()=>{t?this._fieldAriaController.setErrorId(this._errorController.errorId):this._fieldAriaController.setErrorId(null)}))}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,InputConstraintsMixin=dedupingMixin((t=>class extends(DelegateStateMixin(ValidateMixin(InputMixin(t)))){static get constraints(){return["required"]}static get delegateAttrs(){return[...super.delegateAttrs,"required"]}ready(){super.ready(),this._createConstraintsObserver()}checkValidity(){return this.inputElement&&this._hasValidConstraints(this.constructor.constraints.map((t=>this[t])))?this.inputElement.checkValidity():!this.invalid}_hasValidConstraints(t){return t.some((t=>this.Qo(t)))}_createConstraintsObserver(){this._createMethodObserver(`_constraintsChanged(stateTarget, ${this.constructor.constraints.join(", ")})`)}_constraintsChanged(t,...i){if(!t)return;const e=this._hasValidConstraints(i),o=this.Eo&&!e;(this._hasValue||this.invalid)&&e?this.validate():o&&this._setInvalid(!1),this.Eo=e}_onChange(t){t.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:t},bubbles:t.bubbles,cancelable:t.cancelable}))}Qo(t){return Boolean(t)||0===t}})),stylesMap=new WeakMap;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function getRootStyles(t){return stylesMap.has(t)||stylesMap.set(t,new Set),stylesMap.get(t)}function insertStyles(t,i){const e=document.createElement("style");e.textContent=t,i===document?document.head.appendChild(e):i.insertBefore(e,i.firstChild)}const SlotStylesMixin=dedupingMixin((t=>class extends t{get slotStyles(){return{}}connectedCallback(){super.connectedCallback(),this.Ko()}Ko(){const t=this.getRootNode(),i=getRootStyles(t);this.slotStyles.forEach((e=>{i.has(e)||(insertStyles(e,t),i.add(e))}))}})),InputControlMixin=t=>class extends(SlotStylesMixin(DelegateFocusMixin(InputConstraintsMixin(FieldMixin(KeyboardMixin(t)))))){static get properties(){return{allowedCharPattern:{type:String,observer:"_allowedCharPatternChanged"},autoselect:{type:Boolean,value:!1},clearButtonVisible:{type:Boolean,reflectToAttribute:!0,value:!1},name:{type:String,reflectToAttribute:!0},placeholder:{type:String,reflectToAttribute:!0},readonly:{type:Boolean,value:!1,reflectToAttribute:!0},title:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"name","type","placeholder","readonly","invalid","title"]}constructor(){super(),this._boundOnPaste=this._onPaste.bind(this),this._boundOnDrop=this._onDrop.bind(this),this._boundOnBeforeInput=this._onBeforeInput.bind(this)}get clearElement(){return console.warn(`Please implement the 'clearElement' property in <${this.localName}>`),null}get slotStyles(){return["\n          :is(input[slot='input'], textarea[slot='textarea'])::placeholder {\n            font: inherit;\n            color: inherit;\n          }\n        "]}ready(){super.ready(),this.clearElement&&(this.clearElement.addEventListener("click",(t=>this._onClearButtonClick(t))),this.clearElement.addEventListener("mousedown",(t=>this._onClearButtonMouseDown(t))))}_onClearButtonClick(t){t.preventDefault(),this.Fo()}_onClearButtonMouseDown(t){t.preventDefault(),isTouch||this.inputElement.focus()}_onFocus(t){super._onFocus(t),this.autoselect&&this.inputElement&&this.inputElement.select()}_onEscape(t){super._onEscape(t),this.clearButtonVisible&&this.value&&(t.stopPropagation(),this.Fo())}_onChange(t){t.stopPropagation(),this.validate(),this.dispatchEvent(new CustomEvent("change",{detail:{sourceEvent:t},bubbles:t.bubbles,cancelable:t.cancelable}))}Fo(){this.clear(),this.inputElement.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.inputElement.dispatchEvent(new Event("change",{bubbles:!0}))}_addInputListeners(t){super._addInputListeners(t),t.addEventListener("paste",this._boundOnPaste),t.addEventListener("drop",this._boundOnDrop),t.addEventListener("beforeinput",this._boundOnBeforeInput)}_removeInputListeners(t){super._removeInputListeners(t),t.removeEventListener("paste",this._boundOnPaste),t.removeEventListener("drop",this._boundOnDrop),t.removeEventListener("beforeinput",this._boundOnBeforeInput)}_onKeyDown(t){super._onKeyDown(t),this.allowedCharPattern&&!this._o(t)&&(t.preventDefault(),this._markInputPrevented())}_markInputPrevented(){this.setAttribute("input-prevented",""),this._preventInputDebouncer=Debouncer.debounce(this._preventInputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")}))}_o(t){return t.metaKey||t.ctrlKey||!t.key||1!==t.key.length||this.$o.test(t.key)}_onPaste(t){if(this.allowedCharPattern){const i=t.clipboardData.getData("text");this.qo.test(i)||(t.preventDefault(),this._markInputPrevented())}}_onDrop(t){if(this.allowedCharPattern){const i=t.dataTransfer.getData("text");this.qo.test(i)||(t.preventDefault(),this._markInputPrevented())}}_onBeforeInput(t){this.allowedCharPattern&&t.data&&!this.qo.test(t.data)&&(t.preventDefault(),this._markInputPrevented())}_allowedCharPatternChanged(t){if(t)try{this.$o=new RegExp(`^${t}$`),this.qo=new RegExp(`^${t}*$`)}catch(t){console.error(t)}}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,InputFieldMixin=t=>class extends(InputControlMixin(t)){static get properties(){return{autocomplete:{type:String},autocorrect:{type:String},autocapitalize:{type:String,reflectToAttribute:!0}}}static get delegateAttrs(){return[...super.delegateAttrs,"autocapitalize","autocomplete","autocorrect"]}_inputElementChanged(t){super._inputElementChanged(t),t&&(t.value&&t.value!==this.value&&(console.warn(`Please define value on the <${this.localName}> component!`),t.value=""),this.value&&(t.value=this.value))}get F(){return this.ts||{}}set F(t){this.ts=t}_setFocused(t){super._setFocused(t),t||this.validate()}_onInput(t){super._onInput(t),this.invalid&&this.validate()}_valueChanged(t,i){super._valueChanged(t,i),void 0!==i&&this.invalid&&this.validate()}}
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,PatternMixin=t=>class extends(InputConstraintsMixin(t)){static get properties(){return{pattern:{type:String},preventInvalidInput:{type:Boolean,observer:"_preventInvalidInputChanged"}}}static get delegateAttrs(){return[...super.delegateAttrs,"pattern"]}static get constraints(){return[...super.constraints,"pattern"]}_checkInputValue(){if(this.preventInvalidInput){const t=this.inputElement;t&&t.value.length>0&&!this.checkValidity()&&(t.value=this.value||"",this.setAttribute("input-prevented",""),this._inputDebouncer=Debouncer.debounce(this._inputDebouncer,timeOut.after(200),(()=>{this.removeAttribute("input-prevented")})))}}_onInput(t){this._checkInputValue(),super._onInput(t)}_preventInvalidInputChanged(t){t&&console.warn('WARNING: Since Vaadin 23.2, "preventInvalidInput" is deprecated. Please use "allowedCharPattern" instead.')}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,t$1=window,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$3=new WeakMap;
/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let o$3=class{constructor(t,i,e){if(this._$cssResult$=!0,e!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(e$2&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n$3.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$3.set(i,t))}return t}toString(){return this.cssText}};const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$1=(t,...i)=>{const e=1===t.length?t[0]:i.reduce(((i,e,o)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[o+1]),t[0]);return new o$3(e,t,s$3)},S$1=(t,i)=>{e$2?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((i=>{const e=document.createElement("style"),o=t$1.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}))},c$1=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return r$2(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var s$2;const e$1=window,r$1=e$1.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$1.reactiveElementPolyfillSupport,n$2={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$2,reflect:!1,hasChanged:a$1},d$1="finalized";let u$1=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,e)=>{const o=this._$Ep(e,i);void 0!==o&&(this._$Ev.set(o,e),t.push(o))})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const e="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,e,i);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,i,e){return{get(){return this[i]},set(o){const s=this[t];this[i]=o,this.requestUpdate(t,s,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return!1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const e of i)this.createProperty(e,t[e])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(c$1(t))}else void 0!==t&&i.push(c$1(t));return i}static _$Ep(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,e;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(e=t.hostConnected)||void 0===e||e.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,e){this._$AK(t,e)}_$EO(t,i,e=l$2){var o;const s=this.constructor._$Ep(t,e);if(void 0!==s&&!0===e.reflect){const n=(void 0!==(null===(o=e.converter)||void 0===o?void 0:o.toAttribute)?e.converter:n$2).toAttribute(i,e.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,i){var e;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(e=t.converter)||void 0===e?void 0:e.fromAttribute)?t.converter:n$2;this._$El=s,this[s]=n.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,e){let o=!0;void 0!==t&&(((e=e||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===e.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,e))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const e=this._$AL;try{i=this.shouldUpdate(e),i?(this.willUpdate(e),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(e)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(e)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$1.reactiveElementVersions)&&void 0!==s$2?s$2:e$1.reactiveElementVersions=[]).push("1.6.3");const i=window,s$1=i.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$1=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$1,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const V=(t,i)=>{const e=t.length-1,o=[];let s,n=2===i?"<svg>":"",r=f;for(let i=0;i<e;i++){const e=t[i];let a,I,l=-1,c=0;for(;c<e.length&&(r.lastIndex=c,I=r.exec(e),null!==I);)c=r.lastIndex,r===f?"!--"===I[1]?r=_:void 0!==I[1]?r=m:void 0!==I[2]?(y.test(I[2])&&(s=RegExp("</"+I[2],"g")),r=p):void 0!==I[3]&&(r=p):r===p?">"===I[0]?(r=null!=s?s:f,l=-1):void 0===I[1]?l=-2:(l=r.lastIndex-I[2].length,a=I[1],r=void 0===I[3]?p:'"'===I[3]?$:g):r===$||r===g?r=p:r===_||r===m?r=f:(r=p,s=void 0);const d=r===p&&t[i+1].startsWith("/>")?" ":"";n+=r===f?e+h:l>=0?(o.push(a),e.slice(0,l)+o$1+e.slice(l)+n$1+d):e+n$1+(-2===l?(o.push(void 0),i):d)}return[P(t,n+(t[e]||"<?>")+(2===i?"</svg>":"")),o]};class N{constructor({strings:t,_$litType$:i},e){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[I,g]=V(t,i);if(this.el=N.createElement(I,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(o=C.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const i of o.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$1)){const e=g[n++];if(t.push(i),void 0!==e){const t=o.getAttribute(e.toLowerCase()+o$1).split(n$1),i=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k})}else a.push({type:6,index:s})}for(const i of t)o.removeAttribute(i)}if(y.test(o.tagName)){const t=o.textContent.split(n$1),i=t.length-1;if(i>0){o.textContent=s$1?s$1.emptyScript:"";for(let e=0;e<i;e++)o.append(t[e],u()),C.nextNode(),a.push({type:2,index:++s});o.append(t[i],u())}}}else if(8===o.nodeType)if(o.data===l$1)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(n$1,t+1));)a.push({type:7,index:s}),t+=n$1.length-1}s++}}static createElement(t,i){const e=r.createElement("template");return e.innerHTML=t,e}}function S(t,i,e=t,o){var s,n,r,a;if(i===T)return i;let I=void 0!==o?null===(s=e._$Co)||void 0===s?void 0:s[o]:e._$Cl;const g=d(i)?void 0:i._$litDirective$;return(null==I?void 0:I.constructor)!==g&&(null===(n=null==I?void 0:I._$AO)||void 0===n||n.call(I,!1),void 0===g?I=void 0:(I=new g(t),I._$AT(t,e,o)),void 0!==o?(null!==(r=(a=e)._$Co)&&void 0!==r?r:a._$Co=[])[o]=I:e._$Cl=I),void 0!==I&&(i=S(t,I._$AS(t,i.values),I,o)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:e},parts:o}=this._$AD,s=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(e,!0);C.currentNode=s;let n=C.nextNode(),a=0,I=0,g=o[0];for(;void 0!==g;){if(a===g.index){let i;2===g.type?i=new R(n,n.nextSibling,this,t):1===g.type?i=new g.ctor(n,g.name,g.strings,this,t):6===g.type&&(i=new Z(n,this,t)),this._$AV.push(i),g=o[++I]}a!==(null==g?void 0:g.index)&&(n=C.nextNode(),a++)}return C.currentNode=r,s}v(t){let i=0;for(const e of this._$AV)void 0!==e&&(void 0!==e.strings?(e._$AI(t,e,i),i+=e.strings.length-2):e._$AI(t[i])),i++}}class R{constructor(t,i,e,o){var s;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=e,this.options=o,this._$Cp=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t}g(t){var i;const{values:e,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=N.createElement(P(o.h,o.h[0]),this.options)),o);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===s)this._$AH.v(e);else{const t=new M(s,this),i=t.u(this.options);t.v(e),this.$(i),this._$AH=t}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let e,o=0;for(const s of t)o===i.length?i.push(e=new R(this.k(u()),this.k(u()),this,this.options)):e=i[o],e._$AI(s),o++;o<i.length&&(this._$AR(e&&e._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var e;for(null===(e=this._$AP)||void 0===e||e.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class k{constructor(t,i,e,o,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=s,e.length>2||""!==e[0]||""!==e[1]?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=A}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,e,o){const s=this.strings;let n=!1;if(void 0===s)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=S(this,o[e+r],i,r),a===T&&(a=this._$AH[r]),n||(n=!d(a)||a!==this._$AH[r]),a===A?t=A:t!==A&&(t+=(null!=a?a:"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class H extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name)}}class z extends k{constructor(t,i,e,o,s){super(t,i,e,o,s),this.type=5}_$AI(t,i=this){var e;if((t=null!==(e=S(this,t,i,0))&&void 0!==e?e:A)===T)return;const o=this._$AH,s=t===A&&o!==A||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==A&&(o===A||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,e;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}}const B=i.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i.litHtmlVersions)&&void 0!==t?t:i.litHtmlVersions=[]).push("2.8.0");const D=(t,i,e)=>{var o,s;const n=null!==(o=null==e?void 0:e.renderBefore)&&void 0!==o?o:i;let r=n._$litPart$;if(void 0===r){const t=null!==(s=null==e?void 0:e.renderBefore)&&void 0!==s?s:null;n._$litPart$=r=new R(i.insertBefore(u(),t),t,void 0,null!=e?e:{})}return r._$AI(t),r
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */};var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const e=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=e.firstChild),e}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n=globalThis.litElementPolyfillSupport;null==n||n({LitElement:s}),(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");
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
    `}static get properties(){return{maxlength:{type:Number},minlength:{type:Number}}}static get delegateAttrs(){return[...super.delegateAttrs,"maxlength","minlength"]}static get constraints(){return[...super.constraints,"maxlength","minlength"]}constructor(){super(),this._setType("text")}get clearElement(){return this.$.clearButton}ready(){super.ready(),this.addController(new InputController(this,(t=>{this._setInputElement(t),this._setFocusElement(t),this.stateTarget=t,this.ariaTarget=t}))),this.addController(new LabelledInputController(this.inputElement,this._labelController)),this._tooltipController=new TooltipController(this),this._tooltipController.setPosition("top"),this.addController(this._tooltipController)}}customElements.define(TextField.is,TextField);
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
    `}static get is(){return"vaadin-grid-filter"}static get properties(){return{path:String,value:{type:String,notify:!0},_connected:Boolean}}connectedCallback(){super.connectedCallback(),this._connected=!0}static get observers(){return["_filterChanged(path, value, _connected)"]}ready(){super.ready();const t=this.firstElementChild;t&&"filter"!==t.getAttribute("slot")&&(console.warn('Make sure you have assigned slot="filter" to the child elements of <vaadin-grid-filter>'),t.setAttribute("slot","filter"))}_filterChanged(t,i,e){void 0!==t&&void 0!==i&&e&&(void 0===this._previousValue&&""===i||(this._previousValue=i,this._debouncerFilterChanged=Debouncer.debounce(this._debouncerFilterChanged,timeOut.after(200),(()=>{this.dispatchEvent(new CustomEvent("filter-changed",{bubbles:!0}))}))))}focus(){this.$.filter.focus()}}customElements.define(GridFilter.is,GridFilter);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridFilterColumn extends GridColumn{static get is(){return"vaadin-grid-filter-column"}static get properties(){return{path:String,header:String}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)"]}constructor(){super(),this.es=this.os.bind(this)}_defaultHeaderRenderer(t,i){let e=t.firstElementChild,o=e?e.firstElementChild:void 0;e||(e=document.createElement("vaadin-grid-filter"),o=document.createElement("vaadin-text-field"),o.setAttribute("slot","filter"),o.setAttribute("theme","small"),o.setAttribute("style","max-width: 100%;"),o.setAttribute("focus-target",""),o.addEventListener("value-changed",this.es),e.appendChild(o),t.appendChild(e)),e.path=this.path,e.value=this._filterValue,o.ss=this._filterValue,o.value=this._filterValue,o.label=this.ns(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}os(t){t.detail.value!==t.target.ss&&(this._filterValue=t.detail.value)}ns(t,i){return t||(i?this._generateHeader(i):void 0)}}customElements.define(GridFilterColumn.is,GridFilterColumn),registerStyles("vaadin-grid-sorter",i$3`
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
    `}static get is(){return"vaadin-grid-sorter"}static get properties(){return{path:String,direction:{type:String,reflectToAttribute:!0,notify:!0,value:null},_order:{type:Number,value:null},_isConnected:{type:Boolean,observer:"__isConnectedChanged"}}}static get observers(){return["_pathOrDirectionChanged(path, direction)"]}ready(){super.ready(),this.addEventListener("click",this._onClick.bind(this))}connectedCallback(){super.connectedCallback(),this._isConnected=!0}disconnectedCallback(){super.disconnectedCallback(),this._isConnected=!1,!this.parentNode&&this._grid&&this._grid.ge([this])}_pathOrDirectionChanged(){this.Is()}gs(t,i){!1!==i&&this.Is()}Is(){void 0!==this.path&&void 0!==this.direction&&this._isConnected&&(this.dispatchEvent(new CustomEvent("sorter-changed",{detail:{shiftClick:Boolean(this._shiftClick),fromSorterClick:Boolean(this._fromSorterClick)},bubbles:!0,composed:!0})),this._fromSorterClick=!1,this._shiftClick=!1)}_getDisplayOrder(t){return null===t?"":t+1}_onClick(t){if(t.defaultPrevented)return;const i=this.getRootNode().activeElement;this!==i&&this.contains(i)||(t.preventDefault(),this._shiftClick=t.shiftKey,this._fromSorterClick=!0,"asc"===this.direction?this.direction="desc":"desc"===this.direction?this.direction=null:this.direction="asc")}}customElements.define(GridSorter.is,GridSorter);
/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class GridSortColumn extends GridColumn{static get is(){return"vaadin-grid-sort-column"}static get properties(){return{path:String,direction:{type:String,notify:!0}}}static get observers(){return["_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)"]}constructor(){super(),this.ls=this.cs.bind(this)}_defaultHeaderRenderer(t,i){let e=t.firstElementChild;e||(e=document.createElement("vaadin-grid-sorter"),e.addEventListener("direction-changed",this.ls),t.appendChild(e)),e.path=this.path,e.ds=this.direction,e.direction=this.direction,e.textContent=this.ns(this.header,this.path)}_computeHeaderRenderer(){return this._defaultHeaderRenderer}cs(t){t.detail.value!==t.target.ds&&(this.direction=t.detail.value)}ns(t,i){return t||(i?this._generateHeader(i):void 0)}}customElements.define(GridSortColumn.is,GridSortColumn);var __decorate$7=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpUsersGrid=class extends YpBaseElement{updated(t){super.updated(t),t.has("groupId")&&this._groupIdChanged(),t.has("communityId")&&this._communityIdChanged(),t.has("domainId")&&this._domainIdChanged(),t.has("adminUsers")&&this.users&&(this.showReload=!1,this._reload()),this._setupHeaderText()}static get styles(){return[super.styles,i$5`
        .userItem {
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

        .organization {
          width: 150px;
        }

        .addRemoveButtons {
          width: 150px;
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
      `]}renderSelectionHeader(t,i){j(x`
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
      `,t)}selectionRenderer(t,i,e){j(x`
        <div style="position: relative;">
          <md-icon-button
            .ariaLabel="${this.t("openOneItemMenu")}"
            data-args="${e.item.id}"
            id="user-item-${e.item.id}-anchor"
            @click="${this._setSelected.bind(this)}"
            ><md-icon>more_vert</md-icon></md-icon-button
          >
        </div>
        <md-menu
          .menuCorner="${Corner.START_END}"
          id="userItemMenu${e.item.id}"
          anchor="user-item-${e.item.id}-anchor"
          class="helpButton"
        >
          <md-menu-item
            data-args="${e.item.id}"
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
            data-args="${e.item.id}"
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
            data-args="${e.item.id}"
            ?hidden="${!this.adminUsers}"
            @click="${this._removeAdmin.bind(this)}"
          >
            ${this.t("users.removeAdmin")}
          </md-menu-item>

          <md-menu-item
            data-args="${e.item.id}"
            ?hidden="${this._userOrganizationName(e.item)}"
            @click="${this._addToOrganization.bind(this)}"
          >
            ${this.t("users.addToOrganization")}
          </md-menu-item>
          <md-menu-item
            data-args="${e.item.id}"
            ?hidden="${!this._userOrganizationName(e.item)}"
            data-args-org="${this._userOrganizationId(e.item)}"
            @click="${this._removeFromOrganization.bind(this)}"
          >
            ${this.t("users.removeFromOrganization")}
          </md-menu-item>
        </md-menu>
      `,t)}_reloadFromButton(){this.showReload=!1,this._reload()}render(){return x`
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
          .renderer="${(t,i,e)=>{t.innerHTML=`\n              <div\n                class="organization"\n                ?hidden="${!this._userOrganizationName(e.item)}"\n              >\n                <div class="organizationName">\n                  ${this._userOrganizationName(e.item)||""}\n                </div>\n              </div>\n            `}}"
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
                  ${this.availableOrganizations.map((t=>x`
                      <md-list-item
                        interactive
                        @click="${this._selectOrganization.bind(this)}"
                        id="${t.id}"
                        >${t.name}</md-list-item
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
    `}get spinnerActive(){return!this.totalUserCount||this.forceSpinner}async _generateRequest(t=void 0){t?this.lastFethedId=t:t=this.lastFethedId;const i=this.adminUsers?"admin_users":"users",e=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${t}/${i}`,"GET");this._usersResponse({detail:e})}async _ajaxError(t=void 0){this.forceSpinner=!1}constructor(t){super(),this.adminUsers=!1,this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.showReload=!1,this.forceSpinner=!1,this.inviteType="sendInviteByEmail",this.collectionName=t}connectedCallback(){super.connectedCallback(),this._setGridSize(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}async _reload(){try{await this._generateRequest(),this.forceSpinner=!0}catch(t){this._ajaxError()}finally{this.forceSpinner=!1}}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=window.setTimeout((()=>{this.resizeTimeout=void 0,this._setGridSize()}),66))}_setGridSize(){this.gridElement&&(window.innerWidth<=600?this.gridElement.style.height=`${window.innerHeight}px`:this.gridElement.style.height=.8*window.innerHeight+"px")}_menuSelection(t){const i=this.shadowRoot?.querySelectorAll("md-menu");i?.forEach((t=>{t.select("")}))}get totalUserCount(){return this.users?YpFormattingHelpers.number(this.users.length):null}_selectedUsersChanged(t){t.detail&&t.detail.value&&(this.selectedUsers=t.detail.value),this.selectedUsers&&this.selectedUsers.length>0?(this.selectedUsersEmpty=!1,this.selectedUsersCount=this.selectedUsers.length,this.selectedUserIds=this.selectedUsers.map((t=>t.id))):(this.selectedUsersEmpty=!0,this.selectedUsersCount=0,this.selectedUserIds=[])}_userOrganizationId(t){return t&&t.OrganizationUsers&&t.OrganizationUsers.length>0?t.OrganizationUsers[0].id:null}_userOrganizationName(t){return t&&t.OrganizationUsers&&t.OrganizationUsers.length>0?t.OrganizationUsers[0].name:null}_availableOrganizations(){return window.appUser.adminRights?.OrganizationAdmins||[]}async _addToOrganization(t){this.userIdForSelectingOrganization=parseInt(t.target.getAttribute("data-args")),this.availableOrganizations=this._availableOrganizations(),this.shadowRoot.getElementById("selectOrganizationDialog").show()}closeOrganizationDialog(){this.shadowRoot.getElementById("selectOrganizationDialog").close()}async _removeFromOrganization(t){const i=t.target,e=i.getAttribute("data-args"),o=i.getAttribute("data-args-org");try{await window.adminServerApi.removeUserFromOrganization(parseInt(o),parseInt(e)),this._reload()}catch(t){this._ajaxError(t)}}async _selectOrganization(t){const i=t.target.id;try{await window.adminServerApi.addUserToOrganization(parseInt(i),this.userIdForSelectingOrganization),this.shadowRoot.getElementById("selectOrganizationDialog").close(),this._reload()}catch(t){this._ajaxError(t)}}async _removeAdmin(t){const i=parseInt(t.target.getAttribute("data-args"));try{"groups"===this.modelType&&this.groupId?await window.adminServerApi.removeAdmin("groups",this.groupId,i):"communities"===this.modelType&&this.communityId?await window.adminServerApi.removeAdmin("communities",this.communityId,i):"domains"===this.modelType&&this.domainId?await window.adminServerApi.removeAdmin("domains",this.domainId,i):console.warn("Can't find model type or ids"),this._reload()}catch(t){this._ajaxError(t)}}_removeSelectedAdmins(t){this._setupUserIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToRemoveAdmins"),this._reallyRemoveSelectedAdmins.bind(this),!0,!1)}))}_removeAndDeleteContentSelectedUsers(t){this._setupUserIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureRemoveAndDeleteSelectedUserContent"),this._reallyRemoveAndDeleteContentSelectedUsers.bind(this),!0,!0)}))}_removeSelectedUsersFromCollection(t){this._setupUserIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureRemoveSelectedUsers"),this._reallyRemoveSelectedUsersFromCollection.bind(this),!0,!0)}))}_removeUserFromCollection(t){this._setupUserIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureRemoveUser"),this._reallyRemoveUserFromCollection.bind(this),!0,!1)}))}_removeAndDeleteUserContent(t){this._setupUserIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureRemoveAndDeleteUser"),this._reallyRemoveAndDeleteUserContent.bind(this),!0,!0)}))}async _removeMaster(t,i=void 0){let e,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else{if("domains"!==this.modelType||!this.domainId)return void console.error("Can't find model type or ids");o=this.domainId}if(i&&i.length>0)e=`/api/${this.modelType}/${o}/${t}`;else{if(!this.selectedUserId)return void console.error("No user ids to remove");e=`/api/${this.modelType}/${o}/${this.selectedUserId}/${t}`}const s=i?{userIds:i}:{};try{this.forceSpinner=!0,await window.adminServerApi.adminMethod(e,"DELETE",s),this._manyItemsResponse(!0)}catch(t){console.error(t),this._ajaxError(t)}finally{this.forceSpinner=!1}if(this.selectedUserId){const t=this._findUserFromId(this.selectedUserId);t&&this.gridElement instanceof GridElement&&this.gridElement.deselectItem(t)}}async _reallyRemoveSelectedAdmins(){await this._removeMaster("remove_many_admins",this.selectedUserIds)}async _reallyRemoveAndDeleteContentSelectedUsers(){await this._removeMaster("remove_many_users_and_delete_content",this.selectedUserIds)}async _reallyRemoveSelectedUsersFromCollection(){await this._removeMaster("remove_many_users",this.selectedUserIds)}async _reallyRemoveUserFromCollection(){await this._removeMaster("remove_user")}async _reallyRemoveAndDeleteUserContent(){await this._removeMaster("remove_and_delete_user_content")}_setupUserIdFromEvent(t){const i=t.target;let e=i.parentElement.getAttribute("data-args");e||(e=i.getAttribute("data-args")),e&&(this.selectedUserId=parseInt(e))}_openAllMenu(t){this.$$("#allUsersMenu").open=!0}_setSelected(t){const i=t.target.getAttribute("data-args");if(i){const t=this._findUserFromId(parseInt(i));t&&this.$$("#grid").selectItem(t)}setTimeout((()=>{this.$$(`#userItemMenu${i}`).open=!0}))}_findUserFromId(t){let i;return this.users.forEach((e=>{e.id==t&&(i=e)})),i}async _addAdmin(t){try{let t;if("groups"===this.modelType&&this.groupId&&this.addAdminEmail)t=await window.adminServerApi.addAdmin("groups",this.groupId,this.addAdminEmail.value);else if("communities"===this.modelType&&this.communityId&&this.addAdminEmail&&this.addAdminEmail.value)t=await window.adminServerApi.addAdmin("communities",this.communityId,this.addAdminEmail.value);else{if(!("domains"===this.modelType&&this.domainId&&this.addAdminEmail&&this.addAdminEmail.value))return void console.warn("Can't find model type or ids");t=await window.adminServerApi.addAdmin("domains",this.domainId,this.addAdminEmail.value)}this._addAdminResponse()}catch(t){this._ajaxError(t)}}async _inviteUser(t){try{let t;if("groups"===this.modelType&&this.groupId&&this.inviteUserEmail&&this.inviteUserEmail.value)t=await window.adminServerApi.inviteUser("groups",this.groupId,this.inviteUserEmail.value,this.inviteType);else{if("communities"!==this.modelType||!this.communityId||!this.inviteUserEmail.value)return void console.warn("Can't find model type or ids");t=await window.adminServerApi.inviteUser("communities",this.communityId,this.inviteUserEmail.value,this.inviteType)}this._inviteUserResponse()}catch(t){this._ajaxError(t)}}_manyItemsResponse(t=!1){this.forceSpinner=!1,this.showReload=!0,t&&window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading")),setTimeout((()=>{this._reload()}),500)}_removeAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminRemoved")),this._reload()}_removeManyAdminResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeManyUsersResponse(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("removalsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeAndDeleteCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("removalAndDeletionInProgress"),void 0,!0,!1,!0)})),this._removeUserResponse()}_removeAndDeleteManyCompleted(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("removalsAndDeletionsInProgress"),void 0,!0,!1,!0)})),this._manyItemsResponse()}_removeUserResponse(){window.appGlobals.notifyUserViaToast(this.t("userRemoved")),this._reload()}_addAdminResponse(){window.appGlobals.notifyUserViaToast(this.t("adminAdded")+" "+this.addAdminEmail.value),this.addAdminEmail.value="",this._reload()}_addOrganizationResponse(t){window.appGlobals.notifyUserViaToast(this.t("organizationUserAdded")+" "+t.detail.response.email),this._reload()}_removeOrganizationResponse(t){window.appGlobals.notifyUserViaToast(this.t("organizationUserRemoved")+" "+t.detail.response.email),this._reload()}_inviteUserResponse(){window.appGlobals.notifyUserViaToast(this.t("users.userInvited")+" "+this.inviteUserEmail.value),this.$$("#inviteUserEmail").value="",this._reload()}_domainIdChanged(){this.domainId&&(this._reset(),this.modelType="domains",this._generateRequest(this.domainId))}_groupIdChanged(){this.groupId&&(this._reset(),this.modelType="groups",this._generateRequest(this.groupId))}_communityIdChanged(){this.communityId&&(this._reset(),this.modelType="communities",this._generateRequest(this.communityId))}_usersResponse(t){this.forceSpinner=!1,this.users=t.detail,this._resetSelectedAndClearCache()}setup(t,i,e,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.users=void 0,this.adminUsers=o,t&&(this.groupId=t),i&&(this.communityId=i),e&&(this.domainId=e),this._setupHeaderText()}_reset(){this.users=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedUsers=[],this.selectedUsersCount=0,this.selectedUsersEmpty=!0,this.$$("#grid").clearCache()}_setupHeaderText(){this.adminUsers?this.usersCountText=this.t("adminsCount"):this.usersCountText=this.t("usersCount"),this.groupId?this.adminUsers?this.headerText=this.t("group.admins"):this.headerText=this.t("group.users"):this.communityId?this.adminUsers?this.headerText=this.t("community.admins"):this.headerText=this.t("community.users"):this.domainId&&(this.adminUsers?this.headerText=this.t("domainAdmins"):this.headerText=this.t("domainUsers"))}};__decorate$7([e$7("#addAdminEmail")],YpUsersGrid.prototype,"addAdminEmail",void 0),__decorate$7([e$7("#inviteUserEmail")],YpUsersGrid.prototype,"inviteUserEmail",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"headerText",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"users",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"groupId",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"communityId",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"domainId",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"adminUsers",void 0),__decorate$7([n$8({type:Object})],YpUsersGrid.prototype,"selected",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"modelType",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"availableOrganizations",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"userIdForSelectingOrganization",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"selectedUsers",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"selectedUsersCount",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"selectedUsersEmpty",void 0),__decorate$7([n$8({type:Array})],YpUsersGrid.prototype,"selectedUserIds",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"selectedUserId",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"collectionName",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"usersCountText",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"showReload",void 0),__decorate$7([n$8({type:Boolean})],YpUsersGrid.prototype,"forceSpinner",void 0),__decorate$7([n$8({type:Number})],YpUsersGrid.prototype,"lastFethedId",void 0),__decorate$7([e$7("#grid")],YpUsersGrid.prototype,"gridElement",void 0),__decorate$7([n$8({type:String})],YpUsersGrid.prototype,"inviteType",void 0),YpUsersGrid=__decorate$7([t$5("yp-users-grid")],YpUsersGrid);var __decorate$6=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpContentModeration=class extends YpBaseElement{constructor(){super(...arguments),this.multiSortEnabled=!1,this.opened=!1,this.showReload=!1,this.forceSpinner=!1,this.selectedItemsEmpty=!0,this.selectedItemsCount=0,this.typeOfModeration="moderate_all_content",this.allowGridEventsAfterMenuOpen=!1}updated(t){super.updated(t),(t.has("groupId")||t.has("communityId")||t.has("domainId")||t.has("userId"))&&this._refreshAfterChange(),t.has("activeItem")&&this._activeItemChanged(this.activeItem,t.get("activeItem"))}static get styles(){return[super.styles,i$5`
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
      `]}renderContent(t,i,e){const o=e.item;return j(x`
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
    `,t)}renderItemDetail(t,i,e){const o=e.item;return j(x`
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
    `,t)}renderActionHeader(t,i){return j(x`
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
    `,t)}renderAction(t,i,e){const o=e.item;return j(x`
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
    `,t)}render(){return x`
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
        .renderer="${(t,i,e)=>this._getType(e.item.type)}"
        .header="${this.t("type")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="start"
        flexGrow="0"
        .renderer="${(t,i,e)=>e.item.status}"
        path="status"
        .header="${this.t("publishStatus")}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="100px"
        textAlign="center"
        flexGrow="0"
        path="counter_flags"
        .renderer="${(t,i,e)=>e.item.counter_flags}"
        .header="${this.t("flags")}"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="130px"
        textAlign="start"
        flexGrow="0"
        path="source"
        .renderer="${(t,i,e)=>e.item.source}"
        .header="${this.t("source")}"
        ?hidden="${!this.onlyFlaggedItems}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="105px"
        textAlign="center"
        flexGrow="0"
        path="toxicityScoreRaw"
        .renderer="${(t,i,e)=>e.item.toxicityScore}"
        .header="${this.t("toxicityScore")}?"
        ?hidden="${null!=this.userId}"
      >
      </vaadin-grid-sort-column>

      <vaadin-grid-sort-column
        width="150px"
        textAlign="start"
        flexGrow="1"
        path="groupName"
        .renderer="${(t,i,e)=>e.item.groupName}"
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
        .renderer="${(t,i,e)=>e.item.user_email}"
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
    `}get spinnerActive(){return!this.totalItemsCount||this.forceSpinner}_ajaxError(t=void 0){this.forceSpinner=!1}async _reload(){this.forceSpinner=!0,await this._refreshAfterChange(),this.forceSpinner=!1}async _masterRequest(t,i=void 0){let e,o;if("groups"===this.modelType&&this.groupId)o=this.groupId;else if("communities"===this.modelType&&this.communityId)o=this.communityId;else if("domains"===this.modelType&&this.domainId)o=this.domainId;else{if("users"!==this.modelType||!this.userId)return void console.error("Can't find model type or ids");o=this.userId}try{if(i&&i.length>0)e=`/api/${this.modelType}/${o}/${t}/process_many_moderation_item`,await window.adminServerApi.adminMethod(e,"PUT",i);else{if(!this.selectedItemId||!this.selectedModelClass)return void console.error("No item ids to process");e=`/api/${this.modelType}/${o}/${this.selectedItemId}/${this.selectedModelClass}/${t}/process_one_moderation_item`,await window.adminServerApi.adminMethod(e,"PUT")}this.forceSpinner=!0,this._resetSelectedAndClearCache()}catch(t){this._ajaxError(t)}}async _generateRequest(t){try{const i=await window.adminServerApi.adminMethod(`/api/${this.modelType}/${t}/${this.typeOfModeration}`,"GET");this.items=i}catch(t){this._ajaxError(t)}}_itemsResponse(t){this.forceSpinner=!1,this.items=t,this._resetSelectedAndClearCache()}get onlyFlaggedItems(){return"flagged_content"===this.typeOfModeration}_manyItemsResponse(){this.forceSpinner=!1,this.showReload=!0,window.appGlobals.notifyUserViaToast(this.t("operationInProgressTryReloading"))}_singleItemResponse(){this._reload()}_menuSelection(){this.renderRoot.querySelectorAll("md-menu").forEach((t=>{t.open=!1})),this._refreshGridAsync()}async _reallyAnonymize(){await this._masterRequest("anonymize")}async _reallyAnonymizeSelected(){await this._masterRequest("anonymize",this.selectedItemIdsAndType)}async _reallyDelete(){await this._masterRequest("delete")}async _reallyDeleteSelected(){await this._masterRequest("delete",this.selectedItemIdsAndType)}async _approve(t){this._setupItemIdFromEvent(t),await this._masterRequest("approve")}async _approveSelected(t){this._setupItemIdFromEvent(t),await this._masterRequest("approve",this.selectedItemIdsAndType)}async _block(t){this._setupItemIdFromEvent(t),await this._masterRequest("block")}async _blockSelected(t){this._setupItemIdFromEvent(t),await this._masterRequest("block",this.selectedItemIdsAndType)}async _clearFlags(t){this._setupItemIdFromEvent(t),await this._masterRequest("clearFlags")}async _clearSelectedFlags(t){this._setupItemIdFromEvent(t),await this._masterRequest("clearFlags",this.selectedItemIdsAndType)}async _refreshAfterChange(){this.domainId&&(this._reset(),this.modelType="domains",await this._generateRequest(this.domainId)),this.groupId&&(this._reset(),this.modelType="groups",await this._generateRequest(this.groupId)),this.communityId&&(this._reset(),this.modelType="communities",await this._generateRequest(this.communityId)),this.userId&&(this._reset(),this.modelType="users",await this._generateRequest(this.userId)),this._setupHeaderText()}_domainIdChanged(){}_groupIdChanged(){}_communityIdChanged(){}_userIdChanged(){}_getType(t){return"post"===t?this.t("posts.yp"):"point"===t?this.t("point.point"):this.t("unknown")}_activeItemChanged(t,i){t&&this.$$("#grid").openItemDetails(t),i&&this.$$("#grid").closeItemDetails(i),this._refreshGridAsync()}_refreshGridAsync(){this._refreshGridAsyncBase(10)}_refreshGridAsyncDelay(){this.allowGridEventsAfterMenuOpen&&this._refreshGridAsyncBase(250)}_refreshGridAsyncBase(t){setTimeout((()=>{this.$$("#grid").notifyResize()}),t)}connectedCallback(){super.connectedCallback(),window.addEventListener("resize",this._resizeThrottler.bind(this),!1)}firstUpdated(t){super.firstUpdated(t),this._setGridSize()}_toPercent(t){return t?Math.round(100*t)+"%":null}_resizeThrottler(){this.resizeTimeout||(this.resizeTimeout=setTimeout((()=>{this.resizeTimeout=null,this._setGridSize()}),66))}_setGridSize(){window.innerWidth<=600?(this.$$("#grid").style.width=window.innerWidth.toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px"):(this.$$("#grid").style.width=(window.innerWidth-16).toFixed()+"px",this.$$("#grid").style.height=window.innerHeight.toFixed()+"px")}get totalItemsCount(){return this.items?YpFormattingHelpers.number(this.items.length):null}_selectedItemsChanged(){this.selectedItems&&this.selectedItems.length>0?(this.selectedItemsEmpty=!1,this.selectedItemsCount=this.selectedItems.length):(this.selectedItemsEmpty=!0,this.selectedItemsCount=0),this.selectedItemIdsAndType=this.selectedItems.map((t=>({id:t.id,modelType:t.type}))),this._refreshGridAsyncDelay()}_setupItemIdFromEvent(t){const i=t.target;if(null!=i){let t=i.parentElement.getAttribute("data-args");t||(t=i.getAttribute("data-args")),t&&(this.selectedItemId=parseInt(t));let e=i.parentElement.getAttribute("data-model-class");e||(e=i.getAttribute("data-model-class")),this.selectedModelClass=e,this._refreshGridAsync()}}_deleteSelected(t){this._setupItemIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureDeleteSelectedContent"),this._reallyDeleteSelected.bind(this),!0,!0)}))}_delete(t){this._setupItemIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureDeleteContent"),this._reallyDelete.bind(this),!0,!1)}))}_anonymizeSelected(t){this._setupItemIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureAnonymizeSelectedContent"),this._reallyAnonymizeSelected.bind(this),!0,!0)}))}_anonymize(t){this._setupItemIdFromEvent(t),window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureAnonymizeContent"),this._reallyAnonymize.bind(this),!0,!1)}))}_menuOpened(){this.allowGridEventsAfterMenuOpen=!0}_setSelected(t){const i=t.target.getAttribute("data-args");if(i){const t=this._findItemFromId(parseInt(i));t&&this.$$("#grid").selectItem(t),this.allowGridEventsAfterMenuOpen=!0,this._refreshGridAsync()}}_findItemFromId(t){let i;return this.items?this.items.forEach((e=>{e.id==t&&(i=e)})):console.warn("No item for _findItemFromId"),i}setup(t,i,e,o,s){this.typeOfModeration=o||"flagged_content",this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.userId=void 0,this.items=void 0,t&&(this.groupId=t),i&&(this.communityId=i),e&&(this.domainId=e),s&&(this.userId=s),this._setupHeaderText()}open(t){this.collectionName=t}_reset(){this.items=void 0,this._resetSelectedAndClearCache()}_resetSelectedAndClearCache(){this.selectedItemsCount=0,this.selectedItemsEmpty=!0,this.selectedItemIdsAndType=[],this.selectedItems=[],this.$$("#grid").clearCache()}_setupHeaderText(){this.onlyFlaggedItems?this.itemsCountText=this.t("contentItemsFlagged"):this.itemsCountText=this.t("items"),this.groupId?this.headerText=this.t("groupContentModeration"):this.communityId?this.headerText=this.t("communityContentModeration"):this.domainId?this.headerText=this.t("domainContentModeration"):this.userId&&(this.headerText=this.t("userContentModeration"))}};__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"multiSortEnabled",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"opened",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"showReload",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"forceSpinner",void 0),__decorate$6([n$8({type:Boolean})],YpContentModeration.prototype,"selectedItemsEmpty",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"items",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"selectedItems",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"headerText",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"groupId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"communityId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"domainId",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"userId",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"selected",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"modelType",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"selectedItemsCount",void 0),__decorate$6([n$8({type:Array})],YpContentModeration.prototype,"selectedItemIdsAndType",void 0),__decorate$6([n$8({type:Number})],YpContentModeration.prototype,"selectedItemId",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"selectedModelClass",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"collectionName",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"itemsCountText",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"resizeTimeout",void 0),__decorate$6([n$8({type:String})],YpContentModeration.prototype,"typeOfModeration",void 0),__decorate$6([n$8({type:Object})],YpContentModeration.prototype,"activeItem",void 0),YpContentModeration=__decorate$6([t$5("yp-content-moderation")],YpContentModeration);var __decorate$5=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpPagesGrid=class extends YpBaseElement{updated(t){super.updated(t),(t.has("groupId")||t.has("communityId")||t.has("domainId"))&&this._updateCollection()}static get styles(){return[super.styles,i$5`
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
          ${this.pages?.map((t=>x`
              <div class="layout horizontal">
                <div class="pageItem id">${t.id}</div>
                <div class="pageItem title">${t.title.en}</div>

                ${this._toLocaleArray(t.title).map((i=>x`
                    <div class="layout vertical center-center">
                      <md-text-button
                        class="locale"
                        data-args-page="${JSON.stringify(t)}"
                        data-args-locale="${i.locale}"
                        @click="${this._editPageLocale}"
                        >${i.locale}</md-text-button
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
                  data-args="${t.id}"
                  class="addLocaleButton"
                  @click="${this._addLocale}"
                  >${this.t("pages.addLocale")}</md-text-button
                >
                <md-text-button
                  ?hidden="${t.published}"
                  data-args="${t.id}"
                  @click="${this._publishPage}"
                  >${this.t("pages.publish")}</md-text-button
                >

                <md-text-button
                  data-args="${t.id}"
                  ?hidden="${!t.published}"
                  @click="${this._unPublishPage}"
                  >${this.t("pages.unPublish")}</md-text-button
                >

                <md-text-button
                  data-args="${t.id}"
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
      `:T$2}_toLocaleArray(t){return Object.keys(t).map((i=>({locale:i,value:t[i]}))).sort(((t,i)=>t.value.localeCompare(i.value)))}async _editPageLocale(t){const i=t.target,e=i.getAttribute("data-args-page");this.currentlyEditingPage=JSON.parse(e),this.currentlyEditingLocale=i.getAttribute("data-args-locale"),this.currentlyEditingContent=this.currentlyEditingPage.content[this.currentlyEditingLocale],this.currentlyEditingTitle=this.currentlyEditingPage.title[this.currentlyEditingLocale];const o=this.shadowRoot.querySelector("#editPageLocale");o&&(o.open=!0)}_closePageLocale(){this.currentlyEditingPage=void 0,this.currentlyEditingLocale=void 0,this.currentlyEditingContent=void 0,this.currentlyEditingTitle=void 0,this.$$("#editPageLocale").close()}async _dispatchAdminServerApiRequest(t,i,e,o){let s=t?`/${t}/${i}`:`/${i}`,n="";if("groups"===this.modelType&&this.groupId)n=`/api/${this.modelType}/${this.groupId}${s}`;else if("communities"===this.modelType&&this.communityId)n=`/api/${this.modelType}/${this.communityId}${s}`;else{if("domains"!==this.modelType||!this.domainId)return void console.warn("Can't find model type or ids");n=`/api/${this.modelType}/${this.domainId}${s}`}try{return await window.adminServerApi.adminMethod(n,e,o)}catch(t){console.error("Error dispatching admin server API request:",t)}}async _updatePageLocale(){await this._dispatchAdminServerApiRequest(this.currentlyEditingPage.id,"update_page_locale","PUT",{locale:this.currentlyEditingLocale,content:this.currentlyEditingContent,title:this.currentlyEditingTitle}),this._updateCollection(),this._closePageLocale()}async _publishPage(t){const i=t.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(i),"publish_page","PUT"),this._publishPageResponse()}async _publishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pagePublished")),await this._unPublishPageResponse()}async _unPublishPage(t){const i=t.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(i),"un_publish_page","PUT"),this._unPublishPageResponse()}async _unPublishPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageUnPublished")),await this._updateCollection()}async _refreshPages(){await this._dispatchAdminServerApiRequest(void 0,"pages","GET")}async _deletePage(t){const i=t.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(i),"delete_page","DELETE"),this._deletePageResponse()}async _deletePageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.pageDeleted")),await this._updateCollection()}async _addLocale(t){if(this.newLocaleInput&&this.newLocaleInput.value.length>1){const i=t.target.getAttribute("data-args");await this._dispatchAdminServerApiRequest(parseInt(i),"update_page_locale","PUT",{locale:this.newLocaleInput.value.toLowerCase(),content:"",title:""}),this._updateCollection()}}async _addPage(){const t=this.shadowRoot.querySelector("#addPageButton");t&&(t.disabled=!0),await this._dispatchAdminServerApiRequest(void 0,"add_page","POST"),this._generateRequest(),t&&(t.disabled=!1)}async _newPageResponse(){window.appGlobals.notifyUserViaToast(this.t("pages.newPageCreated")),await this._refreshPages()}async _updatePageResponse(){window.appGlobals.notifyUserViaToast(this.t("posts.updated")),await this._refreshPages()}_updateCollection(){this.domainId&&(this.modelType="domains",this._generateRequest(this.domainId)),this.groupId&&(this.modelType="groups",this._generateRequest(this.groupId)),this.communityId&&(this.modelType="communities",this._generateRequest(this.communityId))}async _generateRequest(t=void 0){this.pages=await this._dispatchAdminServerApiRequest(void 0,"pages_for_admin","GET")}_pagesResponse(t){this.pages=t.detail.response}setup(t,i,e,o){this.groupId=void 0,this.communityId=void 0,this.domainId=void 0,this.pages=void 0,t&&(this.groupId=t),i&&(this.communityId=i),e&&(this.domainId=e),this._setupHeaderText()}open(){const t=this.shadowRoot.querySelector("#dialog");t&&(t.open=!0)}_setupHeaderText(){this.groupId?this.headerText=this.t("group.pages"):this.communityId?this.headerText=this.t("community.pages"):this.domainId&&(this.headerText=this.t("domain.pages"))}};__decorate$5([n$8({type:Array})],YpPagesGrid.prototype,"pages",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"headerText",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"domainId",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"communityId",void 0),__decorate$5([n$8({type:Number})],YpPagesGrid.prototype,"groupId",void 0),__decorate$5([n$8({type:Object})],YpPagesGrid.prototype,"currentlyEditingPage",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"modelType",void 0),__decorate$5([e$7("#localeInput")],YpPagesGrid.prototype,"newLocaleInput",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingLocale",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingTitle",void 0),__decorate$5([n$8({type:String})],YpPagesGrid.prototype,"currentlyEditingContent",void 0),YpPagesGrid=__decorate$5([t$5("yp-pages-grid")],YpPagesGrid);var __decorate$4=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminTranslations=class extends YpAdminPage{static get styles(){return[super.styles,ShadowStyles,i$5`
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
      `]}async getTranslationText(){this.waitingOnData=!0,this.items=(await window.adminServerApi.getTextForTranslations(this.collectionType,this.collectionId,this.targetLocale)).items,this.waitingOnData=!1}constructor(){super(),this.waitingOnData=!1,this.editActive={},this.waitingOnData=!1,this.baseMaxLength=300,this.supportedLanguages=YpLanguages.allLanguages}connectedCallback(){super.connectedCallback()}selectLanguage(t){t.target&&t.target.value&&(this.targetLocale=t.target.value,this.getTranslationText())}openEdit(t){this.editActive[t.indexKey]=!0,this.requestUpdate()}cancelEdit(t){delete this.editActive[t.indexKey],this.requestUpdate()}saveItem(t,i=void 0){t&&!i&&(t.translatedText=this.$$(`#editFor${t.indexKey}`).value);const e={contentId:t.contentId,content:t.originalText,textType:t.textType,translatedText:t.translatedText,extraId:t.extraId,targetLocale:this.targetLocale};window.adminServerApi.updateTranslation(this.collectionType,this.collectionId,e),this.cancelEdit(t)}async autoTranslate(t){const i=`${this.getUrlFromTextType(t)}?contentId=${t.contentId}&textType=${t.textType}&targetLanguage=${this.targetLocale}`,e=await window.serverApi.getTranslation(i);e&&(t.translatedText=e.content,this.saveItem(t,{saveDirectly:!0}),this.requestUpdate())}getUrlFromTextType(t){let i;switch(t.textType){case"postName":case"postContent":case"postTranscriptContent":i=`/api/posts/${t.contentId}/translatedText`;break;case"pointContent":case"pointAdminPointContent":i=`/api/points/${t.contentId}/translatedText`;break;case"domainName":case"domainContent":i=`/api/domains/${t.contentId}/translatedText`;break;case"customRatingName":i=`/api/ratings/${t.contentId}/${t.extraId}/translatedText`;break;case"communityName":case"communityContent":i=`/api/communities/${t.contentId}/translatedText`;break;case"alternativeTextForNewIdeaButtonClosed":case"alternativeTextForNewIdeaButtonHeader":case"customThankYouTextNewYps":case"alternativePointForHeader":case"customTitleQuestionText":case"customAdminPointsTitle":case"urlToReviewActionText":case"alternativePointAgainstHeader":case"customThankYouTextNewPoints":case"alternativePointForLabel":case"alternativePointAgainstLabel":case"groupName":case"groupContent":i=`/api/groups/${t.contentId}/translatedText`;break;case"categoryName":i=`/api/categories/${t.contentId}/translatedText`;break;case"statusChangeContent":i=`/api/posts/${t.extraId}/${t.contentId}/translatedStatusText`;break;default:return null}return i}get languages(){if(YpLanguages.allLanguages){let t=[];const i=[];let e=["en","is","fr","de","es","ar"];window.appGlobals.highlightedLanguages&&(e=window.appGlobals.highlightedLanguages.split(",")),e=e.map((t=>t.replace("-","_").toLowerCase()));for(let o=0;o<YpLanguages.allLanguages.length;o++){const s=YpLanguages.allLanguages[o];e.indexOf(s.code)>-1?i.push({language:s.code,name:`${s.nativeName} (${s.englishName})`}):t.push({language:s.code,name:`${s.nativeName} (${s.englishName})`})}return t=t.sort((function(t,i){return t.name<i.name?-1:t.name>i.name?1:0})),i.concat(t)}return[]}getMaxLength(t,i){return"groupName"===t.textType||"postName"===t.textType||"communityName"===t.textType?60:"groupContent"==t.textType||"communityContent"==t.textType?i:2500}textChanged(t){const i=t.target.value,e=new RegExp(/(?:https?|http?):\/\/[\n\S]+/g),o=i.match(e);if(o&&o.length>0){let t=0;for(let i=0;i<Math.min(o.length,10);i+=1)t+=o[i].length;let i=300;i+=t,i-=Math.min(t,30*o.length),this.baseMaxLength=i}}renderItem(t){return x`
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType layout vertical">
          <div>${this.t(t.textType)}</div>
          <div class="contentId">id: ${t.contentId}</div>
        </div>
        <div class="originalText dont-break-out">
          ${t.originalText}
        </div>

        <div class="layout vertical translatedText dont-break-out">
          ${this.editActive&&this.editActive[t.indexKey]?x`
                <md-outlined-text-field
                  type="textarea"
                  rows="5"
                  id="editFor${t.indexKey}"
                  .maxLength="${this.getMaxLength(t,this.baseMaxLength)}"
                  charCounter
                  @input="${this.textChanged}"
                  label="${this.t("editTranslation")}"
                  .value="${t.translatedText?t.translatedText:""}"
                >
                </md-outlined-text-field>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${()=>this.cancelEdit(t)}"
                  >${this.t("cancel")}</md-filled-button>
                  <md-filled-button

                    @click="${()=>this.saveItem(t)}"
                  >${this.t("save")}</md-filled-button>
                </div>
              `:x`
                <div class="innerTranslatedText">
                  ${t.translatedText?t.translatedText:this.t("noTranslation")}
                </div>
                <div class="layout horizontal endAligned">
                  <md-filled-button

                    @click="${()=>this.openEdit(t)}"
                  >${this.t("edit")}</md-filled-button>
                  <md-filled-button

                    ?hidden="${null!=t.translatedText}"
                    @click="${()=>this.autoTranslate(t)}"
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
              ${this.languages.map((t=>x`
                  <md-select-option .value="${t.language}"
                    >${t.name}</md-select-option
                  >
                `))}
            </md-outlined-select>
          </div>
          ${this.items?this.items.map((t=>this.renderItem(t))):T$2}
        </div>
      </div>
    `}};__decorate$4([n$8({type:Array})],YpAdminTranslations.prototype,"items",void 0),__decorate$4([n$8({type:Boolean})],YpAdminTranslations.prototype,"waitingOnData",void 0),__decorate$4([n$8({type:Object})],YpAdminTranslations.prototype,"editActive",void 0),__decorate$4([n$8({type:Object})],YpAdminTranslations.prototype,"collection",void 0),__decorate$4([n$8({type:String})],YpAdminTranslations.prototype,"targetLocale",void 0),__decorate$4([n$8({type:Number})],YpAdminTranslations.prototype,"baseMaxLength",void 0),YpAdminTranslations=__decorate$4([t$5("yp-admin-translations")],YpAdminTranslations);var __decorate$3=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminReports=class extends YpAdminPage{constructor(){super(...arguments),this.action="/api/communities",this.selectedTab=0,this.downloadDisabled=!1,this.autoTranslateActive=!1,this.fraudAuditSelectionActive=!1,this.waitingOnFraudAudits=!1}fraudItemSelection(t){this.selectedFraudAuditId=parseInt(t.target.getAttribute("data-args")),this.startReportCreation()}startReportCreation(){const t=this.action,i={selectedFraudAuditId:this.selectedFraudAuditId};this.progress=0,fetch(t,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then((t=>t.json())).then((t=>this.startReportCreationResponse(t))).catch((t=>{console.error("Error:",t),this.progress=void 0}))}startReportCreationResponse(t){this.jobId=t.jobId,this.progress=void 0;const i="group"==this.collectionType?`/api/groups/${this.collectionId}`:`/api/communities/${this.collectionId}`;this.reportCreationProgressUrl=`${i}/${this.jobId}/report_creation_progress`,this.pollLaterForProgress()}pollLaterForProgress(){setTimeout((()=>{this.reportCreationProgress()}),1e3)}reportCreationProgress(){fetch(this.reportCreationProgressUrl).then((t=>t.json())).then((t=>this.reportCreationProgressResponse(t))).catch((t=>console.error("Error:",t)))}formatAuditReportDates(t){return t.map((t=>(t.date&&(t.date=new Date(t.date).toLocaleString()),t)))}fraudAuditsAjaxResponse(t){this.waitingOnFraudAudits=!1,this.fraudAuditsAvailable=this.formatAuditReportDates(t.detail.response)}reportCreationProgressResponse(t){!t.error&&null!=t.progress&&t.progress<100&&this.pollLaterForProgress(),this.progress=t.progress,t.error&&(this.error=this.t(t.error)),t.data&&(this.reportUrl=t.data.reportUrl,setTimeout((()=>{this.downloadDisabled=!0}),354e4))}updated(t){(t.has("type")||t.has("selectedFraudAuditId"))&&(this.fraudAuditSelectionActive="fraudAuditReport"===this.type&&!this.selectedFraudAuditId)}startGeneration(){if("fraudAuditReport"==this.type){this.waitingOnFraudAudits=!0,this.progress=0;const t=window.adminServerApi.adminMethod(this.reportGenerationUrl,"GET");this.waitingOnFraudAudits=!1,this.progress=void 0,this.fraudAuditsAvailable=this.formatAuditReportDates(t)}else this.startReportCreationAjax(this.reportGenerationUrl)}startReportCreationAjax(t){this.progress=0,fetch(t,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({})}).then((t=>t.json())).then((t=>this.startReportCreationResponse(t))).catch((t=>console.error("Error:",t)))}getFraudAuditsAjax(t){fetch(t).then((t=>t.json())).then((t=>this.fraudAuditsAjaxResponse({detail:{response:t}}))).catch((t=>console.error("Error:",t)))}static get styles(){return[super.styles,i$5`
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
      `]}firstUpdated(t){setTimeout((()=>{this._tabChanged()}))}_tabChanged(){const t=this.$$("#tabs");this.selectedTab=t.activeTabIndex,this.reportGenerationUrl=void 0,this.reportUrl=void 0,"group"==this.collectionType?(0===t.activeTabIndex?(this.type="xls",this.toastText=this.t("haveCreatedXLsReport")):1===t.activeTabIndex&&(this.type="docx",this.toastText=this.t("haveCreatedDocxReport")),this.reportGenerationUrl=`/api/groups/${this.collectionId}/${this.type}/start_report_creation`):"community"==this.collectionType&&(0===t.activeTabIndex?(this.type="usersxls",this.reportGenerationUrl=`/api/communities/${this.collectionId}/${this.type}/start_report_creation`,this.toastText=this.t("haveCreatedXLsReport")):1===t.activeTabIndex&&(this.type="fraudAuditReport",this.reportGenerationUrl=`/api/communities/${this.collectionId}/getFraudAudits`,this.toastText=this.t("haveCreatedFraudAuditReport"))),window.autoTranslate&&(this.reportGenerationUrl+=`?translateLanguage=${this.language}`)}renderStart(){return x`
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
                    ${this.fraudAuditsAvailable?.map((t=>x`
                        <md-text-button
                          raised
                          class="layout horizontal fraudItemSelection"
                          data-args="${t.logId}"
                          @click="${this.fraudItemSelection}"
                        >
                          ${t.date}<br />${t.userName}
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
      <div class="layout vertical center-center">
        ${!this.reportGenerationUrl||this.reportUrl||this.fraudAuditsAvailable?this.renderDownload():this.renderStart()}
      </div>
    `}};__decorate$3([n$8({type:String})],YpAdminReports.prototype,"action",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"type",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"progress",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"selectedTab",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"error",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"jobId",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportUrl",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportGenerationUrl",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"downloadDisabled",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"toastText",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"autoTranslateActive",void 0),__decorate$3([n$8({type:Number})],YpAdminReports.prototype,"selectedFraudAuditId",void 0),__decorate$3([r$6()],YpAdminReports.prototype,"fraudAuditSelectionActive",void 0),__decorate$3([n$8({type:Array})],YpAdminReports.prototype,"fraudAuditsAvailable",void 0),__decorate$3([n$8({type:Boolean})],YpAdminReports.prototype,"waitingOnFraudAudits",void 0),__decorate$3([n$8({type:String})],YpAdminReports.prototype,"reportCreationProgressUrl",void 0),YpAdminReports=__decorate$3([t$5("yp-admin-reports")],YpAdminReports);var __decorate$2=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpOrganizationEdit=class extends YpEditBase{constructor(){super(...arguments),this.organizationAccess="public",this.action="/organizations"}static get styles(){return[super.styles,i$5`
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
    `}clear(){this.organization={id:-1,name:"",description:"",website:""},this.uploadedLogoImageId=void 0,this.$$("#logoImageUpload").clear()}setup(t,i,e){this.clear(),t?(this.organization=t,this.action=`/organizations/${this.organization.id}`):(this.organization={id:-1,name:"",description:""},this.action=`/organizations/${this.domainId}`),this.new=i,this.refreshFunction=e,this.setupTranslation()}setupTranslation(){this.new?(this.editHeaderText=this.t("organization.new"),this.snackbarText=this.t("organization.toast.created"),this.saveText=this.t("create")):(this.editHeaderText=this.t("Update organization info"),this.snackbarText=this.t("organization.toast.updated"),this.saveText=this.t("update"))}};__decorate$2([n$8({type:Object})],YpOrganizationEdit.prototype,"organization",void 0),__decorate$2([n$8({type:String})],YpOrganizationEdit.prototype,"organizationAccess",void 0),__decorate$2([n$8({type:Number})],YpOrganizationEdit.prototype,"domainId",void 0),__decorate$2([n$8({type:String})],YpOrganizationEdit.prototype,"action",void 0),__decorate$2([n$8({type:Number})],YpOrganizationEdit.prototype,"uploadedLogoImageId",void 0),YpOrganizationEdit=__decorate$2([t$5("yp-organization-edit")],YpOrganizationEdit);var __decorate$1=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpOrganizationGrid=class extends YpBaseElement{static get styles(){return[super.styles,i$5`
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
        ${this.organizations?.map((t=>x`
            <md-list-item class="layout horizontal">
              <div class="pageItem">
                <img
                  src="${this._organizationImageUrl(t)}"
                  class="orgLogo"
                />
              </div>
              <div class="pageItem id">${t.name}</div>
              <div class="pageItem description">
                ${t.description}
              </div>
              <div class="pageItem website">${t.website}</div>

              <div class="layout horizontal">
                <md-text-button
                  @click="${()=>this._editOrganization(t)}"
                >
                  ${this.t("update")}
                </md-text-button>
                <md-icon-button
                  @click="${()=>this._deleteOrganization(t)}"
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
    `}_deleteOrganization(t){this.organizationToDeleteId=t.id,window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToDeleteThisOrganization"),this._reallyDeleteOrganization.bind(this),!0,!1)}))}async _reallyDeleteOrganization(){try{await window.adminServerApi.adminMethod(`/api/organizations/${this.organizationToDeleteId}`,"DELETE"),this.refresh()}catch(t){console.error(t)}}_afterEdit(){this.shadowRoot.getElementById("editDialog").close(),this.refresh()}_createOrganization(){const t=this.shadowRoot.getElementById("editDialog");t.setup(void 0,!0,this._afterEdit.bind(this)),t.open(!0,{})}_editOrganization(t){const i=this.shadowRoot.getElementById("editDialog");i.organization=t,i.setup(t,!1,this._afterEdit.bind(this)),i.open(!1,{})}_organizationImageUrl(t){return t.OrganizationLogoImages?YpMediaHelpers.getImageFormatUrl(t.OrganizationLogoImages,2):null}};__decorate$1([n$8({type:Array})],YpOrganizationGrid.prototype,"organizations",void 0),__decorate$1([n$8({type:String})],YpOrganizationGrid.prototype,"headerText",void 0),__decorate$1([n$8({type:String})],YpOrganizationGrid.prototype,"domainId",void 0),__decorate$1([n$8({type:Object})],YpOrganizationGrid.prototype,"selected",void 0),YpOrganizationGrid=__decorate$1([t$5("yp-organization-grid")],YpOrganizationGrid);var __decorate=function(t,i,e,o){for(var s,n=arguments.length,r=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(i,e,r):s(i,e))||r);return n>3&&r&&Object.defineProperty(i,e,r),r};let YpAdminApp=class extends YpBaseElement{static get styles(){return[super.styles,i$5`
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
      `]}constructor(){super(),this.page="configuration",this.route="",this.userYpCollection=[],this.adminConfirmed=!1,this.haveCheckedAdminRights=!1,this.anchor=null,this._scrollPositionMap={},this._setupEventListeners(),this.updatePageFromPath()}updatePageFromPath(){let t=window.location.pathname;t=t.replace("/admin",""),t.endsWith("/")&&(t=t.substring(0,t.length-1)),t.startsWith("/")&&(t=t.substring(1,t.length));const i=t.split("/");this.collectionType=i[0],"new"==i[1]&&i[2]?(this.collectionId="new",this.parentCollectionId=parseInt(i[2]),this.page="configuration"):(this.collectionId=parseInt(i[1]),i.length>3?this.page=i[3]:i.length>2?this.page=i[2]:this.page="configuration")}firstUpdated(t){super.firstUpdated(t)}connectedCallback(){super.connectedCallback(),this.updateLocation()}updateLocation(){let t=window.location.pathname;t=t.replace("/admin","");const i=t.split("/"),e="/:page".split("/"),o={};structuredClone(this.routeData);for(let t=0;t<e.length;t++){const s=e[t];if(!s&&""!==s)break;const n=i.shift();if(!n&&""!==n)return;if(":"==s.charAt(0))o[s.slice(1)]=n;else if(s!==n)return}let s=i.join("/");i.length>0&&(s="/"+s),this.subRoute=s,this.route=t,this.routeData=o,this.updatePageFromPath()}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}_pageChanged(){this.page&&window.appGlobals.analytics.sendToAnalyticsTrackers("send","pageview",location.pathname)}tabChanged(t){0==t.detail.activeIndex?this.page="configuration":1==t.detail.activeIndex?this.page="moderation":3==t.detail.activeIndex?this.page="users":4==t.detail.activeIndex&&(this.page="admins")}_setupEventListeners(){}_refreshAdminRights(){window.appUser.recheckAdminRights()}_removeEventListeners(){}_refreshGroup(){this._refreshByName("#groupPage")}_refreshCommunity(){this._refreshByName("#communityPage")}_refreshDomain(){this._refreshByName("#domainPage")}_refreshByName(t){this.$$(t)}updated(t){super.updated(t),t.has("page")&&this._pageChanged(),t.has("collectionType")&&this.collectionId&&"new"!=this.collectionId?this.getCollection():t.has("collectionId")&&"new"==this.collectionId&&this._setAdminFromParent(),t.has("collection")}_needsUpdate(){this.requestUpdate()}updateFromCollection(){this.collection&&(this.collection={...this.collection})}renderGroupConfigPage(){return x`<yp-admin-config-group
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
              `;default:return x``}default:return x``}}async getCollection(){const t=await window.serverApi.getCollection(this.collectionType,this.collectionId);"group"==this.collectionType?this.collection=t.group:this.collection=t,this._setAdminConfirmed()}async _setAdminFromParent(){switch(this.collectionType){case"community":const t=await window.serverApi.getCollection("domain",this.parentCollectionId);this._setAdminConfirmedFromParent(t);break;case"group":const i=await window.serverApi.getCollection("community",this.parentCollectionId);this._setAdminConfirmedFromParent(i);break;default:this.fire("yp-network-error",{message:this.t("unauthorized")})}}_setAdminConfirmedFromParent(t){let i=!1;if(t){switch(this.collectionType){case"community":i=YpAccessHelpers.checkDomainAccess(t),i||!t.configuration.onlyAdminsCanCreateCommunities&&window.appUser.user&&(i=!0);break;case"group":i=YpAccessHelpers.checkCommunityAccess(t),i||!t.configuration.onlyAdminsCanCreateGroups&&window.appUser.user&&(i=!0)}this.adminConfirmed=i,i||this.fire("yp-network-error",{message:this.t("unauthorized")})}}_setAdminConfirmed(){if(this.collection)switch(this.collectionType){case"domain":this.adminConfirmed=YpAccessHelpers.checkDomainAccess(this.collection);break;case"community":this.adminConfirmed=YpAccessHelpers.checkCommunityAccess(this.collection);break;case"group":this.adminConfirmed=YpAccessHelpers.checkGroupAccess(this.collection);break;case"post":this.adminConfirmed=YpAccessHelpers.checkPostAccess(this.collection)}this.collection&&this.haveCheckedAdminRights&&!this.adminConfirmed&&this.fire("yp-network-error",{message:this.t("unauthorized")})}getParentCollectionType(){switch(this.collectionType){case"group":return"community";case"community":return"domain";default:return""}}exitToMainApp(){this.active=!1,"new"===this.collectionId?YpNavHelpers.redirectTo(`/${this.getParentCollectionType()}/${this.parentCollectionId}`):YpNavHelpers.redirectTo(`/${this.collectionType}/${this.collectionId}`)}render(){return x`
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
    `}_isPageSelectedClass(t){return t===this.page?"selectedContainer":""}_getListHeadline(t){if("configuration"===t){if("domain"===this.collectionType)return this.t("Domain Configuration");if("community"===this.collectionType)return this.t("Community Configuration");if("group"===this.collectionType)return this.t("Group Configuration");if("post"===this.collectionType)return this.t("Yp Configuration");if("profile_image"===this.collectionType)return this.t("Profile Image Configuration")}else{if("translations"===t)return this.t("Translations");if("organizations"===t)return this.t("Organizations");if("reports"===t)return this.t("reports");if("users"===t)return this.t("Users");if("admins"===t)return this.t("Admins");if("moderation"===t)return this.t("Moderation");if("aiAnalysis"===t)return this.t("aiAnalysis");if("pages"==t)return this.t("Pages");if("groups"==t)return this.t("Groups");if("communities"==t)return this.t("Communities");if("user"==t)return this.t("Settings");if("badges"==t)return this.t("Badges");if("profile_images"==t)return this.t("Profile Images");if("back"==t){if("community"===this.collectionType)return this.t("Back to domain");if("group"===this.collectionType)return this.t("Back to community");if("post"===this.collectionType||"profile_image"===this.collectionType)return this.t("Back to group")}}return""}_getListSupportingText(t){if("configuration"===t){if("domain"===this.collectionType)return this.t("Configure your domain");if("community"===this.collectionType)return this.t("Configure your community");if("group"===this.collectionType)return this.t("Configure your group");if("post"===this.collectionType)return this.t("Configure your yp");if("profile_image"===this.collectionType)return this.t("Configure profile image")}else{if("reports"===t)return this.t("reportsInfo");if("organizations"===t)return this.t("organizationsAdmin");if("translations"===t){if("domain"===this.collectionType)return this.t("Translate your domain");if("community"===this.collectionType)return this.t("Translate your community");if("group"===this.collectionType)return this.t("Translate your group");if("post"===this.collectionType)return this.t("Translate your yp")}else if("back"===t){if("community"===this.collectionType)return this.t("Back to domain");if("group"===this.collectionType)return this.t("Back to community");if("post"===this.collectionType)return this.t("Back to group");if("profile_image"===this.collectionType)return this.t("Back to group")}else if("users"===t){if("domain"===this.collectionType)return this.t("Manage domain users");if("community"===this.collectionType)return this.t("Manage community users");if("group"===this.collectionType)return this.t("Manage group users")}else if("admins"===t){if("domain"===this.collectionType)return this.t("Manage domain admins");if("community"===this.collectionType)return this.t("Manage community admins");if("group"===this.collectionType)return this.t("Manage group admins")}else{if("aiAnalysis"===t)return this.t("aiAnalysis");if("moderation"===t){if("domain"===this.collectionType)return this.t("Moderate domain");if("community"===this.collectionType)return this.t("Moderate community");if("group"===this.collectionType)return this.t("Moderate group")}else if("pages"===t){if("domain"===this.collectionType)return this.t("Manage domain pages");if("community"===this.collectionType)return this.t("Manage community pages");if("group"===this.collectionType)return this.t("Manage group pages")}else{if("posts"===t)return this.t("Manage posts");if("groups"===t)return this.t("Manage groups");if("communities"===t)return this.t("Manage communities");if("user"===t)return this.t("Theme, language, etc.");if("badges"===t)return this.t("Manage badges");if("profile_images"===t)return this.t("Manage profile images")}}}return""}_getListIcon(t){return"configuration"===t?"settings":"translations"===t?"translate":"organizations"===t?"add_business":"reports"===t?"reports":"users"===t?"supervised_user_circle":"admins"===t?"supervisor_account":"moderation"===t?"checklist":"aiAnalysis"===t?"document_scanner":"pages"===t?"description":"posts"===t?"rocket_launch":"groups"===t?"videogroup_asset":"communities"===t?"category":"badges"===t?"workspace_premium":"profile_images"===t?"supervised_user_circle":"user"===t?"person":"back"===t?"arrow_back":""}setPage(t){"group"===this.collectionType?"back"==t?YpNavHelpers.redirectTo(`/admin/community/${this.parentCollectionId}/groups`):"profile_images"==t?YpNavHelpers.redirectTo(`/admin/group/${this.collectionId}/profile_images`):"posts"==t?YpNavHelpers.redirectTo(`/group/${this.collectionId}/posts`):this.page=t:"community"===this.collectionType&&"back"==t?YpNavHelpers.redirectTo(`/admin/domain/${this.collection.domain_id}/communities`):this.page=t}renderMenuListItem(t){return x`
      <md-list-item
        type="button"
        @click="${()=>this.setPage(t)}"
        class="${this._isPageSelectedClass(t)}"
      >
        <div slot="headline">${this._getListHeadline(t)||""}</div>
        <div slot="supporting-text">
          ${this._getListSupportingText(t)||""}
        </div>
        <md-icon slot="start">${this._getListIcon(t)||""}</md-icon>
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