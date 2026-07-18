import { CircularProgress } from "@mui/material";
import "./DataState.scss";

interface LoadingStateProps {
	label: string;
}

const LoadingState = ({ label }: LoadingStateProps) => {
	return (
		<div className="data-state data-state--loading" role="status">
			<CircularProgress aria-label={label} />
		</div>
	);
};

export default LoadingState;
