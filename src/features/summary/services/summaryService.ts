import { transactionsService } from "../../transactions/services/transactionsService";
import type { PersonSummary, SummaryFilters } from "../types/summary";

const isInDateRange = (
	date: string,
	startDate: string,
	endDate: string,
): boolean => {
	if (startDate && date < startDate) {
		return false;
	}

	if (endDate && date > endDate) {
		return false;
	}

	return true;
};

export const summaryService = {
	async getSummary(filters: SummaryFilters): Promise<PersonSummary[]> {
		const transactions = await transactionsService.list();
		const filteredTransactions = transactions.filter((transaction) => {
			const matchesPerson =
				filters.personId === "all" ||
				transaction.personId === Number(filters.personId);
			const matchesDate = isInDateRange(
				transaction.date,
				filters.startDate,
				filters.endDate,
			);

			return matchesPerson && matchesDate;
		});

		const summaryByPerson = filteredTransactions.reduce<
			Record<number, PersonSummary>
		>((summary, transaction) => {
			const current = summary[transaction.personId] ?? {
				personId: transaction.personId,
				personName: transaction.personName,
				income: 0,
				expenses: 0,
			};

			if (transaction.type === "income") {
				current.income += transaction.value;
			} else {
				current.expenses += transaction.value;
			}

			return {
				...summary,
				[transaction.personId]: current,
			};
		}, {});

		return Object.values(summaryByPerson);
	},
};
