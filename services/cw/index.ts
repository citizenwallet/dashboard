import { getServiceRoleClient } from '../top-db';
import { getCommunityByAlias } from '../top-db/community';
import { Config } from '@citizenwallet/sdk';
export const getCommunity = async (
  alias: string
): Promise<{ community: Config }> => {
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error(`Community ${alias} not found`);
  }

  const community: Config = data.json;

  if (!community) throw new Error(`Community ${alias} not found`);

  return { community };
};
