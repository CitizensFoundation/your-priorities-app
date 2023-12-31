import * as openai from 'openai';
import * as openai_async from 'openai_async';
import * as os from 'os';
import * as base64 from 'base64';

async function get_question_analysis(original_question: string, configuration: any): Promise<string> {
  const refine_question_and_concept: string = base64.b64decode(configuration["prompts"]["questionAnalysis"]["promptBase64"]).decode('utf-8');

  const refined_question_and_concept: string = refine_question_and_concept.replace(
    "{original_question}", original_question
  );

  const messages: any[] = [
    {
      "role": "system",
      "content": configuration["prompts"]["questionAnalysis"]["system"],
    },
    {
      "role": "user",
      "content": `${refined_question_and_concept}`,
    },
  ];

  const response: any = await openai_async.chat_complete(
    os.getenv('OPENAI_API_KEY'),
    {
      "timeout": 20,
      "payload": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.0,
        "max_tokens": 128,
        "messages": messages,
      },
    }
  );

  return response.json()["choices"][0]["message"]["content"];
}