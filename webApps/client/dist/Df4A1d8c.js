import{i as e,n as t,t as i,a as n,p as s,q as r,x as o,u as a,T as l,h as c,f as d,v as p,w as h,y as g,z as u,j as m,d as x,A as f,B as y,C as w,D as b}from"./B9QsuJho.js";import"./97YzqM3E.js";import"./B7yhNaDu.js";import{A as v,a as k,Y as $}from"./BWfbd6-5.js";const I=e`
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
`;var A=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let T=class extends n{constructor(){super(...arguments),this.isAdmin=!1,this.footer=null,this.footerEnd=null,this.footerTopObserver=null,this.footerEndObserver=null}async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Intro - open"),this.isAdmin=s.checkGroupAccess(this.group)}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Intro - close"),this.footerTopObserver&&(this.footerTopObserver.disconnect(),this.footerTopObserver=null),this.footerEndObserver&&(this.footerEndObserver.disconnect(),this.footerEndObserver=null)}firstUpdated(){this.setupFooterObserver()}_openAnalyticsAndPromotions(){r.redirectTo(`/analytics/group/${this.group.id}`)}_openAdmin(){r.redirectTo(`/admin/group/${this.group.id}`)}renderAdminButtons(){return o`
      <div class="layout horizontal adminButtons">
        <md-icon-button
          id="menuButton"
          @click="${this._openAnalyticsAndPromotions}"
          title="${this.t("Analytics")}"
          ><md-icon>analytics</md-icon>
        </md-icon-button>
        <md-icon-button
          id="menuButton"
          @click="${this._openAdmin}"
          title="${this.t("Admin")}"
          ><md-icon>settings</md-icon>
        </md-icon-button>
      </div>
    `}setupFooterObserver(){this.footer=this.shadowRoot?.querySelector("#footerStart"),this.footerEnd=this.shadowRoot?.querySelector("#footerEnd"),this.footerTopObserver=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting&&(window.appGlobals.activity("Footer - start is visible"),this.footerTopObserver?.disconnect())}))}),{rootMargin:"-200px 0px"}),this.footerEndObserver=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting&&(window.appGlobals.activity("Footer - end is visible"),this.footerEndObserver?.disconnect())}))}),{rootMargin:"0px"}),this.footer&&this.footerTopObserver.observe(this.footer),this.footerEnd&&this.footerEndObserver.observe(this.footerEnd)}get formattedDescription(){return(this.earl.configuration.welcome_message||"").replace(/(\n)/g,"<br>")}clickStart(){this.fire("startVoting"),window.appGlobals.activity("Intro - click start")}clickResults(){this.fire("openResults")}static get styles(){return[...super.styles,I,e`
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
      `]}render(){return this.question?o`
        <div class="topContainer layout vertical wrap center-center">
          <yp-image
            class="column image"
            sizing="contain"
            src="${a.getImageFormatUrl(this.group.GroupLogoImages)}"
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
          ${this.earl.active?o`
                <md-fab
                  extended
                  variant="primary"
                  class="fab"
                  @click="${this.clickStart}"
                  .label="${this.t("Start Voting")}"
                  ><md-icon slot="icon">thumbs_up_down</md-icon></md-fab
                >
              `:o`
                <md-fab
                  extended
                  variant="primary"
                  class="fab"
                  @click="${this.clickResults}"
                  .label="${this.t("Open Results")}"
                  ><md-icon slot="icon">grading</md-icon></md-fab
                >
              `}
          ${this.isAdmin?this.renderAdminButtons():l}
          <div id="footerStart" class="footerHtml">
            ${this.earl.configuration&&this.earl.configuration.welcome_html?o`
                <yp-magic-text
                  id="aoiWelcomeHtml"
                  .contentId="${this.group.id}"
                  unsafeHtml
                  .content="${this.earl.configuration.welcome_html}"
                  .contentLanguage="${this.group.language}"
                  textType="aoiWelcomeHtml"
                ></yp-magic-text>
                `:l}
          </div>
          <div id="footerEnd">&nbsp;</div>
        </div>
      `:l}};A([t({type:Object})],T.prototype,"earl",void 0),A([t({type:Object})],T.prototype,"group",void 0),A([t({type:Object})],T.prototype,"question",void 0),A([t({type:Boolean})],T.prototype,"isAdmin",void 0),T=A([i("aoi-survey-intro")],T);var C=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let _=class extends d{constructor(){super(),this.haveAddedIdea=!1,this.serverApi=new v}async connectedCallback(){super.connectedCallback(),this.imageGenerator=new k(this.themeColor)}disconnectedCallback(){super.disconnectedCallback()}async submitIdea(){let e;window.appGlobals.activity("New Idea - submit"),this.currentError=void 0,this.submitting=!0;try{e=await window.aoiServerApi.submitIdea(this.groupId,this.question.id,this.ideaText.value)}catch(e){console.error(e)}this.submitting=!1,!e||e.error?(this.currentError=this.t("An error occurred. Please try again."),window.appGlobals.activity("New Idea - general error")):e.flagged?(this.currentError=this.t("Your idea has been flagged as inappropriate. Please try again."),window.appGlobals.activity("New Idea - moderation flag")):(this.ideaText.value="",e.active?(this.choice=e.choice,this.haveAddedIdea=!0,this.fire("display-snackbar",this.t("yourIdeaHasBeenAdded")),this.generateAiIcon()):(this.earl.configuration?.allowAnswersNotForVoting?this.fire("display-snackbar",this.t("newIdeasNotAllowedForVotingThankYou")):this.fire("display-snackbar",this.t("New ideas will be reviewed for originality and compliance with terms of service prior to posting.")),this.fire("new-idea-added"),this.dialog.close()),window.appGlobals.activity("New Idea - added"))}scrollUp(){setTimeout((()=>{this.$$("#dialog").contentElement.scrollTop=0}),100)}async open(){this.reset(),window.appGlobals.activity("New Idea - open"),this.dialog.show(),await this.updateComplete,this.ideaText&&(this.ideaText.value="")}cancel(){this.dialog.close(),window.appGlobals.activity("New Idea - cancel")}reset(){this.currentError=void 0,this.haveAddedIdea=!1,this.choice=void 0,this.imageGenerator=new k(this.themeColor)}close(){this.dialog.close(),window.appGlobals.activity("New Idea - close")}textAreaKeyDownIdea(e){return!(13===e.keyCode&&!e.shiftKey)||(e.preventDefault(),!1)}static get styles(){return[super.styles,I,e`
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
      `]}async generateAiIcon(){if(this.imageGenerator.collectionType="group",this.imageGenerator.collectionId=this.groupId,this.choice)try{this.choice.data||(this.choice.data={}),this.choice.data.isGeneratingImage=!0;const{imageUrl:e,error:t}=await this.imageGenerator.generateIcon(this.choice.data.content,this.group.configuration.theme?.iconPrompt||this.finalPrompt);this.choice.data.isGeneratingImage=void 0,t?console.error(t):(await this.serverApi.updateGroupChoice(this.groupId,this.question.id,this.choice.id,{content:this.choice.data.content,imageUrl:e,choiceId:this.choice.id}),this.choice.data.imageUrl=e,this.requestUpdate())}catch(e){this.choice.data.isGeneratingImage=!1,console.error(e)}else console.error("no choice")}get tempPrompt(){return`\n      Name: ${this.name}\n      Description: ${this.description}\n      Image style: ${this.styleText.value}\n\n      Do not include text or labels in the image except if the user asks for it in the image style.\n    `}regenerateIcon(){this.choice.data.imageUrl=void 0,this.requestUpdate(),this.generateAiIcon()}renderAnswer(){return this.choice?o`
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
            ><md-icon class="closeIcon"
              >cycle</md-icon
            ></md-filled-tonal-icon-button
          >
        </div>
      `:l}renderIcon(){return this.choice.data.isGeneratingImage?o`
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `:this.choice.data.imageUrl?o` <img
        class="iconImage"
        src="${this.choice.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!this.choice.data.imageUrl}"
      />`:l}renderContent(){return o`
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
      ${this.earl.configuration.allowAnswersNotForVoting?o`
            <div class="newIdeasNotAllowedForVotingInfo layout horizontal center-center">
              ${this.t("newIdeasNotAllowedForVotingInfo")}
            </div>
          `:l}
      ${this.haveAddedIdea&&this.choice?o`
            <div class="layout vertical center-center">
              ${this.renderAnswer()}
              <div class="aiIconInfo">${this.t("aiIconInfo")}</div>
            </div>
          `:o`
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
    `}renderFooter(){return this.haveAddedIdea&&this.choice?o`<div class="layout horizontal footer">
        <div class="flex"></div>
        <md-text-button class="closeButton" @click="${this.close}">
          ${this.choice?.data.isGeneratingImage?this.t("closeAndGenerateIconInBackground"):this.t("close")}
        </md-text-button>
      </div> `:o` <div class="layout horizontal footer">
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
      </div>`}render(){return o`<md-dialog ?fullscreen="${!this.wide}" id="dialog">
      <div slot="content">${this.renderContent()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `}};function S(){return{async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,hooks:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1}}C([t({type:Object})],_.prototype,"earl",void 0),C([t({type:Number})],_.prototype,"groupId",void 0),C([t({type:Object})],_.prototype,"question",void 0),C([t({type:Object})],_.prototype,"choice",void 0),C([t({type:Object})],_.prototype,"group",void 0),C([t({type:Boolean})],_.prototype,"haveAddedIdea",void 0),C([c("#ideaText")],_.prototype,"ideaText",void 0),C([c("#dialog")],_.prototype,"dialog",void 0),_=C([i("aoi-new-idea-dialog")],_);let L={async:!1,baseUrl:null,breaks:!1,extensions:null,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,hooks:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:null,sanitize:!1,sanitizer:null,silent:!1,smartypants:!1,tokenizer:null,walkTokens:null,xhtml:!1};const z=/[&<>"']/,O=new RegExp(z.source,"g"),E=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,B=new RegExp(E.source,"g"),q={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},U=e=>q[e];function R(e,t){if(t){if(z.test(e))return e.replace(O,U)}else if(E.test(e))return e.replace(B,U);return e}const P=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function j(e){return e.replace(P,((e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""))}const N=/(^|[^\[])\^/g;function M(e,t){e="string"==typeof e?e:e.source,t=t||"";const i={replace:(t,n)=>(n=(n=n.source||n).replace(N,"$1"),e=e.replace(t,n),i),getRegex:()=>new RegExp(e,t)};return i}const G=/[^\w:]/g,D=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function F(e,t,i){if(e){let e;try{e=decodeURIComponent(j(i)).replace(G,"").toLowerCase()}catch(e){return null}if(0===e.indexOf("javascript:")||0===e.indexOf("vbscript:")||0===e.indexOf("data:"))return null}t&&!D.test(i)&&(i=function(e,t){Q[" "+e]||(V.test(e)?Q[" "+e]=e+"/":Q[" "+e]=Y(e,"/",!0));e=Q[" "+e];const i=-1===e.indexOf(":");return"//"===t.substring(0,2)?i?t:e.replace(J,"$1")+t:"/"===t.charAt(0)?i?t:e.replace(W,"$1")+t:e+t}(t,i));try{i=encodeURI(i).replace(/%25/g,"%")}catch(e){return null}return i}const Q={},V=/^[^:]+:\/*[^/]*$/,J=/^([^:]+:)[\s\S]*$/,W=/^([^:]+:\/*[^/]*)[\s\S]*$/;const H={exec:function(){}};function Z(e,t){const i=e.replace(/\|/g,((e,t,i)=>{let n=!1,s=t;for(;--s>=0&&"\\"===i[s];)n=!n;return n?"|":" |"})).split(/ \|/);let n=0;if(i[0].trim()||i.shift(),i.length>0&&!i[i.length-1].trim()&&i.pop(),i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(/\\\|/g,"|");return i}function Y(e,t,i){const n=e.length;if(0===n)return"";let s=0;for(;s<n;){const r=e.charAt(n-s-1);if(r!==t||i){if(r===t||!i)break;s++}else s++}return e.slice(0,n-s)}function X(e,t){if(t<1)return"";let i="";for(;t>1;)1&t&&(i+=e),t>>=1,e+=e;return i+e}function K(e,t,i,n){const s=t.href,r=t.title?R(t.title):null,o=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){n.state.inLink=!0;const e={type:"link",raw:i,href:s,title:r,text:o,tokens:n.inlineTokens(o)};return n.state.inLink=!1,e}return{type:"image",raw:i,href:s,title:r,text:R(o)}}class ee{constructor(e){this.options=e||L}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:Y(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],i=function(e,t){const i=e.match(/^(\s+)(?:```)/);if(null===i)return t;const n=i[1];return t.split("\n").map((e=>{const t=e.match(/^\s+/);if(null===t)return e;const[i]=t;return i.length>=n.length?e.slice(n.length):e})).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline._escapes,"$1"):t[2],text:i}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=Y(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){const e=t[0].replace(/^ *>[ \t]?/gm,""),i=this.lexer.state.top;this.lexer.state.top=!0;const n=this.lexer.blockTokens(e);return this.lexer.state.top=i,{type:"blockquote",raw:t[0],tokens:n,text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let i,n,s,r,o,a,l,c,d,p,h,g,u=t[1].trim();const m=u.length>1,x={type:"list",raw:"",ordered:m,start:m?+u.slice(0,-1):"",loose:!1,items:[]};u=m?`\\d{1,9}\\${u.slice(-1)}`:`\\${u}`,this.options.pedantic&&(u=m?u:"[*+-]");const f=new RegExp(`^( {0,3}${u})((?:[\t ][^\\n]*)?(?:\\n|$))`);for(;e&&(g=!1,t=f.exec(e))&&!this.rules.block.hr.test(e);){if(i=t[0],e=e.substring(i.length),c=t[2].split("\n",1)[0].replace(/^\t+/,(e=>" ".repeat(3*e.length))),d=e.split("\n",1)[0],this.options.pedantic?(r=2,h=c.trimLeft()):(r=t[2].search(/[^ ]/),r=r>4?1:r,h=c.slice(r),r+=t[1].length),a=!1,!c&&/^ *$/.test(d)&&(i+=d+"\n",e=e.substring(d.length+1),g=!0),!g){const t=new RegExp(`^ {0,${Math.min(3,r-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),n=new RegExp(`^ {0,${Math.min(3,r-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),s=new RegExp(`^ {0,${Math.min(3,r-1)}}(?:\`\`\`|~~~)`),o=new RegExp(`^ {0,${Math.min(3,r-1)}}#`);for(;e&&(p=e.split("\n",1)[0],d=p,this.options.pedantic&&(d=d.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),!s.test(d))&&!o.test(d)&&!t.test(d)&&!n.test(e);){if(d.search(/[^ ]/)>=r||!d.trim())h+="\n"+d.slice(r);else{if(a)break;if(c.search(/[^ ]/)>=4)break;if(s.test(c))break;if(o.test(c))break;if(n.test(c))break;h+="\n"+d}a||d.trim()||(a=!0),i+=p+"\n",e=e.substring(p.length+1),c=d.slice(r)}}x.loose||(l?x.loose=!0:/\n *\n *$/.test(i)&&(l=!0)),this.options.gfm&&(n=/^\[[ xX]\] /.exec(h),n&&(s="[ ] "!==n[0],h=h.replace(/^\[[ xX]\] +/,""))),x.items.push({type:"list_item",raw:i,task:!!n,checked:s,loose:!1,text:h}),x.raw+=i}x.items[x.items.length-1].raw=i.trimRight(),x.items[x.items.length-1].text=h.trimRight(),x.raw=x.raw.trimRight();const y=x.items.length;for(o=0;o<y;o++)if(this.lexer.state.top=!1,x.items[o].tokens=this.lexer.blockTokens(x.items[o].text,[]),!x.loose){const e=x.items[o].tokens.filter((e=>"space"===e.type)),t=e.length>0&&e.some((e=>/\n.*\n/.test(e.raw)));x.loose=t}if(x.loose)for(o=0;o<y;o++)x.items[o].loose=!0;return x}}html(e){const t=this.rules.block.html.exec(e);if(t){const e={type:"html",raw:t[0],pre:!this.options.sanitizer&&("pre"===t[1]||"script"===t[1]||"style"===t[1]),text:t[0]};if(this.options.sanitize){const i=this.options.sanitizer?this.options.sanitizer(t[0]):R(t[0]);e.type="paragraph",e.text=i,e.tokens=this.lexer.inline(i)}return e}}def(e){const t=this.rules.block.def.exec(e);if(t){const e=t[1].toLowerCase().replace(/\s+/g," "),i=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline._escapes,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline._escapes,"$1"):t[3];return{type:"def",tag:e,raw:t[0],href:i,title:n}}}table(e){const t=this.rules.block.table.exec(e);if(t){const e={type:"table",header:Z(t[1]).map((e=>({text:e}))),align:t[2].replace(/^ *|\| *$/g,"").split(/ *\| */),rows:t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[]};if(e.header.length===e.align.length){e.raw=t[0];let i,n,s,r,o=e.align.length;for(i=0;i<o;i++)/^ *-+: *$/.test(e.align[i])?e.align[i]="right":/^ *:-+: *$/.test(e.align[i])?e.align[i]="center":/^ *:-+ *$/.test(e.align[i])?e.align[i]="left":e.align[i]=null;for(o=e.rows.length,i=0;i<o;i++)e.rows[i]=Z(e.rows[i],e.header.length).map((e=>({text:e})));for(o=e.header.length,n=0;n<o;n++)e.header[n].tokens=this.lexer.inline(e.header[n].text);for(o=e.rows.length,n=0;n<o;n++)for(r=e.rows[n],s=0;s<r.length;s++)r[s].tokens=this.lexer.inline(r[s].text);return e}}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:R(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:this.options.sanitize?"text":"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,text:this.options.sanitize?this.options.sanitizer?this.options.sanitizer(t[0]):R(t[0]):t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=Y(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;const i=e.length;let n=0,s=0;for(;s<i;s++)if("\\"===e[s])s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return-1}(t[2],"()");if(e>-1){const i=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,i).trim(),t[3]=""}}let i=t[2],n="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);e&&(i=e[1],n=e[3])}else n=t[3]?t[3].slice(1,-1):"";return i=i.trim(),/^</.test(i)&&(i=this.options.pedantic&&!/>$/.test(e)?i.slice(1):i.slice(1,-1)),K(t,{href:i?i.replace(this.rules.inline._escapes,"$1"):i,title:n?n.replace(this.rules.inline._escapes,"$1"):n},t[0],this.lexer)}}reflink(e,t){let i;if((i=this.rules.inline.reflink.exec(e))||(i=this.rules.inline.nolink.exec(e))){let e=(i[2]||i[1]).replace(/\s+/g," ");if(e=t[e.toLowerCase()],!e){const e=i[0].charAt(0);return{type:"text",raw:e,text:e}}return K(i,e,i[0],this.lexer)}}emStrong(e,t,i=""){let n=this.rules.inline.emStrong.lDelim.exec(e);if(!n)return;if(n[3]&&i.match(/[\p{L}\p{N}]/u))return;const s=n[1]||n[2]||"";if(!s||s&&(""===i||this.rules.inline.punctuation.exec(i))){const i=n[0].length-1;let s,r,o=i,a=0;const l="*"===n[0][0]?this.rules.inline.emStrong.rDelimAst:this.rules.inline.emStrong.rDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+i);null!=(n=l.exec(t));){if(s=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!s)continue;if(r=s.length,n[3]||n[4]){o+=r;continue}if((n[5]||n[6])&&i%3&&!((i+r)%3)){a+=r;continue}if(o-=r,o>0)continue;r=Math.min(r,r+o+a);const t=e.slice(0,i+n.index+(n[0].length-s.length)+r);if(Math.min(i,r)%2){const e=t.slice(1,-1);return{type:"em",raw:t,text:e,tokens:this.lexer.inlineTokens(e)}}const l=t.slice(2,-2);return{type:"strong",raw:t,text:l,tokens:this.lexer.inlineTokens(l)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const i=/[^ ]/.test(e),n=/^ /.test(e)&&/ $/.test(e);return i&&n&&(e=e.substring(1,e.length-1)),e=R(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e,t){const i=this.rules.inline.autolink.exec(e);if(i){let e,n;return"@"===i[2]?(e=R(this.options.mangle?t(i[1]):i[1]),n="mailto:"+e):(e=R(i[1]),n=e),{type:"link",raw:i[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}url(e,t){let i;if(i=this.rules.inline.url.exec(e)){let e,n;if("@"===i[2])e=R(this.options.mangle?t(i[0]):i[0]),n="mailto:"+e;else{let t;do{t=i[0],i[0]=this.rules.inline._backpedal.exec(i[0])[0]}while(t!==i[0]);e=R(i[0]),n="www."===i[1]?"http://"+i[0]:i[0]}return{type:"link",raw:i[0],text:e,href:n,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e,t){const i=this.rules.inline.text.exec(e);if(i){let e;return e=this.lexer.state.inRawBlock?this.options.sanitize?this.options.sanitizer?this.options.sanitizer(i[0]):R(i[0]):i[0]:R(this.options.smartypants?t(i[0]):i[0]),{type:"text",raw:i[0],text:e}}}}const te={newline:/^(?: *(?:\n|$))+/,code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,hr:/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,html:"^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",def:/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,table:H,lheading:/^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,_paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,text:/^[^\n]+/,_label:/(?!\s*\])(?:\\.|[^\[\]\\])+/,_title:/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/};te.def=M(te.def).replace("label",te._label).replace("title",te._title).getRegex(),te.bullet=/(?:[*+-]|\d{1,9}[.)])/,te.listItemStart=M(/^( *)(bull) */).replace("bull",te.bullet).getRegex(),te.list=M(te.list).replace(/bull/g,te.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+te.def.source+")").getRegex(),te._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",te._comment=/<!--(?!-?>)[\s\S]*?(?:-->|$)/,te.html=M(te.html,"i").replace("comment",te._comment).replace("tag",te._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),te.paragraph=M(te._paragraph).replace("hr",te.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",te._tag).getRegex(),te.blockquote=M(te.blockquote).replace("paragraph",te.paragraph).getRegex(),te.normal={...te},te.gfm={...te.normal,table:"^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"},te.gfm.table=M(te.gfm.table).replace("hr",te.hr).replace("heading"," {0,3}#{1,6} ").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",te._tag).getRegex(),te.gfm.paragraph=M(te._paragraph).replace("hr",te.hr).replace("heading"," {0,3}#{1,6} ").replace("|lheading","").replace("table",te.gfm.table).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",te._tag).getRegex(),te.pedantic={...te.normal,html:M("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",te._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:H,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:M(te.normal._paragraph).replace("hr",te.hr).replace("heading"," *#{1,6} *[^\n]").replace("lheading",te.lheading).replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").getRegex()};const ie={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:H,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(ref)\]/,nolink:/^!?\[(ref)\](?:\[\])?/,reflinkSearch:"reflink|nolink(?!\\()",emStrong:{lDelim:/^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,rDelimAst:/^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,rDelimUnd:/^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/},code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:H,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,punctuation:/^([\spunctuation])/};function ne(e){return e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")}function se(e){let t,i,n="";const s=e.length;for(t=0;t<s;t++)i=e.charCodeAt(t),Math.random()>.5&&(i="x"+i.toString(16)),n+="&#"+i+";";return n}ie._punctuation="!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~",ie.punctuation=M(ie.punctuation).replace(/punctuation/g,ie._punctuation).getRegex(),ie.blockSkip=/\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g,ie.escapedEmSt=/(?:^|[^\\])(?:\\\\)*\\[*_]/g,ie._comment=M(te._comment).replace("(?:--\x3e|$)","--\x3e").getRegex(),ie.emStrong.lDelim=M(ie.emStrong.lDelim).replace(/punct/g,ie._punctuation).getRegex(),ie.emStrong.rDelimAst=M(ie.emStrong.rDelimAst,"g").replace(/punct/g,ie._punctuation).getRegex(),ie.emStrong.rDelimUnd=M(ie.emStrong.rDelimUnd,"g").replace(/punct/g,ie._punctuation).getRegex(),ie._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,ie._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,ie._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,ie.autolink=M(ie.autolink).replace("scheme",ie._scheme).replace("email",ie._email).getRegex(),ie._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,ie.tag=M(ie.tag).replace("comment",ie._comment).replace("attribute",ie._attribute).getRegex(),ie._label=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ie._href=/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/,ie._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,ie.link=M(ie.link).replace("label",ie._label).replace("href",ie._href).replace("title",ie._title).getRegex(),ie.reflink=M(ie.reflink).replace("label",ie._label).replace("ref",te._label).getRegex(),ie.nolink=M(ie.nolink).replace("ref",te._label).getRegex(),ie.reflinkSearch=M(ie.reflinkSearch,"g").replace("reflink",ie.reflink).replace("nolink",ie.nolink).getRegex(),ie.normal={...ie},ie.pedantic={...ie.normal,strong:{start:/^__|\*\*/,middle:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,endAst:/\*\*(?!\*)/g,endUnd:/__(?!_)/g},em:{start:/^_|\*/,middle:/^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,endAst:/\*(?!\*)/g,endUnd:/_(?!_)/g},link:M(/^!?\[(label)\]\((.*?)\)/).replace("label",ie._label).getRegex(),reflink:M(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ie._label).getRegex()},ie.gfm={...ie.normal,escape:M(ie.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},ie.gfm.url=M(ie.gfm.url,"i").replace("email",ie.gfm._extended_email).getRegex(),ie.breaks={...ie.gfm,br:M(ie.br).replace("{2,}","*").getRegex(),text:M(ie.gfm.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()};class re{constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||L,this.options.tokenizer=this.options.tokenizer||new ee,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:te.normal,inline:ie.normal};this.options.pedantic?(t.block=te.pedantic,t.inline=ie.pedantic):this.options.gfm&&(t.block=te.gfm,this.options.breaks?t.inline=ie.breaks:t.inline=ie.gfm),this.tokenizer.rules=t}static get rules(){return{block:te,inline:ie}}static lex(e,t){return new re(t).lex(e)}static lexInline(e,t){return new re(t).inlineTokens(e)}lex(e){let t;for(e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);t=this.inlineQueue.shift();)this.inlineTokens(t.src,t.tokens);return this.tokens}blockTokens(e,t=[]){let i,n,s,r;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,((e,t,i)=>t+"    ".repeat(i.length)));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some((n=>!!(i=n.call({lexer:this},e,t))&&(e=e.substring(i.raw.length),t.push(i),!0)))))if(i=this.tokenizer.space(e))e=e.substring(i.raw.length),1===i.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(i);else if(i=this.tokenizer.code(e))e=e.substring(i.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?t.push(i):(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(i=this.tokenizer.fences(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.heading(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.hr(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.blockquote(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.list(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.html(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.def(e))e=e.substring(i.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title}):(n.raw+="\n"+i.raw,n.text+="\n"+i.raw,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(i=this.tokenizer.table(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.lheading(e))e=e.substring(i.raw.length),t.push(i);else{if(s=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const i=e.slice(1);let n;this.options.extensions.startBlock.forEach((function(e){n=e.call({lexer:this},i),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(s=e.substring(0,t+1))}if(this.state.top&&(i=this.tokenizer.paragraph(s)))n=t[t.length-1],r&&"paragraph"===n.type?(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(i),r=s.length!==e.length,e=e.substring(i.raw.length);else if(i=this.tokenizer.text(e))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===n.type?(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(i);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let i,n,s,r,o,a,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(r=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,r.index)+"["+X("a",r[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(r=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,r.index)+"["+X("a",r[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(r=this.tokenizer.rules.inline.escapedEmSt.exec(l));)l=l.slice(0,r.index+r[0].length-2)+"++"+l.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex),this.tokenizer.rules.inline.escapedEmSt.lastIndex--;for(;e;)if(o||(a=""),o=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some((n=>!!(i=n.call({lexer:this},e,t))&&(e=e.substring(i.raw.length),t.push(i),!0)))))if(i=this.tokenizer.escape(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.tag(e))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===i.type&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(i=this.tokenizer.link(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===i.type&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(i=this.tokenizer.emStrong(e,l,a))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.codespan(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.br(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.del(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.autolink(e,se))e=e.substring(i.raw.length),t.push(i);else if(this.state.inLink||!(i=this.tokenizer.url(e,se))){if(s=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const i=e.slice(1);let n;this.options.extensions.startInline.forEach((function(e){n=e.call({lexer:this},i),"number"==typeof n&&n>=0&&(t=Math.min(t,n))})),t<1/0&&t>=0&&(s=e.substring(0,t+1))}if(i=this.tokenizer.inlineText(s,ne))e=e.substring(i.raw.length),"_"!==i.raw.slice(-1)&&(a=i.raw.slice(-1)),o=!0,n=t[t.length-1],n&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(i.raw.length),t.push(i);return t}}class oe{constructor(e){this.options=e||L}code(e,t,i){const n=(t||"").match(/\S*/)[0];if(this.options.highlight){const t=this.options.highlight(e,n);null!=t&&t!==e&&(i=!0,e=t)}return e=e.replace(/\n$/,"")+"\n",n?'<pre><code class="'+this.options.langPrefix+R(n)+'">'+(i?e:R(e,!0))+"</code></pre>\n":"<pre><code>"+(i?e:R(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e){return e}heading(e,t,i,n){if(this.options.headerIds){return`<h${t} id="${this.options.headerPrefix+n.slug(i)}">${e}</h${t}>\n`}return`<h${t}>${e}</h${t}>\n`}hr(){return this.options.xhtml?"<hr/>\n":"<hr>\n"}list(e,t,i){const n=t?"ol":"ul";return"<"+n+(t&&1!==i?' start="'+i+'"':"")+">\n"+e+"</"+n+">\n"}listitem(e){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const i=t.header?"th":"td";return(t.align?`<${i} align="${t.align}">`:`<${i}>`)+e+`</${i}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return this.options.xhtml?"<br/>":"<br>"}del(e){return`<del>${e}</del>`}link(e,t,i){if(null===(e=F(this.options.sanitize,this.options.baseUrl,e)))return i;let n='<a href="'+e+'"';return t&&(n+=' title="'+t+'"'),n+=">"+i+"</a>",n}image(e,t,i){if(null===(e=F(this.options.sanitize,this.options.baseUrl,e)))return i;let n=`<img src="${e}" alt="${i}"`;return t&&(n+=` title="${t}"`),n+=this.options.xhtml?"/>":">",n}text(e){return e}}class ae{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,i){return""+i}image(e,t,i){return""+i}br(){return""}}class le{constructor(){this.seen={}}serialize(e){return e.toLowerCase().trim().replace(/<[!\/a-z].*?>/gi,"").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,"").replace(/\s/g,"-")}getNextSafeSlug(e,t){let i=e,n=0;if(this.seen.hasOwnProperty(i)){n=this.seen[e];do{n++,i=e+"-"+n}while(this.seen.hasOwnProperty(i))}return t||(this.seen[e]=n,this.seen[i]=0),i}slug(e,t={}){const i=this.serialize(e);return this.getNextSafeSlug(i,t.dryrun)}}class ce{constructor(e){this.options=e||L,this.options.renderer=this.options.renderer||new oe,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new ae,this.slugger=new le}static parse(e,t){return new ce(t).parse(e)}static parseInline(e,t){return new ce(t).parseInline(e)}parse(e,t=!0){let i,n,s,r,o,a,l,c,d,p,h,g,u,m,x,f,y,w,b,v="";const k=e.length;for(i=0;i<k;i++)if(p=e[i],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[p.type]&&(b=this.options.extensions.renderers[p.type].call({parser:this},p),!1!==b||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(p.type)))v+=b||"";else switch(p.type){case"space":continue;case"hr":v+=this.renderer.hr();continue;case"heading":v+=this.renderer.heading(this.parseInline(p.tokens),p.depth,j(this.parseInline(p.tokens,this.textRenderer)),this.slugger);continue;case"code":v+=this.renderer.code(p.text,p.lang,p.escaped);continue;case"table":for(c="",l="",r=p.header.length,n=0;n<r;n++)l+=this.renderer.tablecell(this.parseInline(p.header[n].tokens),{header:!0,align:p.align[n]});for(c+=this.renderer.tablerow(l),d="",r=p.rows.length,n=0;n<r;n++){for(a=p.rows[n],l="",o=a.length,s=0;s<o;s++)l+=this.renderer.tablecell(this.parseInline(a[s].tokens),{header:!1,align:p.align[s]});d+=this.renderer.tablerow(l)}v+=this.renderer.table(c,d);continue;case"blockquote":d=this.parse(p.tokens),v+=this.renderer.blockquote(d);continue;case"list":for(h=p.ordered,g=p.start,u=p.loose,r=p.items.length,d="",n=0;n<r;n++)x=p.items[n],f=x.checked,y=x.task,m="",x.task&&(w=this.renderer.checkbox(f),u?x.tokens.length>0&&"paragraph"===x.tokens[0].type?(x.tokens[0].text=w+" "+x.tokens[0].text,x.tokens[0].tokens&&x.tokens[0].tokens.length>0&&"text"===x.tokens[0].tokens[0].type&&(x.tokens[0].tokens[0].text=w+" "+x.tokens[0].tokens[0].text)):x.tokens.unshift({type:"text",text:w}):m+=w),m+=this.parse(x.tokens,u),d+=this.renderer.listitem(m,y,f);v+=this.renderer.list(d,h,g);continue;case"html":v+=this.renderer.html(p.text);continue;case"paragraph":v+=this.renderer.paragraph(this.parseInline(p.tokens));continue;case"text":for(d=p.tokens?this.parseInline(p.tokens):p.text;i+1<k&&"text"===e[i+1].type;)p=e[++i],d+="\n"+(p.tokens?this.parseInline(p.tokens):p.text);v+=t?this.renderer.paragraph(d):d;continue;default:{const e='Token with "'+p.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return v}parseInline(e,t){t=t||this.renderer;let i,n,s,r="";const o=e.length;for(i=0;i<o;i++)if(n=e[i],this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[n.type]&&(s=this.options.extensions.renderers[n.type].call({parser:this},n),!1!==s||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(n.type)))r+=s||"";else switch(n.type){case"escape":case"text":r+=t.text(n.text);break;case"html":r+=t.html(n.text);break;case"link":r+=t.link(n.href,n.title,this.parseInline(n.tokens,t));break;case"image":r+=t.image(n.href,n.title,n.text);break;case"strong":r+=t.strong(this.parseInline(n.tokens,t));break;case"em":r+=t.em(this.parseInline(n.tokens,t));break;case"codespan":r+=t.codespan(n.text);break;case"br":r+=t.br();break;case"del":r+=t.del(this.parseInline(n.tokens,t));break;default:{const e='Token with "'+n.type+'" type was not found.';if(this.options.silent)return void console.error(e);throw new Error(e)}}return r}}class de{constructor(e){this.options=e||L}static passThroughHooks=new Set(["preprocess","postprocess"]);preprocess(e){return e}postprocess(e){return e}}function pe(e,t){return(i,n,s)=>{"function"==typeof n&&(s=n,n=null);const r={...n},o=function(e,t,i){return n=>{if(n.message+="\nPlease report this to https://github.com/markedjs/marked.",e){const e="<p>An error occurred:</p><pre>"+R(n.message+"",!0)+"</pre>";return t?Promise.resolve(e):i?void i(null,e):e}if(t)return Promise.reject(n);if(!i)throw n;i(n)}}((n={...he.defaults,...r}).silent,n.async,s);if(null==i)return o(new Error("marked(): input parameter is undefined or null"));if("string"!=typeof i)return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(i)+", string expected"));if(function(e){e&&e.sanitize&&!e.silent&&console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options")}(n),n.hooks&&(n.hooks.options=n),s){const r=n.highlight;let a;try{n.hooks&&(i=n.hooks.preprocess(i)),a=e(i,n)}catch(e){return o(e)}const l=function(e){let i;if(!e)try{n.walkTokens&&he.walkTokens(a,n.walkTokens),i=t(a,n),n.hooks&&(i=n.hooks.postprocess(i))}catch(t){e=t}return n.highlight=r,e?o(e):s(null,i)};if(!r||r.length<3)return l();if(delete n.highlight,!a.length)return l();let c=0;return he.walkTokens(a,(function(e){"code"===e.type&&(c++,setTimeout((()=>{r(e.text,e.lang,(function(t,i){if(t)return l(t);null!=i&&i!==e.text&&(e.text=i,e.escaped=!0),c--,0===c&&l()}))}),0))})),void(0===c&&l())}if(n.async)return Promise.resolve(n.hooks?n.hooks.preprocess(i):i).then((t=>e(t,n))).then((e=>n.walkTokens?Promise.all(he.walkTokens(e,n.walkTokens)).then((()=>e)):e)).then((e=>t(e,n))).then((e=>n.hooks?n.hooks.postprocess(e):e)).catch(o);try{n.hooks&&(i=n.hooks.preprocess(i));const s=e(i,n);n.walkTokens&&he.walkTokens(s,n.walkTokens);let r=t(s,n);return n.hooks&&(r=n.hooks.postprocess(r)),r}catch(e){return o(e)}}}function he(e,t,i){return pe(re.lex,ce.parse)(e,t,i)}he.options=he.setOptions=function(e){var t;return he.defaults={...he.defaults,...e},t=he.defaults,L=t,he},he.getDefaults=S,he.defaults=L,he.use=function(...e){const t=he.defaults.extensions||{renderers:{},childTokens:{}};e.forEach((e=>{const i={...e};if(i.async=he.defaults.async||i.async||!1,e.extensions&&(e.extensions.forEach((e=>{if(!e.name)throw new Error("extension name required");if(e.renderer){const i=t.renderers[e.name];t.renderers[e.name]=i?function(...t){let n=e.renderer.apply(this,t);return!1===n&&(n=i.apply(this,t)),n}:e.renderer}if(e.tokenizer){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");t[e.level]?t[e.level].unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}e.childTokens&&(t.childTokens[e.name]=e.childTokens)})),i.extensions=t),e.renderer){const t=he.defaults.renderer||new oe;for(const i in e.renderer){const n=t[i];t[i]=(...s)=>{let r=e.renderer[i].apply(t,s);return!1===r&&(r=n.apply(t,s)),r}}i.renderer=t}if(e.tokenizer){const t=he.defaults.tokenizer||new ee;for(const i in e.tokenizer){const n=t[i];t[i]=(...s)=>{let r=e.tokenizer[i].apply(t,s);return!1===r&&(r=n.apply(t,s)),r}}i.tokenizer=t}if(e.hooks){const t=he.defaults.hooks||new de;for(const i in e.hooks){const n=t[i];de.passThroughHooks.has(i)?t[i]=s=>{if(he.defaults.async)return Promise.resolve(e.hooks[i].call(t,s)).then((e=>n.call(t,e)));const r=e.hooks[i].call(t,s);return n.call(t,r)}:t[i]=(...s)=>{let r=e.hooks[i].apply(t,s);return!1===r&&(r=n.apply(t,s)),r}}i.hooks=t}if(e.walkTokens){const t=he.defaults.walkTokens;i.walkTokens=function(i){let n=[];return n.push(e.walkTokens.call(this,i)),t&&(n=n.concat(t.call(this,i))),n}}he.setOptions(i)}))},he.walkTokens=function(e,t){let i=[];for(const n of e)switch(i=i.concat(t.call(he,n)),n.type){case"table":for(const e of n.header)i=i.concat(he.walkTokens(e.tokens,t));for(const e of n.rows)for(const n of e)i=i.concat(he.walkTokens(n.tokens,t));break;case"list":i=i.concat(he.walkTokens(n.items,t));break;default:he.defaults.extensions&&he.defaults.extensions.childTokens&&he.defaults.extensions.childTokens[n.type]?he.defaults.extensions.childTokens[n.type].forEach((function(e){i=i.concat(he.walkTokens(n[e],t))})):n.tokens&&(i=i.concat(he.walkTokens(n.tokens,t)))}return i},he.parseInline=pe(re.lexInline,ce.parseInline),he.Parser=ce,he.parser=ce.parse,he.Renderer=oe,he.TextRenderer=ae,he.Lexer=re,he.lexer=re.lex,he.Tokenizer=ee,he.Slugger=le,he.Hooks=de,he.parse=he,he.options,he.setOptions,he.use,he.walkTokens,he.parseInline,ce.parse,re.lex,he.setOptions({gfm:!0});class ge extends p{constructor(){super(...arguments),this.inJsonBlock=!1,this.hasCompletedJsonParsing=!1}handleJsonBlocks(e,t){let i,n;if(e){if(i=e.indexOf("```json"),this.inJsonBlock){if(this.inJsonBlock)if(n=e.indexOf("```",i+6),-1!==n){let s=e.substring(i+7,n).trim();this.hasCompletedJsonParsing||t.fire("jsonLoadingEnd",{jsonContent:s}),this.hasCompletedJsonParsing=!0,e=e.substring(0,i)}else t.fire("jsonPartialContent",{jsonContent:e.substring(6).trim()}),e=e.substring(0,i)}else-1!==i&&(this.inJsonBlock=!0,t.fire("jsonLoadingStart"),e=e.substring(i));return e}}sanitizeHTMLWithOptions(e,t){return e}closeCodeBlockIfNeeded(e){return(e.match(new RegExp("```","g"))||[]).length%2!=0&&(e+="\n```"),e}removeCitations(e){return e.replace(/<code>(.*?)<\/code>/g,((e,t)=>`<code>${t.replace(/<span class="postCitation">(\d+)<\/span>/g,"")}</code>`))}render(e,t){const i=Object.assign(ge.defaultOptions,t??{});t&&t.handleJsonBlocks&&t.targetElement&&e&&(e=this.handleJsonBlocks(e,t.targetElement)),e&&(e=this.closeCodeBlockIfNeeded(e)),e||(e=""),new Promise(((t,i)=>{he.parse(e,((e,n)=>{if(e)return i(e);t(`\n            <style>\n            \n          table {\n            border-collapse: collapse;\n            border-radius: 5px;\n            background-color: var(--md-sys-color-primary-container);\n            color: var(--md-sys-color-on-primary-container);\n            margin: 16px;\n            width: 100%;\n          }\n\n          img {\n            width: 200px;\n            height: 113px;\n            object-fit: cover;\n          }\n\n\n          ol {\n            margin: 8px;\n          }\n\n          @media (max-width: 800px) {\n            ol {\n              padding: 0px;\n            }\n          }\n\n          th, td {\n            padding: 8px;\n            text-align: left;\n            vertical-align: top;\n          }\n\n          th {\n            font-weight: bold;\n            background-color: var(--md-sys-color-primary-container);\n            color: var(--md-sys-color-on-primary-container);\n          }\n\n          tr:nth-child(even) {\n          }\n\n          tr:hover {\n          }\n\n          p {\n            margin-top: 8px;\n            margin-bottom: 8px;\n          }\n\n          pre {\n            white-space: pre-wrap;\n            white-space: -moz-pre-wrap;\n          }\n\n          a {\n            color: var(--md-sys-color-primary);\n            font-weight: bold;\n          }\n        \n          </style>\n          ${n}\n        `)}))})).then((e=>(e=e.replace(/<a href="/g,'<a target="_blank" href="'),i.skipSanitization?Promise.resolve(e):Promise.resolve(this.sanitizeHTMLWithOptions(e,i))))).then((e=>{let t=h(e);this.setValue(t)}));const n=i.skipSanitization?i.loadingHTML:this.sanitizeHTMLWithOptions(i.loadingHTML,i);return h(n)}}ge.defaultOptions={includeImages:!1,includeCodeBlockClassNames:!1,loadingHTML:"<p>Loading...</p>",skipSanitization:!1,handleJsonBlocks:!1,targetElement:void 0};const ue=g(ge);var me=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let xe=class extends n{constructor(){super(),this.spinnerActive=!1,this.fullReferencesOpen=!1,this.followUpQuestionsRaw="",this.followUpQuestions=[],this.jsonLoading=!1,this.handleJsonLoadingStart=()=>{console.log("JSON loading start event triggered"),this.jsonLoading=!0,this.requestUpdate()},this.handleJsonLoadingEnd=e=>{const t=e.detail;console.log("JSON loading end event triggered with JSON content:",t),this.jsonLoading=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("jsonLoadingStart",this.handleJsonLoadingStart),this.addEventListener("jsonLoadingEnd",this.handleJsonLoadingEnd)}disconnectedCallback(){this.removeEventListener("jsonLoadingStart",this.handleJsonLoadingStart),this.removeEventListener("jsonLoadingEnd",this.handleJsonLoadingEnd),super.disconnectedCallback()}stopJsonLoading(){this.jsonLoading=!1}static get styles(){return[super.styles,e`
        :host {
          display: flex;
        }
        .chatImage {
          padding: 8px;
          vertical-align: text-top;
        }

        .robotIcon {
          --md-icon-size: 34px;
        }

        .chatText {
          padding: 8px;
          padding-left: 8px;
          margin-top: 0;
          padding-top: 2px;
        }

        .chatTextUser {
        }

        .userChatDialog {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface-container);
          padding: 8px;
          margin: 16px;
          line-height: 1.5;
          margin-bottom: 0px;
          border-radius: 12px;
        }

        .post {
          margin: 8px;
          padding: 12px;
          border-radius: 24px;
          margin-right: 0;
          background-color: var(--md-sys-color-secondary);
          color: var(--md-sys-color-on-secondary);
          cursor: pointer;
        }

        .postImage {
          height: 28px;
          width: 50px;
        }

        .postName {
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          margin-right: 8px;
        }

        .chatGPTDialogContainer {
          max-width: 100%;
          width: 100%;
        }

        .chatGPTDialog {
          color: var(--md-sys-color-on-surface);
          background-color: var(--md-sys-color-surface);
          padding: 8px;
          margin: 16px;
          line-height: 1.5;
          margin-bottom: 0px;
          border-radius: 10px;
          max-width: 89%;
          margin-top: 12px;
        }

        @media (max-width: 800px) {
          .chatGPTDialog {
            margin: 8px;
            max-width: 100%;
          }
        }

        .chatGPTDialog[error] {
          background-color: var(--md-sys-color-error);
          color: var(--md-sys-color-on-error);
        }

        .followup-question-container {
          margin-top: 12px;
          width: 100%;
          align-self: flex-end;
          justify-content: flex-end;
          margin-right: 32px;
          width: 100%;
        }

        .labelText {
          padding-left: 6px;
          width: 100%;
        }

        md-circular-progress {
          --md-circular-progress-size: 32px;
          width: 32px;
          height: 32px;
          margin-top: 8px;
        }

        .refinedSuggestions {
          padding: 0;
          border-radius: 8px;
          margin: 16px;
          margin-top: 0;
        }

        .refinedSuggestions label {
          display: flex;
          align-items: center;
          margin-bottom: 0; // Reduced margin for a tighter layout
          padding: 8px;
        }

        .labelText {
          margin-left: 4px; // Adjust as needed
        }

        .refinedContainer {
          padding: 0;
        }

        md-filled-button {
          max-width: 250px;
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .followup-question {
          padding: 0;
          margin: 6px;
        }

        .chat-message {
          flex: 1;
        }

        .thinkingText {
          margin-top: 4px;
          margin-left: 6px;
          color: var(--md-sys-color-secondary);
        }

        .thinkingText[spinnerActive] {
          color: var(--md-sys-color-primary);
        }

        .doneIcon {
          margin-left: 16px;
          margin-right: 4px;
          color: var(--md-sys-color-secondary);
          font-size: 28px;
        }

        .postCitation {
          font-size: 9px;
          background-color: var(--md-sys-color-inverse-on-surface);
          color: var(--md-sys-color-primary);
          padding: 3px;
        }

        md-checkbox {
          margin: 15px;
        }

        .followUpQuestionMark {
          color: var(--md-sys-color-primary);
          font-size: 36px;
          margin-top: 8px;
        }

        .citationLink {
          margin-left: 8px;
          margin-bottom: 8px;
        }

        .progress-ring {
          transform: rotate(-90deg);
          color: var(--md-sys-color-secondary);
          transform-origin: 50% 50%;
          margin-left: 16px;
          margin-right: 4px;
        }
        .progress-ring__circle {
          stroke: var(--md-sys-color-primary);
          stroke-dasharray: 75.4;
          stroke-dashoffset: 75.4;
          stroke-linecap: round;
          animation: progress-ring 2.5s infinite;
        }
        @keyframes progress-ring {
          0% {
            stroke-dashoffset: 75.4;
          }
          50% {
            stroke-dashoffset: 0;
            transform: rotate(0deg);
          }
        }
      `]}get isError(){return"error"==this.type||"moderation_error"==this.type}renderCGImage(){return o` <md-icon class="robotIcon">smart_toy</md-icon> `}renderRoboImage(){return o` <md-icon class="robotIcon">person</md-icon> `}renderJson(){return o``}renderChatGPT(){return o`


      <div class="layout vertical chatGPTDialogContainer">
        <div
          class="chatGPTDialog layout vertical bot-message"
          ?error="${this.isError}"
        >
          <div class="layout ${this.wide?"horizontal":"vertical"}">
            <div class="layout vertical chatImage">${this.renderCGImage()}</div>
            <div class="layout vertical chatText">
              ${ue(this.message,{includeImages:!0,includeCodeBlockClassNames:!0,handleJsonBlocks:!0,targetElement:this})}
              ${this.jsonLoading?o`<div class="layout horizontal center-center">
                    <md-circular-progress indeterminate></md-circular-progress>
                  </div>`:l}
            </div>
          </div>
          ${this.renderJson()}
        </div>
        ${this.followUpQuestions&&this.followUpQuestions.length>0?o`
              <div class="layout horizontal followup-question-container wrap">
                <md-icon class="followUpQuestionMark">contact_support</md-icon
                >${this.followUpQuestions.map((e=>o`
                    <md-outlined-button
                      class="followup-question"
                      .label="${e}"
                      @click="${()=>this.fire("followup-question",e)}"
                    ></md-outlined-button>
                  `))}
              </div>
            `:l}
      </div>
    `}parseFollowUpQuestions(){this.followUpQuestionsRaw=this.followUpQuestionsRaw.replace(/<<([^>>]+)>>/g,((e,t)=>(this.followUpQuestions.push(t),"")))}updated(e){super.updated(e),e.has("followUpQuestionsRaw")&&this.followUpQuestionsRaw&&this.parseFollowUpQuestions()}renderUser(){return o`
      <div class="userChatDialog layout horizontal user-message">
        <div class="layout vertical chatImage">${this.renderRoboImage()}</div>
        <div class="layout vertical chatText chatTextUser">
          ${ue(this.message,{includeImages:!0,includeCodeBlockClassNames:!0,handleJsonBlocks:!0,targetElement:this})}
        </div>
      </div>
    `}renderNoStreaming(){return o`${this.spinnerActive?o`<svg class="progress-ring" width="28" height="28">
            <circle
              class="progress-ring__circle"
              ?spinnerActive="${this.spinnerActive}"
              stroke="blue"
              stroke-width="2"
              fill="transparent"
              r="10"
              cx="12"
              cy="12"
            />
          </svg>`:o`<md-icon class="doneIcon">done</md-icon>`}
      <div class="thinkingText" ?spinnerActive="${this.spinnerActive}">
        ${this.message}
        ${this.updateMessage?o`- ${this.updateMessage}`:l}
      </div> `}renderThinking(){return o`${this.spinnerActive?o`<svg class="progress-ring" width="28" height="28">
            <circle
              class="progress-ring__circle"
              ?spinnerActive="${this.spinnerActive}"
              stroke="blue"
              stroke-width="2"
              fill="transparent"
              r="10"
              cx="12"
              cy="12"
            />
          </svg>`:o`<md-icon class="doneIcon">done</md-icon>`}
      <div class="thinkingText" ?spinnerActive="${this.spinnerActive}">
        ${this.getThinkingText()}
      </div> `}getThinkingText(){return`${this.t("thinking")}...`}renderMessage(){return"you"===this.sender?this.renderUser():"bot"===this.sender&&"thinking"===this.type?this.renderThinking():"bot"===this.sender&&"noStreaming"===this.type?this.renderNoStreaming():"bot"===this.sender?this.renderChatGPT():void 0}render(){return o` ${this.renderMessage()} `}};me([t({type:String})],xe.prototype,"message",void 0),me([t({type:String})],xe.prototype,"updateMessage",void 0),me([t({type:String})],xe.prototype,"sender",void 0),me([t({type:String})],xe.prototype,"detectedLanguage",void 0),me([t({type:Number})],xe.prototype,"clusterId",void 0),me([t({type:String})],xe.prototype,"type",void 0),me([t({type:Boolean})],xe.prototype,"spinnerActive",void 0),me([t({type:Boolean})],xe.prototype,"fullReferencesOpen",void 0),me([t({type:String})],xe.prototype,"followUpQuestionsRaw",void 0),me([t({type:Array})],xe.prototype,"followUpQuestions",void 0),me([t({type:Boolean})],xe.prototype,"jsonLoading",void 0),xe=me([i("yp-chatbot-item-base")],xe);var fe=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let ye=class extends ${constructor(){super(),this.defaultInfoMessage="I'm your friendly chat assistant",this.inputIsFocused=!1,this.onlyUseTextField=!1,this.showCleanupButton=!1,this.showCloseButton=!1,this.chatbotItemComponentName=m`yp-chatbot-item-base`,this.setupServerApi()}calcVH(){const e=Math.max(document.documentElement.clientHeight,window.innerHeight||0);this.chatWindow.setAttribute("style","height:"+e+"px;")}connectedCallback(){super.connectedCallback()}firstUpdated(e){setTimeout((()=>{this.chatInputField.focus()}),420),setTimeout((()=>{this.chatMessagesElement.addEventListener("scroll",this.handleScroll.bind(this))}),500)}updated(e){super.updated(e),e.has("themeDarkMode")}disconnectedCallback(){super.disconnectedCallback(),this.chatMessagesElement&&this.chatMessagesElement.removeEventListener("scroll",this.handleScroll.bind(this)),this.heartbeatInterval&&clearInterval(this.heartbeatInterval)}addToChatLogWithMessage(e,t=void 0,i=void 0,n=void 0,s=void 0,r=void 0){this.infoMessage=t,e.rawMessage=e.rawMessage||r,this.chatLog=[...this.chatLog,e],this.requestUpdate(),void 0!==i&&(this.sendButton.disabled=i)}get lastChatUiElement(){return this.chatElements[this.chatElements.length-1]}async addChatBotElement(e){switch(e.type){case"hello_message":this.addToChatLogWithMessage(e);break;case"thinking":this.lastChatUiElement&&(this.lastChatUiElement.spinnerActive=!1),this.addToChatLogWithMessage(e,this.t("Thinking..."));break;case"noStreaming":this.addToChatLogWithMessage(e,e.message),await this.updateComplete,this.lastChatUiElement.spinnerActive=!0;break;case"agentStart":console.log("agentStart"),this.lastChatUiElement&&(this.lastChatUiElement.spinnerActive=!1);const t=e.data;setTimeout((()=>{this.scrollDown()}),50),t.noStreaming?this.addChatBotElement({sender:"bot",type:"noStreaming",message:t.name}):(this.addToChatLogWithMessage(e,t.name),this.chatLog[this.chatLog.length-1].message=`${t.name}\n\n`),this.requestUpdate();break;case"liveLlmCosts":this.fire("llm-total-cost-update",e.data);break;case"memoryIdCreated":this.serverMemoryId=e.data,this.fire("server-memory-id-created",e.data);break;case"agentCompleted":console.log("agentCompleted...");const i=e.data;this.lastChatUiElement?(this.lastChatUiElement.spinnerActive=!1,this.lastChatUiElement.message=i.name):console.error("No last element on agentCompleted");break;case"agentUpdated":console.log("agentUpdated"),this.lastChatUiElement?this.lastChatUiElement.updateMessage=e.message:console.error("No last element on agentUpdated");break;case"start":this.lastChatUiElement&&(this.lastChatUiElement.spinnerActive=!1),this.addToChatLogWithMessage(e,this.t("Thinking...")),this.chatLog[this.chatLog.length-1].message||(this.chatLog[this.chatLog.length-1].message="");break;case"start_followup":this.lastChatUiElement.followUpQuestionsRaw="";break;case"stream_followup":this.lastChatUiElement.followUpQuestionsRaw+=e.message,this.requestUpdate();break;case"info":this.infoMessage=e.message;break;case"moderation_error":e.message="OpenAI Moderation Flag Error. Please refine your question.",this.addToChatLogWithMessage(e,e.message,!1,this.t("Send"));break;case"error":this.addToChatLogWithMessage(e,e.message,!1,this.t("Send"));break;case"end":this.lastChatUiElement.stopJsonLoading(),this.sendButton.disabled=!1,this.sendButton.innerHTML=this.t("Send"),this.infoMessage=this.defaultInfoMessage;break;case"message":this.lastChatUiElement&&(this.lastChatUiElement.spinnerActive=!1),this.addToChatLogWithMessage(e,e.message,void 0,void 0),this.sendButton.disabled=!1,this.sendButton.innerHTML=this.t("Send"),this.infoMessage=this.defaultInfoMessage,this.requestUpdate();break;case"stream":if(e.message&&"undefined"!=e.message){this.infoMessage=this.t("typing"),this.chatLog[this.chatLog.length-1].message=this.chatLog[this.chatLog.length-1].message+e.message,this.requestUpdate();break}}this.scrollDown()}static get styles(){return[super.styles,e`
        md-outlined-text-field {
          width: 350px;
        }

        .infoMessage {
          margin-top: 8px;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          height: 75vh;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
        }
        .chat-messages {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
          overflow-y: scroll;
        }

        .you-chat-element {
          align-self: flex-start;
          max-width: 80%;
          justify-content: flex-start;
          margin-right: 32px;
        }

        .bot-chat-element {
          align-self: flex-start;
          justify-content: flex-start;
          width: 100%;
          max-width: 100%;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
        }

        @media (max-width: 960px) {
          .restartButton {
            margin-left: 8px;
            display: none;
          }

          .chat-window {
            max-height: 90vh;
            height: 90vh;
          }

          .closeButton  {
            margin-left: 8px;
          }

          .darkModeButton {
            margin-right: 8px;
            display: none;
          }

          md-outlined-text-field {
            transition: transform 0.5s;
            width: 300px;
          }

          .chat-messages {
            padding: 0px;
          }

          .you-chat-element {
            max-width: 100%;
            margin-right: 8px;
          }

          .chat-input {
            padding-left: 0px;
            padding-right: 0px;
          }

          .restartButton[input-is-focused] {
          }

          .darkModeButton[input-is-focused] {
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .chat-window {

          }

          .you-chat-element {
            margin-right: 0;
          }
        }

        md-tonal-button {
          padding: 16px;
          padding-left: 0;
          margin-top: 0;
        }

        .sendIcon {
          cursor: pointer;
        }

        .restartButton, .closeButton {
          margin-left: 16px;
        }

        .darkModeButton {
          margin-right: 16px;
        }

        md-outlined-text-field {
          flex: 1;
          border-radius: 10px;
          border: none;
          padding: 10px;
          margin: 16px;
          margin-bottom: 16px;
          margin-left: 8px;
          margin-right: 8px;
          width: 650px;
        }

        .chatElement[thinking] {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        @media (max-width: 450px) {
          md-outlined-text-field {
            width: 350px;
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 320px;
          }

          md-outlined-text-field[focused] {
            width: 100%;
          }
        }
      `]}followUpQuestion(e){this.chatInputField.value=e.detail,this.sendChatMessage()}renderChatInput(){return o`
      ${this.showCleanupButton?o`
        <md-outlined-icon-button
          class="restartButton"
          @click="${()=>this.fire("reset-chat")}"
        ><md-icon>refresh</md-icon></md-icon></md-outlined-icon-button>
      `:l}
      ${this.showCloseButton?o`
        <md-outlined-icon-button
          class="closeButton"
          @click="${()=>this.fire("chatbot-close")}"
        ><md-icon>close</md-icon></md-icon></md-outlined-icon-button>
      `:l}
      ${this.onlyUseTextField||this.chatLog.length>1?o`
            <md-outlined-text-field
              class="textInput"
              type="text"
              hasTrailingIcon
              id="chatInput"
              rows="${this.chatLog.length>1?"1":"3"}"
              @focus="${()=>this.inputIsFocused=!0}"
              @blur="${()=>this.inputIsFocused=!0}"
              @keyup="${e=>{"Enter"===e.key&&this.sendChatMessage()}}"
              .label="${this.textInputLabel}"
            >
              <md-icon
                class="sendIcon"
                @click="${this.sendChatMessage}"
                slot="trailing-icon"
                id="sendButton"
                ?input-is-focused="${this.inputIsFocused}"
                >send</md-icon
              >
            </md-outlined-text-field>
          `:o`<md-outlined-text-field
            class="textInput"
            type="textarea"
            hasTrailingIcon
            id="chatInput"
            rows="3"
            @focus="${()=>this.inputIsFocused=!0}"
            @blur="${()=>this.inputIsFocused=!0}"
            .label="${this.textInputLabel}"
          >
            <md-icon
              class="sendIcon"
              @click="${this.sendChatMessage}"
              slot="trailing-icon"
              id="sendButton"
              ?input-is-focused="${this.inputIsFocused}"
              >send</md-icon
            ></md-outlined-text-field
          >`}
    `}render(){return o`
      <div class="chat-window" id="chat-window">
        <div class="chat-messages" id="chat-messages">
          <yp-chatbot-item-base
            ?hidden="${!this.defaultInfoMessage}"
            class="chatElement bot-chat-element"
            .detectedLanguage="${this.language}"
            .message="${this.defaultInfoMessage}"
            type="info"
            sender="bot"
          ></yp-chatbot-item-base>
          ${this.chatLog.filter((e=>!e.hidden)).map((e=>o`
                <yp-chatbot-item-base
                  ?thinking="${"thinking"===e.type||"noStreaming"===e.type}"
                  @followup-question="${this.followUpQuestion}"
                  .clusterId="${this.clusterId}"
                  class="chatElement ${e.sender}-chat-element"
                  .detectedLanguage="${this.language}"
                  .message="${e.message}"
                  @scroll-down-enabled="${()=>this.userScrolled=!1}"
                  .type="${e.type}"
                  .sender="${e.sender}"
                ></yp-chatbot-item-base>
              `))}
        </div>
        <div class="layout horizontal center-center chat-input">
          ${this.renderChatInput()}
        </div>
      </div>
    `}};fe([t({type:String})],ye.prototype,"infoMessage",void 0),fe([t({type:String})],ye.prototype,"defaultInfoMessage",void 0),fe([t({type:Boolean})],ye.prototype,"inputIsFocused",void 0),fe([t({type:Boolean})],ye.prototype,"onlyUseTextField",void 0),fe([t({type:Number})],ye.prototype,"clusterId",void 0),fe([t({type:Number})],ye.prototype,"communityId",void 0),fe([t({type:String})],ye.prototype,"textInputLabel",void 0),fe([t({type:Boolean})],ye.prototype,"showCleanupButton",void 0),fe([t({type:Boolean})],ye.prototype,"showCloseButton",void 0),fe([c("#sendButton")],ye.prototype,"sendButton",void 0),fe([u("yp-chatbot-item-base")],ye.prototype,"chatElements",void 0),fe([c("#chatInput")],ye.prototype,"chatInputField",void 0),fe([c("#chat-window")],ye.prototype,"chatWindow",void 0),fe([c("#chat-messages")],ye.prototype,"chatMessagesElement",void 0),ye=fe([i("yp-chatbot-base")],ye);class we extends x{constructor(e="/api/allOurIdeas"){super(),this.baseUrlPath=e}getEarlData(e){return this.fetchWrapper(this.baseUrlPath+`/${e}`)}async getPrompt(e,t){return this.fetchWrapper(this.baseUrlPath+`/${e}/questions/${t}/prompt`)}async getSurveyResults(e){return this.fetchWrapper(this.baseUrlPath+`/${e}/questions/results`)}getSurveyAnalysis(e,t,i,n,s){return this.fetchWrapper(this.baseUrlPath+`/${e}/questions/${t}/${i}/${n}/analysis?languageName=${s}`)}async checkLogin(){if(window.appUser.loggedIn())return!0;if(window.appGlobals.currentAnonymousGroup){const e=await window.serverApi.registerAnonymously({groupId:window.appGlobals.currentAnonymousGroup.id,trackingParameters:window.appGlobals.originalQueryParameters});return!!e&&(window.appUser.setLoggedInUser(e),!0)}return!1}async submitIdea(e,t,i){return await this.checkLogin()?this.fetchWrapper(this.baseUrlPath+`/${e}/questions/${t}/addIdea`,{method:"POST",body:JSON.stringify({newIdea:i})},!1):(window.appUser.openUserlogin(),null)}async postVote(e,t,i,n,s,r){if(await this.checkLogin()){const o=new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${e}/questions/${t}/prompts/${i}/${"skip"==r?"skips":"votes"}?locale=${n}`);Object.keys(window.appGlobals.originalQueryParameters).forEach((e=>{e.startsWith("utm_")&&o.searchParams.append(e,window.aoiAppGlobals.originalQueryParameters[e])}));const a=window.appUser.getBrowserId(),l=window.appUser.browserFingerprint,c=window.appUser.browserFingerprintConfidence;return o.searchParams.append("checksum_a",a),o.searchParams.append("checksum_b",l),o.searchParams.append("checksum_c",c.toString()),this.fetchWrapper(o.toString(),{method:"POST",body:JSON.stringify(s)},!1)}return window.appUser.openUserlogin(),null}async postVoteSkip(e,t,i,n,s){if(await this.checkLogin()){const r=new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${e}/questions/${t}/prompts/${i}/skip.js?locale=${n}`);Object.keys(window.appGlobals.originalQueryParameters).forEach((e=>{e.startsWith("utm_")&&r.searchParams.append(e,window.aoiAppGlobals.originalQueryParameters[e])}));const o=window.appUser.getBrowserId(),a=window.appUser.browserFingerprint,l=window.appUser.browserFingerprintConfidence;return r.searchParams.append("checksum_a",o),r.searchParams.append("checksum_b",a),r.searchParams.append("checksum_c",l.toString()),this.fetchWrapper(r.toString(),{method:"POST",body:JSON.stringify(s)},!1)}return window.appUser.openUserlogin(),null}async getResults(e,t,i=!1){return this.fetchWrapper(this.baseUrlPath+`/${e}/choices/${t}/throughGroup${i?"?showAll=1":""}`)}llmAnswerConverstation(e,t,i,n){return this.fetchWrapper(this.baseUrlPath+`/${e}/llmAnswerExplain`,{method:"PUT",body:JSON.stringify({wsClientId:t,chatLog:i,languageName:n})},!1)}}var be=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let ve=class extends ye{constructor(){super(...arguments),this.showCloseButton=!0,this.defaultInfoMessage=void 0,this.haveSentFirstQuestion=!1}setupServerApi(){this.serverApi=new we}async connectedCallback(){super.connectedCallback(),this.addEventListener("yp-ws-opened",this.sendFirstQuestion),this.addEventListener("chatbot-close",this.cancel)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("yp-ws-opened",this.sendFirstQuestion),this.addEventListener("chatbot-close",this.cancel)}async sendFirstQuestion(){window.appGlobals.activity("Explain - first qestion");const e=`**${this.t("hereIsTheQuestion")}:**\n${this.questionText}\n\n**${this.t("firstAnswer")}:**\n${this.leftAnswerText}\n\n**${this.t("secondAnswer")}**\n${this.rightAnswerText}\n`;this.addChatBotElement({sender:"you",type:"start",message:e}),this.addThinkingChatBotMessage(),await this.serverApi.llmAnswerConverstation(this.groupId,this.wsClientId,this.simplifiedChatLog,f.getEnglishName(this.language))}async sendChatMessage(){const e=this.chatInputField.value;0!==e.length&&(this.chatInputField.value="",this.sendButton.disabled=!1,setTimeout((()=>{this.chatInputField.blur()})),this.addChatBotElement({sender:"you",type:"start",message:e}),this.addThinkingChatBotMessage(),await this.serverApi.llmAnswerConverstation(this.groupId,this.wsClientId,this.simplifiedChatLog,f.getEnglishName(this.language)))}open(){this.dialog.show(),this.currentError=void 0,window.appGlobals.activity("Llm explain - open")}cancel(){this.dialog.close(),window.appGlobals.activity("Llm explain - cancel"),this.fire("closed")}textAreaKeyDown(e){return!(13===e.keyCode&&!e.shiftKey)||(e.preventDefault(),!1)}static get styles(){return[...super.styles,I,e`
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
      `]}render(){return o`<md-dialog
      @closed="${()=>this.cancel()}"
      ?fullscreen="${!this.wide}"
      class="dialog"
      id="dialog"
    >
      <div slot="headline">${this.t("explainBothAnswers")}</div>
      <div slot="content" id="content">${super.render()}</div>
    </md-dialog> `}};be([t({type:Object})],ve.prototype,"earl",void 0),be([t({type:Number})],ve.prototype,"groupId",void 0),be([t({type:Object})],ve.prototype,"question",void 0),be([t({type:String})],ve.prototype,"questionText",void 0),be([t({type:String})],ve.prototype,"leftAnswerText",void 0),be([t({type:String})],ve.prototype,"rightAnswerText",void 0),be([t({type:Object})],ve.prototype,"leftAnswer",void 0),be([t({type:Object})],ve.prototype,"rightAnswer",void 0),be([t({type:String})],ve.prototype,"currentError",void 0),be([t({type:Boolean})],ve.prototype,"showCloseButton",void 0),be([t({type:String})],ve.prototype,"defaultInfoMessage",void 0),be([c("#dialog")],ve.prototype,"dialog",void 0),ve=be([i("aoi-llm-explain-dialog")],ve);var ke=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let $e=class extends n{constructor(){super(),this.voteCount=0,this.spinnersActive=!1,this.breakForVertical=!1,this.breakButtonsForVertical=!1,this.llmExplainOpen=!1,this.level=1,this.resetAnimation=this.resetAnimation.bind(this)}async connectedCallback(){super.connectedCallback(),this.setupBootListener(),this.spinnersActive=!1,this.fire("needs-new-earl"),window.appGlobals.activity("Voting - open"),this.resetTimer(),this.installMediaQueryWatcher("(max-width: 800px)",(e=>{this.breakForVertical=e})),this.installMediaQueryWatcher("(max-width: 450px)",(e=>{this.breakButtonsForVertical=e}))}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Voting - close"),this.fireGlobal("set-ids",{questionId:this.question.id,promptId:void 0})}resetTimer(){this.timer=(new Date).getTime()}animateButtons(e){return new Promise((t=>{const i=this.shadowRoot?.querySelector("#leftAnswerButton"),n=this.shadowRoot?.querySelector("#rightAnswerButton");i?.addEventListener("animationend",this.resetAnimation),n?.addEventListener("animationend",this.resetAnimation),"left"===e?(i?.classList.add("animate-up","fade-slow"),n?.classList.add("animate-down","fade-fast")):"right"===e?(n?.classList.add("animate-up","fade-slow"),i?.classList.add("animate-down","fade-fast")):(i?.classList.add("fade-slow"),n?.classList.add("fade-slow")),t()}))}resetAnimation(e){e.target.classList.remove("animate-up","animate-down","animate-from-left","animate-from-right","fade-fast","fade-slow")}async voteForAnswer(e){window.appGlobals.activity(`Voting - ${e}`);const t={time_viewed:(new Date).getTime()-(this.timer||0),prompt_id:this.promptId,direction:e,appearance_lookup:this.appearanceLookup},i=window.aoiServerApi.postVote(this.groupId,this.question.id,this.promptId,this.language,t,e);let n=this.animateButtons(e);const s=setTimeout((()=>{this.spinnersActive=!0}),1e3),[r]=await Promise.all([i,n]);if(clearTimeout(s),this.spinnersActive=!1,!r)return this.fire("display-snackbar",this.t("Network error, please try again.")),void this.removeAndInsertFromLeft();{try{this.leftAnswer=JSON.parse(r.newleft)}catch(e){console.warn("Error parsing answers JSON",e,r.newleft),this.leftAnswer=r.newleft}try{this.rightAnswer=JSON.parse(r.newright)}catch(e){console.warn("Error parsing answers JSON",e,r.newright),this.rightAnswer=r.newright}this.promptId=r.prompt_id,this.appearanceLookup=r.appearance_lookup,this.fire("update-appearance-lookup",{appearanceLookup:this.appearanceLookup,promptId:this.promptId,leftAnswer:this.leftAnswer,rightAnswer:this.rightAnswer}),this.fireGlobal("set-ids",{questionId:this.question.id,promptId:this.promptId}),this.removeAndInsertFromLeft();const t=this.shadowRoot?.querySelectorAll("md-elevated-button");t?.forEach((e=>{e.blur()})),"skip"!==e&&(this.question.visitor_votes+=1),this.requestUpdate(),this.resetTimer()}}async setLabelOnMdButton(){const e=this.shadowRoot?.querySelectorAll("md-elevated-button");e?(await this.updateComplete,e.forEach((e=>{const t=e.shadowRoot;if(t){const e=t.querySelector("button .label");e?e.style.overflow="visible":console.error("Label span not found within the shadow DOM of the button")}else console.error("Shadow DOM not found for the button")}))):console.error("No custom buttons found")}firstUpdated(e){super.firstUpdated(e),this.setLabelOnMdButton()}removeAndInsertFromLeft(){const e=this.shadowRoot?.querySelector("#leftAnswerButton"),t=this.shadowRoot?.querySelector("#rightAnswerButton");e?.classList.remove("animate-up","animate-down","fade-fast","fade-slow"),t?.classList.remove("animate-up","animate-down","fade-fast","fade-slow"),e?.classList.add("animate-from-left"),t?.classList.add("animate-from-right")}openNewIdeaDialog(){this.$$("#newIdeaDialog").open()}async openLlmExplainDialog(){this.llmExplainOpen=!0,await this.updateComplete,this.$$("#llmExplainDialog").open()}static get styles(){return[super.styles,I,e`
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
      `]}renderProgressBar(){if(this.earl.configuration){let e=this.earl.configuration.target_votes||30;if(!this.currentLevelTargetVotes||this.question.visitor_votes>=this.currentLevelTargetVotes){this.currentLevelTargetVotes=e;let t=1;for(;this.question.visitor_votes>=this.currentLevelTargetVotes;)this.currentLevelTargetVotes*=2,t*=2;let i=Math.log(t)/Math.log(2)+1;this.level=i}let t=this.currentLevelTargetVotes;const i=Math.min(this.question.visitor_votes/t*100,100);return o`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${i}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t("votes of")} ${t}
          ${this.t("target")} (${this.t("Level")} ${this.level})
        </div>
      `}return l}render(){return this.question?o`
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
            ${this.spinnersActive?o`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `:l}
            <md-elevated-button
              id="leftAnswerButton"
              class="leftAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${()=>this.voteForAnswer("left")}
            >
              ${this.leftAnswer?.imageUrl?o`
                    <yp-image
                      slot="icon"
                      .src="${this.leftAnswer?.imageUrl}"
                      alt="Left answer image"
                      ?rtl="${this.rtl}"
                      class="iconImage"
                    ></yp-image>
                  `:l}
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
            ${this.spinnersActive?o`
                  <div class="spinnerContainer">
                    <md-circular-progress
                      class="leftSpinner"
                      indeterminate
                    ></md-circular-progress>
                  </div>
                `:l}
            <md-elevated-button
              id="rightAnswerButton"
              class="rightAnswer answerButton"
              ?trailing-icon="${!this.rtl}"
              ?hidden="${this.spinnersActive}"
              @click=${()=>this.voteForAnswer("right")}
            >
              ${this.rightAnswer?.imageUrl?o`
                    <yp-image
                      slot="icon"
                      ?rtl="${this.rtl}"
                      src="${this.rightAnswer?.imageUrl}"
                      alt="Right answer image"
                      class="iconImageRight"
                    ></yp-image>
                  `:l}
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
        ${this.wide?l:o`
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
        ${this.llmExplainOpen?o`
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
            `:l}
      `:l}};ke([t({type:Number})],$e.prototype,"groupId",void 0),ke([t({type:Object})],$e.prototype,"earl",void 0),ke([t({type:Object})],$e.prototype,"question",void 0),ke([t({type:Object})],$e.prototype,"firstPrompt",void 0),ke([t({type:Number})],$e.prototype,"promptId",void 0),ke([t({type:Object})],$e.prototype,"group",void 0),ke([t({type:Number})],$e.prototype,"voteCount",void 0),ke([t({type:Boolean})],$e.prototype,"spinnersActive",void 0),ke([t({type:Object})],$e.prototype,"leftAnswer",void 0),ke([t({type:Object})],$e.prototype,"rightAnswer",void 0),ke([t({type:String})],$e.prototype,"appearanceLookup",void 0),ke([t({type:Boolean})],$e.prototype,"breakForVertical",void 0),ke([t({type:Boolean})],$e.prototype,"breakButtonsForVertical",void 0),ke([t({type:Boolean})],$e.prototype,"llmExplainOpen",void 0),ke([t({type:Number})],$e.prototype,"level",void 0),ke([t({type:Number})],$e.prototype,"currentLevelTargetVotes",void 0),$e=ke([i("aoi-survey-voting")],$e);var Ie=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let Ae=class extends n{constructor(){super(...arguments),this.showScores=!1}async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Results - open")}async fetchResults(){this.results=await window.aoiServerApi.getResults(this.groupId,this.question.id,!this.earl?.configuration?.minimum_ten_votes_to_show_results)}updated(e){super.updated(e),e.has("earl")&&this.earl&&this.fetchResults()}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Results - close")}toggleScores(){const e=this.$$("#showScores");this.showScores=e.checked,window.appGlobals.activity("Results - toggle scores "+(this.showScores?"on":"off"))}exportToCSV(){const e=(e,t)=>null===t?"":t;let t=Object.keys(this.results[0]).flatMap((e=>"data"===e?["content","imageUrl"]:[e])),i=this.results.map((i=>t.map((t=>{if("content"===t||"imageUrl"===t){const n=i.data[t];return JSON.stringify(n,e)}return JSON.stringify(i[t],e)})).join(",")));i.unshift(t.join(","));const n=i.join("\r\n"),s=new Blob([n],{type:"text/csv"}),r=URL.createObjectURL(s),o=document.createElement("a");o.href=r,o.download="survey_results.csv",o.click(),URL.revokeObjectURL(r),setTimeout((()=>o.remove()),0),window.appGlobals.activity("Results - export to csv")}static get styles(){return[super.styles,I,e`
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
      `]}renderRow(e,t){return o`
      <div class="row layout horizontal">
        <div class="column index">${e+1}.</div>
        <div class="layout horizontal nameAndScore">
          <div class="layout vertical scoreAndNameContainer">
            <div class="layout horizontal">
              <div class="column ideaName">
                <yp-magic-text
                  id="answerText"
                  .contentId="${this.groupId}"
                  .extraId="${t.data.choiceId}"
                  .additionalId="${this.question.id}"
                  textOnly
                  truncate="140"
                  .content="${t.data.content}"
                  .contentLanguage="${this.group.language}"
                  textType="aoiChoiceContent"
                ></yp-magic-text>
              </div>
              <div class="flex"></div>
              <img
                class="answerImage"
                ?hidden="${null==t.data.imageUrl}"
                src="${t.data.imageUrl}"
              />
            </div>
            <div
              class="column layout vertical center-center scores"
              ?hidden="${!this.showScores}"
            >
              <div>
                <b
                  >${this.t("How likely to win")}:
                  ${Math.round(t.score)}%</b
                >
              </div>
              <div class="winLosses">
                ${this.t("Wins")}: ${y.number(t.wins)}
                ${this.t("Losses")}:
                ${y.number(t.losses)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `}render(){return this.results?o`
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
            ${this.results.map(((e,t)=>this.renderRow(t,e)))}
            ${this.earl.configuration?.minimum_ten_votes_to_show_results?o`
              <div class="minimumTenVotesInfo">${this.t("minimumTenVotesInfo")}</div>
            `:l}
            <div class="title subTitle">
              ${y.number(this.question.votes_count)}
              ${this.t("total votes")}
            </div>
            <md-outlined-button @click=${this.exportToCSV} class="exportButton">
              ${this.t("Download Results as CSV")}
            </md-outlined-button>
          </div>
        `:o`<div class="loading">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>`}};Ie([t({type:Array})],Ae.prototype,"results",void 0),Ie([t({type:Object})],Ae.prototype,"question",void 0),Ie([t({type:Object})],Ae.prototype,"earl",void 0),Ie([t({type:Object})],Ae.prototype,"group",void 0),Ie([t({type:Number})],Ae.prototype,"groupId",void 0),Ie([t({type:Boolean})],Ae.prototype,"showScores",void 0),Ae=Ie([i("aoi-survey-results")],Ae);var Te=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let Ce=class extends ${constructor(){super(),this.analysis="",this.selectedChoices=[],this.serverApi=new we}async connectedCallback(){super.connectedCallback(),this.addEventListener("yp-ws-opened",this.streamAnalysis)}disconnectedCallback(){super.disconnectedCallback(),this.addEventListener("yp-ws-opened",this.streamAnalysis)}async streamAnalysis(){const{cachedAnalysis:e,selectedChoices:t}=await this.serverApi.getSurveyAnalysis(this.groupId,this.wsClientId,this.analysisIndex,this.analysisTypeIndex,f.getEnglishName(this.language)||"");e&&(this.analysis=e),this.selectedChoices=t}renderChoice(e,t){return o`
      <div class="answers layout horizontal" style="width: 100%">
        <div class="column index ideaIndex">${e+1}.</div>
        <div class="layout horizontal" style="width: 100%">
          <div class="column ideaName">
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${t.data.choiceId}"
              .additionalId="${this.earl.question_id}"
              textOnly
              truncate="140"
              .content="${t.data.content}"
              .contentLanguage="${this.group.language}"
              textType="aoiChoiceContent"
            ></yp-magic-text>
          </div>
          <div class="flex"></div>
          <img
            class="answerImage"
            ?hidden="${null==t.data.imageUrl}"
            src="${t.data.imageUrl}"
          />
        </div>
      </div>
    `}async addChatBotElement(e){switch(e.type){case"start":case"moderation_error":case"error":case"end":break;case"stream":if(e.message&&"undefined"!=e.message){this.analysis+=e.message;break}console.warn("stream message is undefined")}this.scrollDown()}static get styles(){return[super.styles,e`
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
      `]}render(){return o`<div class="content layout vertical">
      ${this.selectedChoices.map(((e,t)=>this.renderChoice(t,e)))}
      ${ue(this.analysis,{includeImages:!0,includeCodeBlockClassNames:!0})}
      <div ?hidden="${!this.analysis}" class="generatingInfo">${this.t("Written by GPT-4")}</div>
    </div>`}};Te([t({type:Object})],Ce.prototype,"earl",void 0),Te([t({type:Number})],Ce.prototype,"groupId",void 0),Te([t({type:Object})],Ce.prototype,"group",void 0),Te([t({type:Number})],Ce.prototype,"analysisIndex",void 0),Te([t({type:Number})],Ce.prototype,"analysisTypeIndex",void 0),Te([t({type:String})],Ce.prototype,"analysis",void 0),Te([t({type:Array})],Ce.prototype,"selectedChoices",void 0),Ce=Te([i("aoi-streaming-analysis")],Ce);var _e=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};let Se=class extends n{async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("Analysis - open")}disconnectedCallback(){super.disconnectedCallback(),window.appGlobals.activity("Analysis - close")}renderStreamingAnalysis(){try{const e=JSON.parse(this.earl.configuration.analysis_config);return o` ${e.analyses.map((e=>e.map((t=>o`<aoi-streaming-analysis
            groupId=${this.groupId}
            analysisIndex=${e.analysisIndex}
            analysisTypeIndex=${t}
          >
          </aoi-streaming-analysis>`))))}`}catch(e){return console.error(e),l}}updated(e){super.updated(e)}static get styles(){return[...super.styles,I,e`
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
      `]}renderAnalysis(){let e=o``;if(this.earl.configuration&&this.earl.configuration.analysis_config?.analyses?.length>0)for(let t=0;t<this.earl.configuration.analysis_config.analyses.length;t++){const i=this.earl.configuration.analysis_config.analyses[t];e=o`${e}`;let n=o``;for(let e=0;e<i.analysisTypes.length;e++)n=o`${n}
            <aoi-streaming-analysis
              .groupId=${this.group.id}
              .group=${this.group}
              .earl=${this.earl}
              .analysisIndex=${t}
              .analysisTypeIndex=${e}
            >
            </aoi-streaming-analysis>`;e=o`${e}
          <div class="rowsContainer">${n}</div>`}return e}render(){return o`
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
    `}};_e([t({type:Number})],Se.prototype,"groupId",void 0),_e([t({type:Object})],Se.prototype,"group",void 0),_e([t({type:Object})],Se.prototype,"question",void 0),_e([t({type:Object})],Se.prototype,"earl",void 0),Se=_e([i("aoi-survey-analysis")],Se);class Le extends w{constructor(e){super(e,!0),this.disableParentConstruction=!0,this.setIds=e=>{this.questionId=e.detail.questionId,this.earlId=e.detail.earlId,this.promptId=e.detail.promptId},this.parseQueryString=()=>{const e=(window.location.search||"?").substr(1);let t={};const i=/([^&=]+)=?([^&]*)(?:&+|$)/g;let n;for(;n=i.exec(e);){const e=n[1],i=n[2];t[e]=i}this.originalQueryParameters=t},this.getSessionFromCookie=()=>{const e=document.cookie.split(";");let t="";for(let i=0;i<e.length;i++){let n=e[i].split("=")[0],s=e[i].split("=")[1];"_all_our_ideas_session"===n.trim()&&(t=s)}return t},this.activity=(e,t=void 0)=>{let i;i=window.appUser&&window.appUser.user?window.appUser.user.id.toString():"-1";const n=new Date,s={actor:i,type:e,object:t,path_name:location.pathname,event_time:n.toISOString(),session_id:this.getSessionFromCookie(),originalQueryString:this.getOriginalQueryString(),originalReferrer:this.originalReferrer,questionId:this.questionId,earlId:this.earlId,promptId:this.promptId,userLocale:window.locale,userAutoTranslate:window.autoTranslate,user_agent:navigator.userAgent,referrer:document.referrer,url:location.href,screen_width:window.innerWidth};try{fetch("/api/users/createActivityFromApp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).then((t=>{t.ok?"Voting - left"!==e&&"Voting - right"!==e&&"New Idea - added"!==e||this.checkExternalGoalTrigger(e):console.error(`HTTP error! status: ${t.status}`)})).catch((e=>{console.error("There has been a problem with your fetch operation:",e)}))}catch(e){console.error(e)}},this.parseQueryString(),this.originalReferrer=document.referrer,document.addEventListener("set-ids",this.setIds.bind(this))}getOriginalQueryString(){return this.originalQueryParameters?new URLSearchParams(this.originalQueryParameters).toString():null}}var ze=function(e,t,i,n){for(var s,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n,a=e.length-1;a>=0;a--)(s=e[a])&&(o=(r<3?s(o):r>3?s(t,i,o):s(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};const Oe=1,Ee=2,Be=3,qe=4,Ue=5;let Re=class extends n{constructor(){super(),this.pageIndex=1,this.totalNumberOfVotes=0,this.isAdmin=!1,this.surveyClosed=!1,window.aoiServerApi=new we,window.aoiAppGlobals=new Le(window.aoiServerApi),window.aoiAppGlobals.activity("pageview")}connectedCallback(){super.connectedCallback(),this.setupBootListener(),this._setupEventListeners(),this.collection.configuration.allOurIdeas?(console.error("Connecting to old configuration"),this.getEarl()):this.fire("yp-network-error",{showUserError:!0})}async getEarl(){window.aoiAppGlobals.activity("Survey - fetch start");try{const e=await window.aoiServerApi.getEarlData(this.collectionId);this.earl=this.collection.configuration.allOurIdeas.earl,this.question=e.question,this.prompt=e.prompt,this.appearanceLookup=this.question.appearance_id;try{this.currentLeftAnswer=JSON.parse(this.prompt.left_choice_text),this.currentRightAnswer=JSON.parse(this.prompt.right_choice_text)}catch(e){console.warn("Error parsing prompt answers",e),this.currentLeftAnswer=this.prompt.left_choice_text,this.currentRightAnswer=this.prompt.right_choice_text}this.currentPromptId=this.prompt.id,document.title=this.question.name,this.earl.active?this.surveyClosed=!1:this.surveyClosed=!0,this.fireGlobal("set-ids",{questionId:this.question.id,promptId:this.prompt.id}),window.aoiAppGlobals.activity("Survey - fetch end")}catch(e){console.error("Error fetching earl",e),window.aoiAppGlobals.activity("Survey - fetch error")}}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}scrollToCollectionItemSubClass(){}getHexColor(e){return e&&6===(e=e.replace(/#/g,"")).length?`#${e}`:void 0}snackbarclosed(){this.lastSnackbarText=void 0}tabChanged(e){0==e.detail.activeIndex?this.pageIndex=1:1==e.detail.activeIndex?this.pageIndex=2:2==e.detail.activeIndex?this.pageIndex=3:3==e.detail.activeIndex&&(this.pageIndex=4)}exitToMainApp(){}async _displaySnackbar(e){this.lastSnackbarText=e.detail,await this.updateComplete,this.$$("#snackbar").open=!0}_setupEventListeners(){this.addListener("display-snackbar",this._displaySnackbar)}_removeEventListeners(){this.removeListener("display-snackbar",this._displaySnackbar)}externalGoalTrigger(){try{let e=new URL(window.aoiAppGlobals.externalGoalTriggerUrl),t=window.aoiAppGlobals.exernalGoalParamsWhiteList;t&&(t=t.toLowerCase().split(",").map((e=>e.trim())));for(const i in window.aoiAppGlobals.originalQueryParameters)t&&!t.includes(i.toLowerCase())||e.searchParams.append(i,window.aoiAppGlobals.originalQueryParameters[i]);window.location.href=e.toString()}catch(e){console.error("Invalid URL:",window.aoiAppGlobals.externalGoalTriggerUrl,e)}}updated(e){super.updated(e)}_appError(e){console.error(e.detail.message),this.currentError=e.detail.message}get adminConfirmed(){return!0}_settingsColorChanged(e){this.fireGlobal("yp-theme-color",e.detail.value)}static get styles(){return[...super.styles,e`
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
          z-index: 7;
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
      `]}changeTabTo(e){this.tabChanged({detail:{activeIndex:e}})}updateThemeColor(e){this.themeColor=e.detail}sendVoteAnalytics(){this.totalNumberOfVotes%10==0&&window.aoiAppGlobals.activity(`User voted ${this.totalNumberOfVotes} times`)}updateappearanceLookup(e){this.appearanceLookup=e.detail.appearanceLookup,this.currentPromptId=e.detail.promptId,this.currentLeftAnswer=e.detail.leftAnswer,this.currentRightAnswer=e.detail.rightAnswer,this.totalNumberOfVotes++,this.question.votes_count++,this.sendVoteAnalytics()}renderIntroduction(){return o` <div class="layout vertical center-center"></div> `}renderShare(){return o` <div class="layout vertical center-center"></div> `}startVoting(){this.pageIndex=2,this.$$("#navBar")&&(this.$$("#navBar").activeIndex=1),this.$$("#votingTab")&&(this.$$("#votingTab").selected=!0),this.$$("#introTab")&&(this.$$("#introTab").selected=!1)}openResults(){this.pageIndex=3,this.$$("#navBar")&&(this.$$("#navBar").activeIndex=2),this.$$("#resultsTab")&&(this.$$("#resultsTab").selected=!0),this.$$("#introTab")&&(this.$$("#introTab").selected=!1)}triggerExternalGoalUrl(){window.location.href=window.aoiAppGlobals.externalGoalTriggerUrl}_renderPage(){if(!this.earl)return o` <div class="loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>`;switch(this.pageIndex){case Oe:return o`<aoi-survey-intro
            .earl="${this.earl}"
            .group="${this.collection}"
            .question="${this.question}"
            @startVoting="${this.startVoting}"
            @openResults="${this.openResults}"
            .themeDarkMode="${this.themeDarkMode}"
          ></aoi-survey-intro>`;case Ee:return b(o`<aoi-survey-voting
            .earl="${this.earl}"
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .question="${this.question}"
            .leftAnswer="${this.currentLeftAnswer}"
            .rightAnswer="${this.currentRightAnswer}"
            .promptId="${this.currentPromptId}"
            .appearanceLookup="${this.appearanceLookup}"
            @update-appearance-lookup="${this.updateappearanceLookup}"
          ></aoi-survey-voting>`);case Be:return o`<aoi-survey-results
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-results>`;case qe:return o`<aoi-survey-analysis
            .groupId="${this.collectionId}"
            .group="${this.collection}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-analysis>`;case Ue:return o` ${this.renderShare()} `;default:return o`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `}}renderScore(){return o` <div class="layout vertical center-center"></div> `}renderNavigationBar(){return this.wide?o`
        <div class="layout vertical center-center">
          <md-tabs aria-label="Navigation Tabs">
            <md-primary-tab
              id="introTab"
              class="${this.pageIndex==Oe&&"selectedContainer"}"
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
              class="${this.pageIndex==Ee&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(1)}"
              aria-label="${this.t("Participate Now!")}"
            >
              <md-icon slot="icon">thumb_up</md-icon>
              ${this.t("vote")}
            </md-primary-tab>


            <md-primary-tab
              id="resultsTab"
              ?hidden="${this.earl?.configuration.hide_results}"
              class="${this.pageIndex==Be&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(2)}"
              aria-label="${this.t("Results")}"
            >
              <md-icon slot="icon">grading</md-icon>
              ${this.t("Results")}
            </md-primary-tab>

            <md-primary-tab
              ?hidden="${!this.hasLlm||this.earl?.configuration.hide_analysis}"
              class="${this.pageIndex==qe&&"selectedContainer"}"
              @click="${()=>this.changeTabTo(3)}"
              aria-label="${this.t("Analysis of Results")}"
            >
              <md-icon slot="icon">insights</md-icon>
              ${this.t("AI-generated analysis")}
            </md-primary-tab>
          </md-tabs>
        </div>
      `:o`
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
      `}render(){return o`<div class="layout vertical">
      ${this.renderNavigationBar()}
      <div class="rightPanel">
        <main>
          <div class="mainPageContainer">${this._renderPage()}</div>
        </main>
      </div>
    </div>

    </div>
      ${this.lastSnackbarText?o`
              <yp-snackbar
                id="snackbar"
                @closed="${this.snackbarclosed}"
                style="text-align: center;"
                .labelText="${this.lastSnackbarText}"
              ></yp-snackbar>
            `:l}

      ${window.aoiAppGlobals.externalGoalTriggerUrl?o`
              <yp-snackbar
                id="goalTriggerSnackbar"
                style="text-align: center;"
                timeoutMs="-1"
                .labelText="${this.t("Target votes reached!")}"
              >
                <md-icon-button slot="dismiss">
                  <md-icon>close</md-icon>
                </md-icon-button>
                <md-text-button
                  slot="action"
                  @click="${this.triggerExternalGoalUrl}"
                  >${this.t("Finish and return")}</md-text-button
                >
              </yp-snackbar>
            `:l}
      `}};ze([t({type:Number})],Re.prototype,"pageIndex",void 0),ze([t({type:Number})],Re.prototype,"totalNumberOfVotes",void 0),ze([t({type:Number})],Re.prototype,"collectionId",void 0),ze([t({type:Object})],Re.prototype,"collection",void 0),ze([t({type:String})],Re.prototype,"lastSnackbarText",void 0),ze([t({type:String})],Re.prototype,"currentError",void 0),ze([t({type:Object})],Re.prototype,"earl",void 0),ze([t({type:Object})],Re.prototype,"question",void 0),ze([t({type:Object})],Re.prototype,"prompt",void 0),ze([t({type:Boolean})],Re.prototype,"isAdmin",void 0),ze([t({type:Boolean})],Re.prototype,"surveyClosed",void 0),ze([t({type:String})],Re.prototype,"appearanceLookup",void 0),ze([t({type:Object})],Re.prototype,"currentLeftAnswer",void 0),ze([t({type:Object})],Re.prototype,"currentRightAnswer",void 0),ze([t({type:Number})],Re.prototype,"currentPromptId",void 0),Re=ze([i("aoi-survey")],Re);export{Re as AoiSurvey};
