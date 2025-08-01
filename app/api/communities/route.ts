import { getServiceRoleClient } from '@/services/top-db';
import { getCommunitiesByChainId } from '@/services/top-db/community';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get('chainId');

  const client = getServiceRoleClient();

  const { data, error } = await getCommunitiesByChainId(
    client,
    Number(chainId)
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const activeCommunities = data.filter(
    (community) => !community.json.community.hidden
  );

  return NextResponse.json(activeCommunities);
}
