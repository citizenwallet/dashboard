"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CommunityConfig, Config, checkUsernameAvailability } from '@citizenwallet/sdk'
import { Upload, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { useDebounce } from 'use-debounce'
import type { Profile } from "../action"
import { updateProfileAction, updateProfileImageAction } from "../action"

export default function Profile({

    config,
    account
}: {


    config: Config,
    account: string
}) {
    const community = useMemo(() => new CommunityConfig(config), [config]);

    const [userData, setUserData] = useState({
        username: '',
        name: '',
        description: '',
        avatarUrl: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [usernameEdit, setUsernameEdit] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [debouncedUsername] = useDebounce(userData.username, 1000);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


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

            console.log(profile);
            await updateProfileAction(profile, config.community.alias, config);
            toast.success('Profile updated successfully');

            //call to API to add member

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
                                className="min-h-[120px] bg-white resize-none"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>


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

        </Card>

    )
}