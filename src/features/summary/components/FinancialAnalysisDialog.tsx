import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import ErrorState from "../../../shared/components/ErrorState/ErrorState";
import type { FinancialAnalysisContext } from "../types/financialAnalysis";
import walletImage from "../../../assets/images/wallet.png";
import "./FinancialAnalysisDialog.scss";

interface FinancialAnalysisDialogProps {
	open: boolean;
	context: FinancialAnalysisContext;
	onClose: () => void;
}

const FinancialAnalysisDialog = ({
	open,
	context,
	onClose,
}: FinancialAnalysisDialogProps) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			className="financial-analysis-dialog"
			aria-labelledby="financial-analysis-dialog-title"
		>
			<DialogTitle id="financial-analysis-dialog-title">
				<span>Análise financeira com IA</span>
				<IconButton
					aria-label="Fechar análise"
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<ErrorState
					title="Análise com IA estará disponível em breve."
					description={`O backend atual ainda não possui endpoint para análise financeira por IA. ${context.personLabel}. ${context.periodLabel}.`}
					image={walletImage}
					imageAlt="Carteira vazia"
					actionLabel="Fechar"
					onRetry={onClose}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default FinancialAnalysisDialog;
