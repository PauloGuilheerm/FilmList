import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { Movie } from '../types/Movie';

const setLoadingSpy = vi.fn();
const showToastSpy = vi.fn();

const getFavoritesMock = vi.fn();
const addFavoriteMock = vi.fn();
const removeFavoriteMock = vi.fn();

vi.mock('../context/MovieContext', () => ({
  useMovie: () => ({ setLoading: setLoadingSpy }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: showToastSpy }),
}));

vi.mock('../service/tmdb/favorites.service', () => ({
  getFavorites: (...args: unknown[]) => getFavoritesMock(...args),
  addFavorite: (...args: unknown[]) => addFavoriteMock(...args),
  removeFavorite: (...args: unknown[]) => removeFavoriteMock(...args),
}));

import { useFavorites } from './useFavorites';

const makeMovie = (id: number, title: string, rating: number): Movie => ({
  id,
  title,
  vote_average: rating,
  adult: false,
  backdrop_path: '',
  genres: [],
  original_language: 'pt-BR',
  original_title: title,
  overview: '',
  popularity: 0,
  poster_path: '',
  release_date: '2020-01-01',
  video: false,
  vote_count: 0,
});

describe('useFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load and sort favorites on mount (title asc by default)', async () => {
    const bravo = makeMovie(2, 'Bravo', 8);
    const alpha = makeMovie(1, 'Alpha', 7);
    const charlie = makeMovie(3, 'Charlie', 7);

    getFavoritesMock.mockImplementation(async (page: number) => {
      if (page === 1) {
        return { page: 1, total_pages: 2, results: [bravo, alpha] };
      }
      return { page: 2, total_pages: 2, results: [charlie, alpha] };
    });

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites.length).toBe(3);
    });

    expect(result.current.favorites.map(m => m.title)).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(setLoadingSpy).toHaveBeenCalled();
    expect(showToastSpy).not.toHaveBeenCalled();
  });

  it('should add a favorite when toggling a non-favorite movie', async () => {
    getFavoritesMock.mockResolvedValue({ page: 1, total_pages: 1, results: [] });
    addFavoriteMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites.length).toBe(0);
    });

    const delta = makeMovie(10, 'Delta', 6);
    await act(async () => {
      await result.current.toggleFavorite(delta);
    });

    expect(addFavoriteMock).toHaveBeenCalledWith(10);
    expect(result.current.isFavorite(10)).toBe(true);
    expect(result.current.favorites.map(m => m.id)).toContain(10);
    expect(showToastSpy).toHaveBeenCalled();
  });

  it('should remove a favorite when toggling an already favorite movie', async () => {
    const echo = makeMovie(20, 'Echo', 5);
    getFavoritesMock.mockResolvedValue({ page: 1, total_pages: 1, results: [echo] });
    removeFavoriteMock.mockResolvedValue(undefined);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.isFavorite(20)).toBe(true);
    });

    await act(async () => {
      await result.current.toggleFavorite(echo);
    });
    expect(removeFavoriteMock).toHaveBeenCalledWith(20);
    expect(result.current.isFavorite(20)).toBe(false);
    expect(result.current.favorites.map(m => m.id)).not.toContain(20);
    expect(showToastSpy).toHaveBeenCalled();
  });

  it('should sort favorites by title and by rating with tie-break on title', async () => {
    const a7 = makeMovie(1, 'Alpha', 7);
    const c7 = makeMovie(3, 'Charlie', 7);
    const b8 = makeMovie(2, 'Bravo', 8);
    getFavoritesMock.mockResolvedValue({ page: 1, total_pages: 1, results: [b8, c7, a7] });

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.favorites.length).toBe(3);
    });

    expect(result.current.favorites.map(m => m.title)).toEqual(['Alpha', 'Bravo', 'Charlie']);

    await act(async () => {
      result.current.sortFavoritesByTitle('desc');
    });
    expect(result.current.favorites.map(m => m.title)).toEqual(['Charlie', 'Bravo', 'Alpha']);

    await act(async () => {
      result.current.sortFavoritesByRating('asc');
    });
    expect(result.current.favorites.map(m => m.title)).toEqual(['Alpha', 'Charlie', 'Bravo']);

    await act(async () => {
      result.current.sortFavoritesByRating('desc');
    });
    expect(result.current.favorites.map(m => m.title)).toEqual(['Bravo', 'Alpha', 'Charlie']);
  });
});


