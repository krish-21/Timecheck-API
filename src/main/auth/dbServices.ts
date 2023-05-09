import { RefreshToken } from "@prisma/client";

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
