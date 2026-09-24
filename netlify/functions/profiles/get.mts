import type { Context, Config } from '@netlify/functions';
import { getUser, getAllUsers } from '../db.mts';
import { verifyToken } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username required' }), { status: 400 });
    }

    // Search for user by username
    const users = await getAllUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        createdAt: user.createdAt
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/profiles'
};
