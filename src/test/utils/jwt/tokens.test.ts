import { sign, verify } from "jsonwebtoken";

import { appConfig } from "main/utils/environment/AppConfig";

import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyRefreshToken,
} from "main/utils/jwt/tokens";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test generateAccessToken", () => {
  test("generateAccessToken delegates userId to sign", () => {
    generateAccessToken("potato");

    expect(sign).toHaveBeenCalledWith(
      { userId: "potato" },
      expect.any(String),
      expect.any(Object)
    );
  });

  test("generateAccessToken delegates jwtAccessSecret to sign", () => {
    generateAccessToken("");

    expect(sign).toHaveBeenCalledWith(
      expect.any(Object),
      appConfig.jwtAccessSecret,
      expect.any(Object)
    );
  });

  test("generateAccessToken delegates ACCESS_TOKEN_EXPIRATION_TIME to sign", () => {
    generateAccessToken("");

    expect(sign).toHaveBeenCalledWith(expect.any(Object), expect.any(String), {
      expiresIn: "6hr",
    });
  });

  test("generateAccessToken returns response from sign", () => {
    (sign as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = generateAccessToken("");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test generateRefreshToken", () => {
  test("generateRefreshToken delegates userId to sign", () => {
    generateRefreshToken("potato", "");

    expect(sign).toHaveBeenCalledWith(
      { userId: "potato", tokenUUID: expect.any(String) },
      expect.any(String),
      expect.any(Object)
    );
  });

  test("generateRefreshToken delegates tokenUUID to sign", () => {
    generateRefreshToken("", "tomato");

    expect(sign).toHaveBeenCalledWith(
      { userId: expect.any(String), tokenUUID: "tomato" },
      expect.any(String),
      expect.any(Object)
    );
  });

  test("generateRefreshToken delegates jwtRefreshSecret to sign", () => {
    generateRefreshToken("", "");

    expect(sign).toHaveBeenCalledWith(
      expect.any(Object),
      appConfig.jwtRefreshSecret,
      expect.any(Object)
    );
  });

  test("generateRefreshToken delegates REFRESH_TOKEN_EXPIRATION_TIME to sign", () => {
    generateRefreshToken("", "");

    expect(sign).toHaveBeenCalledWith(expect.any(Object), expect.any(String), {
      expiresIn: "7d",
    });
  });

  test("generateRefreshToken returns response from sign", () => {
    (sign as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = generateRefreshToken("", "");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test generateTokens", () => {
  test("generateTokens returns accessToken", () => {
    (sign as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = generateTokens("", "");

    expect(response).toHaveProperty("accessToken", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("generateTokens returns refreshToken", () => {
    (sign as jest.Mock).mockImplementationOnce(() => ({
      data: "random",
      info: "irrelavant",
    }));

    const response = generateTokens("", "");

    expect(response).toHaveProperty("accessToken", {
      data: "random",
      info: "irrelavant",
    });
  });
});

describe("Test verifyRefreshToken", () => {
  test("verifyRefreshToken delegates receivedJWT to verify", () => {
    verifyRefreshToken("potato");

    expect(verify).toHaveBeenCalledWith("potato", expect.any(String));
  });

  test("verifyRefreshToken delegates jwtRefreshSecret to verify", () => {
    verifyRefreshToken("potato");

    expect(verify).toHaveBeenCalledWith(
      expect.any(String),
      appConfig.jwtRefreshSecret
    );
  });

  test("verifyRefreshToken returns response from verify", () => {
    (verify as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = verifyRefreshToken("potato");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });

  test("verifyRefreshToken returns null if verify throws error", () => {
    (verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    const response = verifyRefreshToken("potato");

    expect(response).toBeNull();
  });
});
