import WebSocket from "ws";
import express, { Request, Response } from "express";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
}
export declare class AllOurIdeasController {
    path: string;
    router: import("express-serve-static-core").Router;
    wsClients: Map<string, WebSocket>;
    constructor(wsClients: Map<string, WebSocket>);
    initializeRoutes(): Promise<void>;
    getAoiSiteStats(req: Request, res: Response): Promise<void>;
    addIdea(req: Request, res: Response): Promise<void>;
    getModerationFlag(data: string): Promise<boolean>;
    getModerationResults(data: string): Promise<void>;
    deactivateChoice(req: Request, choice: AoiChoiceData): Promise<void>;
    getTranslatedText(req: Request, res: Response): Promise<void>;
    generateIdeas(req: Request, res: Response): Promise<void>;
    getXlsExportProgress(req: Request, res: Response): Promise<void>;
    exportXls(req: Request, res: Response): Promise<void>;
    llmAnswerExplain(req: Request, res: Response): Promise<void>;
    showEarl(req: Request, res: Response): Promise<void>;
    vote(req: Request, res: Response): Promise<void>;
    createQuestion(req: Request, res: Response): Promise<void>;
    updateCoiceData(req: Request, res: Response): Promise<void>;
    updateActive(req: Request, res: Response): Promise<void>;
    updateQuestionName(req: Request, res: Response): Promise<void>;
    skip(req: Request, res: Response): Promise<void>;
    analysis(req: YpRequest, res: Response): Promise<void>;
    private fetchChoices;
    getChoices(req: Request, res: Response): Promise<void>;
    getQuestionChoicePath(questionId: number, choiceId: number): string;
    getNextPromptOptions(req: Request): any;
    getVoteRequestOptions(req: Request, requestType: "vote" | "skip" | "skip_after_flag"): any;
}
export {};
