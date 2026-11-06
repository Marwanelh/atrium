import { apiClient } from "../../../shared/lib/api-client";
import type { ApiResponse, OrgMembership, Organization, OrgRole, User } from "../../../shared/types/types";
import type {
  LoginPayload,
  LoginResponse,
  SignupResponse,
  AcceptInviteResponse,
  OrganizationResponse,
  VerifyInviteResponse,
  ForgotPasswordResponse,
  ChangePasswordResponse,
  CreateOrganizationResponse,
} from "../types/types";

/** Request body for the second leg of the multi-step signup. Mirrors authSchema.completeSignup. */
export interface CompleteSignupPayload {
  email: string;
  organizationName: string;
  password: string;
  domain?: string | null;
}

/** Request body for resetting a password with an emailed OTP. Mirrors authSchema.resetPasswordWithOTP. */
export interface ResetPasswordOtpPayload {
  email: string;
  code: string;
  newPassword: string;
}

/** Result of switching the active organization — a fresh token pair scoped to that org. */
export interface SwitchOrganizationResponse {
  organization: Organization;
  role: OrgRole;
  accessToken: string;
  refreshToken: string;
}


class AuthApi {
  async login(data: LoginPayload): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", data);
  }

  async initiateSignup(data: { name: string; email: string }): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/auth/initiate-signup", data);
  }

  async completeSignup(data: CompleteSignupPayload): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>("/auth/complete-signup", data);

    // Normalize bootstrap response shape from API (`organization.id`) to app shape (`organization._id`).
    if (response?.success && response.data?.organization) {
      const org = response.data.organization as unknown as {
        _id?: string;
        id?: string;
        name: string;
        slug: string;
        isActive?: boolean;
        logoUrl?: string;
      };

      if (!org._id && org.id) {
        response.data.organization = {
          ...org,
          _id: org.id,
          isActive: org.isActive ?? true,
        } as typeof response.data.organization;
      }
    }

    return response;
  }

  async acceptInvite(token: string, password?: string): Promise<AcceptInviteResponse> {
    return apiClient.post<AcceptInviteResponse>("/memberships/accept-invite", { token, password });
  }

  async getOrganization(orgId: string): Promise<OrganizationResponse> {
    return apiClient.get<OrganizationResponse>(`/organizations/${orgId}`);
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  }

  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // User management
  setUser(user: User): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Organization management
  setActiveOrgId(orgId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("activeOrgId", orgId);
  }

  getActiveOrgId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("activeOrgId");
  }

  setOrgRole(role: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("orgRole", role);
  }

  setOrgPlan(plan: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("orgPlan", plan);
  }

  getOrgPlan(): "free" | "pro" | "proplus" | null {
    if (typeof window === "undefined") return null;
    const plan = localStorage.getItem("orgPlan");
    return plan as "free" | "pro" | "proplus" | null;
  }

  getOrgRole(): "owner" | "admin" | "agent" | null {
    if (typeof window === "undefined") return null;
    const role = localStorage.getItem("orgRole");
    return role as "owner" | "admin" | "agent" | null;
  }

  removeOrgData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("activeOrgId");
    localStorage.removeItem("orgRole");
    localStorage.removeItem("orgPlan");
  }

  logout(): void {
    this.removeToken();
    this.removeOrgData();
  }

  // GET /organizations returns memberships ({ organization, role }), not bare
  // organizations — the gateway populates them from the Membership collection.
  async getMyOrganizations(): Promise<ApiResponse<{ organizations: OrgMembership[] }>> {
    return apiClient.get<ApiResponse<{ organizations: OrgMembership[] }>>(`/organizations`);
  }

  async switchOrganization(orgId: string): Promise<ApiResponse<SwitchOrganizationResponse>> {
    return apiClient.post<ApiResponse<SwitchOrganizationResponse>>(
      `/organizations/${orgId}/switch`,
      { organizationId: orgId },
    );
  }

  async createOrganization(name: string): Promise<CreateOrganizationResponse> {
    return apiClient.post<CreateOrganizationResponse>("/organizations", { name });
  }

  async verifyInvite(token: string): Promise<VerifyInviteResponse> {
    return apiClient.get<VerifyInviteResponse>(`/memberships/verify-invite/${token}`);
  }

  async forgotPassword(email: string, verificationMethod: "otp" = "otp"): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", { email, verificationMethod });
  }



  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>("/auth/change-password", {
      currentPassword,
      newPassword
    });
  }

  async verifyOTP(
    email: string,
    code: string,
    type: "email_verification" | "password_reset",
  ): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/auth/verify-otp", { email, code, type });
  }

  async sendEmailVerification(email: string): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/auth/send-email-verification", { email });
  }

  async getEmailVerificationStatus(email: string): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.get<ApiResponse<{ verified: boolean }>>(
      `/auth/email-verification-status?email=${encodeURIComponent(email)}`,
    );
  }

  async resendOTP(
    email: string,
    type: "email_verification" | "password_reset",
  ): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/auth/resend-otp", { email, type });
  }

  async resetPasswordWithOTP(data: ResetPasswordOtpPayload): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>("/auth/reset-password-otp", data);
  }
}

export const authApi = new AuthApi();
