import type { GeneratedTokens } from "main/utils/jwt/interfaces";

import { validateAuthBody, validateRefreshTokenValue } from "main/auth/utils";

import {
  registerUserService,
  loginUserService,
  refreshUserTokensService,
  generateAndSaveTokensService,
  logoutUserService,
} from "main/auth/services";

export const registerUserBridge = async (
  usernameValue?: unknown,
  passwordValue?: unknown
): Promise<GeneratedTokens> => {
  const { username, password } = validateAuthBody(usernameValue, passwordValue);

  const { id: registeredUserId } = await registerUserService(
    username,
    password
  );

  return generateAndSaveTokensService(registeredUserId);
};

export const loginUserBridge = async (
  usernameValue?: unknown,
  passwordValue?: unknown
): Promise<GeneratedTokens> => {
  const { username, password } = validateAuthBody(usernameValue, passwordValue);

  const { id: foundUserId } = await loginUserService(username, password);

  return generateAndSaveTokensService(foundUserId);
};

export const refreshUserTokensBridge = async (
  refreshTokenValue?: unknown
): Promise<GeneratedTokens> => {
  const refreshToken = validateRefreshTokenValue(refreshTokenValue);

  const { id: decodedUserId } = await refreshUserTokensService(refreshToken);

  return generateAndSaveTokensService(decodedUserId);
};

export const logoutUserBridge = async (userId: string): Promise<string> => {
  return logoutUserService(userId);
};
