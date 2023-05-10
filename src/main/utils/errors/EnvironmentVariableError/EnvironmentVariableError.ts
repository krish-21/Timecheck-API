import { StatusCodes } from "http-status-codes";

import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export class EnvironmentVariableError extends ExpressError {
  constructor() {
    super(StatusCodes.INTERNAL_SERVER_ERROR, "Environment Error");
  }
}
