import type {
  GetAllWatchesResponse,
  WatchResponse,
} from "main/watches/interfaces";

import {
  validateGetAllWatchesQueries,
  validateCreateWatchBody,
  validateUpdateWatchBody,
  validateDeleteWatchValues,
  transformWatch,
  transformWatches,
} from "main/watches/utils";

import {
  getAllWatchesService,
  createWatchService,
  updateWatchService,
  deleteWatchService,
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

export const updateWatchBridge = async (
  userId: string,
  watchIdValue: string,
  nameValue?: unknown,
  brandValue?: unknown,
  referenceValue?: unknown
): Promise<WatchResponse> => {
  const { watchId, name, brand, reference } = validateUpdateWatchBody(
    watchIdValue,
    nameValue,
    brandValue,
    referenceValue
  );

  const updatedSource = await updateWatchService(
    userId,
    watchId,
    name,
    brand,
    reference
  );

  return transformWatch(updatedSource);
};

export const deleteWatchBridge = async (
  userId: string,
  watchIdValue: string
): Promise<WatchResponse> => {
  const { watchId } = validateDeleteWatchValues(watchIdValue);

  const deletedWatch = await deleteWatchService(userId, watchId);

  return transformWatch(deletedWatch);
};
