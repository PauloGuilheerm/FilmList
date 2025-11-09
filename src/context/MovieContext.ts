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
  favorites: Movie[];
  setFavorites: Dispatch<SetStateAction<Movie[]>>;
  favoriteIds: Set<number>;
  setFavoriteIds: Dispatch<SetStateAction<Set<number>>>;
}>({
  loading: false,
  setLoading: () => { },
  movies: [],
  setMovies: () => { },
  page: 1,
  setPage: () => { },
  hasMore: true,
  setHasMore: () => { },
  favorites: [],
  setFavorites: () => { },
  favoriteIds: new Set(),
  setFavoriteIds: () => { }
});

export const useMovie = () => useContext(MovieContext);

