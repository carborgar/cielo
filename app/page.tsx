'use client';

import { MunicipioSearch } from '@/components/MunicipioSearch';
import { MunicipioCard } from '@/components/MunicipioCard';
import { useMunicipios } from '@/context/MunicipiosContext';
import { MapPin } from 'lucide-react';

export default function HomePage() {
  const { saved } = useMunicipios();

  return (
    <div className="space-y-6">
      <MunicipioSearch />

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
          <MapPin size={48} strokeWidth={1} />
          <p className="text-center text-sm">
            Busca un municipio y añádelo para ver su previsión.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {saved.map((m) => (
            <MunicipioCard key={m.id} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
