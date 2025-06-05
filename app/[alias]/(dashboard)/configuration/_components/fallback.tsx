import { Skeleton } from '@/components/ui/skeleton';

export default function Fallback() {
    return (
        <div className="w-full h-full">
            <div className="text-left space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Currency Configuration</h1>
                <p className="text-muted-foreground">
                    Choose how you want to set up your community currency
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-10 p-4">
                {/* First Card Skeleton */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </div>
                </div>

                {/* Second Card Skeleton */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-56" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
