import { StatusCodes } from "http-status-codes";

import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export class NotFoundError extends ExpressError {
  constructor(item: string) {
    super(StatusCodes.NOT_FOUND, `${item} Not Found!`);
  }
}
