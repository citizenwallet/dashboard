import { z } from 'zod';

export const sanitizeAlias = (alias: string): string => {
  return alias
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
};

export const isValidAlias = (alias: string): boolean => {
  // Check if alias is not empty after sanitization
  if (!alias || alias.length === 0) {
    return false;
  }

  // Check if alias contains only lowercase letters, numbers, and hyphens
  const validPattern = /^[a-z0-9-]+$/;
  if (!validPattern.test(alias)) {
    return false;
  }

  // Check if alias doesn't start or end with hyphen
  if (alias.startsWith('-') || alias.endsWith('-')) {
    return false;
  }

  // Check if alias doesn't have consecutive hyphens
  if (alias.includes('--')) {
    return false;
  }

  return true;
};

export const aliasSchema = z
  .string({
    required_error: 'Alias is required'
  })
  .min(1, {
    message: 'Alias cannot be empty'
  })
  .max(50, {
    message: 'Alias must be 50 characters or less'
  })
  .refine(
    (val) => {
      const sanitized = sanitizeAlias(val);
      return sanitized === val;
    },
    {
      message: 'Alias must contain only lowercase letters, numbers, and hyphens'
    }
  )
  .refine((val) => isValidAlias(val), {
    message:
      'Alias must be a valid format (no leading/trailing hyphens, no consecutive hyphens)'
  });
