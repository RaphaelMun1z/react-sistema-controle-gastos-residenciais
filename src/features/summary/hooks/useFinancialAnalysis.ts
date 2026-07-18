import { useMutation } from "@tanstack/react-query";
import { financialAnalysisService } from "../services/financialAnalysisService";
import type { FinancialAnalysisRequest } from "../types/financialAnalysis";

export const useFinancialAnalysis = () =>
	useMutation({
		mutationFn: (request: FinancialAnalysisRequest) =>
			financialAnalysisService.analyze(request),
	});
