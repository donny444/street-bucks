export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  attended: boolean;
}

interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface EditUser {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}

export enum UserRole {
  STAFF = "STAFF",
  MANAGER = "MANAGER",
  ADMINISTRATOR = "ADMINISTRATOR",
}

export interface BranchUsersResponse {
  message?: string;
  error?: string;
  branch_users?: User[];
}

export interface UserFormResponse {
  message?: string;
  error?: string;
  user?: UserForm;
}

export interface AttendUserResponse {
  message?: string;
  error?: string;
}

export interface EditUserResponse {
  message?: string;
  error?: string;
}

export interface DeleteUserResponse {
  message?: string;
  error?: string;
}
