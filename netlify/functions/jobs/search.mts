import type { Context, Config } from '@netlify/functions';
import { getAllJobs } from '../db.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const location = url.searchParams.get('location') || '';
    const company = url.searchParams.get('company') || '';

    const jobs = await getAllJobs();

    let results = jobs;

    if (q) {
      const query = q.toLowerCase();
      results = results.filter(
        j =>
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.company.toLowerCase().includes(query)
      );
    }

    if (location) {
      results = results.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (company) {
      results = results.filter(j => j.company.toLowerCase().includes(company.toLowerCase()));
    }

    // Sort by newest first
    const sorted = results.sort(
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
  path: '/api/jobs/search'
};
