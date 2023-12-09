const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerWidth;

class Player {
    constructor() {
        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.image = new Image();
        this.image.src = 'img/spaceship.png';
        this.image.onload = () => {
            const scale = 0.15;
            this.width = 100 * scale;
            this.height = 100 * scale;
        }
    }

    draw() {
        c.fillStyle = 'red';
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
}

animate();