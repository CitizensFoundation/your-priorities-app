from requests import Request
from engine.vector_store import upsert_post_in_vector_store
from fastapi import APIRouter, Response
from models.post import Post
import weaviate
import json

post_router = APIRouter()
client = weaviate.Client("http://localhost:8080")


def get_post_from_store(cluster_id, post_id, attributes=[
    "name", "imageUrl", "postId", "emojiSummary", "oneWordSummary"
    ]):
    where_filter = {
        "operator": "And",
        "operands": [
            {
                "path": ["cluster_id"],
                "operator": "Equal",
                "valueInt": cluster_id
            },
            {
                "path": ["postId"],
                "operator": "Equal",
                "valueInt": post_id,
            }
        ]
    }
    return (
        client.query.
        get("PostsIs", attributes).
        with_limit(1).
        with_where(where_filter).
        do()
    )


@post_router.put("/api/v1/posts/{cluster_id}/{post_id}")
async def update_post(cluster_id: int, post_id: int, post: Post):
    postFound = False

    try:
        result = get_post_from_store(cluster_id, post_id, attributes=["postId"])
        print(f"result: {result}")
        if result["data"]["Get"]["PostsIs"]:
            postFound = True
        else:
            postFound = False
    except:
        postFound = False

    if postFound == False:
        post.post_id = post_id
        post.cluster_id = cluster_id
        await upsert_post_in_vector_store(post)
    else:
        print("Post already exists in vector store")

    return Response(content="OK", status_code=200)


@post_router.get("/api/v1/posts/{cluster_id}/{post_id}")
async def get_post(cluster_id: int, post_id: int):
    result = get_post_from_store(cluster_id, post_id)

    print(result)
    print(result["data"]["Get"]["PostsIs"][0])

    # result["data"]["Get"][self._index_name]:
    json_str = json.dumps(result["data"]["Get"]
                          ["PostsIs"][0], indent=4, default=str)
    print(json_str)
    return Response(content=json_str, status_code=200)
