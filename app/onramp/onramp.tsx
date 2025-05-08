"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const PRESET_AMOUNTS = [10, 20, 50, 100];

export default function Onramp() {
    return (
        <div className="w-full max-w-md mx-auto px-4 mt-4">
            <form className="space-y-6">
                <h2 className="text-2xl font-bold">Top Up Account</h2>

                <div className="space-y-2">
                    <Label htmlFor="address" className="flex justify-between">
                        <span>Account Address</span>

                    </Label>
                    <Input
                        id="address"
                        placeholder="Enter address (0x...)"
                        className="w-full"

                    />
                </div>

                <div className="space-y-4">
                    <Label>Select Amount</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {PRESET_AMOUNTS.map((amount) => (
                            <Button
                                key={amount}
                                type="button"
                                variant="default"
                                className={cn(
                                    "p-4 text-lg h-auto"
                                )}
                            >

                                <span className="text-xl font-bold">{amount}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customAmount">Custom Amount</Label>
                        <div className="relative">
                            <Input
                                key="customAmount"
                                type="text"
                                className="pl-12"
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                </div>


            </form>
        </div>
    )
}
