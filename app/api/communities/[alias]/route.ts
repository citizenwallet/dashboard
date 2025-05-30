import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ alias: string }> }
) {
  const client = getServiceRoleClient();
  const { alias } = await params;

  if (!alias) {
    return NextResponse.json({ error: 'Missing alias' }, { status: 400 });
  }

  const { data, error } = await getCommunityByAlias(client, alias);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
