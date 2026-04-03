const screenWidth = 600
const screenHeight = 600

let screen
let ctx
let lastRender = performance.now()

let paddle
let ball
const blocks = new Set()

let gameCondition = {
    isGameStart : false,
    isGameOver : false,
}

// =====================================================================

let blockPlacement = [
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    "BBBBBBBBBBBBBBBBBBBB",
    // "IIIIIIIIIBIIIIIIIIII",
               // 
]

class GameObject{
    constructor(image, x,y,width,height, vX = 0, vY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vX = vX
        this.vY = vY
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    moving(deltaTime){
        this.x += this.vX * deltaTime
        this.y += this.vY * deltaTime
    }
}

// =====================================================================

window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight
    ctx = screen.getContext('2d')

    setSprite()
    setEarlyGameObject()
    update(performance.now())
    document.addEventListener('keydown', press)
    document.addEventListener('keyup', release)
}

function update(timestamp){
    if(gameCondition.isGameOver || gameCondition.isGamePause){
        document.getElementById('restartUi').style.display = 'block'
        return
    }
    const deltaTime = timestamp - lastRender
    lastRender = timestamp

    paddle.moving(deltaTime)
    ball.moving(deltaTime)

    for(let block of blocks.values()){
        if(isCollide(ball, block, 2)){
            if(block.color != 'darkgray'){
                blocks.delete(block)
            }
            let dir = bounceDirection(ball, block)
            if(dir.x1Pos == "kiri"){
                if(ball.vX > -0.2){
                    ball.vX += -0.1
                }
            }
            if(dir.x1Pos == "kanan"){
                if(ball.vX < 0.2){
                    ball.vX += 0.1
                }
            }
            if(dir.y1Pos == "bawah"){
                ball.vY = 0.4
            }
            if(dir.y1Pos == "atas"){
                ball.vY = -0.4
            }
        }
    }
    if(isCollide(ball, paddle, 3)){
        ball.vY = -ball.vY
        let dir = bounceDirection(ball, paddle)
        if(dir.x1Pos == "kiri"){
            if(ball.vX > -0.2){
                ball.vX += -0.1
            }
        }
        if(dir.x1Pos == "kanan"){
            if(ball.vX < 0.2){
                ball.vX += 0.1
            }
        }
    }
    if(ball.x <= 0){
        ball.vX = -ball.vX
    }
    if(ball.x >=584){
        ball.vX = -ball.vX
    }
    if(ball.y <= 0){
        ball.vY = -ball.vY
    }
    if(ball.y >= 600){
        gameCondition.isGameOver = true
    }

    drawCanvas()
    requestAnimationFrame(update)
}

// =====================================================================

function setSprite(){
    ballImage = new Image(); ballImage.src = "assets/ball.png"
    paddleImage = new Image(); paddleImage.src = "assets/paddle.png"
}

function setEarlyGameObject(){
    blocks.clear()

    paddle = new GameObject(paddleImage, 268,500,64,9)
    ball = new GameObject(ballImage, 292,480,16,16)
    for(r = 0; r < 20; r++){
        for(c = 0; c<blockPlacement.length; c++){
            let row = blockPlacement[c]
            let char = row[r]

            x = r * 30
            y = c * 30
            if(char == "B"){
                block = new GameObject(0,x+1,y+1,28,28)
                block.color = 'gray'
            }else if(char == "I"){
                block = new GameObject(0,x+1,y+1,28,28)
                block.color = 'darkgray'
            }
            blocks.add(block)
        }
    }
    
}

function drawCanvas(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,screenWidth, screenHeight)
    paddle.draw()
    ball.draw()
    for(block of blocks.values()){
        ctx.fillStyle = block.color
        ctx.fillRect(block.x, block.y, block.width, block.height)
    }
}

// =====================================================================
function press(e){
    if(e.key == "ArrowLeft"){
        paddle.vX = -0.4
    }
    if(e.key == "ArrowRight"){
        paddle.vX = 0.4
    }
    if(!gameCondition.isGameStart && e.key){
        ball.vY = -0.4
        gameCondition.isGameStart = true
    }
}
function release(e){
    if(e.key == "ArrowLeft"){
        paddle.vX = 0
    }
    if(e.key == "ArrowRight"){
        paddle.vX = 0
    }
}

function isCollide(a,b,padding = 0){
    return a.x < b.x + b.width - padding &&
            a.x + a.width - padding > b.x &&
            a.y + a.height - padding > b.y &&
            a.y < b.y + b.height - padding
}
function bounceDirection(a, b){
    let x1 = a.x + a.width/2
    let x2 = b.x + b.width/2
    let y1 = a.y + a.height/2
    let y2 = b.y + b.height/2

    if(x1<x2){
        x1Pos = "kiri"
    }else{
        x1Pos = "kanan"
    }
    if(y1<y2){
        y1Pos = "atas"
    }else{
        y1Pos = "bawah"
    }

    return {
        x1Pos, y1Pos
    }
}
// =====================================================================
function restart(){
    gameCondition.isGameOver = false
    gameCondition.isGameStart = false
    start()
    document.getElementById('restartUi').style.display = 'none'
}