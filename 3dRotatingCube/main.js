const screenWidth = 600
const screenHeight = 600
const fps = 60

let dz = 0.8
let angle = 0
let rotateSpeed = 0.4

let screen = document.getElementById('screen')
screen.width = screenWidth
screen.height = screenHeight
let ctx

ctx = screen.getContext('2d')

const vs =[
    {x: 0.25, y:0.25, z:0.25},
    {x: -0.25, y:0.25, z:0.25},
    {x: -0.25, y:-0.25, z:0.25},
    {x: 0.25, y:-0.25, z:0.25},

    {x: 0.25, y:0.25, z:-0.25},
    {x: -0.25, y:0.25, z:-0.25},
    {x: -0.25, y:-0.25, z:-0.25},
    {x: 0.25, y:-0.25, z:-0.25},
]

const fs = [
    [0,1,2,3],
    [4,5,6,7],

    [0,4],
    [1,5],
    [2,6],
    [3,7],
]

function refreshCanvas(){
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,screen.width, screen.height)    

}
function point({x,y}){
    size = 10
    ctx.fillStyle = 'green'
    ctx.fillRect(x-size/2,y-size/2,size,size)
}
function cordinate({x,y}){
    x = screen.width/2*x + screen.width/2
    y = -screen.width/2*y + screen.width/2
    return {
        x:x,
        y:y
    }
}
function project3dLocation({x,y,z}){
    return{
        x:x/z,
        y:y/z,
    }
}
function translateZ({x,y,z},dz){
    return{
        x:x,
        y:y,
        z:z+dz
    }
}
function rotateXZ({x,y,z}, angle){
    const c = Math.cos(angle)
    const s = Math.sin(angle)

    return{
        x:x*c-z*s,
        y: y,
        z:x*s+z*c
    }
}

function line(p1,p2){
    ctx.lineWidth = 3
    ctx.strokeStyle = "green"
    ctx.beginPath()
    ctx.moveTo(p1.x,p1.y)
    ctx.lineTo(p2.x,p2.y)
    ctx.stroke()
}

function moving(){
    const dt = 1/fps
    // dz += 1*dt
    angle += rotateSpeed*Math.PI*dt
    refreshCanvas()
    // for(const v of vs){
    //     point(cordinate(project3dLocation(translateZ(rotateXZ(v,angle),dz))))
    // }
    for (const f of fs){
        for(let i = 0; i<f.length; i++){
            const a = vs[f[i]]
            const b = vs[f[(i+1)%f.length ]]
            line(
                cordinate(project3dLocation(translateZ(rotateXZ(a,angle),dz))),
                cordinate(project3dLocation(translateZ(rotateXZ(b,angle),dz)))
            )
        }
    }
}

setInterval(moving, 1000/fps)
