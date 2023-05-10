import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CreateWatchBody, WatchResponse } from "main/watches/interfaces";

import { createWatchBridge } from "main/watches/bridges";

export const createWatchView = async (
  req: Request<object, object, CreateWatchBody, object>,
  res: Response<WatchResponse>
): Promise<void> => {
  const createdWatch = await createWatchBridge(
    req.context.customJWTPayload.userId,
    req.body.name,
    req.body.brand,
    req.body.reference
  );

  res.status(StatusCodes.CREATED).json(createdWatch);
};
