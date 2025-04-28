import { id } from 'ethers';

export const generateSessionSalt = (source: string, type: string) => {
  return id(`${source}:${type}`);
};
