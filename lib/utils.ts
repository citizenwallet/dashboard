import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomInt } from 'crypto';
import { CommunityConfig } from '@citizenwallet/sdk';
import { parseUnits } from 'ethers';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOTP(): string {
  return randomInt(100000, 999999).toString().padStart(6, '0');
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function formatDate(
  date: Date | string,
  dateStyle: 'full' | 'long' | 'medium' | 'short' = 'medium',
  timeStyle: 'full' | 'long' | 'medium' | 'short' = 'short'
) {
  const formatter = new Intl.DateTimeFormat(navigator.language, {
    dateStyle,
    timeStyle
  });

  return formatter.format(new Date(date));
}

export const formatERC20TransactionValue = (
  config: CommunityConfig,
  value: string
) => {
  const token = config.primaryToken;

  console.log('value', value, 'decimals', token.decimals);

  try {
    if (token.decimals === 0) {
      // Handle non-decimal tokens
      const noDecimal = value.replace('.', '');
      const trimZeros = noDecimal.replace(/^0+/, '');
      return trimZeros || '0'; // return '0' if empty string
    }

    if (token.decimals === 6) {
      // Handle non-decimal tokens
      const noDecimal = value.replace('.', '');
      const trimZeros = noDecimal.replace(/^0+/, '');
      return trimZeros || '0'; // return '0' if empty string
    }

    // For decimal tokens, first convert to whole number
    const valueWithoutDecimals = parseUnits(value, token.decimals).toString();
    return valueWithoutDecimals;
  } catch (error) {
    console.error('Error formatting token value:', error);
    return value; // return original value as fallback
  }
};
