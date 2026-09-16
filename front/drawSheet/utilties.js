import { Ret } from "./proto/returns.js";
/**
 * Absolute value with sign
 * @param {number} a 
 * @param {number} b 
 * @returns {object} An object of two properties: value - The absolute value of the difference between a and b, isNegative - A boolean that indicates if a is less than b
 */
export function abs(a, b){
    let isNegative = false;
    if (a < b){isNegative = true;}
    return {value: isNegative? b-a : a-b, isNegative: isNegative};
}

export class Check{
    /**
    * @name arrayIn
    * This function is to check if the input is valid, for example: if the array is empty, if the array has only one element, etc...
    * 
    * @param {Array} arrayToCheck - An array of coordinates, for example: [{x: 1, y: 6}, {x: 1, y: 7}, {x: 1, y: 8}].
    * @return {number} The length of the array.
    * @throws {Ret.error} Error instance from returns.js lib. 
    */
    arrayIn(arrayToCheck){
        try{checkDataType(arrayToCheck, "object", Array);}
        catch (e){throw e;}
        if (arrayToCheck.length <= 0){throw new Ret.error("The array is empty, please provide an array with at least one element.");}
        return arrayToCheck.length
    }
    /**
     * @name dataType
     * This function is to check the data type of the input
     * @param {any} data - The input data to check
     * @param {string} type - The expected type of the input data
     * @return {boolean} true if the input is of the correct type, otherwise throws an error
     * @throws {Ret.error} Error instance from returns.js lib.
     */
    dataType(data, type, SpecificObject = ""){
        if (typeof data !== type){throw new Ret.error(`The input is not a ${type}, please provide a ${type}.`, 2);}
        if (type == "object" && SpecificObject != "" && !(data instanceof SpecificObject)){
            throw new Ret.error(`The input is not an instance of ${SpecificObject.name}, please provide an instance of 
                ${SpecificObject.name}.`, 3);
            }
        return true;
    }
    /**
     * @name propertyExist
     * This function is to check if the input object has the specified property
     * @param {Object} object - The input object to check
     * @param {string} property - The name of the property to check for
     * @return {boolean} true if the object has the property, otherwise throws an error
     * @throws {Ret.error} Error instance from returns.js lib.
     */
    propertyExist(object, property){
        if (!object.hasOwnProperty(property)){throw new Ret.error(
            `The object doesn't have the property ${property}, please provide an object with the property ${property}.`, -2);
        }
        return true;
    }
}

export class Math{
    
}