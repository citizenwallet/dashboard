"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PenLine, Save, Trash2, Upload, User } from "lucide-react"

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        username: "meadow_richardson",
        name: "Meadow Richardson",
        bio: "Product designer based in San Francisco. I enjoy creating intuitive, accessible interfaces that help people get things done.",
        avatarUrl: "/placeholder.svg?height=96&width=96",
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
        </Card>

    )
}
