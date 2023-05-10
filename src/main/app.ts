import cors from "cors";
import morgan from "morgan";
import express from "express";

import { appConfig } from "main/utils/environment/AppConfig";

import { handleError } from "main/middleware/handleError";
import { isAuthenticated } from "main/middleware/isAuthenticated";

import { authRouter } from "main/auth/routes";

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

// Error handling Middleware
app.use(handleError);
