import { useLayoutEffect, useState } from 'react';
import Card from '../../components/Card'
import { getFilms } from '../../service/tmdb/films.service';
import type { Film } from '../../types/Film';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchFilms = async () => {
    const response = await getFilms(page);
    setFilms((prev) => [...prev, ...response.results]);
    setHasMore(response.total_pages > page);
    setPage((prev) => prev + 1);
  }

  useLayoutEffect(() => {
    fetchFilms();
  }, []);

  return <InfiniteScroll
      dataLength={films.length}
      className="flex flex-wrap justify-start ps-4 pt-4 gap-4"
      next={fetchFilms}
      hasMore={hasMore}
      loader={<p>Carregando...</p>}
      endMessage={<p className="text-slate-400">Acabou 🙂</p>}
    >
      {films.map((film: Film) => (
        <Card
          key={film.id}
          rating={film.vote_average.toFixed(2)}
          title={film.title}
          posterUrl={film.backdrop_path ?? ''}
        />
      ))}
    </InfiniteScroll>
}