import { ChatOpenAI } from "@langchain/openai"

export const model = new ChatOpenAI({
  modelName: process.env.MODEL_EXTRACTION,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.LLM_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": process.env.LLM_HTTP_REFERER,
      "X-Title": process.env.LLM_X_TITLE,
    },
  },
  reasoning: {
    effort: "high",
    summary: "detailed",
  },
  modelKwargs: {
    response_format: { type: "json_object" },
  },
  temperature: 0.7,
  maxRetries: 0,
})
