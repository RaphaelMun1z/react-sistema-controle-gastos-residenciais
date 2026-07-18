import { expect, test } from "@playwright/test";

const isBypassAuthEnabled = process.env.VITE_BYPASS_AUTH === "true";

test("redireciona rotas privadas para login quando bypass está desligado", async ({
	page,
}) => {
	test.skip(isBypassAuthEnabled);

	await page.goto("/pessoas");

	await expect(page).toHaveURL(/\/entrar$/);
	await expect(page.getByRole("heading", { name: "Acesse sua conta" })).toBeVisible();
});

test("permite navegar em rotas privadas quando bypass está ligado", async ({
	page,
}) => {
	test.skip(!isBypassAuthEnabled);

	await page.goto("/pessoas");
	await expect(
		page.getByRole("heading", { name: "Não foi possível carregar as pessoas" }),
	).toBeVisible({ timeout: 25000 });

	await page.goto("/transacoes");
	await expect(
		page.getByRole("heading", { name: "Não foi possível carregar as transações" }),
	).toBeVisible({ timeout: 25000 });

	await page.goto("/resumo");
	await expect(
		page.getByRole("heading", { name: "Não foi possível carregar o resumo financeiro" }),
	).toBeVisible({ timeout: 25000 });
});
