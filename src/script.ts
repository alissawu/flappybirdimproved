// accessing canvas elem  + 2d context
const canvas = document.getElementById("canv") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// game vars
const gravity: number = 1.6;
let score: number = 0;
const pipeSpacing: number = 330;
const pipeWidth: number = 53;
const birdWidth: number = 50;
const birdHeight: number = 40;
const canvasWidth: number = canvas.width;
const canvasHeight: number = canvas.height;
const holeHeight: number = 170;
let bird: Bird;
let pipes: Pipe[] = [];

// Bird class 
class Bird {
    x: number;
    y: number;
    ySpeed: number;
    width: number;
    height: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.ySpeed = 0;
        this.width = birdWidth;
        this.height = birdHeight;
    }

    show(): void {
        ctx.drawImage(birdImage, this.x, this.y, this.width, this.height);
    }

    update(): void {
        this.y += this.ySpeed;
        this.ySpeed += gravity;

        if (this.y > canvasHeight - this.height + 20 || this.y < -20) {
            gameOver();
        }
        for (let pipe of pipes) {
            if (
                bird.x < pipe.x + pipe.width &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.y + canvasHeight || bird.y + bird.height > pipe.y + canvasHeight + holeHeight)
            ) {
                gameOver()
            }
        }
    }

    jump(): void {
        this.ySpeed = -5;
    }
}


// Pipe class 
class Pipe {
    width: number;
    height: number;
    x: number;
    y: number;
    passed: boolean;

    constructor() {
        this.width = pipeWidth;
        this.height = (Math.random() * (canvasHeight - holeHeight - 50)) + 50;
        this.x = canvasWidth;
        this.y = this.height - canvasHeight;
        this.passed = false;
    }

    show(): void {
        ctx.drawImage(topPipe, this.x, this.y, this.width, canvasHeight);
        ctx.drawImage(bottomPipe, this.x, this.y + canvasHeight + holeHeight, this.width, canvasHeight);
    }

    update(): void {
        this.x -= 3;
    }

    offscreen(): boolean {
        return this.x + this.width < 0;
    }
}

// Start game, regen the bird and clear the pipe stuff
function startGame(): void {
    bird = new Bird(50, canvasHeight / 2 - birdHeight / 2);
    pipes = [new Pipe()];
}
// game over - give score, restart game
function gameOver(): void {
    alert(`You got ${score} points!`);
    score = 0;
    startGame();
}
function handleKeyDown(e: KeyboardEvent): void {
    // keyCode deprecated
    if (e.key === 'ArrowUp' || e.key === 'Space') { 
        bird.jump();
    }
}

document.addEventListener('keydown', handleKeyDown);

// images
const birdImage = new Image();
birdImage.src = 'images/flappybird.png';

const topPipe = new Image();
topPipe.src = 'images/toppipe.png';

const bottomPipe = new Image();
bottomPipe.src = 'images/bottompipe.png';

function update(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // update & show bird
    bird.update();
    bird.show();

    // handle pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].show();

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        } else if (!pipes[i].passed && bird.x > pipes[i].x + pipeWidth) {
            pipes[i].passed = true;
            score++;
        }
    }

    if (pipes.length > 0 && pipes[pipes.length - 1].x <= canvasWidth - pipeSpacing) {
        pipes.push(new Pipe());
    }

    // draw score
    ctx.font = "20px Monaco";
    ctx.fillStyle = "#020263";
    ctx.fillText(`Score: ${score}`, 8, 20)

    requestAnimationFrame(update);
}

startGame();
update();
