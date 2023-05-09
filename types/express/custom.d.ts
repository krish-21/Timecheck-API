import { CustomJWTPayload } from "main/utils/jwt/interfaces";

export interface Context {
  customJWTPayload: CustomJWTPayload;
}

declare module "express-serve-static-core" {
  interface Request {
    context: Context;
  }
}
