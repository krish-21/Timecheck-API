import { Router } from "express";

import { catchAsync } from "main/utils/wrappers/catchAsync";

import {
  registerUserView,
  loginUserView,
  refreshUserTokensView,
} from "main/auth/views";

export const authRouter = Router();

authRouter
  .post("/register", catchAsync(registerUserView))
  .post("/login", catchAsync(loginUserView))
  .post("/refresh", catchAsync(refreshUserTokensView));
