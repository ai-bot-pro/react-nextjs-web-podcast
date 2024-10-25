"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { ContextProviderProps, ContextProviderValue } from "@/types/context";
import { cacheGet } from "@/utils/local-cache";

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContext = createContext({} as ContextProviderValue);

export const ThemeContextProvider = ({ children }: ContextProviderProps) => {
  const [theme, setTheme] = useState("light");
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
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAudio must be used within an ThemeContextProvider");
  }
  return context;
}
