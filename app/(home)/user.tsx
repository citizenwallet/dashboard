'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOutAction } from '@/app/_actions/admin-actions';
import { AdminT } from '@/services/chain-db/admin';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Session } from 'next-auth';

interface UserProps {
  session: Session;
  admin: AdminT | null;
}

export default function User(props: UserProps) {
  const { admin } = props;

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
            <AvatarFallback>{admin?.name?.slice(0, 2) ?? ''}</AvatarFallback>
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
