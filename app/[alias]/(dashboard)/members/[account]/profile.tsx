"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenLine, Save, Trash2, Upload, User } from "lucide-react"
import { useState, useRef, useEffect, useMemo } from "react"
import { MemberT } from '@/services/chain-db/members';
import { useDebounce } from 'use-debounce';
import { Config, CommunityConfig, checkUsernameAvailability, BundlerService } from '@citizenwallet/sdk';
import { toast } from "sonner"
import { updateProfileAction, updateProfileImageAction } from "./action"
import type { Profile } from "./action";

export default function Profile({
    memberData,
    hasAdminRole,
    config
}: {
    memberData: MemberT,
    hasAdminRole: boolean,
    config: Config
}) {
    const community = useMemo(() => new CommunityConfig(config), [config]);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: memberData.username,
        name: memberData.name,
        description: memberData.description,
        avatarUrl: memberData.image,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [usernameEdit, setUsernameEdit] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [debouncedUsername] = useDebounce(userData.username, 1000);
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        if (debouncedUsername && usernameEdit) {
            const checkUsername = async () => {

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
    }, [debouncedUsername, usernameEdit, community]);

    const handleSave = async () => {

        try {

            if (userData.username === memberData.username &&
                userData.name === memberData.name &&
                userData.description === memberData.description &&
                userData.avatarUrl === memberData.image) {

                toast.error('No changes to save')
                return
            }

            if (!isAvailable) {
                toast.error('Username is already taken,You can not save it')
                return
            }
            //default image
            let cid = 'QmZjzYmcbxj6Yr9EBmuMu3knYd25oYvnTu92yLWhiajvMr';

            if (userData.avatarUrl != memberData.image) {

                if (!imageFile) {
                    toast.error('Please upload an image')
                    return
                }

                const response = await updateProfileImageAction(imageFile, config.community.alias);
                cid = response.IpfsHash;
            }

            const profile: Profile = {
                account: memberData.account,
                description: userData.description || "",
                image: cid,
                image_medium: cid,
                image_small: cid,
                name: userData.name || "",
                username: userData.username,
            };

            const result = await updateProfileAction(profile, config.community.alias);
            console.log(result)
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setIsEditing(false);
        }



    }

    const handleDelete = () => {

    }

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
                        <p className="text-sm text-gray-500">@{memberData.username}</p>
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
            {hasAdminRole && (
                <CardFooter className="flex justify-between pt-6">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button onClick={handleSave} className="gap-2">
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
        </Card>

    )
}
