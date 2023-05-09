import dotnev from "dotenv";
import { ExpressError } from "main/utils/errors/ExpressError/ExpressError";

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
      throw new ExpressError(500, "Environmental Variables Error");
    }

    this.env = env["NODE_ENV"];
    this.port = Number(env["PORT"]);
    this.jwtAccessSecret = env["JWT_ACCESS_SECRET"];
    this.jwtRefreshSecret = env["JWT_REFRESH_SECRET"];
  }
}

export const appConfig = new AppConfig(process.env);
