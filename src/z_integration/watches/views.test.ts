import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { app } from "main/app";

import { createWatchBridge } from "main/watches/bridges";

jest.mock("main/watches/bridges", () => ({
  createWatchBridge: jest.fn(),
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

describe("Test createWatchView", () => {
  test("createWatchView delegates userId from request context to createWatchBridge", async () => {
    await request(app).post("/watches");

    expect(createWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      undefined,
      undefined
    );
  });

  test("createWatchView delegates name from body to createWatchBridge", async () => {
    await request(app).post("/watches").send({ name: "potato" });

    expect(createWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "potato",
      undefined,
      undefined
    );
  });

  test("createWatchView delegates brand from body to createWatchBridge", async () => {
    await request(app).post("/watches").send({ brand: "tomato" });

    expect(createWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      "tomato",
      undefined
    );
  });

  test("createWatchView delegates reference from body to createWatchBridge", async () => {
    await request(app).post("/watches").send({ reference: "onion" });

    expect(createWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      undefined,
      "onion"
    );
  });

  test("createWatchView returns 201 CREATED status code", async () => {
    const response = await request(app).post("/watches");

    expect(response.status).toEqual(StatusCodes.CREATED);
  });

  test("createWatchView returns response from createWatchBridge", async () => {
    (createWatchBridge as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      hello: "world",
    }));

    const response = await request(app).post("/watches");

    expect(response.body).toEqual({
      random: "data",
      hello: "world",
    });
  });
});
