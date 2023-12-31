import { FastAPI, Request, WebSocket, WebSocketDisconnect } from 'fastapi';
import { HTTPBasic, HTTPBasicCredentials } from 'fastapi.security';
import { StaticFiles } from 'fastapi.staticfiles';
import { Jinja2Templates } from 'fastapi.templating';
import { ChatResponse } from './schemas.js';
import { b64decode } from 'base64';
import { VectorStore } from 'langchain.vectorstores';
import { AcWeaviate } from 'vectorstores.ac_weaviate';
import { Client } from 'weaviate';
import { logging } from 'logging';
import { pickle } from 'pickle';
import { Path } from 'path';
import { Optional } from 'optional';
import { ChatManager } from './engine/chat_manager.js';
import { json } from 'json';
import { os } from 'os';
import { secrets } from 'secrets';
import { websockets } from 'websockets';

os.environ["LANGCHAIN_HANDLER"] = "langchain";

logging.basicConfig(level=logging.DEBUG);

const IS_PRODUCTION = os.environ.get("PRODUCTION");

const app = FastAPI();
app.mount("/static", StaticFiles(directory="static"), name="static");

const templates = Jinja2Templates(directory="templates");
let vectorstore: VectorStore | null = null;
let client: Client | null = null;

client = new Client("http://localhost:8080");
vectorstore = new AcWeaviate(client, "PostsIs", "shortName");
const nearText = {"concepts": ["children", "playground"], "distance": 0.25};

app.include_router(post_router);
app.include_router(community_router);

const http_basic = new HTTPBasic();

const USER = os.environ.get("HTTP_USER");
const PASSWORD = os.environ.get("HTTP_PWD");

function do_nothing() {
    // do nothing
}

function get_http_basic(): HTTPBasic | null {
    if (IS_PRODUCTION) {
        return new HTTPBasic();
    }
    return do_nothing;
}

function get_users_and_passwords() {
    const users = USER.split(',') || [];
    const passwords = PASSWORD.split(',') || [];
    return Object.fromEntries(users.map((user, i) => [user, passwords[i]]));
}

function verify_credentials(credentials: HTTPBasicCredentials | null = http_basic): HTTPBasicCredentials | null {
    if (IS_PRODUCTION) {
        if (credentials !== null) {
            const users_and_passwords = get_users_and_passwords();
            const user_password = users_and_passwords[credentials.username];
            const correct_credentials = (
                user_password !== undefined &&
                secrets.compare_digest(credentials.password, user_password)
            );

            if (!correct_credentials) {
                throw new HTTPException(
                    401,
                    "Incorrect username or password",
                    {"WWW-Authenticate": "Basic"},
                );
            }
            return credentials;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

async function websockets_auth(websocket: WebSocket) {
    const auth_header = websocket._headers.get("authorization");
    if (!auth_header) {
        await websocket.close(code=websockets.CloseCode.POLICY_VIOLATION);
        return false;
    }

    const encoded_credentials = auth_header.split(" ")[1];
    const credentials = b64decode(encoded_credentials).decode("utf-8");
    const [username, password] = credentials.split(":");

    if (!(
        secrets.compare_digest(username, USER) &&
        secrets.compare_digest(password, PASSWORD)
    )) {
        await websocket.close(code=websockets.CloseCode.POLICY_VIOLATION);
        return false;
    }

    return true;
}

app.on_event("startup", async () => {
    logging.info("loading vectorstore");
});

app.get("/{cluster_id}/{community_id}", async (request: Request, credentials: HTTPBasicCredentials = verify_credentials()) => {
    return templates.TemplateResponse("index.html", {"request": request});
});

app.websocket("/chat/{cluster_id}/{community_id}/{language}", async (websocket: WebSocket, cluster_id: string, community_id: string, language: string) => {
    if (IS_PRODUCTION && !(await websockets_auth(websocket))) {
        return;
    }

    await websocket.accept();
    const chat_manager = new ChatManager(websocket, cluster_id, community_id, language);

    while (true) {
        try {
            await chat_manager.chat_loop();
        } catch (WebSocketDisconnect) {
            logging.info("websocket disconnect");
            break;
        } catch (e) {
            logging.error(e);
            const resp = new ChatResponse(
                "bot",
                "Sorry, something went wrong. Try again.",
                "error",
            );
            await websocket.send_json(resp.dict());
        }
    }
});

if (require.main === module) {
    import uvicorn;

    if (os.environ.get("PRODUCTION") !== null) {
        uvicorn.run(app, {host: "0.0.0.0", port: 443, debug: false, log_level: "info"});
    } else {
        uvicorn.run(app, {host: "0.0.0.0", port: 9000, debug: false, log_level: "info"});
    }
}

const result = (
    client.query
    .get("PostsIs", ["shortName"])
    .with_near_text(nearText)
    .with_limit(15)
    .do()
);

console.log(json.dumps(result, indent=4));