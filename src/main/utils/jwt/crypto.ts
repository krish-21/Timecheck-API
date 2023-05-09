import { genSalt, hash, compare } from "bcrypt";

import {
  PASSWORD_SALT_ROUNDS,
  REFRSH_TOKEN_SALT_ROUNDS,
} from "main/utils/constants/jwt";

export const hashPassword = async (
  plainTextPassword: string
): Promise<string> => {
  const salt = await genSalt(PASSWORD_SALT_ROUNDS);
  return hash(plainTextPassword, salt);
};

export const hashToken = async (token: string): Promise<string> => {
  const salt = await genSalt(REFRSH_TOKEN_SALT_ROUNDS);
  return hash(token, salt);
};

export const comparePasswords = async (
  plainTextPassword: string,
  storedHash: string
): Promise<boolean> => {
  return compare(plainTextPassword, storedHash);
};

export const compareRefreshTokens = async (
  plainTextRefreshTokens: string,
  storedHash: string
): Promise<boolean> => {
  return compare(plainTextRefreshTokens, storedHash);
};
