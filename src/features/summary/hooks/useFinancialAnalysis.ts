import { useMutation } from "@tanstack/react-query";
import { financialAnalysisService } from "../services/financialAnalysisService";
import type { FinancialAnalysisRequest } from "../types/financialAnalysis";

export const useFinancialAnalysis = () =>
	useMutation({
		mutationFn: (_request: FinancialAnalysisRequest) => {
			void _request;
			return financialAnalysisService.analyze();
		},
	});
