import init, {GesturesManager} from "./pkg/samples_manager.js"

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
let isDrawing = false;
/*
let track_pos=true;
let first_time = true;
function set_tracking(flag){track_pos = flag;}
function set_firs_time(flag){first_time = flag;}
*/
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
      canva_repr.clearRect(0, 0, canva.width, canva.height);
}


let drawIn = new draw(document.getElementById("colorPicker").value, document.getElementById("brushSize").value, "round", canva_repr);
let gest_mngr = new GesturesManager(50);
//start drawing
canva.addEventListener("mousedown", (e) => {
    isDrawing = true;
    lastX = e.offsetX+3;
    lastY = e.offsetY+3;
    drawIn.color = document.getElementById("colorPicker").value;
    drawIn.brushSize = document.getElementById("brushSize").value;
    drawIn.drawOnCanva(lastX, lastY, lastX, lastY); // Draw a point at the initial position
    gest_mngr.start_gesture("");
    gest_mngr.start_stroke(lastX, lastY);
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
    gest_mngr.start_gesture("");
    gest_mngr.start_stroke(lastX, lastY);
});
//Drawing
canva.addEventListener("mousemove", (e)=>{
   if (!isDrawing){return;}
   const pos = getTouchPos(canva, e);
   let rect_size = document.getElementById("brushSize").value;
    canva_repr.fillStyle = document.getElementById("colorPicker").value;
    drawIn.drawOnCanva(lastX, lastY, pos.X, pos.Y);    
    console.log("", n);
    drawIn.drawOnCanva(lastX, lastY, pox.X, pos.Y);    
    lastX = pos.X;
    lastY = pos.Y;
    gest_mngr.add_stroke_point(lastX, lastY);
});

canva.addEventListener("touchmove", (e) => {
    if (!isDrawing){return;}
    e.preventDefault();
    const pos = getTouchPos(canva, e);
   let rect_size = document.getElementById("brushSize").value;
    canva_repr.fillStyle = document.getElementById("colorPicker").value;
    drawIn.drawOnCanva(lastX, lastY, pos.X, pos.Y);    

    lastX = pos.X;
    lastY = pos.Y;
    
    gest_mngr.add_stroke_point(lastX, lastY);
});

//stop drawing
canva.addEventListener("mouseup", () => {
   isDrawing = false;
console.log("(x,y): ",drawIn.pos);
    gest_mngr.end_stroke();
});

let schema = new draw(document.getElementById("colorPicker").value, 2, "square", sche_repr);

canva.addEventListener("mouseleave", () => {
   isDrawing = false;
   gest_mngr.stroke_end();
});

canva.addEventListener("touchend", () => {
   isDrawing = false;
   gest_mngr.stroke_end();
});

let sample_name = document.getElementById("sampleName").value;
function addSample(){
    if (sample_name == ""){return false;}
    gest_mngr.end_gesture();
    gest_mngr.add_gesture(sample_name);
    return true;
}
canva.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // evita que aparezca el menú contextual del navegador
  let shape = gest_mngr.take_gesture();
  let result = gest_mngr.match_shape(shape);
  if(result != undefined){write_on_schema(result);}
});
let x_writte = 0;
let y_writte = 0;
function write_on_schema(text){
    sche.font = '20px Arial'; // tamaño y fuente
    sche.fillStyle = 'black'; // color del texto
    sche.fillText(text, x_writte, y_writte); // texto, x, y
}
/*
let struct = {
 lineType: {},
 degrees:{},
 lengthRelation:{},
 gapRelation:{},
 side:{},
 vertix:{},
};

let dataRaw = {
    metaInfor:[],
    coordi:[],
}*/
/*
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
        return  {rect:true, slope:Math.abs((actualY-lastY))/Math.abs((actualX-lastX))};
     }

     curved(lastX, lastY, actualX, actualY, errormarginX, errormarginY){
        let n = {flag:false, oriented:0};
        
     }
}
class propertiesOfDraw{
    
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
        return Math.trunc(Math.hypot(relation.x, relation.y));
    }
    getMiddlePoint(origin, length){
        return {x:origin.x+(length.x/2), y:origin.y+(length.y/2)};
    }
    getSide(ReferenceOrigin, actual){
        let sides = {top:false, bottom:false, right:false, left:false};
        if (actual.y < ReferenceOrigin.y){sides.top = true;}
        else if (actual.y > ReferenceOrigin.y){sides.bottom = true;}
        if (actual.x < ReferenceOrigin.x){sides.left = true;}
        else if (actual.x > ReferenceOrigin.x){sides.right = true;}
        return sides;
    }
    vertix(linesObjArray, lengthArray){
      let vertixs = [];
        for (let i = 0; i < linesObjArray.length-1; i++){
            
            for(let j = i+1; j < linesObjArray.length-1; j++){
                let n = {l1:[linesObjArray.coordi[i], linesObjArray.coordi[i][0]], l2:[linesObjArray.coordi[j], linesObjArray.coordi[j][0]]};
                let d = {flag1:false, m1:0, flag2:false, m2:0};
                if (linesObjArray.metaInfo[i].h){
                    n.l1[1]= n.l1[1]+lengthArray[i];
                }
                if (linesObjArray.metaInfo[i].v){
                    n.l1[0]= n.l1[0]+lengthArray[i];
                }
                if (linesObjArray.metaInfor[i].diagonal.flag){
                  d.flag1 = true;
                  d.m1 = linesObjArray.metaInfor[i].diagonal.slope;     
                }
                if (linesObjArray.metaInfo[j].h){
                    n.l2[1]= n.l2[1]+lengthArray[j];
                }
                if (linesObjArray.metaInfo[j].v){
                    n.l2[0]= n.l2[0]+lengthArray[j];
                }
                if (linesObjArray.metaInfor[j].diagonal.flag){
                  d.flag2 = true;
                  d.m2 = linesObjArray.metaInfor[j].diagonal.slope;     
                }

                if (d.flag == false){
                    if (n.h){
                        if ((n.l2[1] <= n.l1[1] && n.l2[1] >= n.l1[1]-lengthArray[i]) && (n.l1[0] <= n.l2[0] && n.l2[0] >= n.l1[1]-lengthArray[i])){
                    }
                }
            }
        }
        return vertixs;
    }
    }
    getLinesRelation(linesArray){
        let lens = [];
        for (let i = 0; i < linesArray.length-1; i++){
            let relation = getRelation(linesArray[i],linesArray[i][0]);
            lens.push(getLenght(relation));
        }
        let middlePoints = [];
        for (let i = 0; i < linesArray.length-1; i++){
            middlePoints.push(getMiddlePoint(linesArray[i], lens[i]));
        }
        let sides = [];
        for (let i = 0; i < arrayLines.length-1; i++){
            let n = [];
            for (let j = 0; j < arrayLines.length; j++){
                    n.push(getSides(arrayLines[i], middlePoints[i]));             
            }
            sides.push(n);
        }
        let lenRelation = getLenghtRelation(lens);
        let angleRelation = getAngleRelation(middlePoints);
            return {lens:lens, middlePoints:middlePoints, sides:sides, lenRelation:lenRelation, angleRelation:angleRelation};
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
        for (let i = 1; i < middlePointsArray.length-1; i++){
            let angle = getAngle(middlePointsArray[0], middlePointsArray[i]);
            angles.push(angle);
        }
        return angles;
    }

    getAngle(origin, actual){
        let relation = getRelation(origin, actual);
        return {angle:(Math.atan2(relation.y, relation.x)*180)/Math.PI, isNegative:{negativeX:relation.negativeX, negativeY:relation.negativeY}};
    }
  
}     
     */