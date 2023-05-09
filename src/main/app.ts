import morgan from "morgan";
import express from "express";

import { appConfig } from "main/utils/environment/AppConfig";

export const app = express();

//
//
// Utility Middleware
//
//

// Logging
app.use(morgan("short", { skip: (_req, _res) => appConfig.env === "test" }));

// Body Parsers
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});
