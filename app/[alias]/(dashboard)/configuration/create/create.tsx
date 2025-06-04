'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload } from 'lucide-react';


export default function CreateForm({ alias }: { alias: string }) {


    return (
        <div className="w-full h-full">
            <div className="flex items-left space-x-4">

                <div>
                    <h1 className="text-2xl font-bold">Create Your Own Currency</h1>
                    <p className="text-muted-foreground">Design your community token</p>
                </div>
            </div>

            <Card className="w-full h-full mt-10 border-none">
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="tokenName">Name</Label>
                        <Input
                            id="tokenName"
                            placeholder="My Token"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tokenSymbol">Symbol (typically 2-4 characters)</Label>
                        <Input
                            id="tokenSymbol"
                            placeholder="MYT"
                            maxLength={4}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="createIcon">Icon</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="createIcon"
                                type="file"
                                accept=".png,.svg"
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => document.getElementById('createIcon')?.click()}
                                className="flex items-center space-x-2"
                            >
                                <Upload className="h-4 w-4" />
                                <span>Upload Icon</span>
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Supported formats: PNG, SVG (max 5MB)
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end items-end">
                        <Button className="w-full md:w-96">
                            Create Configuration
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

}