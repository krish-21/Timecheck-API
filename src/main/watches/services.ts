import type { Watch } from "@prisma/client";

import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchByReference,
  findAllWatches,
  countAllWatches,
  createWatchForUser,
} from "main/watches/dbServices";

export const getAllWatchesService = async (
  userId: string,
  take: number,
  skip: number,
  onlyUserWatches: boolean
): Promise<{ watches: Watch[]; count: number }> => {
  const passedUserId = onlyUserWatches ? userId : undefined;

  const watches = await findAllWatches(take, skip, passedUserId);

  const count = await countAllWatches(passedUserId);

  return {
    watches,
    count,
  };
};

export const createWatchService = async (
  userId: string,
  name: string,
  brand: string,
  reference: string
): Promise<Watch> => {
  const existingWatch = await findWatchByReference(reference);

  if (existingWatch !== null) {
    throw new AlreadyExistsError("Watch");
  }

  return createWatchForUser(userId, name, brand, reference);
};
