import { Request, Response, NextFunction } from "express";

import { NotFoundError } from "main/utils/errors/NotFoundError/NotFoundError";

export const handleUnmatchedPaths = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  return next(new NotFoundError("Endpoint"));
};
