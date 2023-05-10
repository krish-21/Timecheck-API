import { Router } from "express";
import { catchAsync } from "main/utils/wrappers/catchAsync";

import { createWatchView } from "main/watches/views";

export const watchRouter = Router();

watchRouter.post("/", catchAsync(createWatchView));
