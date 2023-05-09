export interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CustomJWTPayload {
  userId: string;
  tokenUUID: string;
}
