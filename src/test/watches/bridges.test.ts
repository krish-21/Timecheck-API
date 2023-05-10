import {
  validateGetAllWatchesQueries,
  validateCreateWatchBody,
  validateUpdateWatchBody,
  validateDeleteWatchValues,
  transformWatch,
  transformWatches,
} from "main/watches/utils";

import {
  getAllWatchesService,
  createWatchService,
  updateWatchService,
  deleteWatchService,
} from "main/watches/services";

import {
  getAllWatchesBridge,
  createWatchBridge,
  updateWatchBridge,
  deleteWatchBridge,
} from "main/watches/bridges";

jest.mock("main/watches/utils", () => ({
  validateGetAllWatchesQueries: jest.fn(() => ({})),
  validateCreateWatchBody: jest.fn(() => ({})),
  validateUpdateWatchBody: jest.fn(() => ({})),
  validateDeleteWatchValues: jest.fn(() => ({})),
  transformWatch: jest.fn(),
  transformWatches: jest.fn(),
}));

jest.mock("main/watches/services", () => ({
  getAllWatchesService: jest.fn(() => ({})),
  createWatchService: jest.fn(),
  updateWatchService: jest.fn(),
  deleteWatchService: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test getAllWatchesBridge", () => {
  test("getAllWatchesBridge delegates takeQuery to validateGetAllWatchesQueries", async () => {
    await getAllWatchesBridge("", "potato");

    expect(validateGetAllWatchesQueries).toHaveBeenCalledWith(
      "potato",
      undefined,
      undefined
    );
  });

  test("getAllWatchesBridge delegates skipQuery to validateGetAllWatchesQueries", async () => {
    await getAllWatchesBridge("", undefined, "tomato");

    expect(validateGetAllWatchesQueries).toHaveBeenCalledWith(
      undefined,
      "tomato",
      undefined
    );
  });

  test("getAllWatchesBridge delegates onlyMyWatchesQuery to validateGetAllWatchesQueries", async () => {
    await getAllWatchesBridge("", undefined, undefined, "onion");

    expect(validateGetAllWatchesQueries).toHaveBeenCalledWith(
      undefined,
      undefined,
      "onion"
    );
  });

  test("getAllWatchesBridge delegates userId to getAllWatchesService", async () => {
    await getAllWatchesBridge("paneer");

    expect(getAllWatchesService).toHaveBeenCalledWith(
      "paneer",
      undefined,
      undefined,
      undefined
    );
  });

  test("getAllWatchesBridge delegates validated take from validateGetAllWatchesQueries to getAllWatchesService", async () => {
    (validateGetAllWatchesQueries as jest.Mock).mockImplementationOnce(() => ({
      take: "potato",
    }));

    await getAllWatchesBridge("");

    expect(getAllWatchesService).toHaveBeenCalledWith(
      "",
      "potato",
      undefined,
      undefined
    );
  });

  test("getAllWatchesBridge delegates validated skip from validateGetAllWatchesQueries to getAllWatchesService", async () => {
    (validateGetAllWatchesQueries as jest.Mock).mockImplementationOnce(() => ({
      skip: "tomato",
    }));

    await getAllWatchesBridge("");

    expect(getAllWatchesService).toHaveBeenCalledWith(
      "",
      undefined,
      "tomato",
      undefined
    );
  });

  test("getAllWatchesBridge delegates validated onlyUserWatches from validateGetAllWatchesQueries to getAllWatchesService", async () => {
    (validateGetAllWatchesQueries as jest.Mock).mockImplementationOnce(() => ({
      onlyUserWatches: "onion",
    }));

    await getAllWatchesBridge("");

    expect(getAllWatchesService).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      "onion"
    );
  });

  test("getAllWatchesBridge delegates found watches to transformWatches", async () => {
    (getAllWatchesService as jest.Mock).mockImplementationOnce(() => ({
      watches: { random: "data", irrelavant: "info" },
    }));

    await getAllWatchesBridge("");

    expect(transformWatches).toHaveBeenCalledWith({
      random: "data",
      irrelavant: "info",
    });
  });

  test("getAllWatchesBridge returns response from transformWatches under key items", async () => {
    (transformWatches as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await getAllWatchesBridge("");

    expect(response).toHaveProperty("items", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("getAllWatchesBridge returns count from getAllWatchesService under key totalItems", async () => {
    (getAllWatchesService as jest.Mock).mockImplementationOnce(() => ({
      count: { random: "data", irrelavant: "info" },
    }));

    const response = await getAllWatchesBridge("");

    expect(response).toHaveProperty("totalItems", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("getAllWatchesBridge returns take from validateGetAllWatchesQueries under key take", async () => {
    (validateGetAllWatchesQueries as jest.Mock).mockImplementationOnce(() => ({
      take: { random: "data", irrelavant: "info" },
    }));

    const response = await getAllWatchesBridge("");

    expect(response).toHaveProperty("take", {
      random: "data",
      irrelavant: "info",
    });
  });

  test("getAllWatchesBridge returns skip from validateGetAllWatchesQueries under key skip", async () => {
    (validateGetAllWatchesQueries as jest.Mock).mockImplementationOnce(() => ({
      skip: { random: "data", irrelavant: "info" },
    }));

    const response = await getAllWatchesBridge("");

    expect(response).toHaveProperty("skip", {
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test createWatchBridge", () => {
  test("createWatchBridge delegates nameValue to validateCreateWatchBody", async () => {
    await createWatchBridge("", "potato");

    expect(validateCreateWatchBody).toHaveBeenCalledWith(
      "potato",
      undefined,
      undefined
    );
  });

  test("createWatchBridge delegates brandValue to validateCreateWatchBody", async () => {
    await createWatchBridge("", undefined, "tomato");

    expect(validateCreateWatchBody).toHaveBeenCalledWith(
      undefined,
      "tomato",
      undefined
    );
  });

  test("createWatchBridge delegates referenceValue to validateCreateWatchBody", async () => {
    await createWatchBridge("", undefined, undefined, "onion");

    expect(validateCreateWatchBody).toHaveBeenCalledWith(
      undefined,
      undefined,
      "onion"
    );
  });

  test("createWatchBridge delegates userId to createWatchService", async () => {
    await createWatchBridge("paneer");

    expect(createWatchService).toHaveBeenCalledWith(
      "paneer",
      undefined,
      undefined,
      undefined
    );
  });

  test("createWatchBridge delegates validated name from validateCreateWatchBody to createWatchService", async () => {
    (validateCreateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      name: "potato",
    }));

    await createWatchBridge("");

    expect(createWatchService).toHaveBeenCalledWith(
      "",
      "potato",
      undefined,
      undefined
    );
  });

  test("createWatchBridge delegates validated brand from validateCreateWatchBody to createWatchService", async () => {
    (validateCreateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      brand: "tomato",
    }));

    await createWatchBridge("");

    expect(createWatchService).toHaveBeenCalledWith(
      "",
      undefined,
      "tomato",
      undefined
    );
  });

  test("createWatchBridge delegates validated reference from validateCreateWatchBody to createWatchService", async () => {
    (validateCreateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      reference: "onion",
    }));

    await createWatchBridge("");

    expect(createWatchService).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      "onion"
    );
  });

  test("createWatchBridge delegates created watch to transformWatch", async () => {
    (createWatchService as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    await createWatchBridge("");

    expect(transformWatch).toHaveBeenCalledWith({
      random: "data",
      irrelavant: "info",
    });
  });

  test("createWatchBridge returns response from transformWatch", async () => {
    (transformWatch as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await createWatchBridge("");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test updateWatchBridge", () => {
  test("updateWatchBridge delegates watchIdValue to validateUpdateWatchBody", async () => {
    await updateWatchBridge("", "celery");

    expect(validateUpdateWatchBody).toHaveBeenCalledWith(
      "celery",
      undefined,
      undefined,
      undefined
    );
  });

  test("updateWatchBridge delegates nameValue to validateUpdateWatchBody", async () => {
    await updateWatchBridge("", "", "potato");

    expect(validateUpdateWatchBody).toHaveBeenCalledWith(
      "",
      "potato",
      undefined,
      undefined
    );
  });

  test("updateWatchBridge delegates brandValue to validateUpdateWatchBody", async () => {
    await updateWatchBridge("", "", undefined, "tomato");

    expect(validateUpdateWatchBody).toHaveBeenCalledWith(
      "",
      undefined,
      "tomato",
      undefined
    );
  });

  test("updateWatchBridge delegates referenceValue to validateUpdateWatchBody", async () => {
    await updateWatchBridge("", "", undefined, undefined, "onion");

    expect(validateUpdateWatchBody).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      "onion"
    );
  });

  test("updateWatchBridge delegates userId to updateWatchService", async () => {
    await updateWatchBridge("paneer", "");

    expect(updateWatchService).toHaveBeenCalledWith(
      "paneer",
      undefined,
      undefined,
      undefined,
      undefined
    );
  });

  test("updateWatchBridge delegates validated watchId from validateUpdateWatchBody to updateWatchService", async () => {
    (validateUpdateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      watchId: "potato",
    }));

    await updateWatchBridge("", "");

    expect(updateWatchService).toHaveBeenCalledWith(
      "",
      "potato",
      undefined,
      undefined,
      undefined
    );
  });

  test("updateWatchBridge delegates validated name from validateUpdateWatchBody to updateWatchService", async () => {
    (validateUpdateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      name: "potato",
    }));

    await updateWatchBridge("", "");

    expect(updateWatchService).toHaveBeenCalledWith(
      "",
      undefined,
      "potato",
      undefined,
      undefined
    );
  });

  test("updateWatchBridge delegates validated brand from validateUpdateWatchBody to updateWatchService", async () => {
    (validateUpdateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      brand: "tomato",
    }));

    await updateWatchBridge("", "");

    expect(updateWatchService).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      "tomato",
      undefined
    );
  });

  test("updateWatchBridge delegates validated reference from validateUpdateWatchBody to updateWatchService", async () => {
    (validateUpdateWatchBody as jest.Mock).mockImplementationOnce(() => ({
      reference: "onion",
    }));

    await updateWatchBridge("", "");

    expect(updateWatchService).toHaveBeenCalledWith(
      "",
      undefined,
      undefined,
      undefined,
      "onion"
    );
  });

  test("updateWatchBridge delegates updated watch to transformWatch", async () => {
    (updateWatchService as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    await updateWatchBridge("", "");

    expect(transformWatch).toHaveBeenCalledWith({
      random: "data",
      irrelavant: "info",
    });
  });

  test("updateWatchBridge returns response from transformWatch", async () => {
    (transformWatch as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await updateWatchBridge("", "");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});

describe("Test deleteWatchBridge", () => {
  test("deleteWatchBridge delegates watchId to validateDeleteWatchValues", async () => {
    await deleteWatchBridge("", "potato");

    expect(validateDeleteWatchValues).toHaveBeenCalledWith("potato");
  });

  test("deleteWatchBridge delegates userId to deleteWatchService", async () => {
    await deleteWatchBridge("tomato", "");

    expect(deleteWatchService).toHaveBeenCalledWith("tomato", undefined);
  });

  test("deleteWatchBridge delegates validated watchId to deleteWatchService", async () => {
    (validateDeleteWatchValues as jest.Mock).mockImplementationOnce(() => ({
      watchId: "onion",
    }));

    await deleteWatchBridge("", "");

    expect(deleteWatchService).toHaveBeenCalledWith("", "onion");
  });

  test("deleteWatchBridge delegates deleted watch to transformWatch", async () => {
    (deleteWatchService as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    await deleteWatchBridge("", "");

    expect(transformWatch).toHaveBeenCalledWith({
      random: "data",
      irrelavant: "info",
    });
  });

  test("deleteWatchBridge returns response from transformWatch", async () => {
    (transformWatch as jest.Mock).mockImplementationOnce(() => ({
      random: "data",
      irrelavant: "info",
    }));

    const response = await deleteWatchBridge("", "");

    expect(response).toEqual({
      random: "data",
      irrelavant: "info",
    });
  });
});
