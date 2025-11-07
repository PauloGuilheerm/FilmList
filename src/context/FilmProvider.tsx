import { useReducer, useMemo } from "react";
import type { ReactNode } from "react";
import {
  FilmContext,
  initialState,
  filmReducer,
} from "./filmContext";

export default function FilmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filmReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <FilmContext.Provider value={contextValue}>
      {children}
    </FilmContext.Provider>
  );
}

