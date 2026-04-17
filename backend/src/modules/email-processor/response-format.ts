import * as z from "zod"

export const responseFormat = z.object({
  isTransaction: z.boolean().describe("True if the email describes a financial transaction"),
  message: z.string().optional().describe("Your response message"),
  data: z
    .object({
      merchant: z.string().nullable().describe("The name of the merchant or vendor or person"),
      amount: z.number().describe("The numeric value of the transaction"),
      currency: z.string().describe("3-letter currency code. E.g. IDR"),
      bankAccountId: z.string().nullable().describe("id from getBankAccounts tool"),
      categoryId: z.string().nullable().describe("id from getCategories tool"),
      date: z.string().nullable().describe("ISO formatted date of the transaction"),
      type: z.enum(["expense", "income"]).nullable().describe("The type of transaction"),
      notes: z
        .string()
        .nullable()
        .describe(
          "The description of the transaction, e.g., Payment to Minimarket, or Transfer to Alex",
        ),
      confidence: z.number().min(0).max(1).describe("Certainty score of the extraction"),
      suggestedCategory: z
        .string()
        .nullable()
        .describe(
          "If categoryId is null, provide category suggestion, e.g., food, groceries, utilities, transport",
        ),
    })
    .nullable()
    .describe("The transaction detail. Set it null if isTransaction is false."),
})
