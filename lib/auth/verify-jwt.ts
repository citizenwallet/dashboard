// lib/auth/verify-jwt.ts
import { verifyJWT } from 'did-jwt';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

export async function verifycheckJWT(token: string) {
  let resolver = new Resolver({
    ...getResolver({
      infuraProjectId: 'key' // https://developer.metamask.io/key/settings
    })
  });

  // use the JWT from step 1
  let verificationResponse = await verifyJWT(token, {
    resolver,
    audience: 'did:ethr:ACCOUNT_DID'
  });
  return verificationResponse;
}
