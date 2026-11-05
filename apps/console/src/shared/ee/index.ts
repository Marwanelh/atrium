import { authApi } from "@/domains/auth/api/auth.api";
import { EE_FEATURE_POLICY, PLAN_WEIGHT } from "./policy";
import type { EeFeature, PlanTier, AtriumMode } from "./policy";
export type { EeFeature, PlanTier, AtriumMode } from "./policy";

const env = import.meta.env || {};

export const getAtriumMode = (): AtriumMode => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("atriumMode");
    if (cached === "cloud" || cached === "self-host") {
      return cached as AtriumMode;
    }
  }
  const raw = (env.VITE_ATRIUM_MODE || env.ATRIUM_MODE || "self-host").toLowerCase();
  return raw === "cloud" ? "cloud" : "self-host";
};

export const setAtriumMode = (mode: AtriumMode): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("atriumMode", mode);
  }
};

export const isEeEnabledByEnv = (): boolean => {
  return true;
};

export const normalizePlan = (plan?: string | null): PlanTier => {
  const normalized = (plan || "").toLowerCase();
  if (normalized === "pro" || normalized === "proplus") return normalized;
  return "free";
};

export const getCurrentPlan = (): PlanTier => {
  return normalizePlan(authApi.getOrgPlan());
};

export const getRequiredPlan = (feature: EeFeature): PlanTier => EE_FEATURE_POLICY[feature].requiredPlan;

export const isFeatureEnabledForMode = (feature: EeFeature): boolean => {
  return EE_FEATURE_POLICY[feature].enabledModes.includes(getAtriumMode());
};

export const canAccessEeFeature = (feature: EeFeature): boolean => {
  if (!isFeatureEnabledForMode(feature)) return false;
  if (!isEeEnabledByEnv()) return false;

  const current = getCurrentPlan();
  return PLAN_WEIGHT[current] >= PLAN_WEIGHT[getRequiredPlan(feature)];
};