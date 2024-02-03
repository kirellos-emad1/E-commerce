export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";

export type User = {
  id?: string;
  email: string;
  username: string;
  phone?: string | null;
  password?: string | null;
  image?: string |null;
  isValidEmail?: boolean;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date|null;
};
