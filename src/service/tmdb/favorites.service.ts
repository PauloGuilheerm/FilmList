import type { Movie } from "../../types/Movie";
import type { MoviesResponse } from "../../types/MoviesResponse";
import httpClient from "../HttpClient";

export const getFavorites = async (): Promise<MoviesResponse> => {
    const response = await httpClient.get<MoviesResponse>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite/movies`);
    return response;
}

export const addFavorite = async (id: number) => {
    const response = await httpClient.post<Movie>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite`, {
        media_type: 'movie',
        media_id: id,
        favorite: true
    });
    return response;
}
export const removeFavorite = async (id: number) => {
    const response = await httpClient.post<Movie>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite`, {
        media_type: 'movie',
        media_id: id,
        favorite: false
    });
    return response;
}