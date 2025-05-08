"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import Image from "next/image";
import { useState } from 'react';

const PRESET_AMOUNTS = [10, 20, 50, 100];

export default function Onramp({ image }: { image: string }) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [addressTouched, setAddressTouched] = useState(false);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        if (!addressTouched) setAddressTouched(true);
    };

    const handleAddressBlur = () => {
        setAddressTouched(true);
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers and decimals
        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
            setCustomAmount(value);
            setSelectedAmount(null);
        }
    };

    const isValidEthereumAddress = (address: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const handlePresetClick = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };
    const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidEthereumAddress(address) || !finalAmount) return;

        try {
            setLoading(true);

            let amount = parseFloat(customAmount) * 100;
            if (selectedAmount) {
                amount = selectedAmount * 100;
            }
            // the pass ontramp
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const showAddressError = addressTouched && !isValidEthereumAddress(address);

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
                        value={address}
                        onChange={handleAddressChange}
                        onBlur={handleAddressBlur}
                        className={cn(
                            "w-full",
                            showAddressError &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <Label>Select Amount</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {PRESET_AMOUNTS.map((amount) => (
                            <Button
                                key={amount}
                                type="button"
                                onClick={() => handlePresetClick(amount)}
                                variant={selectedAmount === amount ? "default" : "outline"}
                                className={cn(
                                    "p-4 text-lg h-auto",
                                    selectedAmount === amount && "bg-black hover:bg-black/90"
                                )}
                            >
                                <Image
                                    src={image}
                                    alt="Currency"
                                    width={20}
                                    height={20}
                                    className="inline-block"
                                />
                                <span className="text-xl font-bold">{amount}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customAmount">Custom Amount</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Image
                                    src={image}
                                    alt="Currency"
                                    width={16}
                                    height={16}
                                    className="inline-block"
                                />
                            </div>
                            <Input
                                key="customAmount"
                                type="text"
                                className="pl-12"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") {
                                        return;
                                    }

                                    if (!isValidEthereumAddress(address) || !finalAmount) {
                                        return;
                                    }

                                    handleSubmit(e);
                                }}
                            />
                        </div>
                    </div>
                </div>


                <Button
                    type="submit"
                    disabled={!isValidEthereumAddress(address) || !finalAmount}
                    className={cn(
                        "w-full py-4 text-lg h-auto",
                        finalAmount && "bg-black hover:bg-black/90"
                    )}
                >
                    {finalAmount ? (
                        <>
                            Top up{" "}
                            <Image
                                src={image}
                                alt="Currency"
                                width={20}
                                height={20}
                                className="inline-block mx-2"
                            />
                            <span className="text-xl font-bold">{finalAmount}</span>
                        </>
                    ) : (
                        "Select an amount"
                    )}
                    {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>

            </form>
        </div>
    )
}
