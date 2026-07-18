import "./DataState.scss";

interface EmptyStateProps {
	title: string;
	description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
	return (
		<div className="data-state">
			<h2>{title}</h2>
			{description && <p>{description}</p>}
		</div>
	);
};

export default EmptyState;
