import CloseIcon from "@mui/icons-material/Close";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
} from "@mui/material";
import ErrorState from "../../../shared/components/ErrorState/ErrorState";
import type {
	FinancialAnalysisContext,
	FinancialAnalysisRequest,
	FinancialAnalysisResult as FinancialAnalysisResultData,
} from "../types/financialAnalysis";
import FinancialAnalysisLoading from "./FinancialAnalysisLoading";
import FinancialAnalysisResult from "./FinancialAnalysisResult";
import walletImage from "../../../assets/images/wallet.png";
import "./FinancialAnalysisDialog.scss";

interface FinancialAnalysisDialogProps {
	open: boolean;
	isPending: boolean;
	isError: boolean;
	isInsufficientData: boolean;
	result?: FinancialAnalysisResultData;
	context: FinancialAnalysisContext;
	request: FinancialAnalysisRequest;
	onClose: () => void;
	onAnalyze: (request: FinancialAnalysisRequest) => void;
	onRetry: () => void;
}

const FinancialAnalysisDialog = ({
	open,
	isPending,
	isError,
	isInsufficientData,
	result,
	context,
	request,
	onClose,
	onAnalyze,
	onRetry,
}: FinancialAnalysisDialogProps) => {
	const canGenerateAgain = Boolean(result) && !isPending;

	return (
		<Dialog
			open={open}
			onClose={isPending ? undefined : onClose}
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
					disabled={isPending}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				{isPending && <FinancialAnalysisLoading />}

				{!isPending && isInsufficientData && (
					<ErrorState
						title="Ainda não há dados suficientes para uma análise"
						description="Registre algumas transações para que possamos identificar padrões e gerar recomendações."
						image={walletImage}
						imageAlt="Carteira vazia"
						actionLabel="Fechar"
						onRetry={onClose}
					/>
				)}

				{!isPending && isError && (
					<ErrorState
						title="Não foi possível concluir a análise"
						description="Tente novamente em alguns instantes."
						actionLabel="Tentar novamente"
						onRetry={onRetry}
						secondaryActionLabel="Fechar"
						onSecondaryAction={onClose}
					/>
				)}

				{!isPending && !isError && !isInsufficientData && result && (
					<FinancialAnalysisResult result={result} context={context} />
				)}
			</DialogContent>

			{!isPending && !isError && !isInsufficientData && (
				<DialogActions>
					{canGenerateAgain && (
						<Button onClick={() => onAnalyze(request)}>
							Gerar nova análise
						</Button>
					)}
					<Button variant="contained" onClick={onClose}>
						Fechar
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
};

export default FinancialAnalysisDialog;
