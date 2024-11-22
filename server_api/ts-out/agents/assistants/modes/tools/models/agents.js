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
        if (!this.assistant.memory.currentAgentStatus?.subscriptionPlan.AgentProduct) {
            throw new Error("No current agent selected");
        }
        return this.assistant.memory.currentAgentStatus.subscriptionPlan.AgentProduct;
    }
    async getCurrentSubscription() {
        if (!this.assistant.memory.currentAgentStatus?.subscription) {
            throw new Error("No current subscription found");
        }
        return this.assistant.memory.currentAgentStatus.subscription;
    }
    async getCurrentSubscriptionPlan() {
        if (!this.assistant.memory.currentAgentStatus?.subscriptionPlan) {
            throw new Error("No current subscription plan found");
        }
        return this.assistant.memory.currentAgentStatus.subscriptionPlan;
    }
    async getCurrentAgentAndWorkflow() {
        const agent = await this.getCurrentAgent();
        const currentRun = this.assistant.memory.currentAgentStatus?.activeAgentRun;
        if (!currentRun) {
            return {
                agent,
                run: undefined,
            };
        }
        return { agent, run: currentRun };
    }
    convertToUnderscores(str) {
        return str
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/([A-Z])/g, '_$1') // Add underscore before capital letters
            .replace(/^_/, '') // Remove leading underscore
            .replace(/-/g, '_') // Replace hyphens with underscores
            .replace(/_+/g, '_') // Replace multiple underscores with single
            .toLowerCase();
    }
    async startCurrentWorkflowStep(agentRun, structuredAnswersOverrides) {
        try {
            const agentRunToUpdate = await YpAgentProductRun.findByPk(agentRun.id);
            if (!agentRunToUpdate) {
                throw new Error("Agent run not found");
            }
            if (!this.assistant.memory.currentAgentStatus?.subscription) {
                throw new Error("No active subscription found for this agent");
            }
            const workflow = agentRunToUpdate.workflow;
            const totalSteps = workflow.steps.length;
            let currentStepIndex = workflow.currentStepIndex;
            let currentStep = workflow.steps[currentStepIndex];
            const isLastStep = currentStepIndex >= totalSteps - 1;
            console.log(`oldStep: ${JSON.stringify(currentStep, null, 2)}`);
            if (currentStep.type !== "agentOps" && !isLastStep) {
                workflow.currentStepIndex++;
                currentStepIndex = workflow.currentStepIndex;
                currentStep = workflow.steps[currentStepIndex];
            }
            console.log(`newStep: ${JSON.stringify(currentStep, null, 2)}`);
            if (currentStepIndex >= totalSteps) {
                throw new Error(`Agent run ${agentRun.id} is already at the last step of the workflow`);
            }
            const agentId = currentStep.agentId;
            if (!agentId) {
                throw new Error("No agent ID found in the current step");
            }
            // Start processing with websocket client ID
            const jobId = await this.queueManager.startAgentProcessingWithWsClient(agentId, agentRun.id, this.assistant.wsClientId, structuredAnswersOverrides);
            if (!jobId) {
                throw new Error("Failed to start agent processing");
            }
            workflow.steps[currentStepIndex].queueJobId = jobId;
            agentRunToUpdate.status = "running";
            agentRunToUpdate.changed("workflow", true);
            await agentRunToUpdate.save();
            return {
                agentRun: agentRunToUpdate,
                message: "Agent workflow started successfully",
            };
        }
        catch (error) {
            console.error(error);
            throw new Error("Error starting agent workflow step");
        }
    }
    async getCurrentWorkflowStep() {
        const agentRun = await this.getCurrentAgentAndWorkflow();
        return agentRun.run.workflow.steps[agentRun.run.workflow.currentStepIndex];
    }
    async getNextWorkflowStep() {
        const agentRun = await this.getCurrentAgentAndWorkflow();
        //TODO: look into this deal with the difference between agentOps and engagment
        if (agentRun.run.workflow.currentStepIndex === 0) {
            return agentRun.run.workflow.steps[0];
        }
        if (agentRun.run.workflow.currentStepIndex >= agentRun.run.workflow.steps.length - 1) {
            return undefined;
        }
        return agentRun.run.workflow.steps[agentRun.run.workflow.currentStepIndex + 1];
    }
    async stopCurrentWorkflowStep() {
        console.log("---------------------> stopCurrentWorkflowStep");
        const agent = await this.getCurrentAgent();
        const currentRun = (await YpAgentProductRun.findByPk(this.assistant.memory.currentAgentStatus?.activeAgentRun?.id));
        if (!currentRun) {
            throw new Error("No active workflow found to stop");
        }
        const currentStep = currentRun.workflow.steps[currentRun.workflow.currentStepIndex];
        // Stop processing using queue manager
        await this.queueManager.pauseAgentProcessing(agent.id);
        // Update run status
        currentRun.status = "ready";
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
