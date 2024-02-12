import { jsonrepair } from "jsonrepair";
import { OpenAI } from "openai";
import { YpLanguages } from "../../utils/ypLanguages.js";
export class YpLlmTranslation {
    constructor() {
        this.modelName = "gpt-4-0125-preview";
        this.maxTokens = 4000;
        this.temperature = 0.0;
        this.openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    // System messages
    renderSchemaSystemMessage(jsonInSchema, jsonOutSchema, lengthInfo) {
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
    renderSchemaTryAgainSystemMessage(jsonInSchema, jsonOutSchema, lengthInfo, currentToLong) {
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
    renderOneTranslationUserMessage(language, stringToTranslate) {
        return `Language to translate to: ${language}
      String to translate:
      ${stringToTranslate}
      Your translated string:`;
    }
    renderListTranslationUserMessage(language, textsToTranslate) {
        return `Language to translate to: ${language}
      Texts to translate in JSON string array:
      ${JSON.stringify(textsToTranslate, null, 2)}

      Your ${language} translations as JSON string array:`;
    }
    renderAnswersUserMessage(language, question, answer) {
        return `Language to translate to: ${language}

    Question:
    ${question}

    Answers to translate in JSON Input:
    ${JSON.stringify(answer, null, 2)}

    Your ${language} JSON output:`;
    }
    renderQuestionUserMessage(language, question, questionData) {
        return `Language to translate to: ${language}

    Question to translate in JSON format:
    ${JSON.stringify(questionData, null, 2)}

    Your ${language} JSON output:`;
    }
    async getModerationFlag(content) {
        const moderationResponse = await this.openaiClient.moderations.create({
            input: content,
        });
        console.log("Moderation response:", moderationResponse);
        const flagged = moderationResponse.results[0].flagged;
        return flagged;
    }
    async getOneTranslation(languageIsoCode, stringToTranslate) {
        try {
            console.log(`getOneTranslation: ${stringToTranslate}`);
            const languageName = YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
            if (await this.getModerationFlag(stringToTranslate)) {
                console.error("Flagged:", stringToTranslate);
                return null;
            }
            else {
                return await this.callSimpleLlm(languageName, stringToTranslate, false, this.renderOneTranslationSystemMessage, this.renderOneTranslationUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async getListTranslation(languageIsoCode, stringsToTranslate) {
        try {
            console.log(`getOneTranslation: ${languageIsoCode}`);
            const languageName = YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
            if (await this.getModerationFlag(stringsToTranslate.join(" "))) {
                console.error("Flagged:", stringsToTranslate);
                return null;
            }
            else {
                return await this.callSimpleLlm(languageName, stringsToTranslate, true, this.renderListTranslationSystemMessage, this.renderListTranslationUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async getChoiceTranslation(languageIsoCode, answerContent, maxCharactersInTranslation = 140) {
        try {
            console.log(`async getChoiceTranslation: ${answerContent}`);
            const languageName = YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
            if (await this.getModerationFlag(answerContent)) {
                console.error("Flagged:", answerContent);
                return null;
            }
            else {
                const inAnswer = {
                    originalAnswer: answerContent,
                };
                const jsonInSchema = `{ originalAnswer: string}`;
                const jsonOutSchema = `{ translatedContent: string}`;
                const lengthInfo = `26 words long or 140 characters`;
                return await this.callSchemaLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, "", inAnswer, maxCharactersInTranslation, this.renderSchemaSystemMessage, this.renderAnswersUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async getQuestionTranslation(languageIsoCode, question, maxCharactersInTranslation = 300) {
        try {
            console.log(`getQuestionTranslation: ${question} ${languageIsoCode}`);
            const languageName = YpLanguages.getEnglishName(languageIsoCode) || languageIsoCode;
            if (await this.getModerationFlag(question)) {
                console.error("Flagged:", question);
                return null;
            }
            else {
                const inQuestion = {
                    originalQuestion: question,
                };
                const jsonInSchema = `{ originalAnswer: string}`;
                const jsonOutSchema = `{ translatedContent: string}`;
                const lengthInfo = `40 words long or 250 characters`;
                return await this.callSchemaLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, inQuestion, maxCharactersInTranslation, this.renderSchemaSystemMessage, this.renderQuestionUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async callSimpleLlm(languageName, toTranslate, parseJson, systemRenderer, userRenderer) {
        const messages = [
            {
                role: "system",
                content: systemRenderer()
            },
            {
                role: "user",
                content: userRenderer(languageName, toTranslate),
            },
        ];
        const maxRetries = 3;
        let retries = 0;
        let running = true;
        while (running) {
            try {
                console.log(`Messages ${retries}:`, messages);
                const results = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                console.log("Results:", results);
                const llmOutput = results.choices[0].message.content;
                console.log("Return text:", llmOutput);
                if (parseJson) {
                    return JSON.parse(jsonrepair(llmOutput));
                }
                else {
                    return llmOutput;
                }
            }
            catch (error) {
                console.error("Error in getChoiceTranslation:", error);
                retries++;
                if (retries > maxRetries) {
                    running = false;
                    return undefined;
                }
            }
        }
    }
    async callSchemaLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, toTranslate, maxCharactersInTranslation, systemRenderer, userRenderer) {
        console.log("Call schema LLM:", jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, toTranslate, maxCharactersInTranslation);
        const messages = [
            {
                role: "system",
                content: this.renderSchemaSystemMessage(jsonInSchema, jsonOutSchema, lengthInfo),
            },
            {
                role: "user",
                content: userRenderer(languageName, question, toTranslate),
            },
        ];
        const maxRetries = 5;
        let retries = 0;
        let running = true;
        while (running) {
            try {
                console.log(`Messages ${retries}:`, messages);
                const results = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                console.log("Results:", results);
                let textJson = results.choices[0].message.content;
                console.log("Text JSON:", textJson);
                if (textJson) {
                    textJson = textJson.replace(/```json/g, "");
                    textJson = textJson.replace(/```/g, "");
                    const translationData = JSON.parse(jsonrepair(textJson));
                    if (translationData && translationData.translatedContent) {
                        if (maxCharactersInTranslation &&
                            translationData.translatedContent.length >
                                maxCharactersInTranslation) {
                            messages[0].content = this.renderSchemaTryAgainSystemMessage(jsonInSchema, jsonOutSchema, lengthInfo, translationData.translatedContent);
                            throw new Error("Translation too long");
                        }
                        running = false;
                        console.log("Return text " + translationData.translatedContent);
                        return translationData.translatedContent;
                    }
                }
                else {
                    throw new Error("No content in response");
                }
            }
            catch (error) {
                console.error("Error in getChoiceTranslation:", error);
                retries++;
                if (retries > maxRetries) {
                    running = false;
                    return undefined;
                }
            }
        }
    }
}
