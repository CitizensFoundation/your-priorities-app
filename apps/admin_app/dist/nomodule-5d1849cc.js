System.register(["./nomodule-0e20d20b.js","./nomodule-8ceccb0a.js","./nomodule-a47fc2cb.js","./nomodule-353504fe.js"],(function(n,t){var e,i,o,a,r,s,c,u,l,d,h,p,m,f,g,y,v,b,k,w,x,_,I,S,U,z,F,T,D,C,A,O,L,N,W,P,V,q,B,j,Y,$,E,R,H,G,J,M,K,Q,X,Z,nn,tn;function en(){var n=c(['\n              <yp-user-with-organization\n                class="layout horizontal self-end"\n                .user="','"></yp-user-with-organization>\n            ']);return en=function(){return n},n}function on(){var n=c([' <div\n      class="mdc-snackbar ','"\n      @keydown="','">\n      <div class="mdc-snackbar__surface">\n        ',"\n        ",'\n        <div class="mdc-snackbar__actions">\n          <slot name="action" @click="','"></slot>\n          <slot name="dismiss" @click="','"></slot>\n        </div>\n      </div>\n    </div>']);return on=function(){return n},n}function an(){var n=c(["\n        yp-user-image {\n          padding-right: 16px;\n        }\n\n        .name {\n          padding-top: 4px;\n          font-weight: bold;\n          text-align: left;\n          padding-right: 16px;\n        }\n\n        .name[inverted] {\n          color: var(--ak-user-name-color, #444);\n        }\n\n        .orgImage {\n          margin-left: 8px;\n          width: 48px;\n          min-width: 48px;\n          height: 48px;\n        }\n\n        .rousnded {\n          -webkit-border-radius: 25px;\n          -moz-border-radius: 25px;\n          border-radius: 25px;\n          display: block;\n        }\n\n        .organizationName {\n          color: #eee;\n          text-align: left;\n        }\n\n        .organizationName[inverted] {\n          color: #676767;\n        }\n\n        @media (max-width: 600px) {\n          .orgImage {\n            margin-right: 8px;\n            margin-left: 4px;\n          }\n        }\n\n        [hidden] {\n          display: none !important;\n        }\n\n        .mainArea {\n          padding-right: 8px;\n        }\n      "]);return an=function(){return n},n}function rn(){var n=c(['\n                    <img\n                      width="48"\n                      height="48"\n                      .alt="','"\n                      sizing="cover"\n                      ?hidden="','"\n                      class="orgImage"\n                      src="','" />\n                  ']);return rn=function(){return n},n}function sn(){var n=c(['\n            <div class="layout horizontal mainArea" .title="','">\n              <yp-user-image\n                .titlefromuser="','"\n                .user="','"\n                ?hidden="','"></yp-user-image>\n              <div class="layout vertical">\n                <div class="name" .inverted="','">\n                  ','\n                </div>\n                <div\n                  class="organizationName"\n                  .inverted="','"\n                  ?hidden="','">\n                  ',"\n                </div>\n              </div>\n\n              ","\n            </div>\n          "]);return sn=function(){return n},n}function cn(){var n=c(["\n      ","\n    "]);return cn=function(){return n},n}function un(){var n=c(["\n        yp-image {\n          display: block;\n          vertical-align: text-top;\n          height: 48px;\n          width: 48px;\n        }\n\n        .small {\n          height: 30px;\n          width: 30px;\n          background-color: var(--primary-color-lighter, #434343);\n        }\n\n        .large {\n          height: 90px;\n          width: 90px;\n          background-color: var(--primary-color-lighter, #434343);\n        }\n\n        .veryLarge {\n          height: 200px;\n          width: 200px;\n          background-color: var(--primary-color-lighter, #434343);\n        }\n\n        .medium {\n          height: 48px;\n          width: 48px;\n          background-color: var(--primary-color-lighter, #434343);\n        }\n\n        .rounded {\n          -webkit-border-radius: 25px;\n          -moz-border-radius: 25px;\n          border-radius: 25px;\n          display: block;\n          -webkit-transform-style: preserve-3d;\n        }\n\n        .rounded-more {\n          -webkit-border-radius: 50px;\n          -moz-border-radius: 50px;\n          border-radius: 50px;\n          display: block;\n          vertical-align: top;\n          align: top;\n          -webkit-transform-style: preserve-3d;\n        }\n\n        .rounded-even-more {\n          -webkit-border-radius: 115px;\n          -moz-border-radius: 125px;\n          border-radius: 125px;\n          display: block;\n          vertical-align: top;\n          align: top;\n          -webkit-transform-style: preserve-3d;\n        }\n\n        .rounded img {\n          opacity: 0;\n        }\n\n        .rounded-more img {\n          opacity: 0;\n        }\n      "]);return un=function(){return n},n}function ln(){var n=c(['\n                        <yp-image\n                          sizing="cover"\n                          .title="','"\n                          .alt="','"\n                          preload\n                          src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png"\n                          class="','"></yp-image>\n                      ']);return ln=function(){return n},n}function dn(){var n=c(['\n                        <yp-image\n                          sizing="cover"\n                          ?hidden="','"\n                          .alt="','"\n                          .title="','"\n                          preload\n                          .src="','"\n                          class="','"></yp-image>\n                      ']);return dn=function(){return n},n}function hn(){var n=c(["\n                  ","\n                  ","\n                "]);return hn=function(){return n},n}function pn(){var n=c(['\n                  <yp-image\n                    sizing="cover"\n                    .alt="','"\n                    .title="','"\n                    preload\n                    src="','"\n                    class="','"></yp-image>\n                ']);return pn=function(){return n},n}function mn(){var n=c(["\n            ","\n            ","\n          "]);return mn=function(){return n},n}function fn(){var n=c(["\n      ","\n    "]);return fn=function(){return n},n}function gn(){var n=c(["\n        mwc-dialog {\n          background-color: #fff;\n        }\n      "]);return gn=function(){return n},n}function yn(){var n=c(['\n      <mwc-dialog id="confirmationDialog">\n        <div>','</div>\n        <mwc-button\n          ?hidden="','"\n          @click="','"\n          slot="secondaryAction"\n          .label="','"></mwc-button>\n        <mwc-button\n          @click="','"\n          slot="primaryAction"\n          .label="','"></mwc-button>\n      </mwc-dialog>\n    ']);return yn=function(){return n},n}function vn(){var n=c(["\n        mwc-dialog {\n          padding-left: 8px;\n          padding-right: 8px;\n          background-color: #fff;\n          max-width: 450px;\n        }\n\n        .buttons {\n          margin-top: 16px;\n          margin-bottom: 4px;\n          text-align: center;\n        }\n\n        .boldButton {\n          font-weight: bold;\n        }\n\n        .header {\n          font-size: 22px;\n          color: #f00;\n          font-weight: bold;\n        }\n\n        @media (max-width: 480px) {\n        }\n\n        @media (max-width: 320px) {\n        }\n      "]);return vn=function(){return n},n}function bn(){var n=c(['\n      <mwc-dialog id="dialog" modal>\n        <div class="header layout horizontal center-center">\n          <div>','</div>\n        </div>\n\n        <div class="helpInfo">','</div>\n\n        <div class="helpInfo">','</div>\n\n        <div class="buttons layout vertical center-center">\n          <div class="layout horizontal ajaxElements">\n            <mwc-circular-progress-four-color hidden?="','"></mwc-circular-progress-four-color>\n          </div>\n          <div class="layout horizontal center-center">\n            <mwc-button\n              .label="','"\n              slot="secondaryAction"\n              dialog-dismiss=""></mwc-button>\n            <mwc-button\n              .label="','"\n              raised\n              slot="primaryAction"\n\n              class="boldButton"\n              @click="','"></mwc-button>\n            <mwc-button\n              .label="','"\n              slot="primaryAction"\n              raised\n              class="boldButton"\n              @click="','"></mwc-button>\n          </div>\n        </div>\n      </mwc-dialog>\n    ']);return bn=function(){return n},n}function kn(){var n=c(["\n        .container {\n          height: 100%;\n          min-height: 350px;\n        }\n\n        .additionalSettings {\n          margin-top: 16px;\n        }\n\n        .icon {\n          padding-right: 8px;\n        }\n\n        h2 {\n          padding-top: 16px;\n        }\n\n        #deleteUser {\n          max-width: 250px;\n          margin-top: 16px;\n          color: #f00;\n        }\n\n        .disconnectButtons {\n          margin-top: 8px;\n          max-width: 250px;\n        }\n\n        yp-language-selector {\n          margin-bottom: 8px;\n        }\n\n        mwc-button {\n          text-align: center;\n        }\n\n        .ssn {\n          margin-top: 0;\n          margin-bottom: 4px;\n          font-weight: 400;\n        }\n      "]);return kn=function(){return n},n}function wn(){var n=c(['\n          <yp-edit-dialog\n            name="userEdit"\n            id="editDialog"\n            .title="','"\n            doubleWidth\n            icon="face"\n            .action="','"\n            @iron-form-response="','"\n            method="','"\n            .params="','"\n            .saveText="','"\n            .snackbarText="','">\n            <div class="container">\n              <div class="layout vertical wrap container">\n                <mwc-textfield\n                  id="name"\n                  name="name"\n                  type="text"\n                  .label="','"\n                  .value="','"\n                  maxlength="50"\n                  char-counter>\n                </mwc-textfield>\n\n                <div class="ssn" ?hidden="','">\n                  ',": ",'\n                </div>\n\n                <mwc-textfield\n                  id="email"\n                  name="email"\n                  type="text"\n                  .label="','"\n                  .value="','">\n                </mwc-textfield>\n\n                <div class="layout horizontal wrap">\n                  <div class="layout vertical additionalSettings">\n                    <yp-file-upload\n                      id="profileImageUpload"\n                      raised\n                      target="/api/images?itemType=user-profile"\n                      method="POST"\n                      buttonIcon="photo_camera"\n                      .buttonText="','"\n                      @success="','">\n                    </yp-file-upload>\n                  </div>\n\n                  <div class="layout vertical additionalSettings" hidden="">\n                    <yp-file-upload\n                      id="headerImageUpload"\n                      raised\n                      target="/api/images?itemType=user-header"\n                      method="POST"\n                      buttonIcon="photo_camera"\n                      .buttonText="','"\n                      @success="','">\n                    </yp-file-upload>\n                  </div>\n                </div>\n\n                <yp-language-selector\n                  name="defaultLocale"\n                  auto-translate-option-disabled=""\n                  .selectedLocale="','"></yp-language-selector>\n\n                <mwc-button\n                  ?hidden="','"\n                  class="disconnectButtons"\n                  raised\n                  .label="','"\n                  @click="','"></mwc-button>\n\n                <mwc-button\n                  ?hidden="','"\n                  raised\n                  .label="','"\n                  class="disconnectButtons"\n                  @click="','"></mwc-button>\n\n                <mwc-button\n                  id="deleteUser"\n                  raised\n                  .label="','"\n                  @click="','"></mwc-button>\n\n                <input\n                  type="hidden"\n                  name="uploadedProfileImageId"\n                  .value="','" />\n\n                <input\n                  type="hidden"\n                  name="uploadedHeaderImageId"\n                  .value="','" />\n\n                <h2>','</h2>\n\n                <ac-notification-settings\n                  .notificationsSettings="','"></ac-notification-settings>\n\n                <input\n                  type="hidden"\n                  name="notifications_settings"\n                  .value="','" />\n              </div>\n            </div>\n          </yp-edit-dialog>\n        ']);return wn=function(){return n},n}function xn(){var n=c(['\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n\n      <ac-notification-selection\n        .name="','"\n        .setting="','">\n      </ac-notification-selection>\n    ']);return xn=function(){return n},n}function _n(){var n=c(["\n        .half {\n          width: 50%;\n        }\n\n        .notificationName {\n          padding-top: 16px;\n          font-size: 16px;\n          font-weight: bold;\n          margin-bottom: 8px;\n          padding-bottom: 4px;\n          color: #333;\n          border-bottom: solid 1px #ddd;\n        }\n\n        .notificationSub {\n          color: #888;\n        }\n\n        mwc-radio {\n          padding-top: 8px;\n          padding-bottom: 8px;\n        }\n      "]);return _n=function(){return n},n}function In(){var n=c(['\n                    <mwc-formfield .label="','">\n                      <mwc-radio\n                        name="frequency"\n                        ?disabled="','"\n                        @change="','"\n                        .value="','"\n                        ?checked="','">\n                      </mwc-radio>\n                    </mwc-formfield>\n                  ']);return In=function(){return n},n}function Sn(){var n=c(['\n                    <mwc-formfield .label="','">\n                      <mwc-radio\n                        name="method"\n                        @change="','"\n                        .value="','"\n                        ?checked="','">\n                      </mwc-radio>\n                    </mwc-formfield>\n                  ']);return Sn=function(){return n},n}function Un(){var n=c(['\n      <div class="layout vertical">\n        <div class="notificationName">','</div>\n        <div class="layout horizontal wrap">\n          <div class="layout vertical half">\n            <div class="notificationSub">','</div>\n            <div class="layout horizontal">\n              <div id="notificationMethodGroup" name="method" class="method">\n                ','\n              </div>\n            </div>\n          </div>\n          <div class="layout vertical half">\n            <div class="notificationSub">\n              ','\n            </div>\n            <div class="layout horizontal">\n              <div id="notificationFrequencyGroup" class="frequency">\n                ',"\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    "]);return Un=function(){return n},n}return{setters:[function(n){e=n.createSuper,i=n.inherits,o=n.getPrototypeOf,a=n.get,r=n.createClass,s=n.classCallCheck,c=n.taggedTemplateLiteral,u=n.asyncToGenerator,l=n.regeneratorRuntime},function(n){d=n._,h=n.e,p=n.n,m=n.Y,f=n.i,g=n.T,y=n.A,v=n.j,b=n.S,k=n.k,w=n.l},function(n){x=n.Y},function(n){_=n.m}],execute:function(){(function(n){return n}),F=function(n){i(c,n);var t=e(c);function c(){return s(this,c),t.apply(this,arguments)}return r(c,[{key:"updated",value:function(n){a(o(c.prototype),"updated",this).call(this,n),n.has("setting")&&this._settingChanged()}},{key:"render",value:function(){var n=this;return g(S||(S=Un()),this.name,this.t("notification.method"),this.availableMethods.map((function(t){return g(U||(U=Sn()),t.name,n._methodChanged,t.enumValue.toString(),t.enumValue==n.method)})),this.t("notification.frequency"),this.availableFrequencies.map((function(t){return g(z||(z=In()),t.name,n._isDelayed(t),n._frequencyChanged,t.enumValue.toString(),t.enumValue==n.frequency)})))}},{key:"_methodChanged",value:function(n){var t=n.target.value;(t=parseInt(t))&&this.method!=t&&(this.method=t,this.fire("yp-notification-changed")),this.method&&(this.setting.method=this.method)}},{key:"_frequencyChanged",value:function(n){var t=n.target.value;(t=parseInt(t))&&this.frequency!=t&&(this.frequency=t,this.fire("yp-notification-changed")),this.frequency&&(this.setting.frequency=this.frequency)}},{key:"_settingChanged",value:function(){this.setting&&(this.method=this.setting.method,this.frequency=this.setting.frequency)}},{key:"_isDelayed",value:function(n){return n.enumValue>0}},{key:"availableMethods",get:function(){return this.language?[{name:this.t("notification.muted"),enumValue:0},{name:this.t("notification.browser"),enumValue:1},{name:this.t("notification.email"),enumValue:2}]:[]}},{key:"availableFrequencies",get:function(){var n=[];return this.language&&this.method&&0!=this.method&&(1==this.method?(this.frequency=0,n=[{name:this.t("notification.asItHappens"),enumValue:0}]):2==this.method&&(n=[{name:this.t("notification.asItHappens"),enumValue:0},{name:this.t("notification.hourly"),enumValue:1},{name:this.t("notification.daily"),enumValue:2},{name:this.t("notification.weekly"),enumValue:3},{name:this.t("notification.monthly"),enumValue:5}])),n}}],[{key:"prssoperties",get:function(){return{setting:{type:Object,notify:!0,observer:"_settingChanged"},frequency:{type:Number,notify:!0,observer:"_frequencyChanged"},method:{type:Number,notify:!0,observer:"_methodChanged"}}}},{key:"styles",get:function(){return[a(o(c),"styles",this),f(I||(I=_n()))]}}]),c}(m),d([h({type:String})],F.prototype,"name",void 0),d([h({type:Object})],F.prototype,"setting",void 0),d([h({type:Number})],F.prototype,"frequency",void 0),d([h({type:Number})],F.prototype,"method",void 0),F=d([p("ac-notification-selection")],F),function(n){return n},D=function(n){i(c,n);var t=e(c);function c(){return s(this,c),t.apply(this,arguments)}return r(c,[{key:"render",value:function(){return g(T||(T=xn()),this.t("notification.myPosts"),this.notificationsSettings.my_posts,this.t("notification.myPostsEndorsements"),this.notificationsSettings.my_posts_endorsements,this.t("notification.myPoints"),this.notificationsSettings.my_points,this.t("notification.myPointEndorsements"),this.notificationsSettings.my_points_endorsements,this.t("notification.allCommunity"),this.notificationsSettings.all_community,this.t("notification.allGroup"),this.notificationsSettings.all_group)}},{key:"connectedCallback",value:function(){a(o(c.prototype),"connectedCallback",this).call(this),this.addListener("yp-notification-changed",this._settingsChanged.bind(this))}},{key:"disconnectedCallback",value:function(){a(o(c.prototype),"disconnectedCallback",this).call(this),this.removeListener("yp-notification-changed",this._settingsChanged.bind(this))}},{key:"_settingsChanged",value:function(){this.fire("yp-notifications-changed",this.notificationsSettings)}}]),c}(m),d([h({type:Object})],D.prototype,"notificationsSettings",void 0),D=d([p("ac-notification-settings")],D),function(n){return n},O=function(n){i(h,n);var t,c,d=e(h);function h(){var n;return s(this,h),(n=d.apply(this,arguments)).action="/users",n.selected=0,n}return r(h,[{key:"updated",value:function(n){a(o(h.prototype),"updated",this).call(this,n),n.has("user")&&this._userChanged(),n.has("notificationSettings")&&this._notificationSettingsChanged()}},{key:"render",value:function(){return this.user?g(A||(A=wn()),this.editHeaderText,this.action,this._editResponse,this.method,this.params,this.saveText,this.snackbarText||"",this.t("Name"),this.user.name,!this.user.ssn,this.t("ssn"),this.user.ssn,this.t("Email"),this.user.email||"",this.t("image.profile.upload"),this._profileImageUploaded,this.t("image.header.upload"),this._headerImageUploaded,this.user.default_locale,!this.user.facebook_id,this.t("disconnectFromFacebookLogin"),this._disconnectFromFacebookLogin,!this.user.ssn,this.t("disconnectFromSamlLogin"),this._disconnectFromSamlLogin,this.t("deleteOrAnonymizeUser"),this._deleteOrAnonymizeUser,this.uploadedProfileImageId,this.uploadedHeaderImageId,this.t("user.notifications"),this.notificationSettings,this.encodedUserNotificationSettings||""):y}},{key:"connectedCallback",value:function(){a(o(h.prototype),"connectedCallback",this).call(this),this.addListener("yp-notifications-changed",this._setNotificationSettings.bind(this))}},{key:"disconnectedCallback",value:function(){a(o(h.prototype),"disconnectedCallback",this).call(this),this.removeListener("yp-notifications-changed",this._setNotificationSettings.bind(this))}},{key:"_editResponse",value:function(n){n.detail.response.duplicateEmail&&this.fire("yp-error",this.t("emailAlreadyRegisterred"))}},{key:"_checkIfValidEmail",value:function(){return this.user&&this.user.email&&!(this.user.email.indexOf("@citizens.is")>-1&&this.user.email.indexOf("anonymous")>-1)}},{key:"_disconnectFromFacebookLogin",value:function(){var n=this;this._checkIfValidEmail()?window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouSureYouWantToDisconnectFacebookLogin"),n._reallyDisconnectFromFacebookLogin.bind(n),!0)})):this.fire("yp-error",this.t("cantDisconnectFromFacebookWithoutValidEmail"))}},{key:"_reallyDisconnectFromFacebookLogin",value:(c=u(l.mark((function n(){return l.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.serverApi.disconnectFacebookLogin();case 2:this.user.facebook_id=void 0,window.appGlobals.notifyUserViaToast(this.t("disconnectedFacebookLoginFor")+" "+this.user.email);case 4:case"end":return n.stop()}}),n,this)}))),function(){return c.apply(this,arguments)})},{key:"_disconnectFromSamlLogin",value:function(){var n=this;this._checkIfValidEmail()?window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouSureYouWantToDisconnectSamlLogin"),n._reallyDisconnectFromSamlLogin.bind(n),!0)})):this.fire("yp-error",this.t("cantDisconnectFromSamlWithoutValidEmail"))}},{key:"_reallyDisconnectFromSamlLogin",value:(t=u(l.mark((function n(){return l.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,window.serverApi.disconnectSamlLogin();case 2:this.user&&(this.user.ssn=void 0),window.appGlobals.notifyUserViaToast(this.t("disconnectedSamlLoginFor")+" "+this.user.email);case 4:case"end":return n.stop()}}),n,this)}))),function(){return t.apply(this,arguments)})},{key:"_setNotificationSettings",value:function(n){this.notificationSettings=n.detail,this.encodedUserNotificationSettings=this._encodeNotificationsSettings(this.notificationSettings)}},{key:"_notificationSettingsChanged",value:function(){this.notificationSettings&&(this.encodedUserNotificationSettings=this._encodeNotificationsSettings(this.notificationSettings))}},{key:"_encodeNotificationsSettings",value:function(n){return n?JSON.stringify(n):void 0}},{key:"_userChanged",value:function(){this.user&&(this.notificationSettings=this.user.notifications_settings)}},{key:"_profileImageUploaded",value:function(n){var t=JSON.parse(n.detail.xhr.response);this.uploadedProfileImageId=t.id}},{key:"_headerImageUploaded",value:function(n){var t=JSON.parse(n.detail.xhr.response);this.uploadedHeaderImageId=t.id}},{key:"customRedirect",value:function(){window.appUser.checkLogin()}},{key:"clear",value:function(){this.user={name:"",email:""},this.uploadedProfileImageId=void 0,this.uploadedHeaderImageId=void 0,this.$$("#headerImageUpload").clear(),this.$$("#profileImageUpload").clear()}},{key:"setup",value:function(n,t,e){var i=arguments.length>3&&void 0!==arguments[3]&&arguments[3];this.user=n,this.new=t,this.refreshFunction=e,i&&(this.selected=1),this.setupTranslation()}},{key:"setupTranslation",value:function(){this.new?(this.editHeaderText=this.t("user.new"),this.snackbarText=this.t("userToastCreated"),this.saveText=this.t("create")):(this.saveText=this.t("save"),this.editHeaderText=this.t("user.edit"),this.snackbarText=this.t("userToastUpdated"))}},{key:"_deleteOrAnonymizeUser",value:function(){window.appDialogs.getDialogAsync("userDeleteOrAnonymize",(function(n){n.open()}))}}],[{key:"styles",get:function(){return[a(o(h),"styles",this),f(C||(C=kn()))]}}]),h}(x),d([h({type:String})],O.prototype,"action",void 0),d([h({type:Object})],O.prototype,"user",void 0),d([h({type:Number})],O.prototype,"selected",void 0),d([h({type:String})],O.prototype,"encodedUserNotificationSettings",void 0),d([h({type:Number})],O.prototype,"uploadedProfileImageId",void 0),d([h({type:Number})],O.prototype,"uploadedHeaderImageId",void 0),d([h({type:Object})],O.prototype,"notificationSettings",void 0),O=d([p("yp-user-edit")],O),function(n){return n},W=function(n){i(h,n);var t,c,d=e(h);function h(){var n;return s(this,h),(n=d.apply(this,arguments)).spinnerActive=!1,n}return r(h,[{key:"render",value:function(){return g(N||(N=bn()),this.t("deleteOrAnonymizeUser"),this.t("anonymizeUserInfo"),this.t("deleteUserInfo"),!this.spinnerActive,this.t("cancel"),this.t("deleteAccount"),this._deleteUser,this.t("anonymizeAccount"),this._anonymizeUser)}},{key:"_deleteUser",value:function(){var n=this;window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouSureYouWantToDeleteUser"),n._deleteUserFinalWarning.bind(n),!0)}))}},{key:"_deleteUserFinalWarning",value:function(){var n=this;setTimeout((function(){window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouReallySureYouWantToDeleteUser"),n._deleteUserForReal.bind(n),!0)}))}))}},{key:"_anonymizeUser",value:function(){var n=this;window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouSureYouWantToAnonymizeUser"),n._anonymizeUserFinalWarning.bind(n),!0)}))}},{key:"_anonymizeUserFinalWarning",value:function(){var n=this;setTimeout((function(){window.appDialogs.getDialogAsync("confirmationDialog",(function(t){t.open(n.t("areYouReallySureYouWantToAnonymizeUser"),n._anonymizeUserForReal.bind(n),!0)}))}))}},{key:"_deleteUserForReal",value:(c=u(l.mark((function n(){return l.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return this.spinnerActive=!0,n.next=3,window.serverApi.deleteUser();case 3:this.spinnerActive=!1,this._completed();case 5:case"end":return n.stop()}}),n,this)}))),function(){return c.apply(this,arguments)})},{key:"_anonymizeUserForReal",value:(t=u(l.mark((function n(){return l.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return this.spinnerActive=!0,n.next=3,window.serverApi.anonymizeUser();case 3:this.spinnerActive=!1,this._completed();case 5:case"end":return n.stop()}}),n,this)}))),function(){return t.apply(this,arguments)})},{key:"open",value:function(){this.$$("#dialog").open=!0}},{key:"_completed",value:function(){this.$$("#dialog").open=!1,window.location.href="/"}}],[{key:"styles",get:function(){return[a(o(h),"styles",this),f(L||(L=vn()))]}}]),h}(m),d([h({type:Boolean})],W.prototype,"spinnerActive",void 0),W=d([p("yp-user-delete-or-anonymize")],W),function(n){return n},q=function(n){i(o,n);var t=e(o);function o(){var n;return s(this,o),(n=t.apply(this,arguments)).useFinalWarning=!1,n.haveIssuedFinalWarning=!1,n.hideCancel=!1,n}return r(o,[{key:"render",value:function(){return g(V||(V=yn()),this.confirmationText,this.hideCancel,this._reset,this.t("cancel"),this._confirm,this.t("confirm"))}},{key:"_reset",value:function(){this.confirmationText=void 0,this.onConfirmedFunction=void 0,this.haveIssuedFinalWarning=!1,this.useFinalWarning=!1,this.hideCancel=!1}},{key:"open",value:function(n,t){var e=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=arguments.length>4&&void 0!==arguments[4]&&arguments[4];this.confirmationText=n,this.onConfirmedFunction=t,this.$$("#confirmationDialog").open=!0,this.useFinalWarning=!!e,this.haveIssuedFinalWarning=!1,this.hideCancel=!!i}},{key:"_confirm",value:function(){var n=this;this.useFinalWarning&&!this.haveIssuedFinalWarning?(this.haveIssuedFinalWarning=!0,this.$$("#confirmationDialog").open=!1,this.confirmationText=this.t("finalDeleteWarning"),setTimeout((function(){n.$$("#confirmationDialog").open=!0}))):this.onConfirmedFunction&&(this.onConfirmedFunction(),this._reset())}}],[{key:"styles",get:function(){return[f(P||(P=gn()))]}}]),o}(m),d([h({type:String})],q.prototype,"confirmationText",void 0),d([h({type:Object})],q.prototype,"onConfirmedFunction",void 0),d([h({type:Boolean})],q.prototype,"useFinalWarning",void 0),d([h({type:Boolean})],q.prototype,"haveIssuedFinalWarning",void 0),d([h({type:Boolean})],q.prototype,"hideCancel",void 0),q=d([p("yp-confirmation-dialog")],q),function(n){return n},G=function(n){i(c,n);var t=e(c);function c(){var n;return s(this,c),(n=t.apply(this,arguments)).veryLarge=!1,n.large=!1,n.noDefault=!1,n.noProfileImage=!1,n}return r(c,[{key:"render",value:function(){return g(j||(j=fn()),this.user&&!this.noProfileImage?g(Y||(Y=mn()),this.profileImageUrl?g($||($=pn()),this.userTitle,this.userTitle,this.profileImageUrl,this.computeClass):y,this.profileImageUrl?y:g(E||(E=hn()),this.user.facebook_id?g(R||(R=dn()),this.profileImageUrl,this.userTitle,this.userTitle,this.computeFacebookSrc,this.computeClass):y,this.user.facebook_id?y:g(H||(H=ln()),this.userTitle,this.userTitle,this.computeClass))):y)}},{key:"userTitle",get:function(){return this.user?this.titleFromUser?this.titleFromUser:this.user.name:""}},{key:"profileImageUrl",get:function(){if(this.user&&this.user.UserProfileImages&&this.user.UserProfileImages.length>0){var n=v.getImageFormatUrl(this.user.UserProfileImages,0);return n&&""!==n?(this.noProfileImage=!1,n):(this.noProfileImage=!0,null)}return this.noProfileImage=!0,null}},{key:"computeClass",get:function(){return this.large||this.veryLarge?this.large?"large rounded-more":this.veryLarge?"veryLarge rounded-even-more":"medium rounded":"small rounded"}},{key:"computeFacebookSrc",get:function(){return this.user&&this.user.facebook_id?"https://graph.facebook.com/"+this.user.facebook_id+"/picture":void 0}}],[{key:"styles",get:function(){return[a(o(c),"styles",this),f(B||(B=un()))]}}]),c}(m),d([h({type:Boolean})],G.prototype,"veryLarge",void 0),d([h({type:Boolean})],G.prototype,"large",void 0),d([h({type:String})],G.prototype,"titleFromUser",void 0),d([h({type:Object})],G.prototype,"user",void 0),d([h({type:Boolean})],G.prototype,"noDefault",void 0),d([h({type:Boolean})],G.prototype,"noProfileImage",void 0),G=d([p("yp-user-image")],G),function(n){return n},X=function(n){i(c,n);var t=e(c);function c(){var n;return s(this,c),(n=t.apply(this,arguments)).hideImage=!1,n.inverted=!1,n}return r(c,[{key:"render",value:function(){return g(M||(M=cn()),this.user?g(K||(K=sn()),this.userTitle,this.userTitle,this.user,this.hideImage,this.inverted,this.user.name,this.inverted,!this.organizationName,this.organizationName,this.organizationImageUrl&&this.organizationName?g(Q||(Q=rn()),this.organizationName,this.hideImage,this.organizationImageUrl):y):y)}},{key:"userTitle",get:function(){return this.user&&this.titleDate?this.user.name+" "+_(this.titleDate).fromNow():""}},{key:"organizationName",get:function(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].name?this.user.OrganizationUsers[0].name:null}},{key:"organizationImageUrl",get:function(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages&&this.user.OrganizationUsers[0].OrganizationLogoImages.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages[0].formats?v.getImageFormatUrl(this.user.OrganizationUsers[0].OrganizationLogoImages,2):void 0}}],[{key:"styles",get:function(){return[a(o(c),"styles",this),f(J||(J=an()))]}}]),c}(m),d([h({type:Object})],X.prototype,"user",void 0),d([h({type:Object})],X.prototype,"titleDate",void 0),d([h({type:Boolean})],X.prototype,"hideImage",void 0),d([h({type:Boolean})],X.prototype,"inverted",void 0),X=d([p("yp-user-with-organization")],X),function(n){return n},tn=function(n){i(o,n);var t=e(o);function o(){var n;return s(this,o),(n=t.apply(this,arguments)).notificationText="",n}return r(o,[{key:"renderTwo",value:function(){var n={"mdc-snackbar--stacked":this.stacked,"mdc-snackbar--leading":this.leading};return g(Z||(Z=on()),k(n),this._keyDown,this.user?g(nn||(nn=en()),this.user):y,w(this.notificationText,this.open),this._close,this._dismiss)}},{key:"_keyDown",value:function(n){this.mdcFoundation.handleKeyDown(n)}},{key:"_close",value:function(n){this.mdcFoundation.handleActionButtonClick(n)}},{key:"_dismiss",value:function(n){this.mdcFoundation.handleActionButtonClick(n)}},{key:"openDialog",value:function(n,t,e){this.notificationText=t,e||(this.user=n),this.open=!0}}]),o}(b),d([h({type:String})],tn.prototype,"notificationText",void 0),d([h({type:Object})],tn.prototype,"user",void 0),tn=d([p("ac-notification-toast")],tn)}}}));