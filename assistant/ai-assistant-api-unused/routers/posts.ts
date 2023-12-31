import { Request, Response } from 'express';
import { upsertPostInVectorStore } from './engine/vector_store.js';
import { Post } from './models/post.js';
import weaviate from 'weaviate';
import { json } from 'body-parser';

const postRouter = express.Router();
const client = new weaviate.Client("http://localhost:8080");

function getPostFromStore(clusterId: number, postId: number, attributes: string[] = [
    "name", "imageUrl", "postId", "emojiSummary", "oneWordSummary"
]): Promise<any> {
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

postRouter.put("/api/v1/posts/:clusterId/:postId", async (req: Request, res: Response) => {
    const clusterId = parseInt(req.params.clusterId);
    const postId = parseInt(req.params.postId);
    const post: Post = req.body;
    let postFound = false;

    try {
        const result = await getPostFromStore(clusterId, postId, ["postId"]);
        console.log(`result: ${result}`);
        if (result.data.Get.PostsIs) {
            postFound = true;
        } else {
            postFound = false;
        }
    } catch {
        postFound = false;
    }

    if (!postFound) {
        post.postId = postId;
        post.clusterId = clusterId;
        await upsertPostInVectorStore(post);
    } else {
        console.log("Post already exists in vector store");
    }

    res.status(200).send("OK");
});

postRouter.get("/api/v1/posts/:clusterId/:postId", async (req: Request, res: Response) => {
    const clusterId = parseInt(req.params.clusterId);
    const postId = parseInt(req.params.postId);
    const result = await getPostFromStore(clusterId, postId);

    console.log(result);
    console.log(result.data.Get.PostsIs[0]);

    const jsonStr = JSON.stringify(result.data.Get.PostsIs[0], null, 4);
    console.log(jsonStr);

    res.status(200).send(jsonStr);
});

export default postRouter;