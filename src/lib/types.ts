export type Novel = {
  id: string;
  slug: string;
  title: string;
  author: string;
  summary: string;
  coverPath: string;
  readingMinutes: number;
  createdAt?: string;
};

export type Scene = {
  id: number;
  position: number;
  title: string;
  body: string;
};

export type ApiResult<T> = {
  configured: boolean;
  data: T | null;
  error: string | null;
  status?: number;
};
