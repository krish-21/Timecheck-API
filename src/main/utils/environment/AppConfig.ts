import dotnev from "dotenv";

import { EnvironmentVariableError } from "main/utils/errors/EnvironmentVariableError/EnvironmentVariableError";

dotnev.config();

class AppConfig {
  public env: string;
  public port: number;
  public jwtAccessSecret: string;
  public jwtRefreshSecret: string;

  constructor(env: NodeJS.ProcessEnv) {
    if (
      env["NODE_ENV"] === undefined ||
      env["PORT"] === undefined ||
      env["JWT_ACCESS_SECRET"] === undefined ||
      env["JWT_REFRESH_SECRET"] === undefined
    ) {
      throw new EnvironmentVariableError();
    }

    this.env = env["NODE_ENV"];
    this.port = Number(env["PORT"]);
    this.jwtAccessSecret = env["JWT_ACCESS_SECRET"];
    this.jwtRefreshSecret = env["JWT_REFRESH_SECRET"];
  }
}

export const appConfig = new AppConfig(process.env);
