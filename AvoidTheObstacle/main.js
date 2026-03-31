const screenWidth = 1000
const screenHeight = 600

let screen
let ctx
let lastRender = 0

let gameState = {
    timer : 0,
    isPaused:false,
    isOver:false
}

let player
const obstacles = new Set()
const roads =  new Set()

window.onload = function(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight

    ctx = screen.getContext('2d')

    start()
    getSprite()
    setEarlyGameObject()


    update()
    setInterval(timer, 1000)
    document.addEventListener('keydown', press)
    document.addEventListener('keyup', release)
}

function start(){

}

function update(timeStamp){
    if(gameState.isOver || gameState.isPaused){
        return
    }
    const timeDelta = timeStamp - lastRender
    lastRender = timeStamp

    for(road of roads.values()){
        road.move()
        if(road.y >= 600){
            roads.delete(road)
            road = new GameObject(roadImage, 200, -600,600,600, 0, 4)
            roads.add(road)
        }
    }
    for(obstacle of obstacles.values()){
       obstacle.move()
       if(isColide(player, obstacle, 64, 32)){
           gameState.isOver = true
           document.getElementById('gameoverMenu').style.display = "flex"
       }
    }
    player.move()


    drawCanvas()
    requestAnimationFrame(update)
}

function timer(){
    if(gameState.isOver || gameState.isPaused){
        return
    }
    gameState.timer++
    spawnObstacle()
}

function getSprite(){
    playerCarImage = new Image; playerCarImage.src = "assets/playerCar.png";

    roadImage = new Image; roadImage.src = "assets/road.png";
    brokenRoadImage = new Image; brokenRoadImage.src = "assets/brokenRoad.png";
    coneImage = new Image; coneImage.src = "assets/cone.png";

    blueCarImage = new Image; blueCarImage.src = "assets/blueCar.png";
    redCarImage = new Image; redCarImage.src = "assets/redCar.png";
    greenCarImage = new Image; greenCarImage.src = "assets/greenCar.png";
    purpleCarImage = new Image; purpleCarImage.src = "assets/purpleCar.png";
}

function setEarlyGameObject(){
    player = new GameObject(playerCarImage, 310, 400, 128, 128)
    for(i=0;i<=2;i++){
        road = new GameObject(roadImage, 200, 0-600*i,600,600, 0, 4)
        roads.add(road)
    }
}   

function spawnObstacle(){
    xPos = Math.floor(Math.random()*4)
    object = Math.floor(Math.random()*3)
    
    if(object == 1){
        obstacle = new GameObject(brokenRoadImage, 342 + 86*xPos, -128, 64,64,0,4)
    }else if(object == 2){
        obstacle = new GameObject(coneImage, 342 + 86*xPos, -128, 64,64,0,4)
    }else{
        color = Math.floor(Math.random()*4)

        if(color == 1){
            obstacle = new GameObject(redCarImage, 308 + 86*xPos, -128, 128,128,0,7)
        }
        else if(color == 2){
            obstacle = new GameObject(blueCarImage, 308 + 86*xPos, -128, 128,128,0,7)
        }
        else if(color == 3){
            obstacle = new GameObject(greenCarImage, 308 + 86*xPos, -128, 128,128,0,7)
        }
        else if(color == 4){
            obstacle = new GameObject(purpleCarImage, 308 + 86*xPos, -128, 128,128,0,7)
        }
    }

    obstacles.add(obstacle)

}

function press(e){
    if(e.key == 'd'||e.key == 'ArrowRight'){player.velocityX = 3.4}
    if(e.key == 'a'||e.key == 'ArrowLeft'){player.velocityX = -3.4}
    if(e.key == "Escape"){if(gameState.isPaused){gameState.isPaused = false; update()}else{gameState.isPaused = true}}
}
function release(e){
    if(e.key == 'd'||e.key == 'ArrowRight'){player.velocityX = 0}
    if(e.key == 'a'||e.key == 'ArrowLeft'){player.velocityX = 0}
}

function isColide(a,b,paddingX = 0, paddingY = 0){
    return a.x < b.x + b.width - paddingX &&
            a.x + a.width - paddingX > b.x &&
            a.y < b.y + b.height - paddingY &&
            a.y + a.height - paddingY > b.y
}
function showTimer(){

    second = gameState.timer%60
    minute = Math.floor(gameState.timer/60)

    if(minute <10){
        minute = "0"+minute
    }

    if(second <10){
        second = "0"+second
    }

    ctx.fillStyle = "white"
    ctx.font = "40px Arial"
    ctx.textAlign = "left"
    ctx.fillText(minute+":"+second, 10, 40)
}

function drawCanvas(){
    ctx.fillStyle = "green"
    ctx.fillRect(0,0,1000,600)

    for(road of roads.values()){
        road.draw()
    }
    for(obstacle of obstacles.values()){
        obstacle.draw()
    }
    showTimer()
    player.draw()
}

class GameObject{
    constructor(image,x,y,width,height,velocityX=0, velocityY=0){
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

    move(){
        this.x += this.velocityX
        this.y += this.velocityY
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}