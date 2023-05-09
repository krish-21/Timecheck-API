import { GeneratedTokens } from "main/utils/jwt/interfaces";

import { validateAuthBody } from "main/auth/utils";

import {
  registerUserService,
  generateAndSaveTokensService,
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
