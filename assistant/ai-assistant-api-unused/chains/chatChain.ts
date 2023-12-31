import { BaseModel } from "pydantic";
import { VectorStore } from "langchain/vectorstores/base";
import { BaseCombineDocumentsChain } from "langchain/chains/combine_documents/base";
import { LLMChain } from "langchain/chains/llm";
import { load_qa_chain } from "langchain/chains/question_answering";
import { BasePromptTemplate } from "langchain/prompts/base";
import { BaseLanguageModel } from "langchain/schema";
import { Chain } from "langchain/chains/base";
import { Document } from "langchain/docstore/document";
import { Path } from "path";
import { Any, Callable, Dict, List, Optional, Tuple, Union } from "typing";

function _get_chat_history(chat_history: List[Tuple<string, string>>): string {
  let buffer = "";
  for (let [human_s, ai_s] of chat_history) {
    let human = "Human: " + human_s;
    let ai = "Assistant: " + ai_s;
    buffer += "\n" + [human, ai].join("\n");
  }
  return buffer;
}

class ChatChainWithSources extends Chain, BaseModel {
  vectorstore: VectorStore;
  combine_docs_chain: BaseCombineDocumentsChain;
  question_generator: LLMChain;
  output_key: string = "answer";
  return_source_documents: boolean = false;
  top_k_docs_for_context: number = 4;
  get_chat_history: Optional<Callable<[string, string], string>> = null;

  get _chain_type(): string {
    return "chat-vector-db";
  }

  get input_keys(): List<string> {
    return ["question", "chat_history"];
  }

  get output_keys(): List<string> {
    let _output_keys = [this.output_key];
    if (this.return_source_documents) {
      _output_keys = _output_keys.concat(["source_documents"]);
    }
    return _output_keys;
  }

  static from_llm(
    llm: BaseLanguageModel,
    vectorstore: VectorStore,
    condense_question_prompt: BasePromptTemplate = CONDENSE_QUESTION_PROMPT,
    qa_prompt: Optional<BasePromptTemplate> = null,
    chain_type: string = "stuff",
    **kwargs: Any
  ): ChatVectorDBChain {
    let doc_chain = load_qa_chain(llm, chain_type=chain_type, prompt=qa_prompt);
    let condense_question_chain = new LLMChain(llm=llm, prompt=condense_question_prompt);
    return new ChatChainWithSources(
      vectorstore=vectorstore,
      combine_docs_chain=doc_chain,
      question_generator=condense_question_chain,
      **kwargs
    );
  }

  _call(inputs: Dict<string, any>): Dict<string, any> {
    let question = inputs["question"];
    let get_chat_history = this.get_chat_history || _get_chat_history;
    let chat_history_str = get_chat_history(inputs["chat_history"]);
    let vectordbkwargs = inputs.get("vectordbkwargs", {});
    let new_question = chat_history_str ? this.question_generator.run(question=question, chat_history=chat_history_str) : question;
    let docs = this.vectorstore.similarity_search(new_question, k=this.top_k_docs_for_context, **vectordbkwargs);
    let new_inputs = Object.assign({}, inputs);
    new_inputs["question"] = new_question;
    let [answer, _] = this.combine_docs_chain.combine_docs(docs, **new_inputs);
    if (this.return_source_documents) {
      return {this.output_key: answer, "source_documents": docs};
    } else {
      return {this.output_key: answer};
    }
  }

  async _acall(inputs: Dict<string, any>): Dict<string, any> {
    let question = inputs["question"];
    let concepts = inputs["concepts"];
    let group_name = inputs["group_name"];
    let cluster_id = inputs["cluster_id"];
    let community_id = inputs["community_id"];
    let allowFilteringByGroups = inputs["allowFilteringByGroups"];
    this.combine_docs_chain.llm_chain.prompt = inputs["messages"];
    let local_top_k_docs_for_context = inputs["top_k_docs_for_context"];
    let vectordbkwargs = inputs.get("vectordbkwargs", {});
    let new_question = question;
    if (inputs['question_intent'] == "asking_about_the_project_rules_and_overall_organization_of_the_project") {
      docs = [new Document(page_content="")];
    } else {
      docs = this.vectorstore.similarity_search_concepts(
        concepts, group_name, cluster_id, community_id,
        allowFilteringByGroups,
        k=local_top_k_docs_for_context,
        **vectordbkwargs
      );
      if (docs.length == 0) {
        if (group_name != null) {
          docs = [
            new Document(page_content="No ideas found for context for this question and neighborhood! Please report back to the user that no ideas are found in this neighborhood for their question and never make up ideas. Just tell the users that no ideas were found for their question.", metadata="")
          ];
        } else {
          docs = [
            new Document(page_content="No ideas found for context! Please report this back to the the user and never make up ideas. Just tell the users that no ideas were found for their question.", metadata="")
          ];
        }
      }
    }
    let new_inputs = Object.assign({}, inputs);
    new_inputs["question"] = new_question;
    let [answer, _] = await this.combine_docs_chain.acombine_docs(docs, **new_inputs);
    if (this.return_source_documents) {
      return {this.output_key: answer, "source_documents": docs};
    } else {
      return {this.output_key: answer};
    }
  }

  save(file_path: Union<Path, string>): void {
    if (this.get_chat_history) {
      throw new ValueError("Chain not savable when `get_chat_history` is not None.");
    }
    super().save(file_path);
  }
}