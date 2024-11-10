// commonTools.ts
export class LoginToolHandlers {
    constructor(assistant) {
        this.assistant = assistant;
    }
    async logIn(params) {
        // Implement log in logic
        const { username, password } = params;
        // Validate credentials
        /*const isValid = await this.assistant.authService.validateCredentials(username, password);
        if (isValid) {
          this.assistant.isLoggedIn = true;
          return {
            success: true,
            data: { message: 'Logged in successfully' },
          };
        } else {
          return {
            success: false,
            error: 'Invalid username or password',
          };
        }*/
        return {
            success: true,
            data: { message: 'Logged in successfully' },
        };
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
        this.assistant.isCurrentAgentRunning = false;
        this.assistant.isSubscribedToCurrentAgent = false;
        this.assistant.hasConfiguredCurrentAgent = false;
        return {
            success: true,
            data: { message: 'Logged out successfully' },
        };
    }
}
