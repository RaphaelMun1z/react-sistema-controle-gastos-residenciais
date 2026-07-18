import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import TransactionRegisterPage from "./TransactionRegisterPage";

const people = [
	{
		id: 1,
		name: "Maria Souza",
		email: "maria@email.com",
		age: 32,
	},
	{
		id: 2,
		name: "Joao Souza",
		email: "joao@email.com",
		age: 15,
	},
];

describe("TransactionRegisterPage", () => {
	it("exibe estado vazio quando nao ha pessoas cadastradas", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json([])),
		);

		renderWithProviders(<TransactionRegisterPage />);

		expect(
			await screen.findByText("Nenhuma pessoa cadastrada ainda."),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /salvar/i })).toBeDisabled();
	});

	it(
		"corrige receita para despesa quando a pessoa selecionada e menor de idade",
		async () => {
			const createTransactionHandler = vi.fn(async ({ request }) => {
				const body = (await request.json()) as {
					personId: number;
					type: string;
					description: string;
					value: number;
					category: string;
					date: string;
					observation?: string;
				};

				expect(body).toEqual({
					personId: 2,
					type: "expense",
					description: "Mesada",
					value: 50,
					category: "Outros",
					date: "2026-07-18",
					observation: "",
				});

				return HttpResponse.json({
					id: 1,
					personName: "Joao Souza",
					...body,
				});
			});

			server.use(
				http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json(people)),
				http.post(`*${API_ENDPOINTS.transactions}`, createTransactionHandler),
			);

			renderWithProviders(<TransactionRegisterPage />);

			await userEvent.click(await screen.findByLabelText("Pessoa"));
			await userEvent.click(screen.getByRole("option", { name: "Maria Souza" }));

			await userEvent.click(screen.getByLabelText("Tipo"));
			await userEvent.click(screen.getByRole("option", { name: "Receita" }));

			await userEvent.click(screen.getByLabelText("Pessoa"));
			await userEvent.click(screen.getByRole("option", { name: "Joao Souza" }));

			await userEvent.click(screen.getByLabelText("Tipo"));
			const listbox = screen.getByRole("listbox");
			expect(
				within(listbox).getByRole("option", { name: "Receita" }),
			).toHaveAttribute("aria-disabled", "true");
			await userEvent.keyboard("{Escape}");

			await userEvent.type(screen.getByLabelText("Descrição"), "Mesada");
			await userEvent.clear(screen.getByLabelText("Valor"));
			await userEvent.type(screen.getByLabelText("Valor"), "50");
			await userEvent.click(screen.getByLabelText("Categoria"));
			await userEvent.click(screen.getByRole("option", { name: "Outros" }));
			await userEvent.type(screen.getByLabelText("Data"), "2026-07-18");
			await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

			await waitFor(() => {
				expect(createTransactionHandler).toHaveBeenCalledTimes(1);
			});
		},
		10000,
	);
});
