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
