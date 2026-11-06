import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { authApi } from "../api/auth.api";
import type { CompleteSignupPayload } from "../api/auth.api";
import type { SignupPayload } from "../types/types";

export const useSignup = () => {
    const signup = useAuthStore((state) => state.signup);

    return useMutation({
        mutationFn: (data: SignupPayload) => signup(data),
    });
};

export const useInitiateSignup = () => {
    return useMutation({
        mutationFn: (data: { name: string; email: string }) => authApi.initiateSignup(data),
    });
};

export const useCompleteSignup = () => {
    const completeSignup = useAuthStore((state) => state.completeSignup);

    return useMutation({
        mutationFn: (data: CompleteSignupPayload) => completeSignup(data),
    });
};
