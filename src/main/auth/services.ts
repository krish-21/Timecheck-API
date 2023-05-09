import { v4 as uuidV4 } from "uuid";

import { User } from "@prisma/client";

import { GeneratedTokens } from "main/utils/jwt/interfaces";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import { generateTokens } from "main/utils/jwt/tokens";
import {
  findUserByUsername,
  createUserByUsernameAndPassword,
} from "main/users/dbServices";
import { createRefreshToken } from "main/auth/dbServices";
import { hashPassword, hashToken } from "main/utils/jwt/crypto";

export const registerUserService = async (
  username: string,
  password: string
): Promise<User> => {
  const existingUserByUsername = await findUserByUsername(username);

  if (existingUserByUsername !== null) {
    throw new AlreadyExistsError("Username");
  }

  const hashedPassword = await hashPassword(password);

  const registeredUser = await createUserByUsernameAndPassword(
    username,
    hashedPassword
  );

  return registeredUser;
};

export const generateAndSaveTokensService = async (
  userId: string
): Promise<GeneratedTokens> => {
  const tokenUUID = uuidV4();

  const { accessToken, refreshToken } = generateTokens(userId, tokenUUID);

  const hashedRefreshToken = await hashToken(refreshToken);

  await createRefreshToken(tokenUUID, hashedRefreshToken, userId);

  return {
    accessToken,
    refreshToken,
  };
};
