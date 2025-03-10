import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomInt } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function generateOTP(): string {
  return randomInt(100000, 999999).toString().padStart(6, '0');
}