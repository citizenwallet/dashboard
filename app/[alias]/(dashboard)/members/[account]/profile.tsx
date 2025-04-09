"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenLine, Save, Trash2, Upload, User } from "lucide-react"
import { useState } from "react"
import { MemberT } from '@/services/chain-db/members';

export default function Profile({ memberData, hasAdminRole }: { memberData: MemberT, hasAdminRole: boolean }) {

    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        username: memberData.username,
        name: memberData.name,
        bio: memberData.description,
        avatarUrl: memberData.image,
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)

    }

    const handleDelete = () => {

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [id]: value,
        }))
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
                        <Button variant="outline" size="sm" className="text-xs" disabled={!isEditing}>
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
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
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
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself"
                                value={userData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="min-h-[120px] bg-white resize-none"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* it can access only admin or owner  */}
            {hasAdminRole && (
                <CardFooter className="flex justify-between pt-6">
                    {isEditing ? (
                        <div className="flex gap-3">
                            <Button onClick={handleSave} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
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
