'use client'

import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";


export const IconUpload = ({ value, onChange }: { value?: File | string; onChange: (file?: File | string) => void }) => {
    const [preview, setPreview] = useState<string | null>(null);

    // Set initial preview if there's an existing logo URL
    useEffect(() => {
        if (typeof value === 'string' && value) {
            setPreview(value);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.match(/^image\/(svg\+xml|png)$/)) {
                toast.error('Please select a .svg or .png file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
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
                            <Image
                                src={preview}
                                alt="Logo preview"
                                className="max-w-full max-h-full object-contain"
                                width={100}
                                height={100}
                                priority
                            />
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
                                <span className="font-semibold">Click to upload</span> your icon
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
            {value && typeof value === 'object' && (
                <p className="text-sm text-gray-600">
                    Selected: {value.name} ({(value.size / 1024).toFixed(1)} KB)
                </p>
            )}
            {value && typeof value === 'string' && (
                <p className="text-sm text-gray-600">
                    Current logo: {value}
                </p>
            )}
        </div>
    );
};
