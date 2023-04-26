import { test, expect } from '@playwright/test';
import { CapMonsterCloudClientFactory, ClientOptions, ImageToTextRequest } from '@zennolab_com/capmonstercloud-client';
import fs from 'fs';
import axios from 'axios';

test('test', async ({ page }) => {
  const cmcClient = CapMonsterCloudClientFactory.Create(new ClientOptions({ clientKey: '67535574171850a5ddbe3bee26a4ede7' }));
  await page.goto('https://bumble.com/');
  // await page.frameLocator('iframe[title="SP Consent Message"]').getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Join' }).click();
  // await page.frameLocator('iframe[title="SP Consent Message"]').getByRole('button', { name: 'Continue' }).click();
  
  await page.getByRole('button', { name: 'Use cell phone number' }).click();
  await page.getByPlaceholder('Enter your number').click();
  await page.getByPlaceholder('Enter your number').fill('4504340261');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  //await page.locator('#main img').click();
  do {
    const captchaElement = await page.locator('#main img');
    await captchaElement.waitFor({ state: 'visible'})
  
    // Create a canvas element and set its dimensions to match the image dimensions
    const imgData:string = await page.evaluate(() => {
      const img: HTMLImageElement = document.querySelector("#main img");
      img.setAttribute('crossOrigin', "anonymous");
      return new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
      
          // Draw the image onto the canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
      
          // Extract the Base64 encoded image data from the canvas
          const base64ImageData = canvas.toDataURL("image/png");
          resolve(base64ImageData);
        }
      })
    });
    
    const request = new ImageToTextRequest({
        "body": imgData
    })
    const captcharResult = await cmcClient.Solve(request);
    console.log(captcharResult.solution.text);
    await page.getByPlaceholder('Type what you see').click();
    await page.getByPlaceholder('Type what you see').fill(captcharResult.solution.text);
    const submitBtn = await page.getByRole('button', { name: 'Submit' })
    await submitBtn.click();
    await submitBtn.waitFor({ state: 'detached'});
  
    if(await page.getByText('Incorrect symbols')) {
      await page.getByText('Try different captcha').click();
      continue;
    }
    break;
  } while(1)  
  await new Promise((resolve) => {
    page.on('close', resolve); // <-- add this
  });
});