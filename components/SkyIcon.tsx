import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Cloudy, CloudDrizzle } from 'lucide-react';

// SVG weather icon based on AEMET sky state codes
export function SkyIcon({ code, size = 32, className = '' }: { code: string; size?: number; className?: string }) {
  const c = String(code).replace(/^0+/, '');
  const n = Number(c);
  const cls = `shrink-0 ${className}`;

  // Despejado
  if (n === 11) return <Sun size={size} className={`text-yellow-400 ${cls}`} strokeWidth={1.5} />;

  // Poco nuboso
  if (n === 12) return <PartlyCloudy size={size} className={cls} />;

  // Intervalos nubosos
  if (n === 13) return <PartlyCloudy size={size} className={cls} />;

  // Nuboso
  if (n === 14) return <Cloudy size={size} className={`text-slate-400 ${cls}`} strokeWidth={1.5} />;

  // Muy nuboso / Cubierto / Nubes altas
  if (n === 15 || n === 16 || n === 17) return <Cloud size={size} className={`text-slate-400 ${cls}`} strokeWidth={1.5} />;

  // Lluvia (23-26)
  if (n >= 23 && n <= 26) return <CloudDrizzle size={size} className={`text-sky-400 ${cls}`} strokeWidth={1.5} />;

  // Nieve (33-36)
  if (n >= 33 && n <= 36) return <CloudSnow size={size} className={`text-blue-300 ${cls}`} strokeWidth={1.5} />;

  // Lluvia y nieve (43-46)
  if (n >= 43 && n <= 46) return <CloudSnow size={size} className={`text-sky-400 ${cls}`} strokeWidth={1.5} />;

  // Tormenta (51-64)
  if (n >= 51 && n <= 64) return <CloudLightning size={size} className={`text-yellow-500 ${cls}`} strokeWidth={1.5} />;

  // Niebla / Calima / Viento
  if (n >= 71 && n <= 75) return <Wind size={size} className={`text-slate-400 ${cls}`} strokeWidth={1.5} />;

  // Fallback
  return <Cloud size={size} className={`text-slate-300 ${cls}`} strokeWidth={1.5} />;
}

// Composite: partly cloudy (sun + cloud)
function PartlyCloudy({ size, className }: { size: number; className: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Sun size={size * 0.7} className="text-yellow-400 absolute bottom-0 right-0" strokeWidth={1.5} />
      <Cloud size={size * 0.75} className="text-slate-300 absolute top-0 left-0" strokeWidth={1.5} />
    </span>
  );
}

// Text label: prefer API descripcion, fallback to our map
const LABELS: Record<string, string> = {
  '11': 'Despejado', '12': 'Poco nuboso', '13': 'Intervalos nubosos',
  '14': 'Nuboso', '15': 'Muy nuboso', '16': 'Cubierto', '17': 'Nubes altas',
  '23': 'Lluvia débil', '24': 'Nuboso con lluvia', '25': 'Lluvia', '26': 'Cubierto con lluvia',
  '33': 'Nieve débil', '34': 'Nieve', '35': 'Mucha nieve', '36': 'Cubierto con nieve',
  '43': 'Aguanieve', '44': 'Aguanieve', '45': 'Aguanieve', '46': 'Aguanieve',
  '51': 'Tormenta', '52': 'Tormenta', '53': 'Tormenta', '54': 'Tormenta',
  '61': 'Tormenta con lluvia', '62': 'Tormenta', '63': 'Tormenta', '64': 'Tormenta',
  '71': 'Niebla', '72': 'Bruma', '73': 'Calima', '74': 'Viento fuerte', '75': 'Tornado',
};

export function skyLabel(code: string, apiDesc?: string): string {
  if (apiDesc && apiDesc.trim()) return apiDesc;
  const c = String(code).replace(/^0+/, '');
  return LABELS[c] ?? code;
}

