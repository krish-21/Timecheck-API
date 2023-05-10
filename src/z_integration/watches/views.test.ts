import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { app } from "main/app";

import {
  getAllWatchesBridge,
  createWatchBridge,
  updateWatchBridge,
} from "main/watches/bridges";

jest.mock("main/watches/bridges", () => ({
  getAllWatchesBridge: jest.fn(),
  createWatchBridge: jest.fn(),
  updateWatchBridge: jest.fn(),
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

describe("Test getAllWatchesView", () => {
  test("getAllWatchesView delegates userId from request context to getAllWatchesBridge", async () => {
    await request(app).get("/watches");

    expect(getAllWatchesBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      undefined,
      undefined
    );
  });

  test("getAllWatchesView delegates take query to getAllWatchesBridge", async () => {
    await request(app).get("/watches").query({ take: "potato" });

    expect(getAllWatchesBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "potato",
      undefined,
      undefined
    );
  });

  test("getAllWatchesView delegates skip query to getAllWatchesBridge", async () => {
    await request(app).get("/watches").query({ skip: "tomato" });

    expect(getAllWatchesBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      "tomato",
      undefined
    );
  });

  test("getAllWatchesView delegates onlyMyWatches query to getAllWatchesBridge", async () => {
    await request(app).get("/watches").query({ onlyMyWatches: "onion" });

    expect(getAllWatchesBridge).toHaveBeenCalledWith(
      "fakeUserId",
      undefined,
      undefined,
      "onion"
    );
  });

  test("getAllWatchesView returns 200 OK status code", async () => {
    const response = await request(app).get("/watches");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("getAllWatchesView returns response from getAllWatchesBridge", async () => {
    (getAllWatchesBridge as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      hello: "world",
    }));

    const response = await request(app).get("/watches");

    expect(response.body).toEqual({
      random: "data",
      hello: "world",
    });
  });
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

describe("Test updateFlashCardView", () => {
  test("updateFlashCardView delegates userId from request context & flashCardId from route to updateWatchBridge", async () => {
    await request(app).patch("/watches/123");

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      undefined,
      undefined
    );
  });

  test("updateFlashCardView delegates name from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ name: "potato" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      "potato",
      undefined,
      undefined
    );
  });

  test("updateFlashCardView delegates brand from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ brand: "tomato" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      "tomato",
      undefined
    );
  });

  test("updateFlashCardView delegates reference from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ reference: "onion" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      undefined,
      "onion"
    );
  });

  test("updateFlashCardView returns 200 OK status code", async () => {
    const response = await request(app).patch("/watches/123");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("updateFlashCardView returns response from updateWatchBridge", async () => {
    (updateWatchBridge as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      hello: "world",
    }));

    const response = await request(app).patch("/watches/123");

    expect(response.body).toEqual({
      random: "data",
      hello: "world",
    });
  });
});
