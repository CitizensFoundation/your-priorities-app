import openai
import openai_async
import os
import base64

async def get_question_analysis(original_question, configuration):
    refine_question_and_concept = base64.b64decode(configuration["prompts"]["questionAnalysis"]["promptBase64"]).decode('utf-8')

    refine_question_and_concept = refine_question_and_concept.replace(
        "{original_question}", original_question)

    messages = [
        {
            "role": "system",
                    "content": configuration["prompts"]["questionAnalysis"]["system"],
        },
        {"role": "user", "content": f"{refine_question_and_concept}"},
    ]

    response = await openai_async.chat_complete(
        os.getenv('OPENAI_API_KEY'),
        timeout=20,
        payload={
            "model": "gpt-3.5-turbo",
            "temperature": 0.0,
            "max_tokens": 128,
            "messages": messages,

        }
    )

    return response.json()["choices"][0]["message"]["content"]
