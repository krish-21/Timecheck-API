import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

import { MAXIMUM_PASSWORD_LENGTH } from "main/auth/constants";

import {
  registerUserService,
  generateAndSaveTokensService,
} from "main/auth/services";

import { registerUserBridge } from "main/auth/bridges";

jest.mock("main/auth/services", () => ({
  registerUserService: jest.fn(() => ({})),
  generateAndSaveTokensService: jest.fn(() => ({})),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Test registerUserBridge", () => {
  test("registerUserBridge throws error for missing username", async () => {
    await expect(registerUserBridge()).rejects.toThrow(
      new InvalidDataError("Username")
    );
  });

  test("registerUserBridge throws error for too short username", async () => {
    await expect(registerUserBridge("short")).rejects.toThrow(
      new InvalidDataError("Username")
    );
  });

  test("registerUserBridge throws error for missing password", async () => {
    await expect(registerUserBridge("potatoPotato")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("registerUserBridge throws error for too short password", async () => {
    await expect(registerUserBridge("potatoPotato", "short")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("registerUserBridge throws error for too long password", async () => {
    await expect(
      registerUserBridge(
        "potatoPotato",
        "s".repeat(MAXIMUM_PASSWORD_LENGTH + 1)
      )
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("registerUserBridge throws error for password without lower case", async () => {
    await expect(
      registerUserBridge("potatoPotato", "S".repeat(MAXIMUM_PASSWORD_LENGTH))
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("registerUserBridge throws error for password without upper case", async () => {
    await expect(
      registerUserBridge("potatoPotato", "abcdefghi")
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("registerUserBridge throws error for password without digits", async () => {
    await expect(
      registerUserBridge("potatoPotato", "ABCdefGHI")
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("registerUserBridge throws error for password without special characters", async () => {
    await expect(
      registerUserBridge("potatoPotato", "ABCdefGHI123")
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("registerUserBridge delegates username and password to registerUserService", async () => {
    await registerUserBridge("potatoPotato", "ABCdefGHI123#");

    expect(registerUserService).toHaveBeenCalledWith(
      "potatoPotato",
      "ABCdefGHI123#"
    );
  });

  test("registerUserBridge delegates registeredUserId to generateAndSaveTokensService", async () => {
    (registerUserService as jest.Mock).mockImplementation(() => ({
      id: "potato",
    }));

    await registerUserBridge("decentUsername", "ABCdefGHI123#");

    expect(generateAndSaveTokensService).toHaveBeenCalledWith("potato");
  });

  test("registerUserBridge returns response from generateAndSaveTokensService", async () => {
    const mockTokenResonse = {
      random: "potato",
      data: "tomato",
    };
    (generateAndSaveTokensService as jest.Mock).mockImplementationOnce(
      () => mockTokenResonse
    );

    const response = await registerUserBridge(
      "decentUsername",
      "ABCdefGHI123#"
    );

    expect(response).toEqual(mockTokenResonse);
  });
});
