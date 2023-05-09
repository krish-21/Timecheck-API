import type { RefreshToken } from "@prisma/client";

import { prismaClient } from "main/utils/db/prismaClient";

export const createRefreshToken = async (
  tokenUUID: string,
  hashedRefreshToken: string,
  userId: string
): Promise<RefreshToken> => {
  return prismaClient.refreshToken.create({
    data: {
      id: tokenUUID,
      hashedToken: hashedRefreshToken,
      userId,
    },
  });
};

export const deleteRefreshTokensByUserId = async (
  userId: string
): Promise<{ count: number }> => {
  return prismaClient.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};

export const findRefreshTokenById = async (
  id: string
): Promise<RefreshToken | null> => {
  return prismaClient.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

export const deleteRefreshTokenById = async (
  id: string
): Promise<RefreshToken | null> => {
  return prismaClient.refreshToken.delete({
    where: {
      id,
    },
  });
};
