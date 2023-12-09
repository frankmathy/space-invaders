const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {

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
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        if (this.image && this.position) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}

const player = new Player();

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
}

animate();

addEventListener('keydown', ({ key }) => {
    console.log(key)
    /*switch (key) {
        case 'a':
            player.velocity.x = -5;
        case 'd':
            player.velocity.x = 5;
            break;
        case ' ':
            break;
    }*/
})