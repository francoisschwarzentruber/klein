window.onkeydown = (evt) => Game.keys[evt.key] = true;
window.onkeyup = (evt) => Game.keys[evt.key] = false;

const ctx = canvas.getContext("2d");

export default class Game {
    static keys = [];
    static draw = () => {};
    static setBackground(draw) {
        draw(ctx);
        canvas.style.backgroundImage = "url('"+canvas.toDataURL()+ "')";
    }
}


function animate() {
    requestAnimationFrame(animate);
    Game.draw(ctx);
}

animate();