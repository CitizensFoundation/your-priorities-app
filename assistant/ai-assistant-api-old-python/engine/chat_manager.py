"""Main entrypoint for the app."""
from chains.question_analysis import get_question_analysis
from memory.dynamic_chat_memory import DynamicChatMemory
from prompts.about_project_prompt import get_about_project_prompt
from prompts.follow_up_questions_prompt import get_follow_up_questions_prompt
from routers.communities import get_community_from_store
from routers.posts import post_router
from schemas import ChatResponse
from chains.vector_db_chain_chain import get_qa_chain
from callback import FollowupQuestionGenCallbackHandler, StreamingLLMCallbackHandler
from langchain.vectorstores import VectorStore
from schemas import ChatResponse
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
import logging
import pickle
from pathlib import Path
from typing import Optional
from vectorstores.ac_weaviate import AcWeaviate
import weaviate
import traceback
import json
import os
from langchain.callbacks.base import AsyncCallbackManager
import openai
from langchain import PromptTemplate
from langchain.chains.prompt_selector import (
    ConditionalPromptSelector,
    is_chat_model,
)
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI

from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    AIMessagePromptTemplate,
)

import asyncio

from langchain.schema import (
    HumanMessage,
)
vectorstore: Optional[VectorStore] = None
client: Optional[weaviate.Client] = None

client = weaviate.Client("http://localhost:8080")
short_summary_vectorstore = AcWeaviate(
    client, "PostsIs", "shortSummary", attributes=["group_name"])
full_summary_vectorstore = AcWeaviate(client, "PostsIs", "fullSummary")
short_summary_with_points_vectorstore = AcWeaviate(
    client, "PostsIs", "shortSummaryWithPoints")
full_summary_with_points_vectorstore = AcWeaviate(
    client, "PostsIs", "fullSummaryWithPoints")

nearText = {"concepts": ["Klambratún", "playground"]}

result = (
    client.query
    .get("PostsIs", ["fullSummaryWithPoints"])
    .with_near_text(nearText)
    .with_limit(15)
    .do()
)

print(json.dumps(result, indent=4))

states = {
    "waiting": {
        "start": "thinking"
    },
    "thinking": {
        "end": "responding"
    },
    "responding": {
        "reset": "waiting"
    }
}


class ChatManager:
    def __init__(self, websocket, cluster_id, community_id, language):
        self.websocket = websocket
        self.cluster_id = cluster_id
        self.community_id = community_id
        self.language = language
        community_results = get_community_from_store(self.cluster_id, self.community_id)

        self.community = community_results["data"]["Get"]["Communities"][0]

        print("GOGOGOGOGGOGO")
        self.configuration = json.loads(self.community["assistantConfiguration"])

        self.reset_memory()
        self.followup_question_handler = FollowupQuestionGenCallbackHandler(
            self.websocket)
        self.main_stream_handler = StreamingLLMCallbackHandler(self.websocket)

        self.qa_chain = get_qa_chain(short_summary_vectorstore, self.followup_question_handler,
                                     self.main_stream_handler, tracing=True)

        followup_question_manager = AsyncCallbackManager(
            handlers=[self.followup_question_handler])

        self.followup_question_gen_llm = ChatOpenAI(
            streaming=True,
            temperature=0,
            model="gpt-4",
            verbose=True,
            max_tokens=128,
            callback_manager=followup_question_manager,
        )

    def get_language_to_speak(self):
        if self.language=="is":
            return "Icelandic"
        elif self.language=="es":
            return "Estonian"
        else:
            return "English"

    def reset_memory(self):
        self.chat_history = []
        self.last_concepts = []
        self.last_group_name = None

        localized_prompt = self.configuration["prompts"]["main"]["system"].replace("{language_to_use}",
                                                      self.get_language_to_speak())

        self.dynamic_chat_memory = DynamicChatMemory()
        self.dynamic_chat_memory.add_system_message(
            SystemMessagePromptTemplate.from_template(localized_prompt)
        )

    async def perform_question_analysis(self, question):
        question_analysis = await get_question_analysis(question, self.configuration)

        print("----------------------")
        print(question_analysis)

        group_name = None
        conceptsJSON = None

        try:
            # Parse question_analysis into JSON and create a dict object
            conceptsJSON = json.loads(question_analysis)
            question_intent = conceptsJSON['question_intent']
            concepts = conceptsJSON['concepts']
            group_name = conceptsJSON[self.configuration["prompts"]["questionAnalysis"]["jsonKeyGroupName"]]
            if conceptsJSON[self.configuration["prompts"]["questionAnalysis"]["jsonKeyForAskingAll"]]==True:
                self.last_group_name = None
        except json.JSONDecodeError:
            # Handle invalid JSON input
            question_intent = "asking_about_many_ideas"
            if self.last_concepts and len(self.last_concepts) > 0:
                concepts = self.last_concepts
            else:
                concepts = []

            if self.last_group_name and len(self.last_group_name) > 0:
                group_name = self.last_group_name

            top_k_docs_for_context = 12

        if len(concepts) == 0:
            concepts = self.last_concepts
        else:
            self.last_concepts = concepts

        if group_name == None and self.last_group_name and len(self.last_group_name) > 0:
            group_name = self.last_group_name
        else:
            self.last_group_name = group_name

        # Remove by hand idea, ideas, points for, points against, pros, cons, pro, con from the concepts array
        concepts = [x for x in concepts if x not in ["idea", "ideas", "point for", "table","hugmyndir","hugmynd",
                                                     "points for", "point against", "points against", "pro", "pros", "con", "cons"]]

        print(conceptsJSON)
        print(question_intent)
        print("----------------------")
        print(concepts)
        print(group_name)
        print("----------------------")

        if question_intent == "asking_about_many_ideas" or "asking_about_the_project_rules_and_overall_organization_of_the_project":
            self.qa_chain.vectorstore = short_summary_vectorstore
            top_k_docs_for_context = 38
        elif question_intent == "asking_about_one_idea":
            self.qa_chain.vectorstore = full_summary_with_points_vectorstore
            top_k_docs_for_context = 12
        elif question_intent == "asking_about_points_for_or_against" or "asking_about_pros_or_cons":
            self.qa_chain.vectorstore = short_summary_with_points_vectorstore
            top_k_docs_for_context = 12
        else:
            self.qa_chain.vectorstore = short_summary_vectorstore
            top_k_docs_for_context = 38
            question_intent = "unknown"

        return {
            "question_intent": question_intent,
            "concepts": concepts,
            "group_name": group_name,
            "top_k_docs_for_context": top_k_docs_for_context
        }

    async def get_concepts_and_refined_question(self, question):
        return result["concepts"], result["answer"]

    async def process_followups(self, question, result):
        start_resp = ChatResponse(
            sender="bot", message="", type="start_followup")
        await self.websocket.send_json(start_resp.dict())

        followup_template = get_follow_up_questions_prompt(
            question, result["answer"], self.configuration)

        chain = LLMChain(
            llm=self.followup_question_gen_llm,
            prompt=followup_template)

        await chain.arun({})

        start_resp = ChatResponse(
            sender="bot", message="", type="end_followup")
        await self.websocket.send_json(start_resp.dict())

    async def chat_loop(self):
        try:
            # Receive and send back the client message
            question = await self.websocket.receive_text()

            if question == "<|--reset-chat--|>":
                self.reset_memory()
            else:
                resp = ChatResponse(sender="you", message=question, type="stream")
                await self.websocket.send_json(resp.dict())

                # Construct a response
                resp = ChatResponse(sender="bot", message="", type="thinking")
                await self.websocket.send_json(resp.dict())

                moderationResponse = openai.Moderation.create(question)
                print(moderationResponse)

                if moderationResponse["results"][0].flagged:
                    resp = ChatResponse(sender="bot", message="",
                                        type="moderation_error")
                    await self.websocket.send_json(resp.dict())
                    print(
                        f"The question is flagged as inappropriate {question} {moderationResponse}")
                else:
                    question_analysis = await self.perform_question_analysis(question)

                    if question_analysis["question_intent"] == "asking_about_many_ideas" or "unknown":
                        question = f"{question}"

                    previous_chat_messages = self.dynamic_chat_memory.chat_memory.messages.copy()
                    previous_chat_messages.append(
                        HumanMessagePromptTemplate.from_template("{question}")),

                    start_resp = ChatResponse(
                        sender="bot", message="", type="start")
                    await self.websocket.send_json(start_resp.dict())

                    if False and question_analysis["question_intent"] == "asking_about_the_project_rules_and_overall_organization_of_the_project":
                        current_messages = get_about_project_prompt(question)
                    else:
                        current_messages = ChatPromptTemplate.from_messages(
                            previous_chat_messages)

                    result = await self.qa_chain.acall(
                        {
                            "cluster_id": self.cluster_id,
                            "community_id": self.community_id,
                            "question": question,
                            "messages": current_messages,
                            "allowFilteringByGroups": self.configuration["allowFilteringByGroups"],
                            "question_intent": question_analysis["question_intent"],
                            "concepts": question_analysis["concepts"],
                            "group_name": question_analysis["group_name"],
                            "top_k_docs_for_context": question_analysis["top_k_docs_for_context"],
                            "chat_history": []}
                    )

                    end_resp = ChatResponse(sender="bot", message="", type="end")
                    await self.websocket.send_json(end_resp.dict())

                    self.dynamic_chat_memory.save_context(
                        {"input": question}, {"output": result["answer"]})
                    # TODO: What is there is an error then the pairs go out of sync
                    await self.process_followups(question, result)
                    await self.dynamic_chat_memory.process_memory()
                    tasks = [
                        #self.process_followups(question, result),
                        #self.dynamic_chat_memory.process_memory()
                    ]

                    #await asyncio.gather(*tasks)
        except WebSocketDisconnect:
            logging.info("websocket disconnect")
        except Exception as e:
            print(traceback.format_exc())
            logging.error(e)
            raise e
