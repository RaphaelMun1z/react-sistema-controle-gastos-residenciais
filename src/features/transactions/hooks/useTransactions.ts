import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginationParams } from "../../../shared/api/apiTypes";
import { transactionsService } from "../services/transactionsService";
import type { CreateTransactionInput } from "../types/transaction";

export const transactionsQueryKey = ["transactions"] as const;
export const allTransactionsQueryKey = ["transactions", "all"] as const;
export const transactionQueryKey = (id: string) =>
	["transactions", id] as const;

export const useTransactions = (params: PaginationParams) =>
	useQuery({
		queryKey: [...transactionsQueryKey, params.page, params.pageSize] as const,
		queryFn: () => transactionsService.getTransactions(params),
		placeholderData: keepPreviousData,
	});

export const useAllTransactions = () =>
	useQuery({
		queryKey: allTransactionsQueryKey,
		queryFn: () => transactionsService.getAllTransactions(),
	});

export const useTransaction = (id: string) =>
	useQuery({
		queryKey: transactionQueryKey(id),
		queryFn: () => transactionsService.getTransactionById(id),
		enabled: id.length > 0,
	});

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateTransactionInput) =>
			transactionsService.createTransaction(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
			void queryClient.invalidateQueries({ queryKey: allTransactionsQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};
