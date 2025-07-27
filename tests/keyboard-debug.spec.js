import { test, expect } from '@playwright/test';

test('debug keyboard events', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  await page.waitForTimeout(1000);

  // Add a keyboard event listener to see if events are being triggered
  await page.evaluate(() => {
    window.keyboardEvents = [];
    document.addEventListener('keydown', (e) => {
      window.keyboardEvents.push({
        key: e.key,
        code: e.code,
        target: e.target.tagName,
        prevented: e.defaultPrevented
      });
    });
  });

  // Press arrow key
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(200);

  // Check what keyboard events were captured
  const keyboardEvents = await page.evaluate(() => window.keyboardEvents);
  console.log('Keyboard events captured:', keyboardEvents);

  // Check moves counter
  const moves = await page.locator('#moves').textContent();
  console.log('Moves after keyboard press:', moves);

  // Try calling moveCharacter directly to see if it works
  const directMoveResult = await page.evaluate(() => {
    const game = window.debugGame;
    if (game) {
      const beforeMoves = game.moves;
      game.moveCharacter('right');
      const afterMoves = game.moves;
      return { beforeMoves, afterMoves, success: true };
    }
    return { success: false, error: 'No game object' };
  });
  
  console.log('Direct moveCharacter call:', directMoveResult);

  expect(true).toBe(true);
});