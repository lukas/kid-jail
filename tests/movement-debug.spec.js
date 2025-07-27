import { test, expect } from '@playwright/test';

test('debug movement method', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  await page.waitForTimeout(1000);

  // Test moveCharacter method directly
  const moveResult = await page.evaluate(() => {
    const game = window.debugGame;
    const beforeMove = {
      moves: game.moves,
      movesDisplay: document.getElementById('moves').textContent,
      matildaPos: { ...game.matildaPos },
      georgePos: { ...game.georgePos }
    };
    
    try {
      game.moveCharacter('right');
      
      const afterMove = {
        moves: game.moves,
        movesDisplay: document.getElementById('moves').textContent,
        matildaPos: { ...game.matildaPos },
        georgePos: { ...game.georgePos }
      };
      
      return { beforeMove, afterMove, success: true };
    } catch (error) {
      return { error: error.message, success: false };
    }
  });
  
  console.log('Move method test:', moveResult);

  expect(true).toBe(true);
});