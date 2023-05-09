import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "main/utils/jwt/tokens";

import { UnauthorizedError } from "main/utils/errors/UnauthorizedError/UnauthorizedError";

export const isAuthenticated = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    throw new UnauthorizedError();
  }

  const receivedJWT = authorization.replace("Bearer ", "");

  const decodedPayload = verifyAccessToken(receivedJWT);

  if (decodedPayload === null) {
    throw new UnauthorizedError();
  }

  req.context = {
    customJWTPayload: decodedPayload,
  };

  return next();
};
