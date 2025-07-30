'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOutAction } from '@/app/_actions/user-actions';
import { UserRow } from '@/services/top-db/users';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

interface UserProps {
  user: UserRow | null;
}

export default function User(props: UserProps) {
  const { user } = props;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200 p-0 transition-all hover:border-gray-300"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user?.avatar ?? ''}
              alt={user?.name ?? 'User'}
              className="object-cover"
            />
            <AvatarFallback className="from-primary/80 to-primary text-primary flex items-center justify-center">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild className="cursor-pointer">
          <form
            action={async () => {
              await signOutAction();
            }}
          >
            <button type="submit" className="flex w-full items-center">
              Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
