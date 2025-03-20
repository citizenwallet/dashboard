import { Wallet } from 'ethers';
import { CommunityConfig, getAccountAddress } from '@citizenwallet/sdk';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

async function main() {
  const { community: config } = await fetchCommunityByAliasAction('seldesalm');
  const communityConfig = new CommunityConfig(config);

  const privateKey = Wallet.createRandom();
  const privateKeyAddress = privateKey.address;

  const accountAddress = await getAccountAddress(communityConfig, privateKeyAddress);

  console.log('private key', privateKey);
  console.log('private key key', privateKey.privateKey);
  console.log('private keyaddress', privateKeyAddress);
  console.log('account address', accountAddress);
}

main();
