import express from "express";
import { AgentQueueManager } from "@policysynth/agents/operations/agentQueueManager.js";
import { AgentCostManager } from "@policysynth/agents/operations/agentCostsManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import { AgentConnectorManager } from "@policysynth/agents/operations/agentConnectorManager.js";
import { AgentRegistryManager } from "@policysynth/agents/operations/agentRegistryManager.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import auth from "../../authorization.cjs";
import models from "../../models/index.cjs";
import { NewAiModelSetup } from "../managers/newAiModelSetup.js";
const dbModels = models;
const Group = dbModels.Group;
const User = dbModels.User;
export class PolicySynthAgentsController {
    constructor(wsClients) {
        this.path = "/api/agents";
        this.router = express.Router();
        this.replaceAgentMemory = async (req, res) => {
            try {
                const { groupId, agentId } = req.params;
                const memory = req.body;
                console.log(`Attempting to replace memory for agent ${agentId} in group ${groupId}`);
                if (!memory || Object.keys(memory).length === 0) {
                    console.log(`Received empty memory for agent ${agentId}`);
                    return res.status(400).json({ error: "Cannot save empty memory" });
                }
                try {
                    JSON.parse(JSON.stringify(memory));
                }
                catch (jsonError) {
                    console.log(`Received invalid JSON for agent ${agentId}`);
                    return res
                        .status(400)
                        .json({ error: "Invalid JSON format for memory" });
                }
                const memoryKey = await this.agentManager.getSubAgentMemoryKey(groupId, parseInt(agentId));
                if (!memoryKey) {
                    console.log(`Memory key not found for agent ${agentId}`);
                    return res
                        .status(404)
                        .json({ error: "Memory key not found for the specified agent" });
                }
                console.log(`Memory key found: ${memoryKey}`);
                await req.redisClient.set(memoryKey, JSON.stringify(memory));
                console.log(`Memory contents replaced successfully`);
                res.json({ message: "Memory replaced successfully" });
            }
            catch (error) {
                console.error("Error replacing agent memory:", error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "An unexpected error occurred" });
                }
            }
        };
        this.addExistingConnector = async (req, res) => {
            const { groupId, agentId, type } = req.params;
            const { connectorId } = req.body;
            if (!groupId || !agentId || !connectorId) {
                return res
                    .status(400)
                    .send("Group ID, agent ID and connector ID (input/output) are required");
            }
            try {
                await this.agentConnectorManager.addExistingConnector(parseInt(groupId), parseInt(agentId), parseInt(connectorId), type);
                res.status(200).json({
                    message: `Existing ${connectorId} connector added successfully`,
                });
            }
            catch (error) {
                console.error(`Error adding existing ${connectorId} connector:`, error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "An unexpected error occurred" });
                }
            }
        };
        this.getAgentMemory = async (req, res) => {
            try {
                const { groupId, agentId } = req.params;
                console.log(`Attempting to get memory for agent ${agentId} in group ${groupId}`);
                const memoryKey = await this.agentManager.getSubAgentMemoryKey(groupId, parseInt(agentId));
                if (!memoryKey) {
                    console.log(`Memory key not found for agent ${agentId}`);
                    return res
                        .status(404)
                        .json({ error: "Memory key not found for the specified agent" });
                }
                console.log(`Memory key found: ${memoryKey}`);
                const memoryContents = await req.redisClient.get(memoryKey);
                if (!memoryContents) {
                    console.log(`Memory contents not found for key ${memoryKey}`);
                    return res.status(404).json({ error: "Memory contents not found" });
                }
                console.log(`Memory contents retrieved successfully`);
                const parsedMemoryContents = JSON.parse(memoryContents);
                res.json(parsedMemoryContents);
            }
            catch (error) {
                console.error("Error retrieving agent memory:", error);
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: "An unexpected error occurred" });
                }
            }
        };
        this.getAgent = async (req, res) => {
            try {
                const agent = await this.agentManager.getAgent(req.params.groupId);
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
                const createdConnector = await this.agentConnectorManager.createConnector(parseInt(agentId), connectorClassId, req.user.id, name, type);
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
                const activeAgentClasses = await this.agentRegistryManager.getActiveAgentClasses(req.user.id);
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
                const activeConnectorClasses = await this.agentRegistryManager.getActiveConnectorClasses(req.user.id);
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
                const createdAgent = await this.agentManager.createAgent(name, agentClassId, aiModels, parseInt(req.params.groupId), req.user.id, parentAgentId);
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
        this.getAgentCostsDetail = async (req, res) => {
            try {
                const agentId = parseInt(req.params.id);
                const costRows = await this.agentCostManager.getDetailedAgentCosts(agentId);
                res.json(costRows);
            }
            catch (error) {
                console.error("Error calculating agent costs detail:", error);
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
        // Call our separated model setup methods.
        NewAiModelSetup.initializeModels();
        // Using a hardcoded userId (1) for seeding test AI models.
        NewAiModelSetup.setupAiModels(1);
    }
    /**
     * A proxy for setting up API keys for a group.
     * @param group The group instance to configure
     */
    static async setupApiKeysForGroup(group) {
        return NewAiModelSetup.setupApiKeysForGroup(group);
    }
    initializeRoutes() {
        this.router.get("/:groupId", auth.can("view group"), this.getAgent);
        this.router.put("/:groupId/:agentId/:nodeType/:nodeId/configuration", auth.can("edit group"), this.updateNodeConfiguration);
        this.router.post("/:groupId/:id/control", auth.can("edit group"), this.controlAgent);
        this.router.get("/:groupId/:id/status", auth.can("view group"), this.getAgentStatus);
        this.router.get("/:groupId/:id/costs", auth.can("view group"), this.getAgentCosts);
        this.router.get("/:groupId/:id/costs/detail", auth.can("view group"), this.getAgentCostsDetail);
        this.router.get("/:groupId/registry/agentClasses", auth.can("view group"), this.getActiveAgentClasses);
        this.router.get("/:groupId/registry/connectorClasses", auth.can("view group"), this.getActiveConnectorClasses);
        this.router.get("/:groupId/registry/aiModels", auth.can("view group"), this.getActiveAiModels);
        this.router.post("/:groupId", auth.can("edit group"), this.createAgent);
        this.router.post("/:groupId/:agentId/outputConnectors", auth.can("edit group"), this.createOutputConnector);
        this.router.post("/:groupId/:agentId/inputConnectors", auth.can("edit group"), this.createInputConnector);
        this.router.put("/:groupId/:nodeId/:nodeType/configuration", auth.can("edit group"), this.updateNodeConfiguration);
        this.router.get("/:groupId/:id/ai-models", auth.can("view group"), this.getAgentAiModels);
        this.router.delete("/:groupId/:agentId/ai-models/:modelId", auth.can("edit group"), this.removeAgentAiModel);
        this.router.post("/:groupId/:agentId/ai-models", auth.can("edit group"), this.addAgentAiModel);
        this.router.get("/:groupId/:agentId/memory", auth.can("view group"), this.getAgentMemory);
        this.router.put("/:groupId/:agentId/memory", auth.can("edit group"), this.replaceAgentMemory);
        this.router.post("/:groupId/:agentId/:type(input|output)Connectors/existing", auth.can("edit group"), this.addExistingConnector);
    }
}
