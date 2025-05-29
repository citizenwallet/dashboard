import { getServiceRoleClient } from '@/services/top-db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { alias: string } }
) {
  const client = getServiceRoleClient();
  const { alias } = await params;

  if (!alias) {
    return NextResponse.json({ error: 'Missing alias' }, { status: 400 });
  }

  const { data, error } = await client
    .from('communities')
    .select('*')
    .eq('alias', alias)
    .eq('active', true)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
