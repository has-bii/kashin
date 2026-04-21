type Env = {
  DATABASE: {
    url: string
  }
  AUTH: {
    betterAuthUrl: string
    betterAuthSecret: string
    googleClientId: string
    googleClientSecret: string
    cookiePrefix: string | undefined
    domain: string | undefined
    frontendUrl: string
  }
  SERVER: {
    port: number
    backendUrl: string
  }
  EMAIL: {
    resendApiKey: string
    from: string
  }
  LLM: {
    model: string
    openAiApiKey: string
    baseUrl: string | undefined
    httpReferer: string | undefined
    xTitle: string | undefined
  }
  QSTASH: {
    url: string
    token: string
    currentSigningKey: string
    nextSigningKey: string
  }
  INNGEST: {
    id: string
  }
  GOOGLE: {
    serviceAccountCredential: string
    topicName: string
    audience: string
  }
  LOG: {
    level: string
    nodeEnv: string
  }
}

function getRequired(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

export const ENV: Env = {
  DATABASE: {
    url: getRequired("DATABASE_URL"),
  },
  AUTH: {
    betterAuthUrl: getRequired("BETTER_AUTH_URL"),
    betterAuthSecret: getRequired("BETTER_AUTH_SECRET"),
    googleClientId: getRequired("GOOGLE_CLIENT_ID"),
    googleClientSecret: getRequired("GOOGLE_CLIENT_SECRET"),
    cookiePrefix: process.env.COOKIE_PREFIX,
    domain: process.env.DOMAIN,
    frontendUrl: getRequired("FRONTEND_URL"),
  },
  SERVER: {
    port: Number(process.env.PORT) || 3030,
    backendUrl: getRequired("BACKEND_URL"),
  },
  EMAIL: {
    resendApiKey: getRequired("RESEND_API_KEY"),
    from: process.env.EMAIL_FROM ?? "Kashin <noreply@kashin.app>",
  },
  LLM: {
    model: getRequired("MODEL_EXTRACTION"),
    openAiApiKey: getRequired("OPENAI_API_KEY"),
    baseUrl: process.env.LLM_BASE_URL,
    httpReferer: process.env.LLM_HTTP_REFERER,
    xTitle: process.env.LLM_X_TITLE,
  },
  QSTASH: {
    url: getRequired("QSTASH_URL"),
    token: getRequired("QSTASH_TOKEN"),
    currentSigningKey: getRequired("QSTASH_CURRENT_SIGNING_KEY"),
    nextSigningKey: getRequired("QSTASH_NEXT_SIGNING_KEY"),
  },
  INNGEST: {
    id: process.env.INNGEST_ID || "kashin-dev",
  },
  GOOGLE: {
    serviceAccountCredential: getRequired("SERVICE_ACCOUNT_CREDENTIAL"),
    topicName: getRequired("TOPIC_NAME"),
    audience: getRequired("GMAIL_AUDIENCE"),
  },
  LOG: {
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
    nodeEnv: process.env.NODE_ENV ?? "development",
  },
}
