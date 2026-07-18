import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "../services/transactionsService";
import type {
	CreateTransactionInput,
	TransactionFilters,
	UpdateTransactionInput,
} from "../types/transaction";

export const transactionsQueryKey = ["transactions"] as const;
export const transactionQueryKey = (id: number) =>
	["transactions", id] as const;

export const useTransactions = (filters?: TransactionFilters) =>
	useQuery({
		queryKey: [...transactionsQueryKey, filters] as const,
		queryFn: () => transactionsService.getTransactions(filters),
	});

export const useTransaction = (id: number) =>
	useQuery({
		queryKey: transactionQueryKey(id),
		queryFn: () => transactionsService.getTransactionById(id),
		enabled: id > 0,
	});

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateTransactionInput) =>
			transactionsService.createTransaction(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useUpdateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: number;
			input: UpdateTransactionInput;
		}) => transactionsService.updateTransaction(id, input),
		onSuccess: (_transaction, variables) => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
			void queryClient.invalidateQueries({
				queryKey: transactionQueryKey(variables.id),
			});
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useDeleteTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => transactionsService.deleteTransaction(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useRemoveTransaction = useDeleteTransaction;
