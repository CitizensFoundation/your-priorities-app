"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllOurIdeasController = void 0;
const index_js_1 = __importDefault(require("../models/index.js"));
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const dbModels = index_js_1.default;
const Group = dbModels.Group;
const PAIRWISE_API_HOST = process.env.PAIRWISE_API_HOST;
const PAIRWISE_USERNAME = process.env.PAIRWISE_USERNAME;
const PAIRWISE_PASSWORD = process.env.PAIRWISE_PASSWORD;
const defaultAuthHeader = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${PAIRWISE_USERNAME}:${PAIRWISE_PASSWORD}`).toString("base64")}`,
};
const defaultHeader = {
    ...{ "Content-Type": "application/json" },
    ...defaultAuthHeader,
};
const authorization_js_1 = __importDefault(require("../authorization.js"));
const aiHelper_js_1 = require("../active-citizen/engine/allOurIdeas/aiHelper.js");
class AllOurIdeasController {
    path = "/api/allOurIdeas";
    router = express_1.default.Router();
    wsClients;
    constructor(wsClients) {
        this.wsClients = wsClients;
        this.initializeRoutes();
    }
    async initializeRoutes() {
        this.router.get("/:groupId", authorization_js_1.default.can("view group"), this.showEarl.bind(this));
        this.router.post("/:communityId/questions", authorization_js_1.default.can("create group"), this.createQuestion.bind(this));
        this.router.put("/:communityId/generateIdeas", authorization_js_1.default.can("create group"), this.generateIdeas.bind(this));
        this.router.get("/:communityId/choices/:questionId", authorization_js_1.default.can("create group"), this.getChoices.bind(this));
        this.router.post("/:groupId/questions/:questionId/prompts/:promptId/votes", authorization_js_1.default.can("view group"), this.vote.bind(this));
        this.router.post("/:groupId/questions/:questionId/prompts/:promptId/skips", authorization_js_1.default.can("view group"), this.skip.bind(this));
        console.log("---- have initialized routes for allOurIdeasController");
    }
    async generateIdeas(req, res) {
        const { currentIdeas, wsClientSocketId, question } = req.body;
        console.log(`generateIdeas: ${wsClientSocketId}`);
        const swClientSocket = this.wsClients.get(wsClientSocketId);
        if (swClientSocket) {
            const aiHelper = new aiHelper_js_1.AiHelper(swClientSocket);
            await aiHelper.getAnswerIdeas(question, currentIdeas, "");
            res.sendStatus(200);
        }
        else {
            //TODO: Have it refresh the websocket on the client
            res.status(404).send("Websocket not found");
        }
    }
    async showEarl(req, res) {
        const { groupId } = req.params;
        const locale = req.query.locale;
        try {
            const group = (await Group.findOne({
                where: {
                    id: groupId
                }
            }));
            const aoiConfig = group.configuration.allOurIdeas;
            if (group && aoiConfig?.earl) {
                const showParams = {
                    with_prompt: true,
                    with_appearance: true,
                    with_visitor_stats: true,
                    visitor_identifier: req.session.id
                };
                const questionResponse = await fetch(`${PAIRWISE_API_HOST}/questions/${aoiConfig.earl.question_id}.json?${new URLSearchParams(showParams).toString()}`, {
                    method: "GET",
                    headers: defaultHeader,
                });
                if (!questionResponse.ok) {
                    throw new Error("Failed to fetch question");
                }
                const question = (await questionResponse.json());
                const { picked_prompt_id } = question;
                const question_id = question.id;
                console.log(`picked_prompt_id: ${picked_prompt_id}`);
                console.log(`question_id: ${question_id}`);
                const promptResponse = await fetch(`${PAIRWISE_API_HOST}/questions/${question_id}/prompts/${picked_prompt_id}.json`, {
                    method: "GET",
                    headers: defaultHeader,
                });
                if (!promptResponse.ok) {
                    throw new Error("Failed to fetch prompt");
                }
                const prompt = await promptResponse.json();
                res.json({
                    prompt: prompt,
                    question: question,
                });
            }
            else {
                res.status(404).send("Not found");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    }
    async vote(req, res) {
        const { id, question_id, direction } = req.body;
        const voteOptions = this.getVoteRequestOptions(req, "vote");
        const nextPromptOptions = this.getNextPromptOptions(req);
        if (direction) {
            try {
                const response = await fetch(`${PAIRWISE_API_HOST}/questions/${req.params.questionId}/prompts/${req.params.promptId}/vote`, {
                    method: "PUT",
                    headers: defaultHeader,
                    body: JSON.stringify({
                        question_id,
                        vote: voteOptions,
                        next_prompt: nextPromptOptions,
                    }),
                });
                if (!response.ok)
                    throw new Error("Vote unsuccessful.");
                const nextPrompt = (await response.json());
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
                    left_choice_url: this.getQuestionChoicePath(question_id, nextPrompt.left_choice_id),
                    right_choice_id: nextPrompt.right_choice_id,
                    right_choice_url: this.getQuestionChoicePath(question_id, nextPrompt.right_choice_id),
                    appearance_lookup: nextPrompt.appearance_id,
                    prompt_id: nextPrompt.id,
                };
                res.json(result);
            }
            catch (error) {
                console.error(error);
                res.status(422).send("Vote unsuccessful.");
            }
        }
        else {
            res.status(422).send("Vote unsuccessful.");
        }
    }
    async createQuestion(req, res) {
        const questionParams = req.body;
        console.log(`in createQuestion: ${JSON.stringify(questionParams.ideas)}`);
        if (questionParams.ideas.length < 4) {
            return res.status(400).json({ error: "Invalid input" });
        }
        const requestBody = {
            name: questionParams.question,
            ideas: questionParams.ideas
                .filter((i) => i.length > 3)
                .join("\r\n"),
            url: "noUrl",
            information: "noInformation",
            userId: req.user.id,
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
            const question = (await response.json());
            res.json({ question_id: question.id });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "An error occurred during question creation" });
        }
    }
    async skip(req, res) {
        const { id, question_id } = req.body;
        const skipOptions = this.getVoteRequestOptions(req, "skip");
        const nextPromptOptions = this.getNextPromptOptions(req);
        try {
            const response = await fetch(`${PAIRWISE_API_HOST}/questions/${req.params.questionId}/prompts/${req.params.promptId}/skip.json`, {
                method: "PUT",
                headers: defaultHeader,
                body: JSON.stringify({
                    question_id,
                    skip: skipOptions,
                    next_prompt: nextPromptOptions,
                }),
            });
            if (!response.ok)
                throw new Error("Skip failed.");
            const nextPrompt = (await response.json());
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
                left_choice_url: this.getQuestionChoicePath(question_id, nextPrompt.left_choice_id),
                right_choice_id: nextPrompt.right_choice_id,
                right_choice_url: this.getQuestionChoicePath(question_id, nextPrompt.right_choice_id),
                appearance_lookup: nextPrompt.appearance_id,
                prompt_id: nextPrompt.id,
            };
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(422).json({ error: "Skip failed" });
        }
    }
    async getChoices(req, res) {
        try {
            const questionId = req.params.questionId;
            const showAll = req.query.showAll;
            let url = `${PAIRWISE_API_HOST}/questions/${questionId}/choices.json${showAll ? "?include_inactive=true&show_all=true" : ""}`;
            const response = await fetch(url, {
                headers: defaultAuthHeader,
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch choices: ${response.statusText}`);
            }
            const choices = await response.json();
            res.json(choices);
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    }
    // You need to implement these functions based on your application's logic
    getQuestionChoicePath(questionId, choiceId) {
        // Implement logic to generate choice path
        return `/questions/${questionId}/choices/${choiceId}.json`;
    }
    getNextPromptOptions(req) {
        const nextPromptParams = {
            with_appearance: true,
            with_visitor_stats: true,
            visitor_identifier: req.session.id,
        };
        return nextPromptParams;
    }
    getVoteRequestOptions(req, requestType) {
        const session = req.session; // Assuming express-session middleware is used
        const params = req.body; // Assuming body-parser middleware is used for JSON body parsing
        console.log(`getVoteRequestOptions: ${JSON.stringify(params)} s: ${session}`);
        const options = {
            visitor_identifier: session.id,
            // Use a static value of 5 if in test environment, so we can mock resulting API queries
            time_viewed: process.env.NODE_ENV === "test" ? 5 : params.time_viewed,
            appearance_lookup: params.appearance_lookup,
        };
        const trackingData = {
            user_agent_hash: crypto_1.default
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
    truncate(text, options) {
        const defaultOptions = { length: 30, omission: "…" };
        const { length, omission } = { ...defaultOptions, ...options };
        if (text.length <= length) {
            return text;
        }
        const truncatedText = text.slice(0, length - omission.length);
        return truncatedText + omission;
    }
}
exports.AllOurIdeasController = AllOurIdeasController;
