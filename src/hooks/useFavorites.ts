import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import { addFavorite, getFavorites, removeFavorite } from "../service/tmdb/favorites.service";
import { useToast } from "../context/ToastContext";
import { useMovie } from "../context/MovieContext";

type useFavoritesReturn = {
  favorites: Movie[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
  hasMoreFavorites: boolean;
  pageFavorites: number;
  setPageFavorites: (page: number) => void;
  fetchFavorites: () => Promise<void>;
}

export const useFavorites = () : useFavoritesReturn => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const {setLoading} = useMovie();
  const { showToast } = useToast();

  const fetchFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites((prev) => [...prev, ...response.results]);
      setHasMore(response.total_pages > response.page);
      setPage(response.page);
    } catch {
      showToast({ message: 'Erro ao buscar favoritos', type: 'error' });
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isFavorite = (id: number) => favorites?.some((favorite) => favorite.id === id);

  const toggleFavorite = async (movie: Movie) => {
    if (isFavorite(movie.id)) {
      setLoading(true);
      try {
        await removeFavorite(movie.id);
        showToast({ message: 'Filme removido dos favoritos', type: 'success' });
        setFavorites(favorites?.filter((favorite) => favorite.id !== movie.id));
      } catch {
        showToast({ message: 'Erro ao remover filme dos favoritos', type: 'error' });
      }finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await addFavorite(movie.id);
        showToast({ message: 'Filme adicionado aos favoritos', type: 'success' });
        setFavorites((prev) => [...(prev || []), movie]);
      } catch {
        showToast({ message: 'Erro ao adicionar filme aos favoritos', type: 'error' });
      }finally {
        setLoading(false);
      }
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    hasMoreFavorites: hasMore,
    pageFavorites: page,
    setPageFavorites: setPage,
    fetchFavorites
  };
}
