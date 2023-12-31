"""Create a ChatVectorDBChain for question/answering."""
from langchain.callbacks.base import AsyncCallbackManager
from langchain.callbacks.tracers import LangChainTracer
from langchain.chains import ChatVectorDBChain
from langchain.chains.chat_vector_db.prompts import (CONDENSE_QUESTION_PROMPT,
                                                     QA_PROMPT)
from langchain.chains.llm import LLMChain
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAIChat
from langchain.vectorstores.base import VectorStore
from langchain.prompts.prompt import PromptTemplate


condense_template = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
When a user ask for an image or images always write them out in the image in the markdown inline image format.
When the user asks for a list of ideas show at most 10 ideas in a list and then say: and more...
ALWAYS return a "SOURCES" part in your answer with the sources you used to answer the question.


Chat History:

{chat_history}

Follow Up Input: {question}

Standalone question:"""

prompt_template = """
Always be polite, positive and upbeat.
When a user ask for an image or images always write them out in the image in the markdown inline image format.
When the user asks for a list of ideas show at most 10 ideas in a list and then say: \n\nAnd more...
Use the following pieces of context to answer the users question about ideas in a participatory budgeting project.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
ALWAYS return all the sources as a part of your answer from the <|source=source_number|> markup

{context}

Question: {question}

Helpful Answer:

Sources:

"""

QA_PROMPT_WITH_SOURCES = PromptTemplate(
    template=prompt_template, input_variables=["context", "question"]
)

CONDESE_QUESTION_WITH_SOURCE = PromptTemplate(
    template=condense_template, input_variables=["chat_history", "question"]
)

def get_chain(
    vectorstore: VectorStore, question_handler, stream_handler, tracing: bool = False
) -> ChatVectorDBChain:
    """Create a ChatVectorDBChain for question/answering."""
    # Construct a ChatVectorDBChain with a streaming llm for combine docs
    # and a separate, non-streaming llm for question generation
    manager = AsyncCallbackManager([])
    question_manager = AsyncCallbackManager([question_handler])
    stream_manager = AsyncCallbackManager([stream_handler])
    if True or tracing:
        tracer = LangChainTracer()
        tracer.load_default_session()
        manager.add_handler(tracer)
        question_manager.add_handler(tracer)
        stream_manager.add_handler(tracer)

    question_gen_llm = OpenAIChat(
        temperature=0.2,
        verbose=True,
        max_tokens=720,
        model="gpt-3.5-turbo",
        callback_manager=question_manager,
    )
    streaming_llm = OpenAIChat(
        streaming=True,
        callback_manager=stream_manager,
        model="gpt-3.5-turbo",
        max_tokens=720,
        verbose=True,
        temperature=0.2,
    )

    print(CONDENSE_QUESTION_PROMPT)
    print()
    print(QA_PROMPT)

    question_generator = LLMChain(
        llm=question_gen_llm, prompt=CONDENSE_QUESTION_PROMPT, callback_manager=manager
    )
    doc_chain = load_qa_chain(
        streaming_llm, chain_type="stuff", prompt=QA_PROMPT_WITH_SOURCES, callback_manager=manager
    )

    # When a user ask for an image or images always write them out in the image in the markdown inline image format.

    qa = ChatVectorDBChain(
        vectorstore=vectorstore,
        combine_docs_chain=doc_chain,
        question_generator=question_generator,
        callback_manager=manager,
        top_k_docs_for_context=15,
        verbose=True,
        tracing=True
    )

    return qa
