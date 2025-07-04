import { OpenAI } from "openai";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import log from "./loggerTs.js";
const readFilePromise = promisify(fs.readFile);
export class YpCjsCodeReview {
    constructor() {
        this.modelName = "gpt-4o";
        this.maxTokens = 4000;
        this.temperature = 0.0;
        this.openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async readFilesRecursively(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
            if (file === 'node_modules')
                continue;
            if (file === 'ts-out')
                continue;
            const filePath = path.resolve(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(await this.readFilesRecursively(filePath));
            }
            else {
                if (filePath.endsWith('.cjs')) {
                    results.push(filePath);
                }
            }
        }
        return results;
    }
    async reviewCjsFiles() {
        const files = await this.readFilesRecursively("./");
        for (const file of files) {
            log.info(`Reviewing file: ${file}`);
            const content = await readFilePromise(file, "utf8");
            const review = await this.callLlm(content);
            log.info(`\n-----------------\nReview for file ${file}:\n${review}\n-----------------\n\n`);
        }
    }
    renderSystemPrompt() {
        return `You are an export Common module Javascript CJS code reviewer looking for any potential issues in the code that could cause a crash.
    Instructions:
    Review the code for all potential crash situations. Do not provide feedback on anything else than issues that could cause the code to crash.
    If there are no crash related issues just output: No crash issues found.`;
    }
    renderUserMessage(codeToReview) {
        return `Common module CJS Javascript code to review for crashes: ${codeToReview}

Your review results:`;
    }
    async callLlm(codeToReview) {
        const messages = [
            {
                role: "system",
                content: this.renderSystemPrompt(),
            },
            {
                role: "user",
                content: this.renderUserMessage(codeToReview),
            },
        ];
        const maxRetries = 3;
        let retries = 0;
        let running = true;
        while (running) {
            try {
                //log.info(`Messages ${retries}:`, messages);
                const results = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                //log.info("Results:", results);
                const textReview = results.choices[0].message.content;
                return textReview;
            }
            catch (error) {
                log.error("Error:", error);
                retries++;
                if (retries > maxRetries) {
                    log.error("Max retries reached");
                    running = false;
                    return undefined;
                }
            }
        }
        return undefined;
    }
}
(async () => {
    const translator = new YpCjsCodeReview();
    await translator.reviewCjsFiles();
})();
