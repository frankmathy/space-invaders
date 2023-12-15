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

        this.rotation = 0;

        this.image = new Image();
        this.image.src = 'img/spaceship.png';
        this.image.onload = () => {
            const scale = 0.5;
            this.width = 100 * scale;
            this.height = 100 * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        c.save();
        c.translate(player.position.x + player.width / 2, player.position.y) + player.height / 2;
        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2, -player.position.y) - player.height / 2;
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }

    update() {
        if (this.image && this.position) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.image = new Image();
        this.image.src = 'img/invader.png';
        this.image.onload = () => {
            const scale = 0.5;
            this.width = 100 * scale;
            this.height = 100 * scale;
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update({ velocity }) {
        if (this.image && this.position) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
}

class Grid {
    constructor() {
        this.invaderSize = 50;
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = [];

        const rows = Math.floor(Math.random() * 5 + 2);
        const columns = Math.floor(Math.random() * 10 + 5);

        this.width = columns * this.invaderSize;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * this.invaderSize,
                        y: y * this.invaderSize
                    }
                }))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = this.invaderSize;
        }
    }
}

const player = new Player();
const projectiles = [];
const grids = [];

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let frames = -1;
let randomInterval = (Math.random() * 500) + 500;

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            projectiles.splice(index, 1);
        } else {
            projectile.update();
        }
    })

    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.y + projectile.radius >= invader.position.y &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((i) => i === invader);
                        const projectileFound = projectiles.find((p) => p === projectile);

                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.ax = firstInvader.position.x;
                            }
                        }
                    }, 0)
                }
            })
        })
    })

    if (keys.a.pressed && player.position.x > 0) {
        player.velocity.x = -7;
        player.rotation = -0.15;
    } else if (keys.d.pressed && player.position.x <= canvas.width - player.width) {
        player.velocity.x = 7;
        player.rotation = 0.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    if (frames < 0 || frames > randomInterval) {
        console.log('Created new invaders at ' + frames);
        frames = 0;
        randomInterval = Math.floor((Math.random() * 500) + 500);
        grids.push(new Grid());
    }

    frames++;
}

animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})