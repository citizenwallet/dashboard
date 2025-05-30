"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Config } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ColorPicker } from './_components/colorPicker';
import { LogoUpload } from './_components/logoUpload';

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

export default function ProfilePage({ config }: { config: Config }) {

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: config.community.name,
            description: config.community.description,
            url: config.community.url,
            custom_domain: config.community.custom_domain || `${config.community.alias}.citizenwallet.xyz`,
            color: config.community.theme?.primary,
            logo: config.community.logo,
        },
    });


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
                                </div>
                            </FormControl>
                            <FormDescription>
                                {config.community.custom_domain ? (
                                    <>You have set a custom domain. Your profile will be accessible at: <strong>{config.community.custom_domain}</strong></>
                                ) : (
                                    <>No custom domain set. Your profile will be accessible at: <strong>{config.community.alias}.citizenwallet.xyz</strong></>
                                )}
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
