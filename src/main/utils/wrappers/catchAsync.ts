import { Request, Response, NextFunction } from "express";

export const catchAsync =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
