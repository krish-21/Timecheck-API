import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import {
  findWatchByReference,
  createWatchForUser,
} from "main/watches/dbServices";

const userId = uuidV4(),
  secondUserId = uuidV4();
let firstWatchId: string;
let firstWatchReference: string;

beforeAll(async () => {
  await prismaClient.$connect();

  await prismaClient.user.create({
    data: {
      id: userId,
      username: uuidV4(),
      password: "potato",
    },
  });

  await prismaClient.user.create({
    data: {
      id: secondUserId,
      username: uuidV4(),
      password: "tomato",
    },
  });

  await prismaClient.watch.createMany({
    data: [
      {
        name: "Potato",
        brand: "Root Veggie",
        reference: uuidV4(),
        userId,
      },
      {
        name: "Tomato",
        brand: "Fruit",
        reference: uuidV4(),
        userId,
      },
      {
        name: "Onion",
        brand: "Bulb",
        reference: uuidV4(),
        userId,
      },
    ],
  });

  const [watch1, watch2, watch3] = await prismaClient.watch.findMany({
    take: 3,
    where: { userId },
    orderBy: {
      name: "asc",
    },
  });

  if (watch1 === undefined || watch2 === undefined || watch3 === undefined) {
    throw new Error("Setup of Watchs failed");
  }

  ({ id: firstWatchId, reference: firstWatchReference } = watch1);
});

afterAll(async () => {
  const deleteWatches = prismaClient.watch.deleteMany({
    where: {
      userId: {
        in: [userId, secondUserId],
      },
    },
  });

  const deleteUsers = prismaClient.user.deleteMany({
    where: {
      id: {
        in: [userId, secondUserId],
      },
    },
  });

  await prismaClient.$transaction([deleteWatches, deleteUsers]);
});

describe("Test findWatchByReference", () => {
  test("findWatchByReference finds watch by passed reference", async () => {
    const foundWatch = await findWatchByReference(firstWatchReference);

    expect(foundWatch).toHaveProperty("id", firstWatchId);
    expect(foundWatch).toHaveProperty("reference", firstWatchReference);
    expect(foundWatch).toHaveProperty("userId", userId);
  });
});

describe("Test createWatchForUser", () => {
  test("createWatchForUser creates watch with passed data", async () => {
    const reference = uuidV4();

    const createdWatch = await createWatchForUser(
      secondUserId,
      "potato",
      "tomato",
      reference
    );

    const foundWatch = await prismaClient.watch.findUniqueOrThrow({
      where: {
        id: createdWatch.id,
      },
    });

    expect(foundWatch).toHaveProperty("name", "potato");
    expect(foundWatch).toHaveProperty("brand", "tomato");
    expect(foundWatch).toHaveProperty("reference", reference);
    expect(foundWatch).toHaveProperty("userId", secondUserId);
  });
});
