import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  
  await page.goto('https://bumble.com/');
  await page.frameLocator('iframe[title="SP Consent Message"]').getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Join' }).click();
  await page.frameLocator('iframe[title="SP Consent Message"]').getByRole('button', { name: 'Continue' }).click();
  
  await page.getByRole('button', { name: 'Use cell phone number' }).click();
  await page.getByPlaceholder('Enter your number').click();
  await page.getByPlaceholder('Enter your number').fill('6504340161');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  //await page.locator('#main img').click();
  const captchaElement = await page.locator('#main img');
  const imgAddress = await captchaElement.getAttribute('src');
  console.log(imgAddress)
  await new Promise((resolve) => {
    page.on('close', resolve); // <-- add this
  });
});