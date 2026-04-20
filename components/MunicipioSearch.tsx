'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { useMunicipios } from '@/context/MunicipiosContext';
import type { SavedMunicipio } from '@/types/aemet';

// Map province codes (first 2 digits of municipio id) to province names
const PROVINCIAS: Record<string, string> = {
  '01':'Álava','02':'Albacete','03':'Alicante','04':'Almería','05':'Ávila',
  '06':'Badajoz','07':'Baleares','08':'Barcelona','09':'Burgos','10':'Cáceres',
  '11':'Cádiz','12':'Castellón','13':'Ciudad Real','14':'Córdoba','15':'A Coruña',
  '16':'Cuenca','17':'Girona','18':'Granada','19':'Guadalajara','20':'Gipuzkoa',
  '21':'Huelva','22':'Huesca','23':'Jaén','24':'León','25':'Lleida',
  '26':'La Rioja','27':'Lugo','28':'Madrid','29':'Málaga','30':'Murcia',
  '31':'Navarra','32':'Ourense','33':'Asturias','34':'Palencia','35':'Las Palmas',
  '36':'Pontevedra','37':'Salamanca','38':'S.C. Tenerife','39':'Cantabria',
  '40':'Segovia','41':'Sevilla','42':'Soria','43':'Tarragona','44':'Teruel',
  '45':'Toledo','46':'Valencia','47':'Valladolid','48':'Bizkaia','49':'Zamora',
  '50':'Zaragoza','51':'Ceuta','52':'Melilla',
};

interface RawMunicipio {
  id: string;    // "id28079"
  nombre: string;
  capital?: string;
}

function extractCod(id: string) {
  return id.replace(/^id/, '');  // "id28079" → "28079"
}

function getProvincia(id: string) {
  const cod = extractCod(id);
  return PROVINCIAS[cod.slice(0, 2)] ?? '';
}

export function MunicipioSearch() {
  const { add, isSaved } = useMunicipios();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RawMunicipio[]>([]);
  const [all, setAll] = useState<RawMunicipio[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load all municipios once
  useEffect(() => {
    if (all.length > 0) return;
    setLoading(true);
    fetch('/api/aemet/municipios')
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          setAll(data as RawMunicipio[]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [all.length]);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const filtered = all
      .filter((m) => {
        const n = (m.nombre ?? m.capital ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return n.includes(q);
      })
      .slice(0, 8);
    setResults(filtered);
    setOpen(filtered.length > 0);
  }, [query, all]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAdd = (m: RawMunicipio) => {
    const saved: SavedMunicipio = {
      id: extractCod(m.id),
      nombre: m.nombre ?? m.capital ?? m.id,
      provincia: getProvincia(m.id),
    };
    add(saved);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow px-4 py-3 border border-slate-200 dark:border-slate-700">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={loading ? 'Cargando municipios…' : 'Buscar municipio…'}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
        />
      </div>
      {open && (
        <ul className="absolute z-40 mt-1 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {results.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => handleAdd(m)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
              >
                <span>
                  <span className="font-medium">{m.nombre ?? m.capital}</span>
                  <span className="ml-2 text-slate-400 text-xs">{getProvincia(m.id)}</span>
                </span>
                {isSaved(extractCod(m.id))
                  ? <Check size={16} className="text-green-500" />
                  : <Plus size={16} className="text-sky-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
