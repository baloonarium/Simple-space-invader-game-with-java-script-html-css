const canvas = document.querySelector('canvas')
const scoreElement = document.getElementById('scoreElement')
const meilleurScore = document.getElementById('meilleurScore')
const gameOver = document.getElementById('gameOver')
const c = canvas.getContext('2d')

const audioGameOver = new Audio('./static/audio/gameOver.mp3')
const audioBonus = new Audio('./static/audio/bonus.mp3')
const audioShoot = new Audio('./static/audio/shoot.wav')
const audioEnemyShoot = new Audio('./static/audio/enemyShoot.wav')
const audioExplode = new Audio('./static/audio/explode.wav')
const audioBackground = new Audio('./static/audio/backgroundMusic.wav')

canvas.width = window.innerWidth
canvas.height = window.innerHeight


class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = "./static/spaceship.png"

        image.onload = () => {
            const scale = 0.30
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width,
                y: canvas.height - this.height - 20
            }
        }

    }
    draw() {

        c.save()
        c.globalAlpha = this.opacity
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)

        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({
        position,
        velocity,
        radius,
        color
    }) {
        this.color = color
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()

    }


    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader {
    constructor({
        position
    }) {

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = "./static/invader.png"

        image.onload = () => {
            const scale = 1
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }



    }

    draw() {


        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)

    }
    update({
        velocity
    }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))

    }
}

class InvaderProjectile {
    constructor({
        position,
        velocity,
    }) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }


    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []

        const rows = Math.floor(Math.random() * 8 + 2)
        const columns = Math.floor(Math.random() * 10 + 5)

        this.width = columns * 30

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    }
                }))
                console.log(this.invaders)
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }

    }
}

class Particle {
    constructor({
        position,
        velocity,
        radius,
        color,
        fades
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0,
            Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()

    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.fades) {
            this.opacity -= 0.003
        }
    }
}

class Bonus {
    constructor({
        position,
        velocity,
    }) {
        this.position = position
        this.velocity = velocity

        const image = new Image()
        image.src = "./static/bonus.png"

        image.onload = () => {
            const scale = 0.05
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }

        this.weapon = []

    }
    draw() {


        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height)

    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const someBonus = []



const key = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    s: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0
let randomWeapon = 2

//Particules de fond
for (let i = 0; i < 100; i++) {
    particles.push(
        new Particle({


            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: 0.3
            },
            radius: (Math.random()) * 3,
            color: 'white'
        }))

}

function createParticles({
    object,
    color,
    nombre,
    fades
}) {

    for (let i = 0; i < nombre; i++) {
        particles.push(
            new Particle({


                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2
                },
                velocity: {
                    x: (Math.random() - 0.5) * 3,
                    y: (Math.random() - 0.5) * 3
                },
                radius: (Math.random()) * 2,
                color: color || 'white',
                fades: fades
            }))

    }

}

function weaponGolderak() {

    let random = Math.random() * 10
    let random2 = Math.random() * 3
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -15
        },
        radius: random,
        color: 'red'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 20,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        },
        radius: random2,
        color: 'red'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 115,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        },
        radius: random2,
        color: 'red'
    }))
}

function weaponTsunaki() {

    let random = Math.random() * 8
    let random2 = Math.random() * 4
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -15
        },
        radius: random,
        color: 'green'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 30,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -20
        },
        radius: random2,
        color: 'green'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 100,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -20
        },
        radius: random2,
        color: 'green'
    }))
}

function weaponClassic() {

    setTimeout(() => {
        projectiles.push(new Projectile({
            position: {
                x: player.position.x + player.width / 2,
                y: player.position.y
            },
            velocity: {
                x: 0,
                y: -10
            },
            radius: 3,
            color: 'red'
        }))
    }, 0)

}

function weaponTornado() {
    let random = Math.random() * 20
    let random2 = Math.random() * 5
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -50
        },
        radius: random,
        color: 'red'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 20,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -50
        },
        radius: random2,
        color: 'white'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 115,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -50
        },
        radius: random2,
        color: 'white'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -50
        },
        radius: random2,
        color: 'white'
    }))
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + 135,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -50
        },
        radius: random2,
        color: 'white'
    }))
}

function animate() {
    if (!game.active) return

    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)

            }, 0)
        } else {
            particle.update()
        }
    })

    //invaders hit player
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >=
            canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)

            }, 0)
        } else invaderProjectile.update()

        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width) {

            setTimeout(() => {

                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
                gameOver.innerText = 'GAME OVER'
                audioGameOver.play()
            }, 0)

            setTimeout(() => {
                game.active = false

            }, 2000)

            createParticles({
                object: player,
                color: 'white',
                nombre: 20,
                fades: true
            })
        }
    })

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)

        } else {
            projectile.update()
        }
    })

    someBonus.forEach((bonus, i) => {
        bonus.update()

        if (bonus.position.y + bonus.height >= player.position.y &&
            bonus.position.x + bonus.width >= player.position.x &&
            bonus.position.x <= bonus.position.x + player.width) {
            setTimeout(() => {
                randomWeapon = Math.floor(Math.random() * 4)
                someBonus.splice(i, 1)
                createParticles({
                    object: player,
                    color: 'yellow',
                    nombre: 30,
                    fades: true
                })
                audioBonus.play()

            }, 0)


        } else {
            /*  setTimeout(() => {
                  someBonus.splice(i, 1)
              }, 0)*/
        }

    })


    grids.forEach((grid, gridIndex) => {
        grid.update()

        // Spawn Projectile
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {

            invader.update({
                velocity: grid.velocity
            })

            //projectiles hit enemy
            projectiles.forEach((projectile, j) => {

                if (projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x && projectile.position.x -
                    projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >=
                    invader.position.y) {


                    setTimeout(() => {


                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 === invader)

                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 ===
                            projectile)

                        //Remove invader & projectile
                        if (invaderFound && projectileFound) {
                            score += 100
                            scoreElement.innerText = score

                            createParticles({
                                object: invader,
                                color: 'white',
                                nombre: 15,
                                fades: true
                            })
                            audioExplode.play()


                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                            let randomBonus = Math.floor(Math.random() * 150)

                            if (randomBonus == 1) {
                                someBonus.push(new Bonus({
                                    position: {
                                        x: invader.position.x,
                                        y: invader.position.y
                                    },
                                    velocity: {
                                        x: 0,
                                        y: 1
                                    }
                                }))

                            }

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x -
                                    firstInvader.position.x +
                                    lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }

                        }
                    }, 0)

                }

            })
        })
    })

    if (key.q.pressed && player.position.x > 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    } else if (key.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5
        player.rotation = +0.15
    } else if (key.z.pressed && player.position.y > 0) {
        player.velocity.y = -5
    } else if (key.s.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 5
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 800) + 500)
        console.log(randomInterval)
    }


    frames++
}

animate()

addEventListener('keydown', (e) => {
    if (game.over) return

    switch (e.key) {
        case 'q':
            //console.log('left')
            key.q.pressed = true
            break
        case 'd':
            //console.log('write')
            key.d.pressed = true
            break
        case 'z':
            key.z.pressed = true
            //console.log('up')
            break
        case 's':
            key.s.pressed = true
            //console.log('down')
            break
        case ' ':
            //console.log('space')
            key.space.pressed = true

            switch (randomWeapon) {
                case 0:
                    weaponGolderak()
                    break
                case 1:
                    weaponTsunaki()
                    break
                case 2:
                    weaponClassic()
                    break
                case 3:
                    weaponTornado()
                    break
            }

            audioBackground.play()
            console.log(randomWeapon)
            break
    }
})
addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'q':
            //console.log('left')
            key.q.pressed = false
            break
        case 'd':
            //console.log('write')
            player.velocity.x = +5
            key.d.pressed = false
            break
        case 'z':
            //console.log('up')
            break
        case 's':
            //console.log('down')
            break
        case ' ':
            //console.log('space')
            key.space.pressed = false
            break
    }
})