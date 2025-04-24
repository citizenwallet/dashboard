import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';

export interface UserJwt {
  id: string;
  email: string;
  name: string;
}

export async function createJWTtoken(user: UserJwt) {
  const signer = ES256KSigner(hexToBytes('ACCOUNT_DID_PRIVATE_KEY'));

  let jwt = await createJWT(
    {
      aud: 'did:ethr:ACCOUNT_AUDIENCE',
      user: user
    },
    { issuer: 'did:ethr:ACCOUNT_DID', signer },
    { alg: 'ES256K' }
  );
  return jwt;
}
