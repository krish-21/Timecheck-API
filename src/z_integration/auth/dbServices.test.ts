import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import { createRefreshToken } from "main/auth/dbServices";

const userId = uuidV4();

beforeAll(async () => {
  await prismaClient.user.create({
    data: {
      id: userId,
      username: uuidV4(),
      password: "potato",
    },
  });
});

afterAll(async () => {
  const deleteRefreshTokens = prismaClient.refreshToken.deleteMany();

  const deleteUser = prismaClient.user.delete({
    where: {
      id: userId,
    },
  });

  await prismaClient.$transaction([deleteRefreshTokens, deleteUser]);
});

describe("Test createRefreshToken", () => {
  const tokenUUID = uuidV4();
  test("createRefreshToken creates a RefreshToken with passed data", async () => {
    await createRefreshToken(tokenUUID, "potato", userId);

    const createdRefreshToken =
      await prismaClient.refreshToken.findUniqueOrThrow({
        where: { id: tokenUUID },
      });
    expect(createdRefreshToken).toHaveProperty("id", tokenUUID);
    expect(createdRefreshToken).toHaveProperty("hashedToken", "potato");
    expect(createdRefreshToken).toHaveProperty("userId", userId);
  });
});
