import Card from '../../components/Card'
import { getFilms } from '../../service/tmdb/films.service';
import type { Film } from '../../types/Film';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFavorites } from '../../hooks/useFavorites';
import { useFilm } from '../../context/FilmContextt';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { CgSpinner } from 'react-icons/cg';

export default function Home() {
  const {
    loading, setLoading,
    films, setFilms,
    page, setPage,
    hasMore, setHasMore
  } = useFilm();

  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchFilms = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await getFilms(page);
      setFilms((prev) => {
        const ids = new Set(prev.map(f => f.id));
        const uniques = response.results.filter(f => !ids.has(f.id));
        return [...prev, ...uniques];
      });
      setHasMore(response.total_pages > response.page);
      setPage(response.page);
    } catch {
      showToast({ message: 'Erro ao buscar filmes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onFilmClick = (index: number) => {
    const film = films.at(index);
    if (film) {
      navigate(`/movie/${film.id}`);
    } else {
      showToast({ message: 'Filme não encontrado', type: 'error' });
    }
  };

  return <InfiniteScroll
    dataLength={films.length}
    className="flex flex-wrap justify-start ps-4 pt-4 gap-4"
    next={fetchFilms}
    hasMore={hasMore}
    loader={<div className="flex justify-center items-center w-full h-100">
      <CgSpinner size="50" color="white"/>
    </div>}
    endMessage={<p className="text-slate-400">Esses são todos os filmes que encontramos</p>}
  >
    {films.map((film: Film, index: number) => (
      <Card
        key={`${film.id}-${film.title.replaceAll(' ', '-')}`}
        index={index}
        rating={film.vote_average.toFixed(2)}
        title={film.title}
        posterUrl={film.backdrop_path ?? ''}
        isFavorite={isFavorite(film.id)}
        onToggleFavorite={() => toggleFavorite(film)}
        onFilmClick={onFilmClick}
      />
    ))}
  </InfiniteScroll>
}