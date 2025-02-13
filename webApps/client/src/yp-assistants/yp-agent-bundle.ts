import { customElement, property } from "lit/decorators.js";
import { YpAssistantBase } from "./yp-assistant-base.js";
import { YpLanguages } from "../common/languages/ypLanguages.js";
import { YpAssistantServerApi } from "./AssistantServerApi.js";
import { css, html } from "lit";
import { YpCollection } from "../yp-collection/yp-collection.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";

@customElement("yp-agent-bundle")
export class YpAgentBundle extends YpBaseElementWithLogin {
  @property({ type: Number })
  domainId!: number;

  @property({ type: String })
  subRoute?: string;

  @property({ type: Boolean })
  loggedInChecked = false;

  static override get styles() {
    return [
      super.styles,
      css`
        .container {
          background-color: var(--md-sys-color-surface-container-lowest);
          height: 100vh;
        }

        .selfStart {
          align-self: start;
        }

        .fixed {
          position: fixed;
          top: 156px;
          left: 48px;
        }

        yp-assistant,
        .assistantPlaceholder {
          width: 820px;
          max-width: 820px;
          height: 100vh;
        }

        .agentBundleLogo {
          width: 125px;
          height: 39px;
          margin-right: 64px;
          z-index: 1;
        }

        .logoContainer {
          padding: 16px;
          z-index: 1;
        }
      `,
    ];
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("subRoute") && this.subRoute) {
      const splitSubRoute = this.subRoute.split("/");
      this.domainId = parseInt(splitSubRoute[1]);
    }
  }

  //TODO: Remove when a better db driven solution is implemented
  temporaryAccessIds = [
    "d155616b-e657-47a3-bb8b-14924cdd78b8",
    "6a1e8403-8fc9-4cb5-87aa-bd768200cff3",
    "63d76e5e-33c7-477f-9dd2-c6a86a63da22",
    "b9171d79-2913-4de1-91d6-aa75c0e0e705",
    "c99f00a1-a6ea-45fa-b10e-aafb07bcebc1",
    "74bd6d20-2d4a-4964-96be-6a1c55805ac3",
    "adbca2e3-8c68-40b2-a006-fe6d6486c84b",
    "32dcf7e1-ae0b-4296-9a60-1dfd753cd4f4",
    "61ca9032-977c-48d6-b6a2-0f7d855868c9",
    "ce6bbc2c-cff7-494f-b265-99ffc1da2bd3",
    "b64adda3-f6c3-4237-82b9-28119d5cd167",
    "2fd9c777-9d3d-462e-933d-7c94ab476bbe",
    "68dc391e-959a-4c58-90de-227b567cd772",
    "9be7cf35-49ac-4cb6-99dd-0447e99a10f4",
    "9c7693f2-99e7-4957-a932-3365aab71896",
    "42c05569-2e94-443e-99d2-e7bfb039d219",
    "ebec3299-ae13-45f1-835f-c90d6052dce2",
    "67c38917-2019-414a-a642-4791701b8272",
    "56afea8c-e4bc-4ab0-bf01-1a88aba49019",
    "a229cca1-1eab-4f21-a486-ebe26a234930",
    "44c53fb7-71d8-433c-992d-f96245f6f218",
    "1f486fcc-e999-44f0-ab3a-7a17a08f632e",
    "fffd7871-d723-4a58-ba58-525a822959fa",
    "099db19a-ba91-4d31-8b05-6d2d91a8d990",
    "735b0a4e-c97d-4036-bdb2-5d7bc43f1345",
    "560ff99f-6389-4a1c-ac9b-5c9cf3cb4308",
    "956e7f74-6fc6-4e01-81b4-098c193e6450",
    "c657637d-10fc-4648-ae7c-1e0bc623aa01",
    "c5e02b14-dee7-49d2-bb27-465470ff32d9",
    "8f308d80-8d96-4a55-9ba8-6b10717746ef",
    "2e3595f2-3fbb-4b55-bc94-ee47a727a635",
    "1dec37ea-6b1f-43e6-976e-60f0a9273038",
    "0a4b2b6c-1d7b-4eb2-981c-472fc2937bda",
    "71995556-72f5-4cd4-b8e2-d5018c1bced0",
    "9b97460c-65ce-49fd-b119-e7fc49da1174",
    "ae8298b3-ea9e-4501-92ee-ca0a8cb01d9f",
    "3bc12cdd-f1a8-47f4-8bf3-fdbb422b4002",
    "5e6e30a6-467d-4fe2-a155-613084b09bba",
    "294b979a-a1df-4c82-ae93-ab7c31712ba4",
    "0ec5961b-ac18-47c6-bb18-b1ebe67df559",
    "869793b5-8e31-4576-a332-91c215fde9bc",
    "d5270856-cb59-4f2e-bda4-faee97650e89",
    "a211fb6a-b3a1-48b1-9576-d33e849558ec",
    "b6d19287-92e7-4a23-9374-731e23c29e23",
    "504ed57e-1b2e-4b71-96da-86025c69dd4c",
    "3d627ea9-4b58-47dd-b32b-ae296a17dbd8",
    "3bee89e1-7bec-4531-b532-a30a2b4dba6f",
    "cfad5e3c-6415-41d0-8e38-5725abd29b30",
    "73527e19-8ec5-411f-968d-5b327ecd468d",
    "3e5946d5-f242-4f8d-a28b-fbad186a79be",
    "635fe079-b9f8-4b0e-b4e5-c8767e472f51",
    "2b4ab1d3-b048-4a97-9da4-f720f5339cf3",
    "bcbc10a3-786f-45cb-9d71-6e60d7a17ca8",
    "4d0624b3-ffe9-4024-a719-127781221d37",
    "0d511f49-bf91-43a9-9334-dce07b51a2c7",
    "3bee89e1-7bec-4531-b532-a30a2b4dba6f",
    "cfad5e3c-6415-41d0-8e38-5725abd29b30",
    "73527e19-8ec5-411f-968d-5b327ecd468d",
    "3e5946d5-f242-4f8d-a28b-fbad186a79be",
    "635fe079-b9f8-4b0e-b4e5-c8767e472f51",
    "2b4ab1d3-b048-4a97-9da4-f720f5339cf3",
    "bcbc10a3-786f-45cb-9d71-6e60d7a17ca8",
    "4d0624b3-ffe9-4024-a719-127781221d37",
    "0d511f49-bf91-43a9-9334-dce07b51a2c7",
    "77b4bbcf-fdf7-431c-94de-cc5c4bfc39dc",
    "5d981c3c-de92-4680-a441-6372262a4220",
    "8d5c70f1-6795-4bf9-9c71-109314fc62a4",
    "55a5bf0c-50db-4a65-adb2-522bd35f7c78",
    "e8a61dac-894c-43d9-8467-b3c5c13585c5",
    "ed034349-458c-4418-bdb1-2ce3e3e7a6c7",
    "fac4488a-61c0-4fa9-adb4-746ff94e9791",
    "9069838c-03d7-4841-8ad1-a6596e759cd7",
    "fd00acf1-7d1f-464e-b49f-ca3ec9e758ca",
    "d02a91cd-6b1b-4a02-9c96-bb5d8c3ffc90",
    "0f5ea708-3078-4b92-a766-855bdbdc9577",
    "ba7018c8-3747-4e85-849b-8355e1d0b4e2",
    "77b53017-7a08-445b-8e3a-e739482f0578",
    "0092bd8d-3816-4021-a142-44b1fbd396cb",
    "baa3495c-dfa0-4926-bf14-0b82d548e64e",
    "619e2530-ebbb-4cef-b4f1-8a74919dbc54",
    "68ca3252-f91c-488b-be88-a5e3857db44c",
    "eef2e946-2266-4865-9911-c52d8dbdd3d4",
    "982cdf7f-2081-4fd2-b267-3cfb72f7ea96",
    "11fbeb2c-0e8e-4d7b-948b-90356539090b",
  ];

  override _loggedIn(event: CustomEvent) {
    this.loggedInUser = event.detail;

    if (
      !this.loggedInChecked &&
      !this.loggedInUser &&
      !localStorage.getItem("temporaryAmpliferAlphaAccessId")
    ) {
      this.loggedInChecked = true;
      if (window.appGlobals.originalQueryParameters.accessToken) {
        if (
          !this.temporaryAccessIds.includes(
            window.appGlobals.originalQueryParameters.accessToken as string
          )
        ) {
          window.location.href = "https://evoly.ai/en/amplifier/";
        } else {
          localStorage.setItem(
            "temporaryAmpliferAlphaAccessId",
            window.appGlobals.originalQueryParameters.accessToken as string
          );
        }
      } else {
        window.location.href = "https://evoly.ai/en/amplifier/";
      }
    }
    this.requestUpdate();
  }

  renderLogo() {
    return html`<div class="logoContainer">
      ${this.themeDarkMode
        ? html`
            <img
              class="agentBundleLogo"
              src="https://evoly.ai/is/img/evoly-logo.png"
            />
          `
        : html`
            <img
              class="agentBundleLogo"
              src="https://evoly.ai/is/img/evoly-logo.png"
            />
          `}
    </div> `;
  }

  override render() {
    return html`
      <div class="layout horizontal center-center container">
        <div class="selfStart fixed" hidden></div>
        ${this.domainId
          ? html` <yp-assistant
              id="assistant"
              .domainId="${this.domainId!}"
              class="selfStart"
            ></yp-assistant>`
          : html`<div class="assistantPlaceholder"></div>`}

        <div hidden class="selfStart agentBundleLogo"></div>
      </div>
    `;
  }
}
