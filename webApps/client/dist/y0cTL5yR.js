import{n as t,t as i,Y as e,i as o,x as s,S as n,e as a,T as r,a as d}from"./46CELSu6.js";var l=function(t,i,e,o){for(var s,n=arguments.length,a=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(i,e,a):s(i,e))||a);return n>3&&a&&Object.defineProperty(i,e,a),a};let c=class extends e{constructor(){super(...arguments),this.spinnerActive=!1}static get styles(){return[super.styles,o`
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
    `}_deleteUser(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToDeleteUser"),this._deleteUserFinalWarning.bind(this),!0)}))}_deleteUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouReallySureYouWantToDeleteUser"),this._deleteUserForReal.bind(this),!0)}))}))}_anonymizeUser(){window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouSureYouWantToAnonymizeUser"),this._anonymizeUserFinalWarning.bind(this),!0)}))}_anonymizeUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.t("areYouReallySureYouWantToAnonymizeUser"),this._anonymizeUserForReal.bind(this),!0)}))}))}async _deleteUserForReal(){this.spinnerActive=!0,await window.serverApi.deleteUser(),this.spinnerActive=!1,this._completed()}async _anonymizeUserForReal(){this.spinnerActive=!0,await window.serverApi.anonymizeUser(),this.spinnerActive=!1,this._completed()}open(){this.$$("#dialog").open=!0}_completed(){this.$$("#dialog").open=!1,window.location.href="/"}};l([t({type:Boolean})],c.prototype,"spinnerActive",void 0),c=l([i("yp-user-delete-or-anonymize")],c);var h=function(t,i,e,o){for(var s,n=arguments.length,a=n<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,e):o,r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(i,e,a):s(i,e))||a);return n>3&&a&&Object.defineProperty(i,e,a),a};let m=class extends n{constructor(){super(...arguments),this.notificationText="",this.largerFont=!1}static get styles(){return[super.styles,o`
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
      `]}render(){const t={"mdc-snackbar--stacked":this.stacked,"mdc-snackbar--leading":this.leading};return s` <div
      class="mdc-snackbar ${a(t)}"
      @keydown="${this._handleKeydown}"
    >
      <div class="mdc-snackbar__surface">
        ${this.user?s`
              <yp-user-with-organization
                class="layout horizontal self-end"
                .user="${this.user}"
              ></yp-user-with-organization>
            `:r}
        <div class="layout horizontal">
          <md-icon
            class="icon"
            ?hidden="${!this.icon}"
            .icon="${this.icon}"
          ></md-icon>
          <!-- add larger-font -->
          ${d(this.notificationText,this.open)}
        </div>
        <div class="mdc-snackbar__actions">
          <slot name="action" @click="${this._handleActionClick}"></slot>
          <slot name="dismiss" @click="${this._handleDismissClick}"></slot>
        </div>
      </div>
    </div>`}openDialog(t,i,e,o=void 0,s=void 0,n=void 0){this.notificationText=i,e||(this.user=t),this.icon=o||void 0,this.largerFont=!!n,s&&(this.timeoutMs=s),this.open=!0}};h([t({type:String})],m.prototype,"notificationText",void 0),h([t({type:Object})],m.prototype,"user",void 0),h([t({type:String})],m.prototype,"icon",void 0),h([t({type:Boolean})],m.prototype,"largerFont",void 0),m=h([i("ac-notification-toast")],m);
