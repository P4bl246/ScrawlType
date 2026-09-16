export class DrawOn{
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