"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Palette, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Form validation schema
const profileFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters'),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    custom_domain: z.string().optional(),
    logo: z.any().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color').default('#3B82F6'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Color picker component
const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const presetColors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
        '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
    ];

    const handleColorChange = (color: string) => {
        setLocalValue(color);
        onChange(color);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-12 h-10 p-0 border-2"
                        style={{ backgroundColor: value }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Pick a color</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="color-input" className="text-sm font-medium">
                                Hex Color
                            </Label>
                            <Input
                                id="color-input"
                                type="text"
                                value={localValue}
                                onChange={handleInputChange}
                                placeholder="#3B82F6"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Preset Colors</Label>
                            <div className="grid grid-cols-6 gap-2 mt-2">
                                {presetColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={cn(
                                            "w-8 h-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform",
                                            value === color && "ring-2 ring-blue-500 ring-offset-2"
                                        )}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                type="text"
                value={localValue}
                onChange={handleInputChange}
                placeholder="#3B82F6"
                className="flex-1"
            />
        </div>
    );
};

// File upload component for logo
const LogoUpload = ({ value, onChange }: { value?: File; onChange: (file?: File) => void }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match(/^image\/(svg\+xml|png)$/)) {
                alert('Please select a .svg or .png file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            onChange(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange(undefined);
        setPreview(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {preview ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img src={preview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleRemove}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> your logo
                            </p>
                            <p className="text-xs text-gray-500">SVG or PNG (MAX. 5MB)</p>
                        </div>
                    )}
                    <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        accept=".svg,.png"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            {value && (
                <p className="text-sm text-gray-600">
                    Selected: {value.name} ({(value.size / 1024).toFixed(1)} KB)
                </p>
            )}
        </div>
    );
};

export default function ProfilePage({ alias }: { alias: string }) {


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: '',
            description: '',
            url: '',
            custom_domain: '',
            color: '#3B82F6',
        },
    });

    const customDomain = form.watch('custom_domain');
    const displayDomain = customDomain && customDomain.trim()
        ? customDomain
        : `${alias}.citizenwallet.xyz`;

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            console.log('Form submitted:', data);

            // Handle logo upload to Supabase bucket
            if (data.logo) {
                // TODO: Implement Supabase storage upload
                console.log('Uploading logo to Supabase bucket...');
            }

            // TODO: Save profile data
            console.log('Saving profile data...');

            // Show success message
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const clearCustomDomain = () => {
        form.setValue('custom_domain', '');
    };

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description Field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us about yourself or your organization"
                                    className="min-h-[100px] resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Brief description that will be displayed on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* URL Field */}
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your website or social media profile URL.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Custom Domain Field */}
                <FormField
                    control={form.control}
                    name="custom_domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custom Domain</FormLabel>
                            <FormControl>
                                <div className="flex space-x-2">
                                    <Input placeholder="yourdomain.com" {...field} />
                                    {customDomain && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={clearCustomDomain}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Your profile will be accessible at: <strong>{displayDomain}</strong>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Logo Upload Field */}
                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <FormControl>
                                <LogoUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload your logo in SVG or PNG format. It will be stored securely in our storage.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Color Picker Field */}
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center space-x-2">
                                <Palette className="w-4 h-4" />
                                <span>Brand Color</span>
                            </FormLabel>
                            <FormControl>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormDescription>
                                Choose your brand color. Click the color box to open the color picker.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <div className="pt-4 flex justify-end items-end">
                    <Button type="submit" className="w-full md:w-96">
                        Update Profile
                    </Button>
                </div>
            </form>
        </Form>

    );
}
