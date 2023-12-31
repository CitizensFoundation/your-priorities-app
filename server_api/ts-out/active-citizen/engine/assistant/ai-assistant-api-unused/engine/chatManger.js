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
Object.defineProperty(exports, "__esModule", { value: true });
const question_analysis_js_1 = require("./chains/question_analysis.js");
const dynamic_chat_memory_js_1 = require("./memory/dynamic_chat_memory.js");
const about_project_prompt_js_1 = require("./prompts/about_project_prompt.js");
const follow_up_questions_prompt_js_1 = require("./prompts/follow_up_questions_prompt.js");
const communities_js_1 = require("./routers/communities.js");
const schemas_js_1 = require("./schemas.js");
const vector_db_chain_chain_js_1 = require("./chains/vector_db_chain_chain.js");
const callback_js_1 = require("./callback.js");
const logging = __importStar(require("logging"));
const ac_weaviate_js_1 = require("./vectorstores/ac_weaviate.js");
const weaviate = __importStar(require("weaviate"));
const traceback = __importStar(require("traceback"));
const base_js_1 = require("./langchain/callbacks/base.js");
const openai = __importStar(require("openai"));
const chains_js_1 = require("./langchain/chains.js");
const chat_models_js_1 = require("./langchain/chat_models.js");
const chat_js_1 = require("./langchain/prompts/chat.js");
let vectorstore = null;
let client = null;
client = new weaviate.Client("http://localhost:8080");
const short_summary_vectorstore = new ac_weaviate_js_1.AcWeaviate(client, "PostsIs", "shortSummary", ["group_name"]);
const full_summary_vectorstore = new ac_weaviate_js_1.AcWeaviate(client, "PostsIs", "fullSummary");
const short_summary_with_points_vectorstore = new ac_weaviate_js_1.AcWeaviate(client, "PostsIs", "shortSummaryWithPoints");
const full_summary_with_points_vectorstore = new ac_weaviate_js_1.AcWeaviate(client, "PostsIs", "fullSummaryWithPoints");
const nearText = { "concepts": ["Klambratún", "playground"] };
const result = await client.query
    .get("PostsIs", ["fullSummaryWithPoints"])
    .with_near_text(nearText)
    .with_limit(15)
    .do();
console.log(JSON.stringify(result, null, 4));
const states = {
    "waiting": {
        "start": "thinking"
    },
    "thinking": {
        "end": "responding"
    },
    "responding": {
        "reset": "waiting"
    }
};
class ChatManager {
    websocket;
    cluster_id;
    community_id;
    language;
    community;
    configuration;
    followup_question_handler;
    main_stream_handler;
    qa_chain;
    followup_question_gen_llm;
    chat_history;
    last_concepts;
    last_group_name;
    dynamic_chat_memory;
    constructor(websocket, cluster_id, community_id, language) {
        this.websocket = websocket;
        this.cluster_id = cluster_id;
        this.community_id = community_id;
        this.language = language;
        const community_results = (0, communities_js_1.get_community_from_store)(this.cluster_id, this.community_id);
        this.community = community_results["data"]["Get"]["Communities"][0];
        console.log("GOGOGOGOGGOGO");
        this.configuration = JSON.parse(this.community["assistantConfiguration"]);
        this.reset_memory();
        this.followup_question_handler = new callback_js_1.FollowupQuestionGenCallbackHandler(this.websocket);
        this.main_stream_handler = new callback_js_1.StreamingLLMCallbackHandler(this.websocket);
        this.qa_chain = (0, vector_db_chain_chain_js_1.get_qa_chain)(short_summary_vectorstore, this.followup_question_handler, this.main_stream_handler, tracing = true);
        const followup_question_manager = new base_js_1.AsyncCallbackManager(handlers = [this.followup_question_handler]);
        this.followup_question_gen_llm = new chat_models_js_1.ChatOpenAI(streaming = true, temperature = 0, model = "gpt-4", verbose = true, max_tokens = 128, callback_manager = followup_question_manager);
    }
    get_language_to_speak() {
        if (this.language == "is") {
            return "Icelandic";
        }
        else if (this.language == "es") {
            return "Estonian";
        }
        else {
            return "English";
        }
    }
    reset_memory() {
        this.chat_history = [];
        this.last_concepts = [];
        this.last_group_name = null;
        const localized_prompt = this.configuration["prompts"]["main"]["system"].replace("{language_to_use}", this.get_language_to_speak());
        this.dynamic_chat_memory = new dynamic_chat_memory_js_1.DynamicChatMemory();
        this.dynamic_chat_memory.add_system_message(chat_js_1.SystemMessagePromptTemplate.from_template(localized_prompt));
    }
    async perform_question_analysis(question) {
        const question_analysis = await (0, question_analysis_js_1.get_question_analysis)(question, this.configuration);
        console.log("----------------------");
        console.log(question_analysis);
        let group_name = null;
        let conceptsJSON = null;
        try {
            // Parse question_analysis into JSON and create a dict object
            conceptsJSON = JSON.parse(question_analysis);
            const question_intent = conceptsJSON['question_intent'];
            const concepts = conceptsJSON['concepts'];
            group_name = conceptsJSON[this.configuration["prompts"]["questionAnalysis"]["jsonKeyGroupName"]];
            if (conceptsJSON[this.configuration["prompts"]["questionAnalysis"]["jsonKeyForAskingAll"]] == true) {
                this.last_group_name = null;
            }
        }
        catch (json) { }
        JSONDecodeError;
        {
            // Handle invalid JSON input
            const question_intent = "asking_about_many_ideas";
            let concepts = [];
            if (this.last_concepts && this.last_concepts.length > 0) {
                concepts = this.last_concepts;
            }
            if (this.last_group_name && this.last_group_name.length > 0) {
                group_name = this.last_group_name;
            }
            const top_k_docs_for_context = 12;
        }
        if (concepts.length == 0) {
            concepts = this.last_concepts;
        }
        else {
            this.last_concepts = concepts;
        }
        if (group_name == null && this.last_group_name && this.last_group_name.length > 0) {
            group_name = this.last_group_name;
        }
        else {
            this.last_group_name = group_name;
        }
        // Remove by hand idea, ideas, points for, points against, pros, cons, pro, con from the concepts array
        concepts = concepts.filter(x => !["idea", "ideas", "point for", "table", "hugmyndir", "hugmynd",
            "points for", "point against", "points against", "pro", "pros", "con", "cons"].includes(x));
        console.log(conceptsJSON);
        console.log(question_intent);
        console.log("----------------------");
        console.log(concepts);
        console.log(group_name);
        console.log("----------------------");
        let question_intent = "unknown";
        let top_k_docs_for_context = 38;
        if (question_intent == "asking_about_many_ideas" || question_intent == "asking_about_the_project_rules_and_overall_organization_of_the_project") {
            this.qa_chain.vectorstore = short_summary_vectorstore;
            top_k_docs_for_context = 38;
        }
        else if (question_intent == "asking_about_one_idea") {
            this.qa_chain.vectorstore = full_summary_with_points_vectorstore;
            top_k_docs_for_context = 12;
        }
        else if (question_intent == "asking_about_points_for_or_against" || question_intent == "asking_about_pros_or_cons") {
            this.qa_chain.vectorstore = short_summary_with_points_vectorstore;
            top_k_docs_for_context = 12;
        }
        else {
            this.qa_chain.vectorstore = short_summary_vectorstore;
            top_k_docs_for_context = 38;
            question_intent = "unknown";
        }
        return {
            "question_intent": question_intent,
            "concepts": concepts,
            "group_name": group_name,
            "top_k_docs_for_context": top_k_docs_for_context
        };
    }
    async get_concepts_and_refined_question(question) {
        return result["concepts"], result["answer"];
    }
    async process_followups(question, result) {
        const start_resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "start_followup");
        await this.websocket.send_json(start_resp.dict());
        const followup_template = (0, follow_up_questions_prompt_js_1.get_follow_up_questions_prompt)(question, result["answer"], this.configuration);
        const chain = new chains_js_1.LLMChain(llm = this.followup_question_gen_llm, prompt = followup_template);
        await chain.arun({});
        const start_resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "end_followup");
        await this.websocket.send_json(start_resp.dict());
    }
    async chat_loop() {
        try {
            // Receive and send back the client message
            const question = await this.websocket.receive_text();
            if (question == "<|--reset-chat--|>") {
                this.reset_memory();
            }
            else {
                const resp = new schemas_js_1.ChatResponse(sender = "you", message = question, type = "stream");
                await this.websocket.send_json(resp.dict());
                // Construct a response
                const resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "thinking");
                await this.websocket.send_json(resp.dict());
                const moderationResponse = openai.Moderation.create(question);
                console.log(moderationResponse);
                if (moderationResponse["results"][0].flagged) {
                    const resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "moderation_error");
                    await this.websocket.send_json(resp.dict());
                    console.log(`The question is flagged as inappropriate ${question} ${moderationResponse}`);
                }
                else {
                    const question_analysis = await this.perform_question_analysis(question);
                    if (question_analysis["question_intent"] == "asking_about_many_ideas" || question_analysis["question_intent"] == "unknown") {
                        question = `${question}`;
                    }
                    const previous_chat_messages = this.dynamic_chat_memory.chat_memory.messages.copy();
                    previous_chat_messages.append(chat_js_1.HumanMessagePromptTemplate.from_template("{question}"));
                    const start_resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "start");
                    await this.websocket.send_json(start_resp.dict());
                    if (false && question_analysis["question_intent"] == "asking_about_the_project_rules_and_overall_organization_of_the_project") {
                        const current_messages = (0, about_project_prompt_js_1.get_about_project_prompt)(question);
                    }
                    else {
                        const current_messages = chat_js_1.ChatPromptTemplate.from_messages(previous_chat_messages);
                    }
                    const result = await this.qa_chain.acall({
                        "cluster_id": this.cluster_id,
                        "community_id": this.community_id,
                        "question": question,
                        "messages": current_messages,
                        "allowFilteringByGroups": this.configuration["allowFilteringByGroups"],
                        "question_intent": question_analysis["question_intent"],
                        "concepts": question_analysis["concepts"],
                        "group_name": question_analysis["group_name"],
                        "top_k_docs_for_context": question_analysis["top_k_docs_for_context"],
                        "chat_history": []
                    });
                    const end_resp = new schemas_js_1.ChatResponse(sender = "bot", message = "", type = "end");
                    await this.websocket.send_json(end_resp.dict());
                    this.dynamic_chat_memory.save_context({ "input": question }, { "output": result["answer"] });
                    // TODO: What is there is an error then the pairs go out of sync
                    await this.process_followups(question, result);
                    await this.dynamic_chat_memory.process_memory();
                    const tasks = [
                    //this.process_followups(question, result),
                    //this.dynamic_chat_memory.process_memory()
                    ];
                    //await asyncio.gather(*tasks);
                }
            }
        }
        catch (WebSocketDisconnect) {
            logging.info("websocket disconnect");
        }
        try { }
        catch (Exception) {
            console.log(traceback.format_exc());
            logging.error(Exception);
            throw Exception;
        }
    }
}
