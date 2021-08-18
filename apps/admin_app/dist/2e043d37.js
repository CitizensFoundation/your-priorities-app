import{_ as t,e as i,n as o,Y as e,i as s,T as a}from"./f69f9111.js";let r,n,d,l,p,c,m,h,g,b,u,f,x,w,y,$,v=t=>t,S=class extends e{constructor(){super(...arguments),this.tablet=!1,this.method="POST",this.doubleWidth=!1,this.opened=!1,this.useNextTabAction=!1,this.uploadingState=!1,this.customSubmit=!1}static get styles(){return[super.styles,s(r||(r=v`
        :host {
          background-color: #fff;
        }

        .fullScreenDialog {
          position: absolute;
          display: block;
          top: 0;
          bottom: 0;
          margin: 0;
          min-width: 360px;
          max-width: 1024px;
          width: 100%;
        }

        [main] {
          background-color: #fff;
        }

        #toolbar {
          background-color: #f00;
          color: var(--text-primary_color);
          max-height: 70px !important;
        }

        #dismissBtn {
          margin-left: 0;
        }

        mwc-button[dialog-confirm] {
          background: none;
          min-width: 44px;
          margin: 6px 0 0 16px;
        }

        mwc-button[disabled] {
          background-color: #fff;
        }

        .title ::slotted(h2) {
          padding-top: 2px;
        }

        mwc-snackbar {
          z-index: 9999;
        }

        #form > * {
          padding: 8px 8px;
        }

        @media (max-width: 1024px) {
          mwc-dialog > * {
            padding: 0 0;
          }

          .fullScreenDialog {
            min-width: 320px;
          }
        }

        @media (max-width: 359px) {
          .fullScreenDialog {
            min-width: 320px;
          }
        }

        mwc-dialog {
          background-color: #fff;
        }

        mwc-header-panel {
          margin-top: 0;
          padding-top: 0 !important;
        }

        app-toolbar {
          margin-top: 0;
          padding-top: 0;
        }

        .popUpDialog {
          --mdc-dialog-min-width: 550px;
        }

        .popUpDialogDouble {
          --mdc-dialog-min-width: 840px;
        }

        #scroller {
          padding: 8px;
        }

        .scrollerContainer {
          height: 100%;
        }

        @media (max-width: 1024px) {
          mwc-dialog > * {
            padding: 0;
            margin: 0;
            background-color: #fff;
          }

          :host {
            max-height: 100% !important;
            height: 100% !important;
          }
        }

        mwc-dialog[tablet] > * {
          padding: 0;
          margin: 0;
          background-color: #fff;
        }

        mwc-dialog[tablet] {
          max-width: 3200px !important;
        }

        .toolbar {
          padding-top: 8px;
        }

        .bigHeader {
          background-color: var(--accent-color);
          color: #fff;
          margin: 0;
          padding: 16px;
          vertical-align: center;
        }

        .largeIcon {
          width: 48px;
          height: 48px;
          margin-left: 8px;
        }

        .smallIcon {
          width: 32px;
          height: 32px;
          padding-right: 8px;
          margin-top: 7px;
          margin-left: 8px;
        }

        .titleHeader {
          font-size: 32px;
          padding-left: 12px;
          padding-top: 14px;
          font-weight: bold;
        }

        .titleHeaderMobile {
          font-size: 20px;
          padding-left: 2px;
          margin-top: 12px;
          font-weight: bold;
        }

        #formErrorDialog {
          padding: 12px;
        }

        .closeIconNarrow {
          width: 48px;
          height: 48px;
          padding-right: 8px;
          margin-left: 0;
          padding-left: 0;
        }

        .smallButtonText {
          font-weight: bold;
          font-size: 17px;
        }

        .outerMobile {
          background-color: #fff;
          padding: 0;
          margin: 0;
        }

        .smallHeader {
          background-color: var(--accent-color);
          color: #fff;
          margin: 0;
          padding: 8px;
          vertical-align: center;
          max-height: 70px !important;
        }

        .actionButtons {
          margin: 8px;
          font-weight: bold;
        }

        @media all and (-ms-high-contrast: none) {
          #scrollable {
            min-height: 350px;
          }
        }

        mwc-dialog[rtl] {
          direction: rtl;
        }

        mwc-dialog,
        mwc-checkbox {
          --mwc-checkbox-label: {
            padding-right: 6px;
          }
        }

        mwc-dialog,
        mwc-radio-button {
          --mwc-radio-button-label: {
            padding-right: 6px;
          }
        }
      `))]}renderMobileView(){return a(n||(n=v`
      <div class="outerMobile">
        <div class="layout horizontal smallHeader">
          <mwc-icon-button
            id="dismissBtn"
            .label="${0}"
            icon="close"
            slot="secondaryAction"
            class="closeIconNarrow"
            dialog-dismiss></mwc-icon-button>
          <mwc-icon class="smallIcon">${0}</mwc-icon>
          <div class="flex"></div>

          ${0}
          ${0}
        </div>
        <div id="scroller">
          <yp-form id="form" method="POST" .params="${0}">
            <form
              name="ypForm"
              .method="${0}"
              .action="${0}">
              <slot></slot>
            </form>
          </yp-form>
        </div>
        <mwc-circular-progress-four-color
          id="spinner"></mwc-circular-progress-four-color>
      </div>
    `),this.t("close"),this.icon,this.useNextTabAction?a(c||(c=v``)):a(d||(d=v`
                ${0}
              `),this.uploadingState?a(p||(p=v`
                      <mwc-button
                        disabled
                        slot="primaryAction"
                        .label="${0}"></mwc-button>
                    `),this.t("uploading.inProgress")):a(l||(l=v`
                      <mwc-button
                        id="submit1"
                        ?hidden="${0}"
                        @click="${0}"
                        slot="primaryAction"
                        .label="${0}"
                        class="smallButtonText"></mwc-button>
                    `),!this.saveText,this._submit,this.saveText?this.saveText:"")),this.useNextTabAction?a(m||(m=v``)):a(h||(h=v`
                <mwc-button
                  @click="${0}"
                  slot="primaryAction"
                  class="smallButtonText"
                  .label="${0}"></mwc-button>
              `),this._nextTab,this.nextActionText),this.params,this.method,this.action?this.action:"")}renderDesktopView(){return a(g||(g=v`
      <div
        id="scrollable"
        .smallHeight="${0}"
        .mediumHeight="${0}"
        .largeHeight="${0}">
        <yp-form id="form" .params="${0}">
          <form
            name="ypForm"
            .method="${0}"
            .action="${0}">
            <slot></slot>
          </form>
        </yp-form>
        <mwc-circular-progress-four-color
          id="spinner"></mwc-circular-progress-four-color>
      </div>
      ${0}
        ${0}
    `),!this.wide,!this.wide,this.wide,this.params,this.method,this.action,this.cancelText?a(b||(b=v`
              <mwc-button
                id="dismissBtn"
                dialogAction="cancel"
                slot="secondaryAction"
                .label="${0}"></mwc-button>
            `),this.cancelText):a(u||(u=v`
              <mwc-button
                id="dismissBtn"
                dialogAction="cancel"
                slot="secondaryAction"
                .label="${0}"></mwc-button>
            `),this.t("cancel")),this.uploadingState?a(y||(y=v`
            <mwc-button
              disabled
              @click="${0}"
              slot="primaryAction"
              .label="${0}"></mwc-button>
          </div>
          `),this._nextTab,this.t("uploading.inProgress")):a(f||(f=v`
              ${0}
            `),this.useNextTabAction?a(w||(w=v`
                    <mwc-button
                      raised
                      slot="primaryAction"
                      class="actionButtons"
                      @click="${0}"
                      .label="${0}"></mwc-button>
                  `),this._nextTab,this.nextActionText):a(x||(x=v`
                    <mwc-button
                      raised
                      class="actionButtons"
                      slot="primaryAction"
                      ?hidden="${0}"
                      id="submit2"
                      @click="${0}"
                      .label="${0}"></mwc-button>
                  `),!this.saveText,this._submit,this.saveText?this.saveText:"")))}render(){return a($||($=v`
      <mwc-dialog
        ?open="${0}"
        ?rtl="${0}"
        @closed="${0}"
        .name="${0}"
        .heading="${0}"
        id="editDialog"
        class="${0}"
        with-backdrop="${0}"
        modal>
        ${0}
      </mwc-dialog>

      <mwc-dialog id="formErrorDialog" modal>
        <div id="errorText">${0}</div>
        <div class="buttons">
          <mwc-button
            slot="primaryAction"
            autofocus
            @click="${0}"
            .label="${0}"></mwc-button>
        </div>
      </mwc-dialog>
      <mwc-snackbar
        id="snackbar"
        .labelText="${0}"></mwc-snackbar>
    `),this.opened,this.rtl,this.close,this.name,this.heading,this.computeClass,!this.wide,this.narrow?this.renderMobileView():this.renderDesktopView(),this.errorText,this._clearErrorText,this.t("ok"),this.snackbarTextCombined)}get narrow(){return!this.wide||this.tablet}scrollResize(){}updated(t){super.updated(t),t.has("opened")}_fileUploadStarting(){this.uploadingState=!0}_fileUploadComplete(){this.uploadingState=!1}_nextTab(){this.fire("next-tab-action")}get computeClass(){return this.narrow?"fullScreenDialog":this.doubleWidth?"popUpDialogDouble":"popUpDialog"}connectedCallback(){super.connectedCallback(),this.addListener("yp-form-submit",this._formSubmitted),this.addListener("yp-form-response",this._formResponse),this.addListener("yp-form-error",this._formError),this.addListener("yp-form-invalid",this._formInvalid),this.addListener("file-upload-starting",this._fileUploadStarting),this.addListener("file-upload-complete",this._fileUploadComplete),this.baseAction=this.action,/iPad/.test(navigator.userAgent)||/Android/.test(navigator.userAgent)&&!/Mobile/.test(navigator.userAgent)?this.tablet=!0:this.tablet=!1}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-form-submit",this._formSubmitted),this.removeListener("yp-form-response",this._formResponse),this.removeListener("yp-form-error",this._formError),this.removeListener("yp-form-invalid",this._formInvalid),this.removeListener("file-upload-starting",this._fileUploadStarting),this.removeListener("file-upload-complete",this._fileUploadComplete)}open(){this.opened=!0}close(){this.opened=!1}_formSubmitted(){}_formResponse(t){this._setSubmitDisabledStatus(!1),this.$$("#spinner").hidden=!0;const i=t.detail;i&&i.isError?console.log("There is an error in form handled by user"):(this.response=i,this.close(),i&&i.name?this.snackbarTextCombined=this.snackbarText+" "+i.name:this.snackbarTextCombined=this.snackbarText,this.$$("#snackbar").open=!0)}_formError(t){this._setSubmitDisabledStatus(!1),console.log("Form error: ",t.detail.error),this._showErrorDialog(t.detail.error),this.$$("#spinner").hidden=!1}_formInvalid(){this._setSubmitDisabledStatus(!1),this.$$("#spinner").hidden=!1}_submit(){this.customSubmit?this.fire("yp-custom-form-submit"):this.confirmationText?window.appDialogs.getDialogAsync("confirmationDialog",(t=>{t.open(this.confirmationText,this._reallySubmit.bind(this))})):this._reallySubmit()}_setSubmitDisabledStatus(t){const i=this.$$("#submit1"),o=this.$$("#submit2");i&&(i.disabled=t),o&&(o.disabled=t)}async _reallySubmit(){this._setSubmitDisabledStatus(!0),this.params&&this.params.communityId?this.action=this.baseAction+"/"+this.params.communityId:this.params&&this.params.groupId?this.action=this.baseAction+"/"+this.params.groupId:this.params&&this.params.organizationId?this.action=this.baseAction+"/"+this.params.organizationId:this.params&&this.params.userImages&&this.params.postId?this.action=this.baseAction+"/"+this.params.postId+"/user_images":this.params&&this.params.statusChange&&this.params.postId?this.action=this.baseAction+"/"+this.params.postId+"/status_change":this.params&&this.params.postId&&this.params.imageId?this.action=this.baseAction+"/"+this.params.postId+"/"+this.params.imageId+"/user_images":this.params&&this.params.postId?this.action=this.baseAction+"/"+this.params.postId:this.params&&this.params.userId?this.action=this.baseAction+"/"+this.params.userId:this.params&&this.params.domainId?this.action=this.baseAction+"/"+this.params.domainId:this.params&&this.params.categoryId&&(this.action=this.baseAction+"/"+this.params.categoryId),await this.requestUpdate();const t=this.$$("#form");if(t.validate())t.submit(),this.$$("#spinner").hidden=!1;else{this.fire("yp-form-invalid");const t=this.t("form.invalid");this._showErrorDialog(t)}}submitForce(){this.$$("#form").submit(),this.$$("#spinner").hidden=!1}getForm(){return this.$$("#form")}stopSpinner(){this.$$("#spinner").hidden=!0}validate(){this.$$("#form").validate()}_showErrorDialog(t){this.errorText=t,this.$$("#formErrorDialog").open=!0}_clearErrorText(){this.$$("#formErrorDialog").open=!1,this.errorText=void 0}};t([i({type:String})],S.prototype,"action",void 0),t([i({type:Boolean})],S.prototype,"tablet",void 0),t([i({type:String})],S.prototype,"baseAction",void 0),t([i({type:String})],S.prototype,"cancelText",void 0),t([i({type:String})],S.prototype,"buttonText",void 0),t([i({type:String})],S.prototype,"method",void 0),t([i({type:String})],S.prototype,"errorText",void 0),t([i({type:String})],S.prototype,"snackbarText",void 0),t([i({type:String})],S.prototype,"snackbarTextCombined",void 0),t([i({type:String})],S.prototype,"saveText",void 0),t([i({type:Object})],S.prototype,"response",void 0),t([i({type:Object})],S.prototype,"params",void 0),t([i({type:Boolean})],S.prototype,"doubleWidth",void 0),t([i({type:String})],S.prototype,"icon",void 0),t([i({type:Boolean})],S.prototype,"opened",void 0),t([i({type:Boolean})],S.prototype,"useNextTabAction",void 0),t([i({type:String})],S.prototype,"nextActionText",void 0),t([i({type:Boolean})],S.prototype,"uploadingState",void 0),t([i({type:String})],S.prototype,"confirmationText",void 0),t([i({type:String})],S.prototype,"heading",void 0),t([i({type:String})],S.prototype,"name",void 0),t([i({type:Boolean})],S.prototype,"customSubmit",void 0),S=t([o("yp-edit-dialog")],S);
