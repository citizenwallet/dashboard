import { verifyJWT } from 'did-jwt';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

const extractAccountFromJWT = async (token: string): Promise<string | null> => {
  const [header, payload, signature] = token.split('.');
  if (!payload) return null;
  const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  return decoded.account || null;
};

export async function verifycheckJWT(token: string) {
  const account = await extractAccountFromJWT(token);
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
