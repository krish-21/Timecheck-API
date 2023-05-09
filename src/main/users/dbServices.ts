import type { User } from "@prisma/client";

import { prismaClient } from "main/utils/db/prismaClient";

export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  return prismaClient.user.findUnique({
    where: {
      username,
    },
  });
};

export const createUserByUsernameAndPassword = async (
  username: string,
  hashedPassword: string
): Promise<User> => {
  return prismaClient.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prismaClient.user.findUnique({
    where: {
      id,
    },
  });
};
