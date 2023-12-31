from chains.chat_chain import ChatChainWithSources
from langchain.callbacks.base import AsyncCallbackManager
from langchain.callbacks.tracers import LangChainTracer
from langchain.chains import ChatVectorDBChain
from langchain.chains.chat_vector_db.prompts import CONDENSE_QUESTION_PROMPT
from langchain.chains.question_answering.stuff_prompt import PROMPT_SELECTOR
from langchain.chains.llm import LLMChain
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores.base import VectorStore

def get_qa_chain(
    vectorstore: VectorStore, question_handler, stream_handler, tracing: bool = False
) -> ChatVectorDBChain:
    """Create a ChatVectorDBChain for question/answering."""
    # Construct a ChatVectorDBChain with a streaming llm for combine docs
    # and a separate, non-streaming llm for question generation
    manager = AsyncCallbackManager([])
    question_manager = AsyncCallbackManager([question_handler])
    stream_manager = AsyncCallbackManager([stream_handler])
    if tracing:
        tracer = LangChainTracer()
        tracer.load_default_session()
        manager.add_handler(tracer)
        question_manager.add_handler(tracer)
        stream_manager.add_handler(tracer)

    question_gen_llm = ChatOpenAI(
        temperature=0,
        verbose=True,
        model="gpt-4",
        max_tokens=1200,
        callback_manager=question_manager,
    )

    streaming_llm = ChatOpenAI(
        streaming=True,
        model="gpt-4",
        callback_manager=stream_manager,
        verbose=True,
        max_tokens=1024,
        temperature=0,
    )

    question_generator = LLMChain(
        llm=question_gen_llm, prompt=CONDENSE_QUESTION_PROMPT, callback_manager=manager
    )

    doc_chain = load_qa_chain(
        streaming_llm, chain_type="stuff", prompt="", callback_manager=manager
    )

    qa = ChatChainWithSources(
        vectorstore=vectorstore,
        combine_docs_chain=doc_chain,
        question_generator=question_generator,
        top_k_docs_for_context=12,
        callback_manager=manager,
    )
    return qa
