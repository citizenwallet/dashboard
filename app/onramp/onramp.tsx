'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ProfileWithTokenId } from '@citizenwallet/sdk';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getTokenPriceAction } from './action';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/navigation';

const PRESET_AMOUNTS = [100, 200, 500, 1000];

interface TopUpSelectorProps {
  connectedAccount?: string;
  connectedProfile?: ProfileWithTokenId | null;
  image: string;
  closeUrl?: string;
}

export default function Onramp({
  image,
  connectedAccount,
  connectedProfile,
  closeUrl
}: TopUpSelectorProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [address, setAddress] = useState(connectedAccount || '');
  const [loading, setLoading] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [cost, setCost] = useState(0);
  const [costLoading, setCostLoading] = useState(false);
  const router = useRouter();

  const debouncedEstimateCost = useDebouncedCallback((value: string) => {
    if (value) {
      estimateCost(parseFloat(value));
    }
  }, 500);

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
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      debouncedEstimateCost(value);
    }
  };

  const isValidEthereumAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handlePresetClick = async (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    await estimateCost(amount);
  };
  const finalAmount =
    selectedAmount || (customAmount ? parseFloat(customAmount) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const amount = selectedAmount ? selectedAmount : parseFloat(customAmount);

      let onrampUrl = `/onramp/pay?account=${address}&amount=${amount}`;
      if (closeUrl) {
        onrampUrl += `&closeUrl=${closeUrl}`;
      }
      router.push(onrampUrl);

      // the pass ontramp
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const estimateCost = async (finalAmount: number) => {
    setCostLoading(true);
    const price = await getTokenPriceAction(finalAmount);
    setCost(price);
    setCostLoading(false);
  };

  const showAddressError = addressTouched && !isValidEthereumAddress(address);

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-4">
      <form className="space-y-6">
        <h2 className="text-2xl font-bold">Top Up Account</h2>

        {connectedAccount && connectedProfile && (
          <div className="flex items-center gap-4">
            <Image
              src={connectedProfile.image}
              alt={connectedProfile.name}
              width={20}
              height={20}
              className="rounded-full h-8 w-8 object-cover"
            />
            {connectedProfile.name ? (
              <div className="text-sm">
                {connectedProfile.name} (@{connectedProfile.username})
              </div>
            ) : (
              <div className="text-sm">@{connectedProfile.username}</div>
            )}
          </div>
        )}

        {!connectedAccount && (
          <div className="space-y-2">
            <Label htmlFor="address" className="flex justify-between">
              <span>Account Address</span>
              {showAddressError && (
                <span className="text-sm text-destructive">
                  Invalid Ethereum address
                </span>
              )}
            </Label>
            <Input
              id="address"
              placeholder="Enter address (0x...)"
              value={address}
              onChange={handleAddressChange}
              onBlur={handleAddressBlur}
              className={cn(
                'w-full',
                showAddressError &&
                  'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
        )}

        <div className="space-y-4">
          <Label>Select Amount</Label>
          <div className="grid grid-cols-2 gap-4">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                variant={selectedAmount === amount ? 'default' : 'outline'}
                className={cn(
                  'p-4 text-lg h-auto',
                  selectedAmount === amount && 'bg-black hover:bg-black/90'
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
              />
            </div>
          </div>

          {costLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {!costLoading && cost > 0 && (
            <div>
              Estimated cost: {cost.toFixed(2)} $
              <div className="text-sm text-gray-500 mt-2">
                This is an estimate of the cost for the requested CTZN. The
                final cost and amount of CTZN can vary slightly depending on
                market conditions and 3rd party fees.
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            !isValidEthereumAddress(address) || !finalAmount || cost < 5
          }
          className={cn(
            'w-full py-4 text-lg h-auto',
            finalAmount && 'bg-black hover:bg-black/90'
          )}
        >
          {finalAmount ? (
            <>
              Top up{' '}
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
            'Select an amount'
          )}
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
        {!costLoading && cost > 0 && cost < 5 && (
          <div className="text-sm text-destructive mt-2">
            The minimum amount for a swap is $5
          </div>
        )}
      </form>
    </div>
  );
}
