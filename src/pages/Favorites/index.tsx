import { useCallback, useEffect, useState } from "react";
import { useFavorites, type SortConfig } from "../../hooks/useFavorites";
import type { Movie } from "../../types/Movie";
import Card from "../../components/Card";
import FavoritesHeader, { type FavoritesSortOption } from "./Header";
import { useMovie } from "../../context/MovieContext";
import { FaSpinner, FaTrash } from "react-icons/fa";
import EmptyFavorites from "./Empty";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const getSelectedDefaultSortByTitle = (currentSort: SortConfig) => currentSort?.direction === "asc" ? "title-asc" : "title-desc";

const getSelectedDefaultSortByRating = (currentSort: SortConfig | null) => currentSort?.direction === "desc" ? "rating-desc" : "rating-asc";

export default function Favorites() {
  const {
    favorites,
    toggleFavorite,
    sortFavoritesByTitle,
    sortFavoritesByRating,
    currentSort
  } = useFavorites();
  const { loading } = useMovie();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedSort, setSelectedSort] = useState<FavoritesSortOption>(
    currentSort?.key === "title" ?
      getSelectedDefaultSortByTitle(currentSort) :
      getSelectedDefaultSortByRating(currentSort)
  );

  useEffect(() => {
    if (currentSort?.key === "title") {
      setSelectedSort(currentSort.direction === "asc" ? "title-asc" : "title-desc");
    } else if (currentSort?.key === "rating") {
      setSelectedSort(currentSort.direction === "desc" ? "rating-desc" : "rating-asc");
    }
  }, [currentSort]);

  useEffect(() => {
    switch (selectedSort) {
      case "title-asc":
        sortFavoritesByTitle("asc");
        break;
      case "title-desc":
        sortFavoritesByTitle("desc");
        break;
      case "rating-desc":
        sortFavoritesByRating("desc");
        break;
      case "rating-asc":
        sortFavoritesByRating("asc");
        break;
      default:
        break;
    }
  }, [selectedSort]);

  const handleSortChange = (value: FavoritesSortOption) => {
    setSelectedSort(value);
  };

  const onMovieClick = (index: number) => {
    const movie = favorites.at(index);
    if (movie) {
      navigate(`/movie/${movie.id}`);
    } else {
      showToast({ message: 'Filme não encontrado', type: 'error' });
    }
  };

  const CardAction = useCallback((handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void): React.ReactNode => {
    return <button
      type="button"
      aria-label={"deletar dos favoritos"}
      onClick={handleClick}
      className="
        absolute right-2 top-2 z-20 inline-grid h-7 w-7 place-items-center rounded-full bg-black/80 backdrop-blur-sm ring-1 ring-white/20 transition
        hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 cursor-pointer"
    >
      <FaTrash color="white" size={10} />
    </button>
  }, [])

  return (
    <>
      <FavoritesHeader onSortChange={handleSortChange} selectedSort={selectedSort} />
      <div
        className="flex flex-wrap justify-start ps-4 pt-4 gap-4 overflow-y-auto "
        style={{ height: window.innerHeight - 250 }}
      >
        {favorites.map((movie: Movie, index: number) => (
          <Card
            key={`${movie.id}-${movie.title.replaceAll(' ', '-')}`}
            index={index}
            rating={Number.parseInt(movie.vote_average.toFixed(2))}
            title={movie.title}
            posterUrl={movie.poster_path ?? ''}
            onToggleFavorite={() => toggleFavorite(movie)}
            onMovieClick={onMovieClick}
            CardAction={({ handleClick }) => CardAction(handleClick)}
          />
        ))}
        {loading && <div className="flex justify-center items-center w-full h-100">
          <FaSpinner size={50} className="text-slate-300 animate-spin" />
        </div>}
      </div>
      {(!loading && favorites.length === 0) && <EmptyFavorites />}
    </>
  );
}