import { CustomError } from "./custom-errors";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super("Not authorized");

    // Without this line, instanceof can sometimes return false even when
    //  it should be true — because TypeScript's transpiled output can lose the prototype chain.
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}