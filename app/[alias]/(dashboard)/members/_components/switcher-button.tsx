'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SwitcherButton() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [showAllMembers, setShowAllMembers] = useState<boolean>(
    searchParams.get('showAll') === 'true'
  );

  //handle the show all members
  const handleShowAllMembers = async () => {
    const params = new URLSearchParams(searchParams);
    params.set('showAll', showAllMembers ? 'false' : 'true');
    setShowAllMembers(!showAllMembers);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-all-members-switch"
          checked={showAllMembers}
          onCheckedChange={handleShowAllMembers}
        />
        <Label htmlFor="show-all-members-switch">
          Show all members (Including Anonymous)
        </Label>
      </div>
    </div>
  );
}
