var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import './yp-user-image.js';
//import moment from 'moment';
let YpUserWithOrganization = class YpUserWithOrganization extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.hideImage = false;
        this.inverted = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
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
          text-align: left;
        }

        .organizationName[inverted] {
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
      `,
        ];
    }
    render() {
        return html `
      ${this.user
            ? html `
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

              ${this.organizationImageUrl && this.organizationName
                ? html `
                    <img
                      width="48"
                      height="48"
                      .alt="${this.organizationName}"
                      sizing="cover"
                      ?hidden="${this.hideImage}"
                      class="orgImage"
                      src="${this.organizationImageUrl}" />
                  `
                : nothing}
            </div>
          `
            : nothing}
    `;
    }
    get userTitle() {
        if (this.user && this.titleDate) {
            return this.user.name; // + ' ' + moment(this.titleDate).fromNow();
        }
        else {
            return '';
        }
    }
    get organizationName() {
        if (this.user &&
            this.user.OrganizationUsers &&
            this.user.OrganizationUsers.length > 0 &&
            this.user.OrganizationUsers[0].name) {
            return this.user.OrganizationUsers[0].name;
        }
        else {
            return null;
        }
    }
    get organizationImageUrl() {
        if (this.user &&
            this.user.OrganizationUsers &&
            this.user.OrganizationUsers.length > 0 &&
            this.user.OrganizationUsers[0].OrgLogoImgs &&
            this.user.OrganizationUsers[0].OrgLogoImgs.length > 0 &&
            this.user.OrganizationUsers[0].OrgLogoImgs[0].formats) {
            return YpMediaHelpers.getImageFormatUrl(this.user.OrganizationUsers[0].OrgLogoImgs, 2);
        }
        else {
            return undefined;
        }
    }
};
__decorate([
    property({ type: Object })
], YpUserWithOrganization.prototype, "user", void 0);
__decorate([
    property({ type: Object })
], YpUserWithOrganization.prototype, "titleDate", void 0);
__decorate([
    property({ type: Boolean })
], YpUserWithOrganization.prototype, "hideImage", void 0);
__decorate([
    property({ type: Boolean })
], YpUserWithOrganization.prototype, "inverted", void 0);
YpUserWithOrganization = __decorate([
    customElement('yp-user-with-organization')
], YpUserWithOrganization);
export { YpUserWithOrganization };
//# sourceMappingURL=yp-user-with-organization.js.map