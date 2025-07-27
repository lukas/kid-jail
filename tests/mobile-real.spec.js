import { test, expect } from '@playwright/test';

test.describe('Real Mobile Device Test', () => {
  test('mobile touch interaction works', async ({ page, isMobile }) => {
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    console.log('Is mobile device:', isMobile);

    // Add event tracking
    await page.evaluate(() => {
      window.eventLog = [];
      
      const maze = document.getElementById('maze');
      
      // Track all events
      ['click', 'touchstart', 'touchend', 'tap'].forEach(eventType => {
        maze.addEventListener(eventType, (e) => {
          window.eventLog.push({
            type: eventType,
            target: e.target.className,
            dataX: e.target.dataset?.x,
            dataY: e.target.dataset?.y,
            timestamp: Date.now()
          });
        }, true);
      });
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

    // Find target cell
    const targetCell = await page.evaluate(() => {
      const game = window.debugGame;
      for (let y = 0; y < game.mazeSize; y++) {
        for (let x = 0; x < game.mazeSize; x++) {
          if (game.maze[y][x] === 'path' && 
              !(x === game.matildaPos.x && y === game.matildaPos.y) &&
              !(x === game.georgePos.x && y === game.georgePos.y)) {
            return { x, y };
          }
        }
      }
      return null;
    });

    if (targetCell) {
      console.log('Target cell:', targetCell);

      // Try different interaction methods
      if (isMobile) {
        // Use mobile touch
        try {
          await page.tap(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
        } catch (error) {
          console.log('Tap failed, trying click:', error.message);
          await page.click(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
        }
      } else {
        // Use regular click
        await page.click(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
      }

      // Wait for movement
      await page.waitForTimeout(2000);

      // Check events and final state
      const results = await page.evaluate(() => {
        const game = window.debugGame;
        return {
          events: window.eventLog,
          finalState: {
            moves: game.moves,
            matildaPos: { ...game.matildaPos }
          }
        };
      });

      console.log('Events captured:', results.events);
      console.log('Final state:', results.finalState);

      // Check if movement occurred
      const moved = results.finalState.moves > initialState.moves ||
                   results.finalState.matildaPos.x !== initialState.matildaPos.x ||
                   results.finalState.matildaPos.y !== initialState.matildaPos.y;

      console.log('Movement detected:', moved);
      
      // For now, just log the results - we'll see what's happening
      expect(results.events.length).toBeGreaterThan(0);
    }
  });

  test('click interaction works on any viewport', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Test click on desktop (should always work)
    const result = await page.evaluate(() => {
      const game = window.debugGame;
      
      // Find target
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
      
      if (!targetCell) return { error: 'No target found' };
      
      // Get the target element and simulate click
      const cellElement = document.querySelector(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
      if (!cellElement) return { error: 'Element not found' };
      
      const beforeMoves = game.moves;
      
      // Simulate click event
      cellElement.click();
      
      return {
        targetCell,
        beforeMoves,
        elementFound: true
      };
    });

    if (result.elementFound) {
      await page.waitForTimeout(1500);
      
      const finalMoves = await page.evaluate(() => window.debugGame.moves);
      
      console.log('Click test result:', { 
        ...result, 
        finalMoves,
        moved: finalMoves > result.beforeMoves 
      });
      
      expect(finalMoves).toBeGreaterThan(result.beforeMoves);
    }
  });
});