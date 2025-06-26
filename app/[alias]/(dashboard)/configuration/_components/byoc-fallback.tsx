import { Skeleton } from '@/components/ui/skeleton';

export default function ByocFallback() {
    return (
        <>
            <div className="w-full h-full">
                <div className="flex items-left space-x-4">
                    <div>
                        <h1 className="text-2xl font-bold">Bring Your Own Currency</h1>
                        <p className="text-muted-foreground">Configure your existing ERC20 token</p>
                    </div>
                </div>

                <div className="w-full h-full mt-10 border rounded-lg p-6">
                    <div className="space-y-6">
                        {/* Token Address Field Skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-64" />
                        </div>

                        {/* Icon Upload Field Skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                                <Skeleton className="h-12 w-12 rounded mb-4" />
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-3 w-96" />
                        </div>

                        <div className="pt-4 flex justify-end items-end">
                            <Skeleton className="h-10 w-full md:w-96" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
