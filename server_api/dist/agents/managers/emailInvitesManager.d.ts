export declare class AgentInviteManager {
    /**
     * Send a notification email to group admins about the current workflow step or completion.
     */
    static sendInviteEmail(link: string, agentRunId: number, groupId: number, senderUser: UserClass, inviteeEmail: string): Promise<void>;
}
