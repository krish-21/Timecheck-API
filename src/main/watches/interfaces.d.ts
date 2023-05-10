export interface GetAllWatchesQueryParams {
  take: string;
  skip: string;
  onlyMyWatches: string;
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

export interface GetAllWatchesResponse {
  items: WatchResponse[];
  totalItems: number;
  take: number;
  skip: number;
}

export interface GetWatchRouteParams {
  watchId: string;
}

export interface CreateWatchBody {
  name: unknown;
  brand: unknown;
  reference: unknown;
}

export interface UpdateWatchRouteParams {
  watchId: string;
}

export interface UpdateWatchBody {
  name: unknown;
  brand: unknown;
  reference: unknown;
}

export interface DeleteWatchRouteParams {
  watchId: string;
}
