"use client"
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Config } from '@citizenwallet/sdk'
import { ethers } from 'ethers'
import { Plus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { checkAvailableAddressMemberAction } from '../action'


export default function SwitcherButton({ config }: { config: Config }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();


    const [showAllMembers, setShowAllMembers] = useState<boolean>(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [validAddress, setValidAddress] = useState<boolean>(false);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [address, setAddress] = useState<string>('');
    const usebouncedAddress = useDebounce(address, 1000);

    //get the showMembers from the search params
    useEffect(() => {
        const showMembers = searchParams.get('showMembers') === 'true';
        setShowAllMembers(showMembers)
    }, [searchParams])


    //handle the show all members
    const handleShowAllMembers = async () => {
        const params = new URLSearchParams(searchParams);
        params.set('showMembers', showAllMembers ? 'false' : 'true');
        setShowAllMembers(!showAllMembers)
        router.push(`${pathname}?${params.toString()}`);

    }

    //check if the address is valid
    const checkValidAddress = (address: string) => {
        return ethers.isAddress(address);
    }


    //check if the address is Available
    useEffect(() => {
        const checkAddress = async () => {

            const isValid = checkValidAddress(usebouncedAddress[0]);
            if (isValid) {
                setValidAddress(true)

                const isAvailable = await checkAvailableAddressMemberAction({
                    config: config,
                    address: usebouncedAddress[0]
                });

                if (isAvailable) {
                    setIsAvailable(false)
                } else {
                    setIsAvailable(true)
                }
            } else {
                setValidAddress(false)
            }

        }
        checkAddress();
    }, [usebouncedAddress, config])


    return (
        <div className="flex flex-col gap-2">

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-start mb-4">
                        <Button >
                            <Plus size={16} />
                            Add  Member
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create profile</DialogTitle>
                        <DialogDescription>
                            Add a new profile
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {!validAddress && address != '' && (
                            <p className='text-red-500'>Invalid address.please enter a valid address</p>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="memberAccount" className="text-sm font-medium">
                                Enter account address
                            </label>
                            <Input
                                id="memberAccount"
                                placeholder="Member Account"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>


                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false)
                                setAddress('')
                            }}
                        >
                            cancel
                        </Button>
                        {validAddress && (
                            isAvailable ? (
                                <Button
                                    className="mb-2 md:mb-0"
                                    onClick={() => {
                                        router.push(`members/${address}/add`);
                                    }}
                                >
                                    <Plus size={16} />
                                    Add
                                </Button>
                            ) : (
                                <Button
                                    className="mb-2 md:mb-0"
                                    onClick={() => {
                                        router.push(`members/${address}/edit`);
                                    }}
                                >
                                    Edit
                                </Button>
                            )
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-2 my-4">
                <Switch id="airplane-mode" checked={showAllMembers} onCheckedChange={handleShowAllMembers} />
                <Label htmlFor="airplane-mode"> Show all members (Including Anonymous)</Label>
            </div>

        </div>
    )
}
