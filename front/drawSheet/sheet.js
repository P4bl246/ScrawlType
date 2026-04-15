const canva = document.getElementById("canvas");
const canva_repr = canva.getContext("2d");
canva.width = canva.offsetWidth;
canva.height = canva.offsetHeight;

let lastX = 0;
let lastY = 0;
let first_time = true;
let track_pos=false;
let isDrawing = false;
function set_tracking(flag){track_pos = flag;}
function set_firs_time(flag){first_time = flag;}

class draw{
    constructor(color, size, brushType, canvaContext){
        this.color=color;
        this.brushSize=size;
        this.brushType=brushType;
        this.canvaContext = canvaContext;
        this.posXPush = (x)=>{this.posX.push(x)};
        this.posYPush = (y)=>{this.posY.push(y)};
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
        this.posXPush(currentPositionX);
        this.posYPush(currentPositionY);
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

//Drawing
canva.addEventListener("mousemove", (e)=>{
   if (!isDrawing){return;}
   let rect_size = document.getElementById("brushSize").value;
canva_repr.fillStyle = document.getElementById("colorPicker").value;
   if (track_pos){
        if (lastX != e.offsetX || lastY != e.offsetY) {
          drawIn.trackWhileDrawing(e.offsetX, e.offsetY);
          }
    }
    drawIn.drawOnCanva(lastX, lastY, e.offsetX, e.offsetY);    

    lastX = e.offsetX;
    lastY = e.offsetY;

});

canva.addEventListener("touchMove", (e) => {
    if (!isDrawing){return;}
   let rect_size = document.getElementById("brushSize").value;
canva_repr.fillStyle = document.getElementById("colorPicker").value;
   if (track_pos){
        if (lastX != e.offsetX || lastY != e.offsetY) {
          drawIn.trackWhileDrawing(e.offsetX, e.offsetY);
          }
    }
    drawIn.drawOnCanva(lastX, lastY, e.offsetX, e.offsetY);    

    lastX = e.offsetX;
    lastY = e.offsetY;
});

//stop drawing
canva.addEventListener("mouseup", () => {
   isDrawing = false;
    let draws = getCanvaDraw(0, 0, canva.width, canva.height, canva_repr, pack([0, 0, 0, 255], 8),false);
console.log("coordi: ",draws);
});
canva.addEventListener("touchStart", ()=>{
       isDrawing = false;
    let draws = getCanvaDraw(0, 0, canva.width, canva.height, canva_repr, pack([0, 0, 0, 255], 8),false);
    console.log("coordi: ",draws);
});

canva.addEventListener("mouseleave", () => {
   isDrawing = false; 
});
canva.addEventListener("TouchEnd", () => {
    isDrawing= false;
})

/*
function getCanvaSchema(x, y, canva_width, canva_height, cntx, color, that_is_not, brush_size) {
    // .data gives us the raw flat Uint8ClampedArray of RGBA bytes
    let canva_data = cntx.getImageData(x, y, canva_width, canva_height).data;
    let color_array = [];
    let result = [];
    let col = 0;
    let row = 0;
    let padding_rows = brush_size-1;
    let in_padding = false;
   let last_row = [];
    // Step 4 at a time since each pixel = 4 bytes (R, G, B, A)
    for (let i = 0; i < canva_data.length; i += 4) {
        color_array.push(pack(
            [canva_data[i], canva_data[i+1], canva_data[i+2], canva_data[i+3]], 8
        ));
    }
    console.log("First 5 packed pixels:", canva_data.slice(0, 4));
      console.log("Target color you're comparing to:", color_array[0]);
    // Use for...of so 'el' is the actual packed color, not its index
    for (let el of color_array) {
        col += 1; 

      if (in_padding){
        

       continue;
      }
      padding_rows = brush_size-1;

        const matches = colorComp(el, color);

        if (that_is_not ? !matches : matches) {
         
        }


        // Move to the next row once we've passed the last column
        if (col >= canva_width) {
            row += 1;
            col = 0;
        }
    }

    return result;
}

function skip_padding(rows_to_ignore = 0, cols_to_ignore = 0, actual_col_counter = 0, row_len = 0){
    if (padding_rows != 0 && col == canva_width){padding_rows-=1}
        else if (padding_rows == 0){in_padding = false;}     

        if (col >= canva_width) {
            row += 1;
            col = 0;
        }
}

function colorComp(to_comp, for_comp){
   return to_comp === for_comp;
}

// Pack array of small values into one integer
function pack(values, bitsEach) {
    let result = 0;
    for (let i = 0; i != values.length; i++) {
        result |= values[i] << (i*bitsEach);
    }
    return result;
}

*/


