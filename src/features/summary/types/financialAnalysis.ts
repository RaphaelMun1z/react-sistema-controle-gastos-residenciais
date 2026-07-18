import type { SummaryFilters } from "./summary";

export interface FinancialAnalysisRequest {
	personId?: number;
	startDate?: string;
	endDate?: string;
}

export interface FinancialAnalysisItem {
	title: string;
	description: string;
}

export interface FinancialRecommendation {
	title: string;
	description: string;
}

export interface FinancialAnalysisResult {
	summary: string;
	positives: FinancialAnalysisItem[];
	warnings: FinancialAnalysisItem[];
	recommendations: FinancialRecommendation[];
}

export interface FinancialAnalysisContext {
	personLabel: string;
	periodLabel: string;
}

export const mapSummaryFiltersToAnalysisRequest = (
	filters: SummaryFilters,
): FinancialAnalysisRequest => ({
	personId: filters.personId === "all" ? undefined : Number(filters.personId),
	startDate: filters.startDate || undefined,
	endDate: filters.endDate || undefined,
});
