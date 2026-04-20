export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): { message: string; field?: string }[];

  constructor(message: string) {
    super(message);

    // Without this line, instanceof can sometimes return false even when
    //  it should be true — because TypeScript's transpiled output can lose the prototype chain.
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
