import { StatusCodes } from "http-status-codes";

import { appConfig } from "main/utils/environment/AppConfig";
import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export class UnauthorizedError extends ExpressError {
  constructor(message?: string) {
    if (appConfig.env === "development" || appConfig.env === "test") {
      super(
        StatusCodes.UNAUTHORIZED,
        `Unauthorized! (${message !== undefined ? message : ""})`
      );
    } else {
      super(StatusCodes.UNAUTHORIZED, `Unauthorized!`);
    }
  }
}
