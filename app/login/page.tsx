'use client';

import { useState } from 'react';
import EmailForm from './email-form';
import OtpForm from './otp-form';

export default function Page() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');

  function onEmailSuccess(email: string) {
    setEmail(email);
    setStep('otp');
  }

  function onOtpSuccess() {
    // TODO: navigate to last alias or home page
  }

  function goToEmail() {
    setStep('email');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm">
        {step === 'email' ? (
          <EmailForm onSuccess={onEmailSuccess} />
        ) : (
          <OtpForm email={email} onBack={goToEmail} onSuccess={onOtpSuccess} />
        )}
      </div>
    </div>
  );
}
