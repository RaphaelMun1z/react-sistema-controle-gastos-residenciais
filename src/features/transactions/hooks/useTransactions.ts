import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../services/transactionsService";
import type { CreateTransactionInput } from "../types/transaction";

export const transactionsQueryKey = ["transactions"] as const;

export const useTransactions = () =>
	useQuery({
		queryKey: transactionsQueryKey,
		queryFn: transactionsService.list,
	});

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateTransactionInput) =>
			transactionsService.create(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
		},
	});
};

export const useRemoveTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => transactionsService.remove(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
		},
	});
};
