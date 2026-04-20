const BASE = 'https://opendata.aemet.es/opendata/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function aemetFetch<T = any>(path: string): Promise<T> {
  const apiKey = process.env.AEMET_API_KEY;
  if (!apiKey) throw new Error('AEMET_API_KEY is not set');

  // Step 1: get the short-lived data URL — never cache
  const metaRes = await fetch(
    `${BASE}${path}?api_key=${apiKey}`,
    { headers: { Accept: 'application/json' }, cache: 'no-store' }
  );
  if (!metaRes.ok) throw new Error(`AEMET meta error ${metaRes.status}`);
  const meta = await metaRes.json();

  if (meta.estado !== 200) {
    throw new Error(`AEMET: ${meta.descripcion ?? 'Unknown error'}`);
  }

  // Step 2: fetch actual data — AEMET returns Latin-1, decode manually
  const dataRes = await fetch(meta.datos, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!dataRes.ok) throw new Error(`AEMET data error ${dataRes.status}`);

  const buffer = await dataRes.arrayBuffer();
  const text = new TextDecoder('iso-8859-1').decode(buffer);
  return JSON.parse(text);
}

export async function getMunicipios() {
  return aemetFetch('/maestro/municipios');
}

export async function getPrediccionDiaria(cod: string) {
  return aemetFetch(`/prediccion/especifica/municipio/diaria/${cod}`);
}

export async function getPrediccionHoraria(cod: string) {
  return aemetFetch(`/prediccion/especifica/municipio/horaria/${cod}`);
}
