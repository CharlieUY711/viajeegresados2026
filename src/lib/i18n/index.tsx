"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { es } from "./es";
import type { Translations } from "./es";

interface LangContextValue {
  t: Translations;
}

const LangContext = createContext<LangContextValue>({ t: es });

export function LangProvider({ children }: { children: ReactNode }) {
  return (
    <LangContext.Provider value={{ t: es }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
