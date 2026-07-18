import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../../shared/api/apiEndpoints";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { server } from "../../../../test/server";
import PeopleConsultPage from "./PeopleConsultPage";

describe("PeopleConsultPage", () => {
	it("renderiza pessoas retornadas pela API", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () =>
				HttpResponse.json([
					{
						id: 1,
						name: "Raphael Muniz",
						email: "raphael@email.com",
						age: 25,
					},
				]),
			),
		);

		renderWithProviders(<PeopleConsultPage />);

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(await screen.findByText("Raphael Muniz")).toBeInTheDocument();
	});

	it("renderiza estado vazio quando a API retorna lista vazia", async () => {
		server.use(
			http.get(`*${API_ENDPOINTS.people}`, () => HttpResponse.json([])),
		);

		renderWithProviders(<PeopleConsultPage />);

		expect(
			await screen.findByText("Nenhuma pessoa cadastrada ainda."),
		).toBeInTheDocument();
	});

	it("permite tentar novamente depois de erro de conexão", async () => {
		const peopleHandler = vi
			.fn()
			.mockImplementationOnce(() => HttpResponse.error())
			.mockImplementationOnce(() =>
				HttpResponse.json([
					{
						id: 1,
						name: "Raphael Muniz",
						email: "raphael@email.com",
						age: 25,
					},
				]),
			);

		server.use(http.get(`*${API_ENDPOINTS.people}`, peopleHandler));

		renderWithProviders(<PeopleConsultPage />);

		expect(
			await screen.findByText("Não foi possível carregar as pessoas cadastradas."),
		).toBeInTheDocument();
		expect(screen.getByText("Tente novamente em alguns instantes.")).toBeInTheDocument();
		expect(screen.getByAltText("Ilustração de erro")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

		await waitFor(() => {
			expect(peopleHandler).toHaveBeenCalledTimes(2);
		});
		expect(await screen.findByText("Raphael Muniz")).toBeInTheDocument();
	});
});
