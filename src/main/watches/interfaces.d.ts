export interface CreateWatchBody {
  name: unknown;
  brand: unknown;
  reference: unknown;
}

export interface WatchResponse {
  id: string;
  name: string;
  brand: string;
  reference: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}
