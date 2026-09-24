import type { Context, Config } from '@netlify/functions';
import { getAllUsers } from '../db.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const skill = url.searchParams.get('skill') || '';
    const location = url.searchParams.get('location') || '';

    const users = await getAllUsers();

    let results = users;

    if (q) {
      const query = q.toLowerCase();
      results = results.filter(
        u =>
          u.username.toLowerCase().includes(query) ||
          u.profile.firstName.toLowerCase().includes(query) ||
          u.profile.lastName.toLowerCase().includes(query) ||
          u.profile.title.toLowerCase().includes(query) ||
          u.profile.bio.toLowerCase().includes(query)
      );
    }

    if (skill) {
      results = results.filter(u =>
        u.profile.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    if (location) {
      results = results.filter(u =>
        u.profile.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return new Response(
      JSON.stringify({
        results: results.map(u => ({
          id: u.id,
          username: u.username,
          profile: u.profile
        }))
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/profiles/search'
};
