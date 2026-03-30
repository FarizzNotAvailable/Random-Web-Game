const screenWidth = 1000
const screenHeight = 600

let screen
let ctx
let lastRender

let gameCondition = {
    score:0,
    heart:3,
    time:0,
    isPaused:false,
    isOver:false,
}

const apples = new Set()
const hearts = new Set()
let basket
let score = 0

window.onload = function(){
    start()
    setSprite()
    setGameobject()
    update()
    timer = setInterval(timer, 1000)

    document.addEventListener('keydown', press)
    document.addEventListener('keyup', release)
}

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight

    ctx = screen.getContext('2d')
}

function timer(){
    if(gameCondition.isOver){
        return
    }
    if(gameCondition.isPaused){
        return
    }
    summonApple()
}

function update(timeStamp){
    if(gameCondition.isOver){
        return
    }
    if(gameCondition.isPaused){
        return
    }
    const timeDelta = timeStamp - lastRender
    lastRender = timeStamp
    
    moving(timeDelta)
    drawCanvas()
    requestAnimationFrame(update)
    if(gameCondition.heart <=0){
        gameCondition.isOver = true
        document.getElementById('gameoverScreen').style.display = 'flex'
    }
}

function setSprite(){
    redAppleImage = new Image() ; redAppleImage.src = "/assets/redApple.png"
    goldenAppleImage = new Image() ; goldenAppleImage.src = "/assets/goldenApple.png"
    greenAppleImage = new Image() ; greenAppleImage.src = "/assets/greenApple.png"
    rottenAppleImage = new Image() ; rottenAppleImage.src = "/assets/rottenApple.png"
    treeImage = new Image() ; treeImage.src = "/assets/tree.png"
    backgroundImage = new Image() ; backgroundImage.src = "/assets/background.png"
    basketImage = new Image() ; basketImage.src = "/assets/basket.png"
    heartImage = new Image() ; heartImage.src = "/assets/heart.png"
    emptyHeartImage = new Image() ; emptyHeartImage.src = "/assets/emptyHeart.png"
}

function setGameobject(){
    basket = new GameObject(basketImage, 500, 460, 128,128)
    setHeart()
}

function moving(timeDelta){
    if(basket.x >= 300 && basket.x <= 900){
        basket.move(timeDelta)
    }else{
        if(basket.x <= 300){
            basket.x = 300
        }else{
            basket.x = 900
        }
    }
    for(apple of apples.values()){
        apple.move()
        if(isCollide(apple, basket, 60)){
            if(apple.isRotten){
                gameCondition.heart--
                setHeart()
            }
            if(!apple.isRotten){
                gameCondition.score++
            }
            if(apple.isGold){
                gameCondition.heart++
                gameCondition.score++
                setHeart()
            }
            apples.delete(apple)
        }
        if(apple.y > 600){
            apples.delete(apple)

            if(!apple.isRotten){
                if(gameCondition.heart > 0){
                    gameCondition.heart--
                    setHeart()
                }
            }
        }
    }
}
function drawCanvas(){
    ctx.drawImage(backgroundImage, 0,0, 1000,600)
    ctx.drawImage(treeImage, -150,-150, 650,750)

    for(apple of apples.values()){
        apple.draw()
    }
    for(heart of hearts.values()){
        heart.draw()
    }
    basket.draw()
    drawScore()
}
function summonApple(){
    appleX = Math.floor(Math.random()*600)
    appleType = Math.floor(Math.random()*100)
    appleSpeed = Math.random()

    if(appleType <= 40){
        apple = new GameObject(greenAppleImage, 300+appleX,-50, 64, 64,0, 4+appleSpeed)
    }else if( appleType <= 75 ){
        apple = new GameObject(redAppleImage, 300+appleX,-50, 64, 64,0, 4+appleSpeed)
    }else if(appleType <= 90){
        apple = new GameObject(rottenAppleImage, 300+appleX,-50, 64, 64,0, 4+appleSpeed)
        apple.isRotten = true
    }else{
        apple = new GameObject(goldenAppleImage, 300+appleX,-50, 64, 64,0, 4+appleSpeed)
        apple.isGold = true
    }
    apples.add(apple)
}
function drawScore(){
    ctx.font = "30px Arial"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText(gameCondition.score, 500,30)
}
function setHeart(){
    hearts.clear()
    for(i=0; i<gameCondition.heart;i++){
        heart = new GameObject(heartImage, i*64, 0, 64, 64)
        hearts.add(heart)
    }
    for(j=gameCondition.heart+1; j<=3; j++){
        heart = new GameObject(emptyHeartImage, -64+(j*64), 0, 64, 64)
        hearts.add(heart)
    }
}

function press(e){
    if(e.key == "d" || e.key == "ArrowRight"){
        basket.velocityX = 6
    }
    if(e.key == "a" || e.key == "ArrowLeft"){
        basket.velocityX = -6
    }
    if(e.key == "Escape"){
        if(!gameCondition.isPaused){
            gameCondition.isPaused = true
        }else{
            gameCondition.isPaused = false
            update()
        }
    }
}
function release(e){
    if(e.key == "d" || e.key == "ArrowRight"){
        basket.velocityX = 0
    }
    if(e.key == "a" || e.key == "ArrowLeft"){
        basket.velocityX = 0
    }
}
function isCollide(a, b, padding = 0){
    return  a.x < b.x+b.width     &&
            a.x + a.width > b.x   &&
            a.y < b.y + b.height -padding  &&
            a.y + a.height - padding > b.y  
}

class GameObject{
    constructor(image,x,y,width,height, velocityX = 0, velocityY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY

        this.startX = x
        this.startY = y
    }

    move(timeDelta) {
        this.x += this.velocityX
        this.y += this.velocityY
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}