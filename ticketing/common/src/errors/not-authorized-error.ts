import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError{
    statusCode: number=401;
    serializeError(): { message: String; field?: String | undefined; }[] {
        return [{message:'Not authprized'}]
    }

    constructor(){
        super('Not authprized');
        Object.setPrototypeOf(this,NotAuthorizedError.prototype)
    }
}