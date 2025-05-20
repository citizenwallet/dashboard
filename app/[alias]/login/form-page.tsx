'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import EmailForm from './email-form';
import OtpForm from './otp-form';
import { sendOTPAction, signInWithOTP } from './actions';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import { } from 'next/navigation';
import { Config } from '@citizenwallet/sdk';

export default function FormPage({
    config
}: {
    config: Config;
}) {
    const params = useParams();
    const alias = params.alias as string;


    const searchParams = useSearchParams();

    const [step, setStep] = useState<'email' | 'otp'>('email'); // toggle between email and otp form
    const [email, setEmail] = useState(''); // value of email from emai form
    const [isAutoSigningIn, setIsAutoSigningIn] = useState(false);
    const router = useRouter();

    const verifyOTP = useCallback(
        async (email: string, code: string, alias: string) => {
            try {
                const result = await signInWithOTP({ email, code });
                if (result?.success) {
                    toast.success('Login successful!');
                    setTimeout(() => {
                        router.replace(`/${alias}`);
                    }, 100);
                }
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error('Could not verify login code');
                }
            }
        },
        [router]
    );

    // Handle auto-login from invitation link
    useEffect(() => {
        const autoSignIn = searchParams.get('auto_signin');
        const inviteEmail = searchParams.get('email');
        const inviteCode = searchParams.get('code');
        const inviteAlias = searchParams.get('alias');

        if (autoSignIn === 'true' && inviteEmail && inviteCode && inviteAlias) {
            setIsAutoSigningIn(true);
            setEmail(inviteEmail);
            document.cookie = `lastViewedAlias=${inviteAlias}; path=/; max-age=31536000`;

            verifyOTP(inviteEmail, inviteCode, inviteAlias).finally(() => {
                setIsAutoSigningIn(false);
                window.history.replaceState({}, '', '/login');
            });
        }
    }, [searchParams, verifyOTP]);

    // countdown to resend login code
    const [resendCountDown, setResendCountDown] = useState(60);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    const stopTimer = useCallback(() => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    }, [timerId]);

    const resetTimer = useCallback(() => {
        setResendCountDown(60);
    }, []);

    const startTimer = useCallback(() => {
        // Clear any existing timer first
        stopTimer();
        resetTimer();

        const id = setInterval(() => {
            setResendCountDown((prev) => {
                if (prev <= 1) {
                    stopTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        setTimerId(id);
    }, [stopTimer, resetTimer]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [timerId]);

    function onEmailSuccess(email: string) {
        setEmail(email);
        setStep('otp');
        startTimer(); // Start countdown when OTP is requested
    }

    async function resendLoginCode(email: string) {
        try {
            startTimer();
            await sendOTPAction({ email });
            toast.success(`New login code sent to ${email}`);
        } catch {
            toast.error('Could not send login code');
        }
    }

    function goToEmail() {
        stopTimer(); // Stop countdown when going back to email
        setStep('email');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
            <div className="w-full max-w-sm relative">
                {step === 'email' ? (
                    <EmailForm
                        config={config}
                        onSuccess={onEmailSuccess} />
                ) : (
                    <OtpForm
                        email={email}
                        config={config}
                        onBack={goToEmail}
                        resendCountDown={resendCountDown}
                        onResend={resendLoginCode}

                    />
                )}

                {isAutoSigningIn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/80 backdrop-blur-sm rounded-lg">
                        <div className="text-lg font-medium">Signing you in...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
