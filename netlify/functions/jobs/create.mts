import type { Context, Config } from '@netlify/functions';
import { createJob } from '../db.mts';
import { verifyToken, generateId } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const auth = verifyToken(token);
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const { title, company, description, location, salary } = await req.json();

    if (!title || !company || !description || !location) {
      return new Response(
        JSON.stringify({ error: 'Title, company, description, and location required' }),
        { status: 400 }
      );
    }

    const job = {
      id: generateId(),
      title,
      company,
      description,
      location,
      salary: salary || undefined,
      postedBy: auth.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await createJob(job);

    return new Response(JSON.stringify(job), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/jobs'
};
