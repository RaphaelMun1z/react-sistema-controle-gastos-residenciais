import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import PersonRegisterPage from "./PersonRegisterPage";

describe("PersonRegisterPage", () => {
	it("envia cadastro de pessoa para a API", async () => {
		const createPersonHandler = vi.fn(async ({ request }) => {
			const body = (await request.json()) as {
				name: string;
				email: string;
				age: number;
			};

			expect(body).toEqual({
				name: "Maria Souza",
				email: "maria@email.com",
				age: 32,
			});

			return HttpResponse.json({ id: 3, ...body });
		});

		server.use(http.post(`*${API_ENDPOINTS.people}`, createPersonHandler));

		renderWithProviders(<PersonRegisterPage />);

		await userEvent.type(screen.getByLabelText("Nome"), "Maria Souza");
		await userEvent.type(screen.getByLabelText("E-mail"), "maria@email.com");
		await userEvent.clear(screen.getByLabelText("Idade"));
		await userEvent.type(screen.getByLabelText("Idade"), "32");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		await waitFor(() => {
			expect(createPersonHandler).toHaveBeenCalledTimes(1);
		});
	});

	it("exibe erro amigável quando cadastro falha", async () => {
		server.use(
			http.post(
				`*${API_ENDPOINTS.people}`,
				() => new HttpResponse(null, { status: 409 }),
			),
		);

		renderWithProviders(<PersonRegisterPage />);

		await userEvent.type(screen.getByLabelText("Nome"), "Maria Souza");
		await userEvent.type(screen.getByLabelText("E-mail"), "maria@email.com");
		await userEvent.clear(screen.getByLabelText("Idade"));
		await userEvent.type(screen.getByLabelText("Idade"), "32");
		await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

		expect(
			await screen.findByText("Já existe um registro com essas informações."),
		).toBeInTheDocument();
	});
});
