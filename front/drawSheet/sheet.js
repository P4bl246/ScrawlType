const canva = document.getElementById("canvas");
const canva_repr = canva.getContext("2d");
canva.width = canva.offsetWidth;
canva.height = canva.offsetHeight;

const sche = document.getElementById("schema");
const sche_repr = sche.getContext("2d");
sche.width = sche.offsetWidth;
sche.height = sche.offsetHeight;

let lastX = 0;
let lastY = 0;
let first_time = true;
let track_pos=true;
let isDrawing = false;
function set_tracking(flag){track_pos = flag;}
function set_firs_time(flag){first_time = flag;}

let struct = {
 lineType: {},
 degrees:{},
 lengthRelation:{},
 gapRelation:{},
 side:{},
 vertix:{},
};
class draw{
    constructor(color, size, brushType, canvaContext){
        this.color=color;
        this.brushSize=size;
        this.brushType=brushType;
        this.canvaContext = canvaContext;
        this.pos = {};
        this.track = (coordinates)=>{
            if (!((""+coordinates.x) in this.pos)){this.pos[(""+coordinates.x)] = [];}
            this.pos[(""+coordinates.x)].push(coordinates.y);
        };
    }

    drawOnCanva(startPositionX, startPositionY, currentPositionX, currentPositionY, cornersDraw = "miter"){
        this.canvaContext.beginPath();
        this.canvaContext.moveTo(startPositionX, startPositionY);// start from last position
        this.canvaContext.lineTo(currentPositionX, currentPositionY);// draw to current position
        this.canvaContext.strokeStyle = this.color;
        this.canvaContext.lineWidth = this.brushSize;
        this.canvaContext.lineCap = this.brushType;
        this.canvaContext.lineJoin = cornersDraw; // sharp corners where lines meet
        this.canvaContext.stroke();
    }
    
    trackWhileDrawing(currentPositionX, currentPositionY){
        this.track({x:currentPositionX, y:currentPositionY});
    }
}

function getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0];
    return {
        X: touch.clientX - rect.left,
        Y: touch.clientY - rect.top
    };
}

function clearCanvas(){
    schema.drawOnCanva()
}
class lineType{
     constructor(){}

     rect(lastX, lastY, actualX, actualY, errormarginX=10, errormarginY=10){
        let horizontal = this.horizontal(lastX, actualX, errormarginX);
        let vertical = this.vertical(lastY, actualY, errormarginY);
         return {h:horizontal, v:vertical};
     }

     horizontal(lastX, actualX, errormarginX){
        let n = {flag:false, oriented:0};
        if (((actualX > lastX) && ((actualX-errormarginX) <= lastX)) || ((actualX < lastX) && ((actualX+errormarginX) >= lastX))){
            n.flag = true;
            if (actualX > lastX){n.oriented = 1;}
            else if (actualX < lastX){n.oriented = -1;}
        }
        return n;
     }

     vertical(lastY, actualY, errormarginY){
        let n = {flag:false, oriented:0};
        if (((actualY > lastY) && ((actualY-errormarginY) <= lastY)) || ((actualY < lastY) && ((actualY+errormarginY) >= lastY))){
            n.flag = true;
            if (actualY > lastY){n.oriented = 1;}
            else if (actualY < lastY){n.oriented = -1;}
        }
        return n;
     }

     diagonal(lastX, lastY, actualX, actualY){
        return  {rect:true, degree:((Math.atan2(actualX-lastX, actualY-lastY)*180)/Math.PI)};
     }

     curved(lastX, lastY, actualX, actualY, errormarginX, errormarginY){}
}
let clasification = new lineType();
class propertiesOfDraw{
    vertix(coordinates){

    }
    getRelation(origin, actual){
        let relation = {x:origin.x-actual.x, y:origin.y-actual.y, negativeX:false, negativeY:false};
        if ((relation.x & 0x80000000) !== 0) {
            relation.x = Math.abs(relation.x);
            relation.negativeX = true;
        }
        if ((relation.y & 0x80000000) !== 0) {
            relation.y = Math.abs(relation.y);
            relation.negativeY = true;
        }
        return relation;
    }
    getLenght(relation){
        return Math.hypot(relation.x, relation.y);
    }
    getMiddlePoint(origin, length){
        return {x:origin.x+(length.x/2), y:origin.y+(length.y/2)};
    }
    getSides(ReferenceOrigin, actual){
        let sides = {top:false, bottom:false, right:false, left:false};
        if (actual.y < ReferenceOrigin.y){sides.top = true;}
        else if (actual.y > ReferenceOrigin.y){sides.bottom = true;}
        if (actual.x < ReferenceOrigin.x){sides.left = true;}
        else if (actual.x > ReferenceOrigin.x){sides.right = true;}
        return sides;
    }
    
    getLinesRelation(linesArray){
        let lenghtOfeach = [];
        for (let i = 0; i < linesArray.length-1; i++){
            let relation = getRelation(linesArray[0],linesArray[i][0]);
            lenghtOfeach.push(getLenght(relation));
        }
        let middlePoints = [];
        for (let i = 0; i < linesArray.length-1; i++){
            middlePoints.push(getMiddlePoint(linesArray[i], lenghtOfeach[i]));
        }
        let sides = [];
        for (let i = 0; i < arrayLines.length-1; i++){
            for (let j = 0; j < arrayLines.length; j++){
                    sides.push(getSides(arrayLines[i], middlePoints[i]));             
            }
        }
        let lenRelation = getLenghtRelation(lenghtOfeach);
        let angleRelation = getAngleRelation(middlePoints);
            return {lenghtOfeach:lenghtOfeach, middlePoints:middlePoints, sides:sides, lenRelation:lenRelation, angleRelation:angleRelation};
    }
    
    getLenghtRelation(arrayLength){
        let relation = [];
        for (let i = 0; i < arrayLength.length-1; i++){
            relation.push(arrayLength[i+1]/arrayLength[i]);
        }
        return relation;
    }

    getAngleRelation(middlePointsArray){
        let angles = [];
        for (let i = 0; i < middlePointsArray.length-1; i++){
            let angle = getAngle(middlePointsArray[i], middlePointsArray[i+1]);
            angles.push(angle);
        }
        return angles;
    }

    getAngle(origin, actual){
        let relation = getRelation(origin, actual);
        return {angle:(Math.atan2(relation.y, relation.x)*180)/Math.PI, isNegative:{negativeX:relation.negativeX, negativeY:relation.negativeY}};
    }
}
let drawIn = new draw(document.getElementById("colorPicker").value, document.getElementById("brushSize").value, "round", canva_repr);
//start drawing
canva.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX+3;
    lastY = e.offsetY+3;
    drawIn.color = document.getElementById("colorPicker").value;
    drawIn.brushSize = document.getElementById("brushSize").value;
    drawIn.drawOnCanva(lastX, lastY, lastX, lastY); // Draw a point at the initial position
    if (track_pos){
        drawIn.trackWhileDrawing(lastX, lastY);
    }
});

canva.addEventListener("touchstart", (e)=>{
    e.preventDefault();
    const pos = getTouchPos(canva, e);
       isDrawing = true;
    lastX = pos.X+3;
    lastY = pos.Y+3;
    drawIn.color = document.getElementById("colorPicker").value;
    drawIn.brushSize = document.getElementById("brushSize").value;
    drawIn.drawOnCanva(lastX, lastY, lastX, lastY); // Draw a point at the initial position
    if (track_pos){
        drawIn.trackWhileDrawing(lastX, lastY);
    }
});
let A =  [];
//Drawing
canva.addEventListener("mousemove", (e)=>{
   if (!isDrawing){return;}
   let rect_size = document.getElementById("brushSize").value;
canva_repr.fillStyle = document.getElementById("colorPicker").value;
let n = clasification.rect(lastX, lastY, e.offsetX, e.offsetY);
    console.log("", n);
    
   if (track_pos){
        if (lastX != e.offsetX || lastY != e.offsetY) {
          drawIn.trackWhileDrawing(e.offsetX, e.offsetY);
          }
    }
    drawIn.drawOnCanva(lastX, lastY, e.offsetX, e.offsetY);    
    lastX = e.offsetX;
    lastY = e.offsetY;

});

canva.addEventListener("touchmove", (e) => {
    if (!isDrawing){return;}
    e.preventDefault();
    const pos = getTouchPos(canva, e);

   let rect_size = document.getElementById("brushSize").value;
canva_repr.fillStyle = document.getElementById("colorPicker").value;
   if (track_pos){
        if (lastX != pos.X || lastY != pos.Y) {
          drawIn.trackWhileDrawing(pos.X, pos.Y);
          }
    }
    drawIn.drawOnCanva(lastX, lastY, pos.X, pos.Y);    

    lastX = pos.X;
    lastY = pos.Y;
});

//stop drawing
canva.addEventListener("mouseup", () => {
   isDrawing = false;
console.log("X: ",drawIn.pos);
for (i = 0; i < drawIn.posX.length-1; i++){
    schema.drawOnCanva(drawIn.pos.x[i], drawIn.posY[i], drawIn.posX[i+1], drawIn.posY[i+1]); 
   }
   schema.drawOnCanva(drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1], drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1]);
});

let schema = new draw(document.getElementById("colorPicker").value, 2, "square", sche_repr);

canva.addEventListener("mouseleave", () => {
   isDrawing = false;
   for (i = 0; i < drawIn.posX.length-1; i++){
    schema.drawOnCanva(drawIn.posX[i], drawIn.posY[i], drawIn.posX[i+1], drawIn.posY[i+1]); 
   }
   schema.drawOnCanva(drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1], drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1]);

});

canva.addEventListener("touchend", () => {
   isDrawing = false;
   for (i = 0; i < drawIn.posX.length-1; i++){
    schema.drawOnCanva(drawIn.posX[i], drawIn.posY[i], drawIn.posX[i+1], drawIn.posY[i+1]);
    }
    schema.drawOnCanva(drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1], drawIn.posX[drawIn.posX.length-1], drawIn.posY[drawIn.posY.length-1]); 
    
});

