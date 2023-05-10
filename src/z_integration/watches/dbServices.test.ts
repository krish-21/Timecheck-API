import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import {
  findWatchById,
  findWatchByReference,
  createWatchForUser,
  findAllWatches,
  countAllWatches,
  updateWatchById,
  deleteWatchById,
} from "main/watches/dbServices";

const userId = uuidV4(),
  secondUserId = uuidV4();

let firstWatchId: string, secondWatchId: string, thirdWatchId: string;
let firstWatchReference: string;

let firstWatchIdOfFirstUser: string, secondWatchIdOfFirstUser: string;

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
        userId: secondUserId,
      },
    ],
  });

  const [watch1, watch2, watch3] = await prismaClient.watch.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (watch1 === undefined || watch2 === undefined || watch3 === undefined) {
    throw new Error("Setup of Watches failed");
  }

  ({ id: firstWatchId, reference: firstWatchReference } = watch1);
  ({ id: secondWatchId } = watch2);
  ({ id: thirdWatchId } = watch3);

  const [watch4, watch5] = await prismaClient.watch.findMany({
    take: 2,
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  ({ id: firstWatchIdOfFirstUser } = watch4);
  ({ id: secondWatchIdOfFirstUser } = watch5);
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

describe("Test findWatchById", () => {
  test("findWatchById finds watch by passed reference", async () => {
    const foundWatch = await findWatchById(firstWatchId);

    expect(foundWatch).toHaveProperty("id", firstWatchId);
    expect(foundWatch).toHaveProperty("reference", firstWatchReference);
    expect(foundWatch).toHaveProperty("userId", userId);
  });
});

describe("Test findWatchByReference", () => {
  test("findWatchByReference finds watch by passed reference", async () => {
    const foundWatch = await findWatchByReference(firstWatchReference);

    expect(foundWatch).toHaveProperty("id", firstWatchId);
    expect(foundWatch).toHaveProperty("reference", firstWatchReference);
    expect(foundWatch).toHaveProperty("userId", userId);
  });
});

describe("Test findAllWatches", () => {
  test("findAllWatches returns first take watches", async () => {
    const foundWatches = await findAllWatches(2, 0);

    expect(foundWatches.length).toEqual(2);
  });

  test("findAllWatches returns correct first watch for first take watches", async () => {
    const foundWatches = await findAllWatches(2, 0);

    expect(foundWatches[0]).toHaveProperty("id", firstWatchId);
  });

  test("findAllWatches returns correct second watch for first take watches", async () => {
    const foundWatches = await findAllWatches(2, 0);

    expect(foundWatches[1]).toHaveProperty("id", secondWatchId);
  });

  test("findAllWatches skips 1 & returns second 2", async () => {
    const foundWatches = await findAllWatches(2, 1);

    expect(foundWatches.length).toEqual(2);
  });

  test("findAllWatches skips 1 & returns correct first watch for first take watches", async () => {
    const foundWatches = await findAllWatches(2, 1);

    expect(foundWatches[0]).toHaveProperty("id", secondWatchId);
  });

  test("findAllWatches skips 1 & returns correct second watch for first take watches", async () => {
    const foundWatches = await findAllWatches(2, 1);

    expect(foundWatches[1]).toHaveProperty("id", thirdWatchId);
  });

  test("findAllWatches returns first take watches after filtering by userId", async () => {
    const foundWatches = await findAllWatches(2, 0, userId);

    expect(foundWatches.length).toEqual(2);
  });

  test("findAllWatches returns correct first watch for first take watches after filtering by courseId", async () => {
    const foundWatches = await findAllWatches(2, 0, userId);

    expect(foundWatches[0]).toHaveProperty("id", firstWatchIdOfFirstUser);
  });

  test("findAllWatches returns correct second watch for first take watches after filtering by courseId", async () => {
    const foundWatches = await findAllWatches(2, 0, userId);

    expect(foundWatches[1]).toHaveProperty("id", secondWatchIdOfFirstUser);
  });
});

describe("Test countAllWatches", () => {
  test("countAllWatches returns correct number of watches", async () => {
    const numberOfWatches = await countAllWatches();

    expect(numberOfWatches).toEqual(3);
  });

  test("countAllWatches returns correct number of filtered watches", async () => {
    const numberOfWatches = await countAllWatches(userId);

    expect(numberOfWatches).toEqual(2);
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

describe("Test updateWatchById", () => {
  test("updateWatchById updates question of watch with passed question", async () => {
    const newName = "insalata salad";

    await updateWatchById(secondWatchId, newName);

    const updatedFlashCard = await prismaClient.watch.findUniqueOrThrow({
      where: {
        id: secondWatchId,
      },
    });

    expect(updatedFlashCard).toHaveProperty("name", "insalata salad");
  });

  test("updateWatchById updates brand of watch with passed brand", async () => {
    const newBrand = "greek salad";

    await updateWatchById(secondWatchId, undefined, newBrand);

    const updatedFlashCard = await prismaClient.watch.findUniqueOrThrow({
      where: {
        id: secondWatchId,
      },
    });

    expect(updatedFlashCard).toHaveProperty("brand", "greek salad");
  });

  test("updateWatchById updates reference of watch with passed reference", async () => {
    const reference = "penne arrabiatta";

    await updateWatchById(secondWatchId, undefined, undefined, reference);

    const updatedFlashCard = await prismaClient.watch.findUniqueOrThrow({
      where: {
        id: secondWatchId,
      },
    });

    expect(updatedFlashCard).toHaveProperty("reference", "penne arrabiatta");
  });
});

describe("Test deleteWatchById", () => {
  test("deleteWatchById deletes watch with passed id", async () => {
    const watchToDeleteId = uuidV4();
    await prismaClient.watch.create({
      data: {
        id: watchToDeleteId,
        name: "dummy name",
        brand: "dummy brand",
        reference: "dummmy reference",
        userId: secondUserId,
      },
    });

    await deleteWatchById(watchToDeleteId);

    const watch = await prismaClient.watch.findUnique({
      where: { id: watchToDeleteId },
    });
    expect(watch).toBeNull();
  });
});
