import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import {
  createRefreshToken,
  deleteRefreshTokensByUserId,
  findRefreshTokenById,
  deleteRefreshTokenById,
} from "main/auth/dbServices";

const userId = uuidV4(),
  userIdForDeleteTokens = uuidV4();

beforeAll(async () => {
  await prismaClient.user.create({
    data: {
      id: userId,
      username: uuidV4(),
      password: "potato",
    },
  });

  await prismaClient.user.create({
    data: {
      id: userIdForDeleteTokens,
      username: uuidV4(),
      password: "potato",
    },
  });
});

afterAll(async () => {
  const deleteRefreshTokens = prismaClient.refreshToken.deleteMany();

  const deleteUsers = prismaClient.user.deleteMany({
    where: {
      id: {
        in: [userId, userIdForDeleteTokens],
      },
    },
  });

  await prismaClient.$transaction([deleteRefreshTokens, deleteUsers]);
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

describe("Test deleteRefreshTokensByUserId", () => {
  test("deleteRefreshTokensByUserId deletes refreshTokens of user with passed id", async () => {
    await prismaClient.refreshToken.createMany({
      data: [
        {
          id: uuidV4(),
          hashedToken: "ginger",
          isRevoked: true,
          userId: userIdForDeleteTokens,
        },
        {
          id: uuidV4(),
          hashedToken: "garlic",
          isRevoked: true,
          userId: userIdForDeleteTokens,
        },
      ],
    });

    await deleteRefreshTokensByUserId(userIdForDeleteTokens);

    const deletedRefreshTokens = await prismaClient.refreshToken.findMany({
      where: { userId: userIdForDeleteTokens },
    });

    expect(deletedRefreshTokens).toEqual([]);
  });
});

describe("Test findRefreshTokenById", () => {
  test("findRefreshTokenById returns null if refreshToken with passed id does not exist", async () => {
    const retreivedRefreshToken = await findRefreshTokenById(uuidV4());

    expect(retreivedRefreshToken).toBeNull();
  });

  test("findRefreshTokenById finds refreshToken with passed id", async () => {
    const tokenUUID = uuidV4();
    await prismaClient.refreshToken.create({
      data: {
        id: tokenUUID,
        hashedToken: "tomato",
        userId,
      },
    });

    const retreivedRefreshToken = await findRefreshTokenById(tokenUUID);

    expect(retreivedRefreshToken).not.toBeNull();
    expect(retreivedRefreshToken).toHaveProperty("id", tokenUUID);
    expect(retreivedRefreshToken).toHaveProperty("hashedToken", "tomato");
    expect(retreivedRefreshToken).toHaveProperty("userId", userId);
  });
});

describe("Test deleteRefreshTokenById", () => {
  test("deleteRefreshTokenById deletes refreshToken with passed id", async () => {
    const tokenUUID = uuidV4();
    await prismaClient.refreshToken.create({
      data: {
        id: tokenUUID,
        hashedToken: "onion",
        isRevoked: true,
        userId,
      },
    });

    await deleteRefreshTokenById(tokenUUID);

    const deletedRefreshToken = await prismaClient.refreshToken.findUnique({
      where: { id: tokenUUID },
    });

    expect(deletedRefreshToken).toBeNull();
  });
});
