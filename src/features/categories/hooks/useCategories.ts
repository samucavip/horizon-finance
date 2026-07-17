"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "@/services/supabase";
import { queryKeys } from "@/lib/react-query";
import type { Category } from "@/types";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesService.list(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: Omit<Category, "id">) => categoriesService.create(category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
