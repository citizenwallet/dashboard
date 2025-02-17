'use client';

import { useTransition } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    const value = formData.get('query') as string;

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="query"
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
