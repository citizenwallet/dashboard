import { type MemberT } from '@/services/db/members';
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
  member: memberSchema.nullable(),
  amount: z.string().min(1, {
    message: 'Amount must be greater than 0'
  }),
  description: z.string().min(1, {
    message: 'Description must be greater than 0'
  })
});
