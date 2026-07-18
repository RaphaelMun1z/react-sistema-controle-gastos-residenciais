import { useState } from "react";
import "./SummaryPage.scss";

// Componentes
import PageHeader from "../../../shared/components/PageHeader/PageHeader";
import { ROUTES } from "../../../app/routes/paths";
import SummaryFilters from "../components/SummaryFilters";
import PersonSummaryCard from "../components/PersonSummaryCard";
import OverviewPanel from "../components/OverviewPanel";
import AiAnalysisCard from "../components/AiAnalysisCard";
import FinancialAnalysisDialog from "../components/FinancialAnalysisDialog";
import { useSummary } from "../hooks/useSummary";
import { useFinancialAnalysis } from "../hooks/useFinancialAnalysis";
import { usePeople } from "../../people/hooks/usePeople";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";
import {
	mapSummaryFiltersToAnalysisRequest,
	type FinancialAnalysisContext,
	type FinancialAnalysisRequest,
} from "../types/financialAnalysis";
import ErrorState from "../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../shared/components/DataState/EmptyState";
import { getApiErrorFeedback } from "../../../shared/api/apiError";
import SummarySkeleton from "../components/SummarySkeleton";

const SummaryHeaderData = {
	sector: "Resumo",
	sectorPath: ROUTES.summary,
	currentPage: "Consultar",
	title: "Resumo Financeiro",
};

const initialFilters: SummaryFiltersValue = {
	personId: "all",
	startDate: "",
	endDate: "",
};

const formatDate = (date: string) => {
	if (!date) {
		return "";
	}

	return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T00:00:00`));
};

const SummaryPage = () => {
	const [filters, setFilters] = useState(initialFilters);
	const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
	const [isAnalysisInsufficientData, setIsAnalysisInsufficientData] =
		useState(false);
	const [lastAnalysisRequest, setLastAnalysisRequest] =
		useState<FinancialAnalysisRequest>(
			mapSummaryFiltersToAnalysisRequest(initialFilters),
		);
	const { data: people = [] } = usePeople();
	const {
		data: summary = [],
		error,
		refetch,
		isLoading,
		isFetching,
		isError,
	} = useSummary(filters);
	const errorFeedback = getApiErrorFeedback(error, "summaryLoad");
	const financialAnalysis = useFinancialAnalysis();

	const shouldShowInitialSkeleton = isLoading && summary.length === 0;
	const hasAnalysisData = summary.some(
		(person) => person.income > 0 || person.expenses > 0,
	);
	const analysisRequest = mapSummaryFiltersToAnalysisRequest(filters);
	const selectedPerson = people.find(
		(person) => String(person.id) === filters.personId,
	);
	const analysisContext: FinancialAnalysisContext = {
		personLabel: selectedPerson
			? `Pessoa: ${selectedPerson.name}`
			: "Todas as pessoas",
		periodLabel:
			filters.startDate || filters.endDate
				? `Período: ${formatDate(filters.startDate) || "início"} a ${
						formatDate(filters.endDate) || "hoje"
					}`
				: "Todo o período disponível",
	};

	const handleAnalyze = () => {
		setIsAnalysisOpen(true);
		financialAnalysis.reset();

		if (!hasAnalysisData) {
			setIsAnalysisInsufficientData(true);
			return;
		}

		setIsAnalysisInsufficientData(false);
		setLastAnalysisRequest(analysisRequest);
		financialAnalysis.mutate(analysisRequest);
	};

	const handleRetryAnalysis = () => {
		setIsAnalysisInsufficientData(false);
		financialAnalysis.reset();
		financialAnalysis.mutate(lastAnalysisRequest);
	};

	const handleCloseAnalysis = () => {
		if (!financialAnalysis.isPending) {
			setIsAnalysisOpen(false);
		}
	};

	return (
		<section className="summary-page">
			<PageHeader data={SummaryHeaderData} />

			{shouldShowInitialSkeleton ? (
				<SummarySkeleton />
			) : (
				<>
					<SummaryFilters
						filters={filters}
						people={people}
						onChange={setFilters}
						onClear={() => setFilters(initialFilters)}
					/>

					{isFetching && summary.length > 0 && (
						<span className="summary-page__fetching" role="status">
							Atualizando dados...
						</span>
					)}

					<div className="summary-layout">
						<div className="scroll-container">
							<div className="summary-container">
								{isError && (
									<ErrorState
										title={errorFeedback.title}
										description={errorFeedback.description}
										actionLabel={errorFeedback.actionLabel}
										onRetry={() => void refetch()}
									/>
								)}

								{!isLoading && !isError && summary.length === 0 && (
									<EmptyState
										title="Ainda não há dados suficientes para gerar o resumo financeiro."
										description="Cadastre pessoas e transações para visualizar receitas, despesas e saldo."
									/>
								)}

								{!isError &&
									summary.map((person) => (
										<PersonSummaryCard
											key={person.personId}
											person={person}
										/>
									))}
							</div>
						</div>

						<aside className="summary-aside">
							<OverviewPanel summary={summary} />
							<AiAnalysisCard
								onAnalyze={handleAnalyze}
								isDisabled={financialAnalysis.isPending}
							/>
						</aside>
					</div>

					<FinancialAnalysisDialog
						open={isAnalysisOpen}
						isPending={financialAnalysis.isPending}
						isError={financialAnalysis.isError}
						isInsufficientData={isAnalysisInsufficientData}
						result={financialAnalysis.data}
						context={analysisContext}
						request={analysisRequest}
						onClose={handleCloseAnalysis}
						onAnalyze={(request) => {
							setIsAnalysisInsufficientData(false);
							setLastAnalysisRequest(request);
							financialAnalysis.reset();
							financialAnalysis.mutate(request);
						}}
						onRetry={handleRetryAnalysis}
					/>
				</>
			)}
		</section>
	);
};

export default SummaryPage;
