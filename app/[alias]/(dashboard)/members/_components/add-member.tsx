'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Config } from '@citizenwallet/sdk';
import { ethers } from 'ethers';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { searchAccountAddressAction } from '../action';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';

export default function AddMember({ config }: { config: Config }) {
  const router = useRouter();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [isFound, setIsFound] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    const member = await searchAccountAddressAction({
      config,
      address: term
    });

    setValidAddress(ethers.isAddress(term));
    setAddress(term);
    setIsFound(member ? true : false);
    setIsSearching(false);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    handleSearch(e.target.value);
  };

  const goToAddMember = (address: string) => {
    router.push(`members/${address}/add`);
  };

  const goToEditMember = (address: string) => {
    router.push(`members/${address}/edit`);
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setAddress('');
    setValidAddress(false);
    setIsFound(false);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-start mb-4">
          <Button>
            <Plus size={16} />
            Add Member
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create profile</DialogTitle>
          <DialogDescription>Add a new profile</DialogDescription>
        </DialogHeader>
        <Label htmlFor="memberAccount" className="text-sm font-medium">
          Enter account address
        </Label>
        {!validAddress && address && (
          <p className="text-sm text-red-500">Invalid account address</p>
        )}
        <div className="relative">
          <div className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>
          <Input
            name="query"
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
            onChange={handleInputChange}
          />
        </div>
        <DialogFooter>
          {validAddress &&
            (isFound ? (
              <Button
                className="mb-2 md:mb-0"
                onClick={() => {
                  goToEditMember(address);
                }}
              >
                Edit
              </Button>
            ) : (
              <Button
                className="mb-2 md:mb-0"
                onClick={() => {
                  goToAddMember(address);
                }}
              >
                <Plus size={16} />
                Add
              </Button>
            ))}
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
