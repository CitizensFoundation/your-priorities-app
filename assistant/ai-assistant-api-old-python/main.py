"""Main entrypoint for the app."""
from routers.posts import post_router
from routers.communities import community_router
from schemas import ChatResponse
from base64 import b64decode
from langchain.vectorstores import VectorStore
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi import FastAPI, Depends, HTTPException
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
import logging
import pickle
from pathlib import Path
from typing import Optional
from engine.chat_manager import ChatManager
from vectorstores.ac_weaviate import AcWeaviate
import weaviate
import json
import os
import secrets
import websockets

os.environ["LANGCHAIN_HANDLER"] = "langchain"

logging.basicConfig(level=logging.DEBUG)

IS_PRODUCTION = os.environ.get("PRODUCTION")

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
vectorstore: Optional[VectorStore] = None
client: Optional[weaviate.Client] = None

client = weaviate.Client("http://localhost:8080")
vectorstore = AcWeaviate(client, "PostsIs", "shortName")
nearText = {"concepts": ["children", "playground"], "distance": 0.25}

app.include_router(post_router)
app.include_router(community_router)

http_basic = HTTPBasic()

USER = os.environ.get("HTTP_USER")
PASSWORD = os.environ.get("HTTP_PWD")

def do_nothing():
    pass

def get_http_basic() -> Optional[HTTPBasic]:
    if IS_PRODUCTION:
        return HTTPBasic()
    return do_nothing

def get_users_and_passwords():
    users = USER.split(',') if USER else []
    passwords = PASSWORD.split(',') if PASSWORD else []
    return dict(zip(users, passwords))

def verify_credentials(credentials: Optional[HTTPBasicCredentials] = Depends(http_basic)):
    if IS_PRODUCTION:
        if credentials is not None:
            users_and_passwords = get_users_and_passwords()
            user_password = users_and_passwords.get(credentials.username)
            correct_credentials = (
                user_password is not None and
                secrets.compare_digest(credentials.password, user_password)
            )

            if not correct_credentials:
                raise HTTPException(
                    status_code=401,
                    detail="Incorrect username or password",
                    headers={"WWW-Authenticate": "Basic"},
                )
            return credentials
        else:
            return None
    else:
        return None

async def websockets_auth(websocket: WebSocket):
    auth_header = websocket._headers.get("authorization")
    if not auth_header:
        await websocket.close(code=websockets.CloseCode.POLICY_VIOLATION)
        return False

    encoded_credentials = auth_header.split(" ")[1]
    credentials = b64decode(encoded_credentials).decode("utf-8")
    username, password = credentials.split(":")

    if not (
        secrets.compare_digest(username, USER)
        and secrets.compare_digest(password, PASSWORD)
    ):
        await websocket.close(code=websockets.CloseCode.POLICY_VIOLATION)
        return False

    return True

@app.on_event("startup")
async def startup_event():
    logging.info("loading vectorstore")

@app.get("/{cluster_id}/{community_id}")
async def get(request: Request, credentials: HTTPBasicCredentials = Depends(verify_credentials)):
    return templates.TemplateResponse("index.html", {"request": request})

@app.websocket("/chat/{cluster_id}/{community_id}/{language}")
async def websocket_endpoint(
        websocket: WebSocket,
        cluster_id: str,
        community_id: str,
        language: str):
    if IS_PRODUCTION and not await websockets_auth(websocket):
        return

    await websocket.accept()
    chat_manager = ChatManager(websocket, cluster_id, community_id, language)

    while True:
        try:
            await chat_manager.chat_loop()
        except WebSocketDisconnect:
            logging.info("websocket disconnect")
            break
        except Exception as e:
            logging.error(e)
            resp = ChatResponse(
                sender="bot",
                message="Sorry, something went wrong. Try again.",
                type="error",
            )
            await websocket.send_json(resp.dict())


if __name__ == "__main__":
    import uvicorn

    if os.environ.get("PRODUCTION") != None:
        uvicorn.run(app, host="0.0.0.0", port=443,
                    debug=False, log_level="info")
    else:
        uvicorn.run(app, host="0.0.0.0", port=9000,
                    debug=False, log_level="info")

result = (
    client.query
    .get("PostsIs", ["shortName"])
    .with_near_text(nearText)
    .with_limit(15)
    .do()
)

print(json.dumps(result, indent=4))
