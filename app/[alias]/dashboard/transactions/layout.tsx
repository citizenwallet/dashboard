import { SearchInput } from '@/components/custom/url-search';

export default function TransactionsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <SearchInput />
      </div>
      {children}
    </div>
  );
}
