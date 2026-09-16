
export function getCanvaInfo(id=null, ctx=null){
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext(ctx);
    return {canvas, ctx};
}

export class brushPos{

    /**
     * @name constructor
     * Initializes the mousePos class with default values for function enablement, length correction, index correction, and return array.
     * @param {Array} n1 - An array to store default values at least of 4 elements.
     * @param {Array} n2 - An array to store default values at least of 4 elements.
     * @param {Array} n3 - An array to store default values at least of 4 elements.
     * @param {Array} n4 - An array to store default values at least of 2 elements.
     * @param {Array} retArray - An array to store the results of the called position functions, at least of 4 elements.
     * The constructor initializes the arrays with default values and sets up the function array for get the position mouse.
     * The arrays will be set the first 4 indexes to 0 (starting at index 0) except the retArray.
     */
    constructor(n1=new Array(4), n2=new Array(4), n3=new Array(4), n4=new Array(2), retArray=new Array(4)){
        this.functionEnable = n1;
        this.functionEnable.fill(0, 0, 4);
        this.lengthCorrection = n2;
        this.lengthCorrection.fill(0, 0, 4);
        this.lengthCorrection[-1] = 1;
        this.indexCorrection = n3;
        this.indexCorrection.fill(0,0,4);
        this.indexCorrection[-1] = 0; 
        this.lengthfix = n4;
        this.lengthfix[0] = 0;
        this.lengthfix[1] = 1;
        this.retArray = retArray;
        this.none = () => null;
        this.funcArr = [this.none,this.getOffsetPos, this.getPagePos, this.getClientPos, this.getScreenPos];
        this.mainObj = {x: 0, y: 0};
    }

     getOffsetPos = (evt) => {
        this.mainObj.x = evt.offsetX;
        this.mainObj.y = evt.offsetY;
        return this.mainObj;
    }

     getPagePos = (evt) => {
        this.mainObj.x = evt.pageX;
        this.mainObj.y = evt.pageY;
        return this.mainObj;
    }

     getClientPos = (evt) => {
        this.mainObj.x = evt.clientX;
        this.mainObj.y = evt.clientY;
        return this.mainObj;
    }

     getScreenPos = (evt) => {
        this.mainObj.x = evt.screenX;
        this.mainObj.y = evt.screenY;
        return this.mainObj;
    }
    /**
     * @name getPos
     * Calls the appropriate functions based on the provided bitmask and returns an array of results.
     * @param {object} evt - The event object from the event listener.
     * @param {BinaryType} from - A bitmask that determines which position functions to call.
     * The bitmask can be a combination of the following values:
     * 0b0001 (1) - Call getOffsetPos
     * 0b0010 (2) - Call getPagePos
     * 0b0100 (4) - Call getClientPos
     * 0b1000 (8) - Call getScreenPos
     * - The bitmask can be combined to call multiple functions.
     * @param {number} offset - An offset value to adjust the index of the returned array.
     * - This is useful when you provide the return array to the class and you want to write the results since an especific 
     * index in the array, for example if you want to write the results since the 4th index of the array, you can set offset=4.
     * @param {boolean} enableLengthCorrection - A flag to enable or disable length correction for the returned array.
     * This is useful when you want to ensure that the returned array has a specific length based on the number of functions called
     * because the array length could change while add function-called outputs because if you dont ensure the total mount of slots
     * in the array equivalent to the number of functions called.
     * @returns {Array} - An array containing the results of the called position functions.
     * - The array will have a length based on the number of functions called and the length correction applied.
     * - The array will have the values in order of function calling packing this in a tight way (without leaving empty slots in the array).
     * - The funcitons which wasn't called will be discarded and the array will be packed with the useful data, without touching 
     *   other indexes, for example if you just call the 2 function this will be in the 1st position on the array (index 0)
     *   and the others indexes will be not touched (stays equal).
     * - Theres is a discard slot in the array which is the -1 index, this is used to store the values of the functions which wasn't called,
     *   this is used to avoid leaving useless data (like null) in the array and to avoid touching the other indexes of the array.
     * @throws {Error} - An error when the array havent enough space to store the function-called outputs.
     */
    getPos(evt, from, offset=0, enableLengthCorrection=false){
        // from is a bitmask that determines which functions to call
        // 0 = none (this one returns null),1 = getOffsetPos, 2 = getPagePos, 3 = getClientPos, 4 = getScreenPos
        // 0b0001 = 1, 0b0010 = 2, 0b0100 = 4, 0b1000 = 8
        this.functionEnable[0] = from & 0x01; // 0b0001 (index 1)
        this.functionEnable[1] = from & 0x02; // 0b0010 (index 2)
        this.functionEnable[2] = (from & 0x04) >> 1 | (from & 0x04) >> 2; // 0b0011 (index 3) is the 3rd bit 
        this.functionEnable[3] = (from & 0x08) >> 1; // 0b0100 (index 4) is the 4th bit
        this.indexCorrection[-1] = offset;
        let r = 0;
        let indexFix = 0;
        let totalFuncs = this.functionEnable[0] + (this.functionEnable[1]>>1) + (this.functionEnable[2]>>1) + (this.functionEnable[3]>>2);
        if (offset+totalFuncs > this.retArray.length){
            throw new 
            Error("The array haven't enough space, add " + (totalFuncs-(offset-this.retArray.length))+ "more slots or dicrease the offset");
        }
        // Call the functions based on the bitmask and store the results in retArray
        const push = (index, func) => {
            // Call the function and store the result in retArray at the correct index 
            /* Proccess:
            * index = 1, offset = 4
            * 1- Calc the index + offset = 1+4 = 5
            * 2- Subtract 1 = 5-1 = 4 (this is the 0 index if we look it chunk as an array of 4 elements)
            * 3- Subtract the indexCorrection[index-1] = 4 - indexCorrection[0] = 4 - 0 = 4
            * 3.1 - If the indexCorrection[index-1] is not 0, it means that the function was not called, 
            * so we need to subtract the offset to get a negative index (-1 index) or the 'Discard Slot' index.
            * 4- Subtract the indexFix = 4 - indexFix = 4 - 0 = 4.
            * 4.1- If the indexFix is not 0, it means that previous functions was not called so we 'fix' this by subtracting the 
            * nums of function that wasn't called to pack the useful datas in a line without touching the other indexes if isn't
            * necessary.
            * 5- Store the result in retArray[4] = func(evt)
            */
            this.retArray[(((index+offset)-1)-this.indexCorrection[index-1])-indexFix] = func(evt);
            // Store the length correction for this index: 
            // 0 if the function was called, 1 if it wasn't called (to avoid increment the length 
            // when no putting data in the retArray).
            r = this.lengthCorrection[index-1];
            // Store the length correction for this index in lengthfix[0] to be used later to correct the length of retArray.
            // Used to correct the length of the retArray if is enabled, or avoid this.
            this.lengthfix[0] = r;
            // Set the length of retArray to the correct length based on the number of functions called and the length correction.
            // If the function was called and the length correction is enabled,
            // we need to add 1 to the length of retArray to account for the new data
            // 1-0 =1 (called), 1-1=0 (not called), r-r (not enable to correct the length of retArray)
            this.retArray.length += this.lengthfix[enableLengthCorrection]-r;
            // If the function was not called, we need to subtract 1 from indexFix to avoid leaving a gap in the retArray.
            indexFix -= +!(r)-1;
        };
        // Call the functions based on the bitmask and store the results in retArray
        push(this.functionEnable[0],this.funcArr[this.functionEnable[0]]);
        push(this.functionEnable[1],this.funcArr[this.functionEnable[1]]);
        push(this.functionEnable[2],this.funcArr[this.functionEnable[2]]);
        push(this.functionEnable[3],this.funcArr[this.functionEnable[3]]);

        return this.retArray;
    }

    /**
     * @name setRetArray
     * To set the array used to store and return the datas when call getPos.
     * @param {number} startIdx 
     * @param {Array} valuesArr 
     */
    setRetArray(startIdx=0, valuesArr){
        this.retArray[0+startIdx] = valuesArr[0];
        this.retArray[1+startIdx] = valuesArr[1];
        this.retArray[2+startIdx] = valuesArr[2];
        this.retArray[3+startIdx] = valuesArr[3];
    }
}
/*
export let brushPosObj = new brushPos(); 

export class mousePos{

    none = ()=>null;
    constructor(evts, enableMultiplesEvents=0){
        this.evts = Array.isArray(evts) ? evts : [evts, evts, evts, evts];
        this.multiEvts = enableMultiplesEvents;
        this.firstEvent = [0,0,0,0];
        this.flag = [1,0];
        this.funcsArr = new Array(2);
        this.funcsArr[0] = this.none;
    }
    storePos = (e, i)=>{brushPosObj.getPos(e, this.evts[i]);};
    evtFunc = (e, i)=>{this.storePos(e,i); this.firstEvent[i] = 1;};

    funcBody = (elment, evts, i, mask, shift, event)=>{
        this.evts[i] = evts ?? this.evts[i];
        this.funcsArr[1]=(evt, cb) => elment.addEventListener(evt,cb);
        this.funcsArr[((this.multiEvts & mask)>>shift) | this.flag[this.firstEvent[i]]](event, (e)=>this.evtFunc(e,i));
    }
    
     whenClick(element, evts){
        this.funcBody(element, evts, 0, 0x01,0,'click');
    }

     whenMove(element, evts){
        this.funcBody(element,evts, 1, 0x02,1, 'mousemove');
    }

     whenUp(element, evts){
        this.funcBody(element, evts, 2, 0x04,2, 'mouseup');
    }

     whenLeave(element, evts){
        this.funcBody(element, evts, 3, 0x08,3, 'mouseleave');
    }
}
export class touchPos{
    
    none = ()=>null;
    constructor(evts, enableMultiplesEvents=0){
        this.evts = Array.isArray(evts) ? evts : [evts, evts, evts];
        this.multiEvts = enableMultiplesEvents;
        this.firstEvent = [0,0,0];
        this.flag = [1,0];
        this.funcsArr = new Array(2);
        this.funcsArr[0] = this.none;
    }

    storePos = (e, i)=>{brushPosObj.getPos(e, this.evts[i]);};
    evtFunc = (e, i)=>{this.storePos(e,i); this.firstEvent[i] = 1;};
    
    funcBody = (elment, evts, i, mask, shift, event)=>{
        this.evts[i] = evts ?? this.evts[i];
        this.funcsArr[1]=(evt, cb) => elment.addEventListener(evt,cb);
        this.funcsArr[((this.multiEvts & mask)>>shift) | this.flag[this.firstEvent[i]]](event, (e)=>this.evtFunc(e,i));
    }
    
     whenClick(element, evts){
        this.funcBody(element, evts, 0, 0x01, 0, 'touchstart');
    }

     whenMove(element, evts){
        this.funcBody(element, evts, 1, 0x02, 1, 'touchmove');
    }

     whenUp(element, evts){
        this.funcBody(element, evts, 2, 0x04, 2, 'touchend');
    }
}
*/