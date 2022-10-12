 import { CustomError } from "./custom-error";

 class DatabaseConnectionError extends Error implements CustomError{
    statusCode=500
    reason="Error connecting to database"
    constructor(){
        super('Error connecting to DB');
        Object.setPrototypeOf(this,DatabaseConnectionError.prototype);
    }
    serializeError(){
         return [
            {
                message:this.reason
            }
        ]
    }
}
export { DatabaseConnectionError}