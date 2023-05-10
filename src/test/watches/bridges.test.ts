import { validateCreateWatchBody, transformWatch } from "main/watches/utils";

import { createWatchService } from "main/watches/services";

import { createWatchBridge } from "main/watches/bridges";

jest.mock("main/watches/utils", () => ({
  validateCreateWatchBody: jest.fn(() => ({})),
  transformWatch: jest.fn(),
}));

jest.mock("main/watches/services", () => ({
  createWatchService: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
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
