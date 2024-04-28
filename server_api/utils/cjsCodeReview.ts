import { jsonrepair } from "jsonrepair";
import { OpenAI } from "openai";

import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const readFilePromise = promisify(fs.readFile);

export class YpCjsCodeReview {
  openaiClient: OpenAI;
  modelName = "gpt-4-turbo-2024-04-09";
  maxTokens = 4000;
  temperature = 0.0;

  constructor() {
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async readFilesRecursively(dir: string): Promise<string[]> {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file === 'node_modules') continue;
      if (file === 'ts-out') continue;
      const filePath = path.resolve(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(await this.readFilesRecursively(filePath));
      } else {
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
      console.log(`Reviewing file: ${file}`);
      const content = await readFilePromise(file, "utf8");
      const review = await this.callLlm(content);
      console.log(
        `\n-----------------\nReview for file ${file}:\n${review}\n-----------------\n\n`
      );
    }
  }

  renderSystemPrompt() {
    return `You are an export Common module Javascript CJS code reviewer looking for any potential issues in the code that could cause a crash.
    Instructions:
    Review the code for all potential crash situations. Do not provide feedback on anything else than issues that could cause the code to crash.
    If there are no crash related issues just output: No crash issues found.`;
  }

  renderUserMessage(codeToReview: string) {
    return `Common module CJS Javascript code to review for crashes: ${codeToReview}

Your review results:`;
  }

  async callLlm(codeToReview: string): Promise<string | undefined | null> {
    const messages = [
      {
        role: "system",
        content: this.renderSystemPrompt(),
      },
      {
        role: "user",
        content: this.renderUserMessage(codeToReview),
      },
    ] as any;

    const maxRetries = 3;
    let retries = 0;

    let running = true;

    while (running) {
      try {
        //console.log(`Messages ${retries}:`, messages);
        const results = await this.openaiClient.chat.completions.create({
          model: this.modelName,
          messages,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        });

        //console.log("Results:", results);
        const textReview = results.choices[0].message.content;

        return textReview;
      } catch (error) {
        console.error("Error:", error);
        retries++;
        if (retries > maxRetries) {
          console.error("Max retries reached");
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
