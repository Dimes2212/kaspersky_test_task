import type { User } from '../types/user';

const DIRECT_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return '/backend';
  }

  return `${DIRECT_API_BASE_URL}/api`;
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${getApiBaseUrl()}/users`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return (await response.json()) as User[];
}

export type CreateUserPayload = Omit<User, 'id'>;

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await fetch(`${getApiBaseUrl()}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }

  return (await response.json()) as User;
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/users/${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }
}
