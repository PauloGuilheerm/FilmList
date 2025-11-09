import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSpinner } from "react-icons/fa";

import type { Movie } from "../../types/Movie";
import Card from "../../components/Card";
import { useFavorites } from "../../hooks/useFavorites";
import { useToast } from "../../context/ToastContext";
import { searchMovies } from "../../service/tmdb/movies.service";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();

  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const shouldShowEmptyState = useMemo(
    () => !isLoading && query.length > 0 && results.length === 0,
    [isLoading, query.length, results.length]
  );

  const fetchResults = useCallback(async (pageToLoad: number, append: boolean) => {
    if (!query) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchMovies(query, pageToLoad);

      setHasMore(response.total_pages > response.page);
      setPage(response.page);

      setResults((prev) => {
        if (!append) {
          return response.results;
        }

        const existingIds = new Set(prev.map((movie) => movie.id));
        const uniques = response.results.filter((movie) => !existingIds.has(movie.id));
        return [...prev, ...uniques];
      });
    } catch {
      showToast({ message: "Erro ao buscar filmes", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [query, showToast]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      navigate('/');
    }
  }, [query]);

  const loadFirstAnSecondPage = async () => {
    try {
      setIsLoading(true);
      const [firstPageResponse, secondPageResponse] = await Promise.all([searchMovies(query, 1), searchMovies(query, 2)]);
      setResults([...firstPageResponse.results, ...secondPageResponse.results]);
      setHasMore(secondPageResponse.total_pages > secondPageResponse.page);
      setPage(2);
    } catch {
      showToast({ message: "Erro ao buscar favoritos", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      loadFirstAnSecondPage();
    }
  }, [query]);

  const loadMoreResults = () => {
    if (isLoading || !hasMore || !query) {
      return;
    }

    void fetchResults(page + 1, true);
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <section className="flex flex-col gap-2 px-6 py-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Resultados para:
          <span
            key={`highlight-${query}`}
            className="text-yellow-400 px-0.5"
          >
            &quot;{query}&quot;
          </span>
        </h1>
        <span className="text-sm text-slate-300">
          Encontrados {results.length} filmes
        </span>
      </section>

      {(isLoading && results.length === 0) ? (
        <div className="flex h-[calc(100vh-180px)] items-center justify-center">
          <FaSpinner size={50} className="text-slate-300 animate-spin" />
          <span className="ms-4 text-xl font-semibold text-slate-200">
            Buscando filmes...
          </span>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={results.length}
          className="flex flex-wrap justify-start ps-4 mt-4 gap-4 overflow-y-auto"
          next={loadMoreResults}
          hasMore={hasMore}
          height={window.innerHeight - 100}
          loader={<div className="flex w-full items-center justify-center py-4">
            <FaSpinner size={40} className="text-slate-300 animate-spin" />
          </div>}
          endMessage={results.length > 0 && (
            <p className="w-full py-4 text-center text-sm text-slate-400">
              Esses são todos os filmes que encontramos para
              <span
                key={`highlight-${query}`}
                className="bg-yellow-400 px-0.5 text-yellow-100"
              >
                &quot;{query}&quot;
              </span>
            </p>
          )}
        >
          {results.map((movie: Movie, index: number) => (
            <Card
              key={`${movie.id}-${movie.title.replaceAll(" ", "-")}`}
              index={index}
              rating={Number.parseInt(movie.vote_average.toFixed(2))}
              title={movie.title}
              posterUrl={movie.backdrop_path ?? ""}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={() => toggleFavorite(movie)}
              onMovieClick={() => handleMovieClick(movie.id)}
              cardAction="favorite"
              highlightTerm={query}
            />
          ))}
        </InfiniteScroll>
      )}

      {shouldShowEmptyState && (
        <section className="flex h-[calc(100vh-220px)] flex-col items-center justify-center gap-3 px-4 text-center">
          <h2 className="text-xl font-semibold text-white">
            Nenhum filme encontrado para
            <span
              key={`highlight-${query}`}
              className="bg-yellow-400 px-0.5 text-yellow-100"
            >
              &quot;{query}&quot;
            </span>
          </h2>
          <p className="max-w-xl text-sm text-slate-300">
            Tente ajustar o termo de busca ou utilize outros filtros.
          </p>
        </section>
      )}
    </>
  );
}