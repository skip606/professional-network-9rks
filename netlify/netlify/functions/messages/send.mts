import type { Context, Config } from '@netlify/functions';
import { saveMessage } from '../db.mts';
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

    const { to, content } = await req.json();

    if (!to || !content) {
      return new Response(JSON.stringify({ error: 'To and content required' }), { status: 400 });
    }

    const message = {
      id: generateId(),
      from: auth.email,
      to,
      content,
      read: false,
      createdAt: new Date().toISOString()
    };

    await saveMessage(message);

    return new Response(JSON.stringify(message), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};

export const config: Config = {
  path: '/api/messages'
};
