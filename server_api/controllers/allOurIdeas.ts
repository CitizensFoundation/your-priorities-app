import { createClient } from "redis";
import WebSocket, { WebSocketServer } from "ws";
import models from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import express, { Request, Response } from "express";
import crypto from "crypto";

const dbModels: Models = models;
const Group = dbModels.Group as GroupClass;

const PAIRWISE_API_HOST = process.env.PAIRWISE_API_HOST;
const PAIRWISE_USERNAME = process.env.PAIRWISE_USERNAME;
const PAIRWISE_PASSWORD = process.env.PAIRWISE_PASSWORD;

const defaultAuthHeader = {
  "Content-Type": "application/json",
  Authorization: `Basic ${Buffer.from(
    `${PAIRWISE_USERNAME}:${PAIRWISE_PASSWORD}`
  ).toString("base64")}`,
};

const defaultHeader = {
  ...{ "Content-Type": "application/json" },
  ...defaultAuthHeader,
};

import auth from "../authorization.js";
import { AiHelper } from "../active-citizen/engine/allOurIdeas/aiHelper.js";

export class AllOurIdeasController {
  public path = "/api/allOurIdeas";
  public router = express.Router();
  public wsClients: Map<string, WebSocket>;

  constructor(wsClients: Map<string, WebSocket>) {
    this.wsClients = wsClients;
    this.initializeRoutes();
  }

  public async initializeRoutes() {
    this.router.get(
      "/:groupId",
      auth.can("view group"),
      this.showEarl.bind(this)
    );
    this.router.post(
      "/:communityId/questions",
      auth.can("create group"),
      this.createQuestion.bind(this)
    );
    this.router.put(
      "/:communityId/generateIdeas",
      auth.can("create group"),
      this.generateIdeas.bind(this)
    );
    this.router.get(
      "/:communityId/choices/:questionId",
      auth.can("create group"),
      this.getChoices.bind(this)
    );

    console.log("---- have initialized routes for allOurIdeasController");
  }

  public async generateIdeas(req: Request, res: Response): Promise<void> {
    const { currentIdeas, wsClientSocketId, question } = req.body;
    console.log(`generateIdeas: ${wsClientSocketId}`);
    const swClientSocket = this.wsClients.get(wsClientSocketId);
    if (swClientSocket) {
      const aiHelper = new AiHelper(swClientSocket);
      await aiHelper.getAnswerIdeas(question, currentIdeas, "");
      res.sendStatus(200);
    } else {
      //TODO: Have it refresh the websocket on the client
      res.status(404).send("Websocket not found");
    }
  }

  public async showEarl(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params;
    const locale = req.query.locale;

    try {
      const group = (await Group.findOne({
        where: {
          id: groupId
        }
      })) as YpGroupData;
      const aoiConfig = (group.configuration as AoiGroupConfiguration)
        .allOurIdeas;
      if (group && aoiConfig.earl) {
        const showParams = {
          with_prompt: true,
          with_appearance: true,
          with_visitor_stats: true,
          visitor_identifier: req.session.id
        };

        const questionResponse = await fetch(
          `${PAIRWISE_API_HOST}/questions/${
            aoiConfig.earl.question_id
          }.json?${new URLSearchParams(showParams as any).toString()}`,
          {
            method: "GET",
            headers: defaultHeader,
          }
        );

        if (!questionResponse.ok) {
          throw new Error("Failed to fetch question");
        }

        const question = (await questionResponse.json()) as AoiQuestionData;

        const { picked_prompt_id } = question;
        const question_id = question.id;

        console.log(`picked_prompt_id: ${picked_prompt_id}`);
        console.log(`question_id: ${question_id}`);

        const promptResponse = await fetch(
          `${PAIRWISE_API_HOST}/questions/${question_id}/prompts/${picked_prompt_id}.json`,
          {
            method: "GET",
            headers: defaultHeader,
          }
        );

        if (!promptResponse.ok) {
          throw new Error("Failed to fetch prompt");
        }

        const prompt = await promptResponse.json();
        res.json({
          prompt: prompt,
          question: question,
        });
      } else {
        res.status(404).send("Not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }

  async vote(req: Request, res: Response) {
    const { id, question_id, direction } = req.body;
    const voteOptions = this.getVoteRequestOptions(req.body, "vote");
    const nextPromptOptions = this.getNextPromptOptions(req);

    if (direction) {
      try {
        const response = await fetch(
          `${PAIRWISE_API_HOST}/questions/${question_id}/prompts/${id}/vote`,
          {
            method: "PUT",
            headers: defaultHeader,
            body: JSON.stringify({
              question_id,
              vote: voteOptions,
              next_prompt: nextPromptOptions,
            }),
          }
        );

        if (!response.ok) throw new Error("Vote unsuccessful.");

        const nextPrompt = (await response.json()) as AoiPromptData;

        const result = {
          newleft: this.truncate(nextPrompt.left_choice_text, {
            length: 140,
            omission: "…",
          }),
          newright: this.truncate(nextPrompt.right_choice_text, {
            length: 140,
            omission: "…",
          }),
          left_choice_id: nextPrompt.left_choice_id,
          left_choice_url: this.getQuestionChoicePath(
            question_id,
            nextPrompt.left_choice_id
          ),
          right_choice_id: nextPrompt.right_choice_id,
          right_choice_url: this.getQuestionChoicePath(
            question_id,
            nextPrompt.right_choice_id
          ),
          appearance_lookup: nextPrompt.appearance_id,
          prompt_id: nextPrompt.id,
        };

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(422).send("Vote unsuccessful.");
      }
    } else {
      res.status(422).send("Vote unsuccessful.");
    }
  }

  async createQuestion(req: Request, res: Response) {
    const questionParams = req.body;

    console.log(`in createQuestion: ${JSON.stringify(questionParams.ideas)}`);

    if (questionParams.ideas.length < 4) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const requestBody = {
      name: questionParams.question,
      ideas: questionParams.ideas
        .filter((i: string) => i.length > 3)
        .join("\r\n"),
      url: "noUrl",
      information: "noInformation",
      userId: (req.user as YpUserData).id,
    };

    try {
      const response = await fetch(`${PAIRWISE_API_HOST}/questions.json`, {
        method: "POST",
        headers: defaultHeader,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create question");
      }

      const question = (await response.json()) as AoiQuestionData;

      res.json({ question_id: question.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred during question creation" });
    }
  }

  public async skip(req: Request, res: Response) {
    const { id, question_id } = req.body;
    const skipOptions = this.getVoteRequestOptions(req.body, "skip");
    const nextPromptOptions = this.getNextPromptOptions(req);

    try {
      const response = await fetch(
        `${PAIRWISE_API_HOST}/questions/${question_id}/prompts/${id}/skip.json`,
        {
          method: "PUT",
          headers: defaultHeader,
          body: JSON.stringify({
            question_id,
            skip: skipOptions,
            next_prompt: nextPromptOptions,
          }),
        }
      );

      if (!response.ok) throw new Error("Skip failed.");

      const nextPrompt = (await response.json()) as AoiPromptData;

      const result = {
        newleft: this.truncate(nextPrompt.left_choice_text, {
          length: 140,
          omission: "…",
        }),
        newright: this.truncate(nextPrompt.right_choice_text, {
          length: 140,
          omission: "…",
        }),
        left_choice_id: nextPrompt.left_choice_id,
        left_choice_url: this.getQuestionChoicePath(
          question_id,
          nextPrompt.left_choice_id
        ),
        right_choice_id: nextPrompt.right_choice_id,
        right_choice_url: this.getQuestionChoicePath(
          question_id,
          nextPrompt.right_choice_id
        ),
        appearance_lookup: nextPrompt.appearance_id,
        prompt_id: nextPrompt.id,
      };

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(422).json({ error: "Skip failed" });
    }
  }

  public async getChoices(req: Request, res: Response): Promise<void> {
    try {
      const questionId = req.params.questionId;
      const showAll = req.query.showAll;

      let url = `${PAIRWISE_API_HOST}/questions/${questionId}/choices.json${
        showAll ? "?include_inactive=true&show_all=true" : ""
      }`;

      const response = await fetch(url, {
        headers: defaultAuthHeader,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch choices: ${response.statusText}`);
      }

      const choices = await response.json();
      res.json(choices);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }

  // You need to implement these functions based on your application's logic
  getQuestionChoicePath(questionId: number, choiceId: number): string {
    // Implement logic to generate choice path
    return `/questions/${questionId}/choices/${choiceId}.json`;
  }

  getNextPromptOptions(req: Request): any {
    const nextPromptParams: any = {
      with_appearance: true,
      with_visitor_stats: true,
      visitor_identifier: req.session.id,
    };

    return nextPromptParams;
  }

  getVoteRequestOptions(
    req: Request,
    requestType: "vote" | "skip" | "skip_after_flag"
  ): any {
    const session = req.session; // Assuming express-session middleware is used
    const params = req.body; // Assuming body-parser middleware is used for JSON body parsing

    const options: any = {
      visitor_identifier: session.id,
      // Use a static value of 5 if in test environment, so we can mock resulting API queries
      time_viewed: process.env.NODE_ENV === "test" ? 5 : params.time_viewed,
      appearance_lookup: params.appearance_lookup,
    };

    const trackingData: any = {
      user_agent_hash: crypto
        .createHash("sha256")
        .update(req.headers["user-agent"] || "")
        .digest("hex"),
      ip_address: req.ip,
      browser_id: params.checksum_a,
      fp: params.checksum_b,
      fp_confidence: params.checksum_c,
      // Directly include UTM parameters if they exist
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      utm_term: params.utm_term,
      utm_content: params.utm_content,
      utm_referrer: params.utm_referrer,
    };

    options.tracking = trackingData;

    switch (requestType) {
      case "vote":
        options.direction = params.direction;
        options.skip_fraud_protection = true;
        break;
      case "skip":
        options.skip_reason = params.cant_decide_reason;
        break;
      case "skip_after_flag":
        options.skip_reason = params.flag_reason;
        break;
    }

    return options;
  }

  truncate(
    text: string,
    options: { length: number; omission?: string }
  ): string {
    const defaultOptions = { length: 30, omission: "…" };
    const { length, omission } = { ...defaultOptions, ...options };

    if (text.length <= length) {
      return text;
    }

    const truncatedText = text.slice(0, length - omission.length);
    return truncatedText + omission;
  }

  /*async analysis(req: Request, res: Response) {
    const { id } = req.params;
    const { analysisIndex, typeIndex } = req.query;

    // Fetch Earl by name (id in this context)
    const earlResponse = await fetch(`{API_HOST}/earls/${id}`);
    const earl = await earlResponse.json();
    const question = earl.question;
    const questionId = question.id;

    const choicesCount = question.activeChoices;

    // Authorization check (You need to implement `currentUserCanViewResults`)
    if (!currentUserCanViewResults(req.user, earl)) {
      console.log(`Current user is: ${req.user}`);
      return res.status(403).json({ message: 'Not authorized to view results' });
    }

    console.log(`@question is ${question}.`);

    const analysisConfig = JSON.parse(earl.configuration.analysisConfig);
    const analysisIdeaConfig = analysisConfig.analyses[parseInt(analysisIndex)];
    const ideasIdsRange = analysisIdeaConfig.ideasIdsRange;
    const analysis = analysisIdeaConfig.analysisTypes[parseInt(typeIndex)];

    const perPage = Math.abs(ideasIdsRange);
    console.log(`Per page: ${perPage}`);

    const offset = ideasIdsRange < 0 ? Math.max(choicesCount - perPage, 0) : 0;
    console.log(`Offset: ${offset}`);

    // Fetch choices (You need to implement this API call)
    const choicesResponse = await fetch(`{API_HOST}/questions/${questionId}/choices?limit=${perPage}&offset=${offset}`);
    const choices = await choicesResponse.json();

    console.log(`Number of choices fetched: ${choices.length}`);

    const sortedChoices = choices.sort((a, b) => a.id - b.id);
    console.log(`Sorted choice IDs: ${sortedChoices.map(choice => choice.id)}`);

    const choiceIds = sortedChoices.map(choice => `${choice.id}`).join("-");
    const promptHash = crypto.createHash('sha256').update(analysis.contextPrompt).digest('hex').substring(0, 8);

    const analysisCacheKey = `${questionId}_${typeIndex}_${choiceIds}_${promptHash}_ai_analysis_v8`;
    console.log(`analysisCacheKey is ${analysisCacheKey} prompt ${analysis.contextPrompt.substring(0, 15)}...`);

    // Implement caching logic here
    let outAnalysis = await getAnalysisFromCache(analysisCacheKey);

    if (!outAnalysis) {
      const tempAnalysis = await getAiAnalysis(questionId, analysis.contextPrompt, choices);
      if (tempAnalysis && tempAnalysis.length > 7) {
        // Implement caching logic here
        await cacheAnalysis(analysisCacheKey, tempAnalysis, 18 * 60 * 60); // 18 hours
        outAnalysis = tempAnalysis;
      }
    }

    res.json({
      ideaRowsFromServer: choices,
      analysis: outAnalysis
    });
  }*/
}
