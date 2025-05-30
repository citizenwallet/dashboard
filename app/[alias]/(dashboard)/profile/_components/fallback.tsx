import { Skeleton } from '@/components/ui/skeleton';
import { Palette } from 'lucide-react';

export default function Fallback() {
    return (
        <div className="space-y-6">
            {/* Name Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name
                </label>
                <Skeleton className="h-10 w-full" /> {/* Input */}
            </div>

            {/* Description Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                </label>
                <Skeleton className="h-[100px] w-full" /> {/* Textarea */}
                <p className="text-sm text-muted-foreground">
                    Brief description that will be displayed on your profile.
                </p>
            </div>

            {/* URL Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Website URL
                </label>
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <p className="text-sm text-muted-foreground">
                    Your website or social media profile URL.
                </p>
            </div>

            {/* Custom Domain Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Custom Domain
                </label>
                <div className="flex space-x-2">
                    <Skeleton className="h-10 flex-1" /> {/* Input */}
                    <Skeleton className="h-10 w-10" /> {/* Clear button */}
                </div>
                <p className="text-sm text-muted-foreground">
                    Your profile will be accessible at: <strong>loading...</strong>
                </p>
            </div>

            {/* Logo Upload Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Logo
                </label>
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-lg" /> {/* Upload area */}
                    <p className="text-sm text-muted-foreground">
                        Upload your logo in SVG or PNG format. It will be stored securely in our storage.
                    </p>
                </div>
            </div>

            {/* Color Picker Field Skeleton */}
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2">
                    <Palette className="w-4 h-4" />
                    <span>Brand Color</span>
                </label>
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-12" /> {/* Color box */}
                    <Skeleton className="h-10 flex-1" /> {/* Input */}
                </div>
                <p className="text-sm text-muted-foreground">
                    Choose your brand color. Click the color box to open the color picker.
                </p>
            </div>

            {/* Submit Button Skeleton */}
            <div className="pt-4">
                <Skeleton className="h-11 w-full" /> {/* Submit button */}
            </div>
        </div>
    );
}
