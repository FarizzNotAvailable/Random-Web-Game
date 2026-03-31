const screenWidth = 1000
const screenHeight = 600

let screen
let context
let spawnCooldown = 30

let gameState = {
    baloonPopped :0
}

class GameObject{
    constructor(image, x,y, width, height, velocityX = 0, velocityY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY


    }
    draw(){
        context.drawImage(this.image, this.x,this.y,this.width,this.height)
    }

}

const baloons = new Set()

window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight
    context = screen.getContext('2d')

    screen.addEventListener('mousedown', click)
    setSprite()
    spawnDummy()
    setInterval(timer, 100)
}

function timer(){
    context.fillStyle = "gray"
    context.fillRect(0,0,1000,600)
    for(baloon of baloons.values()){
        baloon.draw()
        baloon.timer--
        if(baloon.timer == 0){
            baloons.delete(baloon)
        }
    }
    showScore()

    spawnCooldown--
    if(spawnCooldown <= 0){
        spawnDummy()
        spawnCooldown = Math.floor(Math.random()*20)
    }
}

function setSprite(){
    baloonImage = new Image(); baloonImage.src = "assets/baloon.png"
    explodeImage = new Image(); explodeImage.src = "assets/explode.png"
}
function spawnDummy(){
    xPos = Math.floor(Math.random()*936)
    yPos = Math.floor(Math.random()*536)

    baloon = new GameObject(baloonImage, xPos,yPos, 64,64)
    baloon.timer = 10
    baloons.add(baloon)

    // baloon = new GameObject(baloonImage, 0,0, 64,64)
    // baloons.add(baloon)
    // baloon = new GameObject(baloonImage, 936,536, 64,64)
    // baloons.add(baloon)
}

function click(e){
    mousePos = clickPos(e.clientX, e.clientY, window.innerWidth, window.innerHeight)
    for(baloon of baloons.values()){
        if(isClicked(mousePos, baloon)){
            baloons.delete(baloon)
            gameState.baloonPopped++
        }
    }
}
function isClicked(m, b, padding){
    return m.x < b.x + b.height &&
            m.x  > b.x &&
            m.y < b.y + b.height &&
            m.y > b.y
}

function showScore(){
    context.font = "40px Arial"
    context.fillStyle = "white"
    context.alignText = "center"
    context.fillText(gameState.baloonPopped,500,40)
}

function clickPos(x,y,width,height){
    x = x- (width - screenWidth)/2
    y = y- (height - screenHeight)/2
    return {
        x:x,
        y:y
    }
}


