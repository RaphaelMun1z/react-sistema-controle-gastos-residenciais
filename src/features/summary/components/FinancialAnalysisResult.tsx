import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import type {
	FinancialAnalysisContext,
	FinancialAnalysisItem,
	FinancialAnalysisResult as FinancialAnalysisResultData,
} from "../types/financialAnalysis";

interface FinancialAnalysisResultProps {
	result: FinancialAnalysisResultData;
	context: FinancialAnalysisContext;
}

interface AnalysisSectionProps {
	title: string;
	items: FinancialAnalysisItem[];
	icon: React.ReactNode;
	variant: "positive" | "warning" | "recommendation";
}

const AnalysisSection = ({
	title,
	items,
	icon,
	variant,
}: AnalysisSectionProps) => {
	if (items.length === 0) {
		return null;
	}

	return (
		<section className={`analysis-section analysis-section--${variant}`}>
			<h3>
				{icon}
				{title}
			</h3>

			<div className="analysis-section__items">
				{items.map((item, index) => (
					<article className="analysis-highlight" key={`${item.title}-${index}`}>
						{item.title && <strong>{item.title}</strong>}
						{item.description && <p>{item.description}</p>}
					</article>
				))}
			</div>
		</section>
	);
};

const FinancialAnalysisResult = ({
	result,
	context,
}: FinancialAnalysisResultProps) => {
	return (
		<div className="financial-analysis-result">
			<header className="financial-analysis-result__header">
				<div>
					<span>Análise Financeira</span>
					<h2>Resultado da análise</h2>
				</div>

				<div className="analysis-context" aria-label="Contexto da análise">
					<span>{context.personLabel}</span>
					<span>{context.periodLabel}</span>
				</div>
			</header>

			<section className="analysis-section analysis-section--summary">
				<h3>
					<AutoAwesomeIcon />
					Resumo
				</h3>
				<p>{result.summary}</p>
			</section>

			<AnalysisSection
				title="Pontos positivos"
				items={result.positives}
				icon={<CheckCircleOutlinedIcon />}
				variant="positive"
			/>

			<AnalysisSection
				title="Pontos de atenção"
				items={result.warnings}
				icon={<WarningAmberIcon />}
				variant="warning"
			/>

			<AnalysisSection
				title="Recomendações"
				items={result.recommendations}
				icon={<LightbulbIcon />}
				variant="recommendation"
			/>

			<p className="financial-analysis-result__disclaimer">
				As sugestões têm caráter educativo e são baseadas nas informações
				disponíveis no sistema.
			</p>
		</div>
	);
};

export default FinancialAnalysisResult;
