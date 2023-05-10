import type { Watch } from "@prisma/client";

import { prismaClient } from "main/utils/db/prismaClient";

export const findWatchByReference = async (
  reference: string
): Promise<Watch | null> => {
  return prismaClient.watch.findUnique({
    where: {
      reference,
    },
  });
};

export const createWatchForUser = async (
  userId: string,
  name: string,
  brand: string,
  reference: string
): Promise<Watch> => {
  return prismaClient.watch.create({
    data: {
      name,
      brand,
      reference,
      userId,
    },
  });
};
