import type {
  GetAllWatchesResponse,
  WatchResponse,
} from "main/watches/interfaces";

import {
  validateGetAllWatchesQueries,
  validateCreateWatchBody,
  transformWatch,
  transformWatches,
} from "main/watches/utils";

import {
  getAllWatchesService,
  createWatchService,
} from "main/watches/services";

export const getAllWatchesBridge = async (
  userId: string,
  takeQuery?: unknown,
  skipQuery?: unknown,
  onlyMyWatchesQuery?: unknown
): Promise<GetAllWatchesResponse> => {
  const { take, skip, onlyUserWatches } = validateGetAllWatchesQueries(
    takeQuery,
    skipQuery,
    onlyMyWatchesQuery
  );

  const { watches, count } = await getAllWatchesService(
    userId,
    take,
    skip,
    onlyUserWatches
  );

  return {
    items: transformWatches(watches),
    totalItems: count,
    take,
    skip,
  };
};

export const createWatchBridge = async (
  userId: string,
  nameValue?: unknown,
  brandValue?: unknown,
  referenceValue?: unknown
): Promise<WatchResponse> => {
  const { name, brand, reference } = validateCreateWatchBody(
    nameValue,
    brandValue,
    referenceValue
  );

  const createdSource = await createWatchService(
    userId,
    name,
    brand,
    reference
  );

  return transformWatch(createdSource);
};
