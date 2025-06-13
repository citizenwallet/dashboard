import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import Success from './success';

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ closeUrl?: string }>;
}) {
  const { closeUrl } = await searchParams;

  return <Success closeUrl={closeUrl} />;
}
