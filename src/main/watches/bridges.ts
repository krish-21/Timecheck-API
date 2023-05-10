import type { WatchResponse } from "main/watches/interfaces";

import { validateCreateWatchBody, transformWatch } from "main/watches/utils";

import { createWatchService } from "main/watches/services";

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
