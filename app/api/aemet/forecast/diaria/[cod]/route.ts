import { getPrediccionDiaria } from '@/lib/aemet';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cod: string }> }
) {
  const { cod } = await params;
  try {
    const data = await getPrediccionDiaria(cod);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

