import { verifyJWT } from 'did-jwt';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

export async function verifycheckJWT(token: string, account: string) {
  const resolver = new Resolver({
    ...getResolver({
      infuraProjectId: process.env.INFURA_PROJECT_ID // https://developer.metamask.io/key/settings
    })
  });

  const verificationResponse = await verifyJWT(token, {
    resolver,
    audience: `did:ethr:${account}`
  });
  return verificationResponse;
}
