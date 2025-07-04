"use client";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Config } from '@citizenwallet/sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy, Loader2, Palette } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ColorPicker } from './_components/colorPicker';
import { LogoUpload } from './_components/logoUpload';
import { updateProfileAction, uploadItemImageAction } from './action';
import { isEmpty } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Form validation schema
const profileFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters'),
    url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    custom_domain: z.string(),
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

    const [isLoading, setIsLoading] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);
    const router = useRouter();

    const copyDomainToClipboard = async (domain: string) => {
        try {
            await navigator.clipboard.writeText(domain);
            setCopiedDomain(true);
            toast.success('Domain copied to clipboard!');
            setTimeout(() => setCopiedDomain(false), 2000);
        } catch (error) {
            console.error('Error copying domain:', error);
            toast.error('Failed to copy domain');
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            setIsLoading(true);

            const currencyActive = (isEmpty(config.community.primary_token.address) && isEmpty(config.community.profile.address));

            // Handle logo upload to Supabase bucket or keep existing logo
            let logoUrl = config.community.logo;
            let logoChanged = false;

            if (data.logo && data.logo instanceof File) {
                logoUrl = await uploadItemImageAction(data.logo, config.community.alias);
                logoChanged = true;
            }

            // Prepare the profile data with the correct logo URL
            const profileData = {
                ...data,
                logo: logoUrl
            };

            // Check if any data has changed compared to original config
            const hasChanges =
                data.name !== config.community.name ||
                data.description !== config.community.description ||
                data.url !== config.community.url ||
                data.custom_domain !== (config.community.custom_domain || `${config.community.alias}.citizenwallet.xyz`) ||
                data.color !== config.community.theme?.primary ||
                logoChanged;

            if (!hasChanges) {
                toast.error('No changes were made to save.');
                return;
            }

            // Create updated config with new community data
            const defaultDomain = `${config.community.alias}.citizenwallet.xyz`;
            const updatedCommunity = {
                ...config.community,
                name: profileData.name,
                description: profileData.description,
                url: profileData.url || config.community.url,
                logo: profileData.logo,
                theme: {
                    ...config.community.theme,
                    primary: profileData.color
                },
                // Only set custom_domain if it's different from the default
                ...(profileData.custom_domain && profileData.custom_domain !== defaultDomain && {
                    custom_domain: profileData.custom_domain
                })
            };

            const updatedConfig: Config = {
                ...config,
                community: updatedCommunity
            };

            // Update the profile in the database
            await updateProfileAction(updatedConfig, config.community.alias);

            // Show success message
            toast.success(`Profile updated successfully!`);
            if (currencyActive) {
                router.push(`/${config.community.alias}/configuration`)
            } else {
                window.location.reload();
            }


        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
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
                                    <>You have set a custom domain. Your community will be accessible at: <strong>{form.getValues('custom_domain')}</strong></>
                                ) : (
                                    <>No custom domain set. Your community will be accessible at: <strong>{form.getValues('custom_domain')}</strong></>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => copyDomainToClipboard(form.getValues('custom_domain'))}
                                >
                                    {copiedDomain ? (
                                        <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>

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
                    <Button type="submit" className="w-full md:w-96" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            'Update Profile'
                        )}
                    </Button>
                </div>
            </form>
        </Form>

    );
}
