import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OverviewPanel from "./OverviewPanel";

describe("OverviewPanel", () => {
	it("calcula o total geral a partir dos totais individuais", () => {
		render(
			<OverviewPanel
				summary={[
					{
						personId: 1,
						personName: "Pessoa A",
						income: 1000,
						expenses: 400,
					},
					{
						personId: 2,
						personName: "Pessoa B",
						income: 500,
						expenses: 200,
					},
				]}
			/>,
		);

		const overview = screen.getByRole("region", { name: "Visão Geral" });

		expect(within(overview).getByText(/R\$\s*1.500,00/)).toBeInTheDocument();
		expect(within(overview).getByText(/R\$\s*600,00/)).toBeInTheDocument();
		expect(
			within(overview).getByText(/Positivo:\s*R\$\s*900,00/),
		).toBeInTheDocument();
	});
});
