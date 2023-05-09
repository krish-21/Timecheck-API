import { v4 as uuidV4 } from "uuid";

import type { User } from "@prisma/client";
import type { GeneratedTokens } from "main/utils/jwt/interfaces";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import { generateTokens } from "main/utils/jwt/tokens";
import {
  createRefreshToken,
  deleteRefreshTokensByUserId,
} from "main/auth/dbServices";
import {
  comparePasswords,
  hashPassword,
  hashToken,
} from "main/utils/jwt/crypto";
import {
  findUserByUsername,
  createUserByUsernameAndPassword,
} from "main/users/dbServices";

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

export const loginUserService = async (
  username: string,
  password: string
): Promise<User> => {
  const foundUser = await findUserByUsername(username);

  if (foundUser === null) {
    throw new InvalidDataError("Credentials");
  }

  const isPasswordMatching = await comparePasswords(
    password,
    foundUser.password
  );

  if (!isPasswordMatching) {
    throw new InvalidDataError("Credentials");
  }

  await deleteRefreshTokensByUserId(foundUser.id);

  return foundUser;
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
