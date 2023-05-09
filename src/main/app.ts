import morgan from "morgan";
import express from "express";

import { appConfig } from "main/utils/environment/AppConfig";

import { authRouter } from "main/auth/routes";

export const app = express();

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
