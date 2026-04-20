# Cielo ☀️

Tu previsión meteorológica española, bonita y limpia. Una alternativa moderna a la app oficial de AEMET.

## Stack
- Next.js 16 · TypeScript · Tailwind CSS v4
- API: [AEMET OpenData](https://opendata.aemet.es)

## Desarrollo

```bash
npm run dev
```

## Variables de entorno

Crea `.env.local` con tu API key de AEMET (regístrate gratis en [opendata.aemet.es](https://opendata.aemet.es/centrodedescargas/altaUsuario)):

```
AEMET_API_KEY=tu_api_key_aqui
```

## Despliegue

Despliega en Vercel con un clic. Recuerda añadir `AEMET_API_KEY` en las variables de entorno del proyecto.
