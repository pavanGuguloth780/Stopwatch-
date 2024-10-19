// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const status = document.getElementById('game-status');
    const restartButton = document.getElementById('restart-button');
    const playAIButton = document.getElementById('play-ai');
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill(null);
    let gameActive = true;
    let playAgainstAI = false;

    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (gameBoard[index] || !gameActive) return;

        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            status.textContent = `${currentPlayer} wins!`;
            drawWinningLine();
            showBlastAnimation();
            showConfetti();
            playSound('win');
            gameActive = false;
        } else if (gameBoard.every(cell => cell)) {
            status.textContent = 'It\'s a draw!';
            playSound('draw');
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;

            if (playAgainstAI && currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    }

    function drawWinningLine() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                const line = document.createElement('div');
                line.classList.add('winning-line');
                if (a % 3 === 0) {
                    line.style.top = `${Math.min(a, b, c) * 33.33}%`;
                    line.style.height = '10px';
                } else if (a % 3 === 1) {
                    line.style.left = `${(a % 3) * 33.33}%`;
                    line.style.width = '10px';
                } else {
                    line.style.top = `${Math.min(a, b, c) * 33.33}%`;
                    line.style.transform = 'rotate(45deg)';
                }
                board.appendChild(line);
                break;
            }
        }
    }

    function showBlastAnimation() {
        const blast = document.createElement('div');
        blast.classList.add('blast-animation');
        board.appendChild(blast);
    }

    function showConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti');
        board.appendChild(confettiContainer);

        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.classList.add('piece');
            piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.top = `${Math.random() * 100}%`;
            piece.style.animationDuration = `${Math.random() * 2 + 1}s`;
            confettiContainer.appendChild(piece);
        }
    }

    function playSound(type) {
        const audio = new Audio();
        switch (type) {
            case 'win':
                audio.src = 'sounds/win.mp3'; // Ensure you have this sound file
                break;
            case 'draw':
                audio.src = 'sounds/draw.mp3'; // Ensure you have this sound file
                break;
        }
        audio.play();
    }

    function aiMove() {
        const emptyCells = gameBoard.map((value, index) => value === null ? index : null).filter(value => value !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        handleCellClick({ target: cell });
    }

    function restartGame() {
        gameBoard = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = `Player ${currentPlayer}'s turn`;
        Array.from(board.children).forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        document.querySelectorAll('.winning-line').forEach(line => line.remove());
        document.querySelectorAll('.blast-animation').forEach(animation => animation.remove());
        document.querySelector('.confetti')?.remove();
    }

    function toggleAI() {
        playAgainstAI = !playAgainstAI;
        playAIButton.textContent = playAgainstAI ? 'Play Against Player' : 'Play Against AI';
    }

    restartButton.addEventListener('click', restartGame);
    playAIButton.addEventListener('click', toggleAI);

    createBoard();
    status.textContent = `Player ${currentPlayer}'s turn`;
});
