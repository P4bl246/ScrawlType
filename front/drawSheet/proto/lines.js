import * as utilities from "../utilties.js";
import * as Ret from "./return.js";


// This class is to define the properties of a line, for example: the length, the type (horizontal, vertical or diagonal), etc....
export class PropertiesOfALine{
    constructor(){this.array=new Uint32Array(3);}
    /**
     * @name slope
     * The slope between two points (just take the 2 first elements in "x" and "y" array of coordinates).
     * 
     * 
     * @returns {Array} An object with 3 properties: infinity (boolean), other (natural number (absolute value)),
     *  isNegative (boolean). If the slope is infinity, then the line is vertical, if the slope is 0, 
     * then the line is horizontal, if the slope is 1, then the line is diagonal, otherwise the line is other.
     * 
     * @throws {Ret.error} Error instance with 3 properties: message (string), error (number), and isNegative (boolean). 
     * The input has empty arrays or doesn't exist the property in the object.
     */
    // We need to get the "SLOPE" because this will tell us what type of line we have, 
    // for example: if the slope is 0 with f'(x), then we have a horizontal line,
    // if the slope is 0 with f'(y) (infinity in f'(x)), then we have a vertical line, 
    // if the slope is 1 or -1, then we have a diagonal line. 
    // Thus we can use the slope to define what type of line we have.
    slope(x0, y0, x1, y1){
            // Calc deltas
            let deltaX = abs(x1, x0);
            let deltaY = abs(y1, y0);
            if (deltaY.value === 0){this.array[0]= 0;} // horizontal line because 0/any Real = 0 and f(x) = y = constant and f'(x) 
                                                     //of a constant = 0. Thus we can say that the slope is 0.

            else if (deltaX.value === 0){this.array[2]= 1;} // vertical line because any Real/0 = Infinity and f(y) = x = constant 
                                                                //and f'(y) of a constant = 0 but f'(x) of a constant is undefined, 
                                                                // thus we can say that the slope is Infinity.

            else {this.array[0] = deltaY.value/deltaX.value;} // diagonal line because the slope is not 0 or Infinity, thus
                                                            //we can say that the slope is other.
            
            // Set the isNegative property of the slope object, this will tell us if the slope is negative or positive, 
            // for example: if the slope is -1, then we have a diagonal line with a negative slope.
            this.array[1] = !(deltaX.isNegative & deltaY.isNegative);
            // Push the slope object to the slopeArr array.
        return this.array;     
    }

    /**
     * @name isHorizontal
     * A horizontal line is a set of coordinates in secuence that are in the same row, 
     * for example: (1, 6), (1, 7), (1, 8)...(horizontal line)
     * 
     * @param {Object} coordinates - An object with two arrays: x and y, each array contains the x and y coordinates of the points, 
     * for example: {x: [1, 1], y: [6, 7]} for a horizontal line.
     * 
     * @returns {Array[boolean]} true if the line is horizontal, false otherwise.
     */
    // A horizontal line is a set of coordinates in secuence that are in the same row, 
    // for example: (1, 6), (1, 7), (1, 8)...(horizontal line).
    isHorizontal(coordinates){
        let res = [];
        let slope = slope(coordinates);
        for (let i = 0; i < slope.length; i++){
            if (slope[i].other !== 0){res.push(false);}
            else{res.push(true);}
        }
        return res;
    }    

    /**
     * @name isVertical
     * A vertical line is a set of coordinates in secuence that are in the same column, 
     * for example: (1, 6), (2, 6), (3, 6)...(vertical line)
     * 
     * @param {Object} coordinates - An object with two arrays: x and y, each array contains the x and y coordinates of the points, 
     * for example: {x: [1, 2], y: [6, 6]} for a vertical line.
     * 
     * @returns {Array[boolean]} true if the line is vertical, false
     */
    // A vertical line is a set of coordinates in secuence that are in the same column, 
    // for example: (1, 6), (2, 6), (3, 6)...(vertical line)
    isVertical(coodinates){
        let res = [];
        let slope = slope(coodinates);

        for (let i = 0; i < slope.length; i++){
            if (slope[i].infinity !== true){res.push(false);}
            else{res.push(true);}
        }
        return res;
    }

    /**
     * @name isDiagonal
     * A diagonal line is a set of coordinates in secuence that are in the same diagonal, 
     * for example: (1, 6), (2, 7), (3, 8)...(diagonal rect) or (1, 6), (2, 5), (3, 4)...(diagonal inverse)
     * 
     * @param {Object} coordinates - An object with two arrays: x and y, each array contains the x and y coordinates of the points, 
     * for example: {x: [1, 2], y: [6, 7]} for a diagonal line.
     * 
     * @returns {Array[number]} - An array of numbers, where each number is 1 if the line is diagonal and
     *  -1 if the line is diagonal inverse, and 0 if the line is not diagonal.
     */
    // A diagonal line is a set of coordinates in secuence that are in the same diagonal, 
    // for example: (1, 6), (2, 7), (3, 8)...(diagonal rect) or (1, 6), (2, 5), (3, 4)...(diagonal inverse) 
    isDiagonal(coodinates){
        let res = [];
        let slope = slope(coodinates);
        for (let i = 0; i < slope.length; i++){
            if (slope[i].other === 1){
                if(slope[i].isNegative){res.push(-1)}
                else{res.push(1);}
            }
        }
          return res;
    }
    
    /**
     * @name getMagnitude
     * The magnitud of a vector (line) is the number of coordinates in secuence that are connected, 
     * for example: (1, 6), (1, 7), (1, 8)...(horizontal line) has a length of 3 
     * because there are 3 coordinates in secuence that are connected.
     * 
     * @param {Object} coordinates - An object with two arrays: x and y, each array contains the x and y coordinates of the points.
     */
    getMagnitude(coordinates){
        if (this.slope(coordinates).other === 0){return coordinates.y.length;}
         else if (this.slope(coordinates).infinity){return coordinates.x.length;}
          else if (this.slope(coordinates).other === 1 || this.slope(coordinates).other === -1)
            {return coordinates.y.length * this.slope(coordinates).other;} 
        }
    }


class lineType{
    constructor(){let n = new propertiesOfALine();}
        /*
        Define what is a "STRAIGHT LINE" and what is a "CURVED LINE" and so on, for example:

         A straight line is a set of coordinates in secuence that are in the same row or the same column, for example:
         (1, 6), (1, 7), (1, 8)...(horizontal line) or (1, 6), (2, 6), (3, 6)...(vertical line)
         A diagonal line is a set of coordinates in secuence that are in the same diagonal, for example:
         (1, 6), (2, 7), (3, 8)...(diagonal rect) or (1, 6), (2, 5), (3, 4)...(diagonal inverse)
        */
        
        //1. 
        // What is a line? A line is a set of coordinates in secuence that are connected, for example:
        // (1, 6), (2, 6), (3, 6)...(vertical line) or (1, 6), (1, 7), (1, 8)...(horizontal line) or 
        // (1, 6), (2, 7), (3, 8)...(diagonal line)

        //2.
        // What is a straight line? A straight line is a set of coordinates in secuence that are in the same row or 
        // the same column or change in a consistent manner in both directions, for example:
        // (1, 6), (1, 7), (1, 8)...(horizontal line) or (1, 6), (2, 6), (3, 6)...(vertical line) or (1, 6), (2, 7), 
        // (3, 8)...(diagonal line). Thus we have 3 types of straight lines: horizontal, vertical and diagonal.
        // Now we defined what is a straight line, and we can use this to define what is a "CURVED LINE" and make the code.

        isStraightLine(coordinates){
            let straight = {coordinate_startOrEnd: {x: 0, y: 0}, len:0, type:0}
            if (n.isHorizontal(coordinates)){
                straitght.coordinate_startOrEnd = {x: coordinates.x[0], y: coordinates.y[0]}; straight.len = n.getMagnitude(coordinates); 
                straight.type = 1;
                return {data:straight};
            }
            else if (n.isVertical(coordinates)){
                straitght.coordinate_startOrEnd = {x: coordinates.x[0], y: coordinates.y[0]}; straight.len = n.getMagnitude(coordinates); 
                straight.type = 2;
                return {data:straight};
            }
            else if (n.isDiagonal(coordinates).isDiagonal){
                straitght.coordinate_startOrEnd = {x: coordinates.x[0], y: coordinates.y[0]}; straight.len = n.getMagnitude(coordinates); 
                straight.type = 3;
                return {data:straight};
            }
            throw new Ret.error("There are no lines, please provide valid coordinates.", -1);
        }

        // A curved line is a set of straightlines that change in a consistent manner in X and Y axis, just like a circle shape
        isCurved(lineTypedArray){
            for (let i = 0; i < lineTypedArray.length; i++){
                if (lineTypeArray[i].data.type === 3){
                       
                }
            }
        }

}

