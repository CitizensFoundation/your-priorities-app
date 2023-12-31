import { Request, Response } from 'express';
import { upsertCommunityInVectorStore, upsertPostInVectorStore } from './engine/vector_store.js';
import { Community } from './models/community.js';
import { Post } from './models/post.js';
import weaviate from 'weaviate';
import * as json from 'json';

const communityRouter = express.Router();
const client = new weaviate.Client("http://localhost:8080");

function getCommunityFromStore(clusterId: number, communityId: number, attributes: string[] = [
    "communityId", "name", "assistantConfiguration", "cluster_id"
]): any {
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

communityRouter.put("/api/v1/communities/:clusterId/:communityId", async (req: Request, res: Response) => {
    const clusterId = parseInt(req.params.clusterId);
    const communityId = parseInt(req.params.communityId);
    const community: Community = req.body;
    let communityFound = false;

    try {
        const result = getCommunityFromStore(clusterId, communityId, ["communityId", "cluster_id"]);
        console.log(`result: ${result}`);
        if (result["data"]["Get"]["Communities"]) {
            communityFound = true;
        } else {
            communityFound = false;
        }
    } catch {
        communityFound = false;
    }

    if (!communityFound) {
        community.communityId = communityId;
        community.clusterId = clusterId;
        await upsertCommunityInVectorStore(community);
    }

    res.status(200).send("OK");
});

communityRouter.get("/api/v1/communities/:clusterId/:communityId/:language", async (req: Request, res: Response) => {
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
    } else {
        welcomeMessage = welcomeMessages["en"];
    }

    let textInputLabel;
    if (textInputLabels[language]) {
        textInputLabel = textInputLabels[language];
    } else {
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

export default communityRouter;