const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

let lastUpdate = performance.now()
let screen
let ctx
let objectSettings = {
    mass:0,
    speedX:0,
    speedY:0,
    size:32,
    color:4
}
let colors
let mousePos = { x:0, y:0}

const gravity = 0.98
const G = 6.674 * 10**-11
// =================================================================================
// Catatan sementara
// 1 px = 1 meter
// 0.1 = 1 meter/detik
// 
// 
// 
// 
// 
// =================================================================================

const objects = new Set()

class GameObject{
    constructor(image, x, y,width,height,mass = 0, velocityX = 0, velocityY = 0 ){
        this.image = image
        this.x = x
        this.y = y
        this.mass = mass
        this.width = width
        this.height = height
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    draw(){
        ctx.drawImage(this.image, this.x - this.width/2, this.y - this.height/2, this.width, this.height)
    }
    move(timeDelta){
        this.x += this.velocityX * (timeDelta/100)
        this.y += this.velocityY * (timeDelta/100)
    }
    acceleration(x,y,x2,y2, m){
        // m = kg
        let rx =  x2 - x
        let ry =  y2 - y

        let r = Math.sqrt(rx*rx + ry*ry)
        r = Math.max(r, 1.0)
        // console.log(r)


        let force = G * m/(r*r)
        // console.log(force)
        let gx = force *(rx/r)
        let gy = force *(ry/r)        

        this.velocityX += gx
        this.velocityY += gy
    }
    // earthGravity(){
    //     this.velocityY += gravity
    // }
}

// =================================================================================
window.onload = start()

function start(){
    screen = document.getElementById('screen')
    screen.width = screenWidth
    screen.height = screenHeight
    ctx = screen.getContext('2d')

    setSprite()
    setGameObject()
    update()
    document.addEventListener('keydown', press)
    document.addEventListener('mousemove', cursor)
}

function update(){
    const now = performance.now()
    const deltaTime = now - lastUpdate
    lastUpdate = now

    for(object of objects.values()){
        object.move(deltaTime)
        for(otherObject of objects.values()){
            if(object === otherObject) continue;
                object.acceleration(object.x, object.y, otherObject.x, otherObject.y, otherObject.mass)
        }
    }


    drawCanvas()
    requestAnimationFrame(update)
}
// =================================================================================
function setSprite(){
    blueObjectImage = new Image(); blueObjectImage.src = "assets/blueObject.png"
    grayObjectImage = new Image(); grayObjectImage.src = "assets/grayObject.png"
    greenObjectImage = new Image(); greenObjectImage.src = "assets/greenObject.png"
    pinkObjectImage = new Image(); pinkObjectImage.src = "assets/pinkObject.png"
    purpleObjectImage = new Image(); purpleObjectImage.src = "assets/purpleObject.png"
    redObjectImage = new Image(); redObjectImage.src = "assets/redObject.png"
    yellowObjectImage = new Image(); yellowObjectImage.src = "assets/yellowObject.png"

    colors = [redObjectImage, blueObjectImage, greenObjectImage, grayObjectImage, yellowObjectImage, pinkObjectImage, purpleObjectImage]
}
function setGameObject(){
    object = new GameObject(greenObjectImage,200,300,32,32, 5.9722 * 10 **10,-1,4);
    objects.add(object)
    object = new GameObject(grayObjectImage,230,300,8,8, 7.3477 * 10 **8, -1,4.9);
    objects.add(object)
    object = new GameObject(yellowObjectImage,600,500,64,64, 1.989 * 10**13);
    objects.add(object)
}
function drawCanvas(){
    ctx.fillStyle = 'midnightBlue'
    ctx.fillRect(0,0,screenWidth, screenHeight)
    for(object of objects.values()){
        object.draw()
    }
}
// =================================================================================
function isCollide(a, b){
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const sumOfRadii = (a.width/2) + (b.width/2);
    
    return (dx * dx + dy * dy) < (sumOfRadii * sumOfRadii);
}

function press(e){
    if(e.key == " "){
        object = new GameObject(colors[objectSettings.color-1 ],mousePos.x ,mousePos.y,objectSettings.size,objectSettings.size, objectSettings.mass,objectSettings.speedX, objectSettings.speedY);
        objects.add(object)
    }
}
function cursor(e){
    mousePos.x = e.clientX
    mousePos.y = e.clientY
}
// =================================================================================

function toggleSetting(){
    if(document.getElementById('ui').style.display != 'block'){
        document.getElementById('ui').style.display = 'block'
    }else{
        document.getElementById('ui').style.display = 'none'
    }
}
function takeValue(){
    
    objectSettings.mass = Number(document.getElementById('mass').value * 1000)
    objectSettings.speedX = Number(document.getElementById('xSpeed').value / 10)
    objectSettings.speedY = Number(document.getElementById('ySpeed').value / 10)
    objectSettings.size = Number(document.getElementById('size').value)
    objectSettings.color = Number(document.getElementById('color').value)
}
function clearAll(){
    objects.clear()
}