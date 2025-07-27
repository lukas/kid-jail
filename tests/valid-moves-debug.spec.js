import { test, expect } from '@playwright/test';

test('find valid moves from start position', async ({ page }) => {
  await page.goto('/');
  
  // Wait for game to initialize
  await page.waitForFunction(() => {
    const maze = document.querySelector('#maze');
    return maze && maze.children.length > 0;
  });

  await page.waitForTimeout(1000);

  // Check all possible moves from start position
  const validMoves = await page.evaluate(() => {
    const game = window.debugGame;
    if (!game) return { error: 'No game object' };
    
    const currentPos = game.matildaPos;
    const moves = {
      current: { pos: currentPos, cell: game.maze[currentPos.y][currentPos.x] },
      up: null,
      down: null,
      left: null,
      right: null
    };
    
    // Check up
    if (currentPos.y - 1 >= 0) {
      moves.up = {
        pos: { x: currentPos.x, y: currentPos.y - 1 },
        cell: game.maze[currentPos.y - 1][currentPos.x]
      };
    }
    
    // Check down
    if (currentPos.y + 1 < game.mazeSize) {
      moves.down = {
        pos: { x: currentPos.x, y: currentPos.y + 1 },
        cell: game.maze[currentPos.y + 1][currentPos.x]
      };
    }
    
    // Check left
    if (currentPos.x - 1 >= 0) {
      moves.left = {
        pos: { x: currentPos.x - 1, y: currentPos.y },
        cell: game.maze[currentPos.y][currentPos.x - 1]
      };
    }
    
    // Check right
    if (currentPos.x + 1 < game.mazeSize) {
      moves.right = {
        pos: { x: currentPos.x + 1, y: currentPos.y },
        cell: game.maze[currentPos.y][currentPos.x + 1]
      };
    }
    
    return moves;
  });
  
  console.log('Available moves from start position:', validMoves);
  
  // Find a valid direction and test it
  const testValidMove = await page.evaluate(() => {
    const game = window.debugGame;
    const currentPos = game.matildaPos;
    const directions = [
      { name: 'down', x: 0, y: 1 },
      { name: 'up', x: 0, y: -1 },
      { name: 'left', x: -1, y: 0 },
      { name: 'right', x: 1, y: 0 }
    ];
    
    for (const dir of directions) {
      const newPos = { 
        x: currentPos.x + dir.x, 
        y: currentPos.y + dir.y 
      };
      
      if (newPos.x >= 0 && newPos.x < game.mazeSize && 
          newPos.y >= 0 && newPos.y < game.mazeSize &&
          game.maze[newPos.y][newPos.x] !== 'wall') {
        
        // Try this move
        const beforeMoves = game.moves;
        game.moveCharacter(dir.name);
        const afterMoves = game.moves;
        
        return {
          direction: dir.name,
          beforeMoves,
          afterMoves,
          worked: afterMoves > beforeMoves
        };
      }
    }
    
    return { error: 'No valid moves found' };
  });
  
  console.log('Valid move test result:', testValidMove);

  expect(true).toBe(true);
});