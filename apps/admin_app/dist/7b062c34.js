import{_ as e,e as t,Y as s}from"./f69f9111.js";class o extends s{constructor(){super(...arguments),this.new=!0,this.method="POST"}customRedirect(e){}setupAfterOpen(e){}customFormResponse(e){}updated(e){super.updated(e),e.has("new")&&this._setupNewUpdateState()}connectedCallback(){super.connectedCallback(),this.addListener("yp-form-response",this._formResponse.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-form-response",this._formResponse.bind(this))}_logoImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedLogoImageId=t.id}_headerImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedHeaderImageId=t.id}_defaultDataImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedDefaultDataImageId=t.id}_defaultPostImageUploaded(e){const t=JSON.parse(e.detail.xhr.response);this.uploadedDefaultPostImageId=t.id}_formResponse(e){"function"==typeof this.customRedirect&&this.customRedirect(e.detail),"function"==typeof this.refreshFunction&&this.refreshFunction(e.detail),e&&e.detail&&e.detail.isError?console.log("Not clearing form because of user error"):this.clear(),this.customFormResponse(e)}_setupNewUpdateState(){this.new?(this.saveText=this.t("create"),this.method="POST"):(this.saveText=this.t("update"),this.method="PUT"),this.setupTranslation()}open(e,t){window.appUser&&!0===window.appUser.loggedIn()?(this.new=!!e,t&&(this.params=t),"function"==typeof this.setupAfterOpen&&this.setupAfterOpen(t),this.$$("#editDialog").open()):window.appUser.loginForEdit(this,e,t,this.refreshFunction)}close(){this.$$("#editDialog").close()}}e([t({type:Boolean})],o.prototype,"new",void 0),e([t({type:String})],o.prototype,"editHeaderText",void 0),e([t({type:String})],o.prototype,"saveText",void 0),e([t({type:String})],o.prototype,"snackbarText",void 0),e([t({type:Object})],o.prototype,"params",void 0),e([t({type:String})],o.prototype,"method",void 0),e([t({type:Object})],o.prototype,"refreshFunction",void 0);export{o as Y};