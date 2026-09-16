import {Check, abs} from "./utilities.js";
import {Error} from "./return.js";

export class SlopesArr{
    constructor(array=new Uint32Array(266)){
        this.slopes=array;
        this.enableBlocks=0;
    }
    insertRefPoint(x, y){
        array[0]=x;
        array[1]=y;
    }
    insert(slope, x0, x1){
        
    }
    get(){}
    find(){}
    setEnableBlocks(newVal){
        this.enableBlocks=newVal;
    }

}







/*
* POSIBLE USO PARA PROCESAR IMAGENES (CANVAS YA DIBUJADOS PREVIAMENTE (BITMAP))
export class DataArr{
    none = ()=>{return null;}
    do = ()=>{return 0;};   
    error = (message, err)=>{return new Error(message, err);};
    other = ()=>{return null;};
    constructor(startX, toX, startY, toY , enableCorrection=true, array=new Uint8Array(8192), maxDataToInsert = new Array(4), maxDataToLook = new Array(4),
     randomUseArr = new Array(2), randomUseArr2=new Array(4)){
       
        this.offsetX = startX;
        this.offsetY = startY;
        this.x=abs(toX-startX).value;
        this.y=abs(toY-startY).value;
        if ((array.length > 16380) || !(array instanceof Uint8Array)){
            return new Error 
            ('Error: Array length can\'t be greather than 16380 and must be an instance of Uint8Array (Array of unsigned bytes)', -1);
        }
         if(((array.length*13108)>>16)*5 !== array.length){
            return new Error 
            ('Error: Array length must be multiple of 5', -1);
         }

        const blocks=(array.length * 13108) >> 16; //array.length/5
        const maxCoordinateVal=((blocks<<1)+blocks)-1;
        if(this.x>maxCoordinateVal){
            if(enableCorrection){this.x=maxCoordinateVal;}
            else{return new Error('Error: X is greather than the max. possible value for X:'+ maxCoordinateVal,-1);}
        }
        maxCoordinateVal=maxCoordinateVal/this.x;
        if(this.y>maxCoordinateVal){
            if(enableCorrection){this.y=maxCoordinateVal;}
            else{return new Error('Error: Y is greather than the max. possible value for Y:'+ maxCoordinateVal,-2);}
        }
        this.blocksPerRow=(this.x*21846)>>16  // x/3
        this.data=array;
        this.check=randomUseArr;
        this.check[0] = this.error;
        this.check[1] = this.do;
        this.check[-1] = this.none;
        this.maxDataToInsert = maxDataToInsert;
        this.randomUseArr = randomUseArr2;
        this.maxDataToLook = maxDataToLook;
        return null;
    }

    checkDataSize=(data, offset=0)=>{
        let flag = 0;
        let j = 0;
        for(let i = 0; i < data.length; i++){    // branch 1 — loop
            if(data[i] & 0xFFFFF0000){           // branch 2 — check
                this.maxDataToInsert[j] = i + offset;
                j++;
                flag = 1;
            }
        }
        if(flag){                               // branch 3 — return
            return this.maxDataToInsert;
        }
        return {length:0};
    }

    insert(data){
        this.do=(x, y)=>{
                    this.randomUseArr[3]= ((((2+y)<<2))+y)+(2+x);
                    this.check[1]=(l)=>{return l-2;};
                    this.none = (n)=>{return n;};
                    this.check[-1]=this.none;
                    this.randomUseArr[3]= 1<<this.check[((this.randomUseArr[3]>=6)<<1)-1](this.randomUseArr[3]);
                };
            this.check[1]=this.do
            let l = 0;

            for(let i = 0; i< data.length;i+=2){
                this.randomUseArr[0]= ((this.offsetX-data[i])*21846)>>16; // ≈ floor(x/3)
                this.randomUseArr[1]= ((this.offsetY-data[i+1])*21846)>>16; // ≈ floor(y/3)
                this.randomUseArr[2]= (this.randomUseArr[1]*this.blocksPerRow) + this.randomUseArr[0];
                if(this.randomUseArr[0]>this.x || this.randomUseArr[0]< 0){continue;}
                if(this.randomUseArr[1]>this.y || this.randomUseArr[1]< 0){continue;}

                this.randomUseArr[0] = (this.randomUseArr[2]<<2)+this.randomUseArr[2]; // = blockIndex*5
                this.randomUseArr[1] = this.randomUseArr[0]+2;
                this.randomUseArr[2] = this.randomUseArr[0]+4;
                this.randomUseArr[3] = (0x00000000 | this.data[this.randomUseArr[0]]) | 
                ((0x00000000 | this.data[this.randomUseArr[0]+1])<<8);
                
                let index = (this.randomUseArr[0]*21846)>>16;  //indexStart/3
                let s = this.randomUseArr[3] !== ((index<<2)+index)+1; //((indexStart/3)*3)+1
                if (!s){this.randomUseArr[3]=((index<<2)+index)+1;} //((indexStart/3)*3)+1
                let x=this.randomUseArr[3]-data[i]; //x= 1, 0 or -1
                let y= (0x00000000 | this.data[this.randomUseArr[1]]) | 
                ((0x00000000 | this.data[this.randomUseArr[1]+1])<<8);
                let clamp = (x)=>{
                    const mask = x >> 31;     // all 1s if x<0, all 0s if x>=0
                    return x & ~mask;         // zeroes x out when negative
                    };
                
                if(!s){
                    //(((indexStart/5)-(blocksPerRow-1))*3)+1 clamped to 0
                    y = (clamp(((this.randomUseArr[0]*13108)>>16)-(this.blocksPerRow-1))*3)+1;
                }

                this.radomUseArray[3] = 
                ((data[i]===this.randomUseArr[3]) | 
                ((data[i]+1)===this.randomUseArr[3]) | 
                ((data[i]-1)===this.randomUseArr[3]))
                &
                ((data[i+1]===y) | 
                ((data[i+1]+1)===y) | 
                ((data[i+1]-1)===y));

                y=y-data[i+1];//1,0,-1                                                                                        

                
                    
                    
                this.randomUseArr[3] = this.check[((this.randomUseArr[3] === 1)<<1)-1](x,y);
                this.none = ()=>{return null;};
                this.check[-1]=this.none;
                if(randomUseArr[3] === 32){
                    if (!s){
                        let n = ((index<<2)+index)+1;
                        this.data[this.randomUseArr[0]]=n&0xFF;
                        this.data[this.randomUseArr[0]+1]=(n>>8)&0xFF;
                        n= (clamp(((this.randomUseArr[0]*13108)>>16)-(this.blocksPerRow-1))*3)+1;
                        this.data[this.randomUseArr[1]]=n&0xFF;
                        this.data[this.randomUseArr[1]+1]=(n>>8)&0xFF;
                    }
                }
                else{this.data[this.randomUseArr[2]]= this.data[this.randomUseArr[2]] | this.randomUseArr[3];}
                if (randomUseArr[3]===null | randomUseArr[3]>128){this.maxDataToInsert[l]=data[i];l++;}
            }
    }

    get(blockNum){

    }   

    find(data=this.maxDataToLook){
        let l = 0;
            this.do=(x, y)=>{
                    this.randomUseArr[3]= ((((2+y)<<2))+y)+(2+x);
                    this.check[1]=(l)=>{return l-2;};
                    this.randomUseArr[3]= 1<<this.check[((this.randomUseArr[3]>=6)<<1)-1](this.randomUseArr[3]);
                };
            this.check[1]=this.do
            this.none = (n)=>{return n;};
            this.check[-1]=this.none;

            for(let i = 0; i< data.length;i+=2){
                this.randomUseArr[0]= ((this.offsetX-data[i])*21846)>>16; // ≈ floor(x/3)
                this.randomUseArr[1]= ((this.offsetY-data[i+1])*21846)>>16; // ≈ floor(y/3)
                this.randomUseArr[2]= (this.randomUseArr[1]*this.blocksPerRow) + this.randomUseArr[0];
                if(this.randomUseArr[0]>this.x || this.randomUseArr[0]< 0){this.maxDataToLook[l]=null; l++; continue;}
                if(this.randomUseArr[1]>this.y || this.randomUseArr[1]< 0){this.maxDataToLook[l]=null; l++; continue;}
                this.randomUseArr[0] = (this.randomUseArr[2]<<2)+this.randomUseArr[2]; // = blockIndex*5
                this.randomUseArr[1] = this.randomUseArr[0]+2;
                this.randomUseArr[2] = this.randomUseArr[0]+4;
                this.randomUseArr[3] = (0 | this.data[this.randomUseArr[0]]) | 
                ((0 | this.data[this.randomUseArr[0]+1])<<8);
                
                let index = (this.randomUseArr[0]*21846)>>16; //indexStart/3
                let s = this.randomUseArr[3] !== ((index<<2)+index)+1;//((indexStart/3)*3)+1
                if (!s){this.randomUseArr[3]=((index<<2)+index)+1;}//((indexStart/3)*3)+1
                let x=this.randomUseArr[3]-data[i]; //x= 1, 0 or -1
                let y= (0x00000000 | this.data[this.randomUseArr[1]]) | 
                ((0x00000000 | this.data[this.randomUseArr[1]+1])<<8);
                let clamp = (x)=>{
                    const mask = x >> 31;      // all 1s if x<0, all 0s if x>=0
                    return x & ~mask;        // zeroes x out when negative
                    };
                
                if(!s){
                    //(((indexStart/5)-(blocksPerRow-1))*3)+1 clamped to 0
                    y = (clamp(((this.randomUseArr[0]*13108)>>16)-(this.blocksPerRow-1))*3)+1;
                }

                this.radomUseArray[3] = 
                ((data[i]===this.randomUseArr[3]) | 
                ((data[i]+1)===this.randomUseArr[3]) | 
                ((data[i]-1)===this.randomUseArr[3]))
                &
                ((data[i+1]===y) | 
                ((data[i+1]+1)===y) | 
                ((data[i+1]-1)===y));

                y=y-data[i+1];//1,0,-1                                                                                        

                
                    
                    
                this.randomUseArr[3] = this.check[((this.randomUseArr[3] === 1)<<1)-1](x,y);
                if(randomUseArr[3] === 32){if (!s){this.maxDataToLook[l]=null;}else{this.maxDataToLook[l]=this.randomUseArr[0];}}
                else if(this.data[this.randomUseArr[2]] & this.randomUseArr[3]){this.maxDataToLook[l]=this.randomUseArr[0];}
                else{this.maxDataToLook[l]=null;}
                
                l++;
            }
        this.none = ()=>{return null;};
        this.check[-1]=this.none;
        return this.maxDataToLook;
    }
   
}*/

