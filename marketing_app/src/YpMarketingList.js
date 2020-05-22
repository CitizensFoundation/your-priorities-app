import {  html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';

export class YpMarketingList extends YpBaseElement {
  static get properties() {
    return {
      listId: { type: String },
      listUsers: { type: Array },
      collectionType: { type: String },
      collectionId: { type: String },
      usersToAddList: { type: Array },
      usersToAddList: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        main {
          flex-grow: 1;
        }

        .app-footer {
          font-size: calc(12px + 0.5vmin);
          align-items: center;
        }

        .app-footer a {
          margin-left: 5px;
        }

        vaadin-grid {
          margin: 24px;
          max-width: 1200px;
        }

        .header-cell {
          font-weight: bold;
        }
    `];
  }

  constructor () {
    super();
    this.listUsers = [
      {
        id: 1,
        user_id: 1,
        sms: "+3546944411",
        email: "na",
        sentCount: 0,
        openCount: 0,
        postCount: 0,
        pointCount: 0
      },
      {
        id: 1,
        user_id: 1,
        sms: "+3546944411",
        email: "na",
        sentCount: 0,
        openCount: 0,
        postCount: 0,
        pointCount: 0
      },
      {
        id: 2,
        user_id: 2,
        sms: "+3546999911",
        email: "robert@citizens.is",
        sentCount: 2,
        openCount: 4,
        postCount: 1,
        pointCount: 5
      },
      {
        id: 3,
        user_id: 3,
        sms: "+32326944411",
        email: "gunnar@this.is",
        sentCount: 1,
        openCount: 2,
        postCount: 1,
        pointCount: 2
      },
      {
        id: 4,
        user_id: 4,
        sms: "+3546944400",
        email: "robert@this.is",
        sentCount: 0,
        openCount: 0,
        postCount: 0,
        pointCount: 0
      },
      {
        id: 5,
        user_id: 5,
        sms: "+3546944499",
        email: "na",
        sentCount: 0,
        openCount: 0,
        postCount: 0,
        pointCount: 0
      }
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionType = "community";
    this.collectionId = 974;
    const newUsersTextArea = this.$$("#newUsersText");
    newUsersTextArea.validityTransform = (newValue, nativeValidity) => {
      this.
      if (!nativeValidity.valid) {
        if (nativeValidity.tooLong) {
          const hasDog = newValue.includes('dog');
          // changes to make to the nativeValidity
          return {
            valid: hasDog,
            tooLong: !hasDog;
          };
        } else {
          // no changes
          return {};
        }
      } else {
        const isValid = someExpensiveOperation(newValue);
        // changes to make to the native validity
        return {
          valid: isValid,
          // or whatever type of ValidityState prop you would like to set (if any)
          customError: !isValid,
        };
      }
    }
  }

  render() {
    return html`
      <div class="layout horizontal center-center">
        <mwc-button ?hidden="${!this.usersToAddListText}" fullwidth outlined label="full-width"></mwc-button>
        <vaadin-grid .items="${this.listUsers}">
          <vaadin-grid-column path="id" header="${this.t("id")}"></vaadin-grid-column>
          <vaadin-grid-column path="sms" header="${this.t('sms')}"></vaadin-grid-column>
          <vaadin-grid-column path="email" header="${this.t("email")}"></vaadin-grid-column>
          <vaadin-grid-column-group resizable>
            <template class="header">${this.t('counts')}</template>
            <vaadin-grid-column path="sentCount" header="${this.t("sentCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
            <vaadin-grid-column path="openCount" header="${this.t("openCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
            <vaadin-grid-column path="postCount" header="${this.t("postCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
            <vaadin-grid-column path="pointCount" header="${this.t("pointCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
          </vaadin-grid-column-group>
        </vaadin-grid>
      </div>
    `;
  }
}

customElements.define('yp-marketing-list', YpMarketingList);