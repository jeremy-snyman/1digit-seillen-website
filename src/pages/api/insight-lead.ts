import type { APIRoute } from 'astro';
import { sendEmail } from '@lib/email';

export const prerender = false;

const NOTIFICATION_EMAIL = import.meta.env.NOTIFICATION_EMAIL || 'team@1digit.co.uk';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      marketingOptIn = false,
      contactOptIn = false,
      articleSlug = '',
    } = body ?? {};

    // Validation — first name, last name and a valid email are required; opt-ins optional.
    if (!firstName || !lastName || !email || !EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const yesNo = (v: unknown) => (v ? 'Yes' : 'No');

    const notified = await sendEmail(
      NOTIFICATION_EMAIL,
      `New lead: ${firstName} ${lastName}`,
      `<h2>New Insight Lead Captured</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Marketing opt-in:</strong> ${yesNo(marketingOptIn)}</p>
      <p><strong>Wants to be contacted:</strong> ${yesNo(contactOptIn)}</p>
      <p><strong>Captured on article:</strong> ${articleSlug || 'Unknown'}</p>`,
      email,
    );

    if (!notified) {
      return new Response(JSON.stringify({ error: 'Failed to process your request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Insight Lead] error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
