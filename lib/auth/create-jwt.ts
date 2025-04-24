import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';

export interface UserJwt {
  id: string;
  email: string;
  name: string;
}

export async function createJWTtoken(user: UserJwt, account: string) {
  if (!process.env.ACCOUNT_DID_PRIVATE_KEY) {
    throw new Error('ACCOUNT_DID_PRIVATE_KEY is not set');
  }
  const signer = ES256KSigner(hexToBytes(process.env.ACCOUNT_DID_PRIVATE_KEY));

  const jwt = await createJWT(
    {
      aud: `did:ethr:${account}`,
      user: user
    },
    { issuer: `did:ethr:${process.env.ACCOUNT_DID}`, signer },
    { alg: 'ES256K' }
  );
  return jwt;
}
