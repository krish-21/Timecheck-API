import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { app } from "main/app";

import {
  registerUserBridge,
  loginUserBridge,
  refreshUserTokensBridge,
  logoutUserBridge,
} from "main/auth/bridges";

jest.mock("main/auth/bridges", () => ({
  registerUserBridge: jest.fn(),
  loginUserBridge: jest.fn(),
  refreshUserTokensBridge: jest.fn(),
  logoutUserBridge: jest.fn(),
}));

jest.mock("main/middleware/isAuthenticated", () => ({
  isAuthenticated: jest.fn((req, _res, next) => {
    req.context = {
      customJWTPayload: { userId: "fakeUserId", tokenUUID: "fakeTokenUUID" },
    };
    return next();
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test registerUserView", () => {
  test("registerUserView delegates username to registerUserBridge", async () => {
    await request(app).post("/auth/register").send({ username: "potato" });

    expect(registerUserBridge).toHaveBeenCalledWith("potato", undefined);
  });

  test("registerUserView delegates password to registerUserBridge", async () => {
    await request(app).post("/auth/register").send({ password: "tomato" });

    expect(registerUserBridge).toHaveBeenCalledWith(undefined, "tomato");
  });

  test("registerUserView returns 201 CREATED status code", async () => {
    const response = await request(app).post("/auth/register");

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("registerUserView returns tokens returned from registerUserBridge", async () => {
    (registerUserBridge as jest.Mock).mockImplementationOnce(() => ({
      accessToken: "apple",
      refreshToken: "banana",
    }));

    const response = await request(app).post("/auth/register");

    expect(response.body).toEqual({
      accessToken: "apple",
      refreshToken: "banana",
    });
  });
});

describe("Test loginUserView", () => {
  test("loginUserView delegates username to loginUserBridge", async () => {
    await request(app).post("/auth/login").send({ username: "potato" });

    expect(loginUserBridge).toHaveBeenCalledWith("potato", undefined);
  });

  test("loginUserView delegates password to loginUserBridge", async () => {
    await request(app).post("/auth/login").send({ password: "tomato" });

    expect(loginUserBridge).toHaveBeenCalledWith(undefined, "tomato");
  });

  test("loginUserView returns 201 CREATED status code", async () => {
    const response = await request(app).post("/auth/login");

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("loginUserView returns tokens returned from loginUserBridge", async () => {
    (loginUserBridge as jest.Mock).mockImplementationOnce(() => ({
      accessToken: "apple",
      refreshToken: "banana",
    }));

    const response = await request(app).post("/auth/login");

    expect(response.body).toEqual({
      accessToken: "apple",
      refreshToken: "banana",
    });
  });
});

describe("Test refreshUserTokensView", () => {
  test("refreshUserTokensView delegates refreshToken to refreshUserTokensBridge", async () => {
    await request(app).post("/auth/refresh").send({ refreshToken: "potato" });

    expect(refreshUserTokensBridge).toHaveBeenCalledWith("potato");
  });

  test("refreshUserTokensView returnss 201 CREATED status code", async () => {
    const response = await request(app).post("/auth/refresh");

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("refreshUserTokensView returns tokens returned from refreshUserTokensBridge", async () => {
    (refreshUserTokensBridge as jest.Mock).mockImplementationOnce(() => ({
      accessToken: "apple",
      refreshToken: "banana",
    }));

    const response = await request(app).post("/auth/refresh");

    expect(response.body).toEqual({
      accessToken: "apple",
      refreshToken: "banana",
    });
  });
});

describe("Test logoutUserView", () => {
  test("logoutUserView delegates userId to logoutUserBridge", async () => {
    await request(app).post("/auth/logout");

    expect(logoutUserBridge).toHaveBeenCalledWith("fakeUserId");
  });

  test("refreshUserTokensView returnss 200 OK status code", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("logoutUserView returns tokens returned from logoutUserBridge", async () => {
    (logoutUserBridge as jest.Mock).mockImplementationOnce(() => "ApplePie");

    const response = await request(app).post("/auth/logout");

    expect(response.body).toEqual({
      message: "Refresh Tokens for User: ApplePie Revoked!",
    });
  });
});
