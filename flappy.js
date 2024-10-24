const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.2,
    lift: -6,
    velocity: 0,
    color: "#FFD700"
};

let pipes = [];
let pipeWidth = 30;
let pipeGap = 150;
let pipeSpeed = 2;
let score = 0;
let gameRunning = true;

function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = "#8B4513";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 150) {
        let topHeight = Math.random() * (canvas.height - pipeGap - 20) + 20;
        pipes.push({
            x: canvas.width,
            top: topHeight
        });
    }
    
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });
    
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap) {
                gameOver();
            }
        }
    });
}

function gameOver() {
    gameRunning = false;
    alert("Game Over! Your score: " + score);
    resetGame();
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameRunning = true;
}

function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    });
    document.title = `Score: ${score}`;
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        updateBird();
        updatePipes();
        drawBird();
        drawPipes();
        checkCollision();
        updateScore();
        
        requestAnimationFrame(gameLoop);
    }
}

// Control del pájaro con el teclado
window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        bird.velocity = bird.lift;  // Impulso hacia arriba al presionar la barra espaciadora
    }
});

// Control del pájaro con el toque en pantallas táctiles
canvas.addEventListener("touchstart", function(event) {
    bird.velocity = bird.lift;  // Impulso hacia arriba al tocar la pantalla
});

// Para que también funcione con un clic del ratón (en caso de que lo quieras)
canvas.addEventListener("click", function(event) {
    bird.velocity = bird.lift;  // Impulso hacia arriba al hacer clic
});

// Iniciar el juego
resetGame();
gameLoop();
