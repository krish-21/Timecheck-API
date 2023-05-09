import { v4 as uuidV4 } from "uuid";

import type { User } from "@prisma/client";
import type { GeneratedTokens } from "main/utils/jwt/interfaces";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";
import { UnauthorizedError } from "main/utils/errors/UnauthorizedError/UnauthorizedError";

import { generateTokens, verifyRefreshToken } from "main/utils/jwt/tokens";
import {
  createRefreshToken,
  findRefreshTokenById,
  deleteRefreshTokensByUserId,
  deleteRefreshTokenById,
} from "main/auth/dbServices";
import {
  comparePasswords,
  compareRefreshTokens,
  hashPassword,
  hashToken,
} from "main/utils/jwt/crypto";
import {
  findUserByUsername,
  createUserByUsernameAndPassword,
  findUserById,
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

export const refreshUserTokensService = async (
  receivedRefreshToken: string
): Promise<User> => {
  const decodedPayload = verifyRefreshToken(receivedRefreshToken);

  if (decodedPayload === null) {
    throw new UnauthorizedError();
  }

  const savedRefreshToken = await findRefreshTokenById(
    decodedPayload.tokenUUID
  );

  if (savedRefreshToken === null) {
    throw new UnauthorizedError("Null Token");
  }

  if (savedRefreshToken.isRevoked) {
    throw new UnauthorizedError("Revoked Token");
  }

  const isRefreshTokenMatching = await compareRefreshTokens(
    receivedRefreshToken,
    savedRefreshToken.hashedToken
  );

  if (!isRefreshTokenMatching) {
    throw new UnauthorizedError("Invalid Token");
  }

  const decodedUser = await findUserById(decodedPayload.userId);

  if (decodedUser === null) {
    throw new UnauthorizedError("Invalid Payload");
  }

  await deleteRefreshTokenById(savedRefreshToken.id);

  return decodedUser;
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

export const logoutUserService = async (userId: string): Promise<string> => {
  const { count: numberOfTOkensRevoked } = await deleteRefreshTokensByUserId(
    userId
  );

  if (numberOfTOkensRevoked === 0) {
    throw new UnauthorizedError("No Tokens");
  }

  return userId;
};
