import type { Context, Config } from '@netlify/functions';
import { getAllJobs } from '../db.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const jobs = await getAllJobs();

    // Sort by newest first
    const sorted = jobs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return new Response(JSON.stringify({ jobs: sorted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/jobs/all'
};
