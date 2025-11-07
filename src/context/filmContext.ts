import { createContext } from "react";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

export type State = { favorites: Movie[] };

export type Action =
  | { type: "ADD_FAVORITE"; payload: Movie }
  | { type: "REMOVE_FAVORITE"; payload: number };

export const initialState: State = { favorites: [] };

export function filmReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (state.favorites.some((f) => f.id === action.payload.id)) return state;
      return { favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return { favorites: state.favorites.filter((f) => f.id !== action.payload) };
    default:
      return state;
  }
}

export const FilmContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

