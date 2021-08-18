import{_ as e,e as t,n as i,Y as o,i as n,T as s,A as a,j as r,S as d,k as l,l as c}from"./f69f9111.js";import{Y as h}from"./7b062c34.js";import{m}from"./ec134414.js";let p,u,g,f,y=e=>e,v=class extends o{static get prssoperties(){return{setting:{type:Object,notify:!0,observer:"_settingChanged"},frequency:{type:Number,notify:!0,observer:"_frequencyChanged"},method:{type:Number,notify:!0,observer:"_methodChanged"}}}updated(e){super.updated(e),e.has("setting")&&this._settingChanged()}static get styles(){return[super.styles,n(p||(p=y`
        .half {
          width: 50%;
        }

        .notificationName {
          padding-top: 16px;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          padding-bottom: 4px;
          color: #333;
          border-bottom: solid 1px #ddd;
        }

        .notificationSub {
          color: #888;
        }

        mwc-radio {
          padding-top: 8px;
          padding-bottom: 8px;
        }
      `))]}render(){return s(u||(u=y`
      <div class="layout vertical">
        <div class="notificationName">${0}</div>
        <div class="layout horizontal wrap">
          <div class="layout vertical half">
            <div class="notificationSub">${0}</div>
            <div class="layout horizontal">
              <div id="notificationMethodGroup" name="method" class="method">
                ${0}
              </div>
            </div>
          </div>
          <div class="layout vertical half">
            <div class="notificationSub">
              ${0}
            </div>
            <div class="layout horizontal">
              <div id="notificationFrequencyGroup" class="frequency">
                ${0}
              </div>
            </div>
          </div>
        </div>
      </div>
    `),this.name,this.t("notification.method"),this.availableMethods.map((e=>s(g||(g=y`
                    <mwc-formfield .label="${0}">
                      <mwc-radio
                        name="method"
                        @change="${0}"
                        .value="${0}"
                        ?checked="${0}">
                      </mwc-radio>
                    </mwc-formfield>
                  `),e.name,this._methodChanged,e.enumValue.toString(),e.enumValue==this.method))),this.t("notification.frequency"),this.availableFrequencies.map((e=>s(f||(f=y`
                    <mwc-formfield .label="${0}">
                      <mwc-radio
                        name="frequency"
                        ?disabled="${0}"
                        @change="${0}"
                        .value="${0}"
                        ?checked="${0}">
                      </mwc-radio>
                    </mwc-formfield>
                  `),e.name,this._isDelayed(e),this._frequencyChanged,e.enumValue.toString(),e.enumValue==this.frequency))))}get availableMethods(){return this.language?[{name:this.t("notification.muted"),enumValue:0},{name:this.t("notification.browser"),enumValue:1},{name:this.t("notification.email"),enumValue:2}]:[]}_methodChanged(e){let t=e.target.value;t=parseInt(t),t&&this.method!=t&&(this.method=t,this.fire("yp-notification-changed")),this.method&&(this.setting.method=this.method)}_frequencyChanged(e){let t=e.target.value;t=parseInt(t),t&&this.frequency!=t&&(this.frequency=t,this.fire("yp-notification-changed")),this.frequency&&(this.setting.frequency=this.frequency)}_settingChanged(){this.setting&&(this.method=this.setting.method,this.frequency=this.setting.frequency)}_isDelayed(e){return e.enumValue>0}get availableFrequencies(){let e=[];return this.language&&this.method&&0!=this.method&&(1==this.method?(this.frequency=0,e=[{name:this.t("notification.asItHappens"),enumValue:0}]):2==this.method&&(e=[{name:this.t("notification.asItHappens"),enumValue:0},{name:this.t("notification.hourly"),enumValue:1},{name:this.t("notification.daily"),enumValue:2},{name:this.t("notification.weekly"),enumValue:3},{name:this.t("notification.monthly"),enumValue:5}])),e}};e([t({type:String})],v.prototype,"name",void 0),e([t({type:Object})],v.prototype,"setting",void 0),e([t({type:Number})],v.prototype,"frequency",void 0),e([t({type:Number})],v.prototype,"method",void 0),v=e([i("ac-notification-selection")],v);let b,$=e=>e,w=class extends o{render(){return s(b||(b=$`
      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>

      <ac-notification-selection
        .name="${0}"
        .setting="${0}">
      </ac-notification-selection>
    `),this.t("notification.myPosts"),this.notificationsSettings.my_posts,this.t("notification.myPostsEndorsements"),this.notificationsSettings.my_posts_endorsements,this.t("notification.myPoints"),this.notificationsSettings.my_points,this.t("notification.myPointEndorsements"),this.notificationsSettings.my_points_endorsements,this.t("notification.allCommunity"),this.notificationsSettings.all_community,this.t("notification.allGroup"),this.notificationsSettings.all_group)}connectedCallback(){super.connectedCallback(),this.addListener("yp-notification-changed",this._settingsChanged.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-notification-changed",this._settingsChanged.bind(this))}_settingsChanged(){this.fire("yp-notifications-changed",this.notificationsSettings)}};e([t({type:Object})],w.prototype,"notificationsSettings",void 0),w=e([i("ac-notification-settings")],w);let x,_,k=e=>e,I=class extends h{constructor(){super(...arguments),this.action="/users",this.selected=0}updated(e){super.updated(e),e.has("user")&&this._userChanged(),e.has("notificationSettings")&&this._notificationSettingsChanged()}static get styles(){return[super.styles,n(x||(x=k`
        .container {
          height: 100%;
          min-height: 350px;
        }

        .additionalSettings {
          margin-top: 16px;
        }

        .icon {
          padding-right: 8px;
        }

        h2 {
          padding-top: 16px;
        }

        #deleteUser {
          max-width: 250px;
          margin-top: 16px;
          color: #f00;
        }

        .disconnectButtons {
          margin-top: 8px;
          max-width: 250px;
        }

        yp-language-selector {
          margin-bottom: 8px;
        }

        mwc-button {
          text-align: center;
        }

        .ssn {
          margin-top: 0;
          margin-bottom: 4px;
          font-weight: 400;
        }
      `))]}render(){return this.user?s(_||(_=k`
          <yp-edit-dialog
            name="userEdit"
            id="editDialog"
            .title="${0}"
            doubleWidth
            icon="face"
            .action="${0}"
            @iron-form-response="${0}"
            method="${0}"
            .params="${0}"
            .saveText="${0}"
            .snackbarText="${0}">
            <div class="container">
              <div class="layout vertical wrap container">
                <mwc-textfield
                  id="name"
                  name="name"
                  type="text"
                  .label="${0}"
                  .value="${0}"
                  maxlength="50"
                  char-counter>
                </mwc-textfield>

                <div class="ssn" ?hidden="${0}">
                  ${0}: ${0}
                </div>

                <mwc-textfield
                  id="email"
                  name="email"
                  type="text"
                  .label="${0}"
                  .value="${0}">
                </mwc-textfield>

                <div class="layout horizontal wrap">
                  <div class="layout vertical additionalSettings">
                    <yp-file-upload
                      id="profileImageUpload"
                      raised
                      target="/api/images?itemType=user-profile"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${0}"
                      @success="${0}">
                    </yp-file-upload>
                  </div>

                  <div class="layout vertical additionalSettings" hidden="">
                    <yp-file-upload
                      id="headerImageUpload"
                      raised
                      target="/api/images?itemType=user-header"
                      method="POST"
                      buttonIcon="photo_camera"
                      .buttonText="${0}"
                      @success="${0}">
                    </yp-file-upload>
                  </div>
                </div>

                <yp-language-selector
                  name="defaultLocale"
                  auto-translate-option-disabled=""
                  .selectedLocale="${0}"></yp-language-selector>

                <mwc-button
                  ?hidden="${0}"
                  class="disconnectButtons"
                  raised
                  .label="${0}"
                  @click="${0}"></mwc-button>

                <mwc-button
                  ?hidden="${0}"
                  raised
                  .label="${0}"
                  class="disconnectButtons"
                  @click="${0}"></mwc-button>

                <mwc-button
                  id="deleteUser"
                  raised
                  .label="${0}"
                  @click="${0}"></mwc-button>

                <input
                  type="hidden"
                  name="uploadedProfileImageId"
                  .value="${0}" />

                <input
                  type="hidden"
                  name="uploadedHeaderImageId"
                  .value="${0}" />

                <h2>${0}</h2>

                <ac-notification-settings
                  .notificationsSettings="${0}"></ac-notification-settings>

                <input
                  type="hidden"
                  name="notifications_settings"
                  .value="${0}" />
              </div>
            </div>
          </yp-edit-dialog>
        `),this.editHeaderText,this.action,this._editResponse,this.method,this.params,this.saveText,this.snackbarText||"",this.t("Name"),this.user.name,!this.user.ssn,this.t("ssn"),this.user.ssn,this.t("Email"),this.user.email||"",this.t("image.profile.upload"),this._profileImageUploaded,this.t("image.header.upload"),this._headerImageUploaded,this.user.default_locale,!this.user.facebook_id,this.t("disconnectFromFacebookLogin"),this._disconnectFromFacebookLogin,!this.user.ssn,this.t("disconnectFromSamlLogin"),this._disconnectFromSamlLogin,this.t("deleteOrAnonymizeUser"),this._deleteOrAnonymizeUser,this.uploadedProfileImageId,this.uploadedHeaderImageId,this.t("user.notifications"),this.notificationSettings,this.encodedUserNotificationSettings||""):a}connectedCallback(){super.connectedCallback(),this.addListener("yp-notifications-changed",this._setNotificationSettings.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-notifications-changed",this._setNotificationSettings.bind(this))}_editResponse(e){e.detail.response.duplicateEmail&&this.fire("yp-error",this.t("emailAlreadyRegisterred"))}_checkIfValidEmail(){return this.user&&this.user.email&&!(this.user.email.indexOf("@citizens.is")>-1&&this.user.email.indexOf("anonymous")>-1)}_disconnectFromFacebookLogin(){this._checkIfValidEmail()?window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDisconnectFacebookLogin"),this._reallyDisconnectFromFacebookLogin.bind(this),!0)})):this.fire("yp-error",this.t("cantDisconnectFromFacebookWithoutValidEmail"))}async _reallyDisconnectFromFacebookLogin(){await window.serverApi.disconnectFacebookLogin(),this.user.facebook_id=void 0,window.appGlobals.notifyUserViaToast(this.t("disconnectedFacebookLoginFor")+" "+this.user.email)}_disconnectFromSamlLogin(){this._checkIfValidEmail()?window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDisconnectSamlLogin"),this._reallyDisconnectFromSamlLogin.bind(this),!0)})):this.fire("yp-error",this.t("cantDisconnectFromSamlWithoutValidEmail"))}async _reallyDisconnectFromSamlLogin(){await window.serverApi.disconnectSamlLogin(),this.user&&(this.user.ssn=void 0),window.appGlobals.notifyUserViaToast(this.t("disconnectedSamlLoginFor")+" "+this.user.email)}_setNotificationSettings(e){this.notificationSettings=e.detail,this.encodedUserNotificationSettings=this._encodeNotificationsSettings(this.notificationSettings)}_notificationSettingsChanged(){this.notificationSettings&&(this.encodedUserNotificationSettings=this._encodeNotificationsSettings(this.notificationSettings))}_encodeNotificationsSettings(e){return e?JSON.stringify(e):void 0}_userChanged(){this.user&&(this.notificationSettings=this.user.notifications_settings)}_profileImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedProfileImageId=t.id}_headerImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedHeaderImageId=t.id}customRedirect(){window.appUser.checkLogin()}clear(){this.user={name:"",email:""},this.uploadedProfileImageId=void 0,this.uploadedHeaderImageId=void 0,this.$$("#headerImageUpload").clear(),this.$$("#profileImageUpload").clear()}setup(e,t,i,o=!1){this.user=e,this.new=t,this.refreshFunction=i,o&&(this.selected=1),this.setupTranslation()}setupTranslation(){this.new?(this.editHeaderText=this.t("user.new"),this.snackbarText=this.t("userToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("user.edit"),this.snackbarText=this.t("userToastUpdated"))}_deleteOrAnonymizeUser(){window.appDialogs.getDialogAsync("userDeleteOrAnonymize",(e=>{e.open()}))}};e([t({type:String})],I.prototype,"action",void 0),e([t({type:Object})],I.prototype,"user",void 0),e([t({type:Number})],I.prototype,"selected",void 0),e([t({type:String})],I.prototype,"encodedUserNotificationSettings",void 0),e([t({type:Number})],I.prototype,"uploadedProfileImageId",void 0),e([t({type:Number})],I.prototype,"uploadedHeaderImageId",void 0),e([t({type:Object})],I.prototype,"notificationSettings",void 0),I=e([i("yp-user-edit")],I);let U,z,S=e=>e,F=class extends o{constructor(){super(...arguments),this.spinnerActive=!1}static get styles(){return[super.styles,n(U||(U=S`
        mwc-dialog {
          padding-left: 8px;
          padding-right: 8px;
          background-color: #fff;
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
          color: #f00;
          font-weight: bold;
        }

        @media (max-width: 480px) {
        }

        @media (max-width: 320px) {
        }
      `))]}render(){return s(z||(z=S`
      <mwc-dialog id="dialog" modal>
        <div class="header layout horizontal center-center">
          <div>${0}</div>
        </div>

        <div class="helpInfo">${0}</div>

        <div class="helpInfo">${0}</div>

        <div class="buttons layout vertical center-center">
          <div class="layout horizontal ajaxElements">
            <mwc-circular-progress-four-color hidden?="${0}"></mwc-circular-progress-four-color>
          </div>
          <div class="layout horizontal center-center">
            <mwc-button
              .label="${0}"
              slot="secondaryAction"
              dialog-dismiss=""></mwc-button>
            <mwc-button
              .label="${0}"
              raised
              slot="primaryAction"

              class="boldButton"
              @click="${0}"></mwc-button>
            <mwc-button
              .label="${0}"
              slot="primaryAction"
              raised
              class="boldButton"
              @click="${0}"></mwc-button>
          </div>
        </div>
      </mwc-dialog>
    `),this.t("deleteOrAnonymizeUser"),this.t("anonymizeUserInfo"),this.t("deleteUserInfo"),!this.spinnerActive,this.t("cancel"),this.t("deleteAccount"),this._deleteUser,this.t("anonymizeAccount"),this._anonymizeUser)}_deleteUser(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToDeleteUser"),this._deleteUserFinalWarning.bind(this),!0)}))}_deleteUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouReallySureYouWantToDeleteUser"),this._deleteUserForReal.bind(this),!0)}))}))}_anonymizeUser(){window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouSureYouWantToAnonymizeUser"),this._anonymizeUserFinalWarning.bind(this),!0)}))}_anonymizeUserFinalWarning(){setTimeout((()=>{window.appDialogs.getDialogAsync("confirmationDialog",(e=>{e.open(this.t("areYouReallySureYouWantToAnonymizeUser"),this._anonymizeUserForReal.bind(this),!0)}))}))}async _deleteUserForReal(){this.spinnerActive=!0,await window.serverApi.deleteUser(),this.spinnerActive=!1,this._completed()}async _anonymizeUserForReal(){this.spinnerActive=!0,await window.serverApi.anonymizeUser(),this.spinnerActive=!1,this._completed()}open(){this.$$("#dialog").open=!0}_completed(){this.$$("#dialog").open=!1,window.location.href="/"}};e([t({type:Boolean})],F.prototype,"spinnerActive",void 0),F=e([i("yp-user-delete-or-anonymize")],F);let T,D,C=e=>e,A=class extends o{constructor(){super(...arguments),this.useFinalWarning=!1,this.haveIssuedFinalWarning=!1,this.hideCancel=!1}static get styles(){return[n(T||(T=C`
        mwc-dialog {
          background-color: #fff;
        }
      `))]}render(){return s(D||(D=C`
      <mwc-dialog id="confirmationDialog">
        <div>${0}</div>
        <mwc-button
          ?hidden="${0}"
          @click="${0}"
          slot="secondaryAction"
          .label="${0}"></mwc-button>
        <mwc-button
          @click="${0}"
          slot="primaryAction"
          .label="${0}"></mwc-button>
      </mwc-dialog>
    `),this.confirmationText,this.hideCancel,this._reset,this.t("cancel"),this._confirm,this.t("confirm"))}_reset(){this.confirmationText=void 0,this.onConfirmedFunction=void 0,this.haveIssuedFinalWarning=!1,this.useFinalWarning=!1,this.hideCancel=!1}open(e,t,i=!1,o=!1,n=!1){this.confirmationText=e,this.onConfirmedFunction=t,this.$$("#confirmationDialog").open=!0,this.useFinalWarning=!!o,this.haveIssuedFinalWarning=!1,this.hideCancel=!!n}_confirm(){this.useFinalWarning&&!this.haveIssuedFinalWarning?(this.haveIssuedFinalWarning=!0,this.$$("#confirmationDialog").open=!1,this.confirmationText=this.t("finalDeleteWarning"),setTimeout((()=>{this.$$("#confirmationDialog").open=!0}))):this.onConfirmedFunction&&(this.onConfirmedFunction(),this._reset())}};e([t({type:String})],A.prototype,"confirmationText",void 0),e([t({type:Object})],A.prototype,"onConfirmedFunction",void 0),e([t({type:Boolean})],A.prototype,"useFinalWarning",void 0),e([t({type:Boolean})],A.prototype,"haveIssuedFinalWarning",void 0),e([t({type:Boolean})],A.prototype,"hideCancel",void 0),A=e([i("yp-confirmation-dialog")],A);let O,L,N,W,V,q,P,B=e=>e,j=class extends o{constructor(){super(...arguments),this.veryLarge=!1,this.large=!1,this.noDefault=!1,this.noProfileImage=!1}static get styles(){return[super.styles,n(O||(O=B`
        yp-image {
          display: block;
          vertical-align: text-top;
          height: 48px;
          width: 48px;
        }

        .small {
          height: 30px;
          width: 30px;
          background-color: var(--primary-color-lighter, #434343);
        }

        .large {
          height: 90px;
          width: 90px;
          background-color: var(--primary-color-lighter, #434343);
        }

        .veryLarge {
          height: 200px;
          width: 200px;
          background-color: var(--primary-color-lighter, #434343);
        }

        .medium {
          height: 48px;
          width: 48px;
          background-color: var(--primary-color-lighter, #434343);
        }

        .rounded {
          -webkit-border-radius: 25px;
          -moz-border-radius: 25px;
          border-radius: 25px;
          display: block;
          -webkit-transform-style: preserve-3d;
        }

        .rounded-more {
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          border-radius: 50px;
          display: block;
          vertical-align: top;
          align: top;
          -webkit-transform-style: preserve-3d;
        }

        .rounded-even-more {
          -webkit-border-radius: 115px;
          -moz-border-radius: 125px;
          border-radius: 125px;
          display: block;
          vertical-align: top;
          align: top;
          -webkit-transform-style: preserve-3d;
        }

        .rounded img {
          opacity: 0;
        }

        .rounded-more img {
          opacity: 0;
        }
      `))]}render(){return s(L||(L=B`
      ${0}
    `),this.user&&!this.noProfileImage?s(N||(N=B`
            ${0}
            ${0}
          `),this.profileImageUrl?s(W||(W=B`
                  <yp-image
                    sizing="cover"
                    .alt="${0}"
                    .title="${0}"
                    preload
                    src="${0}"
                    class="${0}"></yp-image>
                `),this.userTitle,this.userTitle,this.profileImageUrl,this.computeClass):a,this.profileImageUrl?a:s(V||(V=B`
                  ${0}
                  ${0}
                `),this.user.facebook_id?s(q||(q=B`
                        <yp-image
                          sizing="cover"
                          ?hidden="${0}"
                          .alt="${0}"
                          .title="${0}"
                          preload
                          .src="${0}"
                          class="${0}"></yp-image>
                      `),this.profileImageUrl,this.userTitle,this.userTitle,this.computeFacebookSrc,this.computeClass):a,this.user.facebook_id?a:s(P||(P=B`
                        <yp-image
                          sizing="cover"
                          .title="${0}"
                          .alt="${0}"
                          preload
                          src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png"
                          class="${0}"></yp-image>
                      `),this.userTitle,this.userTitle,this.computeClass))):a)}get userTitle(){return this.user?this.titleFromUser?this.titleFromUser:this.user.name:""}get profileImageUrl(){if(this.user&&this.user.UserProfileImages&&this.user.UserProfileImages.length>0){const e=r.getImageFormatUrl(this.user.UserProfileImages,0);return e&&""!==e?(this.noProfileImage=!1,e):(this.noProfileImage=!0,null)}return this.noProfileImage=!0,null}get computeClass(){return this.large||this.veryLarge?this.large?"large rounded-more":this.veryLarge?"veryLarge rounded-even-more":"medium rounded":"small rounded"}get computeFacebookSrc(){return this.user&&this.user.facebook_id?"https://graph.facebook.com/"+this.user.facebook_id+"/picture":void 0}};e([t({type:Boolean})],j.prototype,"veryLarge",void 0),e([t({type:Boolean})],j.prototype,"large",void 0),e([t({type:String})],j.prototype,"titleFromUser",void 0),e([t({type:Object})],j.prototype,"user",void 0),e([t({type:Boolean})],j.prototype,"noDefault",void 0),e([t({type:Boolean})],j.prototype,"noProfileImage",void 0),j=e([i("yp-user-image")],j);let Y,E,H,R,G=e=>e,J=class extends o{constructor(){super(...arguments),this.hideImage=!1,this.inverted=!1}static get styles(){return[super.styles,n(Y||(Y=G`
        yp-user-image {
          padding-right: 16px;
        }

        .name {
          padding-top: 4px;
          font-weight: bold;
          text-align: left;
          padding-right: 16px;
        }

        .name[inverted] {
          color: var(--ak-user-name-color, #444);
        }

        .orgImage {
          margin-left: 8px;
          width: 48px;
          min-width: 48px;
          height: 48px;
        }

        .rousnded {
          -webkit-border-radius: 25px;
          -moz-border-radius: 25px;
          border-radius: 25px;
          display: block;
        }

        .organizationName {
          color: #eee;
          text-align: left;
        }

        .organizationName[inverted] {
          color: #676767;
        }

        @media (max-width: 600px) {
          .orgImage {
            margin-right: 8px;
            margin-left: 4px;
          }
        }

        [hidden] {
          display: none !important;
        }

        .mainArea {
          padding-right: 8px;
        }
      `))]}render(){return s(E||(E=G`
      ${0}
    `),this.user?s(H||(H=G`
            <div class="layout horizontal mainArea" .title="${0}">
              <yp-user-image
                .titlefromuser="${0}"
                .user="${0}"
                ?hidden="${0}"></yp-user-image>
              <div class="layout vertical">
                <div class="name" .inverted="${0}">
                  ${0}
                </div>
                <div
                  class="organizationName"
                  .inverted="${0}"
                  ?hidden="${0}">
                  ${0}
                </div>
              </div>

              ${0}
            </div>
          `),this.userTitle,this.userTitle,this.user,this.hideImage,this.inverted,this.user.name,this.inverted,!this.organizationName,this.organizationName,this.organizationImageUrl&&this.organizationName?s(R||(R=G`
                    <img
                      width="48"
                      height="48"
                      .alt="${0}"
                      sizing="cover"
                      ?hidden="${0}"
                      class="orgImage"
                      src="${0}" />
                  `),this.organizationName,this.hideImage,this.organizationImageUrl):a):a)}get userTitle(){return this.user&&this.titleDate?this.user.name+" "+m(this.titleDate).fromNow():""}get organizationName(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].name?this.user.OrganizationUsers[0].name:null}get organizationImageUrl(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages&&this.user.OrganizationUsers[0].OrganizationLogoImages.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages[0].formats?r.getImageFormatUrl(this.user.OrganizationUsers[0].OrganizationLogoImages,2):void 0}};e([t({type:Object})],J.prototype,"user",void 0),e([t({type:Object})],J.prototype,"titleDate",void 0),e([t({type:Boolean})],J.prototype,"hideImage",void 0),e([t({type:Boolean})],J.prototype,"inverted",void 0),J=e([i("yp-user-with-organization")],J);let M,K,Q=e=>e,X=class extends d{constructor(){super(...arguments),this.notificationText=""}renderTwo(){const e={"mdc-snackbar--stacked":this.stacked,"mdc-snackbar--leading":this.leading};return s(M||(M=Q` <div
      class="mdc-snackbar ${0}"
      @keydown="${0}">
      <div class="mdc-snackbar__surface">
        ${0}
        ${0}
        <div class="mdc-snackbar__actions">
          <slot name="action" @click="${0}"></slot>
          <slot name="dismiss" @click="${0}"></slot>
        </div>
      </div>
    </div>`),l(e),this._keyDown,this.user?s(K||(K=Q`
              <yp-user-with-organization
                class="layout horizontal self-end"
                .user="${0}"></yp-user-with-organization>
            `),this.user):a,c(this.notificationText,this.open),this._close,this._dismiss)}_keyDown(e){this.mdcFoundation.handleKeyDown(e)}_close(e){this.mdcFoundation.handleActionButtonClick(e)}_dismiss(e){this.mdcFoundation.handleActionButtonClick(e)}openDialog(e,t,i){this.notificationText=t,i||(this.user=e),this.open=!0}};e([t({type:String})],X.prototype,"notificationText",void 0),e([t({type:Object})],X.prototype,"user",void 0),X=e([i("ac-notification-toast")],X);
