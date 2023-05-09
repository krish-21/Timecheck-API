import { StatusCodes } from "http-status-codes";

import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export class AlreadyExistsError extends ExpressError {
  constructor(item: string) {
    super(StatusCodes.CONFLICT, `${item} Already Exists!`);
  }
}
