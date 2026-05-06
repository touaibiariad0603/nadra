export type UserRole = "admin" | "researcher" | "participant";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}