
import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import './yp-user-image.js';

//import moment from 'moment';

@customElement('yp-user-with-organization')
export class YpUserWithOrganization extends YpBaseElement {
  @property({ type: Object })
  user!: YpUserData;

  @property({ type: Object })
  titleDate: Date | undefined;

  @property({ type: Boolean })
  hideImage = false;

  @property({ type: Boolean })
  mediumImage = false;

  @property({ type: Boolean })
  inverted = false;

  static override get styles() {
    return [
      super.styles,
      css`
        yp-user-image {
          padding-right: 16px;
        }

        .name {
          padding-top: 6px;
          font-weight: 700;
          text-align: left;
          padding-right: 16px;
          font-family: var(
            --md-ref-typeface-brand
          );
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

  override render() {
    return html`
      ${this.user
        ? html`
            <div class="layout horizontal mainArea" .title="${this.userTitle}">
              <yp-user-image
                .titlefromuser="${this.userTitle}"
                .medium="${this.mediumImage}"
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
                ? html`
                    <img
                      width="48"
                      height="48"
                      .alt="${this.organizationName}"
                      sizing="cover"
                      ?hidden="${this.hideImage}"
                      class="orgImage"
                      src="${this.organizationImageUrl}" />
                  `
                : nothing }
            </div>
          `
        : nothing }
    `;
  }

  get userTitle() {
    if (this.user && this.titleDate) {
      return this.user.name// + ' ' + moment(this.titleDate).fromNow();
    } else {
      return '';
    }
  }

  get organizationName() {
    if (
      this.user &&
      this.user.OrganizationUsers &&
      this.user.OrganizationUsers.length > 0 &&
      this.user.OrganizationUsers[0].name
    ) {
      return this.user.OrganizationUsers[0].name;
    } else {
      return null;
    }
  }

  get organizationImageUrl() {
    if (
      this.user &&
      this.user.OrganizationUsers &&
      this.user.OrganizationUsers.length > 0 &&
      this.user.OrganizationUsers[0].OrgLogoImgs &&
      this.user.OrganizationUsers[0].OrgLogoImgs.length > 0 &&
      this.user.OrganizationUsers[0].OrgLogoImgs[0].formats
    ) {
      return YpMediaHelpers.getImageFormatUrl(
        this.user.OrganizationUsers[0].OrgLogoImgs,
        2
      );
    } else {
      return undefined;
    }
  }
}
