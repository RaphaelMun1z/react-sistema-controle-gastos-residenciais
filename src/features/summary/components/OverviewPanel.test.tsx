import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OverviewPanel from "./OverviewPanel";

describe("OverviewPanel", () => {
	it("calcula o total geral sem textos Positivo ou Negativo", () => {
		render(
			<OverviewPanel
				summary={[
					{
						personId: "11111111-1111-4111-8111-111111111111",
						personName: "Pessoa A",
						income: 1000,
						expenses: 400,
					},
					{
						personId: "22222222-2222-4222-8222-222222222222",
						personName: "Pessoa B",
						income: 500,
						expenses: 200,
					},
				]}
			/>,
		);

		const overview = screen.getByRole("region", { name: "Visão Geral" });

		expect(within(overview).getByText(/R\$\s*1.500,00/)).toBeInTheDocument();
		expect(within(overview).getByText(/-\s*R\$\s*600,00/)).toBeInTheDocument();
		expect(within(overview).getByText(/R\$\s*900,00/)).toBeInTheDocument();
		expect(within(overview).queryByText(/Positivo/)).not.toBeInTheDocument();
		expect(within(overview).queryByText(/Negativo/)).not.toBeInTheDocument();
	});

	it("mostra saldo negativo e zero apenas pelo sinal/valor", () => {
		const { rerender } = render(
			<OverviewPanel
				summary={[
					{
						personId: "11111111-1111-4111-8111-111111111111",
						personName: "Pessoa A",
						income: 100,
						expenses: 300,
					},
				]}
			/>,
		);

		const overview = screen.getByRole("region", { name: "Visão Geral" });

		expect(within(overview).getByText(/-R\$\s*200,00/)).toBeInTheDocument();
		expect(within(overview).queryByText(/Negativo/)).not.toBeInTheDocument();

		rerender(<OverviewPanel summary={[]} />);

		expect(within(overview).getAllByText(/R\$\s*0,00/).length).toBeGreaterThan(0);
		expect(within(overview).queryByText(/Positivo|Negativo/)).not.toBeInTheDocument();
	});
});
