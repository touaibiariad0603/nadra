import { LoginData, RegisterData, User, UserRole } from "@/types/auth";

const USERS_KEY = "nadra_users";
const CURRENT_USER_KEY = "nadra_current_user";

const seedUsers: User[] = [
  {
    id: "admin-1",
    name: "مدير المنصة",
    email: "admin@nadra.app",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "researcher-1",
    name: "طالب باحث",
    email: "researcher@nadra.app",
    password: "researcher123",
    role: "researcher",
    createdAt: new Date().toISOString(),
  },
  {
    id: "participant-1",
    name: "مشارك تجريبي",
    email: "participant@nadra.app",
    password: "participant123",
    role: "participant",
    createdAt: new Date().toISOString(),
  },
];

export function initAuth() {
  if (typeof window === "undefined") return;

  const users = localStorage.getItem(USERS_KEY);

  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];

  initAuth();

  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(data: RegisterData) {
  const users = getUsers();

  const exists = users.some((user) => user.email === data.email);

  if (exists) {
    throw new Error("هذا البريد الإلكتروني مستعمل من قبل");
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  setCurrentUser(user);

  return user;
}

export function loginUser(data: LoginData) {
  const users = getUsers();

  const user = users.find(
    (item) => item.email === data.email && item.password === data.password
  );

  if (!user) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  setCurrentUser(user);
  return user;
}

export function setCurrentUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getDashboardPath(role: UserRole) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "researcher") return "/researcher/dashboard";
  return "/participant/dashboard";
}