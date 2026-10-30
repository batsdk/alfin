import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Subscription } from "@/@types/subscriptions.types";
import { api } from "@/lib/api";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  list: () => [...subscriptionKeys.all, "list"] as const,
};

export const subscriptionsQueryOptions = () =>
  queryOptions({
    queryKey: subscriptionKeys.list(),
    queryFn: () => api<Subscription[]>("/subscriptions"),
  });

export function useSubscriptions() {
  return useQuery(subscriptionsQueryOptions());
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: Subscription["id"]) =>
      api<void>(`/subscriptions/${id}`, { method: "DELETE" }),
    onSuccess: () => toast.success("Subscription deleted"),
    onError: (error) => toast.error(error.message),
    // Returning the promise keeps the mutation pending until the list has refetched
    onSettled: () => queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
  });
}
