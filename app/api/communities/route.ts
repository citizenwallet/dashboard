import { getServiceRoleClient } from '@/services/top-db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get('chainId');

  const client = getServiceRoleClient();

  let query = client
    .from('communities')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (chainId) {
    query = query.eq('chain_id', chainId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
