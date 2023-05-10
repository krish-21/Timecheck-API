import type { AuthResponse } from "main/auth/interfaces";

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
): Promise<AuthResponse> => {
  const { username, password } = validateAuthBody(usernameValue, passwordValue);

  const { id: registeredUserId } = await registerUserService(
    username,
    password
  );

  const tokens = await generateAndSaveTokensService(registeredUserId);

  return { userId: registeredUserId, tokens };
};

export const loginUserBridge = async (
  usernameValue?: unknown,
  passwordValue?: unknown
): Promise<AuthResponse> => {
  const { username, password } = validateAuthBody(usernameValue, passwordValue);

  const { id: foundUserId } = await loginUserService(username, password);

  const tokens = await generateAndSaveTokensService(foundUserId);

  return { userId: foundUserId, tokens };
};

export const refreshUserTokensBridge = async (
  refreshTokenValue?: unknown
): Promise<AuthResponse> => {
  const refreshToken = validateRefreshTokenValue(refreshTokenValue);

  const { id: decodedUserId } = await refreshUserTokensService(refreshToken);

  const tokens = await generateAndSaveTokensService(decodedUserId);

  return { userId: decodedUserId, tokens };
};

export const logoutUserBridge = async (userId: string): Promise<string> => {
  return logoutUserService(userId);
};
