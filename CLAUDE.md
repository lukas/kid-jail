# Claude Development Guide

## Setup Instructions

Use node to create a local web app
Use nvm to create your own node version

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run Playwright tests
- `npm run test:headed` - Run tests with browser visible

## Game-Specific Context

This is a browser-based escape game called "George and Matilda Escape from Kid Jail". Key technical details:

### Architecture
- **Main Game Class**: `MatildaEscapeGame` in `game.js`
- **Global Debug Access**: `window.debugGame` is exposed for debugging
- **Module System**: Uses ES6 modules (`type="module"` in script tag)
- **Build Tool**: Vite for development and production builds

### Common Issues & Debugging

#### SyntaxError: Unexpected token '<'
- **Cause**: Script not loading as module or build issues
- **Solution**: Ensure `<script type="module" src="game.js">` and proper Vite build
- **Check**: Verify dist/ contains bundled JS files after `npm run build`

#### Game Functions Not Working
- **Movement Issues**: Check if trying to move through walls
  - From start position (1,1), only DOWN movement is initially valid
  - Use ArrowDown or 's' key for first move
- **Character Switching**: Ensure `switchCharacter()` calls `renderMaze()`
- **Display Updates**: Character display updated in `renderMaze()` method

#### Mobile Touch Controls Not Working
- **Key Insight**: Always check for conflicting event handlers first
- **Data Attributes**: Ensure cells have `data-x` and `data-y` attributes for coordinate detection
- **Event Conflicts**: Remove old swipe/touch handlers that interfere with new click-to-move
- **Pathfinding**: Implement BFS algorithm for smooth click-to-move navigation
- **Testing**: Use `--project=mobile` with Playwright to test mobile viewport
- **Quick Fix**: Add both 'click' and 'touchend' listeners with preventDefault()

#### Font Readability Issues
- **Problem**: Comic Sans MS hard to read on mobile for kids
- **Quick Solution**: Use CSS media queries to switch to Arial on mobile
- **Implementation**: Apply font changes to body, h1, instructions, and game-info
- **Testing**: Verify with mobile viewport in browser dev tools

#### Audio Context Warnings
- **Normal Behavior**: Browser requires user interaction for Web Audio API
- **Non-blocking**: Game works perfectly without audio
- **Solution**: Audio is disabled by default to prevent console warnings

### Testing with Playwright

#### Test Requirements
```javascript
// Always wait for game initialization
await page.waitForFunction(() => {
  const maze = document.querySelector('#maze');
  return maze && maze.children.length > 0;
});

// Wait for game object to be available
await page.waitForFunction(() => {
  return typeof window.debugGame !== 'undefined';
});
```

#### Mobile Testing Best Practices
```javascript
// Configure mobile project in playwright.config.js
{
  name: 'mobile',
  use: {
    ...devices['iPhone 12'],
    hasTouch: true,
  },
}

// Test mobile interactions
await page.tap(`[data-x="${targetX}"][data-y="${targetY}"]`);

// Debug mobile events
await page.evaluate(() => {
  window.eventLog = [];
  const maze = document.getElementById('maze');
  ['click', 'touchstart', 'touchend'].forEach(eventType => {
    maze.addEventListener(eventType, (e) => {
      window.eventLog.push({
        type: eventType,
        target: e.target.className,
        dataX: e.target.dataset?.x,
        dataY: e.target.dataset?.y
      });
    }, true);
  });
});
```

#### Debugging Tests
```javascript
// Access game state in tests
const gameState = await page.evaluate(() => {
  const game = window.debugGame;
  return {
    moves: game.moves,
    activeCharacter: game.activeCharacter,
    matildaPos: game.matildaPos,
    gameWon: game.gameWon
  };
});
```

#### Movement Testing
- **Valid First Move**: Use ArrowDown from start position
- **Invalid Moves**: ArrowRight/Left/Up may hit walls from start
- **Test Pattern**: Always check maze layout before testing movement
- **Mobile Testing**: Test both click and tap interactions with proper data attributes

### Quick Debugging Commands

```bash
# Test specific functionality
npx playwright test tests/debug.spec.js --headed

# Test mobile functionality specifically
npx playwright test tests/mobile-simple.spec.js --project=mobile

# Run with browser console visible
npx playwright test --headed --debug

# Access game in browser console
window.debugGame.switchCharacter()
window.debugGame.moveCharacter('down')
window.debugGame.handleCellClick(5, 5)  # Test mobile click-to-move
```

### Mobile Development Insights

**What Would Have Made Mobile Implementation Faster:**

1. **Start with Data Attributes**: Always add `data-x` and `data-y` to clickable elements from the beginning
2. **Remove Conflicting Handlers**: Check for existing touch/swipe handlers that might interfere
3. **Implement Pathfinding Early**: BFS algorithm is essential for smooth click-to-move
4. **Test Mobile Viewport Immediately**: Use `--project=mobile` flag from the start
5. **Font Readability**: Consider mobile font readability early in design phase
6. **Event Debugging**: Set up event logging infrastructure for debugging touch interactions

### Development Workflow

1. **Start Dev Server**: `npm run dev`
2. **Make Changes**: Edit game.js, index.html, or style.css
3. **Test in Browser**: Navigate to http://localhost:5173
4. **Run Tests**: `npm test` to verify functionality
5. **Build for Production**: `npm run build`
6. **Deploy**: Push to main branch (auto-deploys to Netlify)

### File Structure Context
- `index.html` - Entry point with game UI
- `game.js` - Core game logic (MatildaEscapeGame class)
- `style.css` - All game styling
- `tests/` - Playwright test files
- `dist/` - Production build output (generated)
- `netlify.toml` - Deployment configuration