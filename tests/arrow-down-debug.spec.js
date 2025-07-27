import { test, expect } from '@playwright/test';

test('debug ArrowDown key specifically', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  await page.waitForTimeout(1000);

  // Check initial state
  const initialState = await page.evaluate(() => {
    const game = window.debugGame;
    return {
      moves: game.moves,
      activeCharacter: game.activeCharacter,
      matildaPos: { ...game.matildaPos },
      movesDisplay: document.getElementById('moves').textContent
    };
  });
  
  console.log('Initial state:', initialState);

  // Add keyboard event listener
  await page.evaluate(() => {
    window.arrowDownEvents = [];
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        window.arrowDownEvents.push({
          key: e.key,
          prevented: e.defaultPrevented,
          timestamp: Date.now()
        });
      }
    });
  });

  // Press ArrowDown
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(300);

  // Check what happened
  const afterKeyPress = await page.evaluate(() => {
    const game = window.debugGame;
    return {
      moves: game.moves,
      activeCharacter: game.activeCharacter,
      matildaPos: { ...game.matildaPos },
      movesDisplay: document.getElementById('moves').textContent,
      arrowDownEvents: window.arrowDownEvents
    };
  });
  
  console.log('After ArrowDown press:', afterKeyPress);

  // Try calling moveCharacter('down') directly to compare
  const directCall = await page.evaluate(() => {
    const game = window.debugGame;
    const beforeDirect = { moves: game.moves, matildaPos: { ...game.matildaPos } };
    game.moveCharacter('down');
    const afterDirect = { moves: game.moves, matildaPos: { ...game.matildaPos } };
    return { beforeDirect, afterDirect };
  });
  
  console.log('Direct moveCharacter call:', directCall);

  expect(true).toBe(true);
});