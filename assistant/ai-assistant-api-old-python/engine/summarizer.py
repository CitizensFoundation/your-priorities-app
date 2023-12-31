from models.post import Post
import openai
import string
import time
import openai_async
import os

from langchain import PromptTemplate

TEMP_LANGUAGE_LOCALE = "is"

import random
import asyncio

async def retry_with_exponential_backoff(
    func,
    initial_delay: float = 1,
    exponential_base: float = 2,
    jitter: bool = True,
    max_retries: int = 10000,
    errors: tuple = (openai.error.RateLimitError,),
    **kwargs,
):
    """Retry a function with exponential backoff."""

    # Initialize variables
    num_retries = 0
    delay = initial_delay

    # Loop until a successful response or max_retries is hit or an exception is raised
    while True:
        try:
            return await func(**kwargs)

        # Retry on specified errors
        except Exception as e:
            print(f"Exception: {type(e).__name__}: {e}")
            # Increment retries
            num_retries += 1

            # Check if max retries has been reached
            if num_retries > max_retries:
                raise Exception(
                    f"Maximum number of retries ({max_retries}) exceeded."
                )

            # Increment the delay
            delay *= exponential_base * (1 + jitter * random.random())

            print(f"Sleeping for {delay} seconds num retries {num_retries}")
            await asyncio.sleep(delay)

        # Raise exceptions for any errors not specified
        #except Exception as e:
        #    raise e

async def completions_with_backoff(**kwargs):
    response = await openai_async.chat_complete(
          os.getenv('OPENAI_API_KEY'),
          timeout=120,
          payload=kwargs)
    print (response.json())
    print()
    return response.json()["choices"][0]["message"]["content"]

async def summarize_text(prompt, text, custom_system_message = None, skip_icelandic = False):
    final_is_postfix = en_prefix_postfix if not skip_icelandic else ""
    print(f"Prompt length: {len(prompt)}")
    print(f"Text length: {len(text)}")
    return await retry_with_exponential_backoff(
        completions_with_backoff,
        initial_delay=1,
        exponential_base=2,
        max_retries=3,
        errors=(openai.error.RateLimitError,),
        **{
            "model": "gpt-4",
            "temperature": 0.2,
            "messages": [
                {"role": "system", "content": f"{custom_system_message}\n{final_is_postfix}" or f"{system_message}\n{final_is_postfix}"},
                {"role": "user", "content": f"{prompt}{text}"}
            ]
        }
    )

    #return completion.choices[0].message.content

system_message = """You are an effective text summarization and shortening system.
If you can't shorten or summarize the text just output the original text.
"""

emoji_system_message = """You are a helpful Emoji generator. You must always output 2 Emojis, not 1 and not 3."""

one_word_system_message = """You are a helpful and advanced summary tool. You can take the text and create a one-word emotional summary. """

emoji_prompt_prefix  = """Please read the text here carefully and then create two Emojis to represent the concept. \
Only output two emojis and no text. Let's think step by step:

"""

one_word_prompt_prefix = """Please read the text here carefully and then output one word that best describes the idea in the most emotional way. Do not use the most obvious word, like Dog, for dog-related ideas. Dive deeper. Only output one word. Let's think step by step:

"""

short_name_prompt_prefix = """Please shorten the idea name as much as possible without using abbreviations.

"""

short_summary_prefix = """Please summarize the text below as much as possible without using abbreviations in one short paragraph. Please keep it as short as possible.

"""

full_summary_prefix = """Please summarize the text below in detail and leave no part of the concept out.

"""

full_points_for_summary_prefix = """Please summarize the points for the idea below in full detail, in one to three paragraphs, and leave nothing out. All opinions in the points below must be included in this summary.

"""

short_points_for_summary_prefix = """Please summarize the points for below as much as possible without using abbreviations in one short paragraph. Please keep it very short, only a few sentences.

"""

full_points_against_summary_prefix = """Please summarize the points against the idea below in full detail, in one to three paragraphs, and leave nothing out. All opinions in the points below must be included in this summary.

"""

short_points_against_summary_prefix = """Please summarize the points against below as much as possible without using abbreviations in one short paragraph. Please keep it very short, only a few sentences.


"""

is_prefix_postfix = """Always return Icelandic summarizations

"""

en_prefix_postfix = """Always return English summarizations

"""

es_prefix_postfix = """Always return Estonian summarizations

"""

emojiSummaryTemplate = """{emojis}"""

oneWordSummaryTemplate = """{one_word}"""

shortPostNameTemplate = """{name} [{source}]

  Neighborhood: {group_name}\n\n
"""

summaryTemplate = """{summary} [{source}]

  Neighborhood: {group_name}

"""

summaryWithPointsTemplate = """{summary} [{source}]

  Neighborhood: {group_name}

  Points for: {points_for}

  Points against: {points_against}

  <likes={counter_endorsements_up}>
  <dislikes={counter_endorsements_down}>\n\n
"""

summaryWithPointsAndImageTemplate = """{summary} [{source}]

  Neighborhood: {group_name}

  Points for: {points_for}

  Points against: {points_against}

  <likes={counter_endorsements_up}>
  <dislikes={counter_endorsements_down}>\n\n
"""

#TODO: Refactor all of this into classes and use the post.language here with more options than "is"
def get_final_prefix(prefix):
    if False and TEMP_LANGUAGE_LOCALE == "is":
        return prefix + is_prefix_postfix
    else:
        return prefix

async def summarize_emoji(text):
    print(f"\n\nSummarizing emoji")
    return await summarize_text(get_final_prefix(emoji_prompt_prefix), text, emoji_system_message, True)

async def summarize_one_word(text):
    print(f"\n\nSummarizing one word")
    return await summarize_text(get_final_prefix(one_word_prompt_prefix), text,one_word_system_message)

async def summarize_short_name(text):
    print(f"\n\nSummarizing short name")
    return await summarize_text(get_final_prefix(short_name_prompt_prefix), text)

async def summarize_short_summary(text):
    print(f"\n\nSummarizing short summary")
    return await summarize_text(get_final_prefix(short_summary_prefix), text)

async def summarize_full_summary(text):
    print(f"\n\nSummarizing full summary")
    return await summarize_text(get_final_prefix(full_summary_prefix), text)

async def summarize_full_points_for_summary(text):
    print(f"\n\nSummarizing full points for summary")
    return await summarize_text(get_final_prefix(full_points_for_summary_prefix), text)

async def summarize_short_points_for_summary(text):
    print(f"\n\nSummarizing short points for summary")
    return await summarize_text(get_final_prefix(short_points_for_summary_prefix), text)

async def summarize_full_points_against_summary(text):
    print(f"\n\nSummarizing full points against summary")
    return await summarize_text(get_final_prefix(full_points_against_summary_prefix), text)

async def summarize_short_points_against_summary(text):
    print(f"\n\nSummarizing short points against summary")
    return await summarize_text(get_final_prefix(short_points_against_summary_prefix), text)

async def get_emoji_summary(post: Post):
    prompt = PromptTemplate(
        input_variables=["emojis"],
        template=emojiSummaryTemplate,
    )

    emoji_summary = await summarize_emoji(f"{post.name}\n{post.description}")

    print(emoji_summary)

    return prompt.format(emojis=emoji_summary)


async def get_one_word_summary(post: Post):
    prompt = PromptTemplate(
        input_variables=["one_word"],
        template=oneWordSummaryTemplate,
    )

    one_word_summary = await summarize_one_word(f"{post.name}\n{post.description}")

    print(one_word_summary)

    one_word_summary = one_word_summary.translate(str.maketrans('', '', string.punctuation))

    return prompt.format(one_word=one_word_summary)

async def get_short_post_name(post: Post):
    prompt = PromptTemplate(
        input_variables=["name", "group_name", "source"],
        template=shortPostNameTemplate,
    )

    short_name = await summarize_short_name(post.name)

    print(short_name)

    return prompt.format(name=short_name, group_name=post.group_name, source=post.post_id)

async def get_short_post_summary(post: Post):
    prompt = PromptTemplate(
        input_variables=["group_name", "source","summary"],
        template=summaryTemplate,
    )

    short_summary = await summarize_short_summary(f"{post.name}\n{post.description}")

    print(short_summary)

    return prompt.format(summary=short_summary, group_name=post.group_name, source=post.post_id)


async def get_full_post_summary(post: Post):
    prompt = PromptTemplate(
               input_variables=["group_name", "source","summary"],
        template=summaryTemplate,
    )

    full_summary = await summarize_full_summary(f"{post.name}\n{post.description}")
    print(full_summary)

    return prompt.format(summary=full_summary, group_name=post.group_name, source=post.post_id)

async def get_short_post_summary_with_points(post: Post):
    prompt = PromptTemplate(
        input_variables=["group_name",
                         "counter_endorsements_up", "counter_endorsements_down",
                         "source", 'points_for', 'points_against',"summary"],
        template=summaryWithPointsTemplate,
    )

    short_summary = await summarize_short_summary(f"{post.name}\n{post.description}")

    points_for_short_summary = ""
    points_against_short_summary = ""

    if post.points_for!="":
        points_for_short_summary = await summarize_short_points_for_summary(
            f"{post.name}\n{post.points_for}")

    if post.points_against!="":
        points_against_short_summary = await summarize_short_points_against_summary(
            f"{post.name}\n{post.points_against}")

    print(short_summary)
    print(points_for_short_summary)
    print(points_against_short_summary)

    return prompt.format(summary=short_summary, group_name=post.group_name, source=post.post_id,
                  counter_endorsements_up=post.counter_endorsements_up, counter_endorsements_down=post.counter_endorsements_down,
                   points_for=points_for_short_summary, points_against=points_against_short_summary)

async def get_full_post_summary_with_points(post: Post):
    prompt = PromptTemplate(
        input_variables=["group_name",
                         "counter_endorsements_up", "counter_endorsements_down",
                         "source", 'points_for', 'points_against',"summary"],
        template=summaryWithPointsAndImageTemplate,
    )

    short_summary = await summarize_full_summary(f"{post.name}\n{post.description}")

    points_for_short_summary = ""
    points_against_short_summary = ""

    if post.points_for!="":
        points_for_short_summary = await summarize_full_points_for_summary(
            f"{post.name}\n{post.points_for}")

    if post.points_against!="":
        points_against_short_summary = await summarize_full_points_against_summary(
            f"{post.name}\n{post.points_against}")

    return prompt.format(summary=short_summary, group_name=post.group_name, source=post.post_id,
                   counter_endorsements_up=post.counter_endorsements_up, counter_endorsements_down=post.counter_endorsements_down,
                   points_for=points_for_short_summary, points_against=points_against_short_summary)

