import { CustomError } from "./custom-errors";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";
  
  constructor() {
    // The message is used for logging purposes, not for the client.
    super("Error connecting to database");

    // Without this line, instanceof can sometimes return false even when
    //  it should be true — because TypeScript's transpiled output can lose the prototype chain.
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}