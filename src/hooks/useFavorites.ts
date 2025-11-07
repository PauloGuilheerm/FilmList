import { useEffect, useState } from "react";
import type { Film } from "../types/Film";
import { addFavorite, getFavorites, removeFavorite } from "../service/tmdb/favorites.service";
import { useToast } from "../context/ToastContext";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Film[] | undefined>([]);

  const { showToast } = useToast();

  const fetchFavorites = async () => {
    try {
      const response = await getFavorites();
      setFavorites(response.results);
    } catch {
      showToast({ message: 'Erro ao buscar favoritos', type: 'error' });
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isFavorite = (id: number) => favorites?.some((favorite) => favorite.id === id);

  const toggleFavorite = async (film: Film) => {
    if (isFavorite(film.id)) {
      try {
        await removeFavorite(film.id);
        showToast({ message: 'Filme removido dos favoritos', type: 'success' });
        setFavorites(favorites?.filter((favorite) => favorite.id !== film.id));
      } catch {
        showToast({ message: 'Erro ao remover filme dos favoritos', type: 'error' });
      }
    } else {
      try {
        await addFavorite(film.id);
        showToast({ message: 'Filme adicionado aos favoritos', type: 'success' });
        setFavorites((prev) => [...(prev || []), film]);
      } catch {
        showToast({ message: 'Erro ao adicionar filme aos favoritos', type: 'error' });
      }
      setFavorites((prev) => [...(prev || []), film]);
    }
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite
  };
}