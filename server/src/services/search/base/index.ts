export type SearchQueryOptions<T> = {
  page?: number;
  limit?: number;
  fields?: (keyof T)[];
};

export type SearchQueryResult<T> = {
  next: boolean;
  count: number;
  data: T[];
};

export abstract class BaseSearchQuery<
  T,
  TOptions extends SearchQueryOptions<T>
> {
  constructor(protected options_: TOptions) {}

  abstract exec(): Promise<SearchQueryResult<T>>;
}
