const screenWidth = 1000
const screenHeight = 600


// ==========================================================================

let screen
let ctx
let balls
let player
let colors
const platforms = new Set()
const clouds = new Set()
let speed = 5
let cooldown = 0

let isGameCooldown = false

// ==========================================================================

class GameObject{
    constructor(image,x,y,width, height, velocityX =0, velocityY = 0){
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y,this.width, this.height)
    }

    moving(){
        this.x += this.velocityX
        this.y += this.velocityY
    }

    showHitbox(color){
        ctx.fillStyle = color
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

// ==========================================================================
window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight
    ctx = screen.getContext('2d')

    setSprite()
    setEarlyGameObject()

    document.addEventListener('keydown', press)
    setInterval(timer, 100)
    update()
}

function update(){
    if(isGameCooldown){
        return
    }
    for (let cloud of clouds.values()) {
        if (cloud.y <= -48) {
            cloud.y = 600 + Math.floor(Math.random() * 600)
            cloud.x = 32 + Math.floor(Math.random() * 868)
        }
        
        for (let otherCloud of clouds.values()) {
            if (cloud === otherCloud) continue
            if (isColiding(cloud, otherCloud)) {
                cloud.y -= 32
                otherCloud.y += 32
                break
            }
        }
    }
    for (let platform of platforms.values()){
        if(isColiding(platform, player)){
            if(platform.color!=player.color){
                isGameCooldown = true
            }else{
                speed += 0.05
                
            }
        }
    }
    
    drawCanvas()
    requestAnimationFrame(update)
}

function timer(){
    if(isGameCooldown){
        return
    }
    if(cooldown <=0){
        random = 5+Math.floor(Math.random()*25)
        spawnPlatform()
        cooldown = random
    }else{
        cooldown--
    }
}

// ==========================================================================

function setSprite(){
    redBallImage = new Image(); redBallImage.src = "assets/redBall.png"
    greenBallImage = new Image(); greenBallImage.src = "assets/greenBall.png"
    blueBallImage = new Image(); blueBallImage.src = "assets/blueBall.png"
    cloudImage = new Image(); cloudImage.src = "assets/cloud.png"
    cloud2Image = new Image(); cloud2Image.src = "assets/cloud2.png"

    balls = [redBallImage, greenBallImage, blueBallImage]
    colors = ['red', 'blue', 'green']
}

function setEarlyGameObject(){
    
    spawnCloud(24)

    player = new GameObject(balls[0], 466,50, 32,32)
    player.color = "red"
}

function drawCanvas(){
    ctx.fillStyle = "cornFlowerBlue"
    ctx.fillRect(0,0,1000,600)

    for(cloud of clouds.values()){
        cloud.moving()
        cloud.draw()
    }

    for(platform of platforms.values()){
        platform.moving()
        platform.showHitbox(platform.color)
        
    }
    player.draw()
}

// ==========================================================================

function press(e){
    switch (e.key) {
        case 'a':
            player.image = balls[0]
            player.color = "red"
            break;
            case 's':
                player.image = balls[1]
                player.color = "green"
                break;
                case 'd':
                    player.image = balls[2]
                    player.color = "blue"
            break;
        default:
            break;
    }
}

// ==========================================================================

function spawnCloud(jumlah){
    for(i=0; i<jumlah;i++){
        yPos= 100+ Math.floor(Math.random()*600)
        xPos= 32 + Math.floor(Math.random()*868)
        cloud = new GameObject(cloud2Image, xPos,yPos, 64,64,0,-speed)
        clouds.add(cloud)
    }
}

function spawnPlatform(){
    platformColor = Math.floor(Math.random()*3)
    platform = new GameObject(0, 0, 800, 1000, 25, 0, -speed)
    platform.color = colors[platformColor]
    platforms.add(platform)
}

function isColiding(a, b, padding = 0){
    return a.x < b.x + b.width - padding &&
            a.x + a.width - padding > b.x &&
            a.y < b.y + b.height - padding &&
            a.y + a.height - padding > b.y 
}