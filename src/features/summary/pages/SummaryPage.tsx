import { useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
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
							<CircularProgress aria-label="Carregando resumo financeiro" />
						)}

						{isError && (
							<Alert severity="error">
								Não foi possível carregar o resumo financeiro.
							</Alert>
						)}

						{!isLoading && !isError && summary.length === 0 && (
							<Alert severity="info">
								Nenhum dado financeiro encontrado para os filtros
								selecionados.
							</Alert>
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
