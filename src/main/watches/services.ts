import type { Watch } from "@prisma/client";

import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchByReference,
  createWatchForUser,
} from "main/watches/dbServices";

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
