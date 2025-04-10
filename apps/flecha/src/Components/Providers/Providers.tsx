'use client'
import { ThemeProvider, themes } from "@meu-workspace/safira";
import { SWRConfig } from "swr";

const theme: keyof typeof themes = process.env.THEME as keyof typeof themes || 'flecha';

export const Providers = ({ children }: { children: React.ReactNode }) => {

  return (
    <ThemeProvider theme={themes[theme]}>
      <SWRConfig value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}>
        {children}
      </SWRConfig>
    </ThemeProvider>
  );
}