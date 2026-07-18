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
import LoadingState from "../../../shared/components/DataState/LoadingState";
import ErrorState from "../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../shared/components/DataState/EmptyState";
import { getApiErrorMessage } from "../../../shared/api/apiError";

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
		isError,
	} = useSummary(filters);

	return (
		<section className="summary-page">
			<PageHeader data={SummaryHeaderData} />

			<SummaryFilters
				filters={filters}
				people={people}
				onChange={setFilters}
				onClear={() => setFilters(initialFilters)}
			/>

			<div className="summary-layout">
				<div className="scroll-container">
					<div className="summary-container">
						{isLoading && (
							<LoadingState label="Carregando resumo financeiro" />
						)}

						{isError && (
							<ErrorState
								title="Não foi possível carregar o resumo financeiro"
								description={getApiErrorMessage(error)}
								onRetry={() => void refetch()}
							/>
						)}

						{!isLoading && !isError && summary.length === 0 && (
							<EmptyState
								title="Ainda não há dados suficientes para gerar o resumo financeiro."
								description="Cadastre pessoas e transações para visualizar receitas, despesas e saldo."
							/>
						)}

						{!isLoading &&
							!isError &&
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
		</section>
	);
};

export default SummaryPage;
