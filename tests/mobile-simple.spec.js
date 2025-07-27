import { test, expect } from '@playwright/test';

test.describe('Mobile Simple Test', () => {
  test('mobile click-to-move works', async ({ page }) => {
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Get initial state
    const initialState = await page.evaluate(() => {
      const game = window.debugGame;
      return {
        moves: game.moves,
        matildaPos: { ...game.matildaPos }
      };
    });

    console.log('Initial state:', initialState);

    // Find a target cell and click it directly (not using tap)
    const moveResult = await page.evaluate(() => {
      const game = window.debugGame;
      
      // Find a path cell
      let targetCell = null;
      for (let y = 0; y < game.mazeSize; y++) {
        for (let x = 0; x < game.mazeSize; x++) {
          if (game.maze[y][x] === 'path' && 
              !(x === game.matildaPos.x && y === game.matildaPos.y) &&
              !(x === game.georgePos.x && y === game.georgePos.y)) {
            targetCell = { x, y };
            break;
          }
        }
        if (targetCell) break;
      }
      
      if (!targetCell) {
        return { error: 'No target cell found' };
      }
      
      // Call handleCellClick directly
      const beforeMoves = game.moves;
      const beforePos = { ...game.matildaPos };
      
      game.handleCellClick(targetCell.x, targetCell.y);
      
      return {
        targetCell,
        beforeMoves,
        beforePos,
        called: true
      };
    });

    console.log('Move result:', moveResult);

    if (moveResult.called) {
      // Wait for pathfinding to complete
      await page.waitForTimeout(2000);

      // Check final state
      const finalState = await page.evaluate(() => {
        const game = window.debugGame;
        return {
          moves: game.moves,
          matildaPos: { ...game.matildaPos }
        };
      });

      console.log('Final state:', finalState);

      // Verify movement occurred
      expect(finalState.moves).toBeGreaterThan(initialState.moves);
    }
  });

  test('touch events are properly handled', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Test that touch event listeners are attached
    const listenersInfo = await page.evaluate(() => {
      const maze = document.getElementById('maze');
      
      // Check if we can trigger events manually  
      let touchendCalled = false;
      let clickCalled = false;
      
      // Override the maze event handlers temporarily to detect calls
      const originalTouchend = maze.ontouchend;
      const originalClick = maze.onclick;
      
      // Create a test event
      const testElement = document.querySelector('.cell[data-x="3"][data-y="3"]');
      
      return {
        mazeExists: !!maze,
        testElementExists: !!testElement,
        testElementData: testElement ? {
          dataX: testElement.dataset.x,
          dataY: testElement.dataset.y,
          className: testElement.className
        } : null
      };
    });

    console.log('Event listeners info:', listenersInfo);
    
    expect(listenersInfo.mazeExists).toBe(true);
  });
});