"use client";

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { createContext, useContext, useEffect, useState } from "react";
import { cacheGet, cacheSet } from "@/utils/local_cache";

export const useAppContext = () => useContext(AppContext);

export const AppContext = createContext({} as ContextProviderValue);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [theme, setTheme] = useState("light");
  const [isSiderOpen, setIsSiderOpen] = useState(false);

  useEffect(() => {
    const themeInCache = cacheGet("THEME");
    if (themeInCache && ["dark", "light"].includes(themeInCache)) {
      setTheme(themeInCache);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = () => {
      setTheme(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isSiderOpen,
        setIsSiderOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
