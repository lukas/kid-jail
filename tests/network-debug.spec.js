import { test, expect } from '@playwright/test';

test('debug network requests', async ({ page }) => {
  const failedRequests = [];
  
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText
    });
  });

  page.on('response', response => {
    if (!response.ok()) {
      console.log(`Failed response: ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  console.log('Failed requests:', failedRequests);
  
  // Check what scripts are actually loaded
  const scripts = await page.locator('script').evaluateAll(elements => 
    elements.map(el => ({ src: el.src, type: el.type }))
  );
  console.log('Scripts on page:', scripts);
  
  expect(true).toBe(true);
});