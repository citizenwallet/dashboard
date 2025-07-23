import { z } from 'zod';
import { aliasSchema } from './alias-utils';



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

