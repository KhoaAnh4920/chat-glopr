export interface ISingleRes<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata?: any;
}

export interface IListRes<T> {
  success: boolean;
  data: T[];
  total?: number;
  metadata?: any;
}

export interface IEmptyRes {
  success: boolean;
}

export interface IListModels<T> {
  data: T[];
  total: number;
}

export interface ILoadMoreList<T> {
  data: T[];
  loadMore: boolean;
}
