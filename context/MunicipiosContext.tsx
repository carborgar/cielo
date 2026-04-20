'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
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
  const { isSignedIn, isLoaded } = useAuth();
  const [saved, setSaved] = useState<SavedMunicipio[]>([]);
  const prevSignedIn = useRef<boolean | undefined>(undefined);

  // Load favorites when auth state is known
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Signed in: load from KV, merging any localStorage items
      fetch('/api/favorites')
        .then((r) => r.json())
        .then(async (remote: SavedMunicipio[]) => {
          let local: SavedMunicipio[] = [];
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) local = JSON.parse(raw);
          } catch { /* ignore */ }

          // Merge: remote wins, add any local items not yet in remote
          const merged = [
            ...remote,
            ...local.filter((l) => !remote.find((r) => r.id === l.id)),
          ];

          setSaved(merged);

          // Persist merged list to KV if there were local-only items
          if (local.some((l) => !remote.find((r) => r.id === l.id))) {
            await fetch('/api/favorites', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ municipios: merged }),
            });
            localStorage.removeItem(STORAGE_KEY);
          }
        })
        .catch(() => { /* fallback silently */ });
    } else {
      // Not signed in: load from localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: SavedMunicipio[] = raw ? JSON.parse(raw) : [];
        setSaved(parsed);
      } catch { /* ignore */ }
    }

    prevSignedIn.current = isSignedIn;
  }, [isLoaded, isSignedIn]);

  const persist = async (list: SavedMunicipio[]) => {
    setSaved(list);
    if (isSignedIn) {
      await fetch('/api/favorites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ municipios: list }),
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
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
