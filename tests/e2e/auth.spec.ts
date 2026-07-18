import { expect, test } from "@playwright/test";

test("redireciona usuário não autenticado para login", async ({ page }) => {
	await page.goto("/pessoas");

	await expect(page.getByRole("heading", { name: "Acesse sua conta" })).toBeVisible();
});
