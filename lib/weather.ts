/**
 * Maps AEMET sky state codes to emoji + description.
 * Codes: https://www.aemet.es/es/eltiempo/prediccion/municipios/ayuda
 */
export const CIELO: Record<string, { emoji: string; label: string }> = {
  '11': { emoji: '☀️', label: 'Despejado' },
  '12': { emoji: '🌤️', label: 'Poco nuboso' },
  '13': { emoji: '⛅', label: 'Intervalos nubosos' },
  '14': { emoji: '🌥️', label: 'Nuboso' },
  '15': { emoji: '☁️', label: 'Muy nuboso' },
  '16': { emoji: '☁️', label: 'Cubierto' },
  '17': { emoji: '🌫️', label: 'Nubes altas' },
  '23': { emoji: '🌦️', label: 'Intervalos nubosos con lluvia' },
  '24': { emoji: '🌧️', label: 'Nuboso con lluvia' },
  '25': { emoji: '🌧️', label: 'Muy nuboso con lluvia' },
  '26': { emoji: '🌧️', label: 'Cubierto con lluvia' },
  '33': { emoji: '⛈️', label: 'Intervalos nubosos con nieve' },
  '34': { emoji: '🌨️', label: 'Nuboso con nieve' },
  '35': { emoji: '❄️', label: 'Muy nuboso con nieve' },
  '36': { emoji: '❄️', label: 'Cubierto con nieve' },
  '43': { emoji: '⛈️', label: 'Intervalos nubosos con lluvia y nieve' },
  '44': { emoji: '🌩️', label: 'Nuboso con lluvia y nieve' },
  '45': { emoji: '⛈️', label: 'Muy nuboso con lluvia y nieve' },
  '46': { emoji: '⛈️', label: 'Cubierto con lluvia y nieve' },
  '51': { emoji: '⛈️', label: 'Intervalos nubosos con tormenta' },
  '52': { emoji: '⛈️', label: 'Nuboso con tormenta' },
  '53': { emoji: '⛈️', label: 'Muy nuboso con tormenta' },
  '54': { emoji: '⛈️', label: 'Cubierto con tormenta' },
  '61': { emoji: '⛈️', label: 'Intervalos nubosos con tormenta y lluvia' },
  '62': { emoji: '⛈️', label: 'Nuboso con tormenta y lluvia' },
  '63': { emoji: '⛈️', label: 'Muy nuboso con tormenta y lluvia' },
  '64': { emoji: '⛈️', label: 'Cubierto con tormenta y lluvia' },
  '71': { emoji: '🌫️', label: 'Niebla' },
  '72': { emoji: '🌁', label: 'Bruma' },
  '73': { emoji: '🌫️', label: 'Calima' },
  '74': { emoji: '🌬️', label: 'Viento fuerte' },
  '75': { emoji: '🌪️', label: 'Tornado' },
};

export function getSkyInfo(code: string) {
  const clean = String(code).replace(/^0+/, '');
  return CIELO[clean] ?? { emoji: '🌡️', label: code };
}

export const WIND_DIRS: Record<string, string> = {
  N: '↑', NE: '↗', E: '→', SE: '↘',
  S: '↓', SO: '↙', O: '←', NO: '↖', C: '•',
};

export function windDirArrow(dir: string) {
  return WIND_DIRS[dir] ?? dir;
}

export function uvColor(uv: number): string {
  if (uv <= 2) return 'text-green-500';
  if (uv <= 5) return 'text-yellow-500';
  if (uv <= 7) return 'text-orange-500';
  if (uv <= 10) return 'text-red-500';
  return 'text-purple-600';
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short', ...opts,
  });
}

export function formatHour(periodo: string): string {
  // periodo is like "06", "12", "18"
  return `${periodo.padStart(2, '0')}:00`;
}

