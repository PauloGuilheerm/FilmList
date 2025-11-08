import InfiniteScroll from "react-infinite-scroll-component";
import { useFavorites } from "../../hooks/useFavorites";
import { FaSpinner } from "react-icons/fa";
import type { Movie } from "../../types/Movie";
import Card from "../../components/Card";
import FavoritesHeader from "./Header";

export default function Favorites() {
  const { favorites, fetchFavorites, hasMoreFavorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      <FavoritesHeader />
      <InfiniteScroll
        dataLength={favorites.length}
        className="flex flex-wrap justify-start ps-4 pt-4 gap-4 h-[calc(100vh-100px)] overflow-y-auto"
        next={fetchFavorites}
        hasMore={hasMoreFavorites}
        height={window.innerHeight - 100}
        loader={<div className="flex justify-center items-center w-full h-100">
          <FaSpinner size={50} className="text-slate-300 animate-spin" />
        </div>}
      >
        {favorites.map((movie: Movie, index: number) => (
          <Card
            key={`${movie.id}-${movie.title.replaceAll(' ', '-')}`}
            index={index}
            rating={Number.parseInt(movie.vote_average.toFixed(2))}
            title={movie.title}
            posterUrl={movie.backdrop_path ?? ''}
            isFavorite={isFavorite(movie.id)}
            onToggleFavorite={() => toggleFavorite(movie)}
            onMovieClick={() => toggleFavorite(movie)}
            cardAction="delete"
          />
        ))}
      </InfiniteScroll>
    </>
  );
}