import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { appConfig } from "main/utils/environment/AppConfig";
import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

export const handleError = (
  err: ExpressError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (appConfig.env === "development") {
    console.log("ERROR: ", err, "\n");
  }

  // Catch Known Errors & Handle Appropriately
  if (err instanceof ExpressError) {
    const { statusCode = 500 } = err;
    if (err.message === undefined || err.message.length === 0) {
      err.message = "Something Went Wrong";
    }
    res.status(statusCode).json({ error: err });
  }

  // If non-ExpressError Occurs in Production, do not expose detailed error
  else if (appConfig.env === "production") {
    res
      .status(500)
      .json({ error: { statusCode: 500, message: "Something Went Wrong" } });
  }

  // Prisma Errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(500).json({
      error: {
        type: "PrismaClientInitializationError",
        statusCode: err.errorCode,
        message: err.message,
      },
    });
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(500).json({
      error: {
        type: "PrismaClientRustPanicError",
        statusCode: "-1",
        message: err.message,
      },
    });
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(500).json({
      error: {
        type: "PrismaClientValidationError",
        statusCode: "-1",
        message: err.message,
      },
    });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(500).json({
      error: {
        type: "PrismaClientKnownRequestError",
        statusCode: err.code,
        message: err.message,
        meta: err.meta,
      },
    });
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).json({
      error: {
        type: "PrismaClientUnknownRequestError",
        statusCode: "-1",
        message: err.message,
      },
    });
  }
  // Unknown Errors
  else {
    res.status(500).json({ error: err });
  }
};
