import { z } from 'zod';
import { aliasSchema } from './alias-utils';

export type ChainOption = {
  id: string;
  name: string;
  logo: string;
};

export const mainnetChains: ChainOption[] = [
  { id: '100', name: 'Gnosis', logo: '/chainLogo/Gnosis.png' },
  { id: '42220', name: 'Celo', logo: '/chainLogo/Celo.png' },
  { id: '42161', name: 'Arbitrum', logo: '/chainLogo/Arbitrum.png' },
  { id: '137', name: 'Polygon', logo: '/chainLogo/Polygon.png' }
];

export const testnetChains: ChainOption[] = [
  {
    id: '10200',
    name: 'Gnosis Testnet',
    logo: '/chainLogo/Gnosis.png'
  }
];

// Form validation schema
export const createCommunityFormSchema = z.object({
  chainId: z
    .string({
      required_error: 'Please select a Chain'
    })
    .min(1, {
      message: 'Please select a Chain'
    }),
  name: z
    .string({
      required_error: 'Community name is required'
    })
    .min(1, {
      message: 'Community name is required'
    })
    .max(100, {
      message: 'Community name must be 100 characters or less'
    }),
  alias: aliasSchema
});

