import { getStore } from '@netlify/blobs';

interface User {
  id: string;
  email: string;
  username: string;
  passwordHash?: string;
  profile: {
    firstName: string;
    lastName: string;
    title: string;
    bio: string;
    location: string;
    skills: string[];
    profileImageUrl?: string;
  };
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  read: boolean;
  createdAt: string;
}

const store = getStore('professional-network');

export async function getUser(email: string): Promise<User | null> {
  const key = `user:${email}`;
  const data = await store.get(key);
  return data ? JSON.parse(data) : null;
}

export async function createUser(user: User): Promise<void> {
  const key = `user:${user.email}`;
  await store.set(key, JSON.stringify(user));
}

export async function updateUser(email: string, updates: Partial<User>): Promise<User> {
  const user = await getUser(email);
  if (!user) throw new Error('User not found');
  const updated = { ...user, ...updates };
  await store.set(`user:${email}`, JSON.stringify(updated));
  return updated;
}

export async function getAllUsers(): Promise<User[]> {
  const list = await store.list();
  const users: User[] = [];
  for (const item of list.blobs) {
    if (item.key.startsWith('user:')) {
      const data = await store.get(item.key);
      if (data) users.push(JSON.parse(data));
    }
  }
  return users;
}

export async function createJob(job: Job): Promise<void> {
  await store.set(`job:${job.id}`, JSON.stringify(job));
}

export async function getJob(id: string): Promise<Job | null> {
  const data = await store.get(`job:${id}`);
  return data ? JSON.parse(data) : null;
}

export async function getAllJobs(): Promise<Job[]> {
  const list = await store.list();
  const jobs: Job[] = [];
  for (const item of list.blobs) {
    if (item.key.startsWith('job:')) {
      const data = await store.get(item.key);
      if (data) jobs.push(JSON.parse(data));
    }
  }
  return jobs;
}

export async function saveMessage(message: Message): Promise<void> {
  await store.set(`message:${message.id}`, JSON.stringify(message));
}

export async function getConversation(user1: string, user2: string): Promise<Message[]> {
  const list = await store.list();
  const messages: Message[] = [];
  for (const item of list.blobs) {
    if (item.key.startsWith('message:')) {
      const data = await store.get(item.key);
      if (data) {
        const msg = JSON.parse(data);
        if (
          (msg.from === user1 && msg.to === user2) ||
          (msg.from === user2 && msg.to === user1)
        ) {
          messages.push(msg);
        }
      }
    }
  }
  return messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
