import { test, expect } from '@playwright/test';

test('debug event listener attachment', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  // Check if the game initialization is complete by looking for specific elements
  const gameInitialized = await page.evaluate(() => {
    const restartBtn = document.getElementById('restart-btn');
    const switchBtn = document.getElementById('switch-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    return {
      restartBtnExists: !!restartBtn,
      switchBtnExists: !!switchBtn,
      playAgainBtnExists: !!playAgainBtn,
      matildaCells: document.querySelectorAll('.matilda').length,
      georgeCells: document.querySelectorAll('.george').length
    };
  });
  
  console.log('Game initialization check:', gameInitialized);

  // Try to manually trigger the switchCharacter method if we can find it
  const manualSwitch = await page.evaluate(() => {
    // Look for any global references to the game
    const allGlobals = Object.keys(window);
    const gameRelated = allGlobals.filter(key => 
      key.toLowerCase().includes('game') || 
      key.toLowerCase().includes('matilda')
    );
    
    return { gameRelated };
  });
  
  console.log('Global variables check:', manualSwitch);

  // Try clicking the button and monitor what happens
  const clickResult = await page.evaluate(() => {
    const btn = document.getElementById('switch-btn');
    if (btn) {
      // Check if button has click listeners by dispatching a click event
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      
      btn.dispatchEvent(clickEvent);
      return 'Event dispatched';
    }
    return 'Button not found';
  });
  
  console.log('Click event dispatch:', clickResult);
  
  await page.waitForTimeout(1000);
  
  const finalCharacter = await page.locator('#current-character').textContent();
  console.log('Character after manual event dispatch:', finalCharacter);

  expect(true).toBe(true);
});