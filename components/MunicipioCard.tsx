'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useForecast } from '@/hooks/useForecast';
import { SkyIcon, skyLabel } from '@/components/SkyIcon';
import { useMunicipios } from '@/context/MunicipiosContext';
import type { SavedMunicipio } from '@/types/aemet';
import clsx from 'clsx';

export function MunicipioCard({ m }: { m: SavedMunicipio }) {
  const { remove } = useMunicipios();
  const { data, loading } = useForecast<{ prediccion: { dia: unknown[] } }[]>(
    `/api/aemet/forecast/diaria/${m.id}`
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hoy = (data?.[0]?.prediccion?.dia as any[])?.[0];
  const skyCode = hoy?.estadoCielo?.find((e: { value?: string }) => e.value)?.value ?? '';
  const skyDesc = hoy?.estadoCielo?.find((e: { value?: string }) => e.value)?.descripcion ?? '';

  return (
    <Link
      href={`/municipio/${m.id}`}
      className={clsx(
        'block relative rounded-3xl p-5 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]',
        'bg-linear-to-br from-sky-400 to-blue-600 dark:from-sky-700 dark:to-blue-900 text-white'
      )}
    >
      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); remove(m.id); }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
        aria-label="Eliminar"
      >
        <Trash2 size={14} />
      </button>

      <p className="text-xs font-medium text-white/70 mb-0.5">{m.provincia}</p>
      <h2 className="text-2xl font-bold">{m.nombre}</h2>

      {loading && <div className="mt-3 h-8 w-32 rounded-xl bg-white/20 animate-pulse" />}

      {skyCode && hoy && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SkyIcon code={skyCode} size={40} className="opacity-90" />
            <span className="text-sm text-white/80">{skyLabel(skyCode, skyDesc)}</span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{hoy.temperatura?.maxima}°</p>
            <p className="text-sm text-white/70">{hoy.temperatura?.minima}° mín</p>
          </div>
        </div>
      )}
    </Link>
  );
}


