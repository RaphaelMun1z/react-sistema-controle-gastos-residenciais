import { expect, test } from "@playwright/test";

test("exibe erro controlado quando backend não está disponível", async ({ page }) => {
	await page.goto("/pessoas");

	await expect(
		page.getByRole("heading", { name: "Não foi possível carregar as pessoas" }),
	).toBeVisible({ timeout: 25000 });
	await expect(page.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
});
