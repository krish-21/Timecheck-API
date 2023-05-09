import { genSalt, hash } from "bcrypt";

import { hashPassword, hashToken } from "main/utils/jwt/crypto";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test hashPassword", () => {
  test("hashPassword delegates PASSWORD_SALT_ROUNDS to genSalt", async () => {
    await hashPassword("");

    expect(genSalt).toHaveBeenCalledWith(10);
  });

  test("hashPassword delegates plainTextPassword to hash", async () => {
    await hashPassword("potato");

    expect(hash).toHaveBeenCalledWith("potato", undefined);
  });

  test("hashPassword delegates response from genSalt to hash", async () => {
    (genSalt as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    await hashPassword("");

    expect(hash).toHaveBeenCalledWith("", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("hashPassword returns response from hash", async () => {
    (hash as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await hashPassword("");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test hashToken", () => {
  test("hashToken delegates PASSWORD_SALT_ROUNDS to genSalt", async () => {
    await hashToken("");

    expect(genSalt).toHaveBeenCalledWith(10);
  });

  test("hashToken delegates plainTextToken to hash", async () => {
    await hashToken("potato");

    expect(hash).toHaveBeenCalledWith("potato", undefined);
  });

  test("hashToken delegates response from genSalt to hash", async () => {
    (genSalt as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    await hashToken("");

    expect(hash).toHaveBeenCalledWith("", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("hashToken returns response from hash", async () => {
    (hash as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await hashToken("");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});
