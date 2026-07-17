"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import type { Goal } from "@/types";

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: () => goalsService.list(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: Omit<Goal, "id">) => goalsService.create(goal),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.goals }),
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.goals }),
  });
}
