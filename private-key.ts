import { CommunityConfig, getAccountAddress } from '@citizenwallet/sdk';
import { Wallet } from 'ethers';
import { getServiceRoleClient } from './services/top-db';
import { getCommunityByAlias } from './services/top-db/community';

async function main() {
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, 'seldesalm');

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const config = data.json;
  const communityConfig = new CommunityConfig(config);

  const privateKey = Wallet.createRandom();
  const privateKeyAddress = privateKey.address;

  const accountAddress = await getAccountAddress(
    communityConfig,
    privateKeyAddress
  );

  console.log('private key', privateKey);
  console.log('private key key', privateKey.privateKey);
  console.log('private keyaddress', privateKeyAddress);
  console.log('account address', accountAddress);
}

main();
