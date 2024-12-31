export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ...existing code...
