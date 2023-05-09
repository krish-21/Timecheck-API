import { v4 as uuidV4 } from "uuid";
import { prismaClient } from "main/utils/db/prismaClient";

import {
  findUserByUsername,
  createUserByUsernameAndPassword,
} from "main/users/dbServices";

const firstUserId = uuidV4();

const firstUsername = uuidV4(),
  secondUsername = uuidV4();

afterAll(async () => {
  const deleteUsers_1 = prismaClient.user.delete({
    where: {
      id: firstUserId,
    },
  });

  const deleteUsers_2 = prismaClient.user.delete({
    where: {
      username: secondUsername,
    },
  });

  await prismaClient.$transaction([deleteUsers_1, deleteUsers_2]);
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
