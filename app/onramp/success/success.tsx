'use client';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Success({ closeUrl }: { closeUrl?: string }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (closeUrl) {
      timer = setTimeout(() => {
        window.location.href = closeUrl;
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [closeUrl]);
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle
            className={cn(
              'h-16 w-16 text-green-600 dark:text-green-500 transition-all duration-500 ease-out',
              animate ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          />
        </div>

        <h1
          className={cn(
            'mb-2 text-3xl font-bold tracking-tight transition-all duration-500 delay-200',
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          Success!
        </h1>

        <p
          className={cn(
            'mb-8 text-muted-foreground transition-all duration-500 delay-300',
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="font-bold">The transaction was accepted.</span>
          <br />
          Swapping for CTZN tokens, this can take a few minutes...
        </p>
      </div>
    </div>
  );
}
