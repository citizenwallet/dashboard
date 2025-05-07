import communities from './communities.json' assert { type: 'json' };
import { Config } from '@citizenwallet/sdk';
export const getCommunity = async (
  alias: string
): Promise<{ community: Config }> => {
  const community: Config = communities.find(
    (community) => community.community.alias === alias
  ) as unknown as Config;

  if (!community) throw new Error(`Community ${alias} not found`);

  return { community };
};
