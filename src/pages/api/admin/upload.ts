import type { APIRoute } from 'astro';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

export const prerender = false;

const UPLOAD_DIR = join(process.cwd(), 'public/images/insights');

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
    const ext = extname(file.name).toLowerCase();
    if (!allowed.includes(ext)) {
      return new Response(JSON.stringify({ error: `File type ${ext} not allowed. Use: ${allowed.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitise filename
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');

    // Ensure directory exists
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(UPLOAD_DIR, safeName);
    writeFileSync(filePath, buffer);

    const publicPath = `/images/insights/${safeName}`;

    return new Response(JSON.stringify({ success: true, path: publicPath }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Admin API] Upload error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
