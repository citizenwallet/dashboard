import jwt from 'jsonwebtoken';

interface JWTPayload {
  email: string;
  address: string;
  chainId: number;
}

export async function createJWT(
  payload: JWTPayload,
  secret: string
): Promise<string> {
  return await jwt.sign(payload, secret, { expiresIn: '365d' });
}

export async function verifyJWT(
  token: string,
  secret: string
): Promise<JWTPayload> {
  return (await jwt.verify(token, secret)) as JWTPayload;
}
