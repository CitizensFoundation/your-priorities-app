import { NotificationAgentQueueManager } from "../../../../managers/notificationAgentQueueManager.js";
import { YpAgentProductRun } from "../../../../models/agentProductRun.js";
import { SubscriptionModels } from "./subscriptions.js";
import log from "../../../../../utils/loggerTs.js";
export class AgentModels {
    constructor(assistant) {
        this.assistant = assistant;
        this.subscriptionModels = new SubscriptionModels(assistant);
        this.queueManager = new NotificationAgentQueueManager(this.assistant.wsClients);
    }
    async getCurrentAgentAndWorkflow() {
        const agent = await this.assistant.getCurrentAgentProduct();
        const currentRun = await this.assistant.getCurrentAgentRun();
        if (!currentRun && !agent) {
            throw new Error("No agent or run found");
        }
        else if (!currentRun) {
            return {
                agent: agent,
                run: undefined,
            };
        }
        else {
            return {
                agent: agent,
                run: currentRun,
            };
        }
    }
    convertToUnderscoresWithMaxLength(str) {
        const converted = str
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/([A-Z])/g, "_$1") // Add underscore before capital letters
            .replace(/^_/, "") // Remove leading underscore
            .replace(/-/g, "_") // Replace hyphens with underscores
            .replace(/_+/g, "_") // Replace multiple underscores with single
            .toLowerCase();
        return converted.length > 34 ? converted.slice(0, 34) : converted;
    }
    async startCurrentWorkflowStep(agentRunId, structuredAnswersOverrides) {
        try {
            const agentRunToUpdate = await YpAgentProductRun.findByPk(agentRunId);
            if (!agentRunToUpdate) {
                throw new Error("Agent run not found");
            }
            if (!this.assistant.memory.currentAgentStatus?.subscriptionId) {
                throw new Error("No active subscription found for this agent");
            }
            const workflow = agentRunToUpdate.workflow;
            const totalSteps = workflow.steps.length;
            let currentStepIndex = workflow.currentStepIndex;
            let currentStep = workflow.steps[currentStepIndex];
            const isLastStep = currentStepIndex >= totalSteps - 1;
            log.info(`oldStep: ${JSON.stringify(currentStep, null, 2)}`);
            if (currentStep.type !== "agentOps" && !isLastStep) {
                workflow.currentStepIndex++;
                currentStepIndex = workflow.currentStepIndex;
                currentStep = workflow.steps[currentStepIndex];
            }
            currentStep.startTime = new Date();
            log.info(`newStep: ${JSON.stringify(currentStep, null, 2)}`);
            if (currentStepIndex >= totalSteps) {
                throw new Error(`Agent run ${agentRunId} is already at the last step of the workflow`);
            }
            const agentId = currentStep.agentId;
            if (!agentId) {
                throw new Error("No agent ID found in the current step");
            }
            // Start processing with websocket client ID
            const jobId = await this.queueManager.startAgentProcessingWithWsClient(agentId, agentRunId, this.assistant.wsClientId, structuredAnswersOverrides);
            if (!jobId) {
                throw new Error("Failed to start agent processing");
            }
            workflow.steps[currentStepIndex].queueJobId = jobId;
            agentRunToUpdate.status = "running";
            agentRunToUpdate.changed("workflow", true);
            await agentRunToUpdate.save();
            return {
                agentRun: agentRunToUpdate,
                previousStep: currentStep,
                currentStep: workflow.steps[currentStepIndex],
                message: "Agent workflow started successfully",
            };
        }
        catch (error) {
            log.error(error);
            throw new Error("Error starting agent workflow step");
        }
    }
    async getCurrentWorkflowStep() {
        const agentRun = await this.getCurrentAgentAndWorkflow();
        return agentRun.run.workflow.steps[agentRun.run.workflow.currentStepIndex];
    }
    async getNextWorkflowStep() {
        const agentRun = await this.getCurrentAgentAndWorkflow();
        if (!agentRun.run) {
            return undefined;
        }
        //TODO: look into this deal with the difference between agentOps and engagment
        if (agentRun.run.workflow.currentStepIndex === 0) {
            return agentRun.run.workflow.steps[0];
        }
        if (agentRun.run.workflow.currentStepIndex >=
            agentRun.run.workflow.steps.length - 1) {
            return undefined;
        }
        return agentRun.run.workflow.steps[agentRun.run.workflow.currentStepIndex + 1];
    }
    async stopCurrentWorkflowStep() {
        log.info("---------------------> stopCurrentWorkflowStep");
        const agent = await this.assistant.getCurrentAgentProduct();
        const currentRun = (await YpAgentProductRun.findByPk(this.assistant.memory.currentAgentStatus?.activeAgentRunId));
        if (!currentRun) {
            throw new Error("No active workflow found to stop");
        }
        const currentStep = currentRun.workflow.steps[currentRun.workflow.currentStepIndex];
        if (!agent) {
            throw new Error("No agent found");
        }
        if (!currentStep.agentId) {
            throw new Error("No agent ID found in the current step");
        }
        // Stop processing using queue manager
        await this.queueManager.stopAgentProcessing(currentStep.agentId, this.assistant.wsClientId, currentRun.id);
        // Update run status
        currentRun.status = "stopped";
        currentRun.end_time = new Date();
        await currentRun.save();
        // Get current status from queue manager
        const queueStatus = await this.queueManager.getAgentStatus(agent.id);
        if (queueStatus) {
            log.info(`Current queue status for agent ${agent.id}:`, queueStatus);
        }
        return {
            agent,
            run: currentRun,
            message: "Agent workflow stopped successfully",
        };
    }
    async checkAgentStatus() {
        const agent = await this.assistant.getCurrentAgentProduct();
        if (!agent) {
            throw new Error("No agent found");
        }
        return this.queueManager.getAgentStatus(agent.id);
    }
}
