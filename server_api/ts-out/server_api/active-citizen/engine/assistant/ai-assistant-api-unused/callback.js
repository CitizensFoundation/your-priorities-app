"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowupQuestionGenCallbackHandler = exports.StreamingLLMCallbackHandler = void 0;
const base_js_1 = require("./base.js");
class StreamingLLMCallbackHandler extends base_js_1.BaseCallbackHandler {
    websocket;
    chain_starts = 0;
    chain_ends = 0;
    llm_starts = 0;
    llm_ends = 0;
    llm_streams = 0;
    tool_starts = 0;
    tool_ends = 0;
    agent_ends = 0;
    starts = 0;
    ends = 0;
    errors = 0;
    constructor(websocket) {
        super();
        this.websocket = websocket;
    }
    async on_llm_new_token(token, kwargs) {
        const resp = {
            sender: 'bot',
            message: token,
            type: 'stream'
        };
        await this.websocket.send_json(resp);
    }
    on_llm_start(serialized, prompts, kwargs) {
        this.llm_starts += 1;
        this.starts += 1;
    }
    on_llm_end(response, kwargs) {
        this.llm_ends += 1;
        this.ends += 1;
    }
    on_llm_error(error, kwargs) {
        this.errors += 1;
    }
    on_chain_start(serialized, inputs, kwargs) {
        this.chain_starts += 1;
        this.starts += 1;
    }
    on_chain_end(outputs, kwargs) {
        this.chain_ends += 1;
        this.ends += 1;
    }
    on_chain_error(error, kwargs) {
        this.errors += 1;
    }
    on_tool_start(serialized, input_str, kwargs) {
        this.tool_starts += 1;
        this.starts += 1;
    }
    on_tool_end(output, kwargs) {
        this.tool_ends += 1;
        this.ends += 1;
    }
    on_tool_error(error, kwargs) {
        this.errors += 1;
    }
    on_text(text, kwargs) {
        this.text += 1;
    }
    on_agent_finish(finish, kwargs) {
        this.agent_ends += 1;
        this.ends += 1;
    }
    on_agent_action(action, kwargs) {
        this.tool_starts += 1;
        this.starts += 1;
    }
}
exports.StreamingLLMCallbackHandler = StreamingLLMCallbackHandler;
class FollowupQuestionGenCallbackHandler extends base_js_1.BaseCallbackHandler {
    websocket;
    chain_starts = 0;
    chain_ends = 0;
    llm_starts = 0;
    llm_ends = 0;
    llm_streams = 0;
    tool_starts = 0;
    tool_ends = 0;
    agent_ends = 0;
    starts = 0;
    ends = 0;
    errors = 0;
    constructor(websocket) {
        super();
        this.websocket = websocket;
    }
    async on_llm_new_token(token, kwargs) {
        const resp = {
            sender: 'bot',
            message: token,
            type: 'stream_followup'
        };
        console.log(token);
        await this.websocket.send_json(resp);
    }
    on_llm_start(serialized, prompts, kwargs) {
        this.llm_starts += 1;
        this.starts += 1;
    }
    on_llm_end(response, kwargs) {
        this.llm_ends += 1;
        this.ends += 1;
    }
    on_llm_error(error, kwargs) {
        this.errors += 1;
    }
    on_chain_start(serialized, inputs, kwargs) {
        this.chain_starts += 1;
        this.starts += 1;
    }
    on_chain_end(outputs, kwargs) {
        this.chain_ends += 1;
        this.ends += 1;
    }
    on_chain_error(error, kwargs) {
        this.errors += 1;
    }
    on_tool_start(serialized, input_str, kwargs) {
        this.tool_starts += 1;
        this.starts += 1;
    }
    on_tool_end(output, kwargs) {
        this.tool_ends += 1;
        this.ends += 1;
    }
    on_tool_error(error, kwargs) {
        this.errors += 1;
    }
    on_text(text, kwargs) {
        this.text += 1;
    }
    on_agent_finish(finish, kwargs) {
        this.agent_ends += 1;
        this.ends += 1;
    }
    on_agent_action(action, kwargs) {
        this.tool_starts += 1;
        this.starts += 1;
    }
}
exports.FollowupQuestionGenCallbackHandler = FollowupQuestionGenCallbackHandler;
