document.body.appendChild(app.view);

const canvasWidth = app.screen.width;
const canvasHeight = app.screen.height;
let speed = 5


function Cactus() {
    let bigCactusTexture = PIXI.Texture.from('libs/cactus0.png');
    let smallCactusTexture = PIXI.Texture.from('libs/cactus1.png');
    const cacts = [bigCactusTexture, smallCactusTexture];
    let cactus;

    function rnd(max) {
        return Math.floor(Math.random() * max);
    }

    for (let i = 0; i < cacts.length; i++) {
        cactus = PIXI.Sprite.from(cacts[i * rnd(2)]);
        if (i * rnd(2) === 0) {
            cactus.width = 50;
            cactus.height = 50;
            cactus.position.set(640, canvasHeight / 2 - cactus.height);
        } else {
            cactus.width = 43;
            cactus.height = 43;
            cactus.position.set(640, canvasHeight / 2 - cactus.height);
        }

    }
    return cactus

}

let score = [0, 0, 0, 0, 0];

let scoreText = new PIXI.Text();
scoreText.style.fontFamily = 'Pixel-Font';

scoreText.style.fontSize = 16;
scoreText.style.fill = 0x606060;
scoreText.x = 420;
scoreText.y = 10;
scoreTicker = new PIXI.Ticker;
setTimeout(() => scoreTicker.start(), 200);

let num = 0;
let speed2 = 1;

scoreTicker.add((delta) => {
    speed2++
    if (num + speed2 === 10) {
        num = 0;
        speed2 = 0
        score[4] += Math.round(delta)
    }
    if (num + speed2 === 10) {
        num = 0;
        speed2 = 0
        score[4] += Math.round(delta)
    }
    if (score[4] === 10) {
        score[4] = 0;
        score[3] += Math.round(delta)
    }
    if (score[3] === 10) {
        score[3] = 0;
        score[2] += Math.round(delta)
    }
    if (score[2] === 10) {
        score[2] = 0;
        score[1] += Math.round(delta)
    }
    if (score[1] === 10) {
        score[1] = 0;
        score[0] += Math.round(delta)
    }
    if (isGameOver) {
        if (localStorage.hasOwnProperty('bestScore') && localStorage.getItem('bestScore') < score.join('')) {
            localStorage.setItem('bestScore', `${score.join('')}`);
        }
    }
    if (!localStorage.hasOwnProperty('bestScore')) {
        localStorage.setItem('bestScore', '00000')
    }

    scoreText.text = `HI ${localStorage.getItem('bestScore')} ${score.join('')}`;

    app.stage.addChild(scoreText);

    function stopScoreTicker() {
        if (isGameOver) {
            scoreTicker.stop();
            roadTicker.stop()
        }
    }

    stopScoreTicker();
})


function gameOver() {
    let gameOver = PIXI.Sprite.from('libs/gameOver.png');
    isGameOver = true;
    gameOver.width = 200;
    gameOver.height = 30;
    gameOver.position.set(canvasWidth / 2 - gameOver.width / 2, canvasHeight / 2 - gameOver.height * 4);
    return gameOver
}

function replayKeyPng() {
    let replayKeyPng = PIXI.Sprite.from('libs/replay.png');
    replayKeyPng.width = 50;
    replayKeyPng.height = 50;
    replayKeyPng.position.set(canvasWidth / 2 - replayKeyPng.width / 2, canvasHeight / 2 - replayKeyPng.height - replayKeyPng.height / 2);
    return replayKeyPng
}

function listenerEnable() {
    if (isGameOver) {
        setTimeout(() => {
            window.addEventListener('keydown', onClickHandler);
        }, 1000)
    }
}

function onClickHandler(event) {
    if (isGameOver) {
        if (event.code === "Space") {
            // Ваш код для обработки нажатия клавиши "Space"
            restart();
        }
    }
}

const notAnimatedDinoTexture = PIXI.Texture.from(`libs/dino.png`);

const frames = [];
for (let i = 0; i < 2; i++) {
    const animatedDinoTexture = PIXI.Texture.from(`libs/dino${i}.png`);

    frames.push(animatedDinoTexture);
}
let dino = new PIXI.AnimatedSprite(frames);
dino.animationSpeed = 0.1; // Adjust the animation speed as needed
dino.loop = true; // Set to false if you want the animation to play only once
dino.width = 50;
dino.height = 50;
dino.position.set(canvasWidth / 8, canvasHeight / 2 - dino.height);
app.stage.addChild(dino);
dino.play();

let dinoGameOver = PIXI.Texture.from('libs/dinoGameOver.png');


const roadContainer = new PIXI.Container();
roadContainer.y = canvasHeight / 2 - 30;
const roadTexture = PIXI.Texture.from('libs/road.png');
const roadWidth = 640;
const roadSprite = new PIXI.Sprite(roadTexture);
roadSprite.position.set(0, 0);
let roadTicker = new PIXI.Ticker();
roadTicker.start();
roadTicker.add(() => {
    roadContainer.addChild(roadSprite);
})
app.stage.addChild(roadContainer);
roadTicker.add(moveRoad)


function moveRoad() {
    roadContainer.x -= speed; // Скорость движения дороги (уменьшите значение для более медленного движения)
    if (roadContainer.x <= -roadWidth * 2) {
        roadContainer.x = 0;
    }
}


let border = new PIXI.Graphics();

let borderWidth = 2;
let borderColor = 0x000000;
let isGameOver = false;

border.lineStyle(borderWidth, borderColor);
border.drawRect(0, 0, canvasWidth, canvasHeight);

app.stage.addChild(border);

const startX = 0;
const startY = canvasHeight / 2;

function timeout() {
    setTimeout(cactusTick, Math.floor(Math.random() * (3 - 1) + 1) * 1000);
}

function checkCollision(dino, cactus) {
    const dinoX = dino.x - 20;
    const dinoY = dino.y;
    const dinoWidth = dino.width;
    const dinoHeight = dino.height - 5;

    const cactusX = cactus.x + 10;
    const cactusY = cactus.y;
    const cactusWidth = cactus.width - 40;
    const cactusHeight = cactus.height;

    const collisionX = dinoX < cactusX + cactusWidth && dinoX + dinoWidth > cactusX;
    const collisionY = dinoY < cactusY + cactusHeight && dinoY + dinoHeight > cactusY;

    if (collisionX && collisionY) {
        return true

    }
    return false;
}


function cactusTick() {
    timeout();
    let cactus = new Cactus();
    app.stage.addChild(cactus);
    app.stage.setChildIndex(cactus, app.stage.children.length - 2);
    let cactusTicker = new PIXI.Ticker();
    cactusTicker.start();
    cactusTicker.add((delta) => {
        cactus.x -= isGameOver ? 0 : delta * speed;
        let cactusCollided = checkCollision(dino, cactus);
        if (cactusCollided) {
            gameOver()
            cactusTicker.stop();
        }
        if (isGameOver) {
            setTimeout(() => {
                app.stage.addChild(replayKeyPng());
                listenerEnable();
            }, 100);
        }
    })
}

let gameOverTicker = new PIXI.Ticker();
gameOverTicker.start();

function gameOverTick() {
    gameOverTicker.add(() => {
        showGameOver();
    })
}

function showGameOver() {
    if (isGameOver) {
        app.stage.addChild(gameOver());
    }
}

function start() {
    cactusTick();
    gameOverTick();
    moveRoad()
}

function restart() {
    window.location.reload()
}


dino.y = canvasHeight / 2 - dino.height;

app.stage.addChild(dino);

const keyboard = {};

// Handle keyboard keydown event
window.addEventListener('keydown', (event) => {
    keyboard[event.key] = true;
});

// Handle keyboard keyup event
window.addEventListener('keyup', (event) => {
    keyboard[event.key] = false;
});
const jumpPower = 10;   // The power of the jump
const gravity = 0.5;   // The gravitational force

let isJumping = false;
let jumpVelocity = 0;

let jumpTicker = new PIXI.Ticker();
jumpTicker.start();


function update() {
    if (isGameOver) {
        dino.texture = notAnimatedDinoTexture;
    }
    // Check if the space bar is pressed and the Dino is not already jumping
    if (keyboard[' '] && !isJumping) {
        isJumping = true;
        jumpVelocity = -jumpPower;
    }

    // Apply gravity to the Dino if it's in the air (jumping)
    if (isJumping) {
        jumpVelocity += gravity;
        dino.y += jumpVelocity;

        // Check if the Dino has landed (reached the ground)
        if (dino.y >= canvasHeight / 2 - dino.height) {
            isJumping = false;
            dino.y = canvasHeight / 2 - dino.height;
        }
    }
    if (dino.y < 189) {
        dino.texture = notAnimatedDinoTexture;
    }
    if (isGameOver) {
        jumpTicker.stop();
        dino.animationSpeed = 0;
        dino.texture = dinoGameOver
    }
}

// Add the update function to the Ticker's update loop
jumpTicker.add(update);






