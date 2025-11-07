import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Film } from "../types/Film";

export const FilmContext = createContext<{
    loading: boolean;
    setLoading: (loading: boolean) => void;
    films: Film[];
    setFilms: Dispatch<SetStateAction<Film[]>>;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    hasMore: boolean;
    setHasMore: (hasMore: boolean) => void;
  }>({
    loading: false,
    setLoading: () => {},
    films: [],
    setFilms: () => {},
    page: 1,
    setPage: () => {},
    hasMore: true,
    setHasMore: () => {}
  });

export const useFilm = () => useContext(FilmContext);

