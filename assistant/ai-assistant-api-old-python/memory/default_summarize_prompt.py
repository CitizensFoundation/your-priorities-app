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

default_system_template = """Your are an advanced text summarizer. \
You think things through.
"""

default_chat_summary_template = """Please summarize the chat message below, keep the summary very short and relevant to the chat history. \
Make sure all entities are mentioned in the summary.
You always talk about ideas you are summarizing not Chatbot suggests". Those are ideas from people who submitted them.

Shortened chat history:
{shortened_chat_history}

Is the summary for user or chatbot: {user_or_chatbot}

Chat message to summarize: {chat_message}
"""

default_chat_summary_prompt = PromptTemplate(
    template=default_chat_summary_template,
    input_variables=["shortened_chat_history", "user_or_chatbot", "chat_message"],
)

def get_chat_summary_prompt(
        shortened_chat_history,
        user_or_chatbot,
        chat_message,
        summary_prompt,
        system_template=default_system_template):
    if summary_prompt == None:
        summary_prompt = default_chat_summary_prompt
    print(f"7777777777777777 1 {shortened_chat_history}")
    print(f"7777777777777777 2 {user_or_chatbot}")
    print(f"7777777777777777 3 {chat_message}")
    print(f"7777777777777777 4 {summary_prompt}")
    print(f"7777777777777777 5 {system_template}")
    messages = [
        SystemMessagePromptTemplate.from_template(system_template),
        HumanMessagePromptTemplate.from_template(summary_prompt.format(
            shortened_chat_history=shortened_chat_history,
            user_or_chatbot=user_or_chatbot,
            chat_message=chat_message
        )
        ),
    ]

    return ChatPromptTemplate.from_messages(messages)
