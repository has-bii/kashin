import { inngest } from "./client"
import { processEmail } from "./functions"
import { serve } from "inngest/bun"

const functions = [processEmail]

export const inngestHandler = serve({ client: inngest, functions })
