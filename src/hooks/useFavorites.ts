import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import { addFavorite, getFavorites, removeFavorite } from "../service/tmdb/favorites.service";
import { useToast } from "../context/ToastContext";
import { useMovie } from "../context/MovieContext";

export type SortDirection = "asc" | "desc";
export type SortKey = "title" | "rating";

export type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};

type useFavoritesReturn = {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
  sortFavoritesByTitle: (direction: SortDirection) => void;
  sortFavoritesByRating: (direction: SortDirection) => void;
  currentSort: SortConfig | null;
}

const defaultSortConfig: SortConfig = {
  key: "title",
  direction: "asc"
};

export const useFavorites = (): useFavoritesReturn => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);

  const { setLoading } = useMovie();
  const { showToast } = useToast();

  const sortMovies = useCallback((movies: Movie[], config: SortConfig | null = sortConfig) => {
    const base = [...movies];

    if (!config) {
      return base;
    }

    base.sort((a, b) => {
      if (config.key === "title") {
        return config.direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      const diff = (a.vote_average ?? 0) - (b.vote_average ?? 0);

      if (diff === 0) {
        return a.title.localeCompare(b.title);
      }

      return config.direction === "asc" ? diff : -diff;
    });

    return base;
  }, [sortConfig]);

  const loadAllFavorites = useCallback(async () => {
    try {
      setLoading(true);

      const firstPage = await getFavorites(1);
      const ids = new Set<number>();
      const aggregated: Movie[] = [];

      const push = (movies: Movie[]) => {
        for (const movie of movies) {
          if (!ids.has(movie.id)) {
            ids.add(movie.id);
            aggregated.push(movie);
          }
        }
      };

      push(firstPage.results);

      if (firstPage.total_pages > 1) {
        const remainingResponses = await Promise.all(
          Array.from({ length: firstPage.total_pages - 1 }, (_, index) =>
            getFavorites(index + 2)
          )
        );

        for (const response of remainingResponses) {
          push(response.results);
        }
      }

      setFavorites(sortMovies(aggregated));
      setFavoriteIds(ids);
    } catch {
      showToast({ message: 'Erro ao buscar favoritos', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (favorites.length === 0) {
      loadAllFavorites();
    }
  }, []);

  const isFavorite = (id: number) => favoriteIds.has(id);

  const toggleFavorite = async (movie: Movie) => {
    if (isFavorite(movie.id)) {
      setLoading(true);
      try {
        await removeFavorite(movie.id);
        showToast({ message: 'Filme removido dos favoritos', type: 'success' });
        setFavorites((prev) => {
          const updated = prev.filter((favorite) => favorite.id !== movie.id);
          return sortMovies(updated);
        });
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(movie.id);
          return next;
        });
      } catch {
        showToast({ message: 'Erro ao remover filme dos favoritos', type: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await addFavorite(movie.id);
        showToast({ message: 'Filme adicionado aos favoritos', type: 'success' });
        setFavorites((prev) => {
          return sortMovies([...(prev || []), movie]);
        });
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(movie.id);
          return next;
        });
      } catch {
        showToast({ message: 'Erro ao adicionar filme aos favoritos', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  }

  const sortFavoritesByTitle = useCallback((direction: SortDirection) => {
    const config: SortConfig = { key: "title", direction };
    setSortConfig(config);
    setFavorites((prev) => sortMovies(prev, config));
  }, [sortMovies]);

  const sortFavoritesByRating = useCallback((direction: SortDirection) => {
    const config: SortConfig = { key: "rating", direction };
    setSortConfig(config);
    setFavorites((prev) => sortMovies(prev, config));
  }, [sortMovies]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    sortFavoritesByTitle,
    sortFavoritesByRating,
    currentSort: sortConfig
  };
}
