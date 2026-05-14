type PaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
};

export type MovieItem = {
  id: number;
  original_title: string;
  poster_path?: string;
  overview?: string;
};

type MoviesType = PaginatedResponse<MovieItem>;
export default MoviesType;
