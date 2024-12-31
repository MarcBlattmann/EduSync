export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ChangeRequest {
  id: number;
  content_id: string;
  user_id: string;
  title: string;
  original_content: string;
  suggested_content: string;
  content_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
