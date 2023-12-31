"""Chain for chatting with a vector database."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple, Union

from pydantic import BaseModel
from langchain.docstore.document import Document
from langchain.chains.base import Chain
from langchain.chains.chat_vector_db.prompts import CONDENSE_QUESTION_PROMPT
from langchain.chains.combine_documents.base import BaseCombineDocumentsChain
from langchain.chains.llm import LLMChain
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts.base import BasePromptTemplate
from langchain.schema import BaseLanguageModel
from langchain.vectorstores.base import VectorStore


def _get_chat_history(chat_history: List[Tuple[str, str]]) -> str:
    buffer = ""
    for human_s, ai_s in chat_history:
        human = "Human: " + human_s
        ai = "Assistant: " + ai_s
        buffer += "\n" + "\n".join([human, ai])
    return buffer


class ChatChainWithSources(Chain, BaseModel):
    """Chain for chatting with a vector database."""

    vectorstore: VectorStore
    combine_docs_chain: BaseCombineDocumentsChain
    question_generator: LLMChain
    output_key: str = "answer"
    return_source_documents: bool = False
    top_k_docs_for_context: int = 4
    get_chat_history: Optional[Callable[[Tuple[str, str]], str]] = None
    """Return the source documents."""

    @property
    def _chain_type(self) -> str:
        return "chat-vector-db"

    @property
    def input_keys(self) -> List[str]:
        """Input keys."""
        return ["question", "chat_history"]

    @property
    def output_keys(self) -> List[str]:
        """Return the output keys.

        :meta private:
        """
        _output_keys = [self.output_key]
        if self.return_source_documents:
            _output_keys = _output_keys + ["source_documents"]
        return _output_keys

    @classmethod
    def from_llm(
        cls,
        llm: BaseLanguageModel,
        vectorstore: VectorStore,
        condense_question_prompt: BasePromptTemplate = CONDENSE_QUESTION_PROMPT,
        qa_prompt: Optional[BasePromptTemplate] = None,
        chain_type: str = "stuff",
        **kwargs: Any,
    ) -> ChatVectorDBChain:
        """Load chain from LLM."""
        doc_chain = load_qa_chain(
            llm,
            chain_type=chain_type,
            prompt=qa_prompt,
        )
        condense_question_chain = LLMChain(llm=llm, prompt=condense_question_prompt)
        return cls(
            vectorstore=vectorstore,
            combine_docs_chain=doc_chain,
            question_generator=condense_question_chain,
            **kwargs,
        )

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        question = inputs["question"]
        get_chat_history = self.get_chat_history or _get_chat_history
        chat_history_str = get_chat_history(inputs["chat_history"])
        vectordbkwargs = inputs.get("vectordbkwargs", {})
        if chat_history_str:
            new_question = self.question_generator.run(
                question=question, chat_history=chat_history_str
            )
        else:
            new_question = question
        docs = self.vectorstore.similarity_search(
            new_question, k=self.top_k_docs_for_context, **vectordbkwargs
        )
        new_inputs = inputs.copy()
        new_inputs["question"] = new_question
        answer, _ = self.combine_docs_chain.combine_docs(docs, **new_inputs)
        if self.return_source_documents:
            return {self.output_key: answer, "source_documents": docs}
        else:
            return {self.output_key: answer}

    async def _acall(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        question = inputs["question"]
        concepts = inputs["concepts"]
        group_name = inputs["group_name"]
        cluster_id = inputs["cluster_id"]
        community_id = inputs["community_id"]
        allowFilteringByGroups = inputs["allowFilteringByGroups"]
        self.combine_docs_chain.llm_chain.prompt = inputs["messages"]
        local_top_k_docs_for_context = inputs["top_k_docs_for_context"]

        vectordbkwargs = inputs.get("vectordbkwargs", {})
        new_question = question

        # TODO: This blocks the event loop, but it's not clear how to avoid it.
        if inputs['question_intent']=="asking_about_the_project_rules_and_overall_organization_of_the_project":
            docs = [Document(page_content="")]
        else:
            docs = self.vectorstore.similarity_search_concepts(
                concepts, group_name, cluster_id, community_id,
                allowFilteringByGroups,
                k=local_top_k_docs_for_context,
                #search_distance=0.5,
                **vectordbkwargs
            )
            if len(docs) == 0:
                if group_name != None:
                    docs = [
                        Document(page_content="No ideas found for context for this question and neighborhood! Please report back to the user that no ideas are found in this neighborhood for their question and never make up ideas. Just tell the users that no ideas were found for their question.", metadata="")
                    ]
                else:
                    docs = [
                        Document(page_content="No ideas found for context! Please report this back to the the user and never make up ideas. Just tell the users that no ideas were found for their question.", metadata="")
                    ]
        new_inputs = inputs.copy()
        new_inputs["question"] = new_question
        answer, _ = await self.combine_docs_chain.acombine_docs(docs, **new_inputs)
        if self.return_source_documents:
            return {self.output_key: answer, "source_documents": docs}
        else:
            return {self.output_key: answer}

    def save(self, file_path: Union[Path, str]) -> None:
        if self.get_chat_history:
            raise ValueError("Chain not savable when `get_chat_history` is not None.")
        super().save(file_path)
