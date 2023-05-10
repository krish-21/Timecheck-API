import { Router } from "express";
import { catchAsync } from "main/utils/wrappers/catchAsync";

import {
  getAllWatchesView,
  getWatchView,
  createWatchView,
  updateWatchView,
  deleteWatchView,
} from "main/watches/views";

export const watchRouter = Router();

watchRouter
  .get("/", catchAsync(getAllWatchesView))
  .post("/", catchAsync(createWatchView))
  .get("/:watchId", catchAsync(getWatchView))
  .patch("/:watchId", catchAsync(updateWatchView))
  .delete("/:watchId", catchAsync(deleteWatchView));
