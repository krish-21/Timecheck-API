export class ExpressError extends Error {
  public statusCode: number;
  public override message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
