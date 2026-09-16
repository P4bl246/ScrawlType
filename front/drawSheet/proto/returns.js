export class LineType{
    constructor(type){
        this.type = type;
    }
}

export class Slope{
    constructor(other, infinity=false, isNegative=false){
        this.infinity = infinity;
        this.other = other;
        this.isNegative = isNegative;
    }
}

export class Error{
    constructor(message, errorFlag=-1){
        this.message = message;
        this.error = errorFlag;
    }
}