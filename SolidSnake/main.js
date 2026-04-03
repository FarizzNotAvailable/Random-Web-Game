const tileWidth = 64
const tileRow = 10
const tileColumn = 10

let screen
let ctx
let gameCondition = {
    isGameOver:false
}

let fps = 4

let vX = 0
let vY = 0

let snakeHead = [2,5]
let snakeBody = []

let apple;

window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = tileWidth * tileColumn
    screen.height = tileWidth * tileRow
    ctx = screen.getContext('2d')

    spawnApple()
    setInterval(update, 1000/fps)
    document.addEventListener('keydown', press)
}

function update(){
    if(gameCondition.isGameOver){
        return
    }
    moving()
    drawCanvas()
}

// ====================================================================================

function setObject(){
    
}

function drawCanvas(){
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,screen.width, screen.height)
    ctx.fillStyle = 'green'
    ctx.fillRect(snakeHead[0]*tileWidth,snakeHead[1]*tileWidth,tileWidth,tileWidth)
    ctx.fillStyle = 'red'
    ctx.fillRect(apple[0] * tileWidth,apple[1] * tileWidth,tileWidth,tileWidth)
    ctx.fillStyle = 'green'
    for(i=0; i<=snakeBody.length-1;i++){
        ctx.fillRect(snakeBody[i][0]*tileWidth,snakeBody[i][1]*tileWidth,tileWidth,tileWidth)
        console.log(i+":"+snakeBody[i])
    }
}

// ====================================================================================

function spawnApple(){
    x = Math.floor(Math.random()*10)
    y = Math.floor(Math.random()*10) 

    for(i = 0; i<snakeBody.length;i++){
        if(x == snakeBody[i][0] && y == snakeBody[i][1]){
            spawnApple()
        }
    }
    if(x == snakeHead[0] && y == snakeHead[1]){
        spawnApple()
    }else{
        apple = [x ,y]
    }
}

function moving(){
    for(i=snakeBody.length-1;i>0;i--){
        snakeBody[i] = snakeBody[i-1]
    }
    if(snakeBody.length){
        snakeBody[0] = [snakeHead[0], snakeHead[1]]
    }
    snakeHead[0] += vX
    snakeHead[1] += vY

    for(i=0; i<=snakeBody.length-1;i++){
        if(checkCollision(snakeHead, snakeBody[i])){
            gameCondition.isGameOver = true
            document.getElementById('gameOver').style.display = 'block'
            break
        }
    }

    if(checkCollision(snakeHead, apple)){
        snakeBody.push([apple[0], apple[1]])
        spawnApple()
    }
    if(snakeHead[0] < 0){
        snakeHead[0] = 10
    }
    if(snakeHead[0] > 10){
        snakeHead[0] = 0
    }
    if(snakeHead[1] < 0){
        snakeHead[1] = 10
    }
    if(snakeHead[1] > 10){
        snakeHead[1] = 0
    }
}

function press(e){
    if(e.key == "ArrowLeft"){
        if(vX == 0){
            vX = -1
            vY = 0
        }
    }
    if(e.key == "ArrowUp"){
        if(vY == 0){
            vX = 0
            vY = -1
        }
    }
    if(e.key == "ArrowDown"){
        if(vY == 0){
            vX = 0
            vY = 1
        }
    }
    if(e.key == "ArrowRight"){
        if(vX == 0){
            vX = 1
            vY = 0
        }
    }
}

function checkCollision(a,b){
    return a[0]==b[0] && a[1] == b[1]
}