window.onkeydown = (evt) => Game.keys[evt.key] = true;
window.onkeyup = (evt) => Game.keys[evt.key] = false;

export default class Game {
    static keys = [];
    static draw = () => {};
}

const ctx = canvas.getContext("2d")
function animate() {
    requestAnimationFrame(animate);
    Game.draw(ctx);
}

animate();