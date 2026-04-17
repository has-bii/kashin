import { ChatOpenAI } from "@langchain/openai"

export const model = new ChatOpenAI({
  modelName: process.env.MODEL_EXTRACTION,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  reasoning: {
    effort: "high",
    summary: "detailed",
  },
  modelKwargs: {
    response_format: { type: "json_object" },
  },
  temperature: 1,
  maxRetries: 0,
})
