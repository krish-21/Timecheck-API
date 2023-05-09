export interface AuthRequestBody {
  username: unknown;
  password: unknown;
}

export interface RefreshRequestBody {
  refreshToken: unknown;
}

export interface LogoutUserResponse {
  message: string;
}
