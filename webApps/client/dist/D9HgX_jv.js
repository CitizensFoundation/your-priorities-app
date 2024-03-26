import{n as t,t as e,Y as i,x as s,T as a,a as o}from"./DNy5ai-q.js";var d=function(t,e,i,s){for(var a,o=arguments.length,d=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s,h=t.length-1;h>=0;h--)(a=t[h])&&(d=(o<3?a(d):o>3?a(e,i,d):a(e,i))||d);return o>3&&d&&Object.defineProperty(e,i,d),d};let h=class extends i{constructor(){super(...arguments),this.new=!1,this.action="/images"}updated(t){super.updated(t),t.has("image")&&this._imageChanged(),t.has("post")&&this._postChanged()}render(){return s`
      <yp-edit-dialog
        doubleWidth
        id="editDialog"
        icon="photo_camera"
        .action="${this.action}"
        .title="${this.editHeaderText}"
        .method="${this.method}"
        .saveText="${this.saveText}"
        .nextActionText="${this.t("next")}"
        .toastText="${this.snackbarText}"
        .params="${this.params}">
        ${this.image?s`
              <div class="layout vertical center-center">
                <yp-file-upload
                  id="imageFileUpload"
                  raised
                  .buttonText="${this.t("image.upload")}"
                  buttonIcon="photo_camera"
                  method="POST"
                  @success="${this._imageUploaded}">
                </yp-file-upload>
              </div>

              <md-outlined-text-field
                id="photographerName"
                name="photographerName"
                type="text"
                .label="${this.t("post.photographerName")}"
                .value="${this.image.photographer_name||""}"
                maxlength="60"
                char-counter="">
              </-outlined-text-field>

              <md-outlined-text-field
              type="textarea"
                id="description"
                required
                minlength="1"
                name="description"
                .value="${this.image.description||""}"
                .label="${this.t("post.description")}"
                charCounter
                rows="2"
                maxrows="5"
                maxlength="200">
              </md-outlined-text-field>

              <input
                type="hidden"
                name="uploadedPostUserImageId"
                .value="${this.uploadedPostUserImageId}" />

              <input
                type="hidden"
                name="oldUploadedPostUserImageId"
                .value="${this.oldUploadedPostUserImageId}" />
            `:a}
      </yp-edit-dialog>
    `}_postChanged(){this.post&&(this.$$("#imageFileUpload").target="/api/images?itemType=post-user-image&postId="+this.post.id)}connectedCallback(){super.connectedCallback(),this.addListener("yp-form-invalid",this._formInvalid)}disconnectedCallback(){super.disconnectedCallback(),this.removeListener("yp-form-invalid",this._formInvalid)}_imageChanged(){this.image&&(this.oldUploadedPostUserImageId=this.image.id)}_formInvalid(){}_imageUploaded(t){const e=JSON.parse(t.detail.xhr.response);this.uploadedPostUserImageId=e.id}clear(){this.uploadedPostUserImageId=void 0,this.$$("#imageFileUpload").clear()}setup(t,e,i,s){this.image=e||{description:"",photographerName:""},this.post=t||void 0,this.new=i,this.refreshFunction=s,this.setupTranslation()}setupTranslation(){this.new?(this.editHeaderText=this.t("post.newPhoto"),this.snackbarText=this.t("post.photo.toast.added")):(this.editHeaderText=this.t("post.photoUpdate"),this.snackbarText=this.t("post.photo.toast.updated"))}};d([t({type:Object})],h.prototype,"image",void 0),d([t({type:Object})],h.prototype,"post",void 0),d([t({type:Boolean})],h.prototype,"new",void 0),d([t({type:String})],h.prototype,"action",void 0),d([t({type:Number})],h.prototype,"uploadedPostUserImageId",void 0),d([t({type:Number})],h.prototype,"oldUploadedPostUserImageId",void 0),h=d([e("yp-post-user-image-edit")],h);var r=function(t,e,i,s){for(var a,o=arguments.length,d=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s,h=t.length-1;h>=0;h--)(a=t[h])&&(d=(o<3?a(d):o>3?a(e,i,d):a(e,i))||d);return o>3&&d&&Object.defineProperty(e,i,d),d};let p=class extends o{render(){return s`
      <share-menu
        @share="${this.sharedContent}"
        class="shareIcon"
        id="shareButton"
        .title="${this.t("post.shareInfo")}"
        .url="${this.url||""}"
      ></share-menu>
    `}async open(t,e,i){this.url=t,this.label=e,this.sharedContent=i,await this.requestUpdate(),this.$$("#shareButton").buttons=["clipboard","facebook","twitter","whatsapp","email","linkedin"],this.$$("#shareButton").share()}};r([t({type:Object})],p.prototype,"sharedContent",void 0),r([t({type:String})],p.prototype,"url",void 0),r([t({type:String})],p.prototype,"label",void 0),p=r([e("yp-share-dialog")],p);
