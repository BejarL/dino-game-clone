import { setupGround, updateGround } from './ground.js'
import { updateDino, setupDino, getDinoRect, setDinoLose } from './dino.js'
import { updateCactus, setupCactus, getCactusRects } from './cactus.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

setPixelToWorldScale()

window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })
document.addEventListener("touchstart", handleStart, { once: true });

let lastTime
let speedScale
let score

// Time between frames
function update(time) {
    requestAnimationFrame(update);

    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }

    const delta = time - lastTime
    updateGameComponents(delta);

    lastTime = time;
}

function updateGameComponents(delta) {
    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    if (checkLose()) handleLose();
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return rect1.left < rect2.right && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.bottom > rect2.top
}

// Updates the speed for difficulty
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

// Updates the score. For every second the user gets 10 points
function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}

// Manages the start of the game, updates when starting again
function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    setTimeout(() => {
        document.addEventListener("touchstart", handleStart, { once: true })
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenElem.classList.remove("hide")
    }, 100)
}

function setPixelToWorldScale() {
    let worldToPixelScale = window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT
        ? window.innerWidth / WORLD_WIDTH
        : window.innerHeight / WORLD_HEIGHT;

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

document.addEventListener("touchstart", handleJump);

function handleJump(e) {
    if (e.type === "touchstart" && !isJumping) {
        yVelocity = JUMP_SPEED;
        isJumping = true;
    }
}