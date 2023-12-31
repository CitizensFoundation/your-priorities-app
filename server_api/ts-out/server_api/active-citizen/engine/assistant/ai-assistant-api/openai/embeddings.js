"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbedding = void 0;
const openai_1 = require("openai");
const config = new openai_1.Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const createEmbedding = async (text) => {
    const openai = new openai_1.OpenAIApi(config);
    const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
    });
    return {
        embeddings: response.data.data[0].embedding,
        totalTokens: response.data.usage.total_tokens
    };
};
exports.createEmbedding = createEmbedding;
