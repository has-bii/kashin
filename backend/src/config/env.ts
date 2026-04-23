type Env = {
  DB: {
    url: string
  }
  AUTH: {
    url: string
    secret: string
    googleClientId: string
    googleClientSecret: string
    cookiePrefix: string | undefined
    domain: string | undefined
  }
  APP: {
    frontendUrl: string
  }
  SERVER: {
    port: number
    url: string
  }
  EMAIL: {
    resendApiKey: string
    from: string
  }
  LLM: {
    model: string
    apiKey: string
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
    pubsubTopicName: string
    gmailAudience: string
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
  DB: {
    url: getRequired("DB_URL"),
  },
  AUTH: {
    url: getRequired("AUTH_URL"),
    secret: getRequired("AUTH_SECRET"),
    googleClientId: getRequired("AUTH_GOOGLE_CLIENT_ID"),
    googleClientSecret: getRequired("AUTH_GOOGLE_CLIENT_SECRET"),
    cookiePrefix: process.env.AUTH_COOKIE_PREFIX,
    domain: process.env.AUTH_DOMAIN,
  },
  APP: {
    frontendUrl: getRequired("APP_FRONTEND_URL"),
  },
  SERVER: {
    port: Number(process.env.SERVER_PORT) || 3030,
    url: getRequired("SERVER_URL"),
  },
  EMAIL: {
    resendApiKey: getRequired("EMAIL_RESEND_API_KEY"),
    from: process.env.EMAIL_FROM ?? "Kashin <noreply@kashin.app>",
  },
  LLM: {
    model: getRequired("LLM_MODEL"),
    apiKey: getRequired("LLM_API_KEY"),
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
    serviceAccountCredential: getRequired("GOOGLE_SERVICE_ACCOUNT_CREDENTIAL"),
    pubsubTopicName: getRequired("GOOGLE_PUBSUB_TOPIC_NAME"),
    gmailAudience: getRequired("GOOGLE_GMAIL_AUDIENCE"),
  },
  LOG: {
    level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
    nodeEnv: process.env.NODE_ENV ?? "development",
  },
}
