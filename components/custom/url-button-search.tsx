'use client';

import { checkAvailableAddressMemberAction } from '@/app/[alias]/(dashboard)/members/action';
import { Input } from '@/components/ui/input';
import { Config } from '@citizenwallet/sdk';
import { ethers } from 'ethers';
import { Loader2, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '../ui/button';

export default function UrlSearch({ config }: { config: Config }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [isvaildAddress, setIsvaildAddress] = useState(false);
    const [isAvailableAddress, setIsAvailableAddress] = useState(false);

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


    //check if the address is valid
    const checkValidAddress = (address: string) => {
        return ethers.isAddress(address);
    }

    //check if the address is Available
    useEffect(() => {
        const checkAddress = async () => {
            const query = searchParams.get('query')?.toString() || '';
            const isValid = checkValidAddress(query);
            if (isValid) {
                setIsvaildAddress(true)
                const isAvailable = await checkAvailableAddressMemberAction({
                    config: config,
                    address: query
                });

                if (isAvailable) {
                    setIsAvailableAddress(true)
                } else {
                    setIsAvailableAddress(false)
                }
            } else {
                setIsvaildAddress(false)
            }

        }
        checkAddress();
    }, [searchParams, config])


    return (
        <div className="relative ml-auto flex-1 md:grow-0">
            <div className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground">
                {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Search className="h-4 w-4" />
                )}
            </div>
            {/* if the address is valid and not available, show the add member button */}
            {isvaildAddress && !isAvailableAddress && (
                <Button className='absolute right-0  h-7 m-1.5 w-fit font-normal text-xs'>
                    Add Member
                </Button>
            )}
            {/* if the address is valid and available, show the edit member button */}
            {isvaildAddress && isAvailableAddress && (
                <Button className='absolute right-0  h-7 m-1.5 w-fit font-normal text-xs'
                    onClick={() => {
                        router.push(`members/${searchParams.get('query')?.toString()}`);
                    }}
                >
                    Edit member
                </Button>
            )}
            <Input
                name="query"
                type="search"
                placeholder="Search..."
                className={`w-full rounded-lg bg-background 
                pl-8
                ${isvaildAddress && 'pr-32'}
                 md:w-[100px] lg:w-[336px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none`}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={handleInputChange}
            />

        </div>
    );
}
