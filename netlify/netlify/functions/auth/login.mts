import type { Context, Config } from '@netlify/functions';
import { getUser } from '../db.mts';
import { verifyPassword, generateToken } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }),
        { status: 400 }
      );
    }

    const user = await getUser(email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash || '')) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const token = generateToken(email);

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profile: user.profile
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/auth/login'
};
