import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

export const createEmbedding = async (text: string) => {
  const openai = new OpenAIApi(config);
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });

  return {
    embeddings: response.data.data[0].embedding,
    totalTokens: response.data.usage.total_tokens
  };
};
