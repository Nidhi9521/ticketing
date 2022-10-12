import { ValidationError } from "express-validator";

interface CustomError{
    statusCode: number;
    serializeError():{
        message:String;
        field:String;
    }[]
}

class RequestValidationError extends Error implements CustomError{
    statusCode=400
    constructor(public errors:ValidationError[]){
        super();
        Object.setPrototypeOf(this,RequestValidationError.prototype);
    }
    serializeError(){
        return this.errors.map(e=>{
            return { message: e.msg, field: e.param}
        })
    }
}

export {RequestValidationError}