import type { GeneratedTokens } from "main/utils/jwt/interfaces";

import { validateAuthBody, validateRefreshTokenValue } from "main/auth/utils";

import {
  registerUserService,
  generateAndSaveTokensService,
  loginUserService,
  refreshUserTokensService,
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
