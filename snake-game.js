const canvas = document.getElementById('snake-game');
const ctx = canvas.getContext('2d');
const gridSize = 16;
let snake = [{ x: 160, y: 160 }, { x: 144, y: 160 }, { x: 128, y: 160 }];
let dx = gridSize;
let dy = 0;
let food = { x: 0, y: 0 };
let foodFound = true;
let score = 0;

let isPaused = false;
let isStarted = false;

function main() {
    if (gameOver()) {
        isStarted = false;
        return;
    }

    if (isPaused || !isStarted) {
        setTimeout(() => {
            requestAnimationFrame(main);
        }, 100);
        return;
    }

    setTimeout(() => {
        requestAnimationFrame(main);
        update();
        draw();
    }, 100);
}

function update() {
    for (let i = snake.length - 1; i >= 0; i--) {
        if (i === 0) {
            snake[i].x += dx;
            snake[i].y += dy;
        } else {
            snake[i] = { ...snake[i - 1] };
        }
    }

    if (foodFound) {
        generateFood();
        foodFound = false;
    }

    if (snake[0].x === food.x && snake[0].y === food.y) {
        foodFound = true;
        score += 10;
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach(({ x, y }, index) => {
        const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
        gradient.addColorStop(0, index === 0 ? '#228B22' : '#32CD32');
        gradient.addColorStop(1, '#006400');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2 - 1, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    });

    // Draw food
    const foodGradient = ctx.createLinearGradient(food.x, food.y, food.x + gridSize, food.y + gridSize);
    foodGradient.addColorStop(0, '#FF4500');
    foodGradient.addColorStop(1, '#8B0000');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Draw score
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}


function gameOver() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    return (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    );
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

    snake.forEach(({ x, y }) => {
        if (food.x === x && food.y === y) {
            generateFood();
        }
    });
}

function handleKeydown(event) {
    const { key } = event;

    if (key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -gridSize;
    }
    if (key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
    if (key === 'ArrowLeft' && dx === 0) {
        dx = -gridSize;
        dy = 0;
    }
    if (key === 'ArrowRight' && dx === 0) {
        dy = 0;
        dx = gridSize;
    }
}
document.getElementById('play-btn').addEventListener('click', () => {
    if (!isStarted) {
        isStarted = true;
        main();
    }
});

document.getElementById('restart-btn').addEventListener('click', () => {
    snake = [{ x: 160, y: 160 }, { x: 144, y: 160 }, { x: 128, y: 160 }];
    dx = gridSize;
    dy = 0;
    foodFound = true;
    score = 0;
    isPaused = false;
    isStarted = true;
    main();
});

document.getElementById('pause-btn').addEventListener('click', () => {
    isPaused = !isPaused;
});
document.addEventListener('keydown', handleKeydown);
main();


setTimeout(() => {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.style.display = 'none';
}, 5000); // Adjust the time (in milliseconds) as needed


const counterElement = document.getElementById('counter');
let counter = 5; // Adjust the time (in seconds) as needed

function updateCounter() {
    if (counter > 0) {
        counterElement.textContent = `Game starts in ${counter} second${counter === 1 ? '' : 's'}...`;
        counter--;
        setTimeout(updateCounter, 1000);
    } else {
        const messageContainer = document.querySelector('.message-container');
        messageContainer.style.display = 'none';
    }
}

updateCounter();

let touchStartX = null;
let touchStartY = null;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && dx === 0) {
            // Swipe left
            dx = -gridSize;
            dy = 0;
        } else if (diffX < 0 && dx === 0) {
            // Swipe right
            dx = gridSize;
            dy = 0;
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && dy === 0) {
            // Swipe up
            dx = 0;
            dy = -gridSize;
        } else if (diffY < 0 && dy === 0) {
            // Swipe down
            dx = 0;
            dy = gridSize;
        }
    }

    touchStartX = null;
    touchStartY = null;
}


canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
