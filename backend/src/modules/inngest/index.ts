import { inngest } from "./client"
import { fetchEmail, processEmail } from "./functions"
import { serve } from "inngest/bun"

const functions = [fetchEmail, processEmail]

export const inngestHandler = serve({ client: inngest, functions })
