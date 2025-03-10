'use client';

import { useState, useEffect, useCallback } from 'react';
import EmailForm from './email-form';
import OtpForm from './otp-form';
import { sendOTPAction } from './actions';
import { toast } from 'sonner';

export default function Page() {
  const [step, setStep] = useState<'email' | 'otp'>('email'); // toggle between email and otp form
  const [email, setEmail] = useState(''); // value of email from emai form

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
      await sendOTPAction({ email, chainId: 42220 });
      toast.success(`New login code sent to ${email}`);
    } catch (error) {
      toast.error('Could not send login code');
    }
  }

  function goToEmail() {
    stopTimer(); // Stop countdown when going back to email
    setStep('email');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm">
        {step === 'email' ? (
          <EmailForm onSuccess={onEmailSuccess} />
        ) : (
          <OtpForm
            email={email}
            onBack={goToEmail}
            resendCountDown={resendCountDown}
            onResend={resendLoginCode}
          />
        )}
      </div>
    </div>
  );
}
