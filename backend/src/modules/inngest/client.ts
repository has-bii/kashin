import { ENV } from "../../config/env"
import { Inngest } from "inngest"

export const inngest = new Inngest({ id: ENV.INNGEST.id })
