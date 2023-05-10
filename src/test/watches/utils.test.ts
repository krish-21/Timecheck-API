import type { Watch } from "@prisma/client";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

import { UUID_V4_LENGTH } from "main/utils/constants/uuid";
import {
  NAME_MAXIMUM_LENGTH,
  BRAND_MAXIMUM_LENGTH,
  REFERENCE_MAXIMUM_LENGTH,
} from "main/watches/constants";

import {
  validateGetAllWatchesQueries,
  validateCreateWatchBody,
  validateUpdateWatchBody,
  validateDeleteWatchValues,
  transformWatch,
} from "main/watches/utils";

const validTakeQuery = "10";
const validSkipQuery = "2";
const validOnlyMyWatchesQuery = "true";

const mockUUID = "a".repeat(UUID_V4_LENGTH);

const validName = "margharita";
const validBrand = "marinara";
const validReference = "cipole";

const mockWatch: Watch = {
  id: "123",
  name: "456",
  brand: "789",
  reference: "024",
  userId: "680",
  createdAt: new Date(100),
  updatedAt: new Date(200),
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test validateGetAllWatchesQueries", () => {
  test("validateGetAllWatchesQueries throws error if takeQuery is undefined", () => {
    expect(() => validateGetAllWatchesQueries()).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if takeQuery is not a string", () => {
    expect(() => validateGetAllWatchesQueries({})).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if takeQuery is too long", () => {
    expect(() => validateGetAllWatchesQueries("1234")).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if takeQuery cannot be casted to a number", () => {
    expect(() => validateGetAllWatchesQueries("[]")).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if casted takeQuery is zero", () => {
    expect(() => validateGetAllWatchesQueries("0")).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if casted takeQuery is negative", () => {
    expect(() => validateGetAllWatchesQueries("-2")).toThrow(
      new InvalidDataError("take")
    );
  });

  test("validateGetAllWatchesQueries throws error if skipQuery is undefined", () => {
    expect(() => validateGetAllWatchesQueries(validTakeQuery)).toThrow(
      new InvalidDataError("skip")
    );
  });

  test("validateGetAllWatchesQueries throws error if skipQuery is not a string", () => {
    expect(() => validateGetAllWatchesQueries(validTakeQuery, {})).toThrow(
      new InvalidDataError("skip")
    );
  });

  test("validateGetAllWatchesQueries throws error if skipQuery is too long", () => {
    expect(() => validateGetAllWatchesQueries(validTakeQuery, "1234")).toThrow(
      new InvalidDataError("skip")
    );
  });

  test("validateGetAllWatchesQueries throws error if skipQuery cannot be casted to a number", () => {
    expect(() => validateGetAllWatchesQueries(validTakeQuery, "[]")).toThrow(
      new InvalidDataError("skip")
    );
  });

  test("validateGetAllWatchesQueries throws error if casted skipQuery is negative", () => {
    expect(() => validateGetAllWatchesQueries(validTakeQuery, "-2")).toThrow(
      new InvalidDataError("skip")
    );
  });

  test("validateGetAllWatchesQueries throws error if onlyMyWatchesQuery is undefined", () => {
    expect(() =>
      validateGetAllWatchesQueries(validTakeQuery, validSkipQuery)
    ).toThrow(new InvalidDataError("onlyMyWatches"));
  });

  test("validateGetAllWatchesQueries throws error if onlyMyWatchesQuery is not a string", () => {
    expect(() =>
      validateGetAllWatchesQueries(validTakeQuery, validSkipQuery, 123)
    ).toThrow(new InvalidDataError("onlyMyWatches"));
  });

  test("validateGetAllWatchesQueries throws error if onlyMyWatchesQuery is neither true or false", () => {
    expect(() =>
      validateGetAllWatchesQueries(validTakeQuery, validSkipQuery, "abc")
    ).toThrow(new InvalidDataError("onlyMyWatches"));
  });

  test("validateGetAllWatchesQueries returns validated take under key take", () => {
    const response = validateGetAllWatchesQueries(
      validTakeQuery,
      validSkipQuery,
      validOnlyMyWatchesQuery
    );

    expect(response).toHaveProperty("take", 10);
  });

  test("validateGetAllWatchesQueries returns validated skip under key skip", () => {
    const response = validateGetAllWatchesQueries(
      validTakeQuery,
      validSkipQuery,
      validOnlyMyWatchesQuery
    );

    expect(response).toHaveProperty("skip", 2);
  });

  test("validateGetAllWatchesQueries returns casted onlyUserWatches if true passed under key onlyUserWatches", () => {
    const response = validateGetAllWatchesQueries(
      validTakeQuery,
      validSkipQuery,
      "true"
    );

    expect(response).toHaveProperty("onlyUserWatches", true);
  });

  test("validateGetAllWatchesQueries returns casted onlyUserWatches if false passed under key onlyUserWatches", () => {
    const response = validateGetAllWatchesQueries(
      validTakeQuery,
      validSkipQuery,
      "false"
    );

    expect(response).toHaveProperty("onlyUserWatches", false);
  });
});

describe("Test validateCreateWatchBody", () => {
  test("validateCreateWatchBody throws error if nameValue is undefined", () => {
    expect(() => validateCreateWatchBody()).toThrow(
      new InvalidDataError("name")
    );
  });

  test("validateCreateWatchBody throws error if nameValue is empty", () => {
    expect(() => validateCreateWatchBody("")).toThrow(
      new InvalidDataError("name")
    );
  });

  test("validateCreateWatchBody throws error if brandValue is undefined", () => {
    expect(() => validateCreateWatchBody(validName)).toThrow(
      new InvalidDataError("brand")
    );
  });

  test("validateCreateWatchBody throws error if brandValue is empty", () => {
    expect(() => validateCreateWatchBody(validName, "")).toThrow(
      new InvalidDataError("brand")
    );
  });

  test("validateCreateWatchBody throws error if referenceValue is undefined", () => {
    expect(() => validateCreateWatchBody(validName, validBrand)).toThrow(
      new InvalidDataError("reference")
    );
  });

  test("validateCreateWatchBody throws error if referenceValue is empty", () => {
    expect(() => validateCreateWatchBody(validName, validBrand, "")).toThrow(
      new InvalidDataError("reference")
    );
  });

  test("validateCreateWatchBody returns validated values", () => {
    const response = validateCreateWatchBody(
      validName,
      validBrand,
      validReference
    );

    expect(response).toEqual({
      name: validName,
      brand: validBrand,
      reference: validReference,
    });
  });

  test("validateCreateWatchBody returns validated values (name substring)", () => {
    const response = validateCreateWatchBody(
      "a".repeat(NAME_MAXIMUM_LENGTH + 10),
      validBrand,
      validReference
    );

    expect(response).toEqual({
      name: "a".repeat(NAME_MAXIMUM_LENGTH),
      brand: validBrand,
      reference: validReference,
    });
  });

  test("validateCreateWatchBody returns validated values (name trimmed)", () => {
    const response = validateCreateWatchBody(
      " abc ",
      validBrand,
      validReference
    );

    expect(response).toEqual({
      name: "abc",
      brand: validBrand,
      reference: validReference,
    });
  });

  test("validateCreateWatchBody returns validated values (brand substring)", () => {
    const response = validateCreateWatchBody(
      validName,
      "a".repeat(BRAND_MAXIMUM_LENGTH + 10),
      validReference
    );

    expect(response).toEqual({
      name: validName,
      brand: "a".repeat(BRAND_MAXIMUM_LENGTH),
      reference: validReference,
    });
  });

  test("validateCreateWatchBody returns validated values (brand trimmed)", () => {
    const response = validateCreateWatchBody(
      validName,
      " def ",
      validReference
    );

    expect(response).toEqual({
      name: validName,
      brand: "def",
      reference: validReference,
    });
  });

  test("validateCreateWatchBody returns validated values (reference substring)", () => {
    const response = validateCreateWatchBody(
      validName,
      validBrand,
      "a".repeat(REFERENCE_MAXIMUM_LENGTH + 10)
    );

    expect(response).toEqual({
      name: validName,
      brand: validBrand,
      reference: "a".repeat(REFERENCE_MAXIMUM_LENGTH),
    });
  });

  test("validateCreateWatchBody returns validated values (brand trimmed)", () => {
    const response = validateCreateWatchBody(validName, validBrand, " ghi ");

    expect(response).toEqual({
      name: validName,
      brand: validBrand,
      reference: "ghi",
    });
  });
});

describe("Test validateUpdateWatchBody", () => {
  test("validateUpdateWatchBody throws error if watchIdValue is not 36 characters long", () => {
    expect(() => validateUpdateWatchBody("")).toThrow(
      new InvalidDataError("watchId")
    );
  });

  test("validateUpdateWatchBody throws error if no data is passed", () => {
    expect(() => validateUpdateWatchBody(mockUUID)).toThrow(
      new InvalidDataError("data")
    );
  });

  test("validateUpdateWatchBody throws error if nameValue exists and is not a string", () => {
    expect(() => validateUpdateWatchBody(mockUUID, [""])).toThrow(
      new InvalidDataError("name")
    );
  });

  test("validateUpdateWatchBody throws error if nameValue exists and is empty", () => {
    expect(() => validateUpdateWatchBody(mockUUID, "")).toThrow(
      new InvalidDataError("name")
    );
  });

  test("validateUpdateWatchBody throws error if brandValue exists and is not a string", () => {
    expect(() => validateUpdateWatchBody(mockUUID, undefined, {})).toThrow(
      new InvalidDataError("brand")
    );
  });

  test("validateUpdateWatchBody throws error if brandValue exists and is empty", () => {
    expect(() => validateUpdateWatchBody(mockUUID, undefined, "")).toThrow(
      new InvalidDataError("brand")
    );
  });

  test("validateUpdateWatchBody throws error if referenceValue exists and is not a string", () => {
    expect(() =>
      validateUpdateWatchBody(mockUUID, undefined, undefined, [])
    ).toThrow(new InvalidDataError("reference"));
  });

  test("validateUpdateWatchBody throws error if referenceValue exists and is empty", () => {
    expect(() =>
      validateUpdateWatchBody(mockUUID, undefined, undefined, "")
    ).toThrow(new InvalidDataError("reference"));
  });

  test("validateUpdateWatchBody returns validated values", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      validName,
      validName,
      validReference
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: validName,
      brand: validName,
      reference: validReference,
    });
  });

  test("validateUpdateWatchBody returns validated values (name substring)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      "a".repeat(NAME_MAXIMUM_LENGTH + 10),
      validBrand,
      validReference
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: "a".repeat(NAME_MAXIMUM_LENGTH),
      brand: validBrand,
      reference: validReference,
    });
  });

  test("validateUpdateWatchBody returns validated values (name trimmed)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      " abc ",
      validBrand,
      validReference
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: "abc",
      brand: validBrand,
      reference: validReference,
    });
  });

  test("validateUpdateWatchBody returns validated values (brand substring)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      validName,
      "a".repeat(BRAND_MAXIMUM_LENGTH + 10),
      validReference
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: validName,
      brand: "a".repeat(BRAND_MAXIMUM_LENGTH),
      reference: validReference,
    });
  });

  test("validateUpdateWatchBody returns validated values (brand trimmed)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      validName,
      " abc ",
      validReference
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: validName,
      brand: "abc",
      reference: validReference,
    });
  });

  test("validateUpdateWatchBody returns validated values (reference substring)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      validName,
      validBrand,
      "a".repeat(REFERENCE_MAXIMUM_LENGTH + 10)
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: validName,
      brand: validBrand,
      reference: "a".repeat(REFERENCE_MAXIMUM_LENGTH),
    });
  });

  test("validateUpdateWatchBody returns validated values (brand trimmed)", () => {
    const response = validateUpdateWatchBody(
      mockUUID,
      validName,
      validBrand,
      " abc "
    );

    expect(response).toEqual({
      watchId: mockUUID,
      name: validName,
      brand: validBrand,
      reference: "abc",
    });
  });
});

describe("Test validateDeleteWatchValues", () => {
  test("validateDeleteWatchValues throws error if watchIdValue not 36 characters long", () => {
    expect(() => validateDeleteWatchValues("abcd")).toThrow(
      new InvalidDataError("watchId")
    );
  });

  test("validateDeleteWatchValues returns validated values", () => {
    const response = validateDeleteWatchValues(mockUUID);

    expect(response).toEqual({
      watchId: mockUUID,
    });
  });
});

describe("Test transformWatch", () => {
  test("transformWatch returns passed id under key id", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("id", "123");
  });

  test("transformWatch returns passed name under key name", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("name", "456");
  });

  test("transformWatch returns passed brand under key brand", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("brand", "789");
  });

  test("transformWatch returns passed reference under key reference", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("reference", "024");
  });

  test("transformWatch returns passed userId under key userId", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("userId", "680");
  });

  test("transformWatch returns unix time of passed createdAt under key createdAt", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("createdAt", 100);
  });

  test("transformWatch returns unix time of passed updatedAt under key updatedAt", () => {
    const response = transformWatch(mockWatch);

    expect(response).toHaveProperty("updatedAt", 200);
  });
});
