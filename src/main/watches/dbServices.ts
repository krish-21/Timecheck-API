import type { Prisma, Watch } from "@prisma/client";

import { prismaClient } from "main/utils/db/prismaClient";

export const findWatchById = async (id: string): Promise<Watch | null> => {
  return prismaClient.watch.findUnique({
    where: {
      id,
    },
  });
};

export const findWatchByReference = async (
  reference: string
): Promise<Watch | null> => {
  return prismaClient.watch.findUnique({
    where: {
      reference,
    },
  });
};

export const findAllWatches = async (
  take: number,
  skip: number,
  userId?: string
): Promise<Watch[]> => {
  const whereFilter: Prisma.WatchWhereInput = {
    ...(userId === undefined ? {} : { userId }),
  };

  return prismaClient.watch.findMany({
    take,
    skip,
    where: whereFilter,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const countAllWatches = async (userId?: string): Promise<number> => {
  const whereFilter: Prisma.WatchWhereInput = {
    ...(userId === undefined ? {} : { userId }),
  };

  return prismaClient.watch.count({
    where: whereFilter,
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

export const updateWatchById = async (
  id: string,
  name?: string,
  brand?: string,
  reference?: string
): Promise<Watch> => {
  return prismaClient.watch.update({
    where: {
      id,
    },
    data: {
      ...(name === undefined ? {} : { name }),
      ...(brand === undefined ? {} : { brand }),
      ...(reference === undefined ? {} : { reference }),
    },
  });
};

export const deleteWatchById = async (id: string): Promise<Watch> => {
  return prismaClient.watch.delete({
    where: {
      id,
    },
  });
};
