import { GeneratedTokens } from "main/utils/jwt/interfaces";

export interface AuthRequestBody {
  username: unknown;
  password: unknown;
}

export interface RefreshRequestBody {
  refreshToken: unknown;
}

export interface AuthResponse {
  userId: string;
  tokens: GeneratedTokens;
}

export interface LogoutUserResponse {
  message: string;
}
