import cors from "cors";
import morgan from "morgan";
import express from "express";

import { appConfig } from "main/utils/environment/AppConfig";

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
