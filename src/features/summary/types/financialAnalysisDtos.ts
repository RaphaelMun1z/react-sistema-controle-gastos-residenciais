import type {
	FinancialAnalysisItem,
	FinancialAnalysisRequest,
	FinancialAnalysisResult,
} from "./financialAnalysis";

export type FinancialAnalysisRequestDTO = FinancialAnalysisRequest;

interface FinancialAnalysisItemDTO {
	title?: string;
	description?: string;
}

export interface FinancialAnalysisResponseDTO {
	analysis?: string;
	summary?: string;
	positives?: FinancialAnalysisItemDTO[];
	warnings?: FinancialAnalysisItemDTO[];
	recommendations?: FinancialAnalysisItemDTO[];
	highlights?: {
		positives?: FinancialAnalysisItemDTO[];
		warnings?: FinancialAnalysisItemDTO[];
	};
}

const mapItems = (
	items: FinancialAnalysisItemDTO[] | undefined,
): FinancialAnalysisItem[] =>
	(items ?? [])
		.filter((item) => item.title || item.description)
		.map((item) => ({
			title: item.title ?? "",
			description: item.description ?? "",
		}));

export const mapFinancialAnalysisResponseToResult = (
	response: FinancialAnalysisResponseDTO,
): FinancialAnalysisResult => ({
	summary: response.summary ?? response.analysis ?? "",
	positives: mapItems(response.positives ?? response.highlights?.positives),
	warnings: mapItems(response.warnings ?? response.highlights?.warnings),
	recommendations: mapItems(response.recommendations),
});
