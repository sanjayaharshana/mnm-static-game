class CandyCrushGame {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.selectedCandy = null;
        this.score = 0;
        this.moves = 0;
        this.isProcessing = false;
        this.targetScore = 1000; // Target score to win
        this.timeLeft = 30; // 30 seconds timer
        this.timerInterval = null;
        this.gameStarted = false;
        this.processingTimeout = null; // Add timeout for processing
        
        // Audio system
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.musicVolume = 0.3; // 30% volume
        
        // Sound effects
        this.moveSound = null;
        this.soundVolume = 0.4; // 40% volume for sound effects
        
        // M&M Chocolate Colors - using classic M&M colors
        this.candyTypes = [
            { emoji: '🔴', color: 'red', name: 'Red M&M' },
            { emoji: '🟡', color: 'yellow', name: 'Yellow M&M' },
            { emoji: '🟢', color: 'green', name: 'Green M&M' },
            { emoji: '🔵', color: 'blue', name: 'Blue M&M' },
            { emoji: '🟠', color: 'orange', name: 'Orange M&M' },
            { emoji: '🟣', color: 'purple', name: 'Purple M&M' },
            { emoji: '🟤', color: 'brown', name: 'Brown M&M' },
            { emoji: '⚪', color: 'white', name: 'White M&M' }
        ];
        
        this.init();
    }
    
    init() {
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.timerContainer = document.querySelector('.timer-container');
        this.resetBtn = document.getElementById('resetBtn');
        this.winningPopup = document.getElementById('winningPopup');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalMovesElement = document.getElementById('finalMoves');
        this.efficiencyElement = document.getElementById('efficiency');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.hideWinningPopup());
        this.shareBtn.addEventListener('click', () => this.shareScore());
        
        // Add music button event listener
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => this.toggleMusic());
        }
        this.createBoard();
        this.setupEventListeners();
        this.updateTimerDisplay();
        
        // Initialize audio system
        this.initAudio();
        
        // Add debug keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' && e.ctrlKey) {
                console.log('=== DEBUG INFO ===');
                this.checkGameState();
                this.debugBoard();
            }
        });
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        this.board = [];
        
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                const candy = this.createCandyElement(row, col);
                this.board[row][col] = candy;
                this.gameBoard.appendChild(candy.element);
            }
        }
        
        // Remove initial matches
        this.removeInitialMatches();
    }
    
    createCandyElement(row, col) {
        const candyType = this.getRandomCandyType();
        const element = document.createElement('div');
        element.className = `candy ${candyType.color}`;
        element.textContent = candyType.emoji;
        element.dataset.row = row;
        element.dataset.col = col;
        
        return {
            element,
            type: candyType,
            row,
            col
        };
    }
    
    getRandomCandyType() {
        return this.candyTypes[Math.floor(Math.random() * this.candyTypes.length)];
    }
    
    removeInitialMatches() {
        let hasMatches = true;
        while (hasMatches) {
            hasMatches = false;
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.checkMatches(row, col).length > 0) {
                        this.replaceCandy(row, col);
                        hasMatches = true;
                    }
                }
            }
        }
    }
    
    setupEventListeners() {
        let isDragging = false;
        
        this.gameBoard.addEventListener('click', (e) => {
            if (this.isProcessing || isDragging) return;
            
            const candy = e.target.closest('.candy');
            if (!candy) return;
            
            const row = parseInt(candy.dataset.row);
            const col = parseInt(candy.dataset.col);
            
            this.handleCandyClick(row, col);
        });
        
        // Drag and drop functionality
        this.gameBoard.addEventListener('mousedown', (e) => {
            const candy = e.target.closest('.candy');
            if (!candy) return;
            
            isDragging = false;
            this.startDrag(e, candy, () => { isDragging = true; });
        });
        
        // Add touch events for mobile
        this.gameBoard.addEventListener('touchstart', (e) => {
            const candy = e.target.closest('.candy');
            if (!candy) return;
            
            isDragging = false;
            this.startTouchDrag(e, candy, () => { isDragging = true; });
        });
    }
    
    startTouchDrag(e, candy, setDragging) {
        if (this.isProcessing) return;
        
        // Start timer on first touch
        if (!this.gameStarted) {
            this.startTimer();
        }
        
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        let hasMoved = false;
        
        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
                hasMoved = true;
                setDragging();
                const row = parseInt(candy.dataset.row);
                const col = parseInt(candy.dataset.col);
                
                let targetRow = row;
                let targetCol = col;
                
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    targetCol = deltaX > 0 ? col + 1 : col - 1;
                } else {
                    targetRow = deltaY > 0 ? row + 1 : row - 1;
                }
                
                if (this.isValidPosition(targetRow, targetCol)) {
                    this.swapCandies(row, col, targetRow, targetCol);
                }
                
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        };
        
        const handleTouchEnd = (e) => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            
            // If we didn't move enough to trigger a swap, treat it as a click
            if (!hasMoved) {
                const row = parseInt(candy.dataset.row);
                const col = parseInt(candy.dataset.col);
                this.handleCandyClick(row, col);
            }
        };
        
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }
    
    startDrag(e, candy, setDragging) {
        if (this.isProcessing) return;
        
        // Start timer on first drag
        if (!this.gameStarted) {
            this.startTimer();
        }
        
        const startX = e.clientX;
        const startY = e.clientY;
        let hasMoved = false;
        
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
                hasMoved = true;
                setDragging();
                const row = parseInt(candy.dataset.row);
                const col = parseInt(candy.dataset.col);
                
                let targetRow = row;
                let targetCol = col;
                
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    targetCol = deltaX > 0 ? col + 1 : col - 1;
                } else {
                    targetRow = deltaY > 0 ? row + 1 : row - 1;
                }
                
                if (this.isValidPosition(targetRow, targetCol)) {
                    this.swapCandies(row, col, targetRow, targetCol);
                }
                
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        };
        
        const handleMouseUp = (e) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // If we didn't move enough to trigger a swap, treat it as a click
            if (!hasMoved) {
                const row = parseInt(candy.dataset.row);
                const col = parseInt(candy.dataset.col);
                this.handleCandyClick(row, col);
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    handleCandyClick(row, col) {
        if (!this.selectedCandy) {
            this.selectCandy(row, col);
        } else {
            const selectedRow = this.selectedCandy.row;
            const selectedCol = this.selectedCandy.col;
            
            if (this.isAdjacent(selectedRow, selectedCol, row, col)) {
                this.swapCandies(selectedRow, selectedCol, row, col);
            } else {
                this.deselectCandy();
                this.selectCandy(row, col);
            }
        }
        
        // Start timer on first move
        if (!this.gameStarted) {
            this.startTimer();
        }
    }
    
    selectCandy(row, col) {
        this.deselectCandy();
        this.selectedCandy = this.board[row][col];
        this.selectedCandy.element.classList.add('selected');
    }
    
    deselectCandy() {
        if (this.selectedCandy) {
            this.selectedCandy.element.classList.remove('selected');
            this.selectedCandy = null;
        }
    }
    
    isAdjacent(row1, col1, row2, col2) {
        return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }
    
    async swapCandies(row1, col1, row2, col2) {
        if (this.isProcessing) {
            console.log('Game is processing, ignoring swap');
            return;
        }
        
        console.log(`Attempting to swap candies at (${row1},${col1}) and (${row2},${col2})`);
        
        this.isProcessing = true;
        this.setProcessingTimeout(); // Set timeout to prevent getting stuck
        this.deselectCandy();
        
        const candy1 = this.board[row1][col1];
        const candy2 = this.board[row2][col2];
        
        // Add moving animation class
        candy1.element.classList.add('moving');
        candy2.element.classList.add('moving');
        
        // Animate the swap movement
        await this.animateSwap(candy1, candy2);
        
        // Swap the candies in the board array
        this.board[row1][col1] = candy2;
        this.board[row2][col2] = candy1;
        
        // Update candy properties
        candy1.row = row2;
        candy1.col = col2;
        candy2.row = row1;
        candy2.col = col1;
        
        // Update DOM dataset
        candy1.element.dataset.row = row2;
        candy1.element.dataset.col = col2;
        candy2.element.dataset.row = row1;
        candy2.element.dataset.col = col1;
        
        // Remove moving class
        candy1.element.classList.remove('moving');
        candy2.element.classList.remove('moving');
        
        // Check for matches
        const matches = this.findMatches();
        console.log(`Found ${matches.length} matches after swap`);
        
        if (matches.length > 0) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            this.playMoveSound(); // Play move sound effect
            await this.processMatches(matches);
        } else {
            console.log('No matches found, swapping back');
            // Animate swap back if no matches
            await this.animateSwap(candy1, candy2);
            
            // Swap back in the board array
            this.board[row1][col1] = candy1;
            this.board[row2][col2] = candy2;
            
            // Update candy properties back
            candy1.row = row1;
            candy1.col = col1;
            candy2.row = row2;
            candy2.col = col2;
            
            // Update DOM dataset back
            candy1.element.dataset.row = row1;
            candy1.element.dataset.col = col1;
            candy2.element.dataset.row = row2;
            candy2.element.dataset.col = col2;
            
            // Reset processing flag since no matches were found
            this.isProcessing = false;
            this.clearProcessingTimeout();
        }
        
        console.log('Swap processing complete');
    }
    
    async animateSwap(candy1, candy2) {
        return new Promise((resolve) => {
            const rect1 = candy1.element.getBoundingClientRect();
            const rect2 = candy2.element.getBoundingClientRect();
            
            const deltaX = rect2.left - rect1.left;
            const deltaY = rect2.top - rect1.top;
            
            // Animate candy1 to candy2's position
            candy1.element.style.transition = 'transform 0.3s ease-in-out';
            candy1.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            
            // Animate candy2 to candy1's position
            candy2.element.style.transition = 'transform 0.3s ease-in-out';
            candy2.element.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
            
            setTimeout(() => {
                candy1.element.style.transition = '';
                candy1.element.style.transform = '';
                candy2.element.style.transition = '';
                candy2.element.style.transform = '';
                resolve();
            }, 300);
        });
    }
    
    findMatches() {
        const matches = [];
        const processedCandies = new Set();
        
        // Check horizontal matches
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize - 2; col++) {
                const candy = this.board[row][col];
                if (!candy || processedCandies.has(candy)) continue;
                
                const match = this.checkMatches(row, col);
                if (match.length >= 3) {
                    // Only add candies that haven't been processed yet
                    const newCandies = match.filter(c => !processedCandies.has(c));
                    if (newCandies.length > 0) {
                        matches.push(...newCandies);
                        // Mark all candies in this match as processed
                        match.forEach(c => processedCandies.add(c));
                    }
                }
            }
        }
        
        // Check vertical matches
        for (let row = 0; row < this.boardSize - 2; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const candy = this.board[row][col];
                if (!candy || processedCandies.has(candy)) continue;
                
                const match = this.checkMatches(row, col);
                if (match.length >= 3) {
                    // Only add candies that haven't been processed yet
                    const newCandies = match.filter(c => !processedCandies.has(c));
                    if (newCandies.length > 0) {
                        matches.push(...newCandies);
                        // Mark all candies in this match as processed
                        match.forEach(c => processedCandies.add(c));
                    }
                }
            }
        }
        
        return matches;
    }
    
    checkMatches(row, col) {
        const candy = this.board[row][col];
        if (!candy) return [];
        
        const matches = [];
        const candyType = candy.type.emoji;
        
        // Check horizontal matches
        let horizontalMatches = [candy];
        
        // Check to the right
        for (let i = 1; col + i < this.boardSize; i++) {
            const nextCandy = this.board[row][col + i];
            if (nextCandy && nextCandy.type.emoji === candyType) {
                horizontalMatches.push(nextCandy);
            } else {
                break;
            }
        }
        
        // Check to the left
        for (let i = 1; col - i >= 0; i++) {
            const prevCandy = this.board[row][col - i];
            if (prevCandy && prevCandy.type.emoji === candyType) {
                horizontalMatches.unshift(prevCandy);
            } else {
                break;
            }
        }
        
        if (horizontalMatches.length >= 3) {
            matches.push(...horizontalMatches);
        }
        
        // Check vertical matches
        let verticalMatches = [candy];
        
        // Check down
        for (let i = 1; row + i < this.boardSize; i++) {
            const nextCandy = this.board[row + i][col];
            if (nextCandy && nextCandy.type.emoji === candyType) {
                verticalMatches.push(nextCandy);
            } else {
                break;
            }
        }
        
        // Check up
        for (let i = 1; row - i >= 0; i++) {
            const prevCandy = this.board[row - i][col];
            if (prevCandy && prevCandy.type.emoji === candyType) {
                verticalMatches.unshift(prevCandy);
            } else {
                break;
            }
        }
        
        if (verticalMatches.length >= 3) {
            matches.push(...verticalMatches);
        }
        
        return matches;
    }
    
    async processMatches(matches) {
        console.log(`Processing ${matches.length} matches`);
        
        // Animate matched candies
        matches.forEach(candy => {
            candy.element.classList.add('matched');
        });
        
        await this.sleep(600);
        
        // Calculate score
        const matchScore = matches.length * 10;
        this.score += matchScore;
        this.scoreElement.textContent = this.score;
        
        // Show score popup
        this.showScorePopup(matchScore);
        
        // Check for win condition
        if (this.score >= this.targetScore) {
            await this.sleep(500);
            this.showWinningPopup();
            return;
        }
        
        // Remove matched candies from DOM and board
        matches.forEach(candy => {
            candy.element.remove();
            // Mark the position as null in the board array
            this.board[candy.row][candy.col] = null;
        });
        
        // Drop candies down
        await this.dropCandies();
        
        // Fill empty spaces
        await this.fillEmptySpaces();
        
        // Check for new matches
        const newMatches = this.findMatches();
        if (newMatches.length > 0) {
            console.log(`Found ${newMatches.length} new matches, continuing...`);
            await this.processMatches(newMatches);
        } else {
            console.log('No new matches found, processing complete');
            // Ensure processing is complete
            this.isProcessing = false;
            this.clearProcessingTimeout();
        }
    }
    
    async dropCandies() {
        // Process each column from bottom to top
        for (let col = 0; col < this.boardSize; col++) {
            let emptyRow = this.boardSize - 1;
            
            // Move from bottom to top, finding candies to drop
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col]) {
                    // If this candy needs to move down
                    if (emptyRow !== row) {
                        // Move candy to new position
                        this.board[emptyRow][col] = this.board[row][col];
                        this.board[row][col] = null;
                        
                        // Update candy's internal position
                        this.board[emptyRow][col].row = emptyRow;
                        this.board[emptyRow][col].col = col;
                        
                        // Update DOM attributes
                        this.board[emptyRow][col].element.dataset.row = emptyRow;
                        this.board[emptyRow][col].element.dataset.col = col;
                        
                        // Add falling animation
                        this.board[emptyRow][col].element.classList.add('falling');
                    }
                    emptyRow--;
                }
            }
        }
        
        // Wait for falling animation
        await this.sleep(500);
        
        // Clean up falling animation classes
        const fallingCandies = document.querySelectorAll('.candy.falling');
        fallingCandies.forEach(candy => {
            candy.classList.remove('falling');
        });
        
        // Ensure all candies are properly positioned in the DOM
        this.repositionCandiesInDOM();
    }
    
    async fillEmptySpaces() {
        // Fill empty spaces with new candies
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!this.board[row][col]) {
                    // Create new candy
                    const newCandy = this.createCandyElement(row, col);
                    this.board[row][col] = newCandy;
                    
                    // Add new candy animation
                    newCandy.element.classList.add('new');
                    
                    // Add to DOM
                    this.gameBoard.appendChild(newCandy.element);
                }
            }
        }
        
        // Wait for new candy animation
        await this.sleep(500);
        
        // Clean up new candy animation classes
        const newCandies = document.querySelectorAll('.candy.new');
        newCandies.forEach(candy => {
            candy.classList.remove('new');
        });
    }
    
    repositionCandiesInDOM() {
        // Clear the game board
        this.gameBoard.innerHTML = '';
        
        // Re-add all candies in their correct positions
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) {
                    this.gameBoard.appendChild(this.board[row][col].element);
                }
            }
        }
    }
    
    replaceCandy(row, col) {
        const newCandy = this.createCandyElement(row, col);
        this.board[row][col] = newCandy;
        this.gameBoard.appendChild(newCandy.element);
    }
    
    showScorePopup(score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${score}`;
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        
        this.gameBoard.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    resetGame() {
        console.log('Resetting game...');
        
        // Stop any ongoing processing
        this.isProcessing = false;
        this.clearProcessingTimeout();
        
        // Stop music
        this.stopBackgroundMusic();
        
        // Reset game state
        this.score = 0;
        this.moves = 0;
        this.timeLeft = 30;
        this.gameStarted = false;
        
        // Update display
        this.scoreElement.textContent = this.score;
        this.movesElement.textContent = this.moves;
        
        // Clear any selections
        this.deselectCandy();
        
        // Stop timer
        this.stopTimer();
        this.updateTimerDisplay();
        
        // Recreate board
        this.createBoard();
        
        console.log('Game reset complete');
    }
    
    startTimer() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        // Only try to play music if audio file is available
        if (this.backgroundMusic) {
            this.playBackgroundMusic();
        }
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.gameStarted = false;
    }
    
    updateTimerDisplay() {
        this.timerElement.textContent = this.timeLeft;
        
        // Update timer styling based on time left
        this.timerContainer.classList.remove('warning', 'danger');
        
        if (this.timeLeft <= 10) {
            this.timerContainer.classList.add('danger');
        } else if (this.timeLeft <= 15) {
            this.timerContainer.classList.add('warning');
        }
    }
    
    gameOver() {
        this.stopTimer();
        this.stopBackgroundMusic(); // Stop music when game ends
        this.isProcessing = true;
        
        // Show game over message
        setTimeout(() => {
            alert(`⏰ Time's up! Your final M&M score: ${this.score} points in ${this.moves} moves!`);
            this.resetGame();
        }, 500);
    }
    
    hideWinningPopup() {
        this.winningPopup.classList.remove('show');
        this.resetGame();
    }
    
    checkGameState() {
        console.log('Checking game state:');
        console.log('- isProcessing:', this.isProcessing);
        console.log('- gameStarted:', this.gameStarted);
        console.log('- timeLeft:', this.timeLeft);
        console.log('- score:', this.score);
        console.log('- moves:', this.moves);
        
        // If game is stuck, reset processing flag
        if (this.isProcessing) {
            console.log('Game appears stuck, resetting processing flag');
            this.isProcessing = false;
            this.clearProcessingTimeout();
        }
    }
    
    // Add this to the end of the class, before the closing brace
    debugBoard() {
        console.log('Current board state:');
        for (let row = 0; row < this.boardSize; row++) {
            let rowStr = '';
            for (let col = 0; col < this.boardSize; col++) {
                const candy = this.board[row][col];
                rowStr += candy ? candy.type.emoji : ' ';
            }
            console.log(`Row ${row}: ${rowStr}`);
        }
    }
    
    setProcessingTimeout() {
        // Clear any existing timeout
        if (this.processingTimeout) {
            clearTimeout(this.processingTimeout);
        }
        
        // Set a new timeout to prevent the game from getting stuck
        this.processingTimeout = setTimeout(() => {
            console.log('Processing timeout reached, resetting game state');
            this.isProcessing = false;
            this.processingTimeout = null;
        }, 10000); // 10 second timeout
    }
    
    clearProcessingTimeout() {
        if (this.processingTimeout) {
            clearTimeout(this.processingTimeout);
            this.processingTimeout = null;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showWinningPopup() {
        // Calculate efficiency (score per move)
        const efficiency = this.moves > 0 ? Math.round(this.score / this.moves) : 0;
        
        // Update popup content
        this.finalScoreElement.textContent = this.score;
        this.finalMovesElement.textContent = this.moves;
        document.getElementById('finalTime').textContent = `${this.timeLeft}s`;
        this.efficiencyElement.textContent = efficiency;
        
        // Stop timer and music
        this.stopTimer();
        this.stopBackgroundMusic();
        
        // Show popup with animation
        this.winningPopup.classList.add('show');
        
        // Add confetti effect
        this.createConfetti();
    }
    
    hideWinningPopup() {
        this.winningPopup.classList.remove('show');
        this.resetGame();
    }
    
    shareScore() {
        const text = `🍫 I scored ${this.score} points in M&M Chocolate Match! Can you beat my score? 🍫`;
        
        if (navigator.share) {
            navigator.share({
                title: 'M&M Chocolate Match Score',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('M&M Score copied to clipboard!');
            }).catch(() => {
                alert(text);
            });
        }
    }
    
    createConfetti() {
        const colors = ['#FF0000', '#FFD700', '#00FF00', '#0000FF', '#FFA500', '#800080', '#8B4513', '#FFFFFF'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '999';
                confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 100);
        }
    }
    
    // Audio System Methods
    initAudio() {
        try {
            // Try to load the background music file
            this.backgroundMusic = new Audio('background_music.mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.preload = 'auto';
            
            // Add error handling for missing file
            this.backgroundMusic.addEventListener('error', (e) => {
                console.warn('Background music file not found. Audio will be disabled.');
                this.backgroundMusic = null;
                this.updateMusicButtonState();
            });
            
            // Add load success handler
            this.backgroundMusic.addEventListener('canplaythrough', () => {
                console.log('Audio system initialized successfully');
            });
            
        } catch (error) {
            console.error('Failed to initialize audio:', error);
            this.backgroundMusic = null;
            this.updateMusicButtonState();
        }
        
        // Initialize move sound effect
        this.initMoveSound();
    }
    
    playBackgroundMusic() {
        if (this.backgroundMusic && !this.isMusicPlaying) {
            this.backgroundMusic.play().then(() => {
                this.isMusicPlaying = true;
                console.log('Background music started');
                this.updateMusicButtonState();
            }).catch(error => {
                console.error('Failed to play background music:', error);
                // If play fails, disable audio system
                this.backgroundMusic = null;
                this.updateMusicButtonState();
            });
        }
    }
    
    pauseBackgroundMusic() {
        if (this.backgroundMusic && this.isMusicPlaying) {
            this.backgroundMusic.pause();
            this.isMusicPlaying = false;
            console.log('Background music paused');
            this.updateMusicButtonState();
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.isMusicPlaying = false;
            console.log('Background music stopped');
            this.updateMusicButtonState();
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    toggleMusic() {
        // If no audio file is available, show message
        if (!this.backgroundMusic) {
            alert('🎵 Background music file not found!\n\nPlease add a file named "background_music.mp3" to the same folder as your game files.');
            return;
        }
        
        if (this.isMusicPlaying) {
            this.pauseBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
    }
    
    updateMusicButtonState() {
        const musicBtn = document.getElementById('musicBtn');
        if (musicBtn) {
            if (!this.backgroundMusic) {
                // No audio file available
                musicBtn.textContent = '❌ No Music';
                musicBtn.classList.add('muted');
                musicBtn.title = 'Background music file not found';
            } else if (this.isMusicPlaying) {
                // Music is playing
                musicBtn.textContent = '🔊 Music';
                musicBtn.classList.remove('muted');
                musicBtn.title = 'Click to pause music';
            } else {
                // Music is paused
                musicBtn.textContent = '🔇 Music';
                musicBtn.classList.add('muted');
                musicBtn.title = 'Click to play music';
            }
        }
    }
    
    // Move Sound Effect Methods
    initMoveSound() {
        try {
            this.moveSound = new Audio('moves_sound.mp3');
            this.moveSound.volume = this.soundVolume;
            this.moveSound.preload = 'auto';
            
            // Add error handling for missing move sound file
            this.moveSound.addEventListener('error', (e) => {
                console.warn('Move sound file not found. Sound effects will be disabled.');
                this.moveSound = null;
            });
            
            // Add load success handler
            this.moveSound.addEventListener('canplaythrough', () => {
                console.log('Move sound effect initialized successfully');
            });
            
        } catch (error) {
            console.error('Failed to initialize move sound:', error);
            this.moveSound = null;
        }
    }
    
    playMoveSound() {
        if (this.moveSound) {
            // Reset the sound to the beginning and play
            this.moveSound.currentTime = 0;
            this.moveSound.play().catch(error => {
                console.error('Failed to play move sound:', error);
            });
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        if (this.moveSound) {
            this.moveSound.volume = this.soundVolume;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CandyCrushGame();
});
