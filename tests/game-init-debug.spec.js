import { test, expect } from '@playwright/test';

test('debug game initialization', async ({ page }) => {
  await page.goto('/');
  
  // Wait for scripts to load
  await page.waitForTimeout(1000);
  
  // Check if the MatildaEscapeGame class exists
  const classExists = await page.evaluate(() => {
    return typeof MatildaEscapeGame !== 'undefined';
  });
  console.log('MatildaEscapeGame class exists:', classExists);
  
  // Check if DOMContentLoaded has fired
  const domReady = await page.evaluate(() => {
    return document.readyState === 'complete';
  });
  console.log('DOM ready state:', domReady);
  
  // Wait for maze to be generated and check initialization
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  }, { timeout: 10000 });
  
  // Check if we can find any evidence of the game running
  const gameEvidence = await page.evaluate(() => {
    const maze = document.querySelector('#maze');
    const cells = maze ? maze.querySelectorAll('.cell') : [];
    const matildaCells = maze ? maze.querySelectorAll('.matilda') : [];
    const georgeCells = maze ? maze.querySelectorAll('.george') : [];
    
    return {
      mazeCells: cells.length,
      matildaCells: matildaCells.length,
      georgeCells: georgeCells.length,
      hasWalls: maze ? maze.querySelectorAll('.wall').length : 0,
      hasPaths: maze ? maze.querySelectorAll('.path').length : 0
    };
  });
  
  console.log('Game evidence:', gameEvidence);
  
  // Try to manually trigger button click and see what happens
  const buttonClickResult = await page.evaluate(() => {
    const button = document.getElementById('switch-btn');
    if (button) {
      const originalText = document.getElementById('current-character').textContent;
      button.click();
      setTimeout(() => {
        const newText = document.getElementById('current-character').textContent;
        return { originalText, newText, changed: originalText !== newText };
      }, 100);
      return 'Button clicked';
    }
    return 'Button not found';
  });
  
  console.log('Button click result:', buttonClickResult);
  
  await page.waitForTimeout(1500);
  
  const finalCharacter = await page.locator('#current-character').textContent();
  console.log('Final character after manual click:', finalCharacter);
  
  expect(true).toBe(true);
});