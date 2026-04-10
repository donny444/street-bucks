export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  attended: boolean;
}

export interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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
  user_form?: UserForm;
}
