import {abs} from "utilities.js";
export class cordntsProperties{
    constructor(buffArr=new Uint32Array(2)){
        this.buffer=buffArr;
    }
    gapsVals(x0, y0, x1, y1){
        dX = abs(x1,x0).value;
        dY = abs(y1, y0).value;
        slope=dY/dX;
        for(let i =0;i<max;i++){
            
        }

    }
}