import { AlreadyExistsError } from "main/utils/errors/AlreadyExistsError/AlreadyExistsError";

import {
  findWatchByReference,
  createWatchForUser,
} from "main/watches/dbServices";

import { createWatchService } from "main/watches/services";

jest.mock("main/watches/dbServices", () => ({
  findWatchByReference: jest.fn(() => null),
  createWatchForUser: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
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
