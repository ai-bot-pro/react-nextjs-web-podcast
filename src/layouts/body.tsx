"use client";

import { Inter } from "next/font/google";

import { useTheme } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export function Body({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <body className={inter.className} data-theme={theme}>
      {children}
    </body>
  );
}
