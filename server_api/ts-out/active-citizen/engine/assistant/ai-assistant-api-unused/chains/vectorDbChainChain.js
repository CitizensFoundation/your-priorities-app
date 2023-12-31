"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chains_chat_chain_1 = require("chains.chat_chain");
const langchain_callbacks_base_1 = require("langchain.callbacks.base");
const langchain_callbacks_tracers_1 = require("langchain.callbacks.tracers");
const langchain_chains_chat_vector_db_prompts_1 = require("langchain.chains.chat_vector_db.prompts");
const langchain_chains_llm_1 = require("langchain.chains.llm");
const langchain_chains_question_answering_1 = require("langchain.chains.question_answering");
const langchain_chat_models_1 = require("langchain.chat_models");
function get_qa_chain(vectorstore, question_handler, stream_handler, tracing = false) {
    // Construct a ChatVectorDBChain with a streaming llm for combine docs
    // and a separate, non-streaming llm for question generation
    const manager = new langchain_callbacks_base_1.AsyncCallbackManager([]);
    const question_manager = new langchain_callbacks_base_1.AsyncCallbackManager([question_handler]);
    const stream_manager = new langchain_callbacks_base_1.AsyncCallbackManager([stream_handler]);
    if (tracing) {
        const tracer = new langchain_callbacks_tracers_1.LangChainTracer();
        tracer.load_default_session();
        manager.add_handler(tracer);
        question_manager.add_handler(tracer);
        stream_manager.add_handler(tracer);
    }
    const question_gen_llm = new langchain_chat_models_1.ChatOpenAI({
        temperature: 0,
        verbose: true,
        model: "gpt-4",
        max_tokens: 1200,
        callback_manager: question_manager,
    });
    const streaming_llm = new langchain_chat_models_1.ChatOpenAI({
        streaming: true,
        model: "gpt-4",
        callback_manager: stream_manager,
        verbose: true,
        max_tokens: 1024,
        temperature: 0,
    });
    const question_generator = new langchain_chains_llm_1.LLMChain({
        llm: question_gen_llm,
        prompt: langchain_chains_chat_vector_db_prompts_1.CONDENSE_QUESTION_PROMPT,
        callback_manager: manager,
    });
    const doc_chain = (0, langchain_chains_question_answering_1.load_qa_chain)(streaming_llm, {
        chain_type: "stuff",
        prompt: "",
        callback_manager: manager,
    });
    const qa = new chains_chat_chain_1.ChatChainWithSources({
        vectorstore: vectorstore,
        combine_docs_chain: doc_chain,
        question_generator: question_generator,
        top_k_docs_for_context: 12,
        callback_manager: manager,
    });
    return qa;
}
