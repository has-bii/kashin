import { StateGraph, Annotation, END } from "@langchain/langgraph"
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { llm } from "../../lib/llm"
import {
  createGetCategoriesTool,
  createGetBankAccountsTool,
  createGetRecentTransactionsTool,
} from "./tools"

const EmailState = Annotation.Root({
  emailBody: Annotation<string>,
  fromAddress: Annotation<string>,
  subject: Annotation<string>,
  userId: Annotation<string>,
  isTransaction: Annotation<boolean>,
  extraction: Annotation<{
    vendor: string | null
    amount: number | null
    currency: string | null
    date: string | null
    type: "expense" | "income" | null
    notes: string | null
    suggestedCategoryId: string | null
    bankAccountId: string | null
    confidenceScore: number | null
  } | null>,
})

async function detectNode(state: typeof EmailState.State) {
  const response = await llm.invoke([
    new SystemMessage(
      "You are an email classifier. Determine if this email is a bank transaction notification (purchase, transfer, payment, withdrawal, deposit). Respond with valid JSON only: { \"isTransaction\": true/false }",
    ),
    new HumanMessage(
      `From: ${state.fromAddress}\nSubject: ${state.subject}\n\n${state.emailBody}`,
    ),
  ])

  try {
    const parsed = JSON.parse(response.content as string)
    return { isTransaction: parsed.isTransaction ?? false }
  } catch {
    return { isTransaction: false }
  }
}

async function extractNode(state: typeof EmailState.State) {
  const tools = [
    createGetCategoriesTool(state.userId),
    createGetBankAccountsTool(state.userId),
    createGetRecentTransactionsTool(state.userId),
  ]

  const systemPrompt = `You are a financial transaction extraction agent. Your task is to extract transaction details from bank emails.

Instructions:
1. Call tools to get user context (categories, bank accounts, recent transactions)
2. Extract these fields:
   - vendor: The merchant or bank name
   - amount: Transaction amount as a number
   - currency: Currency code (default "IDR" if not specified)
   - date: Transaction date in ISO format (YYYY-MM-DD)
   - type: Either "expense" or "income"
   - notes: Any additional details
   - suggestedCategoryId: The category ID that best matches (from tool results)
   - bankAccountId: The bank account ID that this transaction belongs to (from tool results)
   - confidenceScore: Your confidence in the extraction (0-1)

Return ONLY valid JSON with these exact fields. Ensure amount is a number, not a string.`

  const agent = createReactAgent({
    llm,
    tools,
    messageModifier: (messages: BaseMessage[]) => [
      new SystemMessage(systemPrompt),
      ...messages,
    ],
  })

  const result = await agent.invoke({
    messages: [
      new HumanMessage(
        `Extract transaction details from this email.\n\nFrom: ${state.fromAddress}\nSubject: ${state.subject}\n\n${state.emailBody}`,
      ),
    ],
  })

  try {
    const lastMessage = result.messages[result.messages.length - 1]
    const content = lastMessage.content as string

    // Try to find JSON in the content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { extraction: null }
    }

    const extraction = JSON.parse(jsonMatch[0])
    return {
      extraction: {
        vendor: extraction.vendor ?? null,
        amount: typeof extraction.amount === "number" ? extraction.amount : null,
        currency: extraction.currency ?? "IDR",
        date: extraction.date ?? null,
        type: extraction.type ?? null,
        notes: extraction.notes ?? null,
        suggestedCategoryId: extraction.suggestedCategoryId ?? null,
        bankAccountId: extraction.bankAccountId ?? null,
        confidenceScore: extraction.confidenceScore ?? null,
      },
    }
  } catch {
    return { extraction: null }
  }
}

export function createEmailProcessorGraph() {
  const graph = new StateGraph(EmailState)
    .addNode("detect", detectNode)
    .addNode("extract", extractNode)
    .addEdge("__start__", "detect")
    .addConditionalEdges("detect", (state) => {
      return state.isTransaction ? "extract" : END
    })
    .addEdge("extract", END)

  return graph.compile()
}
