"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentRealityTreeController = void 0;
const express_1 = __importDefault(require("express"));
const crtController_js_1 = require("../../../policy-synth/api/controllers/crtController.js");
const index_js_1 = __importDefault(require("../../models/index.js"));
const uuid_1 = require("uuid");
const dbModels = index_js_1.default;
const Group = dbModels.Group;
const authorization_js_1 = __importDefault(require("../../authorization.js"));
class CurrentRealityTreeController extends crtController_js_1.CurrentRealityTreeController {
    path = "/api/ltp/crt";
    router = express_1.default.Router();
    wsClients;
    constructor(wsClients) {
        super(wsClients);
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    async initializeRoutes() {
        this.router.get("/:id", authorization_js_1.default.can('view group'), this.getTree);
        this.router.post("/:id", authorization_js_1.default.can('edit group'), this.createTree);
        this.router.post("/:id/createDirectCauses", authorization_js_1.default.can('edit group'), this.createDirectCauses);
        this.router.post("/:id/addDirectCauses", authorization_js_1.default.can('edit group'), this.addDirectCauses);
        this.router.post("/:id/getRefinedCauses", authorization_js_1.default.can('edit group'), this.getRefinedCauses);
        this.router.put("/:id/reviewConfiguration", authorization_js_1.default.can('edit group'), this.reviewTreeConfiguration);
        this.router.delete("/:id", authorization_js_1.default.can('edit group'), this.deleteNode);
        this.router.put("/:id", authorization_js_1.default.can('edit group'), this.updateNode);
    }
    async getData(key) {
        console.log(`Getting data for group id: ${key}`);
        const group = await Group.findOne({
            where: {
                id: key,
            },
            attributes: ["id", "configuration"],
        });
        if (group && group.configuration && group.configuration.ltp && group.configuration.ltp.crt) {
            return group.configuration.ltp.crt;
        }
        else {
            console.log(`Group with id ${key} not found ${JSON.stringify(group.configuration.ltp)}`);
            return null;
        }
    }
    async setData(key, value) {
        console.log(`Setting data for key: ${key}`);
        const group = await Group.findOne({
            where: {
                id: key,
            },
            attributes: ["id", "configuration"],
        });
        if (group) {
            if (!group.configuration.ltp) {
                group.set('configuration.ltp', {});
            }
            group.set('configuration.ltp.crt', JSON.parse(value));
            await group.save();
            console.log(`Saving group with id ${key}`);
        }
        else {
            console.error(`Group with id ${key} not found`);
        }
    }
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
                id: req.params.id,
                context,
                undesirableEffects,
                nodes: directNodes,
            };
            await this.setData(req.params.id, JSON.stringify(newTree));
            return res.send(newTree);
        }
        catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    };
    async deleteData(key) {
        await this.setData(key, undefined);
    }
}
exports.CurrentRealityTreeController = CurrentRealityTreeController;
