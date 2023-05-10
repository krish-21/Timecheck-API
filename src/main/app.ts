import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import { rateLimit } from "express-rate-limit";

import { appConfig } from "main/utils/environment/AppConfig";
import { MINUTES, SECONDS, MILLISECONDS } from "main/utils/time";

import { handleError } from "main/middleware/handleError";
import { isAuthenticated } from "main/middleware/isAuthenticated";
import { handleUnmatchedPaths } from "main/middleware/handleUnmatchedPaths";

import { authRouter } from "main/auth/routes";
import { watchRouter } from "main/watches/routes";

export const app = express();

//
//
// Security
//
//

app.disable("x-powered-by");

const limiter = rateLimit({
  windowMs: MINUTES.FIFTEEN * SECONDS.MINUTE * MILLISECONDS.SECOND,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(helmet());
app.use(cors());

//
//
// Utility Middleware
//
//

// Logging
app.use(morgan("short", { skip: () => appConfig.env === "test" }));

// Body Parsers
app.use(express.json());

//
//
// Routes
//
//

// Auth
app.use("/auth", authRouter);

// Auth Wall
app.use(isAuthenticated);

app.use("/watches", watchRouter);

// Handle all other unmatched routes
app.all("*", handleUnmatchedPaths);

// Error handling Middleware
app.use(handleError);
