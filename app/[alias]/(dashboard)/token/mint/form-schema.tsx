import { type MemberT } from '@/services/chain-db/members';
import * as z from 'zod';

const memberSchema: z.ZodType<
  Pick<MemberT, 'id' | 'account' | 'profile_contract' | 'username' | 'name'>
> = z.object({
  id: z.string(),
  account: z.string(),
  profile_contract: z.string(),
  username: z.string(),
  name: z.string()
});

export const mintTokenFormSchema = z.object({
  member: memberSchema.nullable().refine((val) => val !== null, {
    message: 'Please select a member'
  }),
  amount: z
    .string()
    .min(1, { message: 'Please enter an amount' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be greater than 0'
    }),
  description: z
    .string()
    .max(160, {
      message: 'Description must not be longer than 160 characters.'
    })
    .optional()
});
