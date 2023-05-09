import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

import type { GeneratedTokens } from "main/utils/jwt/interfaces";
import type { AuthRequestBody } from "main/auth/interfaces";

import { registerUserBridge, loginUserBridge } from "main/auth/bridges";

export const registerUserView = async (
  req: Request<object, object, AuthRequestBody, object>,
  res: Response<GeneratedTokens>
): Promise<void> => {
  const generatedTokens = await registerUserBridge(
    req.body.username,
    req.body.password
  );

  res.status(StatusCodes.CREATED).json(generatedTokens);
};

export const loginUserView = async (
  req: Request<object, object, AuthRequestBody, object>,
  res: Response<GeneratedTokens>
): Promise<void> => {
  const generatedTokens = await loginUserBridge(
    req.body.username,
    req.body.password
  );

  res.status(StatusCodes.CREATED).json(generatedTokens);
};
