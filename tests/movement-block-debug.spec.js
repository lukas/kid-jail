import { test, expect } from '@playwright/test';

test('debug movement blocking conditions', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  await page.waitForTimeout(1000);

  // Check all the conditions that might prevent movement
  const gameState = await page.evaluate(() => {
    const game = window.debugGame;
    if (!game) return { error: 'No game object' };
    
    return {
      gameWon: game.gameWon,
      activeCharacter: game.activeCharacter,
      matildaPos: game.matildaPos,
      georgePos: game.georgePos,
      mazeSize: game.mazeSize,
      moves: game.moves,
      // Check what's in the maze at current position and target position
      currentMazeCell: game.maze && game.maze[game.matildaPos.y] ? game.maze[game.matildaPos.y][game.matildaPos.x] : 'undefined',
      targetMazeCell: game.maze && game.maze[game.matildaPos.y] && game.matildaPos.x + 1 < game.mazeSize ? 
        game.maze[game.matildaPos.y][game.matildaPos.x + 1] : 'out of bounds'
    };
  });
  
  console.log('Game state check:', gameState);
  
  // Try to understand what happens step by step in moveCharacter
  const stepByStepResult = await page.evaluate(() => {
    const game = window.debugGame;
    if (!game) return { error: 'No game object' };
    
    // Manual implementation of what moveCharacter does step by step
    if (game.gameWon) {
      return { blocked: 'game won' };
    }
    
    const currentPos = game.activeCharacter === 'matilda' ? game.matildaPos : game.georgePos;
    const newPos = { ...currentPos };
    
    // Try to move right
    newPos.x += 1;
    
    // Check bounds
    if (newPos.x < 0 || newPos.x >= game.mazeSize || newPos.y < 0 || newPos.y >= game.mazeSize) {
      return { blocked: 'out of bounds', newPos, mazeSize: game.mazeSize };
    }
    
    // Check if it's a wall
    if (game.maze[newPos.y][newPos.x] === 'wall') {
      return { blocked: 'wall', newPos, cellType: game.maze[newPos.y][newPos.x] };
    }
    
    return { 
      canMove: true, 
      currentPos, 
      newPos, 
      cellType: game.maze[newPos.y][newPos.x] 
    };
  });
  
  console.log('Step by step movement check:', stepByStepResult);

  expect(true).toBe(true);
});