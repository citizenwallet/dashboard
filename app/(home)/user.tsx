'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  signOutAction
} from '@/app/_actions/admin-actions';
import { useState } from 'react';
import { AdminT } from '@/services/db/admin';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Session } from 'next-auth';

interface UserProps {
  session: Session;
  admin: AdminT | null;
}

export default function User(props: UserProps) {
  const [admin, setAdmin] = useState<AdminT | null>(props.admin);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={admin?.avatar ?? ''} alt="admin avatar" />
            <AvatarFallback>{admin?.name ?? ''}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <form
            action={async () => {
              await signOutAction();
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
