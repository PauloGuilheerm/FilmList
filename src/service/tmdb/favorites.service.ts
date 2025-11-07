import type { Film } from "../../types/Film";
import type { FilmsResponse } from "../../types/FilmsResponse";
import httpClient from "../HttpClient";

export const getFavorites = async (): Promise<FilmsResponse> => {
    const response = await httpClient.get<FilmsResponse>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite/movies`);
    return response;
}

export const addFavorite = async (id: number) => {
    const response = await httpClient.post<Film>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite`, {
        media_type: 'movie',
        media_id: id,
        favorite: true
    });
    return response;
}
export const removeFavorite = async (id: number) => {
    const response = await httpClient.post<Film>(`/account/${import.meta.env.VITE_ACCOUNT_KEY}/favorite`, {
        media_type: 'movie',
        media_id: id,
        favorite: false
    });
    return response;
}