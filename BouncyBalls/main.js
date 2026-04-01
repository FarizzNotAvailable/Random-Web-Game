const screenWidth = 1000
const screenHeight = 600

let screen
let ctx

let ground
const balls = new Set()
let baloonColour
let colors

class GameObject{
    constructor(image, x,y,width,height, velocityX = 0, velocityY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    moving(){
        this.x += this.velocityX
        this.y += this.velocityY
    }

    gravity(){
        this.velocityY += 0.09
    }

    draw(){
        ctx.drawImage(this.image, this.x,this.y,this.width, this.height)
    }
}

// ==================================================================================================================

window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight
    ctx = screen.getContext('2d')

    setSprite()
    setEarlyGameObject()

    update()
    document.addEventListener('mousedown', click)
    document.addEventListener('keydown', press)
}

function update(){

    for(ball of balls.values()){
        if(isCollide(ball, ground)){
            ball.velocityY = -ball.velocityY + 0.09
        }
        if(ball.x < -32){
            ball.x = 1000
        }
        if(ball.x > 1000){
            ball.x = -32
        }
        if(ball.y >=536){
            ball.y = 536

        }
        for(otherBall of balls.values()){
            if(ball === otherBall) continue;
            if(isCollide(ball, otherBall, 4)){
                console.log('a');
                if(ball.x > otherBall.x){
                    ball.velocityX = 0
                    ball.velocityX += 0.31
                }
                if(ball.x < otherBall.x){
                    ball.velocityX = 0
                    ball.velocityX -= 0.31
                }
                if(ball.y > otherBall.y){
                    ball.velocityY += 0.31
                }
                if(ball.y < otherBall.y){
                    ball.velocityY -= 0.31
                }
            }
        }
    }

    drawCanvas()
    requestAnimationFrame(update)
}

// ===================================================================================================================

function setSprite(){
    redBallImage = new Image(); redBallImage.src = "assets/redBall.png"
    blueBallImage = new Image(); blueBallImage.src = "assets/blueBall.png"
    greenBallImage = new Image(); greenBallImage.src = "assets/greenBall.png"
    pinkBallImage = new Image(); pinkBallImage.src = "assets/pinkBall.png"
    purpleBallImage = new Image(); purpleBallImage.src = "assets/purpleBall.png"
    yellowBallImage = new Image(); yellowBallImage.src = "assets/yellowBall.png"

    colors = [redBallImage, blueBallImage, greenBallImage, pinkBallImage, purpleBallImage, yellowBallImage];
}

function setEarlyGameObject(){
    ground = new GameObject(0, 0, 568,1000,32)
    baloonColour = colors[0];
}   

function drawCanvas(){
    ctx.fillStyle = 'aliceBlue'
    ctx.fillRect(0,0,1000,600)
    ctx.fillStyle = "black"
    ctx.fillRect(0,568,ground.width,ground.height)
    
    for(ball of balls.values()){
        ball.gravity()
        ball.moving()
        ball.draw()
    }
}

function click(e){
    cursor = mousePos(e.clientX, e.clientY)

    spawnBalls(cursor.x-16, cursor.y-16, baloonColour)
}

function press(e){
    const key = parseInt(e.key);
    if(key >= 1 && key <= 6){
        baloonColour = colors[key - 1];
    }
}

// ==================================================================================================================

function spawnBalls(x, y, color){
    xSpeed = Math.floor(Math.random() * 4) -2

    ball = new GameObject(color, x, y, 32, 32, xSpeed)
    balls.add(ball)
}

function isCollide(a, b, padding = 0){
    return a.x  < b.x + b.width - padding   &&
            a.x + a.width - padding >  b.x  &&
            a.y < b.y + b.height - padding  &&
            a.y + a.height - padding > b.y  
}

function mousePos(x, y){
    x = x - (window.innerWidth-1000)/2
    y = y - (window.innerHeight-600)/2

    return {
        x:x,
        y:y
    }
}