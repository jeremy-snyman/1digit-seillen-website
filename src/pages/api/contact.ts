import type { APIRoute } from 'astro';
import { sendEmail } from '@lib/email';

export const prerender = false;

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

    // Send notification email
    await sendEmail(
      process.env.SMTP_USER || 'team@1digit.co.uk',
      `New Contact: ${name} from ${company}`,
      `<h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Role:</strong> ${role || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>`
    );

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
