import { sign, verify } from "jsonwebtoken";

import { appConfig } from "main/utils/environment/AppConfig";
import { GeneratedTokens, CustomJWTPayload } from "main/utils/jwt/interfaces";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "main/utils/constants/jwt";

export const generateAccessToken = (userId: string): string => {
  return sign({ userId }, appConfig.jwtAccessSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

export const generateRefreshToken = (
  userId: string,
  tokenUUID: string
): string => {
  return sign({ userId, tokenUUID }, appConfig.jwtRefreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

export const generateTokens = (
  userId: string,
  tokenUUID: string
): GeneratedTokens => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId, tokenUUID),
  };
};

export const verifyRefreshToken = (
  receivedJWT: string
): CustomJWTPayload | null => {
  try {
    return verify(receivedJWT, appConfig.jwtRefreshSecret) as CustomJWTPayload;
  } catch (err) {
    return null;
  }
};
