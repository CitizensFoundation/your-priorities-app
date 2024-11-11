// commonTools.ts
import { BaseAssistantTools } from "./baseTools.js";
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to login";
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
                properties: {},
            },
            handler: this.clickMainLoginButtonHandler.bind(this),
        };
    }
    async clickMainLoginButtonHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: clickMainLoginButton: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
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
                properties: {},
            },
            handler: this.clickGoogleLoginButtonHandler.bind(this),
        };
    }
    async clickGoogleLoginButtonHandler(params) {
        params = this.assistant.getCleanedParams(params);
        console.log(`handler: clickGoogleLoginButton: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
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
        console.log(`handler: logout: ${JSON.stringify(params, null, 2)}`);
        const clientEvent = {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to logout";
            console.error(`Failed to logout: ${errorMessage}`);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}
