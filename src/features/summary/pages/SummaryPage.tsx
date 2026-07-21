import { useState } from "react";
import "./SummaryPage.scss";

import PageHeader from "../../../shared/components/PageHeader/PageHeader";
import { ROUTES } from "../../../app/routes/paths";
import SummaryFilters from "../components/SummaryFilters";
import PersonSummaryCard from "../components/PersonSummaryCard";
import OverviewPanel from "../components/OverviewPanel";
import AiAnalysisCard from "../components/AiAnalysisCard";
import FinancialAnalysisDialog from "../components/FinancialAnalysisDialog";
import { useSummary } from "../hooks/useSummary";
import { useAllPeople } from "../../people/hooks/usePeople";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";
import ErrorState from "../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../shared/components/DataState/EmptyState";
import { getApiErrorFeedback } from "../../../shared/api/apiError";
import SummarySkeleton from "../components/SummarySkeleton";
import walletImage from "../../../assets/images/wallet.png";

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

const SummaryPage = () => {
	const [filters, setFilters] = useState(initialFilters);
	const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
	const { data: people = [] } = useAllPeople();
	const {
		data: summary = [],
		error,
		refetch,
		isLoading,
		isFetching,
		isError,
	} = useSummary(filters);
	const errorFeedback = getApiErrorFeedback(error, "summaryLoad");

	const shouldShowInitialSkeleton = isLoading && summary.length === 0;
	const selectedPerson = people.find((person) => person.id === filters.personId);
	const analysisContext = {
		personLabel: selectedPerson
			? `Pessoa: ${selectedPerson.name}`
			: "Todas as pessoas",
		periodLabel: "Todo o período disponível",
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
										image={walletImage}
										imageAlt="Carteira vazia"
									/>
								)}

								{!isError &&
									summary.map((person) => (
										<PersonSummaryCard key={person.personId} person={person} />
									))}
							</div>
						</div>

						<aside className="summary-aside">
							<OverviewPanel summary={summary} />
							<AiAnalysisCard onAnalyze={() => setIsAnalysisOpen(true)} />
						</aside>
					</div>

					<FinancialAnalysisDialog
						open={isAnalysisOpen}
						isPending={false}
						isError={false}
						isInsufficientData={false}
						isUnavailable
						context={analysisContext}
						request={{}}
						onClose={() => setIsAnalysisOpen(false)}
						onAnalyze={() => undefined}
						onRetry={() => undefined}
					/>
				</>
			)}
		</section>
	);
};

export default SummaryPage;
