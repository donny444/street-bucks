export interface BranchIdsResponse {
  message?: string;
  branch_ids?: number[];
  error?: string;
}

export interface BranchSignInParams {
  branchId?: number;
  password?: string;
  error?: string;
}

export interface BranchSignInResponse {
  message?: string;
  token?: string;
  error?: string;
}
