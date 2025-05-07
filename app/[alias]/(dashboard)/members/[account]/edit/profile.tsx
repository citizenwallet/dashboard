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
import { MemberT } from '@/services/chain-db/members';
import {
  CommunityConfig,
  Config,
  checkUsernameAvailability
} from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenLine, Save, Trash2, Upload, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import * as z from 'zod';
import type { Profile } from '../action';
import {
  deleteProfileAction,
  updateProfileAction,
  updateProfileImageAction
} from '../action';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().optional(),
  description: z.string().optional()
});

export default function Profile({
  memberData,
  hasAdminRole,
  config
}: {
  memberData?: MemberT;
  hasAdminRole: boolean;
  config: Config;
}) {
  const community = useMemo(() => new CommunityConfig(config), [config]);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: memberData?.username || '',
      name: memberData?.name || '',
      description: memberData?.description || ''
    }
  });

  const [userData, setUserData] = useState({
    username: memberData?.username,
    name: memberData?.name,
    description: memberData?.description,
    avatarUrl: memberData?.image
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [usernameEdit, setUsernameEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [debouncedUsername] = useDebounce(form.watch('username'), 300);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (debouncedUsername && usernameEdit && isEditing) {
      const checkUsername = async () => {
        if (debouncedUsername === memberData?.username) {
          setIsAvailable(true);
          return;
        }

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
  }, [
    debouncedUsername,
    usernameEdit,
    isEditing,
    community,
    memberData?.username
  ]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (
        values.username === memberData?.username &&
        values.name === memberData?.name &&
        values.description === memberData?.description &&
        userData.avatarUrl === memberData?.image
      ) {
        toast.error('No changes to save');
        setIsLoading(false);
        return;
      }
      const cidPath = new URL(memberData?.image || '').pathname;
      let cid = cidPath.slice(1);

      if (userData.avatarUrl != memberData?.image) {
        if (!imageFile) {
          toast.error('Please upload an image');
          setIsLoading(false);
          return;
        }

        const response = await updateProfileImageAction(
          imageFile,
          community.community.alias
        );
        cid = response.IpfsHash;
      }

      const profile: Profile = {
        account: memberData?.account || '',
        description: values.description || '',
        image: `ipfs://${cid}`,
        image_medium: `ipfs://${cid}`,
        image_small: `ipfs://${cid}`,
        name: values.name || '',
        username: values.username || ''
      };

      await updateProfileAction(profile, config.community.alias, config);

      toast.success('Profile updated successfully', {
        onAutoClose: () => {
          router.push(`/${config.community.alias}/members`);
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  //handle the delete profile
  const handleDelete = () => {
    toast.custom((t) => (
      <div className="flex flex-col gap-2 bg-background p-2 rounded-lg border">
        <h3 className="font-semibold text-base">Delete Profile</h3>
        <p className="text-sm text-muted-foreground">
          This will permanently delete this member profile.
        </p>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await deleteProfileAction(
                userData.avatarUrl || '',
                config.community.alias,
                config,
                memberData?.account || ''
              );
              setIsLoading(false);
              toast.success('Profile deleted successfully', {
                onAutoClose: () => {
                  router.push(`/${config.community.alias}/members`);
                }
              });
            }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUserData((prev) => ({
        ...prev,
        avatarUrl: imageUrl
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-lg border-0">
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userData.avatarUrl}
                  alt={form.watch('name')}
                />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>

              <p className="text-sm text-gray-500">@{memberData?.username}</p>

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
                disabled={!isEditing}
                onClick={triggerFileInput}
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
                          disabled={!isEditing}
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
                        <Input
                          placeholder="Your name"
                          {...field}
                          disabled={!isEditing}
                        />
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
                        {...field}
                        disabled={!isEditing}
                        className="min-h-[120px] bg-white resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </CardContent>

      {/* it can access only admin and community owner  */}
      {hasAdminRole && (
        <CardFooter className="flex justify-between pt-6">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="gap-2"
                disabled={!isAvailable || isLoading}
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setUsernameEdit(false);
                  form.reset();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="gap-2"
              disabled={isLoading}
            >
              <PenLine className="h-4 w-4" />
              Edit Profile
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-2"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
