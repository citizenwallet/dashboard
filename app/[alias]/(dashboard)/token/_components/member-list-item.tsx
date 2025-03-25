'use client';

import { MemberT } from '@/services/chain-db/members';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MemberListItemProps {
  member: Pick<
    MemberT,
    'id' | 'account' | 'profile_contract' | 'username' | 'name' | 'image'
  >;
}

export default function MemberListItem({ member }: MemberListItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={member.image} alt={member.username} />
        <AvatarFallback>{member.username.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{`@${member.username}`}</span>
        <span className="text-xs font-mono truncate">{member.name}</span>
      </div>
    </div>
  );
}
