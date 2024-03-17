import{n as t,t as i,Y as e,i as o,x as s,a as n,e as a,T as r}from"./D5jv2R-d.js";var l=function(t,i,e,o){for(var s,n=arguments.length,a=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(i,e,a):s(i,e))||a);return n>3&&a&&Object.defineProperty(i,e,a),a};let d=class extends e{constructor(){super(...arguments),this.spinnerActive=!1}static get styles(){return[super.styles,o`
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
      `]}render(){return s`
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
    `}_deleteUser(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToDeleteUser"),this._deleteUserFinalWarning.bind(this),!0)}))}_deleteUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouReallySureYouWantToDeleteUser"),this._deleteUserForReal.bind(this),!0)}))}))}_anonymizeUser(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToAnonymizeUser"),this._anonymizeUserFinalWarning.bind(this),!0)}))}_anonymizeUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouReallySureYouWantToAnonymizeUser"),this._anonymizeUserForReal.bind(this),!0)}))}))}async _deleteUserForReal(){this.spinnerActive=!0,await window.serverApi.deleteUser(),this.spinnerActive=!1,this._completed()}async _anonymizeUserForReal(){this.spinnerActive=!0,await window.serverApi.anonymizeUser(),this.spinnerActive=!1,this._completed()}open(){this.$$("#dialog").open=!0}_completed(){this.$$("#dialog").open=!1,window.location.href="/"}};l([t({type:Boolean})],d.prototype,"spinnerActive",void 0),d=l([i("yp-user-delete-or-anonymize")],d);var c=function(t,i,e,o){for(var s,n=arguments.length,a=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(i,e,a):s(i,e))||a);return n>3&&a&&Object.defineProperty(i,e,a),a};let h=class extends n{constructor(){super(...arguments),this.largerFont=!1}static get styles(){return[super.styles,o`
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
      `]}render(){const t={"larger-font":this.largerFont};return s`
      <div class="${a(t)}">
        ${this.user?s`
              <yp-user-with-organization
                class="user-info"
                .user="${this.user}"
              ></yp-user-with-organization>
            `:r}
        <div class="message-content">
          ${this.icon?s`<md-icon class="icon" .icon="${this.icon}"></md-icon>`:r}
          <span class="message">${this.labelText}</span>
        </div>
        <div class="actions">
          <slot name="action"></slot>
          <slot name="dismiss"></slot>
        </div>
      </div>
    `}openDialog(t,i,e,o=void 0,s=void 0,n=void 0){this.labelText=i,e||(this.user=t),this.icon=o,this.largerFont=!!n,this.timeoutMs=s||5e3,this.open=!0}};c([t({type:Object})],h.prototype,"user",void 0),c([t({type:String})],h.prototype,"icon",void 0),c([t({type:Boolean})],h.prototype,"largerFont",void 0),h=c([i("ac-notification-toast")],h);
