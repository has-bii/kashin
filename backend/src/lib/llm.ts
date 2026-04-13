import { ChatOpenAI } from "@langchain/openai"

export const llm = new ChatOpenAI({
  modelName: process.env.LLM_EMAIL_EXTRACTION_MODEL,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
  temperature: 0,
})
