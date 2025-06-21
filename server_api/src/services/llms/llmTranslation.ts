import { jsonrepair } from "jsonrepair";
import { OpenAI } from "openai";
import { YpLanguages } from "../../utils/ypLanguages.js";
import { parse } from "path";
import { Translate } from "aws-sdk";
import * as cheerio from "cheerio";
import { Cheerio } from "cheerio";
import log from "../../utils/loggerTs.js";

export class YpLlmTranslation {
  openaiClient: OpenAI;
  modelName = "gpt-4o";
  maxTokens = 4000;
  temperature = 0.0;

  constructor() {
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  extractHtmlStrings(html: string): string[] {
    const $ = cheerio.load(html);
    const strings: string[] = [];

    // Function to recursively extract text from all elements
    function recursivelyExtractText(elements: Cheerio<any>): void {
      elements.each((index, element) => {
        if (
          element.tagName.toLowerCase() === "script" ||
          element.tagName.toLowerCase().indexOf("icon") > -1
        ) {
          return;
        }
        // Check if the element itself contains a direct text node
        $(element)
          .contents()
          .filter((idx, content) => {
            // Ensure that content is a text node and not empty
            return (
              content.type === "text" && $(content).text().trim().length > 0
            );
          })
          .each((idx, content) => {
            const text = $(content).text().trim();
            if (text) {
              strings.push(text);
            }
          });

        // Recursively extract text from child elements
        recursivelyExtractText($(element).children());
      });
    }

    // Start the recursive text extraction from the body or root of the document
    recursivelyExtractText($("body").length ? $("body") : $.root());

    // Attributes with user-facing text
    $("input[placeholder], input[value]").each((index, element) => {
      const placeholder = $(element).attr("placeholder");
      if (placeholder && placeholder.trim().length > 0) {
        strings.push(placeholder.trim());
      }
      const value = $(element).attr("value");
      if (
        value &&
        $(element).attr("type") !== "text" &&
        value.trim().length > 0
      ) {
        strings.push(value.trim());
      }
    });

    $('[label]').each((index, element) => {
      const label = $(element).attr('label')?.trim();
      if (label && label.length > 0) {
        strings.push(label);
      }
    });

    // Return unique non-empty strings
    return [...new Set(strings)];
  }

  replaceHtmlStrings(
    html: string,
    originalStrings: string[],
    translatedStrings: string[]
  ): string {
    const $ = cheerio.load(html);

    // Function to replace attribute values safely
    function replaceAttributeValues(container: any) {
      $(container)
        .find("input, textarea, select, [label]")
        .each(function () {
          const element = $(this);
          // Replace placeholder attribute for input, textarea, and select
          const placeholder = element.attr("placeholder");
          if (placeholder) {
            const index = originalStrings.indexOf(placeholder.trim());
            if (index > -1 && translatedStrings[index]) {
              element.attr("placeholder", translatedStrings[index]);
            }
          }
          // Replace value attribute for inputs that are not of type text, email, etc.
          if (element.is('input[type="button"], input[type="submit"]')) {
            const value = element.val();
            if (typeof value === "string") {
              const index = originalStrings.indexOf(value.trim());
              if (index > -1 && translatedStrings[index]) {
                element.val(translatedStrings[index]);
              }
            }
          }
          // Replace label attribute for any element with a label
          if (element.is('[label]')) {
            const label = element.attr('label');
            if (label) {
              const index = originalStrings.indexOf(label.trim());
              if (index > -1 && translatedStrings[index]) {
                element.attr('label', translatedStrings[index]);
              }
            }
          }
        });
    }

    // Function to safely replace text without disrupting child elements
    function safelyReplaceText(container: any) {
      $(container)
        .contents()
        .each(function () {
          // If the node is a text node
          if (this.type === "text") {
            let text = $(this).text();
            originalStrings.forEach((str, index) => {
              // Replace text if it exactly matches the original string (considering whitespace)
              if (text.trim() === str.trim() && translatedStrings[index]) {
                text = text.replace(str, translatedStrings[index]);
                $(this).replaceWith(text);
              }
            });
          } else if (this.type === "tag") {
            // Recursively handle nested elements
            safelyReplaceText(this);
          }
        });
    }

    // Replace attribute values before replacing text
    replaceAttributeValues($.root());

    // Initiate replacement from the root element for text nodes
    safelyReplaceText($.root());

    return $.html();
  }

  // System messages

  renderSchemaSystemMessage(
    jsonInSchema: string,
    jsonOutSchema: string,
    lengthInfo: string
  ) {
    return `You are a helpful answer translation assistant that knows all the world languages.
      INPUTS:
      The user will tell us the Language to translate to.

      The user will let you know what the question is but you do not need to translate that one.

      You will get JSON input with the string to be translated: ${jsonInSchema}

      OUTPUT:
      You will output JSON format with the translation. ${jsonOutSchema}

      INSTRUCTIONS:
      The translated text MUST NEVER be more than ${lengthInfo}, otherwise it wont fit the UI.
      Please count the words and never go over the limit. Leave some things out off the translation it's going to be too long.
      Translate the tone of the original language also.
      Always output only JSON.`;
  }

  renderSchemaTryAgainSystemMessage(
    jsonInSchema: string,
    jsonOutSchema: string,
    lengthInfo: string,
    currentToLong: string
  ) {
    return `You are a helpful answer translation assistant that knows all the world languages.
      INPUTS:
      The user will tell us the Language to translate to.

      The user will let you know what the question is but you do not need to translate that one.

      You will get JSON input with the string to be translated: ${jsonInSchema}

      OUTPUT:
      You will output JSON format with the translation. ${jsonOutSchema}

      INSTRUCTIONS:
      The translated text MUST NEVER be more than ${lengthInfo}, otherwise it wont fit the UI.
      Please count the words and never go over the limit. Leave some things out off the translation it's going to be too long.
      Translate the tone of the original language also.
      Always output only JSON.

      IMPORTANT INSTRUCTIONS:
      You have already attempted to translate the string user is submitting and it is too long, see here:
      ${currentToLong}
      It MUST be shorter than this. Please try again and make it shorter.
      `;
  }

  renderOneTranslationSystemMessage() {
    return `You are a helpful answer translation assistant that knows all the world languages.
      INPUTS:
      The user will tell us the Language to translate to.
      The user will give you a string to be translated.

      OUTPUT:
      You will output only the translated string.

      INSTRUCTIONS:
      Keep it similar length as the original text.
      Translate the tone of the original language also.
      NEVER output anything else than the translated string.`;
  }

  renderListTranslationSystemMessage() {
    return `You are a helpful translation assistant that knows all the world languages.

      INPUTS:
      The user will tell us the Language to translate to.

      You will get JSON with an array of strings to translate:
      [
        "string",
        ...
      ]

      OUTPUT:
      You will output JSON string array in the same order as the input array.
      [
        "string",
        ...
      ]


      INSTRUCTIONS:
      Do not translate brand names including ours: All Our Ideas and Your Priorities except it is a well known brand in the target language.
      Always output only a JSON string array.`;
  }

  // User messages

  renderOneTranslationUserMessage(language: string, stringToTranslate: string) {
    return `Language to translate to: ${language}
      String to translate:
      ${stringToTranslate}
      Your translated string:`;
  }

  renderListTranslationUserMessage(
    language: string,
    textsToTranslate: Array<string>
  ) {
    return `Language to translate to: ${language}
      Texts to translate in JSON string array:
      ${JSON.stringify(textsToTranslate, null, 2)}

      Your ${language} translations as JSON string array:`;
  }

  renderAnswersUserMessage(
    language: string,
    question: string,
    answer: AoiTranslationAnswerInData
  ) {
    return `Language to translate to: ${language}

    Question:
    ${question}

    Answers to translate in JSON Input:
    ${JSON.stringify(answer, null, 2)}

    Your ${language} JSON output:`;
  }

  renderQuestionUserMessage(
    language: string,
    question: string,
    questionData: AoiTranslationQuestionInData
  ) {
    return `Language to translate to: ${language}

    Question to translate in JSON format:
    ${JSON.stringify(questionData, null, 2)}

    Your ${language} JSON output:`;
  }

  async getModerationFlag(content: string): Promise<boolean> {
    const moderationResponse = await this.openaiClient.moderations.create({
      input: content,
    });
    log.info("Moderation response:", moderationResponse);
    const flagged = moderationResponse.results[0].flagged;
    return flagged;
  }

  async getHtmlTranslation(
    languageIsoCode: string,
    htmlToTranslate: string
  ): Promise<string | null | undefined> {
    try {
      const originalStrings = this.extractHtmlStrings(htmlToTranslate);
      if (originalStrings.length === 0) {
        log.warn("No HTML strings to translate");
        return htmlToTranslate;
      }

      const batchSize = 10;
      const translatedStrings: string[] = [];
      for (let i = 0; i < originalStrings.length; i += batchSize) {
        const batch = originalStrings.slice(i, i + batchSize);
        const translatedBatch = await this.getListTranslation(
          languageIsoCode,
          batch
        );
        if (translatedBatch) {
          translatedStrings.push(...translatedBatch);
        } else {
          log.error("Failed to translate batch:", batch);
          return undefined;
        }
      }

      // Replace original strings in HTML with their translations
      const translatedHtml = this.replaceHtmlStrings(
        htmlToTranslate,
        originalStrings,
        translatedStrings
      );
      return translatedHtml;
    } catch (error) {
      log.error("Error in getHtmlTranslation:", error);
      return undefined;
    }
  }

  async getOneTranslation(
    languageIsoCode: string,
    stringToTranslate: string
  ): Promise<string | null | undefined> {
    try {
      log.info(`getOneTranslation: ${stringToTranslate} ${languageIsoCode}`);
      const languageName =
        YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
      return (await this.callSimpleLlm(
        languageName,
        stringToTranslate,
        false,
        this.renderOneTranslationSystemMessage,
        this.renderOneTranslationUserMessage
      )) as string | null;
    } catch (error) {
      log.error("Error in getAnswerIdeas:", error);
      return undefined;
    }
  }

  async getListTranslation(
    languageIsoCode: string,
    stringsToTranslate: string[]
  ): Promise<string[] | null | undefined> {
    try {
      log.info(`getOneTranslation: ${languageIsoCode}`);
      const languageName =
        YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
      if (await this.getModerationFlag(stringsToTranslate.join(" "))) {
        log.error("Flagged:", stringsToTranslate);
        return null;
      } else {
        return (await this.callSimpleLlm(
          languageName,
          stringsToTranslate,
          true,
          this.renderListTranslationSystemMessage,
          this.renderListTranslationUserMessage
        )) as string[] | null;
      }
    } catch (error) {
      log.error("Error in getAnswerIdeas:", error);
      return undefined;
    }
  }

  async getChoiceTranslation(
    languageIsoCode: string,
    answerContent: string,
    maxCharactersInTranslation = 140
  ): Promise<string | null | undefined> {
    try {
      log.info(`async getChoiceTranslation: ${answerContent}`);
      const languageName =
        YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
      if (await this.getModerationFlag(answerContent)) {
        log.error("Flagged:", answerContent);
        return null;
      } else {
        const inAnswer = {
          answerToTranslate: answerContent,
        } as AoiTranslationAnswerInData;

        const jsonInSchema = `{ answerToTranslate: string}`;
        const jsonOutSchema = `{ translatedContent: string}`;
        const lengthInfo = `26 words long or 140 characters`;

        return await this.callSchemaLlm(
          jsonInSchema,
          jsonOutSchema,
          lengthInfo,
          languageName,
          "",
          inAnswer,
          maxCharactersInTranslation,
          this.renderSchemaSystemMessage,
          this.renderAnswersUserMessage
        );
      }
    } catch (error) {
      log.error("Error in getAnswerIdeas:", error);
      return undefined;
    }
  }

  async getQuestionTranslation(
    languageIsoCode: string,
    question: string,
    maxCharactersInTranslation = 300
  ): Promise<string | null | undefined> {
    try {
      log.info(`getQuestionTranslation: ${question} ${languageIsoCode}`);
      const languageName =
        YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
      if (await this.getModerationFlag(question)) {
        log.error("Flagged:", question);
        return null;
      } else {
        const inQuestion = {
          questionToTranslate: question,
        } as AoiTranslationQuestionInData;

        const jsonInSchema = `{ questionToTranslate: string}`;
        const jsonOutSchema = `{ translatedContent: string}`;
        const lengthInfo = `40 words long or 250 characters`;

        return await this.callSchemaLlm(
          jsonInSchema,
          jsonOutSchema,
          lengthInfo,
          languageName,
          question,
          inQuestion,
          maxCharactersInTranslation,
          this.renderSchemaSystemMessage,
          this.renderQuestionUserMessage
        );
      }
    } catch (error) {
      log.error("Error in getAnswerIdeas:", error);
      return undefined;
    }
  }

  async callSimpleLlm(
    languageName: string,
    toTranslate: string[] | string,
    parseJson: boolean,
    systemRenderer: Function,
    userRenderer: Function
  ): Promise<string | object | null | undefined> {
    const messages = [
      {
        role: "system",
        content: systemRenderer(),
      },
      {
        role: "user",
        content: userRenderer(languageName, toTranslate),
      },
    ] as any;

    const maxRetries = 3;
    let retries = 0;

    let running = true;

    while (running) {
      try {
        log.info(`Messages ${retries}:`, messages);
        const results = await this.openaiClient.chat.completions.create({
          model: this.modelName,
          messages,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        });

        log.info("Results:", results);
        let llmOutput = results.choices[0].message.content;
        log.info("Return text:", llmOutput);
        if (parseJson) {
          if (llmOutput) {
            llmOutput = llmOutput.replace(/```json/g, "");
            llmOutput = llmOutput.replace(/```/g, "");
            return JSON.parse(jsonrepair(llmOutput!));
          }
          {
            log.error("No content in response");
            return undefined;
          }
        } else {
          return llmOutput;
        }
      } catch (error) {
        log.error("Error in getChoiceTranslation:", error);
        retries++;
        if (retries > maxRetries) {
          running = false;
          return undefined;
        }
      }
    }
  }

  async callSchemaLlm(
    jsonInSchema: string,
    jsonOutSchema: string,
    lengthInfo: string,
    languageName: string,
    question: string,
    toTranslate:
      | AoiTranslationAnswerInData
      | AoiTranslationQuestionInData
      | string[]
      | string,
    maxCharactersInTranslation: number | undefined,
    systemRenderer: Function,
    userRenderer: Function
  ): Promise<string | null | undefined> {
    log.info(
      "Call schema LLM:",
      jsonInSchema,
      jsonOutSchema,
      lengthInfo,
      languageName,
      question,
      toTranslate,
      maxCharactersInTranslation
    );
    const messages = [
      {
        role: "system",
        content: this.renderSchemaSystemMessage(
          jsonInSchema,
          jsonOutSchema,
          lengthInfo
        ),
      },
      {
        role: "user",
        content: userRenderer(languageName, question, toTranslate),
      },
    ] as any;

    const maxRetries = 5;
    let retries = 0;

    let running = true;

    while (running) {
      try {
        log.info(`Messages ${retries}:`, messages);
        const results = await this.openaiClient.chat.completions.create({
          model: this.modelName,
          messages,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        });

        log.info("Results:", results);
        let textJson = results.choices[0].message.content;
        log.info("Text JSON:", textJson);

        if (textJson) {
          textJson = textJson.replace(/```json/g, "");
          textJson = textJson.replace(/```/g, "");
          const translationData = JSON.parse(
            jsonrepair(textJson)
          ) as AoiTranslationAnswerOutData;
          if (translationData && translationData.translatedContent) {
            if (
              maxCharactersInTranslation &&
              translationData.translatedContent.length >
                maxCharactersInTranslation
            ) {
              log.info(
                "Translation too long retrying:",
                translationData.translatedContent
              );
              messages[0].content = this.renderSchemaTryAgainSystemMessage(
                jsonInSchema,
                jsonOutSchema,
                lengthInfo,
                translationData.translatedContent
              );

              throw new Error("Translation too long");
            }
            running = false;
            log.info("Return text " + translationData.translatedContent);
            return translationData.translatedContent;
          } else {
            this.temperature = Math.random() * 0.99;
            log.info(
              "No content in response. Temperature set to: " + this.temperature
            );
            throw new Error("No content in response");
          }
        } else {
          this.temperature = Math.random() * 0.99;
          log.info(
            "No content in response. Temperature set to:" + this.temperature
          );
          throw new Error("No content in response");
        }
      } catch (error) {
        log.error("Error in callSchemaLlm:", error);
        retries++;
        if (retries > maxRetries) {
          running = false;
          return undefined;
        }
      }
    }
  }
}
