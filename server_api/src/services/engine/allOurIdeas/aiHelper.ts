import { OpenAI } from "openai";
import { WebSocket } from "ws";
import log from "../../../utils/loggerTs.js";

export class AiHelper {
  openaiClient: OpenAI;
  wsClientSocket: WebSocket | undefined;
  modelName = "gpt-4o";
  answerIdeasModelName = "gpt-5.3-chat-latest";
  analysisModelName = "gpt-5.3-chat-latest";
  maxTokens = 2048;
  temperature = 0.7;
  cacheExpireTime = 60 * 60;

  redisClient?: any;
  cacheKeyForFullResponse?: string;

  usesMaxCompletionTokens(modelName: string) {
    return modelName.startsWith("gpt-5");
  }

  constructor(wsClientSocket: WebSocket | undefined = undefined) {
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.wsClientSocket = wsClientSocket;
  }

  moderationSystemPrompt = (
    instructions: string
  ) => `The user will provide you with a question and an answer.
Your job is to moderate the answer if it passes automated moderation or not.
Moderation instructions:
${instructions}

Only output: PASSES or FAILS`;

  moderationUserPrompt = (question: string, answer: string) => `
  Question: ${question}
  Answer: ${answer}
  `;

  getModerationResponse = async (
    instructions: string,
    question: string,
    answerToModerate: string
  ) => {
    const messages = [
      {
        role: "system",
        content: this.moderationSystemPrompt(instructions),
      },
      {
        role: "user",
        content: this.moderationUserPrompt(question, answerToModerate),
      },
    ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

    log.info(JSON.stringify(messages, null, 2));

    const response = await this.openaiClient.chat.completions.create({
      model: this.modelName,
      messages,
      max_tokens: 5,
      temperature: 0,
    });

    if (
      response &&
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      log.info("Moderation response:", response.choices[0].message.content);
      return ["PASSES", "PASS"].includes(
        response.choices[0].message.content.toUpperCase()
      )
        ? true
        : false;
    } else {
      return false;
    }
  };

  async streamChatCompletions(
    messages: any[],
    modelName = this.modelName,
    uniqueToken?: string
  ): Promise<void> {
    const requestParams: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming = {
      model: modelName,
      messages,
      stream: true,
    };

    if (this.usesMaxCompletionTokens(modelName)) {
      requestParams.max_completion_tokens = this.maxTokens;
    } else {
      requestParams.max_tokens = this.maxTokens;
      requestParams.temperature = this.temperature;
    }

    const stream = await this.openaiClient.chat.completions.create(
      requestParams
    );

    await this.streamWebSocketResponses(stream, uniqueToken);
  }

  sendToClient(
    sender: string,
    message: string,
    type = "stream",
    uniqueToken?: string
  ) {
    this.wsClientSocket?.send(
      JSON.stringify({
        sender,
        type: type,
        message,
        uniqueToken,
      })
    );
  }

  async streamWebSocketResponses(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>,
    uniqueToken?: string
  ) {
    return new Promise<void>(async (resolve, reject) => {
      this.sendToClient("assistant", "", "start", uniqueToken);
      try {
        let botMessage = "";
        for await (const part of stream) {
          const content = part.choices[0].delta.content;
          if (content) {
            this.sendToClient("assistant", content, "stream", uniqueToken);
            botMessage += content;
          }
        }

        if (this.redisClient && this.cacheKeyForFullResponse) {
          this.redisClient.set(
            this.cacheKeyForFullResponse,
            botMessage,
            "EX",
            this.cacheExpireTime
          );
        }
      } catch (error) {
        log.error(error);
        this.sendToClient(
          "assistant",
          "There has been an error, please retry",
          "error",
          uniqueToken
        );
        reject();
      } finally {
        this.sendToClient("assistant", "", "end", uniqueToken);
      }
      resolve();
    });
  }

  async getAnswerIdeas(
    question: string,
    previousIdeas: string[] | null,
    firstMessage: string | null
  ): Promise<string | null | undefined> {
    try {
      const moderationResponse = await this.openaiClient.moderations.create({
        input: question,
      });
      log.info("Moderation response:", moderationResponse);
      const flagged = moderationResponse.results[0].flagged;
      log.info("Flagged:", flagged);

      if (flagged) {
        log.error("Flagged:", question);
        return null;
      } else {
        let firstMessageWithPreviousIdeasTemplate = "";

        let previewIdeasText = "";

        if (previousIdeas && previousIdeas.length > 0) {
          previewIdeasText = `Previous answer ideas:\n${JSON.stringify(
            previousIdeas,
            null,
            2
          )}\n\n`;

          if (firstMessage) {
            firstMessageWithPreviousIdeasTemplate =
              "For your answers please follow the tone of voice, prose, style, and length of the Previous answer ideas\n";
          }
        }

        const messages = [
          {
            role: "system",
            content: `You are a highly competent AI that is able to generate clear answer ideas for questions.
                      Genereate up to 10 high quality answer ideas.
                      Never use numbers at the start of each line.
                      Always output the ideas in the same language the user is asking the question.
                      Never use a dash or quote or anything similar at the start of each line, just start with the text.
                      Never output more than 30 words per idea.
                      \n${firstMessageWithPreviousIdeasTemplate}`,
          },
          {
            role: "user",
            content: `What are some possible answers to the question: ${question}\n\n${previewIdeasText}Answers:\n`,
          },
        ];

        await this.streamChatCompletions(messages, this.answerIdeasModelName);
      }
    } catch (error) {
      log.error("Error in getAnswerIdeas:", error);
      this.sendToClient(
        "assistant",
        "There has been an error, please retry",
        "error"
      );
      return null;
    }
  }

  async getAiAnalysis(
    questionId: number,
    contextPrompt: string,
    answers: AoiChoiceData[],
    cacheKeyForFullResponse: string,
    redisClient: any,
    locale: string,
    topOrBottomIdeasText: string,
    typeOfAnalysisText: string,
    uniqueToken?: string
  ): Promise<string | null | undefined> {
    this.redisClient = redisClient;
    this.cacheKeyForFullResponse = cacheKeyForFullResponse;

    const basePrePrompt = `You are a highly competent text and ideas analysis AI.
        Instructions:
        If an answer sounds implausible as an answer to the question, then include a short observation about it in your analysis.
        Keep your output short, under 300 words.
        The answers have been rated by the public using a pairwise voting method, so the user is always selecting one to win or one to lose.
        Generally, do not include the number of wins and losses in your answers.
        If there are very few wins or losses, under 10 for most of the ideas, then always output a disclaimer to that end, in a separate second paragraph.
        Don't output Idea 1, Idea 2 in your answer.
        Be creative and think step by step.

        Output:
        If the prompt asks for a table always output a markdown table.
        Always output in a clear markdown format.
        Always start with the type of analysis and if those are top or bottom ideas.

        Example output:

        ## Points for the most popular answers

        <Your dynamic markdown output>


    `;

    const answersText = answers
      .map(
        (answer) =>
          `${answer.data.content} (Won: ${answer.wins}, Lost: ${answer.losses})`
      )
      .join("\n");

    try {
      const moderationResponse = await this.openaiClient.moderations.create({
        input: answersText,
      });

      const flagged = moderationResponse.results[0].flagged;

      if (flagged) {
        log.error("Flagged:", answersText);
        return;
      } else {
        const messages = [
          {
            role: "system",
            content: `${basePrePrompt}\n${contextPrompt}`,
          },
          {
            role: "user",
            content: `The question: ${questionId}
              ${topOrBottomIdeasText}
              Type of analysis: ${typeOfAnalysisText}
              Language to output: ${locale}
              Answers to analyse:\n${answersText}`,
          },
        ] as any;

        this.streamChatCompletions(messages, this.analysisModelName, uniqueToken);
      }
    } catch (error) {
      log.error("Error in getAiAnalysis:", error);
      this.sendToClient(
        "assistant",
        "There has been an error, please retry",
        "error",
        uniqueToken
      );
    }
  }
}
