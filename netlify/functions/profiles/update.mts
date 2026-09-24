import type { Context, Config } from '@netlify/functions';
import { getUser, updateUser } from '../db.mts';
import { verifyToken } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'PUT') {
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

    const { profile } = await req.json();

    const user = await getUser(auth.email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const updated = await updateUser(auth.email, {
      profile: {
        ...user.profile,
        ...profile
      }
    });

    return new Response(
      JSON.stringify({
        id: updated.id,
        email: updated.email,
        username: updated.username,
        profile: updated.profile
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/profiles/update'
};
