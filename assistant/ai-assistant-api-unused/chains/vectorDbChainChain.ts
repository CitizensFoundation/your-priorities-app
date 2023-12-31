import { ChatChainWithSources } from 'chains.chat_chain';
import { AsyncCallbackManager } from 'langchain.callbacks.base';
import { LangChainTracer } from 'langchain.callbacks.tracers';
import { ChatVectorDBChain } from 'langchain.chains';
import { CONDENSE_QUESTION_PROMPT } from 'langchain.chains.chat_vector_db.prompts';
import { PROMPT_SELECTOR } from 'langchain.chains.question_answering.stuff_prompt';
import { LLMChain } from 'langchain.chains.llm';
import { load_qa_chain } from 'langchain.chains.question_answering';
import { ChatOpenAI } from 'langchain.chat_models';
import { VectorStore } from 'langchain.vectorstores.base';

function get_qa_chain(
  vectorstore: VectorStore,
  question_handler: any,
  stream_handler: any,
  tracing: boolean = false
): ChatVectorDBChain {
  // Construct a ChatVectorDBChain with a streaming llm for combine docs
  // and a separate, non-streaming llm for question generation
  const manager = new AsyncCallbackManager([]);
  const question_manager = new AsyncCallbackManager([question_handler]);
  const stream_manager = new AsyncCallbackManager([stream_handler]);
  if (tracing) {
    const tracer = new LangChainTracer();
    tracer.load_default_session();
    manager.add_handler(tracer);
    question_manager.add_handler(tracer);
    stream_manager.add_handler(tracer);
  }

  const question_gen_llm = new ChatOpenAI({
    temperature: 0,
    verbose: true,
    model: "gpt-4",
    max_tokens: 1200,
    callback_manager: question_manager,
  });

  const streaming_llm = new ChatOpenAI({
    streaming: true,
    model: "gpt-4",
    callback_manager: stream_manager,
    verbose: true,
    max_tokens: 1024,
    temperature: 0,
  });

  const question_generator = new LLMChain({
    llm: question_gen_llm,
    prompt: CONDENSE_QUESTION_PROMPT,
    callback_manager: manager,
  });

  const doc_chain = load_qa_chain(streaming_llm, {
    chain_type: "stuff",
    prompt: "",
    callback_manager: manager,
  });

  const qa = new ChatChainWithSources({
    vectorstore: vectorstore,
    combine_docs_chain: doc_chain,
    question_generator: question_generator,
    top_k_docs_for_context: 12,
    callback_manager: manager,
  });

  return qa;
}