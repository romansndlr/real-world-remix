export class ValidationError extends Error {
  constructor(public errors?: Record<string, string[]>) {
    super();
  }
}
