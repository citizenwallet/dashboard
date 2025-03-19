import * as z from 'zod';
import { type AdminRoleT } from '@/services/db/admin';

export const roleEnum = z.enum(['owner', 'member'] as [AdminRoleT, ...AdminRoleT[]]);

export const inviteAdminFormSchema = z.object({
  email: z
    .string({
      required_error: 'Enter email address'
    })
    .min(1, {
      message: 'Enter email address'
    })
    .email({
      message: 'Invalid email address'
    }).trim(),
    avatar: z.string().nullable().optional(),
  alias: z.string().describe('Select community'),
  name: z
    .string({
      required_error: 'Enter name'
    })
    .min(1, {
      message: 'Enter name'
    }),
  role: roleEnum.describe('Select role')
});
