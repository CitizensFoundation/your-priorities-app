import { NotificationAgentQueueManager } from "../../../../managers/notificationAgentQueueManager.js";
import { YpAgentProductRun } from "../../../../models/agentProductRun.js";
import { SubscriptionModels } from "./subscriptions.js";
export class AgentModels {
    constructor(assistant) {
        this.assistant = assistant;
        this.subscriptionModels = new SubscriptionModels(assistant);
        this.queueManager = new NotificationAgentQueueManager(this.assistant.wsClients);
    }
    async getCurrentAgent() {
        if (!this.assistant.memory.currentAgentStatus?.agentProduct) {
            throw new Error("No current agent selected");
        }
        return this.assistant.memory.currentAgentStatus.agentProduct;
    }
    async getCurrentAgentAndWorkflow() {
        const agent = await this.getCurrentAgent();
        const currentRun = this.assistant.memory.currentAgentStatus?.agentRun;
        if (!currentRun) {
            return {
                agent,
                run: undefined,
            };
        }
        return { agent, run: currentRun };
    }
    async startAgentWorkflow() {
        const agent = await this.getCurrentAgent();
        if (!this.assistant.memory.currentAgentStatus?.subscription) {
            throw new Error("No active subscription found for this agent");
        }
        // Create new run
        const newRun = await YpAgentProductRun.create({
            subscription_id: this.assistant.memory.currentAgentStatus.subscription.id,
            start_time: new Date(),
            status: "running",
            workflow: agent.configuration.workflow,
        });
        // Get or create a websocket client ID for this session
        const wsClientId = this.assistant.memory?.redisKey || `client_${Date.now()}`;
        // Start processing with websocket client ID
        await this.queueManager.startAgentProcessingWithWsClient(agent.id, newRun.id, wsClientId);
        return {
            agent,
            run: newRun,
            message: "Agent workflow started successfully",
        };
    }
    async stopAgentWorkflow() {
        const agent = await this.getCurrentAgent();
        const currentRun = this.assistant.memory.currentAgentStatus?.agentRun;
        if (!currentRun) {
            throw new Error("No active workflow found to stop");
        }
        // Stop processing using queue manager
        await this.queueManager.pauseAgentProcessing(agent.id);
        // Update run status
        currentRun.status = "cancelled";
        currentRun.end_time = new Date();
        await currentRun.save();
        // Get current status from queue manager
        const queueStatus = await this.queueManager.getAgentStatus(agent.id);
        if (queueStatus) {
            console.log(`Current queue status for agent ${agent.id}:`, queueStatus);
        }
        return {
            agent,
            run: currentRun,
            message: "Agent workflow stopped successfully",
        };
    }
    async checkAgentStatus() {
        const agent = await this.getCurrentAgent();
        return this.queueManager.getAgentStatus(agent.id);
    }
}
