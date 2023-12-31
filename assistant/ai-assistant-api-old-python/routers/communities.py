from requests import Request
from engine.vector_store import upsert_community_in_vector_store, upsert_post_in_vector_store
from fastapi import APIRouter, Response
from models.community import Community
from models.post import Post
import weaviate
import json

community_router = APIRouter()
client = weaviate.Client("http://localhost:8080")

def get_community_from_store(cluster_id, community_id, attributes=[
    "communityId", "name", "assistantConfiguration", "cluster_id"
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
                "path": ["communityId"],
                "operator": "Equal",
                "valueInt": community_id
            }
        ]
    }

    #print(f"where_filter: {where_filter}")

    return (
        client.query.
        get("Communities", attributes).
        with_limit(1).
        with_where(where_filter).
        do()
    )


@community_router.put("/api/v1/communities/{cluster_id}/{community_id}")
async def update_community(cluster_id: int, community_id: int, community: Community):
    communityFound = False

    try:
        result = get_community_from_store(cluster_id, community_id, attributes=["communityId","cluster_id"])
        print(f"result: {result}")
        if result["data"]["Get"]["Communities"]:
            communityFound = True
        else:
            communityFound = False
    except:
        communityFound = False

    if communityFound == False:
        community.community_id = community_id
        community.cluster_id = cluster_id
        await upsert_community_in_vector_store(community)

    return Response(content="OK", status_code=200)


@community_router.get("/api/v1/communities/{cluster_id}/{community_id}/{language}")
async def get_community(cluster_id: int, community_id: int, language: str):
    result = get_community_from_store(cluster_id, community_id)
    print(language)

    #print(result)
    #print(result["data"]["Get"]["Communities"][0])
    #print(result["data"]["Get"]["Communities"][0]["assistantConfiguration"])
    assistant_configuration = json.loads(result["data"]["Get"]["Communities"][0]["assistantConfiguration"])
    #print(assistant_configuration)
    welcome_messages = assistant_configuration["welcomeMessage"]
    text_input_labels = assistant_configuration["textInputLabel"]
    theme_main_color = assistant_configuration["theme"]["mainColor"]

    print(welcome_messages["en"])

    if welcome_messages[language]:
        welcome_message = welcome_messages[language]
    else:
        welcome_message =  welcome_messages["en"]

    if text_input_labels[language]:
          text_input_label = text_input_labels[language]
    else:
        text_input_label =  text_input_labels["en"]

    result["data"]["Get"]["Communities"][0]["welcomeMessage"] = welcome_message
    result["data"]["Get"]["Communities"][0]["textInputLabel"] = text_input_label
    result["data"]["Get"]["Communities"][0]["themeMainColor"] = theme_main_color
    result["data"]["Get"]["Communities"][0]["assistantConfiguration"] = None

    # result["data"]["Get"][self._index_name]:
    json_str = json.dumps(result["data"]["Get"]
                          ["Communities"][0], indent=4, default=str)
    print(json_str)
    return Response(content=json_str, status_code=200)
