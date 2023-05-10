import { Router } from "express";
import { catchAsync } from "main/utils/wrappers/catchAsync";

import {
  getAllWatchesView,
  createWatchView,
  updateWatchView,
  deleteWatchView,
} from "main/watches/views";

export const watchRouter = Router();

watchRouter
  .get("/", catchAsync(getAllWatchesView))
  .post("/", catchAsync(createWatchView))
  .patch("/:watchId", catchAsync(updateWatchView))
  .delete("/:watchId", catchAsync(deleteWatchView));
