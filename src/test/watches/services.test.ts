import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchByReference,
  findAllWatches,
  countAllWatches,
  createWatchForUser,
} from "main/watches/dbServices";

import {
  getAllWatchesService,
  createWatchService,
} from "main/watches/services";

jest.mock("main/watches/dbServices", () => ({
  findWatchByReference: jest.fn(() => null),
  findAllWatches: jest.fn(),
  countAllWatches: jest.fn(() => 0),
  createWatchForUser: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test getAllWatchesService", () => {
  test("getAllWatchesService delegates take to findAllWatches", async () => {
    await getAllWatchesService("", 123, -1, false);

    expect(findAllWatches).toHaveBeenCalledWith(123, -1, undefined);
  });

  test("getAllWatchesService delegates skip to findAllWatches", async () => {
    await getAllWatchesService("", -1, 456, false);

    expect(findAllWatches).toHaveBeenCalledWith(-1, 456, undefined);
  });

  test("getAllWatchesService delegates userId if onlyUserWatches is true", async () => {
    await getAllWatchesService("potato", -1, -1, true);

    expect(findAllWatches).toHaveBeenCalledWith(-1, -1, "potato");
  });

  test("getAllWatchesService delegates undefined to countAllWatches if onlyUserWatches is false", async () => {
    await getAllWatchesService("potato", -1, -1, false);

    expect(countAllWatches).toHaveBeenCalledWith(undefined);
  });

  test("getAllWatchesService delegates undefined to countAllWatches if onlyUserWatches is true", async () => {
    await getAllWatchesService("potato", -1, -1, true);

    expect(countAllWatches).toHaveBeenCalledWith("potato");
  });

  test("getAllWatchesService returns response from findAllWatches undeer key watches", async () => {
    (findAllWatches as jest.Mock).mockImplementationOnce(() => ({
      data: "potato",
      tasty: "tomato",
    }));

    const response = await getAllWatchesService("", -1, -1, false);

    expect(response).toEqual({
      watches: {
        data: "potato",
        tasty: "tomato",
      },
      count: 0,
    });
  });

  test("getAllWatchesService returns response from countAllWatches under key count", async () => {
    (countAllWatches as jest.Mock).mockImplementationOnce(() => ({
      data: "potato",
      tasty: "tomato",
    }));

    const response = await getAllWatchesService("", -1, -1, true);

    expect(response).toEqual({
      flashCards: undefined,
      count: {
        data: "potato",
        tasty: "tomato",
      },
    });
  });
});

describe("Test createWatchService", () => {
  test("createWatchService delegates reference to findWatchByReference", async () => {
    await createWatchService("", "", "", "celery");

    expect(findWatchByReference).toHaveBeenCalledWith("celery");
  });

  test("createWatchService throws error if findWatchByReference does not return null", async () => {
    (findWatchByReference as jest.Mock).mockImplementationOnce(() => ({}));

    await expect(createWatchService("", "", "", "")).rejects.toThrow(
      new AlreadyExistsError("Watch")
    );
  });

  test("createWatchService delegates userId to createWatchForUser", async () => {
    await createWatchService("mint", "", "", "");

    expect(createWatchForUser).toHaveBeenCalledWith("mint", "", "", "");
  });

  test("createWatchService delegates name to createWatchForUser", async () => {
    await createWatchService("", "mojito", "", "");

    expect(createWatchForUser).toHaveBeenCalledWith("", "mojito", "", "");
  });

  test("createWatchService delegates brand to createWatchForUser", async () => {
    await createWatchService("", "", "pina", "");

    expect(createWatchForUser).toHaveBeenCalledWith("", "", "pina", "");
  });

  test("createWatchService delegates reference to createWatchForUser", async () => {
    await createWatchService("", "", "", "colada");

    expect(createWatchForUser).toHaveBeenCalledWith("", "", "", "colada");
  });

  test("createWatchService returns response of createWatchForUser", async () => {
    (createWatchForUser as jest.Mock).mockImplementationOnce(() => ({
      pav: "bhaji",
      chole: "bhature",
    }));

    const response = await createWatchService("", "", "", "");

    expect(response).toEqual({
      pav: "bhaji",
      chole: "bhature",
    });
  });
});
