"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_async = __importStar(require("openai_async"));
const os = __importStar(require("os"));
const base64 = __importStar(require("base64"));
async function get_question_analysis(original_question, configuration) {
    const refine_question_and_concept = base64.b64decode(configuration["prompts"]["questionAnalysis"]["promptBase64"]).decode('utf-8');
    const refined_question_and_concept = refine_question_and_concept.replace("{original_question}", original_question);
    const messages = [
        {
            "role": "system",
            "content": configuration["prompts"]["questionAnalysis"]["system"],
        },
        {
            "role": "user",
            "content": `${refined_question_and_concept}`,
        },
    ];
    const response = await openai_async.chat_complete(os.getenv('OPENAI_API_KEY'), {
        "timeout": 20,
        "payload": {
            "model": "gpt-3.5-turbo",
            "temperature": 0.0,
            "max_tokens": 128,
            "messages": messages,
        },
    });
    return response.json()["choices"][0]["message"]["content"];
}
