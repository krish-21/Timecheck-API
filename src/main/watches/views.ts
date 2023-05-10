import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  GetAllWatchesQueryParams,
  GetAllWatchesResponse,
  CreateWatchBody,
  WatchResponse,
} from "main/watches/interfaces";

import { getAllWatchesBridge, createWatchBridge } from "main/watches/bridges";

export const getAllWatchesView = async (
  req: Request<object, object, object, GetAllWatchesQueryParams>,
  res: Response<GetAllWatchesResponse>
): Promise<void> => {
  const allWatches = await getAllWatchesBridge(
    req.context.customJWTPayload.userId,
    req.query.take,
    req.query.skip,
    req.query.onlyMyWatches
  );

  res.status(StatusCodes.OK).json(allWatches);
};

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
