import { useState } from "react";
import "./SummaryPage.scss";

// Componentes
import PageHeader from "../../../shared/components/PageHeader/PageHeader";
import { ROUTES } from "../../../app/routes/paths";
import SummaryFilters from "../components/SummaryFilters";
import PersonSummaryCard from "../components/PersonSummaryCard";
import OverviewPanel from "../components/OverviewPanel";
import AiAnalysisCard from "../components/AiAnalysisCard";
import { useSummary } from "../hooks/useSummary";
import { usePeople } from "../../people/hooks/usePeople";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";
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

const SummaryPage = () => {
	const [filters, setFilters] = useState(initialFilters);
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

	const shouldShowInitialSkeleton = isLoading && summary.length === 0;

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
							<AiAnalysisCard />
						</aside>
					</div>
				</>
			)}
		</section>
	);
};

export default SummaryPage;
