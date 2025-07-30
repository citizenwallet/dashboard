'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  BundlerService,
  CommunityConfig,
  Config,
  checkUsernameAvailability,
  waitForTxSuccess
} from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import * as z from 'zod';
import type { Profile } from '../action';
import { pinJsonToIPFSAction, updateProfileImageAction } from '../action';
import { Wallet } from 'ethers';
import { useSession } from 'state/session/action';

const profileFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().optional(),
  description: z.string().optional()
});

export default function Profile({
  config,
  account,
  hasProfileAdminRole
}: {
  config: Config;
  account: string;
  hasProfileAdminRole: boolean;
}) {
  const community = useMemo(() => new CommunityConfig(config), [config]);
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [usernameEdit, setUsernameEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, sessionActions] = useSession(config);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      name: '',
      description: ''
    }
  });

  const username = form.watch('username');
  const [debouncedUsername] = useDebounce(username, 1000);

  useEffect(() => {
    if (debouncedUsername && usernameEdit) {
      const checkUsername = async () => {
        try {
          const isAvailable = await checkUsernameAvailability(
            community,
            debouncedUsername
          );
          if (!isAvailable) {
            toast.error('Username is already taken');
            setIsAvailable(false);
          } else {
            setIsAvailable(true);
          }
        } catch (error) {
          console.error('Error checking username availability:', error);
        }
      };

      checkUsername();
    }
  }, [debouncedUsername, usernameEdit, community]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);

      if (!values.username || !values.name) {
        toast.error('Please enter a username and name');
        setIsLoading(false);
        return;
      }

      if (!isAvailable) {
        toast.error('Username is already taken, you cannot save it');
        setIsLoading(false);
        return;
      }

      // Default image
      let cid = 'QmZjzYmcbxj6Yr9EBmuMu3knYd25oYvnTu92yLWhiajvMr';

      if (imageFile) {
        const response = await updateProfileImageAction(
          imageFile,
          community.community.alias
        );
        cid = response.IpfsHash;
      }

      const profile: Profile = {
        account,
        description: values.description || '',
        image: `ipfs://${cid}`,
        image_medium: `ipfs://${cid}`,
        image_small: `ipfs://${cid}`,
        name: values.name || '',
        username: values.username
      };

      const result = await pinJsonToIPFSAction(profile);
      const profileCid = result.IpfsHash;

      const privateKey = sessionActions.storage.getKey('session_private_key');
      const signerAccountAddress = await sessionActions.getAccountAddress();

      if (!privateKey || !signerAccountAddress) {
        toast.error('Please login to add a member');
        setIsLoading(false);
        router.push(`/${config.community.alias}/login`);
        return;
      }

      const signer = new Wallet(privateKey);

      const bundler = new BundlerService(community);

      const txHash = await bundler.setProfile(
        signer,
        signerAccountAddress,
        profile.account,
        profile.username,
        profileCid
      );

      await waitForTxSuccess(community, txHash);

      await new Promise((resolve) => setTimeout(resolve, 250));

      toast.success('Profile added successfully');
      router.push(`/${config.community.alias}/members`);
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={form.watch('name')} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={triggerFileInput}
                type="button"
              >
                <Upload className="mr-2 h-3 w-3" />
                Change photo
              </Button>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            setUsernameEdit(true);
                            field.onChange(e);
                          }}
                          className={`bg-white ${isAvailable ? '' : 'border-red-500'}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="min-h-[120px] bg-white resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      {hasProfileAdminRole && (
        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => {
              router.push(`/${config.community.alias}/members`);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            disabled={!isAvailable || isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? 'Saving...' : 'Add Member'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
