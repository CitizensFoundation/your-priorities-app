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

def get_follow_up_questions_prompt(last_question,last_ai_answer, configuration):
    system_prompt = configuration["prompts"]["followUps"]["system"]
    prompt = configuration["prompts"]["followUps"]["prompt"]

    messages = [
        SystemMessagePromptTemplate.from_template(system_prompt),
        HumanMessagePromptTemplate.from_template(f"{last_question}"),
        AIMessagePromptTemplate.from_template(f"{last_ai_answer}"),
        HumanMessagePromptTemplate.from_template(prompt),
    ]

    return ChatPromptTemplate.from_messages(messages)
