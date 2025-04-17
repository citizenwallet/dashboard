"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SwitcherButton() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const [showAllMembers, setShowAllMembers] = useState<boolean>(false)


    useEffect(() => {
        const showMembers = searchParams.get('showMembers') === 'true';
        setShowAllMembers(showMembers)
    }, [searchParams])


    const handleShowAllMembers = async () => {
        const params = new URLSearchParams(searchParams);
        params.set('showMembers', showAllMembers ? 'false' : 'true');
        setShowAllMembers(!showAllMembers)
        router.push(`${pathname}?${params.toString()}`);

    }

    return (
        <div className="flex flex-col gap-2">

            <Button className="w-fit">
                <Plus size={16} />
                Add Member
            </Button>

            <div className="flex items-center space-x-2 my-4">
                <Switch id="airplane-mode" checked={showAllMembers} onCheckedChange={handleShowAllMembers} />
                <Label htmlFor="airplane-mode"> Show all members (Including Anonymous)</Label>
            </div>

        </div>
    )
}
