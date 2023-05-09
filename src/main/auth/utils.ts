import {
  MINIMUM_USERNAME_LENGTH,
  MINIMUM_PASSWORD_LENGTH,
  MAXIMUM_USERNAME_LENGTH,
  MAXIMUM_PASSWORD_LENGTH,
} from "main/auth/constants";

import { InvalidDataError } from "main/utils/errors/InvalidDataError/InvalidDataError";

export const validateAuthBody = (
  usernameValue?: unknown,
  passwordValue?: unknown
): {
  username: string;
  password: string;
} => {
  if (
    typeof usernameValue !== "string" ||
    usernameValue.length < MINIMUM_USERNAME_LENGTH ||
    usernameValue.length > MAXIMUM_USERNAME_LENGTH
  ) {
    throw new InvalidDataError("Username");
  }

  if (
    typeof passwordValue !== "string" ||
    passwordValue.length < MINIMUM_PASSWORD_LENGTH ||
    passwordValue.length > MAXIMUM_PASSWORD_LENGTH ||
    passwordValue.search(/[a-z]/) < 0 ||
    passwordValue.search(/[A-Z]/) < 0 ||
    passwordValue.search(/[0-9]/) < 0 ||
    passwordValue.search(/[!@#$%^&*-]/) < 0
  ) {
    throw new InvalidDataError("Password");
  }

  return {
    username: usernameValue,
    password: passwordValue,
  };
};
