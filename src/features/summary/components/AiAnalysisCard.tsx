import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface AiAnalysisCardProps {
	onAnalyze: () => void;
	isDisabled?: boolean;
}

const AiAnalysisCard = ({ onAnalyze, isDisabled = false }: AiAnalysisCardProps) => {
	return (
		<section className="ai-analysis-card">
			<div className="ai-card-icon" aria-hidden="true">
				<AutoAwesomeIcon />
			</div>

			<div className="ai-card-content">
				<h3>Analise suas finanças com IA</h3>

				<p>
					Receba uma análise inteligente das suas transações, identifique
					padrões de gastos e descubra oportunidades para economizar.
				</p>

				<button type="button" onClick={onAnalyze} disabled={isDisabled}>
					Analisar transações
				</button>
			</div>
		</section>
	);
};

export default AiAnalysisCard;
