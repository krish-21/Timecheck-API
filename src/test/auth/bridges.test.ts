import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

import { MAXIMUM_PASSWORD_LENGTH } from "main/auth/constants";

import {
  registerUserService,
  generateAndSaveTokensService,
  loginUserService,
  refreshUserTokensService,
  logoutUserService,
} from "main/auth/services";

import {
  loginUserBridge,
  registerUserBridge,
  refreshUserTokensBridge,
  logoutUserBridge,
} from "main/auth/bridges";

jest.mock("main/auth/services", () => ({
  registerUserService: jest.fn(() => ({})),
  loginUserService: jest.fn(() => ({})),
  refreshUserTokensService: jest.fn(() => ({})),
  generateAndSaveTokensService: jest.fn(() => ({})),
  logoutUserService: jest.fn(),
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

describe("Test loginUserBridge", () => {
  test("loginUserBridge throws error for missing username", async () => {
    await expect(loginUserBridge()).rejects.toThrow(
      new InvalidDataError("Username")
    );
  });

  test("loginUserBridge throws error for too short username", async () => {
    await expect(loginUserBridge("short")).rejects.toThrow(
      new InvalidDataError("Username")
    );
  });

  test("loginUserBridge throws error for missing password", async () => {
    await expect(loginUserBridge("potatoPotato")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("loginUserBridge throws error for too short password", async () => {
    await expect(loginUserBridge("potatoPotato", "short")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("loginUserBridge throws error for too long password", async () => {
    await expect(
      loginUserBridge("potatoPotato", "s".repeat(MAXIMUM_PASSWORD_LENGTH + 1))
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("loginUserBridge throws error for password without lower case", async () => {
    await expect(
      loginUserBridge("potatoPotato", "S".repeat(MAXIMUM_PASSWORD_LENGTH))
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("loginUserBridge throws error for password without upper case", async () => {
    await expect(loginUserBridge("potatoPotato", "abcdefghi")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("loginUserBridge throws error for password without digits", async () => {
    await expect(loginUserBridge("potatoPotato", "ABCdefGHI")).rejects.toThrow(
      new InvalidDataError("Password")
    );
  });

  test("loginUserBridge throws error for password without special characters", async () => {
    await expect(
      loginUserBridge("potatoPotato", "ABCdefGHI123")
    ).rejects.toThrow(new InvalidDataError("Password"));
  });

  test("loginUserBridge delegates username and password to loginUserService", async () => {
    await loginUserBridge("potatoPotato", "ABCdefGHI123#");

    expect(loginUserService).toHaveBeenCalledWith(
      "potatoPotato",
      "ABCdefGHI123#"
    );
  });

  test("loginUserBridge delegates foundUserId to generateAndSaveTokensService", async () => {
    (loginUserService as jest.Mock).mockImplementation(() => ({
      id: "potato",
    }));

    await loginUserBridge("decentUsername", "ABCdefGHI123#");

    expect(generateAndSaveTokensService).toHaveBeenCalledWith("potato");
  });

  test("loginUserBridge returns response from generateAndSaveTokensService", async () => {
    const mockTokenResonse = {
      random: "potato",
      data: "tomato",
    };
    (generateAndSaveTokensService as jest.Mock).mockImplementationOnce(
      () => mockTokenResonse
    );

    const response = await loginUserBridge("decentUsername", "ABCdefGHI123#");

    expect(response).toEqual(mockTokenResonse);
  });
});

describe("Test refreshUserTokensBridge", () => {
  test("refreshUserTokensBridge throws error if refreshToken is undefined", async () => {
    await expect(refreshUserTokensBridge()).rejects.toThrow(
      new InvalidDataError("Refresh Token")
    );
  });

  test("refreshUserTokensBridge delegates receivedRefreshToken to refreshUserTokensService", async () => {
    await refreshUserTokensBridge("potato");

    expect(refreshUserTokensService).toHaveBeenCalledWith("potato");
  });

  test("refreshUserTokensBridge delegates decodedUserId to generateAndSaveTokensService", async () => {
    (refreshUserTokensService as jest.Mock).mockImplementation(() => ({
      id: "potato",
    }));

    await refreshUserTokensBridge("");

    expect(generateAndSaveTokensService).toHaveBeenCalledWith("potato");
  });

  test("refreshUserTokensBridge returns response from generateAndSaveTokensService", async () => {
    const mockTokenResonse = {
      random: "potato",
      data: "tomato",
    };
    (generateAndSaveTokensService as jest.Mock).mockImplementationOnce(
      () => mockTokenResonse
    );

    const response = await refreshUserTokensBridge("");

    expect(response).toEqual(mockTokenResonse);
  });
});

describe("Test logoutUserBridge", () => {
  test("logoutUserBridge delegates userId to logoutUserService", async () => {
    await logoutUserBridge("potato");

    expect(logoutUserService).toHaveBeenCalledWith("potato");
  });

  test("logoutUserBridge returns response from logoutUserService", async () => {
    (logoutUserService as jest.Mock).mockImplementationOnce(
      () => "PotatoTomato"
    );

    const response = await logoutUserBridge("potato");

    expect(response).toEqual("PotatoTomato");
  });
});
