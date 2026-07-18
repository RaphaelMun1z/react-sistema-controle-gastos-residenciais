import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	CreateTransactionInput,
	Transaction,
	TransactionFilters,
	UpdateTransactionInput,
} from "../types/transaction";
import type {
	CreateTransactionRequestDTO,
	TransactionResponseDTO,
	UpdateTransactionRequestDTO,
} from "../types/transactionDtos";
import { mapTransactionResponseToTransaction } from "../types/transactionDtos";

export const transactionsService = {
	async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
		const transactions = await httpClient.get<TransactionResponseDTO[]>(
			API_ENDPOINTS.transactions,
			{
				params: filters
					? {
							personId: filters.personId,
							type: filters.type,
							startDate: filters.startDate,
							endDate: filters.endDate,
						}
					: undefined,
			},
		);

		return transactions.map(mapTransactionResponseToTransaction);
	},

	async getTransactionById(id: number): Promise<Transaction> {
		const transaction = await httpClient.get<TransactionResponseDTO>(
			API_ENDPOINTS.transactionById(id),
		);

		return mapTransactionResponseToTransaction(transaction);
	},

	async createTransaction(
		input: CreateTransactionInput,
	): Promise<Transaction> {
		const transaction = await httpClient.post<
			TransactionResponseDTO,
			CreateTransactionRequestDTO
		>(API_ENDPOINTS.transactions, input);

		return mapTransactionResponseToTransaction(transaction);
	},

	async updateTransaction(
		id: number,
		input: UpdateTransactionInput,
	): Promise<Transaction> {
		const transaction = await httpClient.put<
			TransactionResponseDTO,
			UpdateTransactionRequestDTO
		>(API_ENDPOINTS.transactionById(id), input);

		return mapTransactionResponseToTransaction(transaction);
	},

	async deleteTransaction(id: number): Promise<void> {
		await httpClient.delete<void>(API_ENDPOINTS.transactionById(id));
	},
};
