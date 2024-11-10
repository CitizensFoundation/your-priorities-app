// commonTools.ts
export class CommonTools {
    constructor(assistant) {
        this.assistant = assistant;
    }
    async logIn(params) {
        // Implement log in logic
        const { username, password } = params;
        // Validate credentials
        const isValid = await this.assistant.authService.validateCredentials(username, password);
        if (isValid) {
            this.assistant.isLoggedIn = true;
            return {
                success: true,
                data: { message: 'Logged in successfully' },
            };
        }
        else {
            return {
                success: false,
                error: 'Invalid username or password',
            };
        }
    }
    async logOut(params) {
        // Implement log out logic with confirmation
        const { confirmLogout } = params;
        if (!confirmLogout) {
            return {
                success: false,
                error: 'Please confirm that you want to log out',
            };
        }
        this.assistant.isLoggedIn = false;
        this.assistant.isSubscribedToCurrentAgent = false;
        this.assistant.hasConfiguredCurrentAgent = false;
        this.assistant.isCurrentAgentRunning = false;
        return {
            success: true,
            data: { message: 'Logged out successfully' },
        };
    }
    // Subscription management tools
    async subscribeToAgent(params) {
        // Implement subscription logic
    }
    async unsubscribeFromAgent(params) {
        // Implement unsubscription logic with confirmation
    }
    // Navigation tool
    async goBackToMainAssistant() {
        await this.assistant.handleModeSwitch('agent_subscription_and_selection', 'User requested to return to the main assistant', {});
        return {
            success: true,
            data: { message: 'Returned to main assistant' },
        };
    }
}
