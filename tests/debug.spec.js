import { test, expect } from '@playwright/test';

test.describe('Debug Game Issues', () => {
  test('debug character switching and movement', async ({ page }) => {
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Capture JavaScript errors
    const jsErrors = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/');
    
    // Wait for game to initialize
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });

    console.log('=== DEBUGGING GAME STATE ===');
    
    // Check if game object exists in window
    const gameExists = await page.evaluate(() => {
      return typeof window.game !== 'undefined';
    });
    console.log('Game object exists in window:', gameExists);

    // Check current character display
    const currentCharacter = await page.locator('#current-character').textContent();
    console.log('Current character display:', currentCharacter);

    // Try to access game state directly
    const gameState = await page.evaluate(() => {
      // Look for the game instance
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer && gameContainer._game) {
        return {
          activeCharacter: gameContainer._game.activeCharacter,
          moves: gameContainer._game.moves
        };
      }
      
      // Check if there's a global game variable
      if (window.game) {
        return {
          activeCharacter: window.game.activeCharacter,
          moves: window.game.moves
        };
      }
      
      return 'No game object found';
    });
    console.log('Game state:', gameState);

    // Check initial moves
    const initialMoves = await page.locator('#moves').textContent();
    console.log('Initial moves:', initialMoves);

    // Try clicking switch button and see what happens
    console.log('\n=== TESTING CHARACTER SWITCH ===');
    await page.click('#switch-btn');
    await page.waitForTimeout(1500); // Wait for any animations/messages

    const newCharacter = await page.locator('#current-character').textContent();
    console.log('Character after switch button:', newCharacter);

    // Try keyboard movement
    console.log('\n=== TESTING KEYBOARD MOVEMENT ===');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    const movesAfterKeyboard = await page.locator('#moves').textContent();
    console.log('Moves after ArrowRight:', movesAfterKeyboard);

    // Try space key for character switch
    console.log('\n=== TESTING SPACE KEY ===');
    const characterBeforeSpace = await page.locator('#current-character').textContent();
    console.log('Character before space:', characterBeforeSpace);
    
    await page.keyboard.press('Space');
    await page.waitForTimeout(1500);
    
    const characterAfterSpace = await page.locator('#current-character').textContent();
    console.log('Character after space:', characterAfterSpace);

    // Check for any error messages on the page
    const errorMessages = await page.locator('.error, .message').allTextContents();
    console.log('Error/message elements:', errorMessages);

    // Log all console messages
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));

    // Log JavaScript errors
    console.log('\n=== JAVASCRIPT ERRORS ===');
    jsErrors.forEach(error => console.log('ERROR:', error));

    // Just pass the test - we're debugging
    expect(true).toBe(true);
  });

  test('check event listeners', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForFunction(() => {
      const maze = document.querySelector('#maze');
      return maze && maze.children.length > 0;
    });

    // Check if event listeners are attached
    const eventListenerInfo = await page.evaluate(() => {
      const switchBtn = document.getElementById('switch-btn');
      const restartBtn = document.getElementById('restart-btn');
      
      return {
        switchBtnHasListener: switchBtn ? getEventListeners(switchBtn).click?.length > 0 : false,
        restartBtnHasListener: restartBtn ? getEventListeners(restartBtn).click?.length > 0 : false,
        documentKeydownListeners: getEventListeners(document).keydown?.length || 0
      };
    }).catch(() => {
      // getEventListeners might not be available, that's ok
      return { error: 'getEventListeners not available' };
    });

    console.log('Event listener info:', eventListenerInfo);
    expect(true).toBe(true);
  });
});