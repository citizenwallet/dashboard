'use client';

import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

export default function UrlSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsSearching(false);
  }, 300); // Debounce for 300ms

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true); // Show loading immediately when typing starts
    handleSearch(e.target.value);
  };

  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <div className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      <Input
        name="query"
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={handleInputChange}
      />
    </div>
  );
}
