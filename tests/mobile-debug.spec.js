import { test, expect } from '@playwright/test';

test.describe('Mobile Debug', () => {
  test('debug mobile touch events', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Add event listeners to capture all events
    await page.evaluate(() => {
      window.debugEvents = [];
      
      const maze = document.getElementById('maze');
      
      // Capture all touch events
      maze.addEventListener('touchstart', (e) => {
        window.debugEvents.push({
          type: 'touchstart',
          target: e.target.className,
          dataX: e.target.dataset?.x,
          dataY: e.target.dataset?.y,
          timestamp: Date.now()
        });
      });
      
      maze.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        window.debugEvents.push({
          type: 'touchend',
          target: e.target.className,
          elementFromPoint: element?.className,
          elementDataX: element?.dataset?.x,
          elementDataY: element?.dataset?.y,
          timestamp: Date.now()
        });
      });
      
      // Capture click events
      maze.addEventListener('click', (e) => {
        window.debugEvents.push({
          type: 'click',
          target: e.target.className,
          dataX: e.target.dataset?.x,
          dataY: e.target.dataset?.y,
          timestamp: Date.now()
        });
      });
      
      // Override handleCellClick to see if it's being called
      const originalHandleCellClick = window.debugGame.handleCellClick;
      window.debugGame.handleCellClick = function(x, y) {
        window.debugEvents.push({
          type: 'handleCellClick',
          x: x,
          y: y,
          timestamp: Date.now()
        });
        return originalHandleCellClick.call(this, x, y);
      };
    });

    // Get initial state
    const initialState = await page.evaluate(() => {
      const game = window.debugGame;
      return {
        moves: game.moves,
        matildaPos: { ...game.matildaPos },
        activeCharacter: game.activeCharacter
      };
    });

    console.log('Initial state:', initialState);

    // Find a path cell to tap
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
      console.log('Target cell to tap:', targetCell);

      // Try tapping the cell
      await page.tap(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
      
      // Wait for any movement
      await page.waitForTimeout(2000);

      // Check events
      const events = await page.evaluate(() => window.debugEvents);
      console.log('Events captured:', events);

      // Check final state
      const finalState = await page.evaluate(() => {
        const game = window.debugGame;
        return {
          moves: game.moves,
          matildaPos: { ...game.matildaPos },
          activeCharacter: game.activeCharacter
        };
      });

      console.log('Final state:', finalState);
    }
  });

  test('debug touchend event specifically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Test the touchend event handling logic directly
    const touchResult = await page.evaluate(() => {
      const maze = document.getElementById('maze');
      const game = window.debugGame;
      
      // Find a target cell
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
      
      if (!targetCell) return { error: 'No target cell found' };
      
      // Get the actual cell element
      const cellElement = document.querySelector(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`);
      if (!cellElement) return { error: 'Cell element not found' };
      
      // Simulate the touchend event manually
      const rect = cellElement.getBoundingClientRect();
      const touchX = rect.left + rect.width / 2;
      const touchY = rect.top + rect.height / 2;
      
      // Create a synthetic touch event
      const touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [{
          clientX: touchX,
          clientY: touchY,
          target: cellElement
        }]
      });
      
      const elementFromPoint = document.elementFromPoint(touchX, touchY);
      
      return {
        targetCell,
        cellElement: {
          className: cellElement.className,
          dataX: cellElement.dataset.x,
          dataY: cellElement.dataset.y
        },
        touchPosition: { x: touchX, y: touchY },
        elementFromPoint: {
          className: elementFromPoint?.className,
          dataX: elementFromPoint?.dataset?.x,
          dataY: elementFromPoint?.dataset?.y
        }
      };
    });

    console.log('Touch event analysis:', touchResult);
  });
});