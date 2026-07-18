import { Button } from "@mui/material";
import "./DataState.scss";

interface ErrorStateProps {
	title: string;
	description: string;
	onRetry?: () => void;
}

const ErrorState = ({ title, description, onRetry }: ErrorStateProps) => {
	return (
		<div className="data-state" role="alert">
			<h2>{title}</h2>
			<p>{description}</p>
			{onRetry && (
				<Button variant="outlined" onClick={onRetry}>
					Tentar novamente
				</Button>
			)}
		</div>
	);
};

export default ErrorState;
