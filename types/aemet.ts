// ── Municipios ────────────────────────────────────────────────────────────────

export interface Municipio {
  id: string;       // e.g. "id28079"
  nombre: string;   // e.g. "Madrid"
  codAuto: string;
  cpro: string;     // código provincia
  cmun: string;     // código municipio
  dc: string;
  latitud: string;
  longitud: string;
  altitud: string;
  nombre_provincia: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

export interface PeriodoValor<T> {
  periodo?: string;  // "00", "06", "1200", or absent for daily
  value: T;
}

export interface RangoValor {
  minima: number;
  maxima: number;
}

// ── Daily forecast ────────────────────────────────────────────────────────────

export interface EstadoCielo {
  value: string;      // "11", "12", ... sky state code
  periodo?: string;
  descripcion?: string;
}

export interface Viento {
  direccion: string;  // "N", "NE", etc.
  velocidad: number;
  periodo?: string;
}

export interface RachaMax {
  value: string | number;
  periodo?: string;
}

export interface ProbPrecipitacion {
  value: number;
  periodo?: string;  // "0006", "0612" etc.
}

export interface CotaNieveProv {
  value: string | number;
  periodo?: string;
}

export interface SensTermica {
  minima: number;
  maxima: number;
}

export interface HumedadRelativa {
  minima: number;
  maxima: number;
}

export interface UVMax {
  value: number;
}

export interface Prediccion {
  dia: string;          // ISO date
  probPrecipitacion: ProbPrecipitacion[];
  cotaNieveProv: CotaNieveProv[];
  estadoCielo: EstadoCielo[];
  viento: Viento[];
  rachaMax: RachaMax[];
  temperatura: RangoValor;
  sensTermica: SensTermica;
  humedadRelativa: HumedadRelativa;
  uvMax?: UVMax;
}

export interface PrediccionDiariaData {
  nombre: string;
  provincia: string;
  id: string;
  capital?: string;
  elaborado?: string;
  prediccion: {
    dia: Prediccion[];
  };
}

export interface PrediccionDiaria {
  origen: {
    productor: string;
    web: string;
    enlace: string;
    language: string;
    copyright: string;
    notaLegal: string;
  };
  elaborado: string;
  nombre: string;
  provincia: string;
  prediccion: {
    dia: Prediccion[];
  };
  id: string;
  version: number;
}

// ── Hourly forecast ───────────────────────────────────────────────────────────

export interface EstadoCieloHorario {
  value: string;
  periodo: string;
  descripcion?: string;
}

export interface VientoHorario {
  direccion: string[];
  velocidad: number[];
  periodo: string;
}

export interface PrediccionHora {
  estadoCielo: EstadoCieloHorario[];
  precipitacion: PeriodoValor<number>[];
  probPrecipitacion: PeriodoValor<number>[];
  probTormenta: PeriodoValor<number>[];
  nieve: PeriodoValor<number>[];
  probNieve: PeriodoValor<number>[];
  temperatura: PeriodoValor<number>[];
  sensTermica: PeriodoValor<number>[];
  humedadRelativa: PeriodoValor<number>[];
  vientoAndRachaMax: VientoHorario[];
  dia: string;
}

export interface PrediccionHoraria {
  origen: {
    productor: string;
    web: string;
    enlace: string;
    language: string;
    copyright: string;
    notaLegal: string;
  };
  elaborado: string;
  nombre: string;
  provincia: string;
  prediccion: {
    dia: PrediccionHora[];
  };
  id: string;
  version: number;
}

// ── Saved municipio (stored in localStorage) ─────────────────────────────────

export interface SavedMunicipio {
  id: string;    // e.g. "28079"
  nombre: string;
  provincia: string;
}

