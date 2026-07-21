import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import type { PagedResponse, PaginationParams, Resource } from "../../../shared/api/apiTypes";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	CreateTransactionInput,
	Transaction,
} from "../types/transaction";
import type {
	CreateTransactionRequestDTO,
	TransactionResponseDTO,
} from "../types/transactionDtos";
import { mapTransactionResponseToTransaction } from "../types/transactionDtos";

const DEFAULT_PAGE_SIZE_FOR_AGGREGATION = 100;

export const transactionsService = {
	async getTransactions(
		params: PaginationParams,
	): Promise<PagedResponse<Transaction>> {
		const response = await httpClient.get<PagedResponse<TransactionResponseDTO>>(
			API_ENDPOINTS.transactions,
			{ params: { page: params.page, pageSize: params.pageSize } },
		);

		return {
			...response,
			content: response.content.map(mapTransactionResponseToTransaction),
		};
	},

	async getTransactionsByPerson(
		personId: string,
		params: PaginationParams,
	): Promise<PagedResponse<Transaction>> {
		const response = await httpClient.get<PagedResponse<TransactionResponseDTO>>(
			API_ENDPOINTS.transactionsByPerson(personId),
			{ params: { page: params.page, pageSize: params.pageSize } },
		);

		return {
			...response,
			content: response.content.map(mapTransactionResponseToTransaction),
		};
	},

	async getAllTransactions(): Promise<Transaction[]> {
		const firstPage = await this.getTransactions({
			page: 1,
			pageSize: DEFAULT_PAGE_SIZE_FOR_AGGREGATION,
		});
		const transactions = [...firstPage.content];

		for (let page = 2; page <= firstPage.totalPages; page += 1) {
			const nextPage = await this.getTransactions({
				page,
				pageSize: DEFAULT_PAGE_SIZE_FOR_AGGREGATION,
			});
			transactions.push(...nextPage.content);
		}

		return transactions;
	},

	async getTransactionById(id: string): Promise<Transaction> {
		const resource = await httpClient.get<Resource<TransactionResponseDTO>>(
			API_ENDPOINTS.transactionById(id),
		);

		return mapTransactionResponseToTransaction(resource.data);
	},

	async createTransaction(
		input: CreateTransactionInput,
	): Promise<Transaction> {
		const resource = await httpClient.post<
			Resource<TransactionResponseDTO>,
			CreateTransactionRequestDTO
		>(API_ENDPOINTS.transactions, input);

		return mapTransactionResponseToTransaction(resource.data);
	},
};
