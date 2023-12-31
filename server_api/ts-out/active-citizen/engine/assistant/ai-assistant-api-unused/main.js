"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastapi_1 = require("fastapi");
const fastapi_security_1 = require("fastapi.security");
const fastapi_staticfiles_1 = require("fastapi.staticfiles");
const fastapi_templating_1 = require("fastapi.templating");
const schemas_js_1 = require("./schemas.js");
const base64_1 = require("base64");
const vectorstores_ac_weaviate_1 = require("vectorstores.ac_weaviate");
const weaviate_1 = require("weaviate");
const logging_1 = require("logging");
const chat_manager_js_1 = require("./engine/chat_manager.js");
const json_1 = require("json");
const os_1 = require("os");
const secrets_1 = require("secrets");
const websockets_1 = require("websockets");
os_1.os.environ["LANGCHAIN_HANDLER"] = "langchain";
logging_1.logging.basicConfig(level = logging_1.logging.DEBUG);
const IS_PRODUCTION = os_1.os.environ.get("PRODUCTION");
const app = (0, fastapi_1.FastAPI)();
app.mount("/static", (0, fastapi_staticfiles_1.StaticFiles)(directory = "static"), name = "static");
const templates = (0, fastapi_templating_1.Jinja2Templates)(directory = "templates");
let vectorstore = null;
let client = null;
client = new weaviate_1.Client("http://localhost:8080");
vectorstore = new vectorstores_ac_weaviate_1.AcWeaviate(client, "PostsIs", "shortName");
const nearText = { "concepts": ["children", "playground"], "distance": 0.25 };
app.include_router(post_router);
app.include_router(community_router);
const http_basic = new fastapi_security_1.HTTPBasic();
const USER = os_1.os.environ.get("HTTP_USER");
const PASSWORD = os_1.os.environ.get("HTTP_PWD");
function do_nothing() {
    // do nothing
}
function get_http_basic() {
    if (IS_PRODUCTION) {
        return new fastapi_security_1.HTTPBasic();
    }
    return do_nothing;
}
function get_users_and_passwords() {
    const users = USER.split(',') || [];
    const passwords = PASSWORD.split(',') || [];
    return Object.fromEntries(users.map((user, i) => [user, passwords[i]]));
}
function verify_credentials(credentials = http_basic) {
    if (IS_PRODUCTION) {
        if (credentials !== null) {
            const users_and_passwords = get_users_and_passwords();
            const user_password = users_and_passwords[credentials.username];
            const correct_credentials = (user_password !== undefined &&
                secrets_1.secrets.compare_digest(credentials.password, user_password));
            if (!correct_credentials) {
                throw new HTTPException(401, "Incorrect username or password", { "WWW-Authenticate": "Basic" });
            }
            return credentials;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}
async function websockets_auth(websocket) {
    const auth_header = websocket._headers.get("authorization");
    if (!auth_header) {
        await websocket.close(code = websockets_1.websockets.CloseCode.POLICY_VIOLATION);
        return false;
    }
    const encoded_credentials = auth_header.split(" ")[1];
    const credentials = (0, base64_1.b64decode)(encoded_credentials).decode("utf-8");
    const [username, password] = credentials.split(":");
    if (!(secrets_1.secrets.compare_digest(username, USER) &&
        secrets_1.secrets.compare_digest(password, PASSWORD))) {
        await websocket.close(code = websockets_1.websockets.CloseCode.POLICY_VIOLATION);
        return false;
    }
    return true;
}
app.on_event("startup", async () => {
    logging_1.logging.info("loading vectorstore");
});
app.get("/{cluster_id}/{community_id}", async (request, credentials = verify_credentials()) => {
    return templates.TemplateResponse("index.html", { "request": request });
});
app.websocket("/chat/{cluster_id}/{community_id}/{language}", async (websocket, cluster_id, community_id, language) => {
    if (IS_PRODUCTION && !(await websockets_auth(websocket))) {
        return;
    }
    await websocket.accept();
    const chat_manager = new chat_manager_js_1.ChatManager(websocket, cluster_id, community_id, language);
    while (true) {
        try {
            await chat_manager.chat_loop();
        }
        catch (WebSocketDisconnect) {
            logging_1.logging.info("websocket disconnect");
            break;
        }
        try { }
        catch (e) {
            logging_1.logging.error(e);
            const resp = new schemas_js_1.ChatResponse("bot", "Sorry, something went wrong. Try again.", "error");
            await websocket.send_json(resp.dict());
        }
    }
});
if (require.main === module) {
    var uvicorn = ;
    if (os_1.os.environ.get("PRODUCTION") !== null) {
        uvicorn.run(app, { host: "0.0.0.0", port: 443, debug: false, log_level: "info" });
    }
    else {
        uvicorn.run(app, { host: "0.0.0.0", port: 9000, debug: false, log_level: "info" });
    }
}
const result = (client.query
    .get("PostsIs", ["shortName"])
    .with_near_text(nearText)
    .with_limit(15)
    .do());
console.log(json_1.json.dumps(result, indent = 4));
