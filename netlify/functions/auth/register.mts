import type { Context, Config } from '@netlify/functions';
import { createUser, getUser } from '../db.mts';
import { hashPassword, generateToken, generateId } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { email, password, username, firstName, lastName } = await req.json();

    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and username required' }),
        { status: 400 }
      );
    }

    const existing = await getUser(email);
    if (existing) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
    }

    const user = {
      id: generateId(),
      email,
      username,
      passwordHash: hashPassword(password),
      profile: {
        firstName: firstName || '',
        lastName: lastName || '',
        title: '',
        bio: '',
        location: '',
        skills: [],
        profileImageUrl: undefined
      },
      createdAt: new Date().toISOString()
    };

    await createUser(user);

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
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/auth/register'
};
