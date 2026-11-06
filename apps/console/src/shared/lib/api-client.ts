import type { RequestOptions } from "../types/types"

import { triggerUpgradeModal } from "../components/upgrade-modal";
import type { LimitReachedPayload } from "../components/upgrade-modal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1"

/**
 * Shape of an error payload the API may return alongside a non-2xx status.
 * Everything is optional: the body is only inspected when the request already
 * failed, and an unexpected shape must not mask the original HTTP error.
 */
interface ApiErrorBody {
  success?: boolean;
  message?: string;
  data?: LimitReachedPayload & { [key: string]: unknown };
  [key: string]: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  // Parse response as JSON first (before checking res.ok).
  // The body is untrusted, so it stays `unknown` until narrowed below.
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    // If response is not JSON, handle error
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    throw new Error("Invalid response format");
  }

  // Error paths read optional fields; a malformed body must not mask the HTTP error.
  const errorBody = body as ApiErrorBody | null;

  // Intercept 429 limit reached errors
  if (res.status === 429 && errorBody?.data?.limitType && errorBody.data.upgradeRequired) {
    triggerUpgradeModal(errorBody.data);
    throw new Error(errorBody.message || "Limit reached");
  }

  // If response includes success: false, treat as error
  if (errorBody?.success === false) {
    throw new Error(errorBody.message || "Request failed");
  }

  if (!res.ok) {
    throw new Error(errorBody?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  // Success path: the caller's generic T describes the contract it expects.
  return body as T;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "DELETE", body }),
}