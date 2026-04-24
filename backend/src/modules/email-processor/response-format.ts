import * as z from "zod"

export const responseFormat = z.object({
  isTransaction: z.boolean().describe("Whether the email is a transaction"),
  description: z.string().describe("Description of the email or transaction"),
  data: z
    .object({
      merchant: z.string().describe("The merchant name"),
      amount: z.number().describe("The transaction amount"),
      currency: z.string().describe("The transaction currency. Default is IDR"),
      categoryId: z
        .string()
        .nullable()
        .describe("Id from the Available Categories list. null if no match."),
      bankAccountId: z
        .string()
        .nullable()
        .describe("Id from the Available Bank Accounts list. null if no match."),
      type: z.enum(["expense", "income"]).describe("Type of the transaction"),
      suggestedCategory: z
        .string()
        .nullable()
        .describe("If categoryId is null, suggest a short category name"),
    })
    .nullable()
    .describe("The transaction data if the email is a transaction, otherwise null"),
})
