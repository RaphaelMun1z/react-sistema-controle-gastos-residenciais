import type { FinancialAnalysisResult } from "../types/financialAnalysis";

export const financialAnalysisService = {
	async analyze(): Promise<FinancialAnalysisResult> {
		throw new Error(
			"O backend atual ainda não possui endpoint para análise financeira por IA.",
		);
	},
};
