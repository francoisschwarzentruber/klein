import game from "./engine.js";

function rounding(position) {
    if (position.x < 0) position.x = 640;
    if (position.y < 0) position.y = 480;
    if (position.x > 640) position.x = 0;
    if (position.y > 480) position.y = 0;
}

const PARTICLESIZE = 16;
class Particle {
    position;
    speed;
    constructor() {
        this.position = {
            x: Math.random() * 640,
            y: Math.random() * 480
        };
        const PARTICLESPEED = 8;
        this.speed = {
            x: PARTICLESPEED * Math.random() - PARTICLESPEED / 2,
            y: PARTICLESPEED * Math.random() - PARTICLESPEED / 2
        };
    }
    live() {
        this.position = {
            x: this.position.x + this.speed.x,
            y: this.position.y + this.speed.y
        };
        rounding(this.position);
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x - PARTICLESIZE / 2, this.position.y - PARTICLESIZE / 2, PARTICLESIZE, PARTICLESIZE);

        /*ctx.fillStyle = "#88FF88";
        ctx.fillRect((this.position.x + 320) - PARTICLESIZE / 2, (480 - this.position.y) - PARTICLESIZE / 2, PARTICLESIZE, PARTICLESIZE);*/
    }
}


class Player {

    constructor() {
        this.position = {
            x: Math.random() * 640,
            y: Math.random() * 480
        };
        this.angle = 0;
    }
    live() {
        const STEP = 0.1;
        if (game.keys["ArrowLeft"])
            this.angle -= STEP;
        if (game.keys["ArrowRight"])
            this.angle += STEP;

        const SPEED = 5;
        if (game.keys["ArrowUp"])
            this.position = {
                x: this.position.x + SPEED * Math.cos(this.angle),
                y: this.position.y + SPEED * Math.sin(this.angle)
            };
        rounding(this.position);
    }

    draw(ctx) {
        function drawMe(position, angle) {
            const A = 0.5;
            const S = 32;
            ctx.beginPath();
            ctx.moveTo(position.x - S * Math.cos(angle - A), position.y - S * Math.sin(angle - A));
            ctx.lineTo(position.x, position.y);
            ctx.lineTo(position.x - S * Math.cos(angle + A), position.y - S * Math.sin(angle + A));
            ctx.stroke();
        }
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        drawMe(this.position, this.angle);

        ctx.lineWidth = 1;
        drawMe({
            x: (this.position.x + 320) % 640,
            y: 480 - this.position.y
        }, 2 * Math.PI - this.angle);
    }
}

const objects = new Set();
const player = new Player();
objects.add(player);

for (let i = 0; i < 10; i++)
    objects.add(new Particle());

const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

let counter = 0;
let score = 0;
let beginningTime = Date.now();
let gameover = false;
const initialTime = 100;

const time = () => initialTime - Math.floor((Date.now() - beginningTime) / 1000);
setInterval(() => objects.add(new Particle()), 5000);

game.setBackground((ctx) => {
    const steps = 128;
    for (let i = 0; i < steps; i++)
        for (let j = 0; j < steps; j++) {

            const ax = Math.sin(2 * Math.PI * i / steps);
            const ay = Math.sin(2 * Math.PI * j / steps) * (1 - (i / steps)) + Math.sin(2 * Math.PI * (1 - j / steps)) * (i / steps);

            const A = 64;
            const cx = 192 + Math.floor(A * ax);
            const cy = 192 + Math.floor(A * ay);

            const color = `rgb(${cx},${cy},192)`;
            const cellx = 320 / steps;
            const celly = 480 / steps;
            const x = i * cellx;
            const y = j * celly;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellx, celly);
            ctx.fillRect(x + 320, 480 - y - celly, cellx, celly);
        }

});

function interactionBetweenObjects() {
    for (const o of objects)
        if (o instanceof Particle)
            if (dist(o.position, player.position) < 16) {
                objects.delete(o);
                score += 1;
            }
}

function crossSurface() {
    player.position = {
        x: (player.position.x + 320) % 640,
        y: 480 - player.position.y
    }
    player.angle = 2 * Math.PI - player.angle;
    counter = 10;
}

function drawScoreAndTime(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText("time: " + Math.max(0, time()), 640 - 300, 16);
    ctx.fillText("score: " + score, 16, 16);
}

function drawGameOver(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", 240, 240);
    ctx.fillText("score: " + score, 280, 280);
}





game.draw = (ctx) => {
    ctx.clearRect(0, 0, 640, 480);

    if (time() >= 0) {
        for (const o of objects) o.live();
        interactionBetweenObjects();
        if (game.keys[" "] && counter <= 0)
            crossSurface();
        counter--;
    } else
        drawGameOver(ctx);

    for (const o of objects) o.draw(ctx);
    drawScoreAndTime(ctx);
}