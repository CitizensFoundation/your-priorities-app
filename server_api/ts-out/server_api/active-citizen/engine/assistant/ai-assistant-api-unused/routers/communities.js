"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_store_js_1 = require("./engine/vector_store.js");
const weaviate_1 = __importDefault(require("weaviate"));
const json = __importStar(require("json"));
const communityRouter = express.Router();
const client = new weaviate_1.default.Client("http://localhost:8080");
function getCommunityFromStore(clusterId, communityId, attributes = [
    "communityId", "name", "assistantConfiguration", "cluster_id"
]) {
    const whereFilter = {
        "operator": "And",
        "operands": [
            {
                "path": ["cluster_id"],
                "operator": "Equal",
                "valueInt": clusterId
            },
            {
                "path": ["communityId"],
                "operator": "Equal",
                "valueInt": communityId
            }
        ]
    };
    return client.query
        .get("Communities", attributes)
        .withLimit(1)
        .withWhere(whereFilter)
        .do();
}
communityRouter.put("/api/v1/communities/:clusterId/:communityId", async (req, res) => {
    const clusterId = parseInt(req.params.clusterId);
    const communityId = parseInt(req.params.communityId);
    const community = req.body;
    let communityFound = false;
    try {
        const result = getCommunityFromStore(clusterId, communityId, ["communityId", "cluster_id"]);
        console.log(`result: ${result}`);
        if (result["data"]["Get"]["Communities"]) {
            communityFound = true;
        }
        else {
            communityFound = false;
        }
    }
    catch {
        communityFound = false;
    }
    if (!communityFound) {
        community.communityId = communityId;
        community.clusterId = clusterId;
        await (0, vector_store_js_1.upsertCommunityInVectorStore)(community);
    }
    res.status(200).send("OK");
});
communityRouter.get("/api/v1/communities/:clusterId/:communityId/:language", async (req, res) => {
    const clusterId = parseInt(req.params.clusterId);
    const communityId = parseInt(req.params.communityId);
    const language = req.params.language;
    const result = getCommunityFromStore(clusterId, communityId);
    console.log(language);
    const assistantConfiguration = json.loads(result["data"]["Get"]["Communities"][0]["assistantConfiguration"]);
    const welcomeMessages = assistantConfiguration["welcomeMessage"];
    const textInputLabels = assistantConfiguration["textInputLabel"];
    const themeMainColor = assistantConfiguration["theme"]["mainColor"];
    console.log(welcomeMessages["en"]);
    let welcomeMessage;
    if (welcomeMessages[language]) {
        welcomeMessage = welcomeMessages[language];
    }
    else {
        welcomeMessage = welcomeMessages["en"];
    }
    let textInputLabel;
    if (textInputLabels[language]) {
        textInputLabel = textInputLabels[language];
    }
    else {
        textInputLabel = textInputLabels["en"];
    }
    result["data"]["Get"]["Communities"][0]["welcomeMessage"] = welcomeMessage;
    result["data"]["Get"]["Communities"][0]["textInputLabel"] = textInputLabel;
    result["data"]["Get"]["Communities"][0]["themeMainColor"] = themeMainColor;
    result["data"]["Get"]["Communities"][0]["assistantConfiguration"] = null;
    const jsonStr = JSON.stringify(result["data"]["Get"]["Communities"][0], null, 4);
    console.log(jsonStr);
    res.status(200).send(jsonStr);
});
exports.default = communityRouter;
