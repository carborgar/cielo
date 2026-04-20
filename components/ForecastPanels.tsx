'use client';

import { useState } from 'react';
import { useForecast } from '@/hooks/useForecast';
import { formatDate, windDirArrow } from '@/lib/weather';
import { SkyIcon, skyLabel } from '@/components/SkyIcon';
import { Droplets, Wind, Umbrella, Snowflake, Zap } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPeriodValue(arr: any[], periodo?: string) {
  if (!arr?.length) return null;
  if (periodo) return arr.find((x: { periodo?: string }) => x.periodo === periodo)?.value;
  return arr[0]?.value;
}

export function DailyForecastPanel({ cod }: { cod: string }) {
  const { data, loading, error } = useForecast<{ prediccion: { dia: unknown[] } }[]>(
    `/api/aemet/forecast/diaria/${cod}`
  );

  if (loading) return <ForecastSkeleton rows={7} />;
  if (error || !data?.[0]) return <ErrorBox msg={error ?? 'Sin datos'} />;

  const dias = data[0].prediccion?.dia ?? [];

  return (
    <section className="space-y-2">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide px-1">
        Próximos 7 días
      </h2>
      <div className="space-y-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(dias as any[]).map((dia: any) => {
          const skyCode = dia.estadoCielo?.find((e: { value?: string }) => e.value)?.value ?? '';
          const skyDesc = dia.estadoCielo?.find((e: { value?: string }) => e.value)?.descripcion ?? '';
          const probPrec = getPeriodValue(dia.probPrecipitacion) ?? '—';
          const viento = dia.viento?.find((v: { velocidad?: number; direccion?: string }) => v.velocidad) ?? dia.viento?.[0];

          return (
            <div
              key={dia.fecha}
              className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3"
            >
              {/* Day */}
              <div className="w-24 shrink-0">
                <p className="text-xs text-slate-400 capitalize">{formatDate(String(dia.fecha), { weekday: 'short', day: 'numeric', month: 'short' })}</p>
              </div>

              {/* Sky */}
              <div className="flex items-center gap-2 w-36">
                <SkyIcon code={skyCode} size={24} />
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{skyLabel(skyCode, skyDesc)}</span>
              </div>

              {/* Temp */}
              <div className="flex flex-col items-center gap-0.5 ml-auto">
                <span className="text-sm font-semibold text-orange-500">{dia.temperatura?.maxima}°</span>
                <span className="text-xs text-slate-400">{dia.temperatura?.minima}°</span>
              </div>

              {/* Rain */}
              <div className="flex flex-col items-center gap-0.5 w-10">
                <Umbrella size={13} className="text-sky-400" />
                <span className="text-xs text-sky-500">{probPrec}%</span>
              </div>

              {/* Wind */}
              {viento && (
                <div className="flex flex-col items-center gap-0.5 w-10">
                  <Wind size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{windDirArrow(viento.direccion)} {viento.velocidad}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function HourlyForecastPanel({ cod }: { cod: string }) {
  const { data, loading, error } = useForecast<{ prediccion: { dia: unknown[] } }[]>(
    `/api/aemet/forecast/horaria/${cod}`
  );

  if (loading) return <ForecastSkeleton rows={1} wide />;
  if (error || !data?.[0]) return <ErrorBox msg={error ?? 'Sin datos'} />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dias: any[] = data[0].prediccion?.dia ?? [];

  return (
    <section className="space-y-3">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide px-1">
        Por horas
      </h2>
      <HourlyTabs dias={dias} />
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HourlyTabs({ dias }: { dias: any[] }) {
  const [selected, setSelected] = useState(0);
  const dia = dias[selected];

  return (
    <div className="space-y-3">
      {/* Day tabs */}
      <div className="flex gap-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {dias.map((d: any, i: number) => (
          <button
            key={String(d.fecha)}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize ${
              i === selected
                ? 'bg-sky-500 text-white shadow'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/30'
            }`}
          >
            {formatDate(String(d.fecha), { weekday: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>

      {/* Hours scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(dia.temperatura ?? []).map((t: any) => {
            const periodo = String(t.periodo);
            const cieloEntry = dia.estadoCielo?.find((s: { periodo?: string }) => s.periodo === periodo)
              ?? dia.estadoCielo?.find((s: { value?: string }) => s.value);
            const skyCode = cieloEntry?.value ?? '';
            const skyDesc = cieloEntry?.descripcion ?? '';
            const precip = dia.precipitacion?.find((p: { periodo?: string }) => p.periodo === periodo)?.value ?? 0;
            const probPrec = dia.probPrecipitacion?.find((p: { periodo?: string }) => p.periodo === periodo)?.value ?? null;
            const wind = dia.vientoAndRachaMax?.find((v: { periodo?: string }) => v.periodo === periodo);
            const hum = dia.humedadRelativa?.find((x: { periodo?: string }) => x.periodo === periodo)?.value ?? null;
            const sensT = dia.sensTermica?.find((x: { periodo?: string }) => x.periodo === periodo)?.value ?? null;

            return (
              <div
                key={`${dia.fecha}-${periodo}`}
                className="flex flex-col items-center gap-1 bg-white dark:bg-slate-800 rounded-2xl px-3 py-3 shadow-sm min-w-18"
              >
                <span className="text-xs font-medium text-slate-500">{periodo.padStart(2, '0')}:00</span>
                <SkyIcon code={skyCode} size={28} />
                {skyCode && <span className="text-center text-[9px] text-slate-400 leading-tight w-full">{skyLabel(skyCode, skyDesc)}</span>}
                <span className="text-sm font-bold text-orange-500">{t.value}°</span>
                {sensT !== null && <span className="text-xs text-slate-400">ST {sensT}°</span>}
                {hum !== null && (
                  <div className="flex items-center gap-0.5">
                    <Droplets size={10} className="text-sky-400" />
                    <span className="text-xs text-sky-400">{hum}%</span>
                  </div>
                )}
                {probPrec !== null && Number(probPrec) > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Umbrella size={10} className="text-sky-500" />
                    <span className="text-xs text-sky-500">{probPrec}%</span>
                  </div>
                )}
                {Number(precip) > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Snowflake size={10} className="text-blue-400" />
                    <span className="text-xs text-blue-400">{precip}mm</span>
                  </div>
                )}
                {wind && (
                  <div className="flex items-center gap-0.5">
                    <Wind size={10} className="text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {windDirArrow(wind.direccion?.[0] ?? '')} {wind.velocidad?.[0]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ForecastSkeleton({ rows = 3, wide = false }: { rows?: number; wide?: boolean }) {
  return (
    <div className={`flex ${wide ? 'gap-3 overflow-hidden' : 'flex-col gap-2'}`}>
      {Array.from({ length: wide ? 8 : rows }).map((_, i) => (
        <div key={i} className={`bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse ${wide ? 'h-32 w-20 shrink-0' : 'h-14 w-full'}`} />
      ))}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl px-4 py-3 text-sm">
      <Zap size={16} />
      <span>{msg}</span>
    </div>
  );
}

