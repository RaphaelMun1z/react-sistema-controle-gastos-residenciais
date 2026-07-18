import type { PersonSummary, SummaryFilters } from "./summary";

export interface SummaryResponseDTO {
	personId: number;
	personName: string;
	income: number;
	expenses: number;
}

export type SummaryFiltersRequestDTO = SummaryFilters;

export const mapSummaryResponseToSummary = (
	summary: SummaryResponseDTO,
): PersonSummary => ({
	personId: summary.personId,
	personName: summary.personName,
	income: summary.income,
	expenses: summary.expenses,
});
