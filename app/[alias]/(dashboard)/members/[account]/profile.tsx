"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MemberT } from '@/services/chain-db/members'
import { CommunityConfig, Config, checkUsernameAvailability } from '@citizenwallet/sdk'
import { PenLine, Save, Trash2, Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useDebounce } from 'use-debounce'
import type { Profile } from "./action"
import { deleteProfileAction, updateProfileAction, updateProfileImageAction } from "./action"

export default function Profile({
    memberData,
    hasAdminRole,
    config,
    type,
    account
}: {
    memberData: MemberT,
    hasAdminRole: boolean,
    config: Config,
    type: 'edit' | 'new',
    account: string
}) {
    const community = useMemo(() => new CommunityConfig(config), [config]);
    const [isEditing, setIsEditing] = useState(
        type === 'edit' ? false : true
    );

    const [userData, setUserData] = useState({
        username: type === 'edit' ? memberData.username : '',
        name: type === 'edit' ? memberData.name : '',
        description: type === 'edit' ? memberData.description : '',
        avatarUrl: type === 'edit' ? memberData.image : '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [usernameEdit, setUsernameEdit] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [debouncedUsername] = useDebounce(userData.username, 1000);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEdit = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        if (debouncedUsername && usernameEdit) {
            const checkUsername = async () => {

                if (debouncedUsername == memberData.username) { // <-- username is taken by current user
                    return;
                }

                try {
                    const isAvailable = await checkUsernameAvailability(community, debouncedUsername);
                    if (!isAvailable) {
                        toast.error('Username is already taken')
                        setIsAvailable(false)
                    } else {
                        setIsAvailable(true)
                    }
                } catch (error) {
                    console.error('Error checking username availability:', error);
                }
            };

            checkUsername();
        }
    }, [debouncedUsername, usernameEdit, community, memberData.username]);

    //handle the edit profile data saved
    const handleSave = async () => {

        try {
            setIsLoading(true);
            if (userData.username === memberData.username &&
                userData.name === memberData.name &&
                userData.description === memberData.description &&
                userData.avatarUrl === memberData.image) {

                toast.error('No changes to save');
                setIsLoading(false);
                return
            }

            if (!isAvailable) {
                toast.error('Username is already taken,You can not save it');
                setIsLoading(false);
                return
            }
            //default image
            let cid = memberData.image;

            if (userData.avatarUrl != memberData.image) {

                if (!imageFile) {
                    toast.error('Please upload an image')
                    setIsLoading(false);
                    return
                }

                const response = await updateProfileImageAction(imageFile, community.community.alias);
                cid = response.IpfsHash;
            }

            const profile: Profile = {
                account: memberData.account,
                description: userData.description || "",
                image: `ipfs://${cid}`,
                image_medium: `ipfs://${cid}`,
                image_small: `ipfs://${cid}`,
                name: userData.name || "",
                username: userData.username,
            };

            await updateProfileAction(profile, config.community.alias, config);
            toast.success('Profile updated successfully');

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setIsEditing(false);
            setIsLoading(false);
        }


    }

    //handle the delete profile
    const handleDelete = () => {
        toast.custom((t) => (
            <div className="flex flex-col gap-2 bg-background p-2 rounded-lg border">
                <h3 className="font-semibold text-base">Delete Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This will permanently delete this member profile.
                </p>
                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" onClick={() => toast.dismiss(t)}>Cancel</Button>
                    <Button
                        variant="destructive"
                        onClick={async () => {
                            await deleteProfileAction(
                                userData.avatarUrl, config.community.alias, config, memberData.account
                            );
                            toast.success('Profile deleted successfully');
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        ));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        if (id === 'username') {
            setUsernameEdit(true)
        } else {
            setUsernameEdit(false)
        }
        setUserData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const imageUrl = URL.createObjectURL(file)
            setUserData(prev => ({
                ...prev,
                avatarUrl: imageUrl
            }))
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    //handle the new member profile save
    const handleAddMember = async () => {
        try {
            setIsLoading(true);

            if (userData.username === '' &&
                userData.name === '') {

                toast.error('Please enter a username and name');
                setIsLoading(false);
                return
            }

            if (!isAvailable) {
                toast.error('Username is already taken,You can not save it');
                setIsLoading(false);
                return
            }
            //default image
            let cid = 'QmZjzYmcbxj6Yr9EBmuMu3knYd25oYvnTu92yLWhiajvMr';

            if (userData.avatarUrl) {

                if (!imageFile) {
                    toast.error('Please upload an image')
                    setIsLoading(false);
                    return
                }

                const response = await updateProfileImageAction(imageFile, community.community.alias);
                cid = response.IpfsHash;
            }

            const profile: Profile = {
                account: account,
                description: userData.description || "",
                image: `ipfs://${cid}`,
                image_medium: `ipfs://${cid}`,
                image_small: `ipfs://${cid}`,
                name: userData.name || "",
                username: userData.username,
            };


            await updateProfileAction(profile, config.community.alias, config);
            toast.success('Profile updated successfully');


        } catch (error) {
            console.error('Error adding member:', error);
            toast.error('Error updating profile');

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="shadow-lg border-0">

            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                            <AvatarFallback>
                                <User className="h-12 w-12" />
                            </AvatarFallback>
                        </Avatar>
                        {type === 'edit' && (
                            <p className="text-sm text-gray-500">@{memberData.username}</p>
                        )}
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
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    placeholder="Username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`bg-white ${isAvailable ? '' : 'border-red-500'}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Tell us about yourself"
                                value={userData.description}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="min-h-[120px] bg-white resize-none"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* it can access only admin and community owner  */}
            {hasAdminRole && type === 'edit' && (
                <CardFooter className="flex justify-between pt-6">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                className="gap-2"
                                disabled={!isAvailable}
                            >
                                <Save className="h-4 w-4" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setUsernameEdit(false);
                                setUserData({
                                    username: memberData.username,
                                    name: memberData.name,
                                    description: memberData.description,
                                    avatarUrl: memberData.image,
                                })
                                setIsAvailable(true);
                            }}>
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleEdit} variant="outline" className="gap-2">
                            <PenLine className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}

                    <Button variant="destructive" onClick={handleDelete} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                    </Button>
                </CardFooter>
            )}

            {/* if the type is new, show the cancel and add member button */}
            {type === 'new' && (
                <CardFooter className="flex justify-between pt-6">
                    <Button variant="destructive" className="gap-2" onClick={() => {
                        router.push(`/${config.community.alias}/members`);
                    }}>
                        Cancel
                    </Button>

                    <Button variant="outline" className="gap-2" disabled={!isAvailable} onClick={handleAddMember}>
                        {isLoading ? 'Saving...' : 'Add Member'}
                    </Button>
                </CardFooter>
            )}

        </Card>

    )
}
