'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Thermometer, Droplets, Wind, Umbrella, Eye, Gauge } from 'lucide-react';
import { useForecast } from '@/hooks/useForecast';
import { getSkyInfo, formatDate, windDirArrow, uvColor } from '@/lib/weather';
import { SkyIcon, skyLabel } from '@/components/SkyIcon';
import { DailyForecastPanel, HourlyForecastPanel } from '@/components/ForecastPanels';

export default function MunicipioPage({ params }: { params: Promise<{ cod: string }> }) {
  const { cod } = use(params);

  const { data, loading } = useForecast<{ nombre: string; provincia: string; prediccion: { dia: unknown[] } }[]>(
    `/api/aemet/forecast/diaria/${cod}`
  );

  const nombre = data?.[0]?.nombre ?? '…';
  const provincia = data?.[0]?.provincia ?? '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hoy = (data?.[0]?.prediccion?.dia as any[])?.[0];
  const skyCode = hoy?.estadoCielo?.find((e: { value?: string }) => e.value)?.value ?? '';
  const skyDesc = hoy?.estadoCielo?.find((e: { value?: string }) => e.value)?.descripcion ?? '';
  const sky = skyCode ? { label: skyLabel(skyCode, skyDesc) } : null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 hover:underline">
        <ArrowLeft size={16} /> Volver
      </Link>

      {/* Hero */}
      <div className="rounded-3xl bg-linear-to-br from-sky-400 to-blue-600 dark:from-sky-700 dark:to-blue-900 text-white p-6 shadow-lg">
        <p className="text-sm text-white/70">{provincia}</p>
        <h1 className="text-3xl font-bold">{nombre}</h1>
        {hoy && sky && (
          <>
            <div className="mt-4 flex items-center gap-4">
              <SkyIcon code={skyCode} size={64} className="opacity-90" />
              <div>
                <p className="text-5xl font-bold">{hoy.temperatura?.maxima}°</p>
                <p className="text-white/70">{sky.label}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-white/70">
              {formatDate(String(hoy.fecha))} · Mín {hoy.temperatura?.minima}° / Máx {hoy.temperatura?.maxima}°
            </p>

            {/* Metrics grid */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Metric icon={<Droplets size={16} />} label="Humedad" value={`${hoy.humedadRelativa?.maxima ?? '—'}%`} />
              <Metric icon={<Umbrella size={16} />} label="Prob. lluvia" value={`${hoy.probPrecipitacion?.[0]?.value ?? '—'}%`} />
              <Metric icon={<Wind size={16} />} label="Viento" value={hoy.viento?.[0] ? `${windDirArrow(hoy.viento[0].direccion)} ${hoy.viento[0].velocidad} km/h` : '—'} />
              <Metric icon={<Thermometer size={16} />} label="Sens. térmica" value={`${hoy.sensTermica?.maxima ?? '—'}°`} />
              {hoy.uvMax && (
                <Metric icon={<Eye size={16} />} label="UV Máx" value={String(hoy.uvMax)} extra={uvColor(Number(hoy.uvMax))} />
              )}
              {hoy.rachaMax?.[0]?.value && (
                <Metric icon={<Gauge size={16} />} label="Racha máx" value={`${hoy.rachaMax[0].value} km/h`} />
              )}
            </div>
          </>
        )}
        {loading && <div className="mt-4 h-32 w-full rounded-2xl bg-white/20 animate-pulse" />}
      </div>

      {/* Hourly */}
      <HourlyForecastPanel cod={cod} />

      {/* Daily */}
      <DailyForecastPanel cod={cod} />
    </div>
  );
}

function Metric({
  icon, label, value, extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: string;
}) {
  return (
    <div className="bg-white/15 rounded-2xl p-3">
      <div className="flex items-center gap-1 text-white/70 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${extra ?? 'text-white'}`}>{value}</p>
    </div>
  );
}

