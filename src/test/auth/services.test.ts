import { v4 as uuidV4 } from "uuid";

import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findUserByUsername,
  createUserByUsernameAndPassword,
} from "main/users/dbServices";
import { createRefreshToken } from "main/auth/dbServices";

import { generateTokens } from "main/utils/jwt/tokens";
import { hashPassword, hashToken } from "main/utils/jwt/crypto";

import {
  registerUserService,
  generateAndSaveTokensService,
} from "main/auth/services";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("main/users/dbServices", () => ({
  findUserByUsername: jest.fn(() => null),
  createUserByUsernameAndPassword: jest.fn(() => ({ id: "" })),
}));

jest.mock("main/utils/jwt/crypto", () => ({
  hashPassword: jest.fn(),
  hashToken: jest.fn(),
}));

jest.mock("main/utils/jwt/tokens", () => ({
  generateTokens: jest.fn(() => ({})),
}));

jest.mock("main/auth/dbServices", () => ({
  createRefreshToken: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test registerUserService", () => {
  test("registerUserService delegates username to findUserByUsername", async () => {
    await registerUserService("potato", "");

    expect(findUserByUsername).toHaveBeenCalledWith("potato");
  });

  test("registerUserService throws error if username exists", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({}));

    await expect(registerUserService("", "")).rejects.toThrow(
      new AlreadyExistsError("Username")
    );
  });

  test("registerUserService delegates password to hashPassword", async () => {
    await registerUserService("", "tomato");

    expect(hashPassword).toHaveBeenCalledWith("tomato");
  });

  test("registerUserService delegates username to createUserByUsernameAndPassword", async () => {
    await registerUserService("potato", "");

    expect(createUserByUsernameAndPassword).toHaveBeenCalledWith(
      "potato",
      undefined
    );
  });

  test("registerUserService delegates hashedPassword to createUserByUsernameAndPassword", async () => {
    (hashPassword as jest.Mock).mockImplementationOnce(() => "I am a Hash!");

    await registerUserService("", "");

    expect(createUserByUsernameAndPassword).toHaveBeenCalledWith(
      "",
      "I am a Hash!"
    );
  });

  test("registerUserService returns createUserByUsernameAndPassword response", async () => {
    (createUserByUsernameAndPassword as jest.Mock).mockImplementationOnce(
      () => ({ id: "potato", username: "tomato" })
    );

    const response = await registerUserService("", "");

    expect(response).toEqual({ id: "potato", username: "tomato" });
  });
});

describe("Test generateAndSaveTokensService", () => {
  test("generateAndSaveTokensService delegates userId to generateTokens", async () => {
    await generateAndSaveTokensService("potato");

    expect(generateTokens).toHaveBeenCalledWith("potato", undefined);
  });

  test("generateAndSaveTokensService delegates generated uuid to generateTokens", async () => {
    (uuidV4 as jest.Mock).mockImplementationOnce(() => "I am a UUID!");

    await generateAndSaveTokensService("");

    expect(generateTokens).toHaveBeenCalledWith("", "I am a UUID!");
  });

  test("generateAndSaveTokensService delegates generated refreshToken to hashToken", async () => {
    (generateTokens as jest.Mock).mockImplementationOnce(() => ({
      refreshToken: "I am a Refresh Token!",
    }));

    await generateAndSaveTokensService("");

    expect(hashToken).toHaveBeenCalledWith("I am a Refresh Token!");
  });

  test("generateAndSaveTokensService delegates generated uuid to createRefreshToken", async () => {
    (uuidV4 as jest.Mock).mockImplementationOnce(() => "I am a UUID!");

    await generateAndSaveTokensService("");

    expect(createRefreshToken).toHaveBeenCalledWith(
      "I am a UUID!",
      undefined,
      ""
    );
  });

  test("generateAndSaveTokensService delegates hashedRefreshToken to createRefreshToken", async () => {
    (hashToken as jest.Mock).mockImplementationOnce(
      () => "I am a hashed Token!"
    );

    await generateAndSaveTokensService("");

    expect(createRefreshToken).toHaveBeenCalledWith(
      undefined,
      "I am a hashed Token!",
      ""
    );
  });

  test("generateAndSaveTokensService delegates userId to createRefreshToken", async () => {
    await generateAndSaveTokensService("potato");

    expect(createRefreshToken).toHaveBeenCalledWith(
      undefined,
      undefined,
      "potato"
    );
  });

  test("generateAndSaveTokensService returns generated tokens", async () => {
    const mockTokenResonse = {
      accessToken: "potato",
      refreshToken: "tomato",
    };
    (generateTokens as jest.Mock).mockImplementationOnce(
      () => mockTokenResonse
    );

    const response = await generateAndSaveTokensService("potato");

    expect(response).toEqual(mockTokenResonse);
  });
});
