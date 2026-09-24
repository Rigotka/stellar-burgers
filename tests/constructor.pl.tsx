import { test, expect } from '@playwright/test';
import type { TNewOrderResponse } from '../src/utils/types';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients-content')).toBeVisible();
});

test('create burger', async ({ page }) => {
  await expect(page.getByText('Выберите булки')).toHaveCount(2);
  await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
  await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
  await expect(page.getByTestId('constructor-ingredients')).toContainText(
    'Выберите начинку'
  );

  const buns = page.getByTestId('bun-ingredients');
  const bun = buns.locator('li').first();
  const ingredients = page.getByTestId('mains-ingredients');
  const ingredient = ingredients.locator('li').first();

  await bun.getByRole('button', { name: /добавить/i }).click();
  const bunName = await bun.getByTestId('ingredient-name').innerText();
  const bunPrice = await bun.getByTestId('ingredient-price').innerText();

  await ingredient.getByRole('button', { name: /добавить/i }).click();
  const ingredientName = await ingredient.getByTestId('ingredient-name').innerText();
  const ingredientPrice = await ingredient.getByTestId('ingredient-price').innerText();

  await expect(page.getByTestId('constructor-bun-1')).toContainText(bunName);
  await expect(page.getByTestId('constructor-ingredients')).toContainText(
    ingredientName
  );
  await expect(page.getByTestId('constructor-bun-2')).toContainText(bunName);

  await expect(page.getByTestId('constructor-bun-1')).toContainText(bunPrice);
  await expect(page.getByTestId('constructor-ingredients')).toContainText(
    ingredientPrice
  );
  await expect(page.getByTestId('constructor-bun-2')).toContainText(bunPrice);

  const totalPrice = Number(bunPrice) * 2 + Number(ingredientPrice);
  await expect(page.getByTestId('order-summ')).toContainText(totalPrice.toString());
});

test('ingredient modal', async ({ page }) => {
  const modalOverlay = page.getByTestId('modal-overlay');

  await expect(modalOverlay).not.toBeVisible();

  const ingredients = page.getByTestId('mains-ingredients');
  const ingredient = ingredients.locator('li').first();

  await ingredient.click();

  await expect(modalOverlay).toBeVisible();

  const name = await ingredient.getByTestId('ingredient-name').innerText();
  const ingredientNameModal = await page
    .getByTestId('ingredient-name-details')
    .innerText();

  expect(name).toEqual(ingredientNameModal);

  await page.getByRole('button', { name: /закрыть/i }).click();

  await expect(modalOverlay).not.toBeVisible();

  await ingredient.click();
  await modalOverlay.click({ position: { x: 5, y: 5 } });

  await expect(modalOverlay).not.toBeVisible();
});

test('create order', async ({ context, page }) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: '*',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.routeFromHAR('./tests/hars/user/user.har', {
    url: '**/api/auth/user',
    update: false,
  });

  await page.routeFromHAR('./tests/hars/order/order.har', {
    url: '**/api/orders',
    update: false,
  });

  await page.goto('/');

  const buns = page.getByTestId('bun-ingredients');
  const bun = buns.locator('li').first();
  const ingredients = page.getByTestId('mains-ingredients');
  const ingredient = ingredients.locator('li').first();

  await bun.getByRole('button', { name: /добавить/i }).click();
  await ingredient.getByRole('button', { name: /добавить/i }).click();

  const orderCreateButton = page
    .getByTestId('constructor')
    .getByRole('button', { name: /оформить заказ/i });

  await expect(orderCreateButton).toBeVisible();
  await expect(orderCreateButton).toBeEnabled();

  const [response] = await Promise.all([
    page.waitForResponse('**/api/orders'),
    orderCreateButton.click(),
  ]);

  expect(response.status()).toBe(200);
  await response.finished();

  const modalOverlay = page.getByTestId('modal-overlay');
  await expect(modalOverlay).toBeVisible();

  const data = (await response.json()) as TNewOrderResponse;
  const orderNumberModal = await page.getByTestId('order-number').textContent();
  await expect(data.order.number.toString()).toEqual(orderNumberModal);

  await modalOverlay.click({ position: { x: 5, y: 5 } });

  await expect(modalOverlay).not.toBeVisible();

  await expect(page.getByText('Выберите булки')).toHaveCount(2);
  await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
  await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
  await expect(page.getByTestId('constructor-ingredients')).toContainText(
    'Выберите начинку'
  );
});
