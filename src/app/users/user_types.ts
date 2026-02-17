export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  attended: boolean;
}

export enum UserRole {
  STAFF = "staff",
  MANAGER = "manager",
  ADMINISTRATOR = "administrator",
}

export interface BranchUsersResponse {
  message: string;
  branch_users: User[];
}

export interface SpecificUserResponse {
  message: string;
  user: User;
}
