// commonTools.ts
import { BaseAssistantTools } from "./baseTools.js";
import log from "../../../../utils/loggerTs.js";
export class LoginAssistantTools extends BaseAssistantTools {
    constructor(assistant) {
        super(assistant);
    }
    showLogin(description) {
        return {
            name: "show_login_widget",
            description,
            type: "function",
            parameters: {
                type: "object",
                properties: {},
                required: [],
            },
            handler: this.showLoginHandler.bind(this),
        };
    }
    async showLoginHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: showLogin: ${JSON.stringify(params, null, 2)}`);
        try {
            await this.updateHaveShownLoginWidget();
            const html = `<yp-login-widget
            id="userLogin"
            class="loginSurface"
            fullWithLoginButton
          ></yp-login-widget>`;
            return {
                success: true,
                html,
                uniqueToken: "loginWidget",
                data: { message: "Login widget shown successfully" },
                metadata: {
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to login";
            log.error(`Failed to login: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    get clickMainLoginButton() {
        return {
            name: "click_main_login_button",
            description: "Send an event to click the main login button to the web app",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.clickMainLoginButtonHandler.bind(this),
        };
    }
    async clickMainLoginButtonHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: clickMainLoginButton: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
            name: "ui_click",
            details: "login-button-main",
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
            description: "Submit an event to click the Google login button to the web app",
            type: "function",
            parameters: {
                type: "object",
                properties: {},
            },
            handler: this.clickGoogleLoginButtonHandler.bind(this),
        };
    }
    async clickGoogleLoginButtonHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: clickGoogleLoginButton: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
            name: "ui_click",
            details: "login-button-google",
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
            description: "Log out from the system with confirmation if the user asks for it. If this tools is showing it means that the user is already logged in.",
            type: "function",
            parameters: {
                type: "object",
                properties: {
                    confirmLogout: { type: "boolean" },
                },
                required: [
                    "confirmLogout",
                ],
            },
            handler: this.logoutHandler.bind(this),
        };
    }
    async logoutHandler(params) {
        params = this.assistant.getCleanedParams(params);
        log.info(`handler: logout: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
            name: "ui_click",
            details: {
                element: "logout",
            },
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
                data: { message: "UI Event for logout sent successfully" },
                clientEvents: [clientEvent],
                metadata: {
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to logout";
            log.error(`Failed to logout: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
