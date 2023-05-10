import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import {
  findUserByUsername,
  createUserByUsernameAndPassword,
  findUserById,
} from "main/users/dbServices";

const firstUserId = uuidV4(),
  thirdUserId = uuidV4();

const firstUsername = uuidV4(),
  secondUsername = uuidV4(),
  thirdUsername = uuidV4();

afterAll(async () => {
  const deleteFirstUser = prismaClient.user.delete({
    where: {
      id: firstUserId,
    },
  });

  const deleteSecondAndThirdUsers = prismaClient.user.deleteMany({
    where: {
      username: {
        in: [secondUsername, thirdUsername],
      },
    },
  });

  await prismaClient.$transaction([deleteFirstUser, deleteSecondAndThirdUsers]);
});

describe("Test findUserByUsername", () => {
  test("findUserByUsername finds user by passed username", async () => {
    await prismaClient.user.create({
      data: {
        id: firstUserId,
        username: firstUsername,
        password: "tomato",
      },
    });

    const foundUser = await findUserByUsername(firstUsername);

    expect(foundUser).toHaveProperty("id", firstUserId);
    expect(foundUser).toHaveProperty("username", firstUsername);
    expect(foundUser).toHaveProperty("password", "tomato");
    expect(foundUser).toHaveProperty("role", "USER");
  });
});

describe("Test createUserByUsernameAndPassword", () => {
  test("createUserByUsernameAndPassword finds user by passed username", async () => {
    await createUserByUsernameAndPassword(secondUsername, "potatotomato");

    const foundUser = await prismaClient.user.findUnique({
      where: { username: secondUsername },
    });

    expect(foundUser).toHaveProperty("username", secondUsername);
    expect(foundUser).toHaveProperty("password", "potatotomato");
    expect(foundUser).toHaveProperty("role", "USER");
  });
});

describe("Test findUserById", () => {
  test("findUserById finds user by passed id", async () => {
    await prismaClient.user.create({
      data: {
        id: thirdUserId,
        username: thirdUsername,
        password: "tomatopotato",
      },
    });

    const foundUser = await findUserById(thirdUserId);

    expect(foundUser).toHaveProperty("id", thirdUserId);
    expect(foundUser).toHaveProperty("username", thirdUsername);
    expect(foundUser).toHaveProperty("password", "tomatopotato");
    expect(foundUser).toHaveProperty("role", "USER");
  });
});
