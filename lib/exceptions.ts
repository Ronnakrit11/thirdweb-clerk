export class LineError extends Error {
    constructor(message: string, public readonly cause?: unknown) {
      super(message);
      this.name = 'LineError';
    }
  }
  
  export function handleError(error: unknown): string {
    if (error instanceof LineError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }