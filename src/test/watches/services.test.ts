import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";
import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchById,
  findWatchByReference,
  findAllWatches,
  countAllWatches,
  createWatchForUser,
  updateWatchById,
} from "main/watches/dbServices";

import {
  getAllWatchesService,
  createWatchService,
  updateWatchService,
} from "main/watches/services";

jest.mock("main/watches/dbServices", () => ({
  findWatchById: jest.fn(() => ({ userId: "" })),
  findWatchByReference: jest.fn(() => null),
  findAllWatches: jest.fn(),
  countAllWatches: jest.fn(() => 0),
  createWatchForUser: jest.fn(),
  updateWatchById: jest.fn(),
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
      watches: undefined,
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

describe("Test updateWatchService", () => {
  test("updateWatchService delegates watchId to findWatchById", async () => {
    await updateWatchService("", "potato", "");

    expect(findWatchById).toHaveBeenCalledWith("potato");
  });

  test("updateWatchService throws error if findWatchById returns null", async () => {
    (findWatchById as jest.Mock).mockImplementationOnce(() => null);

    await expect(updateWatchService("", "")).rejects.toThrow(
      new InvalidDataError("watchId")
    );
  });

  test("updateWatchService throws error if watch returned from findWatchById does not belong to user", async () => {
    (findWatchById as jest.Mock).mockImplementationOnce(() => ({
      userId: "potato",
    }));

    await expect(updateWatchService("tomato", "")).rejects.toThrow(
      new InvalidDataError("watchId")
    );
  });

  test("updateWatchService does not call findWatchByReference if reference is undefined", async () => {
    await updateWatchService("", "", undefined, undefined, undefined);

    expect(findWatchByReference).toHaveBeenCalledTimes(0);
  });

  test("updateWatchService delegates reference to findWatchByReference", async () => {
    await updateWatchService("", "", undefined, undefined, "potato");

    expect(findWatchByReference).toHaveBeenCalledWith("potato");
  });

  test("updateWatchService throws error if findWatchByReference does not return null and is not the same watch", async () => {
    (findWatchByReference as jest.Mock).mockImplementationOnce(() => ({
      id: "marinara",
    }));

    await expect(
      updateWatchService("", "margherita", undefined, undefined, "")
    ).rejects.toThrow(new AlreadyExistsError("reference"));
  });

  test("updateWatchService does not call updateWatchById if no updates", async () => {
    (findWatchById as jest.Mock).mockImplementationOnce(() => ({
      name: "_",
      brand: "__",
      reference: "___",
      userId: "",
    }));

    await updateWatchService("", "", "_", "__", "___");

    expect(updateWatchById).toHaveBeenCalledTimes(0);
  });

  test("updateWatchService returns retrivedWatch if no updates", async () => {
    (findWatchById as jest.Mock).mockImplementationOnce(() => ({
      name: "_",
      brand: "__",
      reference: "___",
      userId: "",
    }));

    const response = await updateWatchService("", "", "_", "__", "___");

    expect(response).toEqual({
      name: "_",
      brand: "__",
      reference: "___",
      userId: "",
    });
  });

  test("updateWatchService delegates watchId to updateWatchById", async () => {
    await updateWatchService("", "potato", "");

    expect(updateWatchById).toHaveBeenCalledWith(
      "potato",
      "",
      undefined,
      undefined
    );
  });

  test("updateWatchService delegates name to updateWatchById", async () => {
    await updateWatchService("", "", "tomato");

    expect(updateWatchById).toHaveBeenCalledWith(
      "",
      "tomato",
      undefined,
      undefined
    );
  });

  test("updateWatchService delegates brand to updateWatchById", async () => {
    await updateWatchService("", "", undefined, "onion");

    expect(updateWatchById).toHaveBeenCalledWith(
      "",
      undefined,
      "onion",
      undefined
    );
  });

  test("updateWatchService delegates reference to updateWatchById", async () => {
    await updateWatchService("", "", undefined, undefined, "celery");

    expect(updateWatchById).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      "celery"
    );
  });

  test("updateWatchService returns response from updateWatchById", async () => {
    (updateWatchById as jest.Mock).mockImplementationOnce(() => ({
      chilly: "chicken",
      gobi: 65,
    }));

    const response = await updateWatchService("", "", "_");

    expect(response).toEqual({
      chilly: "chicken",
      gobi: 65,
    });
  });
});
