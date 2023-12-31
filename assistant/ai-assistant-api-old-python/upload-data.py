import weaviate
from weaviate.util import get_valid_uuid
from uuid import uuid4
import time
import argparse
import psycopg2
import farmhash
import json
import os

corpus = []

def cleanup_text(text):
    return text.replace("'","").replace('"','').replace("\\","").strip()

def get_english_translation(post_id,text_type,content):

    targetLanguage = "en"

    contentHash = farmhash.hash32(content)
    indexKey = f"{text_type}-{post_id}-{targetLanguage}-%"

    #print(indexKey)

    cur = conn.cursor()
    cur.execute(f"SELECT content FROM translation_cache WHERE index_key LIKE '{indexKey}'")
    translations = cur.fetchall()
    #print(translations)

    if (len(translations) > 0):
        if (text_type=="PostAnswer"):
            #print(translations[0][0])
            #print(translations[0][0])
            # Parse translations[0][0] into JSON and return structuredAnswersJson[0].value
            return cleanup_text(json.loads(translations[0][0])[0])
        else:
            return cleanup_text(translations[0][0])
    else:
        return ""

def getDescription(post):
    if post[3] and post[3] != "":
        return post[3]
    elif post[5] and post[5] != "":
        return post[5]['structuredAnswersJson'][0]["value"]
    else:
        return ""

# Connect to postgres with the DB_NAME, DB_USER, DB_PASSWORD, and DB_HOST environment variables
conn = psycopg2.connect(
    dbname=os.environ.get("DB_NAME"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
    host=os.environ.get("DB_HOST")
)

community_id = 6176

# Get all groups from community_id

cur = conn.cursor()
cur.execute(f"SELECT id FROM groups WHERE community_id = {community_id}")
groups = cur.fetchall()

print(groups)

# Get all posts from groups using group_id

for group in groups:
    group_id = group[0]
    print(f"Group id: {group_id}")
    cur = conn.cursor()
    cur.execute(f"SELECT id,user_id,name,description,language,public_data,counter_endorsements_up,counter_endorsements_down FROM posts WHERE group_id = {group_id} AND status='published'")
    posts = cur.fetchall()
    for post in posts:
        #print(post)
        name = post[2]
        description = getDescription(post)
        language = post[4]
        #print(f"{name} - {description}")

        english_name = None
        english_description = None

        if (language=="en"):
            english_name = name
            english_description = description
        else:
            english_name = get_english_translation(post[0],"name",name)
            english_description = get_english_translation(post[0],"PostAnswer",description)

        print(f"{english_name} - {english_description}")

        corpus.append({
            "nameAndContent": name + " - " + description,
            "englishNameAndContent": f"Idea title: {english_name} Description: {english_description}",
            "postId": post[0],
            "userId": post[1],
            "name": name,
            "description": description,
            "counter_endorsements_up": post[6],
            "counter_endorsements_down": post[7],
        })

client = weaviate.Client("http://localhost:8080")

doc_upload_start = time.time()
for doc_idx, doc in enumerate(corpus):
    data_properties = {
        "nameAndContent": doc["nameAndContent"],
        "englishNameAndContent": doc["englishNameAndContent"],
        "postId": doc["postId"],
        "userId": doc["userId"],
        "postName": doc["name"],
        "postContent": doc["description"],
        "counter_endorsements_up": doc["counter_endorsements_up"],
        "counter_endorsements_down": doc["counter_endorsements_down"],
    }
    id = get_valid_uuid(uuid4())
    #client.batch.add_data_object(data_properties, "Document", id, doc_vector)
    client.data_object.create(
        data_object = data_properties,
        class_name = "Posts",
        uuid=id
    )

print(f"Uploaded {len(corpus)} documents in {time.time() - doc_upload_start} seconds.")
