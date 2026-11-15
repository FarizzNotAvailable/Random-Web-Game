let screen
let ctx

let player
let camera
let delay = []
let isInAir = false

let groundObject = [
    [250, 480, 500, 60],
    [1000, 480, 500, 60],
    [1750, 480, 500, 60],
    []
]

let pause = 0

const grounds = new Set()
const solids = new Set()

window.onload = function () {
    start()

    update()

    document.addEventListener('keydown', press)
    document.addEventListener('keyup', release)
}

function start() {
    screen = document.getElementById('screen')
    resize()
    ctx = screen.getContext('2d')

    setGameObject()
}

function update() {
    if (pause > 0) {
        return
    }
    draw()
    requestAnimationFrame(update)
}

function resize() {
    screen.width = window.innerWidth
    screen.height = window.innerHeight
}

function draw() {
    resize()
    ctx.fillStyle = "cornFlowerBlue"
    ctx.fillRect(0, 0, screen.width, screen.height)
    // player.render()
    player.cameraFollow()

    player.move()
    player.gravity()

    for (solid of solids) {
        for (solid2 of solids) {
            if (solid === solid2) {
            } else {
                if (solid.type != 'solid') {
                    if (isCollide(solid, solid2)) {
                        if (solid.y < solid2.y && (solid.y > solid2.y + solid2.height / 2 || solid.y < solid2.y - solid2.height / 2)) {
                            solid.velocityY = 0
                            solid.y = solid2.y - solid.height / 2 - solid2.height / 2
                            isInAir = false
                        } else if (solid.y > solid2.y && (solid.y + solid.height / 2 > solid2.y + solid2.height / 2 || solid.y < solid2.y - solid2.height / 2)) {
                            solid.velocityY = 0
                            solid.y = solid2.y + solid.height / 2 + solid2.height / 2
                            // pause++
                        }
                    }
                    if (isCollide(solid, solid2)) {
                        if (solid.x < solid2.x && solid.y < solid2.y + solid2.height / 2 && solid.y > solid2.y - solid2.height / 2) {
                            solid.x = solid2.x - solid.width / 2 - solid2.width / 2
                        } else {
                            solid.x = solid2.x + solid.width / 2 + solid2.width / 2
                        }
                    }
                }

            }
        }
        solid.render()
    }
    // player.move()    

    for (ground of grounds.values()) {
        ground.render('green')
    }
}

class GameObject {
    constructor(image, x, y, width, height, velocityX = 0, velocityY = 0, type = 'solid') {
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.type = type
    }

    render(color = 'black') {

        const cameraOffsetX = (this.x - this.width / 2) + (window.innerWidth / 2 - camera.x)
        const cameraOffsetY = (this.y - this.height / 2) + (window.innerHeight / 2 - camera.y)

        if (this.image != '') {
            ctx.drawImage(this.image, cameraOffsetX, cameraOffsetY, this.width, this.height)
        } else {
            ctx.fillStyle = color
            ctx.fillRect(cameraOffsetX, cameraOffsetY, this.width, this.height)
        }
    }

    move() {
        this.x += player.velocityX
        this.y += player.velocityY
    }

    cameraFollow() {

        // if (delay.length > 24) {
        //     camera.x = delay[0]
        //     delay.shift()
        // } else {
        //     delay.push(this.x)
        // }
        camera.x = this.x
        camera.y = this.y
    }

    gravity() {
        this.velocityY += 0.5
    }

}

function press(e) {
    if (e.key == 'a') player.velocityX = -5
    if (e.key == 'd') player.velocityX = 5
}

function release(e) {
    if (e.key == 'a' && player.velocityX == -5) player.velocityX = 0
    if (e.key == 'd' && player.velocityX == 5) player.velocityX = 0
    if (e.key == ' ' && !isInAir) player.velocityY = -20; isInAir = true
}

function setGameObject() {
    player = new GameObject('', 450, 400, 40, 100, 0, 0, 'dynamic')
    solids.add(player)
    camera = new GameObject('', 400, 400, 300, 300)


    for (i = 0; i < groundObject.length; i++) {
        ground = new GameObject('', groundObject[i][0], groundObject[i][1], groundObject[i][2], groundObject[i][3])
        solids.add(ground)
        grounds.add(ground)
    }
}

function isCollide(a, b, padding) {

    AoffsetX = a.x - a.width / 2
    AoffsetY = a.y - a.height / 2
    BoffsetX = b.x - b.width / 2
    BoffsetY = b.y - b.height / 2

    return AoffsetX < BoffsetX + b.width &&
        AoffsetX + a.width > BoffsetX &&
        AoffsetY < BoffsetY + b.height &&
        AoffsetY + a.height > BoffsetY

}