import type { Watch } from "@prisma/client";
import type { WatchResponse } from "main/watches/interfaces";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

import {
  NAME_MAXIMUM_LENGTH,
  BRAND_MAXIMUM_LENGTH,
  REFERENCE_MAXIMUM_LENGTH,
} from "main/watches/constants";

export const validateCreateWatchBody = (
  nameValue?: unknown,
  brandValue?: unknown,
  referenceValue?: unknown
): {
  name: string;
  brand: string;
  reference: string;
} => {
  let name: string;

  if (typeof nameValue !== "string" || nameValue.length === 0) {
    throw new InvalidDataError("name");
  } else if (nameValue.length > NAME_MAXIMUM_LENGTH) {
    name = nameValue.substring(0, NAME_MAXIMUM_LENGTH);
  } else {
    name = nameValue.trim();
  }

  let brand: string;

  if (typeof brandValue !== "string" || brandValue.length === 0) {
    throw new InvalidDataError("brand");
  } else if (brandValue.length > BRAND_MAXIMUM_LENGTH) {
    brand = brandValue.substring(0, BRAND_MAXIMUM_LENGTH);
  } else {
    brand = brandValue.trim();
  }

  let reference: string;

  if (typeof referenceValue !== "string" || referenceValue.length === 0) {
    throw new InvalidDataError("reference");
  } else if (referenceValue.length > REFERENCE_MAXIMUM_LENGTH) {
    reference = referenceValue.substring(0, REFERENCE_MAXIMUM_LENGTH);
  } else {
    reference = referenceValue.trim();
  }

  return {
    name,
    brand,
    reference,
  };
};

export const transformWatch = (watch: Watch): WatchResponse => {
  return {
    id: watch.id,
    name: watch.name,
    brand: watch.brand,
    reference: watch.reference,
    userId: watch.userId,
    createdAt: watch.createdAt.getTime(),
    updatedAt: watch.updatedAt.getTime(),
  };
};
