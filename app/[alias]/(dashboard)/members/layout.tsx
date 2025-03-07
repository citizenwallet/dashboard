import { SearchInput } from '@/components/custom/url-search';

export default function MembersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <SearchInput />
      </div>
      {children}
    </div>
  );
}
