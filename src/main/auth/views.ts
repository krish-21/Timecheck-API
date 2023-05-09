import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { GeneratedTokens } from "main/utils/jwt/interfaces";
import type { AuthRequestBody } from "main/auth/interfaces";

import { registerUserBridge } from "main/auth/bridges";

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
