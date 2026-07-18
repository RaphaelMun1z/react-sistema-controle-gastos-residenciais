const FinancialAnalysisLoading = () => {
	return (
		<div
			className="financial-analysis-loading"
			role="status"
			aria-label="Analisando suas finanças"
		>
			<div className="financial-analysis-loading__stage" aria-hidden="true">
				<div className="analysis-orb">
					<span />
					<span />
					<span />
				</div>

				<div className="analysis-flow">
					{["Receitas", "Despesas", "Categorias"].map((label, index) => (
						<div
							className="analysis-flow__row"
							key={label}
							style={{ animationDelay: `${index * 0.18}s` }}
						>
							<div className="analysis-flow__dot" />
							<div className="analysis-flow__content">
								<strong>{label}</strong>
								<span />
							</div>
						</div>
					))}
				</div>

				<div className="analysis-chart">
					<span />
					<span />
					<span />
					<span />
				</div>
			</div>

			<div className="financial-analysis-loading__copy">
				<h3>Analisando suas finanças</h3>
				<p>
					Estamos analisando suas transações e preparando informações que
					podem ajudar na sua organização financeira.
				</p>
				<span>Isso pode levar alguns instantes.</span>
			</div>
		</div>
	);
};

export default FinancialAnalysisLoading;
