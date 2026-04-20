'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { SavedMunicipio } from '@/types/aemet';

const STORAGE_KEY = 'fancy-aemet-municipios';

interface MunicipiosContextValue {
  saved: SavedMunicipio[];
  add: (m: SavedMunicipio) => void;
  remove: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const MunicipiosContext = createContext<MunicipiosContextValue | null>(null);

export function MunicipiosProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedMunicipio[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = (list: SavedMunicipio[]) => {
    setSaved(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const add = (m: SavedMunicipio) => {
    if (saved.find((s) => s.id === m.id)) return;
    persist([...saved, m]);
  };

  const remove = (id: string) => persist(saved.filter((s) => s.id !== id));

  const isSaved = (id: string) => saved.some((s) => s.id === id);

  return (
    <MunicipiosContext.Provider value={{ saved, add, remove, isSaved }}>
      {children}
    </MunicipiosContext.Provider>
  );
}

export function useMunicipios() {
  const ctx = useContext(MunicipiosContext);
  if (!ctx) throw new Error('useMunicipios must be used inside MunicipiosProvider');
  return ctx;
}

