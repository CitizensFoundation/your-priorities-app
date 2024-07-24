var _a;
import express from "express";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { AgentCostManager } from "@policysynth/agents/operations/agentCostsManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { AgentConnectorManager } from "@policysynth/agents/operations/agentConnectorManager.js";
import { AgentRegistryManager } from "@policysynth/agents/operations/agentRegistryManager.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import auth from "../authorization.cjs";
import models from "../models/index.cjs";
import { PsAiModelSize, PsAiModelType, } from "@policysynth/agents/aiModelTypes.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
const dbModels = models;
const Group = dbModels.Group;
const User = dbModels.User;
export class PolicySynthAgentsController {
    constructor(wsClients) {
        this.path = "/api/agents";
        this.router = express.Router();
        this.getAgent = async (req, res) => {
            try {
                const agent = await this.agentManager.getAgent(req.params.id);
                res.json(agent);
            }
            catch (error) {
                console.error("Error in getAgent:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.getAgentAiModels = async (req, res) => {
            try {
                const aiModels = await this.agentManager.getAgentAiModels(parseInt(req.params.id));
                res.json(aiModels);
            }
            catch (error) {
                console.error("Error fetching agent AI models:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.removeAgentAiModel = async (req, res) => {
            try {
                await this.agentManager.removeAgentAiModel(parseInt(req.params.agentId), parseInt(req.params.modelId));
                res.json({ message: "AI model removed successfully" });
            }
            catch (error) {
                console.error("Error removing agent AI model:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.addAgentAiModel = async (req, res) => {
            try {
                const { modelId, size } = req.body;
                await this.agentManager.addAgentAiModel(parseInt(req.params.agentId), modelId, size);
                res.status(201).json({ message: "AI model added successfully" });
            }
            catch (error) {
                console.error("Error adding agent AI model:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.updateNodeConfiguration = async (req, res) => {
            const nodeType = req.params.nodeType;
            const nodeId = parseInt(req.params.nodeId);
            const updatedConfig = req.body;
            try {
                if (nodeType === "agent") {
                    await this.agentManager.updateAgentConfiguration(nodeId, updatedConfig);
                }
                else if (nodeType === "connector") {
                    await this.agentConnectorManager.updateConnectorConfiguration(nodeId, updatedConfig);
                }
                else {
                    return res.status(400).send("Invalid node type");
                }
                res.json({ message: `${nodeType} configuration updated successfully` });
            }
            catch (error) {
                console.error(`Error updating ${nodeType} configuration:`, error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.createInputConnector = async (req, res) => {
            this.createConnector(req, res, "input");
        };
        this.createOutputConnector = async (req, res) => {
            this.createConnector(req, res, "output");
        };
        this.createConnector = async (req, res, type) => {
            const { agentId } = req.params;
            const { connectorClassId, name } = req.body;
            if (!agentId || !connectorClassId || !name || !type) {
                return res
                    .status(400)
                    .send("Agent ID, connector class ID, name, and type (input/output) are required");
            }
            try {
                const createdConnector = await this.agentConnectorManager.createConnector(parseInt(agentId), connectorClassId, name, type);
                res.status(201).json(createdConnector);
            }
            catch (error) {
                console.error(`Error creating ${type} connector:`, error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.getActiveAiModels = async (req, res) => {
            try {
                const activeAiModels = await PsAiModel.findAll({
                    where: { "configuration.active": true },
                });
                res.json(activeAiModels);
            }
            catch (error) {
                console.error("Error fetching active AI models:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.getActiveAgentClasses = async (req, res) => {
            try {
                const activeAgentClasses = await this.agentRegistryManager.getActiveAgentClasses();
                res.json(activeAgentClasses);
            }
            catch (error) {
                console.error("Error fetching active agent classes:", error);
                if (error instanceof Error) {
                    res.status(500).send(`Internal Server Error: ${error.message}`);
                }
                else {
                    res.status(500).send("Internal Server Error");
                }
            }
        };
        this.getActiveConnectorClasses = async (req, res) => {
            try {
                const activeConnectorClasses = await this.agentRegistryManager.getActiveConnectorClasses();
                res.json(activeConnectorClasses);
            }
            catch (error) {
                console.error("Error fetching active connector classes:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.createAgent = async (req, res) => {
            const { name, agentClassId, aiModels, parentAgentId } = req.body;
            try {
                const createdAgent = await this.agentManager.createAgent(name, agentClassId, aiModels, parentAgentId);
                res.status(201).json(createdAgent);
            }
            catch (error) {
                console.error("Error creating agent:", error);
                if (error instanceof Error) {
                    res.status(400).send(error.message);
                }
                else {
                    res.status(500).send("Internal Server Error");
                }
            }
        };
        this.controlAgent = async (req, res) => {
            const agentId = parseInt(req.params.id);
            const action = req.body.action;
            try {
                const message = await this.agentQueueManager.controlAgent(agentId, action);
                res.json({ message });
            }
            catch (error) {
                console.error(`Error ${action}ing agent:`, error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "An unexpected error occurred" });
                }
            }
        };
        this.getAgentStatus = async (req, res) => {
            const agentId = parseInt(req.params.id);
            try {
                const status = await this.agentQueueManager.getAgentStatus(agentId);
                if (status) {
                    res.json(status);
                }
                else {
                    res.status(404).send("Agent status not found");
                }
            }
            catch (error) {
                console.error("Error getting agent status:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.updateAgentStatus = async (req, res) => {
            const agentId = parseInt(req.params.id);
            const { state, details } = req.body;
            try {
                const success = await this.agentQueueManager.updateAgentStatus(agentId, state, details);
                if (success) {
                    res.json({ message: "Agent status updated successfully" });
                }
                else {
                    res.status(404).send("Agent not found");
                }
            }
            catch (error) {
                console.error("Error updating agent status:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.startAgentProcessing = async (req, res) => {
            const agentId = parseInt(req.params.id);
            try {
                const success = await this.agentQueueManager.startAgentProcessing(agentId);
                if (success) {
                    res.json({ message: "Agent processing started successfully" });
                }
                else {
                    res.status(404).send("Agent not found");
                }
            }
            catch (error) {
                console.error("Error starting agent processing:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.pauseAgentProcessing = async (req, res) => {
            const agentId = parseInt(req.params.id);
            try {
                const success = await this.agentQueueManager.pauseAgentProcessing(agentId);
                if (success) {
                    res.json({ message: "Agent processing paused successfully" });
                }
                else {
                    res.status(404).send("Agent not found");
                }
            }
            catch (error) {
                console.error("Error pausing agent processing:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.getAgentCosts = async (req, res) => {
            try {
                const agentId = parseInt(req.params.id);
                const totalCosts = await this.agentCostManager.getAgentCosts(agentId);
                res.json(totalCosts);
            }
            catch (error) {
                console.error("Error calculating agent costs:", error);
                res.status(500).send("Internal Server Error");
            }
        };
        this.wsClients = wsClients;
        this.agentQueueManager = new AgentQueueManager();
        this.agentCostManager = new AgentCostManager();
        this.agentManager = new AgentManager();
        this.agentConnectorManager = new AgentConnectorManager();
        this.agentRegistryManager = new AgentRegistryManager();
        this.initializeRoutes();
        this.setupAiModels();
    }
    async setupAiModels() {
        setTimeout(async () => {
            console.log("Seeding test AI models");
            await this.seedTestAiModels(1);
        }, 100);
    }
    async seedTestAiModels(userId) {
        const testModel = await PsAiModel.findOne({
            where: {
                name: "Anthropic Sonnet 3.5",
            },
        });
        if (!testModel) {
            const anthropicSonnetConfig = {
                type: PsAiModelType.Text,
                modelSize: PsAiModelSize.Medium,
                provider: "anthropic",
                prices: {
                    costInTokensPerMillion: 3,
                    costOutTokensPerMillion: 15,
                    currency: "USD",
                },
                maxTokensOut: 8000,
                defaultTemperature: 0.7,
                model: "claude-3-5-sonnet-20240620",
                active: true,
            };
            const anthropicSonnet = await PsAiModel.create({
                name: "Anthropic Sonnet 3.5",
                organization_id: 1,
                user_id: userId,
                configuration: anthropicSonnetConfig,
            });
            console.log("Created test AI model:", anthropicSonnet);
            const openAiGpt4oConfig = {
                type: PsAiModelType.Text,
                modelSize: PsAiModelSize.Medium,
                provider: "openai",
                prices: {
                    costInTokensPerMillion: 5,
                    costOutTokensPerMillion: 15,
                    currency: "USD",
                },
                maxTokensOut: 4096,
                defaultTemperature: 0.7,
                model: "gpt-4o",
                active: true,
            };
            const openAiGpt4oMiniConfig = {
                type: PsAiModelType.Text,
                modelSize: PsAiModelSize.Small,
                provider: "openai",
                prices: {
                    costInTokensPerMillion: 0.15,
                    costOutTokensPerMillion: 0.6,
                    currency: "USD",
                },
                maxTokensOut: 16000,
                defaultTemperature: 0.0,
                model: "gpt-4o-mini",
                active: true,
            };
            const openAiGpt4 = await PsAiModel.create({
                name: "GPT-4o",
                organization_id: 1,
                user_id: userId,
                configuration: openAiGpt4oConfig,
            });
            console.log("Created test AI model:", openAiGpt4);
            const openAiGpt4Mini = await PsAiModel.create({
                name: "GPT-4o Mini",
                organization_id: 1,
                user_id: userId,
                configuration: openAiGpt4oMiniConfig,
            });
            console.log("Created test AI model:", openAiGpt4Mini);
            const topLevelAgentClassConfig = {
                description: "A top-level agent that coordinates other agents",
                queueName: "noqueue",
                imageUrl: "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/topLevelAgent.png",
                iconName: "coordinator",
                capabilities: [
                    "process coordination",
                    "task management",
                    "result aggregation",
                ],
                questions: [],
                requestedAiModelSizes: ["large", "medium", "small"],
                supportedConnectors: [],
            };
            await PsAgentClass.create({
                class_base_id: "c375c1fb-58ca-4372-a567-0e02b2c3d479",
                name: "Operations",
                version: 1,
                available: true,
                configuration: topLevelAgentClassConfig,
                user_id: userId,
            });
        }
        else {
            console.log("Test AI models already exist");
        }
    }
    initializeRoutes() {
        this.router.get(this.path + "/:groupId/:id", auth.can("view group"), this.getAgent);
        this.router.put(this.path + "/:groupId/:agentId/:nodeType/:nodeId/configuration", auth.can("edit group"), this.updateNodeConfiguration);
        this.router.post(this.path + "/:groupId/:id/control", auth.can("edit group"), this.controlAgent);
        this.router.get(this.path + "/:groupId/:id/status", auth.can("view group"), this.getAgentStatus);
        this.router.get(this.path + "/:groupId/:id/costs", auth.can("view group"), this.getAgentCosts);
        this.router.get(this.path + "/:groupId/registry/agentClasses", auth.can("view group"), this.getActiveAgentClasses);
        this.router.get(this.path + "/:groupId/registry/connectorClasses", auth.can("view group"), this.getActiveConnectorClasses);
        this.router.get(this.path + "/:groupId/registry/aiModels", auth.can("view group"), this.getActiveAiModels);
        this.router.post(this.path + "/:groupId", auth.can("edit group"), this.createAgent);
        this.router.post(this.path + "/:groupId/:agentId/outputConnectors", auth.can("edit group"), this.createOutputConnector);
        this.router.post(this.path + "/:groupId/:agentId/inputConnectors", auth.can("edit group"), this.createInputConnector);
        this.router.put(this.path + "/:groupId/:nodeId/:nodeType/configuration", auth.can("edit group"), this.updateNodeConfiguration);
        this.router.get(this.path + "/:groupId/:id/ai-models", auth.can("view group"), this.getAgentAiModels);
        this.router.delete(this.path + "/:groupId/:agentId/ai-models/:modelId", auth.can("edit group"), this.removeAgentAiModel);
        this.router.post(this.path + "/:groupId/:agentId/ai-models", auth.can("edit group"), this.addAgentAiModel);
    }
}
_a = PolicySynthAgentsController;
PolicySynthAgentsController.setupApiKeysForGroup = async (group) => {
    const anthropicSonnet = await PsAiModel.findOne({
        where: {
            name: "Anthropic Sonnet 3.5",
        },
    });
    const openAiGpt4 = await PsAiModel.findOne({
        where: {
            name: "GPT-4o",
        },
    });
    const openAiGpt4Mini = await PsAiModel.findOne({
        where: {
            name: "GPT-4o Mini",
        },
    });
    group.set("private_access_configuration", [
        {
            aiModelId: anthropicSonnet.id,
            apiKey: process.env.ANTHROPIC_CLAUDE_API_KEY || "",
        },
        {
            aiModelId: openAiGpt4.id,
            apiKey: process.env.OPENAI_API_KEY || "",
        },
        {
            aiModelId: openAiGpt4Mini.id,
            apiKey: process.env.OPENAI_API_KEY || "",
        },
    ]);
    await group.save();
};
