import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FilmContext } from "./FilmContextt";
import type { Film } from "../types/Film";
import { getFilms } from "../service/tmdb/films.service";

export default function FilmProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState<Film[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadFirstAndSecondPages = async () => {
    setLoading(true);
    const [firstPageResponse, secondPageResponse] = await Promise.all([getFilms(1), getFilms(2)]);
    setFilms([...firstPageResponse.results, ...secondPageResponse.results]);
    setPage(2);
    setHasMore(secondPageResponse.total_pages > secondPageResponse.page);
    setLoading(false);
  };

  useEffect(() => {
    loadFirstAndSecondPages();
  }, []);

  const contextValue = useMemo(() => ({
    loading,
    setLoading,
    films,
    setFilms,
    page,
    setPage,
    hasMore,
    setHasMore
  }), [loading, films, page, hasMore]);

  return (
    <FilmContext.Provider value={contextValue}>
      {children}
    </FilmContext.Provider>
  );
}

