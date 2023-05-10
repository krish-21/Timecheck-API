import request from "supertest";
import { StatusCodes } from "http-status-codes";

import { app } from "main/app";

import {
  getAllWatchesBridge,
  findWatchBridge,
  createWatchBridge,
  updateWatchBridge,
  deleteWatchBridge,
} from "main/watches/bridges";

jest.mock("main/watches/bridges", () => ({
  getAllWatchesBridge: jest.fn(),
  findWatchBridge: jest.fn(),
  createWatchBridge: jest.fn(),
  updateWatchBridge: jest.fn(),
  deleteWatchBridge: jest.fn(),
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

describe("Test findWatchView", () => {
  test("findWatchView delegates userId from request context & courseId from route to findWatchBridge", async () => {
    await request(app).get("/watches/123");

    expect(findWatchBridge).toHaveBeenCalledWith("123");
  });

  test("findWatchView returns 200 OK status code", async () => {
    const response = await request(app).get("/watches/123");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("findWatchView returns response from findWatchBridge", async () => {
    (findWatchBridge as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      hello: "world",
    }));

    const response = await request(app).get("/watches/123");

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

describe("Test updateWatchView", () => {
  test("updateWatchView delegates userId from request context & watcheId from route to updateWatchBridge", async () => {
    await request(app).patch("/watches/123");

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      undefined,
      undefined
    );
  });

  test("updateWatchView delegates name from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ name: "potato" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      "potato",
      undefined,
      undefined
    );
  });

  test("updateWatchView delegates brand from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ brand: "tomato" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      "tomato",
      undefined
    );
  });

  test("updateWatchView delegates reference from body to updateWatchBridge", async () => {
    await request(app).patch("/watches/123").send({ reference: "onion" });

    expect(updateWatchBridge).toHaveBeenCalledWith(
      "fakeUserId",
      "123",
      undefined,
      undefined,
      "onion"
    );
  });

  test("updateWatchView returns 200 OK status code", async () => {
    const response = await request(app).patch("/watches/123");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("updateWatchView returns response from updateWatchBridge", async () => {
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

describe("Test deleteWatchView", () => {
  test("deleteWatchView delegates userId from request context & courseId from route to deleteWatchBridge", async () => {
    await request(app).delete("/watches/123");

    expect(deleteWatchBridge).toHaveBeenCalledWith("fakeUserId", "123");
  });

  test("deleteWatchView returns 200 OK status code", async () => {
    const response = await request(app).delete("/watches/123");

    expect(response.status).toEqual(StatusCodes.OK);
  });

  test("deleteWatchView returns response from deleteWatchBridge", async () => {
    (deleteWatchBridge as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      hello: "world",
    }));

    const response = await request(app).delete("/watches/123");

    expect(response.body).toEqual({
      random: "data",
      hello: "world",
    });
  });
});
