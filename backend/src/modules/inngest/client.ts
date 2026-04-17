import { Inngest } from "inngest"
import { ENV } from "../../config/env"

export const inngest = new Inngest({ id: ENV.INNGEST.id })
