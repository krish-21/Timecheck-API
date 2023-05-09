import dotnev from "dotenv";

dotnev.config();

class AppConfig {
  public env: string;
  public port: number;

  constructor(env: NodeJS.ProcessEnv) {
    if (env["NODE_ENV"] === undefined || env["PORT"] === undefined) {
      throw new Error("Environmental Variables Error");
    }

    this.env = env["NODE_ENV"];
    this.port = Number(env["PORT"]);
  }
}

export const appConfig = new AppConfig(process.env);
