import type { Watch } from "@prisma/client";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchById,
  findWatchByReference,
  findAllWatches,
  countAllWatches,
  createWatchForUser,
  updateWatchById,
  deleteWatchById,
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

export const updateWatchService = async (
  userId: string,
  watchId: string,
  name?: string,
  brand?: string,
  reference?: string
): Promise<Watch> => {
  const retrievedWatchById = await findWatchById(watchId);

  if (retrievedWatchById === null || retrievedWatchById.userId !== userId) {
    throw new InvalidDataError("watchId");
  }

  if (reference !== undefined) {
    const retrievedWatchByReference = await findWatchByReference(reference);

    if (
      retrievedWatchByReference !== null &&
      retrievedWatchByReference.id !== watchId
    ) {
      throw new AlreadyExistsError("reference");
    }
  }

  if (
    name === retrievedWatchById.name &&
    brand === retrievedWatchById.brand &&
    reference === retrievedWatchById.reference
  ) {
    return retrievedWatchById;
  }

  return updateWatchById(watchId, name, brand, reference);
};

export const deleteWatchService = async (
  userId: string,
  watchId: string
): Promise<Watch> => {
  const retrievedWatch = await findWatchById(watchId);

  if (retrievedWatch === null || retrievedWatch.userId !== userId) {
    throw new InvalidDataError("watchId");
  }

  return deleteWatchById(watchId);
};
