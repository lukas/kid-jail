import { test, expect } from '@playwright/test';

test('capture all console output', async ({ page }) => {
  const allConsoleMessages = [];
  
  page.on('console', (msg) => {
    allConsoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });
  
  page.on('pageerror', (error) => {
    console.log('PAGE ERROR:', error.message);
    console.log('Stack:', error.stack);
  });
  
  await page.goto('/');
  
  // Wait for everything to load
  await page.waitForTimeout(3000);
  
  // Try some interactions
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.click('#switch-btn');
  await page.waitForTimeout(500);
  
  console.log('\n=== ALL CONSOLE MESSAGES ===');
  allConsoleMessages.forEach((msg, i) => {
    console.log(`${i + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
    if (msg.location && msg.location.url) {
      console.log(`   Location: ${msg.location.url}:${msg.location.lineNumber}`);
    }
  });
  
  // Check if there are any error messages
  const errors = allConsoleMessages.filter(msg => msg.type === 'error');
  const warnings = allConsoleMessages.filter(msg => msg.type === 'warning');
  
  console.log(`\nFound ${errors.length} errors and ${warnings.length} warnings`);
  
  expect(true).toBe(true);
});