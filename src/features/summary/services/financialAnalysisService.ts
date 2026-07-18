import { API_ENDPOINTS } from "../../../shared/api/apiEndpoints";
import { httpClient } from "../../../shared/api/httpClient";
import type {
	FinancialAnalysisRequest,
	FinancialAnalysisResult,
} from "../types/financialAnalysis";
import type {
	FinancialAnalysisRequestDTO,
	FinancialAnalysisResponseDTO,
} from "../types/financialAnalysisDtos";
import { mapFinancialAnalysisResponseToResult } from "../types/financialAnalysisDtos";

const FINANCIAL_ANALYSIS_TIMEOUT_IN_MS = 45000;

export const financialAnalysisService = {
	async analyze(
		request: FinancialAnalysisRequest,
	): Promise<FinancialAnalysisResult> {
		const body: FinancialAnalysisRequestDTO = request;
		const response = await httpClient.post<
			FinancialAnalysisResponseDTO,
			FinancialAnalysisRequestDTO
		>(API_ENDPOINTS.summaryAnalysis, body, {
			timeoutInMs: FINANCIAL_ANALYSIS_TIMEOUT_IN_MS,
		});

		return mapFinancialAnalysisResponseToResult(response);
	},
};
