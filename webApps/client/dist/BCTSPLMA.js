import{i as t,n as e,t as i,Y as o,p as a,q as r,x as n,u as s,T as d,h as l,d as c,c as p,v as h,w as g,y as m,z as u,A as y,B as x,C as v}from"./Bu90LUbU.js";import"./BCOMm1Tl.js";import"./DVLH9-2X.js";import{A as w,a as b}from"./Bjo7RSlB.js";const f=t`
  .questionTitle {
    padding: 18px;
    font-size: 24px;
    padding: 8px;
    text-align: center;
    margin-top: 16px;
    border-radius: 16px;
    margin-bottom: 0px;
    margin-top: 16px;
    margin-left: 32px;
    margin-right: 32px;
    max-width: 632px;
  }

  [hidden] {
    display: none !important;
  }

  @media (max-width: 960px) {
    .questionTitle {
      margin-bottom: 16px;
      max-width: 100%;
    }

    .questionTitle[dark-mode] {

    }
}
`;var $=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let I=class extends o{constructor(){super(...arguments),this.isAdmin=!1,this.footer=null,this.footerEnd=null,this.footerTopObserver=null,this.footerEndObserver=null}async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Intro - open"),this.isAdmin=a.checkGroupAccess(this.group)}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Intro - close"),this.footerTopObserver&&(this.footerTopObserver.disconnect(),this.footerTopObserver=null),this.footerEndObserver&&(this.footerEndObserver.disconnect(),this.footerEndObserver=null)}firstUpdated(){this.setupFooterObserver()}_openAnalyticsAndPromotions(){r.redirectTo(`/analytics/group/${this.group.id}`)}_openAdmin(){r.redirectTo(`/admin/group/${this.group.id}`)}renderAdminButtons(){return n`
      <div class="layout horizontal adminButtons">
        <md-icon-button
          id="menuButton"
          @click="${this._openAnalyticsAndPromotions}"
          title="${this.t("Analytics")}"
          aria-label="${this.t("Analytics")}"
          ><md-icon>analytics</md-icon>
        </md-icon-button>
        <md-icon-button
          id="menuButton"
          @click="${this._openAdmin}"
          title="${this.t("Admin")}"
          aria-label="${this.t("Admin")}"
          ><md-icon>settings</md-icon>
        </md-icon-button>
      </div>
    `}setupFooterObserver(){this.footer=this.shadowRoot?.querySelector("#footerStart"),this.footerEnd=this.shadowRoot?.querySelector("#footerEnd"),this.footerTopObserver=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&(window.appGlobals.activity("Footer - start is visible"),this.footerTopObserver?.disconnect())}))}),{rootMargin:"-200px 0px"}),this.footerEndObserver=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&(window.appGlobals.activity("Footer - end is visible"),this.footerEndObserver?.disconnect())}))}),{rootMargin:"0px"}),this.footer&&this.footerTopObserver.observe(this.footer),this.footerEnd&&this.footerEndObserver.observe(this.footerEnd)}get formattedDescription(){return(this.earl.configuration.welcome_message||"").replace(/(\n)/g,"<br>")}clickStart(){this.fire("startVoting"),window.appGlobals.activity("Intro - click start")}clickResults(){this.fire("openResults")}static get styles(){return[...super.styles,f,t`
        .footerHtml {
          margin: 16px;
          max-width: 600px;
          line-height: 1.5;
          color: var(--md-sys-color-on-background);
        }

        .adminButtons {
          margin-top: 16px;
        }

        .footerHtml a {
          color: var(--md-sys-color-on-background);
        }

        .fab {
          margin-top: 16px;
          margin-bottom: 8px;
          cursor: pointer !important;
        }

        .description {
          font-size: 18px;
          letter-spacing: 0.04em;
          line-height: 1.5;
          border-radius: 8px;
          max-width: 560px;
          vertical-align: center;
          margin-bottom: 16px;
          margin-top: 8px;
          padding: 16px;
          padding-left: 0;
          padding-right: 0;
        }

        :host {
        }

        .image {
          width: 632px;
          height: 356px;
          margin-top: 32px;
        }

        .questionTitle {
          max-width: 588px;
          width: 588px;
          padding: 20px;
          line-height: 1.5;
        }

        .questionTitle[dark-mode] {
          margin-top: 24px;
        }

        @media (max-width: 960px) {
          .image {
            width: 300px;
            height: 169px;
          }

          .questionTitle {
            max-width: 100%;
            width: 100%;
            padding: 16px;
            line-height: 1.5;
            margin: 0;
            padding-left: 0;
            padding-right: 0;
          }

          .description {
            max-width: 100%;
            margin: 0;
            padding: 8px;
          }

          .footerHtml {
            max-width: 100%;
            margin: 0;
          }

          .questionTitle[dark-mode] {
          }

          .darkModeButton {
            margin-left: 12px;
            margin-right: 12px;
          }
        }
      `]}render(){return this.question?n`
        <div class="topContainer layout vertical wrap center-center">
          <yp-image
            class="column image"
            sizing="contain"
            .alt="${this.group.name}"
            .title="${this.group.name}"
            src="${s.getImageFormatUrl(this.group.GroupLogoImages)}"
          ></yp-image>
          <div class="questionTitle" ?dark-mode="${this.themeDarkMode}">
            <yp-magic-text
              id="answerText"
              .contentId="${this.group.id}"
              .extraId="${this.question.id}"
              textOnly
              truncate="400"
              .content="${this.question.name}"
              .contentLanguage="${this.group.language}"
              textType="aoiQuestionName"
            ></yp-magic-text>
          </div>
          <div class="description" ?hidden="${!this.earl.configuration.welcome_message}">
            <yp-magic-text
              id="aoiWelcomeMessage"
              .contentId="${this.group.id}"
              textOnly
              truncate="500"
              .content="${this.earl.configuration.welcome_message}"
              .contentLanguage="${this.group.language}"
              textType="aoiWelcomeMessage"
            ></yp-magic-text>
          </div>
          ${this.earl.active?n`
                <md-fab
                  extended
                  variant="primary"
                  class="fab"
                  @click="${this.clickStart}"
                  .label="${this.t("Start Voting")}"
                  ><md-icon slot="icon">thumbs_up_down</md-icon></md-fab
                >
              `:n`
                <md-fab
                  extended
                  variant="primary"
                  class="fab"
                  @click="${this.clickResults}"
                  .label="${this.t("Open Results")}"
                  ><md-icon slot="icon">grading</md-icon></md-fab
                >
              `}
          ${this.isAdmin?this.renderAdminButtons():d}
          <div id="footerStart" class="footerHtml">
            ${this.earl.configuration&&this.earl.configuration.welcome_html?n`
                <yp-magic-text
                  id="aoiWelcomeHtml"
                  .contentId="${this.group.id}"
                  unsafeHtml
                  .content="${this.earl.configuration.welcome_html}"
                  .contentLanguage="${this.group.language}"
                  textType="aoiWelcomeHtml"
                ></yp-magic-text>
                `:d}
          </div>
          <div id="footerEnd">&nbsp;</div>
        </div>
      `:d}};$([e({type:Object})],I.prototype,"earl",void 0),$([e({type:Object})],I.prototype,"group",void 0),$([e({type:Object})],I.prototype,"question",void 0),$([e({type:Boolean})],I.prototype,"isAdmin",void 0),I=$([i("aoi-survey-intro")],I);var A=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let k=class extends c{constructor(){super(),this.haveAddedIdea=!1,this.serverApi=new w}async connectedCallback(){super.connectedCallback(),this.imageGenerator=new b(this.themeColor)}disconnectedCallback(){super.disconnectedCallback()}async submitIdea(){let t;window.appGlobals.activity("New Idea - submit"),this.currentError=void 0,this.submitting=!0;try{t=await window.aoiServerApi.submitIdea(this.groupId,this.question.id,this.ideaText.value)}catch(t){console.error(t)}this.submitting=!1,!t||t.error?(this.currentError=this.t("An error occurred. Please try again."),window.appGlobals.activity("New Idea - general error")):t.flagged?(this.currentError=this.t("Your idea has been flagged as inappropriate. Please try again."),window.appGlobals.activity("New Idea - moderation flag")):(this.ideaText.value="",t.active?(this.choice=t.choice,this.haveAddedIdea=!0,this.fire("display-snackbar",this.t("yourIdeaHasBeenAdded")),this.generateAiIcon()):(this.earl.configuration?.allowAnswersNotForVoting?this.fire("display-snackbar",this.t("newIdeasNotAllowedForVotingThankYou")):this.fire("display-snackbar",this.t("New ideas will be reviewed for originality and compliance with terms of service prior to posting.")),this.fire("new-idea-added"),this.dialog.close()),window.appGlobals.activity("New Idea - added"))}scrollUp(){setTimeout((()=>{this.$$("#dialog").contentElement.scrollTop=0}),100)}async open(){this.reset(),window.appGlobals.activity("New Idea - open"),this.dialog.show(),await this.updateComplete,this.ideaText&&(this.ideaText.value="")}cancel(){this.dialog.close(),window.appGlobals.activity("New Idea - cancel")}reset(){this.currentError=void 0,this.haveAddedIdea=!1,this.choice=void 0,this.imageGenerator=new b(this.themeColor)}close(){this.dialog.close(),window.appGlobals.activity("New Idea - close")}textAreaKeyDownIdea(t){return!(13===t.keyCode&&!t.shiftKey)||(t.preventDefault(),!1)}static get styles(){return[super.styles,f,t`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }

        .indexNumber {
          margin-top: 12px;
          font-size: 20px;
          margin-left: 8px;
          margin-right: 8px;
          color: var(--md-sys-color-on-surface);
        }

        .newIdeasNotAllowedForVotingInfo {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 12px;
          font-style: italic;
          color: var(--md-sys-color-on-surface);
        }

        .cancelButton {
        }

        .header {
          text-align: center;
        }

        #dialog {
          width: 100%;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }

        .questionTitle {
          margin-top: 0;
          margin-bottom: 16px;
          padding: 16px;
          font-size: 16px;
          line-height: 1.4;
        }

        md-filled-field {
          padding: 8px;
          margin-bottom: 8px;
          border-radius: 12px;
        }

        .submitButton {
          margin-left: 8px;
        }

        .aiIconInfo {
          font-size: 12px;
          padding: 8px;
          font-style: italic;
          max-width: 350px;
          text-align: center;
        }

        .error {
          color: var(--md-sys-color-error);
          font-size: 16px;
          margin: 8px;
        }

        .genIconSpinner {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
        }

        yp-magic-text {
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
          height: 32px;
          width: 32px;
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

        .iconContainer {
          position: relative;
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

        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .footer {
            margin-bottom: 8px;
          }

          .aiIconInfo {
            max-width: 100%;
          }

          .genIconSpinner {
            width: 75px;
            height: 75px;
            margin-left: 0;
            margin-right: -8px;
          }

          .iconContainer md-elevated-button {
            width: 90vh;
            max-width: 90vh;
            font-size: 15px;
          }

          .generateIconButton {
            max-width: 220px;
          }

          .iconImage,
          .iconImageRight {
            width: 75px;
            height: 75px;
            border-radius: 45px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 12px;
          }

          .cancelButton {
            margin-right: 32px;
          }

          .header {
            padding: 8px;
            font-size: 22px;
          }

          #ideaText {
            width: 95%;
          }
        }
      `]}async generateAiIcon(){if(this.imageGenerator.collectionType="group",this.imageGenerator.collectionId=this.groupId,this.choice)try{this.choice.data||(this.choice.data={}),this.choice.data.isGeneratingImage=!0;const{imageUrl:t,error:e}=await this.imageGenerator.generateIcon(this.choice.data.content,this.group.configuration.theme?.iconPrompt||this.finalPrompt);this.choice.data.isGeneratingImage=void 0,e?console.error(e):(await this.serverApi.updateGroupChoice(this.groupId,this.question.id,this.choice.id,{content:this.choice.data.content,imageUrl:t,choiceId:this.choice.id}),this.choice.data.imageUrl=t,this.requestUpdate())}catch(t){this.choice.data.isGeneratingImage=!1,console.error(t)}else console.error("no choice")}get tempPrompt(){return`\n      Name: ${this.name}\n      Description: ${this.description}\n      Image style: ${this.styleText.value}\n\n      Do not include text or labels in the image except if the user asks for it in the image style.\n    `}regenerateIcon(){this.choice.data.imageUrl=void 0,this.requestUpdate(),this.generateAiIcon()}renderAnswer(){return this.choice?n`
        <div class="iconContainer">
          <md-elevated-button
            id="leftAnswerButton"
            class="leftAnswer"
            trailing-icon
          >
            ${this.renderIcon()}
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${this.choice.data.choiceId}"
              textOnly
              truncate="140"
              .content="${this.choice.data.content}"
              .contentLanguage="${this.group.language}"
              textType="aoiChoiceContent"
            ></yp-magic-text>
          </md-elevated-button>
          <md-filled-tonal-icon-button
            ?hidden="${!this.choice.data.imageUrl}"
            @click="${this.regenerateIcon}"
            class="deleteIcon"
            aria-label="${this.t("regenerateIcon")}"
            ><md-icon class="closeIcon"
              >cycle</md-icon
            ></md-filled-tonal-icon-button
          >
        </div>
      `:d}renderIcon(){return this.choice.data.isGeneratingImage?n`
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `:this.choice.data.imageUrl?n` <img
        class="iconImage"
        src="${this.choice.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!this.choice.data.imageUrl}"
      />`:d}renderContent(){return n`
      <div class="questionTitle">
        <yp-magic-text
          id="answerText"
          .contentId="${this.group.id}"
          .extraId="${this.question.id}"
          textOnly
          truncate="400"
          .content="${this.question.name}"
          .contentLanguage="${this.group.language}"
          textType="aoiQuestionName"
        ></yp-magic-text>
      </div>
      ${this.earl.configuration.allowAnswersNotForVoting?n`
            <div class="newIdeasNotAllowedForVotingInfo layout horizontal center-center">
              ${this.t("newIdeasNotAllowedForVotingInfo")}
            </div>
          `:d}
      ${this.haveAddedIdea&&this.choice?n`
            <div class="layout vertical center-center">
              ${this.renderAnswer()}
              <div class="aiIconInfo">${this.t("aiIconInfo")}</div>
            </div>
          `:n`
            <div class="layout vertical center-center">
              <md-filled-text-field
                id="ideaText"
                type="textarea"
                @keydown="${this.textAreaKeyDownIdea}"
                maxLength="140"
                .rows="${this.wide?3:5}"
                label="${this.t("Your own answer")}"
              >
              </md-filled-text-field>
              <div class="error" ?hidden="${!this.currentError}">
                ${this.currentError}
              </div>
            </div>
          `}
    `}renderFooter(){return this.haveAddedIdea&&this.choice?n`<div class="layout horizontal footer">
        <div class="flex"></div>
        <md-text-button class="closeButton" @click="${this.close}">
          ${this.choice?.data.isGeneratingImage?this.t("closeAndGenerateIconInBackground"):this.t("close")}
        </md-text-button>
      </div> `:n` <div class="layout horizontal footer">
        <md-circular-progress
          ?hidden="${!this.submitting}"
          indeterminate
        ></md-circular-progress>
        <md-text-button
          class="cancelButton"
          @click="${this.cancel}"
          ?disabled="${this.submitting}"
        >
          ${this.t("Cancel")}
        </md-text-button>
        <md-outlined-button
          class="submitButton"
          @click="${this.submitIdea}"
          ?disabled="${this.submitting}"
        >
          ${this.t("Submit Idea")}
        </md-outlined-button>
      </div>`}render(){return n`<md-dialog ?fullscreen="${!this.wide}" id="dialog">
      <div slot="content">${this.renderContent()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `}};A([e({type:Object})],k.prototype,"earl",void 0),A([e({type:Number})],k.prototype,"groupId",void 0),A([e({type:Object})],k.prototype,"question",void 0),A([e({type:Object})],k.prototype,"choice",void 0),A([e({type:Object})],k.prototype,"group",void 0),A([e({type:Boolean})],k.prototype,"haveAddedIdea",void 0),A([l("#ideaText")],k.prototype,"ideaText",void 0),A([l("#dialog")],k.prototype,"dialog",void 0),k=A([i("aoi-new-idea-dialog")],k);class T extends p{constructor(t="/api/allOurIdeas"){super(),this.baseUrlPath=t}getEarlData(t){return this.fetchWrapper(this.baseUrlPath+`/${t}`)}async getPrompt(t,e){return this.fetchWrapper(this.baseUrlPath+`/${t}/questions/${e}/prompt`)}async getSurveyResults(t){return this.fetchWrapper(this.baseUrlPath+`/${t}/questions/results`)}getSurveyAnalysis(t,e,i,o,a){return this.fetchWrapper(this.baseUrlPath+`/${t}/questions/${e}/${i}/${o}/analysis?languageName=${a}`)}async checkLogin(){if(window.appUser.loggedIn())return!0;if(window.appGlobals.currentAnonymousGroup){const t=await window.serverApi.registerAnonymously({groupId:window.appGlobals.currentAnonymousGroup.id,trackingParameters:window.appGlobals.originalQueryParameters});return!!t&&(window.appUser.setLoggedInUser(t),!0)}return!1}async submitIdea(t,e,i){return await this.checkLogin()?this.fetchWrapper(this.baseUrlPath+`/${t}/questions/${e}/addIdea`,{method:"POST",body:JSON.stringify({newIdea:i})},!1):(window.appUser.openUserlogin(),null)}async postVote(t,e,i,o,a,r){if(await this.checkLogin()){const n=new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${t}/questions/${e}/prompts/${i}/${"skip"==r?"skips":"votes"}?locale=${o}`);Object.keys(window.appGlobals.originalQueryParameters).forEach((t=>{t.startsWith("utm_")&&n.searchParams.append(t,window.aoiAppGlobals.originalQueryParameters[t])}));const s=window.appUser.getBrowserId(),d=window.appUser.browserFingerprint,l=window.appUser.browserFingerprintConfidence;return n.searchParams.append("checksum_a",s),n.searchParams.append("checksum_b",d),n.searchParams.append("checksum_c",l.toString()),this.fetchWrapper(n.toString(),{method:"POST",body:JSON.stringify(a)},!1)}return window.appUser.openUserlogin(),null}async postVoteSkip(t,e,i,o,a){if(await this.checkLogin()){const r=new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${t}/questions/${e}/prompts/${i}/skip.js?locale=${o}`);Object.keys(window.appGlobals.originalQueryParameters).forEach((t=>{t.startsWith("utm_")&&r.searchParams.append(t,window.aoiAppGlobals.originalQueryParameters[t])}));const n=window.appUser.getBrowserId(),s=window.appUser.browserFingerprint,d=window.appUser.browserFingerprintConfidence;return r.searchParams.append("checksum_a",n),r.searchParams.append("checksum_b",s),r.searchParams.append("checksum_c",d.toString()),this.fetchWrapper(r.toString(),{method:"POST",body:JSON.stringify(a)},!1)}return window.appUser.openUserlogin(),null}async getResults(t,e,i=!1){return this.fetchWrapper(this.baseUrlPath+`/${t}/choices/${e}/throughGroup${i?"?showAll=1":""}`)}llmAnswerConverstation(t,e,i,o){return this.fetchWrapper(this.baseUrlPath+`/${t}/llmAnswerExplain`,{method:"PUT",body:JSON.stringify({wsClientId:e,chatLog:i,languageName:o})},!1)}}var C=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let O=class extends h{constructor(){super(...arguments),this.showCloseButton=!0,this.defaultInfoMessage=void 0,this.haveSentFirstQuestion=!1}setupServerApi(){this.serverApi=new T}async connectedCallback(){super.connectedCallback(),this.addEventListener("yp-ws-opened",this.sendFirstQuestion),this.addEventListener("chatbot-close",this.cancel)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("yp-ws-opened",this.sendFirstQuestion),this.addEventListener("chatbot-close",this.cancel)}async sendFirstQuestion(){window.appGlobals.activity("Explain - first qestion");const t=`**${this.t("hereIsTheQuestion")}:**\n${this.questionText}\n\n**${this.t("firstAnswer")}:**\n${this.leftAnswerText}\n\n**${this.t("secondAnswer")}**\n${this.rightAnswerText}\n`;this.addChatBotElement({sender:"user",type:"start",message:t}),this.addThinkingChatBotMessage(),await this.serverApi.llmAnswerConverstation(this.groupId,this.wsClientId,this.simplifiedChatLog,g.getEnglishName(this.language))}async sendChatMessage(){const t=this.chatInputField.value;0!==t.length&&(this.chatInputField.value="",this.sendButton.disabled=!1,setTimeout((()=>{this.chatInputField.blur()})),this.addChatBotElement({sender:"user",type:"start",message:t}),this.addThinkingChatBotMessage(),await this.serverApi.llmAnswerConverstation(this.groupId,this.wsClientId,this.simplifiedChatLog,g.getEnglishName(this.language)))}open(){this.dialog.show(),this.currentError=void 0,window.appGlobals.activity("Llm explain - open")}cancel(){this.dialog.close(),window.appGlobals.activity("Llm explain - cancel"),this.fire("closed")}textAreaKeyDown(t){return!(13===t.keyCode&&!t.shiftKey)||(t.preventDefault(),!1)}static get styles(){return[...super.styles,f,t`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }

        #dialog {
          width: 100%;
          max-width: 800px;
          max-height: 100vh;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }


        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          #dialog {
            border-radius: 0;
          }

          #content, slot[name="content"]::slotted(*) {
            padding: 8px;
          }
        }
      `]}render(){return n`<md-dialog
      @closed="${()=>this.cancel()}"
      ?fullscreen="${!this.wide}"
      class="dialog"
      id="dialog"
    >
      <div slot="headline">${this.t("explainBothAnswers")}</div>
      <div slot="content" id="content">${super.render()}</div>
    </md-dialog> `}};C([e({type:Object})],O.prototype,"earl",void 0),C([e({type:Number})],O.prototype,"groupId",void 0),C([e({type:Object})],O.prototype,"question",void 0),C([e({type:String})],O.prototype,"questionText",void 0),C([e({type:String})],O.prototype,"leftAnswerText",void 0),C([e({type:String})],O.prototype,"rightAnswerText",void 0),C([e({type:Object})],O.prototype,"leftAnswer",void 0),C([e({type:Object})],O.prototype,"rightAnswer",void 0),C([e({type:String})],O.prototype,"currentError",void 0),C([e({type:Boolean})],O.prototype,"showCloseButton",void 0),C([e({type:String})],O.prototype,"defaultInfoMessage",void 0),C([l("#dialog")],O.prototype,"dialog",void 0),O=C([i("aoi-llm-explain-dialog")],O);var S=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let L=class extends o{constructor(){super(),this.voteCount=0,this.spinnersActive=!1,this.breakForVertical=!1,this.breakButtonsForVertical=!1,this.llmExplainOpen=!1,this.level=1,this.resetAnimation=this.resetAnimation.bind(this)}async connectedCallback(){super.connectedCallback(),this.setupBootListener(),this.spinnersActive=!1,this.fire("needs-new-earl"),window.appGlobals.activity("Voting - open"),this.resetTimer(),this.installMediaQueryWatcher("(max-width: 800px)",(t=>{this.breakForVertical=t})),this.installMediaQueryWatcher("(max-width: 450px)",(t=>{this.breakButtonsForVertical=t}))}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Voting - close"),this.fireGlobal("set-ids",{questionId:this.question.id,promptId:void 0})}resetTimer(){this.timer=(new Date).getTime()}animateButtons(t){return new Promise((e=>{const i=this.shadowRoot?.querySelector("#leftAnswerButton"),o=this.shadowRoot?.querySelector("#rightAnswerButton");i?.addEventListener("animationend",this.resetAnimation),o?.addEventListener("animationend",this.resetAnimation),"left"===t?(i?.classList.add("animate-up","fade-slow"),o?.classList.add("animate-down","fade-fast")):"right"===t?(o?.classList.add("animate-up","fade-slow"),i?.classList.add("animate-down","fade-fast")):(i?.classList.add("fade-slow"),o?.classList.add("fade-slow")),e()}))}resetAnimation(t){t.target.classList.remove("animate-up","animate-down","animate-from-left","animate-from-right","fade-fast","fade-slow")}async voteForAnswer(t){window.appGlobals.activity(`Voting - ${t}`);const e={time_viewed:(new Date).getTime()-(this.timer||0),prompt_id:this.promptId,direction:t,appearance_lookup:this.appearanceLookup},i=window.aoiServerApi.postVote(this.groupId,this.question.id,this.promptId,this.language,e,t);let o=this.animateButtons(t);const a=setTimeout((()=>{this.spinnersActive=!0}),1e3),[r]=await Promise.all([i,o]);if(clearTimeout(a),this.spinnersActive=!1,!r)return this.fire("display-snackbar",this.t("Network error, please try again.")),void this.removeAndInsertFromLeft();{try{this.leftAnswer=JSON.parse(r.newleft)}catch(t){console.warn("Error parsing answers JSON",t,r.newleft),this.leftAnswer=r.newleft}try{this.rightAnswer=JSON.parse(r.newright)}catch(t){console.warn("Error parsing answers JSON",t,r.newright),this.rightAnswer=r.newright}this.promptId=r.prompt_id,this.appearanceLookup=r.appearance_lookup,this.fire("update-appearance-lookup",{appearanceLookup:this.appearanceLookup,promptId:this.promptId,leftAnswer:this.leftAnswer,rightAnswer:this.rightAnswer}),this.fireGlobal("set-ids",{questionId:this.question.id,promptId:this.promptId}),this.removeAndInsertFromLeft();const e=this.shadowRoot?.querySelectorAll("md-elevated-button");e?.forEach((t=>{t.blur()})),"skip"!==t&&(this.question.visitor_votes+=1),this.requestUpdate(),this.resetTimer()}}async setLabelOnMdButton(){const t=this.shadowRoot?.querySelectorAll("md-elevated-button");t?(await this.updateComplete,t.forEach((t=>{const e=t.shadowRoot;if(e){const t=e.querySelector("button .label");t?t.style.overflow="visible":console.error("Label span not found within the shadow DOM of the button")}else console.error("Shadow DOM not found for the button")}))):console.error("No custom buttons found")}firstUpdated(t){super.firstUpdated(t),this.setLabelOnMdButton()}removeAndInsertFromLeft(){const t=this.shadowRoot?.querySelector("#leftAnswerButton"),e=this.shadowRoot?.querySelector("#rightAnswerButton");t?.classList.remove("animate-up","animate-down","fade-fast","fade-slow"),e?.classList.remove("animate-up","animate-down","fade-fast","fade-slow"),t?.classList.add("animate-from-left"),e?.classList.add("animate-from-right")}openNewIdeaDialog(){this.$$("#newIdeaDialog").open()}async openLlmExplainDialog(){this.llmExplainOpen=!0,await this.updateComplete,this.$$("#llmExplainDialog").open()}static get styles(){return[super.styles,f,t`
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-surface-container-high
          );
          --md-elevated-button-label-text-color: var(--md-sys-color-on-surface);
        }

        yp-magic-text {
          min-width: 265px;
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: 0;
          border-radius: 70px;
          background-color: transparent;
        }

        .iconImage[rtl] {
          margin-right: 0;
          margin-left: 0px;
        }

        .iconImageRight {
        }

        .buttonContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: normal;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-surface
          );
        }

        @supports (white-space: collapse balance) {
          .buttonContainer md-elevated-button {
            white-space: collapse balance;
          }
        }

        .spinnerContainer {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 120px;
          margin: 8px;
          width: 400px;
        }

        .progressBarContainer {
          width: 450px;
          height: 10px;
          background-color: var(--md-sys-color-on-secondary);
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          margin-top: 40px;
        }

        .progressBar {
          height: 100%;
          background-color: var(--md-sys-color-secondary);
          transition: width 0.4s ease-in-out;
        }

        .progressBarText {
          font-size: 12px;
          text-align: right;
          padding-top: 4px;
          color: var(--md-sys-color-secondary);
          width: 450px;
        }

        .or {
          font-size: 22px;
          padding: 8px;
          color: var(--md-sys-color-secondary);
        }

        .questionTitle {
          margin-top: 32px;
        }

        .newIdeaButton,
        .skipButton {
          margin-top: 24px;
          margin-left: 12px;
          margin-right: 12px;
        }

        .skipButton {
          margin-left: 8px;
        }

        .buttonContainer {
          margin-top: 32px;
        }

        .md-elevated-button {
          transition: transform 0.3s ease-out;
        }

        .fade-fast {
          transition: opacity 0.5s ease-out;
          opacity: 0.2;
        }

        .fade-slow {
          transition: opacity 1s ease-out;
          opacity: 0.9;
        }

        .animate-up,
        .animate-down {
          transition: transform 1s ease-out;
        }

        .animate-up {
          transform: translateY(-450px);
        }

        .animate-down {
          transform: translateY(450px);
        }

        .animate-from-left,
        .animate-from-right {
          opacity: 1;
        }

        .animate-from-left {
          animation: slideInFromLeft 0.7s forwards;
        }

        .animate-from-right {
          animation: slideInFromRight 0.7s forwards;
        }

        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          0% {
            transform: translateX(120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 450px) {
          .animate-up {
            transform: translateY(-550px);
          }

          .animate-down {
            transform: translateY(550px);
          }

          .buttonContainer md-elevated-button {
            width: 92vw;
            max-width: 92vw;
            font-size: 15px;
            margin-top: 8px;
            margin-bottom: 16px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 0px;
            font-size: 22 px;
          }

          yp-magic-text {
            min-width: 100%;
          }

          .spinnerContainer {
            width: 100%;
            height: 100px;
          }

          .topContainer {
            overflow-x: clip;
          }

          .progressBarContainer {
            width: 80%;
          }

          .progressBarText {
            width: 80%;
          }

          .or {
            font-size: 18px;
            padding: 4px;
            color: var(--md-sys-color-secondary);
          }
        }

        @media (max-width: 360px) {
          .buttonContainer md-elevated-button {
            width: 92vw;
            max-width: 92vw;
            font-size: 14px;
            margin-top: 8px;
            margin-bottom: 16px;
          }
        }
      `]}renderProgressBar(){if(this.earl.configuration){let t=this.earl.configuration.target_votes||30;if(!this.currentLevelTargetVotes||this.question.visitor_votes>=this.currentLevelTargetVotes){this.currentLevelTargetVotes=t;let e=1;for(;this.question.visitor_votes>=this.currentLevelTargetVotes;)this.currentLevelTargetVotes*=2,e*=2;let i=Math.log(e)/Math.log(2)+1;this.level=i}let e=this.currentLevelTargetVotes;const i=Math.min(this.question.visitor_votes/e*100,100);return n`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${i}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t("votes of")} ${e}
          ${this.t("target")} (${this.t("Level")} ${this.level})
        </div>
      `}return d}render(){return this.question?n`
        <div
          class="topContainer layout vertical wrap center-center"
          tabindex="-1"
        >
          <div class="questionTitle">
            <yp-magic-text
              id="questionText"
              .contentId="${this.groupId}"
              .extraId="${this.question.id}"
              textOnly
              truncate="400"
              .content="${this.question.name}"
              .contentLanguage="${this.group.language}"
              textType="aoiQuestionName"
            ></yp-magic-text>
          </div>
          <div
            class="buttonContainer layout ${this.breakForVertical?"vertical":"horizontal"} wrap center-center"
          >
            ${this.spinnersActive?n`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `:d}
            <md-elevated-button
              id="leftAnswerButton"
              class="leftAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${()=>this.voteForAnswer("left")}
            >
              ${this.leftAnswer?.imageUrl?n`
                    <yp-image
                      slot="icon"
                      .src="${this.leftAnswer?.imageUrl}"
                      .alt="${this.leftAnswer?.content||this.leftAnswer}"
                      .title="${this.leftAnswer?.content||this.leftAnswer}"
                      ?rtl="${this.rtl}"
                      class="iconImage"
                    ></yp-image>
                  `:d}
              <yp-magic-text
                id="leftAnswerText"
                class="magicAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.leftAnswer.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.leftAnswer?.content||this.leftAnswer}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
            <div class="layout horizontal center-center">
              <span class="or"> ${this.t("or")} </span>
            </div>
            ${this.spinnersActive?n`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `:d}
            <md-elevated-button
              id="rightAnswerButton"
              class="rightAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${()=>this.voteForAnswer("right")}
            >
              ${this.rightAnswer?.imageUrl?n`
                    <yp-image
                      slot="icon"
                      ?rtl="${this.rtl}"
                      src="${this.rightAnswer?.imageUrl}"
                      .alt="${this.rightAnswer?.content||this.rightAnswer}"
                      .title="${this.rightAnswer?.content||this.rightAnswer}"
                      class="iconImageRight"
                    ></yp-image>
                  `:d}
              <yp-magic-text
                id="rightAnswerText"
                class="magicAnswerText"
                .contentId="${this.groupId}"
                .extraId="${this.rightAnswer.choiceId}"
                .additionalId="${this.question.id}"
                textOnly
                truncate="140"
                .content="${this.rightAnswer?.content||this.rightAnswer}"
                .contentLanguage="${this.group.language}"
                textType="aoiChoiceContent"
              ></yp-magic-text>
            </md-elevated-button>
          </div>
          <div
            class="layout ${this.breakButtonsForVertical?"vertical":"horizontal"} center-center wrap"
          >
            <md-text-button
              ?hidden="${!this.hasLlm||this.earl.configuration?.hide_explain}"
              class="skipButton"
              @click=${this.openLlmExplainDialog}
            >
              ${this.t("Explain")}
            </md-text-button>

            <md-text-button
              ?hidden="${this.earl.configuration?.hide_skip}"
              class="skipButton"
              @click=${()=>this.voteForAnswer("skip")}
            >
              ${this.t("Skip")}
            </md-text-button>
            <md-text-button
              ?hidden="${!this.earl.configuration?.accept_new_ideas}"
              class="newIdeaButton"
              @click="${this.openNewIdeaDialog}"
            >
              ${this.t("Add your own answer")}
            </md-text-button>
          </div>
          ${this.renderProgressBar()}
          <div class="layout horizontal wrap center-center"></div>
        </div>
        ${this.wide?d:n`
              <input
                type="text"
                id="dummyInput"
                style="position:absolute;opacity:0;"
              />
            `}
        <aoi-new-idea-dialog
          id="newIdeaDialog"
          .question=${this.question}
          .groupId=${this.groupId}
          .group=${this.group}
          @new-idea-added="${()=>this.voteForAnswer("skip")}"
          .earl=${this.earl}
        ></aoi-new-idea-dialog>
        ${this.llmExplainOpen?n`
              <aoi-llm-explain-dialog
                id="llmExplainDialog"
                .question=${this.question}
                .questionText=${this.$$("#questionText").translatedContent}
                .leftAnswerText=${this.$$("#leftAnswerText").translatedContent}
                .rightAnswerText=${this.$$("#rightAnswerText").translatedContent}
                @closed=${()=>this.llmExplainOpen=!1}
                .earl=${this.earl}
                .groupId=${this.groupId}
                .leftAnswer=${this.leftAnswer}
                .rightAnswer=${this.rightAnswer}
              ></aoi-llm-explain-dialog>
            `:d}
      `:d}};S([e({type:Number})],L.prototype,"groupId",void 0),S([e({type:Object})],L.prototype,"earl",void 0),S([e({type:Object})],L.prototype,"question",void 0),S([e({type:Object})],L.prototype,"firstPrompt",void 0),S([e({type:Number})],L.prototype,"promptId",void 0),S([e({type:Object})],L.prototype,"group",void 0),S([e({type:Number})],L.prototype,"voteCount",void 0),S([e({type:Boolean})],L.prototype,"spinnersActive",void 0),S([e({type:Object})],L.prototype,"leftAnswer",void 0),S([e({type:Object})],L.prototype,"rightAnswer",void 0),S([e({type:String})],L.prototype,"appearanceLookup",void 0),S([e({type:Boolean})],L.prototype,"breakForVertical",void 0),S([e({type:Boolean})],L.prototype,"breakButtonsForVertical",void 0),S([e({type:Boolean})],L.prototype,"llmExplainOpen",void 0),S([e({type:Number})],L.prototype,"level",void 0),S([e({type:Number})],L.prototype,"currentLevelTargetVotes",void 0),L=S([i("aoi-survey-voting")],L);var q=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let _=class extends o{constructor(){super(...arguments),this.showScores=!1}async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Results - open")}async fetchResults(){this.results=await window.aoiServerApi.getResults(this.groupId,this.question.id,!this.earl?.configuration?.minimum_ten_votes_to_show_results)}updated(t){super.updated(t),t.has("earl")&&this.earl&&this.fetchResults()}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Results - close")}toggleScores(){const t=this.$$("#showScores");this.showScores=t.checked,window.appGlobals.activity("Results - toggle scores "+(this.showScores?"on":"off"))}exportToCSV(){const t=(t,e)=>null===e?"":e;let e=Object.keys(this.results[0]).flatMap((t=>"data"===t?["content","imageUrl"]:[t])),i=this.results.map((i=>e.map((e=>{if("content"===e||"imageUrl"===e){const o=i.data[e];return JSON.stringify(o,t)}return JSON.stringify(i[e],t)})).join(",")));i.unshift(e.join(","));const o=i.join("\r\n"),a=new Blob([o],{type:"text/csv"}),r=URL.createObjectURL(a),n=document.createElement("a");n.href=r,n.download="survey_results.csv",n.click(),URL.revokeObjectURL(r),setTimeout((()=>n.remove()),0),window.appGlobals.activity("Results - export to csv")}static get styles(){return[super.styles,f,t`
        .title {
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container-high);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .rankOrderInfo {
          font-size: 20px;
          margin: 8px;
          margin-bottom: 16px;
          margin-top: 16px;
          text-align: center;
        }

        .minimumTenVotesInfo {
          padding: 16px;
        }

        .answerImage {
          width: 75px;
          height: 75px;
          border-radius: 45px;
        }

        .subTitle {
        }

        .profileImage {
          width: 50px;
          height: 50px;
          min-height: 50px;
          min-width: 50px;
          margin-right: 8px;
        }

        .row {
          padding: 8px;
          margin: 8px;
          border-radius: 16px;
          background-color: var(--md-sys-color-surface-container-lowest);
          color: var(--md-sys-color-on-surface);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;

          padding-bottom: 16px;
          margin-bottom: 16px;
        }

        .row[current-user] {
          background-color: var(--md-sys-color-teriary);
          color: var(--md-sys-color-on-primary);
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 20px;
        }

        .ideaName {
          padding-bottom: 0;
          font-size: 20px;
          width: 100%;
        }

        .nameAndScore {
          width: 100%;
        }

        .scores {
          margin-top: 16px;
          padding: 16px;
          padding-top: 12px;
          padding-bottom: 12px;
          margin-bottom: 0px;
          text-align: center;
          background-color: var(--md-sys-color-surface-container);
          color: var(--md-sys-color-on-surface);
          border-radius: 24px;
          font-size: 14px;
          line-height: 1.3;
        }

        label {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .checkboxText {
          margin-left: 8px;
          margin-bottom: 2px;
        }

        md-checkbox {
          padding-bottom: 8px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }

        .scores[hidden] {
          display: none;
        }

        .winLosses {
          margin-top: 4px;
        }

        .scoreAndNameContainer {
          width: 100%;
        }

        .exportButton {
          margin-bottom: 128px;
          margin-top: 32px;
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
          .loading {
            width: 100vw;
            height: 100vh;
          }

          .title {
            font-size: 18px;
            letter-spacing: 0.15em;
            line-height: 1.5;
            margin-top: 16px;
          }

          .index {
            font-size: 16px;
          }

          .ideaName {
            font-size: 16px;
          }

          .row {
            min-width: 300px;
            width: 300px;
          }
        }
      `]}renderRow(t,e){return n`
      <div class="row layout horizontal">
        <div class="column index">${t+1}.</div>
        <div class="layout horizontal nameAndScore">
          <div class="layout vertical scoreAndNameContainer">
            <div class="layout horizontal">
              <div class="column ideaName">
                <yp-magic-text
                  id="answerText"
                  .contentId="${this.groupId}"
                  .extraId="${e.data.choiceId}"
                  .additionalId="${this.question.id}"
                  textOnly
                  truncate="140"
                  .content="${e.data.content}"
                  .contentLanguage="${this.group.language}"
                  textType="aoiChoiceContent"
                ></yp-magic-text>
              </div>
              <div class="flex"></div>
              <img
                class="answerImage"
                ?hidden="${null==e.data.imageUrl}"
                src="${e.data.imageUrl}"
                alt="${e.data.content}"
              />
            </div>
            <div
              class="column layout vertical center-center scores"
              ?hidden="${!this.showScores}"
            >
              <div>
                <b
                  >${this.t("How likely to win")}:
                  ${Math.round(e.score)}%</b
                >
              </div>
              <div class="winLosses">
                ${this.t("Wins")}: ${m.number(e.wins)}
                ${this.t("Losses")}:
                ${m.number(e.losses)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}render(){return this.results?n`
          <div class="topContainer layout vertical wrap center-center">
            <div class="rankOrderInfo">${this.t("rankedOrderInfo")}</div>
            <div class="questionTitle">
              <yp-magic-text
                id="answerText"
                .contentId="${this.group.id}"
                .extraId="${this.question.id}"
                textOnly
                truncate="300"
                .content="${this.question.name}"
                .contentLanguage="${this.group.language}"
                textType="aoiQuestionName"
              ></yp-magic-text>
            </div>

            <div class="layout horizontal">
              <label>
                <md-checkbox
                  id="showScores"
                  @change="${this.toggleScores}"
                ></md-checkbox>
                <span class="checkboxText">${this.t("Show scores")}</span>
              </label>
            </div>
            ${this.results.map(((t,e)=>this.renderRow(e,t)))}
            ${this.earl.configuration?.minimum_ten_votes_to_show_results?n`
              <div class="minimumTenVotesInfo">${this.t("minimumTenVotesInfo")}</div>
            `:d}
            <div class="title subTitle">
              ${m.number(this.question.votes_count)}
              ${this.t("total votes")}
            </div>
            <md-outlined-button @click=${this.exportToCSV} class="exportButton">
              ${this.t("Download Results as CSV")}
            </md-outlined-button>
          </div>
        `:n`<div class="loading">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>`}};q([e({type:Array})],_.prototype,"results",void 0),q([e({type:Object})],_.prototype,"question",void 0),q([e({type:Object})],_.prototype,"earl",void 0),q([e({type:Object})],_.prototype,"group",void 0),q([e({type:Number})],_.prototype,"groupId",void 0),q([e({type:Boolean})],_.prototype,"showScores",void 0),_=q([i("aoi-survey-results")],_);var B=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let P=class extends u{constructor(){super(),this.analysis="",this.selectedChoices=[],this.serverApi=new T}async connectedCallback(){super.connectedCallback(),this.addEventListener("yp-ws-opened",this.streamAnalysis)}disconnectedCallback(){super.disconnectedCallback(),this.addEventListener("yp-ws-opened",this.streamAnalysis)}async streamAnalysis(){const{cachedAnalysis:t,selectedChoices:e}=await this.serverApi.getSurveyAnalysis(this.groupId,this.wsClientId,this.analysisIndex,this.analysisTypeIndex,g.getEnglishName(this.language)||"");t&&(this.analysis=t),this.selectedChoices=e}renderChoice(t,e){return n`
      <div class="answers layout horizontal" style="width: 100%">
        <div class="column index ideaIndex">${t+1}.</div>
        <div class="layout horizontal" style="width: 100%">
          <div class="column ideaName">
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${e.data.choiceId}"
              .additionalId="${this.earl.question_id}"
              textOnly
              truncate="140"
              .content="${e.data.content}"
              .contentLanguage="${this.group.language}"
              textType="aoiChoiceContent"
            ></yp-magic-text>
          </div>
          <div class="flex"></div>
          <img
            class="answerImage"
            ?hidden="${null==e.data.imageUrl}"
            src="${e.data.imageUrl}"
            alt="${e.data.content}"
          />
        </div>
      </div>
    `}async addChatBotElement(t){switch(t.type){case"start":case"moderation_error":case"error":case"end":break;case"stream":if(t.message&&"undefined"!=t.message){this.analysis+=t.message;break}console.warn("stream message is undefined")}this.scrollDown()}static get styles(){return[super.styles,t`
        .content {
          margin: 16px;
          margin-bottom: 0;
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 16px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .answers {
          text-align: left;
          align-items: left;
          width: 100%;
          margin-bottom: 8px;
        }

        .answerImage {
          width: 60px;
          height: 60px;
          border-radius: 45px;
        }



        @media (max-width: 960px) {
          .ideaDescription {
            padding-right: 24px;
          }

          .ideaIndex {
            padding-left: 24px;
          }
        }
      `]}render(){return n`<div class="content layout vertical">
      ${this.selectedChoices.map(((t,e)=>this.renderChoice(e,t)))}
      ${y(this.analysis,{includeImages:!0,includeCodeBlockClassNames:!0})}
      <div ?hidden="${!this.analysis}" class="generatingInfo">${this.t("Written by GPT-4")}</div>
    </div>`}};B([e({type:Object})],P.prototype,"earl",void 0),B([e({type:Number})],P.prototype,"groupId",void 0),B([e({type:Object})],P.prototype,"group",void 0),B([e({type:Number})],P.prototype,"analysisIndex",void 0),B([e({type:Number})],P.prototype,"analysisTypeIndex",void 0),B([e({type:String})],P.prototype,"analysis",void 0),B([e({type:Array})],P.prototype,"selectedChoices",void 0),P=B([i("aoi-streaming-analysis")],P);var N=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let G=class extends o{async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Analysis - open")}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Analysis - close")}renderStreamingAnalysis(){try{const t=JSON.parse(this.earl.configuration.analysis_config);return n` ${t.analyses.map((t=>t.map((e=>n`<aoi-streaming-analysis
            groupId=${this.groupId}
            analysisIndex=${t.analysisIndex}
            analysisTypeIndex=${e}
          >
          </aoi-streaming-analysis>`))))}`}catch(t){return console.error(t),d}}updated(t){super.updated(t)}static get styles(){return[...super.styles,f,t`
        .title {
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }


        .analysisInfo {
          font-size: 20px;
          margin: 8px;
          margin-bottom: 16px;
          margin-top: 16px;
          text-align: center;
        }

        .analysisTitle {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-top: 8px;
          border-radius: 16px;
          text-align: center;
        }

        .ideasLabel {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-bottom: 8px;
          width: 80%;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
        }

        .analysisResults {
          padding: 16px;
          padding-top: 0;
        }

        .rowsContainer {
          padding: 0;
          padding-top: 0px;
          padding-bottom: 8px;
          margin: 16px;
          width: 100%;
          margin-top: 8px;
          border-radius: 24px;
          margin-bottom: 16px;
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container);
        }

        .analysisContainer {
          padding: 8px;
          margin: 8px;
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;
          margin-top: 0;
          padding-top: 0;

          padding-bottom: 16px;
        }

        aoi-streaming-analysis {
          margin-bottom: 16px;
          border-radius: 16px;
        }

        .analysisRow {
          margin-bottom: 16px;
          width: 100%;
        }

        .analysisRow {
          padding: 0px;
          margin: 0px;
          border-radius: 16px;
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 16px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .analysisRow {
        }

        .answers {
          text-align: left;
          align-items: left;
          width: 100%;
        }

        .questionTitle {
        }

        aoi-streaming-analysis {
          padding: 16px;
        }


        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
          .title {
            font-size: 18px;
            letter-spacing: 0.15em;
            line-height: 1.5;
            margin-top: 16px;
          }

          .row {
            min-width: 300px;
            width: 300px;
          }

          .analysisContainer {
            min-width: 100%;
            width: 100%;
            padding-left: 0;
            padding-right: 0;
            margin: 0;
          }

          .analysisResults {
            border-radius: 16px;
          }

          .analysisRow {
            width: 100%;
          }

          .ideaDescription {
            padding-right: 24px;
          }

          .ideaIndex {
            padding-left: 24px;
          }
        }
      `]}renderAnalysis(){let t=n``;if(this.earl.configuration&&this.earl.configuration.analysis_config?.analyses?.length>0)for(let e=0;e<this.earl.configuration.analysis_config.analyses.length;e++){const i=this.earl.configuration.analysis_config.analyses[e];t=n`${t}`;let o=n``;for(let t=0;t<i.analysisTypes.length;t++)o=n`${o}
            <aoi-streaming-analysis
              .groupId=${this.group.id}
              .group=${this.group}
              .earl=${this.earl}
              .analysisIndex=${e}
              .analysisTypeIndex=${t}
            >
            </aoi-streaming-analysis>`;t=n`${t}
          <div class="rowsContainer">${o}</div>`}return t}render(){return n`
      <div class="topContainer layout vertical wrap center-center">
        <div class="analysisInfo">${this.t("aiAnalysisInfo")}</div>
        <div class="layout vertical self-start">
          <div class="questionTitle">
            <yp-magic-text
              id="answerText"
              .contentId="${this.group.id}"
              .extraId="${this.question.id}"
              textOnly
              truncate="300"
              .content="${this.question.name}"
              .contentLanguage="${this.group.language}"
              textType="aoiQuestionName"
            ></yp-magic-text>
          </div>
        </div>
        <div class="layout vertical center-center analysisContainer">
          ${this.renderAnalysis()}
        </div>
      </div>
    `}};N([e({type:Number})],G.prototype,"groupId",void 0),N([e({type:Object})],G.prototype,"group",void 0),N([e({type:Object})],G.prototype,"question",void 0),N([e({type:Object})],G.prototype,"earl",void 0),G=N([i("aoi-survey-analysis")],G);class E extends x{constructor(t){super(t,!0),this.disableParentConstruction=!0,this.setIds=t=>{this.questionId=t.detail.questionId,this.earlId=t.detail.earlId,this.promptId=t.detail.promptId},this.parseQueryString=()=>{const t=(window.location.search||"?").substr(1);let e={};const i=/([^&=]+)=?([^&]*)(?:&+|$)/g;let o;for(;o=i.exec(t);){const t=o[1],i=o[2];e[t]=i}this.originalQueryParameters=e},this.getSessionFromCookie=()=>{const t=document.cookie.split(";");let e="";for(let i=0;i<t.length;i++){let o=t[i].split("=")[0],a=t[i].split("=")[1];"_all_our_ideas_session"===o.trim()&&(e=a)}return e},this.activity=(t,e=void 0)=>{let i;i=window.appUser&&window.appUser.user?window.appUser.user.id.toString():"-1";const o=new Date,a={actor:i,type:t,object:e,path_name:location.pathname,event_time:o.toISOString(),session_id:this.getSessionFromCookie(),originalQueryString:this.getOriginalQueryString(),originalReferrer:this.originalReferrer,questionId:this.questionId,earlId:this.earlId,promptId:this.promptId,userLocale:window.locale,userAutoTranslate:window.autoTranslate,user_agent:navigator.userAgent,referrer:document.referrer,url:location.href,screen_width:window.innerWidth};try{fetch("/api/users/createActivityFromApp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((e=>{e.ok?"Voting - left"!==t&&"Voting - right"!==t&&"New Idea - added"!==t||this.checkExternalGoalTrigger(t):console.error(`HTTP error! status: ${e.status}`)})).catch((t=>{console.error("There has been a problem with your fetch operation:",t)}))}catch(t){console.error(t)}},this.parseQueryString(),this.originalReferrer=document.referrer,document.addEventListener("set-ids",this.setIds.bind(this))}getOriginalQueryString(){return this.originalQueryParameters?new URLSearchParams(this.originalQueryParameters).toString():null}}var U=function(t,e,i,o){for(var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o,s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const j=1,z=2,R=3,F=4,V=5;let D=class extends o{constructor(){super(),this.pageIndex=1,this.totalNumberOfVotes=0,this.isAdmin=!1,this.surveyClosed=!1,window.aoiServerApi=new T,window.aoiAppGlobals=new E(window.aoiServerApi),window.aoiAppGlobals.activity("pageview")}connectedCallback(){super.connectedCallback(),this.setupBootListener(),this._setupEventListeners(),this.collection.configuration.allOurIdeas?(console.error("Connecting to old configuration"),this.getEarl()):this.fire("yp-network-error",{showUserError:!0})}async getEarl(){window.aoiAppGlobals.activity("Survey - fetch start");try{const t=await window.aoiServerApi.getEarlData(this.collectionId);this.earl=this.collection.configuration.allOurIdeas.earl,this.question=t.question,this.prompt=t.prompt,this.appearanceLookup=this.question.appearance_id;try{this.currentLeftAnswer=JSON.parse(this.prompt.left_choice_text),this.currentRightAnswer=JSON.parse(this.prompt.right_choice_text)}catch(t){console.warn("Error parsing prompt answers",t),this.currentLeftAnswer=this.prompt.left_choice_text,this.currentRightAnswer=this.prompt.right_choice_text}this.currentPromptId=this.prompt.id,document.title=this.question.name,this.earl.active?this.surveyClosed=!1:this.surveyClosed=!0,this.fireGlobal("set-ids",{questionId:this.question.id,promptId:this.prompt.id}),window.aoiAppGlobals.activity("Survey - fetch end")}catch(t){console.error("Error fetching earl",t),window.aoiAppGlobals.activity("Survey - fetch error")}}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}scrollToCollectionItemSubClass(){}getHexColor(t){return t&&6===(t=t.replace(/#/g,"")).length?`#${t}`:void 0}snackbarclosed(){this.lastSnackbarText=void 0}tabChanged(t){0==t.detail.activeIndex?this.pageIndex=1:1==t.detail.activeIndex?this.pageIndex=2:2==t.detail.activeIndex?this.pageIndex=3:3==t.detail.activeIndex&&(this.pageIndex=4)}exitToMainApp(){}async _displaySnackbar(t){this.lastSnackbarText=t.detail,await this.updateComplete,this.$$("#snackbar").open=!0}_setupEventListeners(){this.addListener("display-snackbar",this._displaySnackbar)}_removeEventListeners(){this.removeListener("display-snackbar",this._displaySnackbar)}externalGoalTrigger(){try{let t=new URL(window.aoiAppGlobals.externalGoalTriggerUrl),e=window.aoiAppGlobals.exernalGoalParamsWhiteList;e&&(e=e.toLowerCase().split(",").map((t=>t.trim())));for(const i in window.aoiAppGlobals.originalQueryParameters)e&&!e.includes(i.toLowerCase())||t.searchParams.append(i,window.aoiAppGlobals.originalQueryParameters[i]);window.location.href=t.toString()}catch(t){console.error("Invalid URL:",window.aoiAppGlobals.externalGoalTriggerUrl,t)}}updated(t){super.updated(t)}_appError(t){console.error(t.detail.message),this.currentError=t.detail.message}get adminConfirmed(){return!0}_settingsColorChanged(t){this.fireGlobal("yp-theme-color",t.detail.value)}static get styles(){return[...super.styles,t`
        :host {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        md-tabs {
          z-index: 0;
        }

        :host {
        }

        md-tabs {
          width: 100%;
          max-width: 960px;
        }

        body {
          background-color: var(--md-sys-color-on-surface, #fefefe);
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
        }

        .drawer {
          margin-left: 16px;
          padding-left: 8px;
          margin-right: 16px;
          padding-bottom: 560px;
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-background);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-background
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        md-navigation-bar {
          --md-navigation-bar-container-color: var(--md-sys-color-surface);
        }

        .loading {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100vh;
          margin-top: 64px;
        }

        .lightDarkContainer {
          padding-left: 8px;
          padding-right: 8px;
          color: var(--md-sys-color-on-surface);
          font-size: 14px;
        }

        .darkModeButton {
          margin: 16px;
        }

        .mainPageContainer {
          overflow: hidden;
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

        .collectionLogoImage {
          width: 60px;
          height: 60px;
          margin-left: 64px;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1;
        }

        [hidden] {
          display: none !important;
        }

        md-text-button {
          --md-text-button-label-text-color: #fefefe;
        }

        md-icon-button {
          --md-icon-button-unselected-icon-color: #f0f0f0;
        }

        #goalTriggerSnackbar {
          padding: 24px;
        }

        @media (max-width: 960px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          prompt-promotion-dashboard {
            max-width: 100%;
          }
        }
      `]}changeTabTo(t){this.tabChanged({detail:{activeIndex:t}})}updateThemeColor(t){this.themeColor=t.detail}sendVoteAnalytics(){this.totalNumberOfVotes%10==0&&window.aoiAppGlobals.activity(`User voted ${this.totalNumberOfVotes} times`)}updateappearanceLookup(t){this.appearanceLookup=t.detail.appearanceLookup,this.currentPromptId=t.detail.promptId,this.currentLeftAnswer=t.detail.leftAnswer,this.currentRightAnswer=t.detail.rightAnswer,this.totalNumberOfVotes++,this.question.votes_count++,this.sendVoteAnalytics()}renderIntroduction(){return n` <div class="layout vertical center-center"></div> `}renderShare(){return n` <div class="layout vertical center-center"></div> `}startVoting(){this.pageIndex=2,this.$$("#navBar")&&(this.$$("#navBar").activeIndex=1),this.$$("#votingTab")&&(this.$$("#votingTab").selected=!0),this.$$("#introTab")&&(this.$$("#introTab").selected=!1)}openResults(){this.pageIndex=3,this.$$("#navBar")&&(this.$$("#navBar").activeIndex=2),this.$$("#resultsTab")&&(this.$$("#resultsTab").selected=!0),this.$$("#introTab")&&(this.$$("#introTab").selected=!1)}triggerExternalGoalUrl(){window.location.href=window.aoiAppGlobals.externalGoalTriggerUrl}_renderPage(){if(!this.earl)return n` <div class="loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>`;switch(this.pageIndex){case j:return n`<aoi-survey-intro
            .earl="${this.earl}"
            .group="${this.collection}"
            .question="${this.question}"
            @startVoting="${this.startVoting}"
            @openResults="${this.openResults}"
            .themeDarkMode="${this.themeDarkMode}"
          ></aoi-survey-intro>`;case z:return v(n`<aoi-survey-voting
            .earl="${this.earl}"
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .question="${this.question}"
            .leftAnswer="${this.currentLeftAnswer}"
            .rightAnswer="${this.currentRightAnswer}"
            .promptId="${this.currentPromptId}"
            .appearanceLookup="${this.appearanceLookup}"
            @update-appearance-lookup="${this.updateappearanceLookup}"
          ></aoi-survey-voting>`);case R:return n`<aoi-survey-results
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-results>`;case F:return n`<aoi-survey-analysis
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-analysis>`;case V:return n` ${this.renderShare()} `;default:return n`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `}}renderScore(){return n` <div class="layout vertical center-center"></div> `}renderNavigationBar(){return this.wide?n`
        <div class="layout vertical center-center">
          <md-tabs aria-label="Navigation Tabs">
            <md-primary-tab
              id="introTab"
              class="${this.pageIndex==j&&"selectedContainer"}"
              selected
              @click="${()=>this.changeTabTo(0)}"
              aria-label="${this.t("Why Participate")}"
            >
              <md-icon slot="icon">info</md-icon>
              ${this.t("About this project")}
            </md-primary-tab>

            <md-primary-tab
              id="votingTab"
              ?hidden="${this.surveyClosed}"
              class="${this.pageIndex==z&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(1)}"
              aria-label="${this.t("Participate Now!")}"
            >
              <md-icon slot="icon">thumb_up</md-icon>
              ${this.t("vote")}
            </md-primary-tab>


            <md-primary-tab
              id="resultsTab"
              ?hidden="${this.earl?.configuration.hide_results}"
              class="${this.pageIndex==R&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(2)}"
              aria-label="${this.t("Results")}"
            >
              <md-icon slot="icon">grading</md-icon>
              ${this.t("Results")}
            </md-primary-tab>

            <md-primary-tab
              ?hidden="${!this.hasLlm||this.earl?.configuration.hide_analysis}"
              class="${this.pageIndex==F&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(3)}"
              aria-label="${this.t("Analysis of Results")}"
            >
              <md-icon slot="icon">insights</md-icon>
              ${this.t("AI-generated analysis")}
            </md-primary-tab>
          </md-tabs>
        </div>
      `:n`
        <div class="navContainer">
          <md-navigation-bar
            id="navBar"
            @navigation-bar-activated="${this.tabChanged}"
          >
            <md-navigation-tab .label="${this.t("Intro")}"
              ><md-icon slot="active-icon">info</md-icon>
              <md-icon slot="inactive-icon">info</md-icon></md-navigation-tab
            >
            <md-navigation-tab
              ?hidden="${this.surveyClosed}"
              id="votingTab"
              .label="${this.t("Voting")}"
            >
              <md-icon slot="active-icon">thumb_up</md-icon>
              <md-icon slot="inactive-icon">thumb_up</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Results")}"
              ?hidden="${this.earl?.configuration.hide_results}"
            >
              <md-icon slot="active-icon">grading</md-icon>
              <md-icon slot="inactive-icon">grading</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Analysis")}"
              ?hidden="${this.earl?.configuration.hide_results}"
            >
              <md-icon slot="active-icon">insights</md-icon>
              <md-icon slot="inactive-icon">insights</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `}render(){return n`<div class="layout vertical">
      ${this.renderNavigationBar()}
      <div class="rightPanel">
        <main>
          <div class="mainPageContainer">${this._renderPage()}</div>
        </main>
      </div>
    </div>

    </div>
      ${this.lastSnackbarText?n`
              <yp-snackbar
                id="snackbar"
                @closed="${this.snackbarclosed}"
                style="text-align: center;"
                .labelText="${this.lastSnackbarText}"
              ></yp-snackbar>
            `:d}

      ${window.aoiAppGlobals.externalGoalTriggerUrl?n`
              <yp-snackbar
                id="goalTriggerSnackbar"
                style="text-align: center;"
                timeoutMs="-1"
                .labelText="${this.t("Target votes reached!")}"
              >
                <md-icon-button
                  slot="dismiss"
                  aria-label="${this.t("close")}"
                >
                  <md-icon>close</md-icon>
                </md-icon-button>
                <md-text-button
                  slot="action"
                  @click="${this.triggerExternalGoalUrl}"
                  >${this.t("Finish and return")}</md-text-button
                >
              </yp-snackbar>
            `:d}
      `}};U([e({type:Number})],D.prototype,"pageIndex",void 0),U([e({type:Number})],D.prototype,"totalNumberOfVotes",void 0),U([e({type:Number})],D.prototype,"collectionId",void 0),U([e({type:Object})],D.prototype,"collection",void 0),U([e({type:String})],D.prototype,"lastSnackbarText",void 0),U([e({type:String})],D.prototype,"currentError",void 0),U([e({type:Object})],D.prototype,"earl",void 0),U([e({type:Object})],D.prototype,"question",void 0),U([e({type:Object})],D.prototype,"prompt",void 0),U([e({type:Boolean})],D.prototype,"isAdmin",void 0),U([e({type:Boolean})],D.prototype,"surveyClosed",void 0),U([e({type:String})],D.prototype,"appearanceLookup",void 0),U([e({type:Object})],D.prototype,"currentLeftAnswer",void 0),U([e({type:Object})],D.prototype,"currentRightAnswer",void 0),U([e({type:Number})],D.prototype,"currentPromptId",void 0),D=U([i("aoi-survey")],D);export{D as AoiSurvey};
