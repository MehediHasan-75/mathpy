export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface ActiveToken {
  id: string;
  user_id: string;
  token: string;
  device_info: string | null;
  expires_at: string;
}
