"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_store_js_1 = require("./engine/vector_store.js");
const weaviate_1 = __importDefault(require("weaviate"));
const postRouter = express.Router();
const client = new weaviate_1.default.Client("http://localhost:8080");
function getPostFromStore(clusterId, postId, attributes = [
    "name", "imageUrl", "postId", "emojiSummary", "oneWordSummary"
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
                "path": ["postId"],
                "operator": "Equal",
                "valueInt": postId
            }
        ]
    };
    return client.query
        .get("PostsIs", attributes)
        .withLimit(1)
        .withWhere(whereFilter)
        .do();
}
postRouter.put("/api/v1/posts/:clusterId/:postId", async (req, res) => {
    const clusterId = parseInt(req.params.clusterId);
    const postId = parseInt(req.params.postId);
    const post = req.body;
    let postFound = false;
    try {
        const result = await getPostFromStore(clusterId, postId, ["postId"]);
        console.log(`result: ${result}`);
        if (result.data.Get.PostsIs) {
            postFound = true;
        }
        else {
            postFound = false;
        }
    }
    catch {
        postFound = false;
    }
    if (!postFound) {
        post.postId = postId;
        post.clusterId = clusterId;
        await (0, vector_store_js_1.upsertPostInVectorStore)(post);
    }
    else {
        console.log("Post already exists in vector store");
    }
    res.status(200).send("OK");
});
postRouter.get("/api/v1/posts/:clusterId/:postId", async (req, res) => {
    const clusterId = parseInt(req.params.clusterId);
    const postId = parseInt(req.params.postId);
    const result = await getPostFromStore(clusterId, postId);
    console.log(result);
    console.log(result.data.Get.PostsIs[0]);
    const jsonStr = JSON.stringify(result.data.Get.PostsIs[0], null, 4);
    console.log(jsonStr);
    res.status(200).send(jsonStr);
});
exports.default = postRouter;
