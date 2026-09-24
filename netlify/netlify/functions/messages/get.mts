import type { Context, Config } from '@netlify/functions';
import { getConversation } from '../db.mts';
import { verifyToken } from '../auth-utils.mts';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'GET') {
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

    const url = new URL(req.url);
    const otherUser = url.searchParams.get('user');

    if (!otherUser) {
      return new Response(JSON.stringify({ error: 'User parameter required' }), { status: 400 });
    }

    const messages = await getConversation(auth.email, otherUser);

    return new Response(JSON.stringify({ messages }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/messages/get'
};
