import { v4 as uuidV4 } from "uuid";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  createRefreshToken,
  deleteRefreshTokenById,
  deleteRefreshTokensByUserId,
  findRefreshTokenById,
} from "main/auth/dbServices";
import {
  findUserByUsername,
  createUserByUsernameAndPassword,
  findUserById,
} from "main/users/dbServices";

import { generateTokens, verifyRefreshToken } from "main/utils/jwt/tokens";
import {
  comparePasswords,
  compareRefreshTokens,
  hashPassword,
  hashToken,
} from "main/utils/jwt/crypto";

import {
  registerUserService,
  loginUserService,
  generateAndSaveTokensService,
  refreshUserTokensService,
} from "main/auth/services";
import { UnauthorizedError } from "main/utils/errors/UnauthorizedError/UnauthorizedError";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("main/users/dbServices", () => ({
  findUserByUsername: jest.fn(() => null),
  createUserByUsernameAndPassword: jest.fn(() => ({ id: "" })),
  findUserById: jest.fn(),
}));

jest.mock("main/utils/jwt/crypto", () => ({
  hashPassword: jest.fn(),
  hashToken: jest.fn(),
  comparePasswords: jest.fn(() => true),
  compareRefreshTokens: jest.fn(() => true),
}));

jest.mock("main/utils/jwt/tokens", () => ({
  generateTokens: jest.fn(() => ({})),
  verifyRefreshToken: jest.fn(() => ({})),
}));

jest.mock("main/auth/dbServices", () => ({
  createRefreshToken: jest.fn(),
  deleteRefreshTokensByUserId: jest.fn(() => ({})),
  findRefreshTokenById: jest.fn(() => ({})),
  deleteRefreshTokenById: jest.fn(),
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

describe("Test loginUserService", () => {
  test("loginUserService delegates username to findUserByUsername", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({}));

    await loginUserService("potato", "");

    expect(findUserByUsername).toHaveBeenCalledWith("potato");
  });

  test("loginUserService throws error if user does not exists", async () => {
    await expect(loginUserService("", "")).rejects.toThrow(
      new InvalidDataError("Credentials")
    );
  });

  test("loginUserService delegates password to comparePassword", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({}));

    await loginUserService("", "tomato");

    expect(comparePasswords).toHaveBeenCalledWith("tomato", undefined);
  });

  test("loginUserService delegates foundUser's hashPassword to comparePassword", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({
      password: "tomato",
    }));

    await loginUserService("", "");

    expect(comparePasswords).toHaveBeenCalledWith("", "tomato");
  });

  test("loginUserService throws Error if password hashes don't match", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({}));
    (comparePasswords as jest.Mock).mockImplementationOnce(() => false);

    await expect(loginUserService("", "")).rejects.toThrow(
      new InvalidDataError("Credentials")
    );
  });

  test("loginUserService delegates foundUser's id to deleteRefreshTokensByUserId", async () => {
    (findUserByUsername as jest.Mock).mockImplementationOnce(() => ({
      id: "tomato",
    }));

    await loginUserService("", "");

    expect(deleteRefreshTokensByUserId).toHaveBeenCalledWith("tomato");
  });

  test("loginUserService returns findUserByUsername response", async () => {
    const mockUserResonse = {
      id: "potato",
      username: "tomato",
    };
    (findUserByUsername as jest.Mock).mockImplementationOnce(
      () => mockUserResonse
    );

    const response = await loginUserService("", "");

    expect(response).toEqual(mockUserResonse);
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

describe("Test refreshUserTokensService", () => {
  test("refreshUserTokensService delegates receivedRefreshToken to verifyRefreshToken", async () => {
    await refreshUserTokensService("potato");

    expect(verifyRefreshToken).toHaveBeenCalledWith("potato");
  });

  test("refreshUserTokensService throws error if decoded payload is null", async () => {
    (verifyRefreshToken as jest.Mock).mockImplementationOnce(() => null);

    await expect(refreshUserTokensService("")).rejects.toThrow(
      new UnauthorizedError()
    );
  });

  test("refreshUserTokensService delegates decodedPayload.tokenUUID to findRefreshTokenById", async () => {
    (verifyRefreshToken as jest.Mock).mockImplementationOnce(() => ({
      tokenUUID: "tomato",
    }));

    await refreshUserTokensService("");

    expect(findRefreshTokenById).toHaveBeenCalledWith("tomato");
  });

  test("refreshUserTokensService throws error if savedRefreshToken is null", async () => {
    (findRefreshTokenById as jest.Mock).mockImplementationOnce(() => null);

    await expect(refreshUserTokensService("")).rejects.toThrow(
      new UnauthorizedError("Null Token")
    );
  });

  test("refreshUserTokensService throws error if savedRefreshToken is revoked", async () => {
    (findRefreshTokenById as jest.Mock).mockImplementationOnce(() => ({
      isRevoked: true,
    }));

    await expect(refreshUserTokensService("")).rejects.toThrow(
      new UnauthorizedError("Revoked Token")
    );
  });

  test("refreshUserTokensService delegates receivedRefreshToken to compareRefreshTokens", async () => {
    await refreshUserTokensService("potato");

    expect(compareRefreshTokens).toHaveBeenCalledWith("potato", undefined);
  });

  test("refreshUserTokensService delegates savedHashToken to compareRefreshTokens", async () => {
    (findRefreshTokenById as jest.Mock).mockImplementationOnce(() => ({
      hashedToken: "tomato",
    }));

    await refreshUserTokensService("");

    expect(compareRefreshTokens).toHaveBeenCalledWith("", "tomato");
  });

  test("refreshUserTokensService throws error if refreshToken hashes are not matching", async () => {
    (compareRefreshTokens as jest.Mock).mockImplementationOnce(() => false);

    await expect(refreshUserTokensService("")).rejects.toThrow(
      new UnauthorizedError("Invalid Token")
    );
  });

  test("refreshUserTokensService delegates decodedPayload.userId to findUserById", async () => {
    (verifyRefreshToken as jest.Mock).mockImplementationOnce(() => ({
      userId: "potato",
    }));

    await refreshUserTokensService("");

    expect(findUserById).toHaveBeenCalledWith("potato");
  });

  test("refreshUserTokensService throws error if decodedUser is null", async () => {
    (findUserById as jest.Mock).mockImplementationOnce(() => null);

    await expect(refreshUserTokensService("")).rejects.toThrow(
      new UnauthorizedError("Invalid Payload")
    );
  });

  test("refreshUserTokensService delegates savedRefreshToken.id to deleteRefreshTokenById", async () => {
    (findRefreshTokenById as jest.Mock).mockImplementationOnce(() => ({
      id: "tomato",
    }));

    await refreshUserTokensService("");

    expect(deleteRefreshTokenById).toHaveBeenCalledWith("tomato");
  });

  test("refreshUserTokensService returns decodedUser", async () => {
    const mockUserResonse = {
      id: "potato",
      username: "tomato",
    };
    (findUserById as jest.Mock).mockImplementationOnce(() => mockUserResonse);

    const response = await refreshUserTokensService("");

    expect(response).toEqual(mockUserResonse);
  });
});
