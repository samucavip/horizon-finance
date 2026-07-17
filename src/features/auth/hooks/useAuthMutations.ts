"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, seedDefaultData } from "@/services/supabase";
import type { CredentialsInput } from "../schemas";

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ email, password }: CredentialsInput) =>
      authService.signInWithPassword(email, password),
    onSuccess: () => {
      router.replace("/dashboard");
      router.refresh();
    },
  });
}

export function useSignup() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ email, password }: CredentialsInput) => {
      const { needsConfirmation } = await authService.signUp(email, password);
      // If email confirmation is disabled the user is already signed in; seed
      // their starter dataset before entering the app.
      if (!needsConfirmation) await seedDefaultData();
      return { needsConfirmation };
    },
    onSuccess: ({ needsConfirmation }) => {
      if (!needsConfirmation) {
        router.replace("/dashboard");
        router.refresh();
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      router.replace("/login");
      router.refresh();
    },
  });
}
