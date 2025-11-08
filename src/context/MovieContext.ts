import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Movie } from "../types/Movie";

export const MovieContext = createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
  movies: Movie[];
  setMovies: Dispatch<SetStateAction<Movie[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
}>({
  loading: false,
  setLoading: () => { },
  movies: [],
  setMovies: () => { },
  page: 1,
  setPage: () => { },
  hasMore: true,
  setHasMore: () => { }
});

export const useMovie = () => useContext(MovieContext);

