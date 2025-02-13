import{n as e,t,a as i,i as o,x as n,b as s,e as r,T as a}from"./Chx57NpW.js";var l=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let d=class extends i{constructor(){super(...arguments),this.spinnerActive=!1}static get styles(){return[super.styles,o`
        md-dialog {
          padding-left: 8px;
          padding-right: 8px;
          max-width: 450px;
        }

        .buttons {
          margin-top: 16px;
          margin-bottom: 4px;
          text-align: center;
        }

        .boldButton {
          font-weight: bold;
        }

        .header {
          font-size: 22px;
          color: var(--md-sys-color-on-error-container);
          background-color: var(--md-sys-color-error-container);
          font-weight: bold;
        }

        @media (max-width: 480px) {
        }

        @media (max-width: 320px) {
        }
      `]}render(){return n`
      <md-dialog id="dialog" modal>
        <div slot="headline" class="header layout horizontal center-center">
          <div>${this.t("deleteOrAnonymizeUser")}</div>
        </div>
        <div slot="content">
        <div class="helpInfo">${this.t("anonymizeUserInfo")}</div>

        <div class="helpInfo">${this.t("deleteUserInfo")}</div>


        </div>

        <div class="buttons layout vertical center-center" slot="actions">
          <div class="layout horizontal ajaxElements">
            <md-circular-progress hidden?="${!this.spinnerActive}" indeterminate></md-circular-progress>
          </div>
          <div class="layout horizontal center-center">
            <md-text-button
              .label="${this.t("cancel")}"
              slot="secondaryAction"
              dialog-dismiss=""></md-text-button>
            <md-text-button
              .label="${this.t("deleteAccount")}"
              raised
              slot="primaryAction"

              class="boldButton"
              @click="${this._deleteUser}"></md-text-button>
            <md-text-button
              .label="${this.t("anonymizeAccount")}"
              slot="primaryAction"
              raised
              class="boldButton"
              @click="${this._anonymizeUser}"></md-text-button>
          </div>
        </div>
      </md-dialog>
    `}_deleteUser(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDeleteUser"),this._deleteUserFinalWarning.bind(this),!0)}))}_deleteUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouReallySureYouWantToDeleteUser"),this._deleteUserForReal.bind(this),!0)}))}))}_anonymizeUser(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToAnonymizeUser"),this._anonymizeUserFinalWarning.bind(this),!0)}))}_anonymizeUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouReallySureYouWantToAnonymizeUser"),this._anonymizeUserForReal.bind(this),!0)}))}))}async _deleteUserForReal(){this.spinnerActive=!0,await window.serverApi.deleteUser(),this.spinnerActive=!1,this._completed()}async _anonymizeUserForReal(){this.spinnerActive=!0,await window.serverApi.anonymizeUser(),this.spinnerActive=!1,this._completed()}open(){this.$$("#dialog").open=!0}_completed(){this.$$("#dialog").open=!1,window.location.href="/"}};l([e({type:Boolean})],d.prototype,"spinnerActive",void 0),d=l([t("yp-user-delete-or-anonymize")],d);var c=function(e,t,i,o){for(var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o,a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r};let p=class extends s{constructor(){super(...arguments),this.largerFont=!1}static get styles(){return[super.styles,o`
        .icon {
          height: 32px;
          width: 32px;
          min-width: 32px;
          min-height: 32px;
        }

        .text[large-font] {
          margin: 8px;
          font-size: 16px;
          margin-left: 12px;
        }
      `]}render(){const e={"larger-font":this.largerFont};return n`
      <div class="${r(e)}">
        ${this.user?n`
              <yp-user-with-organization
                class="user-info"
                .user="${this.user}"
              ></yp-user-with-organization>
            `:a}
        <div class="message-content">
          ${this.icon?n`<md-icon class="icon" .icon="${this.icon}"></md-icon>`:a}
          <span class="message">${this.labelText}</span>
        </div>
        <div class="actions">
          <slot name="action"></slot>
          <slot name="dismiss"></slot>
        </div>
      </div>
    `}openDialog(e,t,i,o=void 0,n=void 0,s=void 0){this.labelText=t,i||(this.user=e),this.icon=o,this.largerFont=!!s,this.timeoutMs=n||5e3,this.open=!0}};c([e({type:Object})],p.prototype,"user",void 0),c([e({type:String})],p.prototype,"icon",void 0),c([e({type:Boolean})],p.prototype,"largerFont",void 0),p=c([t("ac-notification-toast")],p);
