import Card from '../../components/Card';
import { getMovies } from '../../service/tmdb/movies.service';
import type { Movie } from '../../types/Movie';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFavorites } from '../../hooks/useFavorites';
import { useMovie } from '../../context/MovieContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

export default function Home() {
  const {
    loading, setLoading,
    movies, setMovies,
    page, setPage,
    hasMore, setHasMore
  } = useMovie();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchMovies = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await getMovies(nextPage);
      setMovies((prev) => {
        const ids = new Set(prev.map((movie) => movie.id));
        const uniques = response.results.filter((movie) => !ids.has(movie.id));
        return [...prev, ...uniques];
      });
      setHasMore(response.total_pages > response.page);
      setPage(nextPage);
    } catch {
      showToast({ message: 'Erro ao buscar filmes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onMovieClick = (index: number) => {
    const movie = movies.at(index);
    if (movie) {
      navigate(`/movie/${movie.id}`);
    } else {
      showToast({ message: 'Filme não encontrado', type: 'error' });
    }
  };

  return <InfiniteScroll
    dataLength={movies.length}
    className="flex flex-wrap justify-start ps-4 pt-4 gap-4 overflow-y-auto"
    next={fetchMovies}
    height={window.innerHeight - 100}
    hasMore={hasMore}
    loader={<div className="flex justify-center items-center w-full h-100">
      <FaSpinner size={50} className="text-slate-300 animate-spin" />
    </div>}
    endMessage={<p className="text-slate-400 text-md">Esses são todos os filmes que encontramos</p>}
  >
    {movies.map((movie: Movie, index: number) => (
      <Card
        key={`${movie.id}-${movie.title.replaceAll(' ', '-')}`}
        index={index}
        rating={Number.parseInt(movie.vote_average.toFixed(2))}
        title={movie.title}
        posterUrl={movie.backdrop_path ?? ''}
        isFavorite={isFavorite(movie.id)}
        onToggleFavorite={() => toggleFavorite(movie)}
        onMovieClick={onMovieClick}
        cardAction="favorite"
      />
    ))}
  </InfiniteScroll>;
}
