interface NestErrorData {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiError extends Error {
  readonly name = 'ApiError' as const;

  constructor(
    message: string,
    public readonly status: number,
    public readonly data: NestErrorData
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype); // Fix Hermes prototype chain
  }
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && (e as { name?: unknown }).name === 'ApiError';
}
