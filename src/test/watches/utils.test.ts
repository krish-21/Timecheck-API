import type { Watch } from "@prisma/client";
import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

import {
  NAME_MAXIMUM_LENGTH,
  BRAND_MAXIMUM_LENGTH,
  REFERENCE_MAXIMUM_LENGTH,
} from "main/watches/constants";

import { validateCreateWatchBody, transformWatch } from "main/watches/utils";

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
