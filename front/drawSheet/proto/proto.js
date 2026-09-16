import { PropertiesOfALine } from "./lines.js";
import { DrawOn } from "./screen.js"
import { getCanvaInfo } from "./eventListener";
import { SlopesArr } from "./arrayManager.js";

var canva = getCanvaInfo("canva", "2d");

var lineProptis = new PropertiesOfALine();

var RawDataStore = new SlopesArr();

var buffer = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const eventsBody=()=>{
    let x0=0, y0=0, y1=0, x1=0, dx=0, dy=0;
    let p=0, y=0, x=0, dx2=0, dy2=0;
    
    for(let i = 0;i<buffer.length;i+=2){
        x0=buffer[i];
        y0=buffer[i+1];
        x1=buffer[i+2];
        y1=buffer[i+3];
        dx= Math.abs(x1,x0);
        dy= Math.ab(y1,y0);
        y = y0;
        x=x0;
       p=(2*dy)-dx;
        
        for(let j = 0;j<dx;j++){
                lineProptis.slope(x, y0, x0+j, y);
                RawDataStore.insert(slope, x, x0+j);
            y0=y;
            if(p>= 0){
                y+=1;
                p= p-(2*dx);
            }
            p = p + (2*dy);
            x=x0+j;
        }

        
    }
};

addEventListener('mousedown', (e)=>{});
addEventListener('mousemove', (e)=>{});
addEventListener('mouseup', (e)=>{});
addEventListener('mouseleave' (e)=>{});