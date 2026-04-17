export class BadRequest extends Error {
  status = 400
  constructor(public message: string) {
    super(message)
  }
}

export class Unauthorized extends Error {
  status = 401
  constructor(public message: string) {
    super(message)
  }
}

export class Forbidden extends Error {
  status = 403
  constructor(public message: string) {
    super(message)
  }
}

export class NotFoundError extends Error {
  status = 404
  constructor(public message: string) {
    super(message)
  }
}

export class Conflict extends Error {
  status = 409
  constructor(public message: string) {
    super(message)
  }
}

const ERROR_MAP = {
  bad_request: BadRequest,
  unauthorized: Unauthorized,
  forbidden: Forbidden,
  not_found: NotFoundError,
  conflict: Conflict,
} as const

type ErrorType = keyof typeof ERROR_MAP

export function createError(type: ErrorType, message: string): never {
  throw new ERROR_MAP[type](message)
}
