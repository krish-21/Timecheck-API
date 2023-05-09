import { Router } from "express";

import { catchAsync } from "main/utils/wrappers/catchAsync";

import {
  registerUserView,
  loginUserView,
  refreshUserTokensView,
  logoutUserView,
} from "main/auth/views";

import { isAuthenticated } from "main/middleware/isAuthenticated";

export const authRouter = Router();

authRouter
  .post("/register", catchAsync(registerUserView))
  .post("/login", catchAsync(loginUserView))
  .post("/refresh", catchAsync(refreshUserTokensView))
  .post("/logout", isAuthenticated, catchAsync(logoutUserView));
