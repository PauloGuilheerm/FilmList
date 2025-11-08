import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MovieContext } from "./MovieContext";
import type { Movie } from "../types/Movie";
import { getMovies } from "../service/tmdb/movies.service";

export default function MovieProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialPages = async () => {
    setLoading(true);
    const [firstPageResponse, secondPageResponse] = await Promise.all([getMovies(1), getMovies(2)]);
    setMovies([...firstPageResponse.results, ...secondPageResponse.results]);
    setPage(2);
    setHasMore(secondPageResponse.total_pages > secondPageResponse.page);
    setLoading(false);
  };

  useEffect(() => {
    loadInitialPages();
  }, []);

  const contextValue = useMemo(() => ({
    loading,
    setLoading,
    movies,
    setMovies,
    page,
    setPage,
    hasMore,
    setHasMore
  }), [loading, movies, page, hasMore]);

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
}

