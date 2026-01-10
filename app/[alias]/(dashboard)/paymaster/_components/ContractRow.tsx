'use client';

import { formatAddress } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const ContractRow = ({ account }: { account: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(account);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="w-[120px] truncate">
            <div
                className="flex items-center gap-1 cursor-pointer hover:bg-muted rounded-md p-1"
                onClick={copyToClipboard}
            >
                <span className="text-xs font-mono truncate">
                    {formatAddress(account)}
                </span>
                {isCopied ? (
                    <Check className="ml-1 h-3 w-3" />
                ) : (
                    <Copy className="ml-1 h-3 w-3" />
                )}
            </div>
        </div>
    );
};