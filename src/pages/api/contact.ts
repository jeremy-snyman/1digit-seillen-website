import type { APIRoute } from 'astro';
import { sendEmail } from '@lib/email';

export const prerender = false;

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'team@1digit.co.uk';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, company, role, message, consent } = body;

    // Basic validation
    if (!name || !email || !company || !message || !consent) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send notification email to the team
    const notified = await sendEmail(
      NOTIFICATION_EMAIL,
      `New Contact: ${name} from ${company}`,
      `<h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Role:</strong> ${role || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`,
      email
    );

    if (!notified) {
      return new Response(JSON.stringify({ error: 'Failed to process your request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send confirmation email to the submitter (fire-and-forget)
    sendEmail(
      email,
      'We received your message — 1Digit',
      `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for reaching out, ${name}</h2>
        <p>We have received your message and will get back to you within one working day.</p>
        <p>In the meantime, learn more about our work at <a href="https://1digit.co.uk">1digit.co.uk</a>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">This is an automated confirmation. Please do not reply to this email.</p>
      </div>`
    ).catch((err) => console.error('[Email] Confirmation email failed:', err));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
