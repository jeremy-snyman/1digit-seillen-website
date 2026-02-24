import type { APIRoute } from 'astro';
import { calculateScores } from '@lib/assessment-scoring';
import { sendEmail } from '@lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, company, role, consent, answers } = body;

    if (!name || !email || !company || !role || !consent || !answers) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = calculateScores(answers);

    // Send notification email
    const pillarSummary = result.pillarScores
      .map((p) => `${p.name}: ${p.percentage}%`)
      .join('<br/>');

    await sendEmail(
      process.env.SMTP_USER || 'team@1digit.co.uk',
      `AI Readiness Assessment: ${name} from ${company} — ${result.band} (${result.overallPercentage}%)`,
      `<h2>New AI Readiness Assessment</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Role:</strong> ${role}</p>
      <h3>Results</h3>
      <p><strong>Overall:</strong> ${result.overallPercentage}% — ${result.band}</p>
      <p>${pillarSummary}</p>
      <h3>Recommendations</h3>
      <ul>${result.recommendations.map((r) => `<li>${r}</li>`).join('')}</ul>`
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Assessment error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
