import{_ as e,e as r,n as i,a as t,r as s,p as o,T as a,m as n}from"./bc9c360d.js";import{Y as l}from"./aac99731.js";let g=class extends t{constructor(){super(...arguments),this.veryLarge=!1,this.large=!1,this.noDefault=!1,this.noProfileImage=!1}static get styles(){return[super.styles,s`
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
      `]}render(){return o`
      ${this.user&&!this.noProfileImage?o`
            ${this.profileImageUrl?o`
                  <yp-image
                    sizing="cover"
                    .alt="${this.userTitle}"
                    .title="${this.userTitle}"
                    preload
                    src="${this.profileImageUrl}"
                    class="${this.computeClass}"></yp-image>
                `:a}
            ${this.profileImageUrl?a:o`
                  ${this.user.facebook_id?o`
                        <yp-image
                          sizing="cover"
                          ?hidden="${this.profileImageUrl}"
                          .alt="${this.userTitle}"
                          .title="${this.userTitle}"
                          preload
                          .src="${this.computeFacebookSrc}"
                          class="${this.computeClass}"></yp-image>
                      `:a}
                  ${this.user.facebook_id?a:o`
                        <yp-image
                          sizing="cover"
                          .title="${this.userTitle}"
                          .alt="${this.userTitle}"
                          preload
                          src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png"
                          class="${this.computeClass}"></yp-image>
                      `}
                `}
          `:a}
    `}get userTitle(){return this.user?this.titleFromUser?this.titleFromUser:this.user.name:""}get profileImageUrl(){if(this.user&&this.user.UserProfileImages&&this.user.UserProfileImages.length>0){const e=l.getImageFormatUrl(this.user.UserProfileImages,0);return e&&""!==e?(this.noProfileImage=!1,e):(this.noProfileImage=!0,null)}return this.noProfileImage=!0,null}get computeClass(){return this.large||this.veryLarge?this.large?"large rounded-more":this.veryLarge?"veryLarge rounded-even-more":"medium rounded":"small rounded"}get computeFacebookSrc(){return this.user&&this.user.facebook_id?"https://graph.facebook.com/"+this.user.facebook_id+"/picture":void 0}};e([r({type:Boolean})],g.prototype,"veryLarge",void 0),e([r({type:Boolean})],g.prototype,"large",void 0),e([r({type:String})],g.prototype,"titleFromUser",void 0),e([r({type:Object})],g.prototype,"user",void 0),e([r({type:Boolean})],g.prototype,"noDefault",void 0),e([r({type:Boolean})],g.prototype,"noProfileImage",void 0),g=e([i("yp-user-image")],g);let d=class extends t{constructor(){super(...arguments),this.hideImage=!1,this.inverted=!1}static get styles(){return[super.styles,s`
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
      `]}render(){return o`
      ${this.user?o`
            <div class="layout horizontal mainArea" .title="${this.userTitle}">
              <yp-user-image
                .titlefromuser="${this.userTitle}"
                .user="${this.user}"
                ?hidden="${this.hideImage}"></yp-user-image>
              <div class="layout vertical">
                <div class="name" .inverted="${this.inverted}">
                  ${this.user.name}
                </div>
                <div
                  class="organizationName"
                  .inverted="${this.inverted}"
                  ?hidden="${!this.organizationName}">
                  ${this.organizationName}
                </div>
              </div>

              ${this.organizationImageUrl&&this.organizationName?o`
                    <img
                      width="48"
                      height="48"
                      .alt="${this.organizationName}"
                      sizing="cover"
                      ?hidden="${this.hideImage}"
                      class="orgImage"
                      src="${this.organizationImageUrl}" />
                  `:a}
            </div>
          `:a}
    `}get userTitle(){return this.user&&this.titleDate?this.user.name+" "+n(this.titleDate).fromNow():""}get organizationName(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].name?this.user.OrganizationUsers[0].name:null}get organizationImageUrl(){return this.user&&this.user.OrganizationUsers&&this.user.OrganizationUsers.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages&&this.user.OrganizationUsers[0].OrganizationLogoImages.length>0&&this.user.OrganizationUsers[0].OrganizationLogoImages[0].formats?l.getImageFormatUrl(this.user.OrganizationUsers[0].OrganizationLogoImages,2):void 0}};e([r({type:Object})],d.prototype,"user",void 0),e([r({type:Object})],d.prototype,"titleDate",void 0),e([r({type:Boolean})],d.prototype,"hideImage",void 0),e([r({type:Boolean})],d.prototype,"inverted",void 0),d=e([i("yp-user-with-organization")],d);
