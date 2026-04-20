import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public readonly errors: ValidationError[]) {
    // The message is used for logging purposes, not for the client.
    super("Invalid request parameters");

    // Without this line, instanceof can sometimes return false even when
    //  it should be true — because TypeScript's transpiled output can lose the prototype chain.
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(){
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}

