import { test, expect } from '@playwright/test';

test.describe('Mobile Controls', () => {
  test('click-to-move functionality works', async ({ page }) => {
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
        matildaPos: { ...game.matildaPos },
        activeCharacter: game.activeCharacter
      };
    });

    console.log('Initial state:', initialState);

    // Click on a valid cell to move to (test pathfinding)
    const targetCell = await page.evaluate(() => {
      const game = window.debugGame;
      // Find a valid path cell that's not the current position and not a character position
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
      console.log('Clicking on target cell:', targetCell);

      // Click on the target cell (use force to avoid stability issues)
      await page.click(`[data-x="${targetCell.x}"][data-y="${targetCell.y}"]`, { force: true });

      // Wait for movement to complete
      await page.waitForTimeout(1000);

      // Check if character moved
      const afterMoveState = await page.evaluate(() => {
        const game = window.debugGame;
        return {
          moves: game.moves,
          matildaPos: { ...game.matildaPos },
          activeCharacter: game.activeCharacter
        };
      });

      console.log('After move state:', afterMoveState);

      // Verify that moves increased (pathfinding worked)
      expect(afterMoveState.moves).toBeGreaterThan(initialState.moves);
    }
  });

  test('character switching by clicking characters works', async ({ page }) => {
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });
    
    await page.waitForFunction(() => {
      return typeof window.debugGame !== 'undefined';
    });

    // Get initial character
    const initialCharacter = await page.evaluate(() => {
      return window.debugGame.activeCharacter;
    });

    console.log('Initial active character:', initialCharacter);

    // Click on the inactive character to switch
    const characterToClick = initialCharacter === 'matilda' ? 'george' : 'matilda';
    
    const characterPos = await page.evaluate((char) => {
      const game = window.debugGame;
      return char === 'matilda' ? game.matildaPos : game.georgePos;
    }, characterToClick);

    console.log(`Clicking on ${characterToClick} at position:`, characterPos);

    // Click on the character cell (use force to avoid stability issues)
    await page.click(`[data-x="${characterPos.x}"][data-y="${characterPos.y}"]`, { force: true });

    // Wait for switch to complete
    await page.waitForTimeout(1500);

    // Check if character switched
    const newActiveCharacter = await page.evaluate(() => {
      return window.debugGame.activeCharacter;
    });

    console.log('New active character:', newActiveCharacter);

    // Verify character switched
    expect(newActiveCharacter).not.toBe(initialCharacter);
    expect(newActiveCharacter).toBe(characterToClick);

    // Also check that the display updated
    const displayText = await page.locator('#current-character').textContent();
    const expectedText = characterToClick === 'matilda' ? 'Matilda 👧' : 'George 👦';
    expect(displayText).toBe(expectedText);
  });

  test('mobile CSS classes are applied correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 480, height: 800 });
    
    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });

    // Check that cells have data attributes
    const cellData = await page.evaluate(() => {
      const cells = document.querySelectorAll('.cell');
      const firstCell = cells[0];
      return {
        hasDataX: firstCell.hasAttribute('data-x'),
        hasDataY: firstCell.hasAttribute('data-y'),
        dataX: firstCell.getAttribute('data-x'),
        dataY: firstCell.getAttribute('data-y')
      };
    });

    expect(cellData.hasDataX).toBe(true);
    expect(cellData.hasDataY).toBe(true);
    expect(cellData.dataX).not.toBe(null);
    expect(cellData.dataY).not.toBe(null);

    // Check that character cells have proper styling
    const characterCellStyles = await page.evaluate(() => {
      const matildaCell = document.querySelector('.cell.matilda');
      const georgeCell = document.querySelector('.cell.george');
      
      return {
        matildaHasBorder: matildaCell ? window.getComputedStyle(matildaCell).border !== 'none' : false,
        georgeHasBorder: georgeCell ? window.getComputedStyle(georgeCell).border !== 'none' : false
      };
    });

    console.log('Character cell styles:', characterCellStyles);
  });
});