"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentRealityTreeController = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const crtCreateNodes_js_1 = require("../ltp/crtCreateNodes.js");
const crtAssistant_js_1 = require("../ltp/crtAssistant.js");
const uuid_1 = require("uuid");
const crtConfigReview_js_1 = require("../ltp/crtConfigReview.js");
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = (0, redis_1.createClient)({
        url: process.env.REDIS_URL,
        socket: {
            tls: true,
        },
    });
}
else {
    redisClient = (0, redis_1.createClient)({
        url: "redis://localhost:6379",
    });
}
class CurrentRealityTreeController {
    path = "/api/crt";
    router = express_1.default.Router();
    wsClients = new Map();
    constructor(wsClients) {
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    async initializeRoutes() {
        this.router.get(this.path + "/:id", this.getTree);
        this.router.post(this.path, this.createTree);
        this.router.post(this.path + "/:id/createDirectCauses", this.createDirectCauses);
        this.router.post(this.path + "/:id/addDirectCauses", this.addDirectCauses);
        this.router.post(this.path + "/:id/getRefinedCauses", this.getRefinedCauses);
        this.router.put(this.path + "/reviewConfiguration", this.reviewTreeConfiguration);
        this.router.delete(this.path + "/:id", this.deleteNode);
        this.router.put(this.path + "/:id", this.updateNode);
        await redisClient.connect();
    }
    updateNode = async (req, res) => {
        const treeId = req.params.id;
        const updatedNode = req.body;
        console.log(`Updating node ID: ${updatedNode.id}`);
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                return res.sendStatus(404);
            }
            const currentTree = treeData;
            // Update the node in the tree
            const nodeToUpdate = this.findNode(currentTree.nodes, updatedNode.id);
            if (!nodeToUpdate) {
                return res.status(404).send({ message: "Node not found" });
            }
            Object.assign(nodeToUpdate, updatedNode);
            await this.setData(treeId, JSON.stringify(currentTree));
            return res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    deleteNode = async (req, res) => {
        const treeId = req.params.id;
        const nodeId = req.body.nodeId;
        console.log(`Deleting node ID: ${nodeId}`);
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                return res.sendStatus(404);
            }
            const currentTree = treeData;
            // Find the parent of the node to be deleted
            const parentNode = this.findParentNode(currentTree.nodes, nodeId);
            if (!parentNode) {
                return res.status(404).send({ message: "Parent node not found" });
            }
            // Remove the node from the parent's children
            parentNode.andChildren = parentNode.andChildren?.filter((child) => child.id !== nodeId);
            parentNode.orChildren = parentNode.orChildren?.filter((child) => child.id !== nodeId);
            await this.setData(treeId, JSON.stringify(currentTree));
            return res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    getRefinedCauses = async (req, res) => {
        console.log("getRefinedCauses");
        const treeId = req.params.id;
        const { crtNodeId, chatLog, wsClientId, } = req.body;
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                console.error("Tree not found");
                return res.sendStatus(404);
            }
            const currentTree = treeData;
            const parentNode = this.findNode(currentTree.nodes, crtNodeId);
            if (!parentNode) {
                console.error("Parent node not found");
                return res.sendStatus(404);
            }
            const nearestUdeNode = this.findNearestUde(currentTree.nodes, parentNode.id);
            if (!nearestUdeNode) {
                console.error("Nearest UDE node not found for: " + crtNodeId);
                console.log(JSON.stringify(currentTree, null, 2));
                return res.sendStatus(404);
            }
            await (0, crtAssistant_js_1.getRefinedCauses)(currentTree, wsClientId, this.wsClients, parentNode, nearestUdeNode.description, chatLog, parentNode.type == "ude"
                ? undefined
                : this.getParentNodes(currentTree.nodes, parentNode.id));
            return res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    addDirectCauses = async (req, res) => {
        const treeId = req.params.id;
        const parentNodeId = req.body.parentNodeId;
        const nodeType = req.body.type;
        const causeStrings = req.body.causes;
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                console.error("Tree not found");
                return res.sendStatus(404);
            }
            const currentTree = treeData;
            const parentNode = this.findNode(currentTree.nodes, parentNodeId);
            if (!parentNode) {
                console.error("Parent node not found");
                return res.sendStatus(404);
            }
            // Convert cause strings to LtpCurrentRealityTreeDataNode objects
            const newNodes = causeStrings.map((cause) => ({
                id: (0, uuid_1.v4)(),
                description: cause,
                type: nodeType == "assumption"
                    ? "assumption"
                    : parentNode.type == "ude"
                        ? "directCause"
                        : "intermediateCause",
                andChildren: [],
                orChildren: [],
                isRootCause: false,
                isLogicValidated: false,
            }));
            // Add the new nodes to the parent node's children
            if (!parentNode.andChildren) {
                parentNode.andChildren = [];
            }
            parentNode.andChildren.push(...newNodes);
            await this.setData(treeId, JSON.stringify(currentTree));
            console.log("Added new nodes to tree");
            return res.send(newNodes);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    getTree = async (req, res) => {
        const treeId = req.params.id;
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                return res.sendStatus(404);
            }
            return res.send(treeData);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    addNode = async (req, res) => {
        const treeId = req.params.id;
        const newNode = req.body;
        const parentId = req.body.parentId; // Get parentId from the request body
        try {
            const treeData = await this.getData(treeId);
            if (!treeData) {
                return res.sendStatus(404);
            }
            const currentTree = treeData;
            // Find the parent node in the tree
            const parentNode = this.findNode(currentTree.nodes, parentId);
            if (!parentNode) {
                return res.status(400).send({ message: "Parent node not found" });
            }
            // Assuming a binary tree structure for simplicity. Modify as needed for your tree structure.
            if (!parentNode.andChildren) {
                parentNode.andChildren = [];
            }
            parentNode.andChildren.push(newNode);
            await this.setData(treeId, JSON.stringify(currentTree));
            return res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    reviewTreeConfiguration = async (req, res) => {
        const { context, undesirableEffects, wsClientId, } = req.body;
        try {
            const treeToTest = {
                context,
                undesirableEffects,
                nodes: [],
                id: "n/a",
            };
            await (0, crtConfigReview_js_1.getConfigurationReview)(treeToTest, wsClientId, this.wsClients);
            return res.sendStatus(200);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    createTree = async (req, res) => {
        const { context, undesirableEffects, } = req.body;
        try {
            const directNodes = undesirableEffects.flatMap((ue) => ue
                .split("\n")
                .map((effect) => effect.trim()) // Trim each effect
                .filter((effect) => effect !== "") // Filter out empty strings
                .map((effect) => ({
                id: (0, uuid_1.v4)(),
                description: effect,
                type: "ude",
                andChildren: [],
                orChildren: [],
            })));
            const newTree = {
                id: -1,
                context,
                undesirableEffects,
                nodes: directNodes,
            };
            let treeId = await this.createData(JSON.stringify(newTree));
            newTree.id = treeId;
            await this.setData(treeId, JSON.stringify(newTree));
            return res.send(newTree);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    createDirectCauses = async (req, res) => {
        const treeId = req.params.id;
        const parentNodeId = req.body.parentNodeId;
        try {
            let treeData = await this.getData(treeId);
            if (!treeData) {
                console.error("Tree not found");
                return res.sendStatus(404);
            }
            let currentTree = treeData;
            let parentNode = this.findNode(currentTree.nodes, parentNodeId);
            if (!parentNode) {
                console.error("Parent node not found");
                return res.sendStatus(404);
            }
            const nearestUdeNode = this.findNearestUde(currentTree.nodes, parentNodeId);
            if (!nearestUdeNode) {
                console.error("Nearest UDE node not found");
                return res.sendStatus(404);
            }
            // Passing the description of the nearest UDE node to identifyCauses
            const directCausesNodes = await (0, crtCreateNodes_js_1.identifyCauses)(currentTree, nearestUdeNode.description, parentNode);
            treeData = await this.getData(treeId);
            if (!treeData) {
                console.error("Tree not found");
                return res.sendStatus(404);
            }
            currentTree = treeData;
            parentNode = this.findNode(currentTree.nodes, parentNodeId);
            parentNode.andChildren = directCausesNodes;
            await this.setData(treeId, JSON.stringify(currentTree));
            return res.send(directCausesNodes);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    async getData(key) {
        console.log(`Getting data for key: ${key}`);
        const data = await redisClient.get(`crt:${key}`);
        if (data) {
            return JSON.parse(data);
        }
        else {
            return null;
        }
    }
    async setData(key, value) {
        console.log(`Setting data for key: ${key}`);
        await redisClient.set(`crt:${key}`, value);
    }
    async createData(value) {
        const treeId = (0, uuid_1.v4)();
        this.setData(treeId, value);
        return treeId;
    }
    async deleteData(key) {
        await redisClient.del(`crt-${key}`);
    }
    getParentNodes = (nodes, childId) => {
        let parentNode = this.findParentNode(nodes, childId);
        const parentNodes = [];
        while (parentNode) {
            parentNodes.push(parentNode);
            parentNode = this.findParentNode(nodes, parentNode.id);
        }
        return parentNodes;
    };
    findNearestUde = (nodes, nodeId) => {
        console.log(`Finding nearest UDE for node ID: ${nodeId}`);
        let currentNode = this.findNode(nodes, nodeId);
        while (currentNode) {
            console.log(`Current node ID: ${currentNode.id}, type: ${currentNode.type}`);
            if (currentNode.type === "ude") {
                console.log(`Found UDE node: ${currentNode.id}`);
                return currentNode;
            }
            currentNode = this.findParentNode(nodes, currentNode.id);
        }
        console.log(`No UDE node found for node ID: ${nodeId}`);
        console.log(JSON.stringify(nodes, null, 2));
        return null;
    };
    findParentNode = (nodes, childId) => {
        console.log(`Finding parent for child ID: ${childId}`);
        for (const node of nodes) {
            console.log(`Checking if node ID: ${node.id} is parent of ${childId}`);
            if (this.isParentNode(node, childId)) {
                console.log(`Found parent ID: ${node.id} for child ID: ${childId}`);
                return node;
            }
            // Check if any children have the node as a child
            const foundParentInAndChildren = node.andChildren
                ? this.findParentNode(node.andChildren, childId)
                : null;
            if (foundParentInAndChildren) {
                return foundParentInAndChildren;
            }
            const foundParentInOrChildren = node.orChildren
                ? this.findParentNode(node.orChildren, childId)
                : null;
            if (foundParentInOrChildren) {
                return foundParentInOrChildren;
            }
        }
        console.log(`No parent found for child ID: ${childId}`);
        return null;
    };
    isParentNode = (node, childId) => {
        // Check in 'andChildren'
        if (node.andChildren &&
            node.andChildren.some((child) => child.id === childId)) {
            return true;
        }
        // Check in 'orChildren'
        if (node.orChildren &&
            node.orChildren.some((child) => child.id === childId)) {
            return true;
        }
        // Not found in this node's direct children
        return false;
    };
    findNode = (nodes, id) => {
        for (const node of nodes) {
            console.log(`Checking node ID: ${node.id}`);
            if (node.id === id) {
                console.log(`Node found with ID: ${id}`);
                return node;
            }
            if (node.andChildren) {
                const foundInAndChildren = this.findNode(node.andChildren, id);
                if (foundInAndChildren) {
                    console.log(`Node found in 'andChildren' with ID: ${id}`);
                    return foundInAndChildren;
                }
            }
            if (node.orChildren) {
                const foundInOrChildren = this.findNode(node.orChildren, id);
                if (foundInOrChildren) {
                    console.log(`Node found in 'orChildren' with ID: ${id}`);
                    return foundInOrChildren;
                }
            }
        }
        console.log(`No node found with ID: ${id}`);
        return null;
    };
}
exports.CurrentRealityTreeController = CurrentRealityTreeController;
