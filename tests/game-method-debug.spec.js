import { test, expect } from '@playwright/test';

test('debug game methods directly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  // Wait a bit more to ensure game is fully initialized
  await page.waitForTimeout(1000);

  // Check if debugGame is available
  const gameAvailable = await page.evaluate(() => {
    return typeof window.debugGame !== 'undefined';
  });
  
  console.log('Debug game available:', gameAvailable);

  if (gameAvailable) {
    // Test switchCharacter method directly
    const switchResult = await page.evaluate(() => {
      const game = window.debugGame;
      const beforeSwitch = {
        activeCharacter: game.activeCharacter,
        currentCharacterDisplay: document.getElementById('current-character').textContent
      };
      
      try {
        game.switchCharacter();
        
        const afterSwitch = {
          activeCharacter: game.activeCharacter,
          currentCharacterDisplay: document.getElementById('current-character').textContent
        };
        
        return { beforeSwitch, afterSwitch, success: true };
      } catch (error) {
        return { error: error.message, success: false };
      }
    });
    
    console.log('Switch method test:', switchResult);

    // Test move method directly
    const moveResult = await page.evaluate(() => {
      const game = window.debugGame;
      const beforeMove = {
        moves: game.moves,
        movesDisplay: document.getElementById('moves').textContent
      };
      
      try {
        game.move('right');
        
        const afterMove = {
          moves: game.moves,
          movesDisplay: document.getElementById('moves').textContent
        };
        
        return { beforeMove, afterMove, success: true };
      } catch (error) {
        return { error: error.message, success: false };
      }
    });
    
    console.log('Move method test:', moveResult);

    // Check current game state
    const gameState = await page.evaluate(() => {
      const game = window.debugGame;
      return {
        activeCharacter: game.activeCharacter,
        moves: game.moves,
        gameWon: game.gameWon,
        matildaPos: game.matildaPos,
        georgePos: game.georgePos
      };
    });
    
    console.log('Current game state:', gameState);
  }

  expect(true).toBe(true);
});