export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  attended: boolean;
}

export enum UserRole {
  STAFF = "STAFF",
  MANAGER = "MANAGER",
  ADMINISTRATOR = "ADMINISTRATOR",
}

export interface BranchUsersResponse {
  message: string;
  error: string;
  branch_users: User[];
}

export interface SpecificUserResponse {
  message: string;
  error: string;
  user: User;
}

export interface AttendUserResponse {
  message: string;
  error: string;
}
