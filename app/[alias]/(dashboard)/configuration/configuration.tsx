'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function ConfigurationPage({ alias }: { alias: string }) {

    const router = useRouter();

    return (
        <div className="w-full h-full">
            <div className="text-left space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Currency Configuration</h1>
                <p className="text-muted-foreground">
                    Choose how you want to set up your community currency
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-10 p-4">
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                    onClick={
                        () => {
                            router.push(`/${alias}/configuration/byoc`);
                        }
                    }>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Image src="/icon/BYOC.png" alt="BYOC" width={24} height={24} />
                            </div>
                            <div>
                                <CardTitle>Bring your own currency (BYOC)</CardTitle>
                                <Badge variant="secondary" className="mt-1">ERC20 Token</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                            Provide the address of your ERC20 token. It must be on the same chain as the chain on which your community was configured.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                    onClick={
                        () => {
                            router.push(`/${alias}/configuration/create`);
                        }
                    }>
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Image src="/icon/Create_currency.png" alt="Create Currency" width={24} height={24} />
                            </div>
                            <div>
                                <CardTitle>Create your own currency</CardTitle>
                                <Badge variant="secondary" className="mt-1">New Token</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm leading-relaxed">
                            Provide some basic information and get started with your very own community currency.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
