import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

import type {
  AuthRequestBody,
  RefreshRequestBody,
  AuthResponse,
  LogoutUserResponse,
} from "main/auth/interfaces";

import {
  registerUserBridge,
  loginUserBridge,
  refreshUserTokensBridge,
  logoutUserBridge,
} from "main/auth/bridges";

export const registerUserView = async (
  req: Request<object, object, AuthRequestBody, object>,
  res: Response<AuthResponse>
): Promise<void> => {
  const authResponse = await registerUserBridge(
    req.body.username,
    req.body.password
  );

  res.status(StatusCodes.CREATED).json(authResponse);
};

export const loginUserView = async (
  req: Request<object, object, AuthRequestBody, object>,
  res: Response<AuthResponse>
): Promise<void> => {
  const authResponse = await loginUserBridge(
    req.body.username,
    req.body.password
  );

  res.status(StatusCodes.CREATED).json(authResponse);
};

export const refreshUserTokensView = async (
  req: Request<object, object, RefreshRequestBody, object>,
  res: Response<AuthResponse>
): Promise<void> => {
  const authResponse = await refreshUserTokensBridge(req.body.refreshToken);

  res.status(StatusCodes.CREATED).json(authResponse);
};

export const logoutUserView = async (
  req: Request<object, object, object, object>,
  res: Response<LogoutUserResponse>
): Promise<void> => {
  const userId = await logoutUserBridge(req.context.customJWTPayload.userId);

  res
    .status(StatusCodes.OK)
    .json({ message: `Refresh Tokens for User: ${userId} Revoked!` });
};
