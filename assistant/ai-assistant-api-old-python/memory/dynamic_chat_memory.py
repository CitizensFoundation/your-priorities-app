from abc import ABC
from typing import Any, Dict, List, Optional

from memory.default_refined_history_prompt import refine_and_get_chat_history_prompt
from langchain.llms import OpenAI
from memory.default_summarize_prompt import get_chat_summary_prompt
from pydantic import BaseModel, Field
import asyncio

from langchain.memory.utils import get_prompt_input_key
from langchain.schema import AIMessage, BaseMemory, BaseMessage, HumanMessage
from langchain.chains import LLMChain

from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chat_models import ChatOpenAI

from langchain.memory.chat_memory import BaseChatMemory, ChatMessageHistory

from langchain.llms import OpenAI


class DynamicChatMemory(BaseChatMemory):
    custom_summarize_prompt: ChatPromptTemplate = None
    custom_refined_history_prompt: ChatPromptTemplate = None
    full_chats_length = 0
    summarized_chats_length = 3
    latest_refined_user_chat_history: str = ""
    latest_refined_chatbot_chat_history: str = ""

    llm = ChatOpenAI(
        streaming=False,
        temperature=0,
        model="gpt-4",
        max_tokens=1024
    )

    def memory_pair_count(self):
        length = len(self.chat_memory.messages)-1
        print(f"7777777777777777 memory_pair_count {length/2}")
        return length/2

    def get_user_chatbot_history(self):
        user_chatbot_history = ""
#        print(f"7777777777777777 self.chat_memory.messages {self.chat_memory.messages}")
        for message in self.chat_memory.messages:
            if message.__class__.__name__ =="AIMessage":
                user_chatbot_history += f"chatbot: {message.content}\n"
            elif message.__class__.__name__ =="HumanMessage":
                user_chatbot_history += f"user: {message.content}\n"
        return user_chatbot_history

    def memory_variables(self) -> List[str]:
        """Will always return list of memory variables.

        :meta private:
        """
        return ["entities", self.chat_history_key]

    def load_memory_variables(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Return history buffer."""

    async def generate_summary(self, chatbot_or_user, chat_message):
        summary_template = get_chat_summary_prompt(
                self.get_user_chatbot_history(),
                chatbot_or_user,
                chat_message,
                self.custom_summarize_prompt
            )
        #print(f"7777777777777777 {summary_template}")

        chain = LLMChain(
            llm=self.llm,
            prompt=summary_template)

        return await chain.arun({})

    async def generate_refined_history(self, current_brief_chat_history, chatbot_or_user, chat_message):
        await self.llm.agenerate(
            refine_and_get_chat_history_prompt(
                current_brief_chat_history,
                self.get_user_chatbot_history(),
                chatbot_or_user,
                chat_message,
                self.custom_refined_history_prompt
            )
        )

    async def process_memory(self):
        if self.memory_pair_count() > self.full_chats_length:
            await self.async_summarize_last_messages()

    async def async_summarize_last_messages(self):
        last_user_message = self.chat_memory.messages[-2]
        last_bot_message = self.chat_memory.messages[-1]
        print(f"7777777777777777 999999999 {last_user_message.content} {last_bot_message.content}")

        tasks = [
            #self.generate_summary("user",last_user_message.content),
            #self.generate_summary("chatbot",last_bot_message.content)
        ]

        if False and self.memory_pair_count() > self.summarized_chats_length+self.full_chats_length:
            tasks.extend([
                self.generate_refined_history(self.latest_refined_user_chat_history, "user",last_user_message),
                self.generate_refined_history(self.latest_refined_chatbot_chat_history, "chatbot",last_bot_message)
            ])

        #results = await asyncio.gather(*tasks)
        #print(f"7777XXXXXX {results}")

        #self.chat_memory.messages[-2].content = results[0]
        #self.chat_memory.messages[-1].content = results[1]

        if self.memory_pair_count() > self.summarized_chats_length+self.full_chats_length:
            #self.latest_refined_chatbot_chat_history = results[2][0].generations[0][0].text
            #self.latest_refined_user_chat_history = results[3][0].generations[0][0].text
            print(f"7777XXXXXX REMOVING REMOVING REMOVING")
            self.chat_memory.messages = self.chat_memory.messages[:-2]

    def add_system_message(self, message: str) -> None:
        self.chat_memory.messages.append(message)

    def save_context(self, inputs: Dict[str, Any], outputs: Dict[str, str]) -> None:
        self.chat_memory.add_user_message(inputs["input"])
        self.chat_memory.add_ai_message(outputs["output"])
