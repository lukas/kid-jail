# George and Matilda Escape from Kid Jail

A fun, interactive maze-based escape game where players help George and Matilda break free from their dad's elaborate maze prison! Switch between characters, discover secret passages, use magical items, and avoid getting caught.

## 🎮 Game Features

- **Dual Character Control**: Switch between Matilda and George, each with unique abilities
- **Dynamic Maze Generation**: Every game features a procedurally generated maze
- **Special Items & Power-ups**:
  - 🔍 Secret passages hidden near walls
  - 🌀 Teleportation tunnels
  - 🚀 Bounce pads for quick movement
  - ⭐ Power-ups for temporary advantages
- **Ghost Helpers**: Friendly spirits provide hints and assistance
- **Real-time Scoring**: Track moves and score as you progress
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lukas/kid-jail.git
   cd kid-jail
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🎯 How to Play

### Controls
- **Arrow Keys** or **WASD**: Move current character
- **Space Bar**: Switch between Matilda and George
- **Click Buttons**: Use on-screen controls for mobile

### Objective
- Help both George and Matilda reach the exit
- Discover hidden passages by walking near walls
- Use special items strategically
- Avoid getting caught by Dad!
- Minimize moves for a higher score

### Special Mechanics
- **Secret Passages**: Walk near walls to reveal hidden paths (🔍)
- **Tunnels**: Purple spiral portals teleport you across the maze (🌀)
- **Bounce Pads**: Orange pads launch you 2-3 cells in your last movement direction (🚀)
- **Character Following**: The inactive character follows the active one
- **Ghost Assistance**: Friendly spirits provide warnings and help

## 🧪 Testing

The game includes comprehensive Playwright tests covering:

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run specific test
npx playwright test tests/game.spec.js
```

### Test Coverage
- ✅ Page loading without JavaScript errors
- ✅ Game initialization and maze generation
- ✅ Character switching (button and keyboard)
- ✅ Keyboard movement controls
- ✅ UI element presence and functionality
- ✅ Game restart functionality

## 🚀 Deployment

### Netlify (Recommended)

1. **Automatic Deployment** (with GitHub integration):
   - Connect your GitHub repository to Netlify
   - Netlify automatically detects the `netlify.toml` configuration
   - Deploys on every push to main branch

2. **Manual Deployment**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Other Platforms
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🛠️ Development

### Project Structure
```
kid-jail/
├── index.html          # Main HTML file
├── game.js            # Core game logic
├── style.css          # Game styling
├── netlify.toml       # Netlify configuration
├── playwright.config.js # Test configuration
├── tests/             # Playwright test files
└── dist/              # Built files (generated)
```

### Key Technologies
- **Vanilla JavaScript**: No frameworks, pure JS for game logic
- **Vite**: Modern build tool and dev server
- **Playwright**: End-to-end testing framework
- **CSS Grid/Flexbox**: Responsive layout
- **Web Audio API**: Sound effects (browser-compatible)

### Game Architecture
- `MatildaEscapeGame` class handles all game logic
- Maze generation uses recursive backtracking algorithm
- Event-driven architecture for user interactions
- Modular sound system with graceful audio fallbacks

## 🐛 Troubleshooting

### Common Issues

**Game not loading properly:**
- Ensure you're using `npm run dev` not opening `index.html` directly
- Check browser console for JavaScript errors

**Tests failing:**
- Verify Playwright browsers are installed: `npx playwright install`
- Check that dev server is running on port 5173

**Audio warnings in browser:**
- Normal behavior - browsers require user interaction for audio
- Game functions perfectly without audio

**Movement not working:**
- Game validates moves - ensure you're not hitting walls
- From start position, try moving DOWN first (other directions may be blocked)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m "Description"`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Ensure all tests pass before submitting
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Credits

Created as a fun escape game featuring George and Matilda's adventure. Special thanks to the open source community for the tools and inspiration that made this project possible.

---

**Have fun escaping!** 🏃‍♀️🏃‍♂️💨