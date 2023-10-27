var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var gravity = 0.4;
var score = 0;
var pipeSpacing = 330;
var pipeWidth = 53;
var birdWidth = 50;
var birdHeight = 40;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var holeHeight = 170;
var bird;
var pipes = [];

class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.width = birdWidth;
        this.height = birdHeight;
    }

    show() {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.ySpeed;
        this.ySpeed += gravity;

        if (this.y > canvasHeight - this.height + 20 || this.y < -20) {
            gameOver();
        }
    }

    jump() {
        this.ySpeed = -8;
    }
}

class Pipe {
    constructor() {
        this.width = pipeWidth;
        this.height = (Math.random() * (canvasHeight - holeHeight - 50)) + 50;
        this.x = canvasWidth;
        this.y = this.height - canvasHeight;
        this.passed = false;
    }

    show() {
        ctx.drawImage(topPipe, this.x, this.y, this.width, canvasHeight);
        ctx.drawImage(bottomPipe, this.x, this.y + canvasHeight + holeHeight, this.width, canvasHeight);
    }

    update() {
        this.x -= 3;
    }

    offscreen() {
        return this.x + this.width < 0;
    }
}

function startGame() {
    bird = new Bird(50, canvasHeight / 2 - birdHeight / 2);
    pipes = [new Pipe()];
}

function gameOver() {
    alert("You got " + score + " points!");
    score = 0;
    startGame();
}

function handleKeyDown(e) {
    if (e.keyCode === 38 || e.keyCode === 32) { 
        bird.jump();
    }
}

document.addEventListener('keydown', handleKeyDown);

var birdImage = new Image();
birdImage.src = 'images/flappybird.png';

var topPipe = new Image();
topPipe.src = 'images/toppipe.png';

var bottomPipe = new Image();
bottomPipe.src = 'images/bottompipe.png';

function update() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update & show bird
    bird.update();
    bird.show();

    // Handle pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }

        if (!pipes[i].passed && bird.x > pipes[i].x + pipeWidth) {
            pipes[i].passed = true;
            score++;
        }
    }

    if (pipes[pipes.length - 1].x <= canvasWidth - pipeSpacing) {
        pipes.push(new Pipe());
    }

    // Draw score
    ctx.font = "20px Monaco";
    ctx.fillStyle = "#020263";
    ctx.fillText("Score: " + score, 8, 20);

    requestAnimationFrame(update);
}

startGame();
update();
