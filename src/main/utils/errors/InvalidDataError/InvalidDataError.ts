import { StatusCodes } from "http-status-codes";

import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export class InvalidDataError extends ExpressError {
  constructor(data: string) {
    super(StatusCodes.BAD_REQUEST, `Invalid ${data}!`);
  }
}
