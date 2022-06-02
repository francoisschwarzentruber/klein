window.onkeydown = (evt) => Game.keys[evt.key] = true;
window.onkeyup = (evt) => Game.keys[evt.key] = false;

const ctx = canvas.getContext("2d");

export default class Game {
    static keys = [];
    static draw = () => {};
    static setBackground(draw) {
        draw(ctx);
        canvas.style.backgroundImage = "url('" + canvas.toDataURL() + "')";
    }
}


CanvasRenderingContext2D.prototype.circle = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
}


CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
}


function animate() {
    requestAnimationFrame(animate);
    Game.draw(ctx);
}

animate();