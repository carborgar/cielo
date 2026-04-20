import { auth } from '@clerk/nextjs/server';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import type { SavedMunicipio } from '@/types/aemet';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const municipios = await kv.get<SavedMunicipio[]>(`favorites:${userId}`);
  return NextResponse.json(municipios ?? []);
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { municipios } = await request.json() as { municipios: SavedMunicipio[] };
  await kv.set(`favorites:${userId}`, municipios);
  return NextResponse.json({ ok: true });
}

