import { Router } from "express";

import { catchAsync } from "main/utils/wrappers/catchAsync";

import { registerUserView } from "main/auth/views";

export const authRouter = Router();

authRouter.post("/register", catchAsync(registerUserView));
