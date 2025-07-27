class MatildaEscapeGame {
    constructor() {
        this.maze = [];
        this.matildaPos = { x: 0, y: 0 };
        this.exitPos = { x: 0, y: 0 };
        this.dadPositions = [];
        this.moves = 0;
        this.gameWon = false;
        this.mazeSize = 15;
        this.sounds = {};
        this.powerUps = [];
        this.hasInvisibility = false;
        this.invisibilityTimer = 0;
        this.score = 0;
        this.georgePos = { x: 0, y: 0 };
        this.georgeHelped = false;
        this.georgeCooldown = 0;
        this.matildaGhostPos = { x: 1, y: 1 };
        this.georgeGhostPos = { x: 1, y: 1 };
        this.ghostLastSpookTime = 0;
        this.ghostInvisibilityTimer = 0;
        this.ghostHelping = false;
        this.tunnelEntrance = { x: 0, y: 0 };
        this.tunnelExit = { x: 0, y: 0 };
        this.bouncePads = [];
        this.activeCharacter = 'matilda'; // 'matilda' or 'george'
        this.lastDirection = { x: 0, y: 0 };
        this.secretPassages = [];
        this.discoveredPassages = [];
        this.spacePressed = false;
        
        this.initSounds();
        this.init();
    }

    initSounds() {
        // Initialize audio context only when needed (after user interaction)
        this.audioContext = null;
        
        // Sound effect functions using Web Audio API
        this.sounds = {
            move: () => this.playTone(220, 0.1, 0.05),
            caught: () => this.playScream(),
            win: () => this.playVictoryFanfare(),
            powerUp: () => this.playPowerUpSound(),
            invisibility: () => this.playMagicSound(),
            georgeHelp: () => this.playGeorgeHelpSound(),
            georgeAlert: () => this.playGeorgeAlertSound(),
            ghostSpook: () => this.playGhostSpookSound(),
            ghostWhisper: () => this.playGhostWhisperSound(),
            ghostMagic: () => this.playGhostMagicSound(),
            tunnel: () => this.playTunnelSound(),
            bounce: () => this.playBounceSound(),
            switch: () => this.playSwitchSound(),
            secretReveal: () => this.playSecretRevealSound()
        };
    }

    initAudioContext() {
        // Skip audio context creation for now to avoid browser warnings
        // This can be re-enabled when user interaction is properly detected
        this.audioContext = null;
    }

    playTone(frequency, duration, volume = 0.1) {
        this.initAudioContext();
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playScream() {
        // Dramatic descending sound effect
        const frequencies = [800, 600, 400, 200, 100];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 0.3), i * 50);
        });
    }

    playVictoryFanfare() {
        // Victory melody
        const melody = [
            { freq: 523, duration: 0.2 }, // C5
            { freq: 659, duration: 0.2 }, // E5
            { freq: 784, duration: 0.2 }, // G5
            { freq: 1047, duration: 0.4 }, // C6
            { freq: 784, duration: 0.2 }, // G5
            { freq: 1047, duration: 0.6 }, // C6
        ];
        
        melody.forEach((note, i) => {
            setTimeout(() => this.playTone(note.freq, note.duration, 0.2), i * 200);
        });
    }

    playPowerUpSound() {
        // Ascending magical sound
        const frequencies = [200, 300, 400, 500, 600];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.1, 0.2), i * 30);
        });
    }

    playMagicSound() {
        // Sparkly invisibility sound
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.playTone(400 + Math.random() * 400, 0.05, 0.1);
            }, i * 20);
        }
    }

    playGeorgeHelpSound() {
        // Cheerful helper sound
        const melody = [
            { freq: 440, duration: 0.15 }, // A4
            { freq: 523, duration: 0.15 }, // C5
            { freq: 659, duration: 0.2 },  // E5
        ];
        
        melody.forEach((note, i) => {
            setTimeout(() => this.playTone(note.freq, note.duration, 0.15), i * 100);
        });
    }

    playGeorgeAlertSound() {
        // Warning beep sound
        this.playTone(800, 0.1, 0.2);
        setTimeout(() => this.playTone(800, 0.1, 0.2), 150);
    }

    playGhostSpookSound() {
        // Spooky whoosh sound - descending then ascending
        const frequencies = [400, 300, 200, 150, 200, 300, 400];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 0.1), i * 100);
        });
    }

    playGhostWhisperSound() {
        // Eerie whisper-like sound
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playTone(150 + Math.random() * 100, 0.4, 0.05);
            }, i * 80);
        }
    }

    playGhostMagicSound() {
        // Magical ghost spell sound - ethereal and mystical
        const frequencies = [300, 400, 500, 600, 700, 600, 500, 400];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 0.12), i * 120);
        });
    }

    playTunnelSound() {
        // Tunnel teleportation sound - whoosh effect
        const frequencies = [200, 300, 400, 500, 600, 500, 400, 300, 200];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 0.15), i * 60);
        });
    }

    playBounceSound() {
        // Bounce pad sound - ascending spring boing
        const frequencies = [150, 200, 300, 450, 600];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.12, 0.18), i * 40);
        });
    }

    playSwitchSound() {
        // Character switch sound - quick toggle
        this.playTone(400, 0.1, 0.15);
        setTimeout(() => this.playTone(600, 0.1, 0.15), 100);
    }

    playSecretRevealSound() {
        // Mysterious discovery sound - ascending mystery chord
        const frequencies = [220, 277, 330, 415, 523];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.4, 0.1), i * 150);
        });
    }

    init() {
        this.generateMaze();
        this.renderMaze();
        this.attachEventListeners();
        this.addMobileTouchControls();
        this.startGameLoop();
    }

    generateMaze() {
        // Initialize maze with walls
        this.maze = Array(this.mazeSize).fill().map(() => 
            Array(this.mazeSize).fill('wall')
        );

        // Create paths using recursive backtracking
        const stack = [];
        const visited = Array(this.mazeSize).fill().map(() => 
            Array(this.mazeSize).fill(false)
        );

        // Start position (top-left corner)
        let current = { x: 1, y: 1 };
        this.matildaPos = { ...current };
        
        // Two ghosts - one for each kid, near the start
        this.matildaGhostPos = { x: 1, y: 1 };
        this.georgeGhostPos = { x: 1, y: 1 };
        
        this.maze[current.y][current.x] = 'path';
        visited[current.y][current.x] = true;
        stack.push(current);

        // After maze generation, we'll place George next to Matilda

        while (stack.length > 0) {
            const neighbors = this.getUnvisitedNeighbors(current, visited);
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Remove wall between current and next
                const wallX = current.x + (next.x - current.x) / 2;
                const wallY = current.y + (next.y - current.y) / 2;
                
                this.maze[wallY][wallX] = 'path';
                this.maze[next.y][next.x] = 'path';
                visited[next.y][next.x] = true;
                
                stack.push(current);
                current = next;
            } else {
                current = stack.pop();
            }
        }

        // Set exit position (bottom-right area)
        this.exitPos = { x: this.mazeSize - 2, y: this.mazeSize - 2 };
        this.maze[this.exitPos.y][this.exitPos.x] = 'exit';

        // Ensure there's a path from start to exit
        this.ensurePathExists();

        // Add some dad obstacles in safe positions
        this.addDadObstacles();

        // Add power-ups
        this.addPowerUps();

        // Add tunnel system
        this.addTunnels();

        // Add bounce pads
        this.addBouncePads();

        // Add secret passages
        this.addSecretPassages();

        // Place George next to Matilda
        this.positionGeorge();

        // Ensure start position is marked
        this.maze[this.matildaPos.y][this.matildaPos.x] = 'start';
    }

    getUnvisitedNeighbors(pos, visited) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -2 }, // up
            { x: 2, y: 0 },  // right
            { x: 0, y: 2 },  // down
            { x: -2, y: 0 }  // left
        ];

        for (const dir of directions) {
            const newX = pos.x + dir.x;
            const newY = pos.y + dir.y;

            if (newX > 0 && newX < this.mazeSize - 1 && 
                newY > 0 && newY < this.mazeSize - 1 && 
                !visited[newY][newX]) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    }

    ensurePathExists() {
        // Use breadth-first search to check if path exists from start to exit
        if (this.hasPathToExit()) {
            return; // Path already exists
        }

        // If no path exists, create one using A* pathfinding approach
        const path = this.findPathToExit();
        if (path && path.length > 0) {
            // Clear walls along the path
            for (const pos of path) {
                this.maze[pos.y][pos.x] = 'path';
            }
        }
    }

    hasPathToExit() {
        const visited = Array(this.mazeSize).fill().map(() => 
            Array(this.mazeSize).fill(false)
        );
        const queue = [this.matildaPos];
        visited[this.matildaPos.y][this.matildaPos.x] = true;

        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, 
            { x: 0, y: 1 }, { x: -1, y: 0 }
        ];

        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.x === this.exitPos.x && current.y === this.exitPos.y) {
                return true;
            }

            for (const dir of directions) {
                const newX = current.x + dir.x;
                const newY = current.y + dir.y;

                if (newX >= 0 && newX < this.mazeSize && 
                    newY >= 0 && newY < this.mazeSize &&
                    !visited[newY][newX] &&
                    (this.maze[newY][newX] === 'path' || 
                     this.maze[newY][newX] === 'exit' ||
                     this.maze[newY][newX] === 'start')) {
                    
                    visited[newY][newX] = true;
                    queue.push({ x: newX, y: newY });
                }
            }
        }
        
        return false;
    }

    findPathToExit() {
        // Simple pathfinding to create a guaranteed path
        const path = [];
        let current = { ...this.matildaPos };
        
        // Move right as much as possible
        while (current.x < this.exitPos.x) {
            current.x++;
            path.push({ ...current });
        }
        
        // Move down as much as possible
        while (current.y < this.exitPos.y) {
            current.y++;
            path.push({ ...current });
        }
        
        return path;
    }

    addDadObstacles() {
        this.dadPositions = [];
        
        // Find safe positions for dad obstacles
        const safeCells = this.findSafeDadPositions();
        
        // Place 2-4 dad obstacles in safe positions
        const numDads = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numDads && safeCells.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * safeCells.length);
            const dadPos = safeCells.splice(randomIndex, 1)[0];
            this.dadPositions.push(dadPos);
        }
    }

    findSafeDadPositions() {
        const safeCells = [];
        
        // Find all path cells
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] === 'path' && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.exitPos.x && y === this.exitPos.y)) {
                    
                    // Test if placing a dad here would still allow a path to exit
                    const tempDadPos = { x, y };
                    if (this.wouldStillHavePathWithDad(tempDadPos)) {
                        safeCells.push(tempDadPos);
                    }
                }
            }
        }
        
        return safeCells;
    }

    wouldStillHavePathWithDad(dadPos) {
        // Temporarily add dad to test pathfinding
        const tempDadPositions = [...this.dadPositions, dadPos];
        
        const visited = Array(this.mazeSize).fill().map(() => 
            Array(this.mazeSize).fill(false)
        );
        const queue = [this.matildaPos];
        visited[this.matildaPos.y][this.matildaPos.x] = true;

        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, 
            { x: 0, y: 1 }, { x: -1, y: 0 }
        ];

        while (queue.length > 0) {
            const current = queue.shift();
            
            if (current.x === this.exitPos.x && current.y === this.exitPos.y) {
                return true;
            }

            for (const dir of directions) {
                const newX = current.x + dir.x;
                const newY = current.y + dir.y;

                if (newX >= 0 && newX < this.mazeSize && 
                    newY >= 0 && newY < this.mazeSize &&
                    !visited[newY][newX] &&
                    (this.maze[newY][newX] === 'path' || 
                     this.maze[newY][newX] === 'exit' ||
                     this.maze[newY][newX] === 'start') &&
                    !tempDadPositions.some(dad => dad.x === newX && dad.y === newY)) {
                    
                    visited[newY][newX] = true;
                    queue.push({ x: newX, y: newY });
                }
            }
        }
        
        return false;
    }

    addPowerUps() {
        this.powerUps = [];
        const pathCells = [];
        
        // Find all path cells except start, exit, and dad positions
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] === 'path' && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.exitPos.x && y === this.exitPos.y) &&
                    !this.dadPositions.some(dad => dad.x === x && dad.y === y)) {
                    pathCells.push({ x, y });
                }
            }
        }

        // Add 2-3 power-ups
        const numPowerUps = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numPowerUps && pathCells.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * pathCells.length);
            const powerUpPos = pathCells.splice(randomIndex, 1)[0];
            const powerUpType = Math.random() < 0.5 ? 'invisibility' : 'speed';
            this.powerUps.push({ ...powerUpPos, type: powerUpType });
        }
    }

    addTunnels() {
        // Find suitable locations for tunnel entrance and exit
        const availableCells = [];
        
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] === 'path' && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.exitPos.x && y === this.exitPos.y) &&
                    !this.dadPositions.some(dad => dad.x === x && dad.y === y) &&
                    !this.powerUps.some(powerUp => powerUp.x === x && powerUp.y === y)) {
                    
                    // Avoid placing tunnels too close to start or exit
                    const distanceToStart = Math.abs(x - this.matildaPos.x) + Math.abs(y - this.matildaPos.y);
                    const distanceToExit = Math.abs(x - this.exitPos.x) + Math.abs(y - this.exitPos.y);
                    
                    if (distanceToStart > 3 && distanceToExit > 3) {
                        availableCells.push({ x, y });
                    }
                }
            }
        }
        
        if (availableCells.length >= 2) {
            // Place tunnel entrance and exit far apart
            const entrance = availableCells[Math.floor(Math.random() * availableCells.length)];
            const remainingCells = availableCells.filter(cell => {
                const distance = Math.abs(cell.x - entrance.x) + Math.abs(cell.y - entrance.y);
                return distance > 5; // Ensure tunnels are far apart
            });
            
            if (remainingCells.length > 0) {
                const exit = remainingCells[Math.floor(Math.random() * remainingCells.length)];
                this.tunnelEntrance = entrance;
                this.tunnelExit = exit;
                
                // Mark tunnel squares in the maze
                this.maze[entrance.y][entrance.x] = 'tunnel';
                this.maze[exit.y][exit.x] = 'tunnel';
            }
        }
    }

    addBouncePads() {
        // Add 2-3 bounce pads in strategic locations
        const availableCells = [];
        
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] === 'path' && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.exitPos.x && y === this.exitPos.y) &&
                    !(x === this.tunnelEntrance.x && y === this.tunnelEntrance.y) &&
                    !(x === this.tunnelExit.x && y === this.tunnelExit.y) &&
                    !this.dadPositions.some(dad => dad.x === x && dad.y === y) &&
                    !this.powerUps.some(powerUp => powerUp.x === x && powerUp.y === y)) {
                    
                    // Ensure bounce pads have space to launch in at least one direction
                    const hasLaunchSpace = this.checkLaunchSpace(x, y);
                    if (hasLaunchSpace) {
                        availableCells.push({ x, y });
                    }
                }
            }
        }
        
        const numBouncePads = Math.min(3, Math.floor(availableCells.length / 3));
        for (let i = 0; i < numBouncePads; i++) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const bouncePos = availableCells.splice(randomIndex, 1)[0];
            this.bouncePads.push(bouncePos);
            this.maze[bouncePos.y][bouncePos.x] = 'bounce';
        }
    }

    checkLaunchSpace(x, y) {
        // Check if there's space to launch in at least one direction (2-3 cells)
        const directions = [
            { x: 2, y: 0 }, { x: -2, y: 0 }, { x: 0, y: 2 }, { x: 0, y: -2 },
            { x: 3, y: 0 }, { x: -3, y: 0 }, { x: 0, y: 3 }, { x: 0, y: -3 }
        ];
        
        for (const dir of directions) {
            const targetX = x + dir.x;
            const targetY = y + dir.y;
            
            if (targetX >= 0 && targetX < this.mazeSize && 
                targetY >= 0 && targetY < this.mazeSize &&
                (this.maze[targetY][targetX] === 'path' || 
                 this.maze[targetY][targetX] === 'exit' ||
                 this.maze[targetY][targetX] === 'start')) {
                return true;
            }
        }
        
        return false;
    }

    addSecretPassages() {
        // Add 3-5 secret passages hidden in walls
        this.secretPassages = [];
        const wallCells = [];
        
        // Find wall cells that could be secret passages (not on the border)
        for (let y = 1; y < this.mazeSize - 1; y++) {
            for (let x = 1; x < this.mazeSize - 1; x++) {
                if (this.maze[y][x] === 'wall') {
                    // Check if this wall has paths on both sides (could connect areas)
                    const hasPathNeighbors = this.countPathNeighbors(x, y);
                    if (hasPathNeighbors >= 2) {
                        wallCells.push({ x, y });
                    }
                }
            }
        }
        
        // Create 3-5 secret passages
        const numSecrets = Math.min(5, Math.floor(wallCells.length / 4) + 3);
        for (let i = 0; i < numSecrets && wallCells.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * wallCells.length);
            const secretPos = wallCells.splice(randomIndex, 1)[0];
            this.secretPassages.push({ ...secretPos, discovered: false });
        }
    }

    countPathNeighbors(x, y) {
        let count = 0;
        const directions = [
            { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }
        ];
        
        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;
            if (newX >= 0 && newX < this.mazeSize && newY >= 0 && newY < this.mazeSize &&
                (this.maze[newY][newX] === 'path' || this.maze[newY][newX] === 'start' || 
                 this.maze[newY][newX] === 'exit')) {
                count++;
            }
        }
        return count;
    }

    positionGeorge() {
        // Find adjacent path cells next to Matilda for George's starting position
        const adjacentPositions = [
            { x: this.matildaPos.x + 1, y: this.matildaPos.y },     // right
            { x: this.matildaPos.x - 1, y: this.matildaPos.y },     // left
            { x: this.matildaPos.x, y: this.matildaPos.y + 1 },     // down
            { x: this.matildaPos.x, y: this.matildaPos.y - 1 },     // up
        ];
        
        for (const pos of adjacentPositions) {
            if (pos.x >= 0 && pos.x < this.mazeSize && pos.y >= 0 && pos.y < this.mazeSize &&
                (this.maze[pos.y][pos.x] === 'path' || this.maze[pos.y][pos.x] === 'exit')) {
                this.georgePos = pos;
                return;
            }
        }
        
        // If no adjacent path found, place George at start (fallback)
        this.georgePos = { ...this.matildaPos };
    }

    startGameLoop() {
        setInterval(() => {
            if (this.invisibilityTimer > 0) {
                this.invisibilityTimer--;
                if (this.invisibilityTimer === 0) {
                    this.hasInvisibility = false;
                }
            }
            if (this.georgeCooldown > 0) {
                this.georgeCooldown--;
            }
            if (this.ghostInvisibilityTimer > 0) {
                this.ghostInvisibilityTimer--;
                if (this.ghostInvisibilityTimer === 0) {
                    this.ghostHelping = false;
                }
            }
            this.updateGeorge();
            this.updateMatilda();
            this.updateGhost();
            this.updateSecretPassages();
            this.updateScore();
        }, 150);
    }

    updateGeorge() {
        if (this.gameWon) return;

        // Only make George follow if player is controlling Matilda
        if (this.activeCharacter === 'matilda') {
            // George follows directly behind Matilda
            const targetPos = this.findGeorgeTarget();
            const nextStep = this.getNextStepTowards(this.georgePos, targetPos);
            
            // George moves more aggressively to stay close to Matilda
            if (nextStep && this.isValidPosition(nextStep.x, nextStep.y) && 
                !(nextStep.x === this.matildaPos.x && nextStep.y === this.matildaPos.y)) {
                this.georgePos = nextStep;
                
                // If George is still too far, try to take another step
                const distanceToMatilda = Math.abs(this.georgePos.x - this.matildaPos.x) + 
                                         Math.abs(this.georgePos.y - this.matildaPos.y);
                if (distanceToMatilda > 2) {
                    const secondStep = this.getNextStepTowards(this.georgePos, targetPos);
                    if (secondStep && this.isValidPosition(secondStep.x, secondStep.y) && 
                        !(secondStep.x === this.matildaPos.x && nextStep.y === this.matildaPos.y)) {
                        this.georgePos = secondStep;
                    }
                }
            }
        }

        // George helps Matilda in various ways (regardless of who's being controlled)
        this.georgeHelp();
    }

    updateMatilda() {
        if (this.gameWon) return;

        // Only make Matilda follow if player is controlling George
        if (this.activeCharacter === 'george') {
            // Matilda follows directly behind George
            const targetPos = this.findMatildaTarget();
            const nextStep = this.getNextStepTowards(this.matildaPos, targetPos);
            
            // Matilda moves to stay close to George
            if (nextStep && this.isValidPosition(nextStep.x, nextStep.y) && 
                !(nextStep.x === this.georgePos.x && nextStep.y === this.georgePos.y)) {
                this.matildaPos = nextStep;
                
                // If Matilda is still too far, try to take another step
                const distanceToGeorge = Math.abs(this.matildaPos.x - this.georgePos.x) + 
                                        Math.abs(this.matildaPos.y - this.georgePos.y);
                if (distanceToGeorge > 2) {
                    const secondStep = this.getNextStepTowards(this.matildaPos, targetPos);
                    if (secondStep && this.isValidPosition(secondStep.x, secondStep.y) && 
                        !(secondStep.x === this.georgePos.x && secondStep.y === this.georgePos.y)) {
                        this.matildaPos = secondStep;
                    }
                }
            }
        }

        // Matilda can also provide help when following George
        this.matildaHelp();
    }

    matildaHelp() {
        if (this.activeCharacter !== 'george' || this.georgeCooldown > 0) return;

        // Matilda can warn George about nearby dad
        const nearbyDad = this.dadPositions.find(dad => {
            const distance = Math.abs(dad.x - this.georgePos.x) + Math.abs(dad.y - this.georgePos.y);
            return distance <= 2;
        });

        if (nearbyDad && !this.hasInvisibility) {
            this.sounds.georgeAlert();
            this.showMessage("💗 Matilda: Be careful George! Dad is nearby!", 1500);
            this.createParticleEffect(this.matildaPos.x, this.matildaPos.y, 'pink');
            this.georgeCooldown = 15; // 3 second cooldown
            return;
        }

        // Matilda can spot power-ups for George to know about
        const nearbyPowerUp = this.powerUps.find(powerUp => {
            const matildaDistance = Math.abs(powerUp.x - this.matildaPos.x) + Math.abs(powerUp.y - this.matildaPos.y);
            const georgeDistance = Math.abs(powerUp.x - this.georgePos.x) + Math.abs(powerUp.y - this.georgePos.y);
            return matildaDistance <= 1 && georgeDistance > 2;
        });

        if (nearbyPowerUp) {
            this.sounds.georgeHelp();
            const powerUpIcon = nearbyPowerUp.type === 'invisibility' ? '👻' : '⚡';
            this.showMessage(`💗 Matilda spotted a ${powerUpIcon} power-up ahead!`, 1500);
            this.createParticleEffect(this.matildaPos.x, this.matildaPos.y, 'pink');
            this.georgeCooldown = 20; // 4 second cooldown
            return;
        }

        // Occasionally Matilda gives encouraging messages
        if (Math.random() < 0.005 && this.moves > 10) {
            const encouragements = [
                "💗 Matilda: You're doing great, George!",
                "💗 Matilda: This way looks good!",
                "💗 Matilda: I'm right behind you!",
                "💗 Matilda: We can do this together!"
            ];
            this.showMessage(encouragements[Math.floor(Math.random() * encouragements.length)], 1500);
            this.georgeCooldown = 30; // 6 second cooldown
        }
    }

    findMatildaTarget() {
        // Matilda follows directly behind George - find the best position 1 step away
        const possibleTargets = [
            { x: this.georgePos.x - 1, y: this.georgePos.y },     // left of George
            { x: this.georgePos.x + 1, y: this.georgePos.y },     // right of George
            { x: this.georgePos.x, y: this.georgePos.y - 1 },     // above George
            { x: this.georgePos.x, y: this.georgePos.y + 1 },     // below George
        ];
        
        // Filter valid positions and find closest to Matilda's current position
        const validTargets = possibleTargets.filter(pos => 
            this.isValidPosition(pos.x, pos.y)
        );
        
        if (validTargets.length === 0) {
            // If no adjacent spots are available, move toward George
            return this.georgePos;
        }
        
        // Find the closest valid position to Matilda's current location
        let bestTarget = validTargets[0];
        let bestDistance = Math.abs(bestTarget.x - this.matildaPos.x) + Math.abs(bestTarget.y - this.matildaPos.y);
        
        for (const target of validTargets) {
            const distance = Math.abs(target.x - this.matildaPos.x) + Math.abs(target.y - this.matildaPos.y);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestTarget = target;
            }
        }
        
        return bestTarget;
    }

    findGeorgeTarget() {
        // George follows directly behind Matilda - find the best position 1 step away
        const possibleTargets = [
            { x: this.matildaPos.x - 1, y: this.matildaPos.y },     // left of Matilda
            { x: this.matildaPos.x + 1, y: this.matildaPos.y },     // right of Matilda
            { x: this.matildaPos.x, y: this.matildaPos.y - 1 },     // above Matilda
            { x: this.matildaPos.x, y: this.matildaPos.y + 1 },     // below Matilda
        ];
        
        // Filter valid positions and find closest to George's current position
        const validTargets = possibleTargets.filter(pos => 
            this.isValidPosition(pos.x, pos.y)
        );
        
        if (validTargets.length === 0) {
            // If no adjacent spots are available, move toward Matilda
            return this.matildaPos;
        }
        
        // Find the closest valid position to George's current location
        let bestTarget = validTargets[0];
        let bestDistance = Math.abs(bestTarget.x - this.georgePos.x) + Math.abs(bestTarget.y - this.georgePos.y);
        
        for (const target of validTargets) {
            const distance = Math.abs(target.x - this.georgePos.x) + Math.abs(target.y - this.georgePos.y);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestTarget = target;
            }
        }
        
        return bestTarget;
    }

    getNextStepTowards(from, to) {
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, 
            { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        let bestStep = null;
        let bestDistance = Infinity;
        
        for (const dir of directions) {
            const newX = from.x + dir.x;
            const newY = from.y + dir.y;
            
            if (this.isValidPosition(newX, newY)) {
                const distance = Math.abs(newX - to.x) + Math.abs(newY - to.y);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestStep = { x: newX, y: newY };
                }
            }
        }
        
        return bestStep;
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.mazeSize && 
               y >= 0 && y < this.mazeSize &&
               (this.maze[y][x] === 'path' || 
                this.maze[y][x] === 'exit' ||
                this.maze[y][x] === 'start' ||
                this.maze[y][x] === 'secret') &&
               !this.dadPositions.some(dad => dad.x === x && dad.y === y);
    }

    georgeHelp() {
        if (this.georgeCooldown > 0) return;

        // Check if George can warn about nearby dad
        const nearbyDad = this.dadPositions.find(dad => {
            const distance = Math.abs(dad.x - this.matildaPos.x) + Math.abs(dad.y - this.matildaPos.y);
            return distance <= 2;
        });

        if (nearbyDad && !this.hasInvisibility) {
            this.sounds.georgeAlert();
            this.showMessage("🚨 George: Watch out! Dad is nearby!", 1500);
            this.createParticleEffect(this.georgePos.x, this.georgePos.y, 'orange');
            this.georgeCooldown = 15; // 3 second cooldown
            return;
        }

        // Check if George is next to a power-up and can alert Matilda
        const nearbyPowerUp = this.powerUps.find(powerUp => {
            const georgeDistance = Math.abs(powerUp.x - this.georgePos.x) + Math.abs(powerUp.y - this.georgePos.y);
            const matildaDistance = Math.abs(powerUp.x - this.matildaPos.x) + Math.abs(powerUp.y - this.matildaPos.y);
            return georgeDistance <= 1 && matildaDistance > 2;
        });

        if (nearbyPowerUp) {
            this.sounds.georgeHelp();
            const powerUpIcon = nearbyPowerUp.type === 'invisibility' ? '👻' : '⚡';
            this.showMessage(`💙 George found a ${powerUpIcon} power-up!`, 1500);
            this.createParticleEffect(this.georgePos.x, this.georgePos.y, 'blue');
            this.georgeCooldown = 20; // 4 second cooldown
            return;
        }

        // George can occasionally distract a dad
        if (Math.random() < 0.01 && this.dadPositions.length > 0) {
            const georgeDistance = this.dadPositions.map(dad => ({
                dad,
                distance: Math.abs(dad.x - this.georgePos.x) + Math.abs(dad.y - this.georgePos.y)
            })).sort((a, b) => a.distance - b.distance)[0];

            if (georgeDistance.distance <= 2) {
                // George distracts the nearest dad for a moment
                this.sounds.georgeHelp();
                this.showMessage("💙 George distracts Dad! Quick, move!", 1500);
                this.createParticleEffect(this.georgePos.x, this.georgePos.y, 'cyan');
                
                // Temporarily move the dad away
                const dad = georgeDistance.dad;
                const originalPos = { ...dad };
                dad.x = Math.max(0, Math.min(this.mazeSize - 1, dad.x + (Math.random() - 0.5) * 4));
                dad.y = Math.max(0, Math.min(this.mazeSize - 1, dad.y + (Math.random() - 0.5) * 4));
                
                // Move dad back after 2 seconds
                setTimeout(() => {
                    dad.x = originalPos.x;
                    dad.y = originalPos.y;
                }, 2000);
                
                this.georgeCooldown = 50; // 10 second cooldown
                return;
            }
        }

        // Occasionally George gives encouraging messages
        if (Math.random() < 0.005 && this.moves > 10) {
            const encouragements = [
                "💙 George: You've got this, Matilda!",
                "💙 George: Almost there, keep going!",
                "💙 George: I believe in you!",
                "💙 George: We make a great team!"
            ];
            this.showMessage(encouragements[Math.floor(Math.random() * encouragements.length)], 1500);
            this.georgeCooldown = 30; // 6 second cooldown
        }
    }

    updateSecretPassages() {
        // Check if characters are near secret passages to reveal them
        this.secretPassages.forEach(passage => {
            if (passage.discovered) return;
            
            const matildaDistance = Math.abs(passage.x - this.matildaPos.x) + 
                                   Math.abs(passage.y - this.matildaPos.y);
            const georgeDistance = Math.abs(passage.x - this.georgePos.x) + 
                                  Math.abs(passage.y - this.georgePos.y);
            
            // Discover passage if either character is within 2 cells
            if (matildaDistance <= 2 || georgeDistance <= 2) {
                passage.discovered = true;
                this.sounds.secretReveal();
                this.showMessage("🔍 Secret passage discovered! A hidden path revealed!", 2500);
                this.createParticleEffect(passage.x, passage.y, 'gold');
                
                // Convert the wall to a secret passage that can be walked through
                this.maze[passage.y][passage.x] = 'secret';
            }
        });
    }

    updateGhost() {
        if (this.gameWon) return;

        // Update both ghosts - they float around the start area
        const startPos = { x: 1, y: 1 };
        const possiblePositions = this.getGhostPositions(startPos);

        // Ghosts move very slowly and stay close to start
        if (Math.random() < 0.1 && possiblePositions.length > 1) {
            // Only move one ghost at a time, and keep them close
            if (Math.random() < 0.5) {
                this.matildaGhostPos = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
            } else {
                this.georgeGhostPos = possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
            }
        }

        // Ghost interactions and magic
        this.ghostInteractions();
        this.ghostMagicHelp();
    }

    getGhostPositions(startPos) {
        const possiblePositions = [];
        
        // Find all valid positions very close to start (within 1-2 cells only)
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const newX = startPos.x + dx;
                const newY = startPos.y + dy;
                
                if (this.isValidGhostPosition(newX, newY)) {
                    possiblePositions.push({ x: newX, y: newY });
                }
            }
        }
        
        return possiblePositions;
    }

    isValidGhostPosition(x, y) {
        return x >= 0 && x < this.mazeSize && 
               y >= 0 && y < this.mazeSize &&
               (this.maze[y][x] === 'path' || 
                this.maze[y][x] === 'exit' ||
                this.maze[y][x] === 'start');
    }

    ghostInteractions() {
        const currentTime = Date.now();
        
        // Check distances to both ghosts
        const matildaToMatildaGhost = Math.abs(this.matildaGhostPos.x - this.matildaPos.x) + 
                                     Math.abs(this.matildaGhostPos.y - this.matildaPos.y);
        const georgeToGeorgeGhost = Math.abs(this.georgeGhostPos.x - this.georgePos.x) + 
                                   Math.abs(this.georgeGhostPos.y - this.georgePos.y);

        // Spooky greetings when kids return to start area
        if ((matildaToMatildaGhost <= 2 || georgeToGeorgeGhost <= 2) && 
            currentTime - this.ghostLastSpookTime > 4000) {
            
            const spookyMessages = [
                "👻 Ghosts: The guardians of the beginning await...",
                "👻 Ghosts: Welcome back to where it all started...",
                "👻 Ghosts: We have been watching over this place...",
                "👻 Ghosts: The spirits remember your courage...",
                "👻 Ghosts: Home calls to brave souls..."
            ];
            
            this.sounds.ghostSpook();
            this.showMessage(spookyMessages[Math.floor(Math.random() * spookyMessages.length)], 2500);
            this.createParticleEffect(this.matildaGhostPos.x, this.matildaGhostPos.y, 'white');
            this.createParticleEffect(this.georgeGhostPos.x, this.georgeGhostPos.y, 'cyan');
            this.ghostLastSpookTime = currentTime;
        }

        // Distant whispers
        if (Math.random() < 0.001 && currentTime - this.ghostLastSpookTime > 6000) {
            this.sounds.ghostWhisper();
            const whispers = [
                "👻 The guardian spirits whisper your names...",
                "👻 Ethereal voices call from the beginning...",
                "👻 Ancient magic stirs at the starting point..."
            ];
            this.showMessage(whispers[Math.floor(Math.random() * whispers.length)], 1800);
            this.ghostLastSpookTime = currentTime;
        }

        // Mysterious particle effects
        if (Math.random() < 0.015) {
            this.createParticleEffect(this.matildaGhostPos.x, this.matildaGhostPos.y, 'rgba(255,255,255,0.4)');
        }
        if (Math.random() < 0.015) {
            this.createParticleEffect(this.georgeGhostPos.x, this.georgeGhostPos.y, 'rgba(200,200,255,0.4)');
        }
    }

    ghostMagicHelp() {
        if (this.ghostHelping || this.ghostInvisibilityTimer > 0) return;

        // Ghosts can grant invisibility when kids are in danger and near start
        const matildaDistance = Math.abs(this.matildaGhostPos.x - this.matildaPos.x) + 
                               Math.abs(this.matildaGhostPos.y - this.matildaPos.y);
        const georgeDistance = Math.abs(this.georgeGhostPos.x - this.georgePos.x) + 
                              Math.abs(this.georgeGhostPos.y - this.georgePos.y);

        // Check if either kid is near their ghost and there's danger nearby
        const nearbyDad = this.dadPositions.find(dad => {
            const distanceToMatilda = Math.abs(dad.x - this.matildaPos.x) + Math.abs(dad.y - this.matildaPos.y);
            const distanceToGeorge = Math.abs(dad.x - this.georgePos.x) + Math.abs(dad.y - this.georgePos.y);
            return distanceToMatilda <= 3 || distanceToGeorge <= 3;
        });

        if (nearbyDad && (matildaDistance <= 4 || georgeDistance <= 4) && Math.random() < 0.04) {
            // Ghosts cast protective invisibility spell
            this.ghostHelping = true;
            this.ghostInvisibilityTimer = 40; // 8 seconds
            this.hasInvisibility = true;
            this.invisibilityTimer = Math.max(this.invisibilityTimer, 40);

            this.sounds.ghostMagic();
            this.showMessage("✨ The guardian ghosts shield you with invisibility! ✨", 3000);
            
            // Create magical effects at both ghost positions
            this.createParticleEffect(this.matildaGhostPos.x, this.matildaGhostPos.y, 'gold');
            this.createParticleEffect(this.georgeGhostPos.x, this.georgeGhostPos.y, 'silver');
            
            // Extra score bonus for ghost help
            this.score += 200;
        }
    }

    updateScore() {
        const timeBonus = Math.max(0, 1000 - this.moves * 10);
        const powerUpBonus = (this.score > 0) ? 50 : 0;
        this.score = timeBonus + powerUpBonus;
    }

    renderMaze() {
        const mazeElement = document.getElementById('maze');
        mazeElement.innerHTML = '';
        mazeElement.style.gridTemplateColumns = `repeat(${this.mazeSize}, 1fr)`;

        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Apply base cell type
                if (this.maze[y][x] === 'wall') {
                    cell.classList.add('wall');
                } else if (this.maze[y][x] === 'exit') {
                    cell.classList.add('exit');
                } else if (this.maze[y][x] === 'start') {
                    cell.classList.add('start');
                } else if (this.maze[y][x] === 'tunnel') {
                    cell.classList.add('tunnel');
                } else if (this.maze[y][x] === 'bounce') {
                    cell.classList.add('bounce');
                } else if (this.maze[y][x] === 'secret') {
                    cell.classList.add('secret');
                } else {
                    cell.classList.add('path');
                }

                // Add Matilda
                if (x === this.matildaPos.x && y === this.matildaPos.y) {
                    cell.classList.add('matilda');
                    if (this.activeCharacter === 'matilda') {
                        cell.classList.add('active-character');
                    }
                    if (this.hasInvisibility) {
                        cell.classList.add('invisible');
                    }
                }

                // Add power-ups
                const powerUp = this.powerUps.find(p => p.x === x && p.y === y);
                if (powerUp) {
                    cell.classList.add('power-up');
                    cell.classList.add(`power-up-${powerUp.type}`);
                }

                // Add dad obstacles
                if (this.dadPositions.some(dad => dad.x === x && dad.y === y)) {
                    cell.classList.add('dad');
                }

                // Add Cousin George
                if (x === this.georgePos.x && y === this.georgePos.y && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y)) {
                    cell.classList.add('george');
                    if (this.activeCharacter === 'george') {
                        cell.classList.add('active-character');
                    }
                }

                // Add Matilda's Ghost (only if no one else is there)
                if (x === this.matildaGhostPos.x && y === this.matildaGhostPos.y && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.georgePos.x && y === this.georgePos.y)) {
                    cell.classList.add('ghost');
                    cell.classList.add('matilda-ghost');
                }

                // Add George's Ghost (only if no one else is there and not same as Matilda's ghost)
                if (x === this.georgeGhostPos.x && y === this.georgeGhostPos.y && 
                    !(x === this.matildaPos.x && y === this.matildaPos.y) &&
                    !(x === this.georgePos.x && y === this.georgePos.y) &&
                    !(x === this.matildaGhostPos.x && y === this.matildaGhostPos.y)) {
                    cell.classList.add('ghost');
                    cell.classList.add('george-ghost');
                }

                mazeElement.appendChild(cell);
            }
        }

        // Update moves counter and score
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
        
        // Update current character display
        const characterDisplay = this.activeCharacter === 'matilda' ? 'Matilda 👧' : 'George 👦';
        document.getElementById('current-character').textContent = characterDisplay;
    }

    moveCharacter(direction) {
        if (this.gameWon) return;

        // Store the direction for bounce pad usage
        this.lastDirection = this.getDirectionVector(direction);

        const currentPos = this.activeCharacter === 'matilda' ? this.matildaPos : this.georgePos;
        const newPos = { ...currentPos };

        switch (direction) {
            case 'up':
                newPos.y--;
                break;
            case 'down':
                newPos.y++;
                break;
            case 'left':
                newPos.x--;
                break;
            case 'right':
                newPos.x++;
                break;
        }

        // Check bounds and walls
        if (newPos.x < 0 || newPos.x >= this.mazeSize || 
            newPos.y < 0 || newPos.y >= this.mazeSize ||
            this.maze[newPos.y][newPos.x] === 'wall') {
            return;
        }

        // Check if moving into dad obstacle (unless invisible)
        if (this.dadPositions.some(dad => dad.x === newPos.x && dad.y === newPos.y) && !this.hasInvisibility) {
            // Dad caught character! Reset position
            this.sounds.caught();
            const characterName = this.activeCharacter === 'matilda' ? 'Matilda' : 'George';
            this.showMessage(`Dad caught ${characterName}! Back to the start!`, 2000);
            
            if (this.activeCharacter === 'matilda') {
                this.matildaPos = { x: 1, y: 1 };
            } else {
                this.georgePos = { x: 1, y: 1 };
            }
            
            this.moves += 5; // Penalty for getting caught
            this.createParticleEffect(newPos.x, newPos.y, 'red');
            this.screenShake();
        } else {
            // Valid move
            if (this.activeCharacter === 'matilda') {
                this.matildaPos = newPos;
            } else {
                this.georgePos = newPos;
            }
            
            this.moves++;
            this.sounds.move();

            // Check for power-up collection (only Matilda can collect)
            if (this.activeCharacter === 'matilda') {
                const powerUpIndex = this.powerUps.findIndex(p => p.x === newPos.x && p.y === newPos.y);
                if (powerUpIndex !== -1) {
                    const powerUp = this.powerUps[powerUpIndex];
                    this.collectPowerUp(powerUp);
                    this.powerUps.splice(powerUpIndex, 1);
                }

                // Check for tunnel usage (only Matilda can use tunnels)
                this.checkTunnelUsage();
            } else {
                // George can also use tunnels
                this.checkTunnelUsage();
            }

            // Check for bounce pad usage (both characters can use)
            this.checkBouncePadUsage(newPos);
        }

        // Check win condition (either character can win)
        if ((this.matildaPos.x === this.exitPos.x && this.matildaPos.y === this.exitPos.y) ||
            (this.georgePos.x === this.exitPos.x && this.georgePos.y === this.exitPos.y)) {
            this.gameWon = true;
            this.sounds.win();
            this.createParticleEffect(this.exitPos.x, this.exitPos.y, 'gold');
            this.showWinMessage();
        }

        this.renderMaze();
    }

    getDirectionVector(direction) {
        switch (direction) {
            case 'up': return { x: 0, y: -1 };
            case 'down': return { x: 0, y: 1 };
            case 'left': return { x: -1, y: 0 };
            case 'right': return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }

    checkTunnelUsage() {
        const currentPos = this.activeCharacter === 'matilda' ? this.matildaPos : this.georgePos;
        const followingPos = this.activeCharacter === 'matilda' ? this.georgePos : this.matildaPos;
        const characterName = this.activeCharacter === 'matilda' ? 'Matilda' : 'George';
        const followerName = this.activeCharacter === 'matilda' ? 'George' : 'Matilda';
        
        let usedTunnel = false;
        let tunnelDestination = null;
        
        // Check if character stepped into a tunnel
        if (currentPos.x === this.tunnelEntrance.x && currentPos.y === this.tunnelEntrance.y) {
            // Teleport to tunnel exit
            this.sounds.tunnel();
            this.createParticleEffect(this.tunnelEntrance.x, this.tunnelEntrance.y, 'purple');
            
            if (this.activeCharacter === 'matilda') {
                this.matildaPos = { ...this.tunnelExit };
            } else {
                this.georgePos = { ...this.tunnelExit };
            }
            
            tunnelDestination = { ...this.tunnelExit };
            usedTunnel = true;
            this.createParticleEffect(this.tunnelExit.x, this.tunnelExit.y, 'purple');
            
        } else if (currentPos.x === this.tunnelExit.x && currentPos.y === this.tunnelExit.y) {
            // Teleport to tunnel entrance (tunnels work both ways)
            this.sounds.tunnel();
            this.createParticleEffect(this.tunnelExit.x, this.tunnelExit.y, 'purple');
            
            if (this.activeCharacter === 'matilda') {
                this.matildaPos = { ...this.tunnelEntrance };
            } else {
                this.georgePos = { ...this.tunnelEntrance };
            }
            
            tunnelDestination = { ...this.tunnelEntrance };
            usedTunnel = true;
            this.createParticleEffect(this.tunnelEntrance.x, this.tunnelEntrance.y, 'purple');
        }
        
        if (usedTunnel) {
            // Check if follower should also go through the tunnel (if they're close enough)
            const distanceToFollower = Math.abs(currentPos.x - followingPos.x) + Math.abs(currentPos.y - followingPos.y);
            
            if (distanceToFollower <= 2) {
                // Follower comes through the tunnel too!
                setTimeout(() => {
                    this.createParticleEffect(followingPos.x, followingPos.y, 'cyan');
                    
                    if (this.activeCharacter === 'matilda') {
                        this.georgePos = { ...tunnelDestination };
                    } else {
                        this.matildaPos = { ...tunnelDestination };
                    }
                    
                    this.createParticleEffect(tunnelDestination.x, tunnelDestination.y, 'cyan');
                    this.showMessage(`🌀 ${characterName} and ${followerName} traveled through the tunnel together!`, 2500);
                    this.renderMaze();
                }, 500);
            } else {
                this.showMessage(`🌀 ${characterName} used the tunnel! Teleported across the maze!`, 2000);
            }
        }
    }

    checkBouncePadUsage(currentPos) {
        // Check if character stepped on a bounce pad
        if (this.bouncePads.some(pad => pad.x === currentPos.x && pad.y === currentPos.y)) {
            this.sounds.bounce();
            this.createParticleEffect(currentPos.x, currentPos.y, 'orange');
            
            const followingPos = this.activeCharacter === 'matilda' ? this.georgePos : this.matildaPos;
            const characterName = this.activeCharacter === 'matilda' ? 'Matilda' : 'George';
            const followerName = this.activeCharacter === 'matilda' ? 'George' : 'Matilda';
            
            // Launch character 2-3 cells in the last movement direction
            const launchDistance = Math.floor(Math.random() * 2) + 2; // 2 or 3 cells
            const bounceTarget = {
                x: currentPos.x + (this.lastDirection.x * launchDistance),
                y: currentPos.y + (this.lastDirection.y * launchDistance)
            };
            
            // Ensure bounce target is valid
            if (bounceTarget.x >= 0 && bounceTarget.x < this.mazeSize && 
                bounceTarget.y >= 0 && bounceTarget.y < this.mazeSize &&
                this.maze[bounceTarget.y][bounceTarget.x] !== 'wall') {
                
                if (this.activeCharacter === 'matilda') {
                    this.matildaPos = bounceTarget;
                } else {
                    this.georgePos = bounceTarget;
                }
                
                this.createParticleEffect(bounceTarget.x, bounceTarget.y, 'yellow');
                
                // Check if follower should also bounce (if they're close enough)
                const distanceToFollower = Math.abs(currentPos.x - followingPos.x) + Math.abs(currentPos.y - followingPos.y);
                
                if (distanceToFollower <= 2) {
                    // Follower gets launched too!
                    const followerBounceTarget = {
                        x: followingPos.x + (this.lastDirection.x * launchDistance),
                        y: followingPos.y + (this.lastDirection.y * launchDistance)
                    };
                    
                    // Ensure follower bounce target is valid
                    if (followerBounceTarget.x >= 0 && followerBounceTarget.x < this.mazeSize && 
                        followerBounceTarget.y >= 0 && followerBounceTarget.y < this.mazeSize &&
                        this.maze[followerBounceTarget.y][followerBounceTarget.x] !== 'wall') {
                        
                        setTimeout(() => {
                            this.createParticleEffect(followingPos.x, followingPos.y, 'lime');
                            
                            if (this.activeCharacter === 'matilda') {
                                this.georgePos = followerBounceTarget;
                            } else {
                                this.matildaPos = followerBounceTarget;
                            }
                            
                            this.createParticleEffect(followerBounceTarget.x, followerBounceTarget.y, 'lime');
                            this.showMessage(`${characterName} and ${followerName} bounced together! 🚀🚀`, 2000);
                            this.renderMaze();
                        }, 300);
                    } else {
                        this.showMessage(`${characterName} bounced! 🚀`, 1500);
                    }
                } else {
                    this.showMessage(`${characterName} bounced! 🚀`, 1500);
                }
            }
        }
    }

    switchCharacter() {
        this.activeCharacter = this.activeCharacter === 'matilda' ? 'george' : 'matilda';
        this.sounds.switch();
        const newCharacter = this.activeCharacter === 'matilda' ? 'Matilda' : 'George';
        this.showMessage(`Switched to ${newCharacter}! 🔄`, 1000);
        
        // Update the display to reflect the character change
        this.renderMaze();
    }

    collectPowerUp(powerUp) {
        this.sounds.powerUp();
        this.createParticleEffect(powerUp.x, powerUp.y, 'purple');
        
        if (powerUp.type === 'invisibility') {
            this.hasInvisibility = true;
            this.invisibilityTimer = 50; // 5 seconds at 100ms intervals
            this.sounds.invisibility();
            this.showMessage("💜 Invisibility activated! Dad can't see you!", 2000);
        } else if (powerUp.type === 'speed') {
            this.showMessage("⚡ Speed boost! Extra points!", 2000);
            this.score += 100;
        }
    }

    createParticleEffect(x, y, color) {
        const mazeElement = document.getElementById('maze');
        const cellSize = 25;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${x * cellSize + 12}px;
                top: ${y * cellSize + 12}px;
                animation: particle-burst 1s ease-out forwards;
                animation-delay: ${i * 0.05}s;
            `;
            
            mazeElement.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    screenShake() {
        const gameContainer = document.querySelector('.game-container');
        gameContainer.style.animation = 'screen-shake 0.5s ease-in-out';
        
        setTimeout(() => {
            gameContainer.style.animation = '';
        }, 500);
    }

    showMessage(text, duration) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.5);
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, duration);
    }

    showWinMessage() {
        // Update win message based on which character reached the exit
        const winMessageElement = document.getElementById('win-message');
        const matildaWon = this.matildaPos.x === this.exitPos.x && this.matildaPos.y === this.exitPos.y;
        const georgeWon = this.georgePos.x === this.exitPos.x && this.georgePos.y === this.exitPos.y;
        
        let winnerName = '';
        if (matildaWon && georgeWon) {
            winnerName = 'Both characters escaped together! 👧👦';
        } else if (matildaWon) {
            winnerName = 'Matilda escaped! 👧';
        } else if (georgeWon) {
            winnerName = 'George escaped! 👦';
        }
        
        winMessageElement.innerHTML = `
            🎉 ${winnerName} Free from Dad's crazy maze! 🎉
            <button id="play-again-btn">Play Again</button>
        `;
        
        // Re-attach the play again event listener since we replaced the HTML
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.restart();
        });
        
        winMessageElement.classList.remove('hidden');
    }

    restart() {
        this.moves = 0;
        this.gameWon = false;
        this.score = 0;
        this.hasInvisibility = false;
        this.invisibilityTimer = 0;
        this.powerUps = [];
        this.georgeHelped = false;
        this.georgeCooldown = 0;
        this.ghostLastSpookTime = 0;
        this.ghostInvisibilityTimer = 0;
        this.ghostHelping = false;
        this.bouncePads = [];
        this.activeCharacter = 'matilda';
        this.lastDirection = { x: 0, y: 0 };
        this.secretPassages = [];
        this.discoveredPassages = [];
        this.spacePressed = false;
        document.getElementById('win-message').classList.add('hidden');
        this.generateMaze();
        this.renderMaze();
    }

    attachEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    e.preventDefault();
                    this.moveCharacter('up');
                    break;
                case 'arrowdown':
                case 's':
                    e.preventDefault();
                    this.moveCharacter('down');
                    break;
                case 'arrowleft':
                case 'a':
                    e.preventDefault();
                    this.moveCharacter('left');
                    break;
                case 'arrowright':
                case 'd':
                    e.preventDefault();
                    this.moveCharacter('right');
                    break;
                case ' ':
                case 'space':
                    e.preventDefault();
                    if (!this.spacePressed) {
                        this.spacePressed = true;
                        this.switchCharacter();
                    }
                    break;
            }
        });

        // Handle key up to reset space key
        document.addEventListener('keyup', (e) => {
            if (e.key === ' ' || e.key.toLowerCase() === 'space') {
                this.spacePressed = false;
            }
        });

        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.restart();
        });

        // Switch character button
        document.getElementById('switch-btn').addEventListener('click', () => {
            this.switchCharacter();
        });

        // Note: Mobile touch controls are handled in addMobileTouchControls() method
    }

    // Simple A* pathfinding for mobile click-to-move
    findPath(startPos, endPos) {
        // Simple breadth-first search for pathfinding
        const queue = [{ pos: startPos, path: [] }];
        const visited = new Set();
        visited.add(`${startPos.x},${startPos.y}`);
        
        const directions = [
            { x: 0, y: -1 }, { x: 0, y: 1 }, // up, down
            { x: -1, y: 0 }, { x: 1, y: 0 }  // left, right
        ];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const { pos, path } = current;
            
            // If we reached the destination
            if (pos.x === endPos.x && pos.y === endPos.y) {
                return path;
            }
            
            // Explore neighbors
            for (const dir of directions) {
                const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
                const key = `${newPos.x},${newPos.y}`;
                
                // Check bounds and if not visited
                if (newPos.x >= 0 && newPos.x < this.mazeSize &&
                    newPos.y >= 0 && newPos.y < this.mazeSize &&
                    !visited.has(key) &&
                    this.maze[newPos.y][newPos.x] !== 'wall') {
                    
                    visited.add(key);
                    const newPath = [...path, this.getDirectionName(dir)];
                    queue.push({ pos: newPos, path: newPath });
                }
            }
        }
        
        return []; // No path found
    }
    
    getDirectionName(dir) {
        if (dir.x === 0 && dir.y === -1) return 'up';
        if (dir.x === 0 && dir.y === 1) return 'down';
        if (dir.x === -1 && dir.y === 0) return 'left';
        if (dir.x === 1 && dir.y === 0) return 'right';
        return '';
    }
    
    // Mobile click-to-move functionality
    handleCellClick(targetX, targetY) {
        // Get current character position
        const currentPos = this.activeCharacter === 'matilda' ? this.matildaPos : this.georgePos;
        
        // If clicking on current position, do nothing
        if (currentPos.x === targetX && currentPos.y === targetY) {
            return;
        }
        
        // Check if clicking on a character to switch
        if ((targetX === this.matildaPos.x && targetY === this.matildaPos.y) ||
            (targetX === this.georgePos.x && targetY === this.georgePos.y)) {
            this.switchCharacter();
            return;
        }
        
        // Check if target is a wall
        if (this.maze[targetY][targetX] === 'wall') {
            this.showMessage("Can't walk through walls! 🧱", 1000);
            return;
        }
        
        // Find path to target
        const path = this.findPath(currentPos, { x: targetX, y: targetY });
        
        if (path.length > 0) {
            // Add visual feedback for mobile
            this.addTapFeedback(targetX, targetY);
            
            // Execute path step by step
            this.executePath(path);
        } else {
            this.showMessage("Can't reach that spot! 🚫", 1000);
        }
    }
    
    // Add visual feedback for mobile taps
    addTapFeedback(x, y) {
        const cellElement = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cellElement) {
            cellElement.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            cellElement.style.transform = 'scale(0.95)';
            
            // Remove feedback after a short time
            setTimeout(() => {
                cellElement.style.backgroundColor = '';
                cellElement.style.transform = '';
            }, 200);
        }
    }
    
    executePath(path) {
        if (path.length === 0 || this.gameWon) return;
        
        // Take the first step
        const nextMove = path.shift();
        this.moveCharacter(nextMove);
        
        // Continue with remaining path after a short delay
        if (path.length > 0) {
            setTimeout(() => {
                this.executePath(path);
            }, 200); // 200ms delay between moves for smooth animation
        }
    }
    
    // Add click event listeners to maze cells
    addMobileTouchControls() {
        const maze = document.getElementById('maze');
        
        maze.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            // Get cell coordinates from data attributes
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            this.handleCellClick(x, y);
        });
        
        // Also add touch event for mobile
        maze.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevent double-firing with click
            
            const touch = e.changedTouches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const cell = element?.closest('.cell');
            
            if (!cell) return;
            
            // Get cell coordinates from data attributes
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            
            this.handleCellClick(x, y);
        });
    }

    // Animate dad patrol (optional enhancement)
    startDadPatrol() {
        setInterval(() => {
            if (this.gameWon) return;
            
            // Randomly move one dad
            if (this.dadPositions.length > 0) {
                const randomDadIndex = Math.floor(Math.random() * this.dadPositions.length);
                const dad = this.dadPositions[randomDadIndex];
                const directions = [
                    { x: 0, y: -1 }, { x: 0, y: 1 }, 
                    { x: -1, y: 0 }, { x: 1, y: 0 }
                ];
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                const newX = dad.x + randomDir.x;
                const newY = dad.y + randomDir.y;
                
                // Only move if it's a valid path and not occupied by Matilda
                if (newX >= 0 && newX < this.mazeSize && 
                    newY >= 0 && newY < this.mazeSize &&
                    this.maze[newY][newX] !== 'wall' &&
                    !(newX === this.matildaPos.x && newY === this.matildaPos.y) &&
                    !(newX === this.exitPos.x && newY === this.exitPos.y)) {
                    
                    dad.x = newX;
                    dad.y = newY;
                    this.renderMaze();
                }
            }
        }, 3000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new MatildaEscapeGame();
    
    // Expose game to global scope for debugging
    window.debugGame = game;
    
    // Optional: Start dad patrol for extra challenge
    // game.startDadPatrol();
});