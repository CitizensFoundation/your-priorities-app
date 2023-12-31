from langchain import PromptTemplate
from langchain.chains.prompt_selector import (
    ConditionalPromptSelector,
    is_chat_model,
)
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

default_system_template = """Your are an advanced compact chat history creator, \
your are the best in the business and you never don't mistakes. You think things through."""

default_chat_history_template = """Please refine the crrent chat history with the new \
chat message proivided below. Make sure all entities are mentioned in the chat history. Keep the \
history very short.

Full chat history:
{full_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Current refined chat history: {current_brief_chat_history}

New chat message: {chat_message}
"""

default_chat_history_prompt = PromptTemplate(
    template=default_chat_history_template,
    input_variables=["full_chat_history", "user_or_chatbot",
                     "current_brief_chat_history", "chat_message"],
)


def refine_and_get_chat_history_prompt(
        current_brief_chat_history,
        chat_message,
        chat_history,
        user_or_chatbot,
        chat_history_prompt=default_chat_history_prompt,
        system_template=default_system_template):

    messages = [
        SystemMessagePromptTemplate.from_template(system_template),
        HumanMessagePromptTemplate.from_template(chat_history_prompt.format(
            chat_history=chat_history,
            user_or_chatbot=user_or_chatbot,
            chat_message=chat_message,
            current_brief_chat_history=current_brief_chat_history
        )
        ),
    ]

    return ChatPromptTemplate.from_messages(messages)
