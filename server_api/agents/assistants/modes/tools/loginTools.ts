// commonTools.ts

import { YpAgentAssistant } from "../../agentAssistant.js";
import { BaseAssistantTools } from "./baseTools.js";

export class LoginAssistantTools extends BaseAssistantTools {
  constructor(assistant: YpAgentAssistant) {
    super(assistant);
  }

  showLogin(description: string) {
    return {
      name: "show_login_widget",
      description,
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
        required:
          [] as const satisfies readonly (keyof YpAgentEmptyProperties)[],
      },
      handler: this.showLoginHandler.bind(this),
    };
  }

  public async showLoginHandler(params: {}): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as {};
    console.log(`handler: showLogin: ${JSON.stringify(params, null, 2)}`);

    try {
      await this.updateHaveShownLoginWidget();

      const html = `<yp-login
            id="userLogin"
            class="loginSurface"
            fullWithLoginButton
          ></yp-login>`;

      return {
        success: true,
        html,
        data: { message: "Login widget shown successfully" },
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login";
      console.error(`Failed to login: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  get clickMainLoginButton() {
    return {
      name: "click_main_login_button",
      description: "Click the main login button",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.clickMainLoginButtonHandler.bind(this),
    };
  }

  public async clickMainLoginButtonHandler(params: {}): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as {};
    console.log(`handler: clickMainLoginButton: ${JSON.stringify(params, null, 2)}`);
    const clientEvent: ToolClientEvent = {
      name: "click_main_login_button",
      details: {},
    };

    return {
      success: true,
      data: { message: "Main login button clicked successfully" },
      clientEvents: [clientEvent],
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  get clickGoogleLoginButton() {
    return {
      name: "click_google_login_button",
      description: "Click the Google login button",
      type: "function",
      parameters: {
        type: "object",
        properties: {} as YpAgentEmptyProperties,
      },
      handler: this.clickGoogleLoginButtonHandler.bind(this),
    };
  }

  public async clickGoogleLoginButtonHandler(params: {}): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as {};
    console.log(
      `handler: clickGoogleLoginButton: ${JSON.stringify(params, null, 2)}`
    );

    const clientEvent: ToolClientEvent = {
      name: "click_google_login_button",
      details: {},
    };

    return {
      success: true,
      data: { message: "Google login button clicked successfully" },
      clientEvents: [clientEvent],
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  get logout() {
    return {
      name: "logout",
      description: "Log out from the system with confirmation",
      type: "function",
      parameters: {
        type: "object",
        properties: {
          confirmLogout: { type: "boolean" },
        } as YpAssistantLogoutProperties,
        required: [
          "confirmLogout",
        ] as const satisfies readonly (keyof YpAssistantLogoutProperties)[],
      },
      handler: this.logoutHandler.bind(this),
    };
  }

  public async logoutHandler(
    params: YpAssistantLogoutParams
  ): Promise<ToolExecutionResult> {
    params = this.assistant.getCleanedParams(params) as YpAssistantLogoutParams;
    console.log(`handler: logout: ${JSON.stringify(params, null, 2)}`);

    const clientEvent: ToolClientEvent = {
      name: "logout",
      details: { confirmLogout: params.confirmLogout },
    };

    try {
      if (!params.confirmLogout) {
        return {
          success: false,
          error: "Please confirm that you want to log out",
        };
      }

      return {
        success: true,
        data: { message: "Logged out successfully" },
        clientEvents: [clientEvent],
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to logout";
      console.error(`Failed to logout: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}