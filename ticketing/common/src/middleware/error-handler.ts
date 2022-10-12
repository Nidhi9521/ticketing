import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof RequestValidationError){
        console.log('handling this error as validation error');
        return res.status(err.statusCode).send({errors:err.serializeError()})
    }

    if(err instanceof DatabaseConnectionError){
        console.log("handling this error as DBerror");
        return res.status(err.statusCode).send({errors:err.serializeError()})
    }
    
    if(err instanceof BadRequestError){
        console.log("handling this error as BadRequestError");
        return res.status(err.statusCode).send({errors:err.serializeError()})
    }

    if(err instanceof NotAuthorizedError){
        console.log("handling this error as NotAuthorizedError");
        return res.status(err.statusCode).send({errors:err.serializeError()})
    }

    if(err instanceof NotFoundError){
        console.log("handling this error as NotFoundError");
        return res.status(err.statusCode).send({errors:err.serializeError()})
    }

    res.status(400).send({
        message: 'Something went wrong'
    })

}