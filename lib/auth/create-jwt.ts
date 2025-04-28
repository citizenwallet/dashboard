import { createJWT, ES256KSigner, hexToBytes } from 'did-jwt';

export interface UserJwt {
  id: string;
  email: string;
  name: string;
}

export async function createJWTtoken(
  user: UserJwt,
  account: string,
  privateKey: string,
  publicKey: string
) {
  const signer = ES256KSigner(hexToBytes(privateKey));

  const jwt = await createJWT(
    {
      aud: `did:ethr:${account}`,
      user: user,
      account: account
    },
    { issuer: `did:ethr:${publicKey}`, signer },
    { alg: 'ES256K' }
  );
  return jwt;
}
