import 'server-only';

export const sendOtpEmail = async (args: { email: string; otp: string }) => {
  const { email, otp } = args;

  if (
    !process.env.BREVO_API_KEY ||
    !process.env.BREVO_SENDER_EMAIL ||
    !process.env.BREVO_SENDER_NAME
  ) {
    throw new Error('Cannot send email');
  }

  const params = {
    OTP: otp
  };

  const payload = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME
    },
    templateId: 1,
    subject: 'Dashboard - Login Code',
    params,
    messageVersions: [
      {
        to: [{ email }]
      }
    ]
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error(response);
    throw new Error('Failed to email');
  }
};

// http://localhost:3000/login?auto_signin=true&email=lojito9608@barodis.com&code=327527&alias=community1
