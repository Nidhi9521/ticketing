import express, { NextFunction, Request, response, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

interface UserPayload{
    id:string;
    email:string;
}

declare global{
    namespace Express{
        interface Request{
            currentUser?: UserPayload;
        }
    }
}
export const currentUser=(
    req: Request,
    res:Response,
    next: NextFunction
)=>{
    if(req.session && !req.session?.jwt){
        return next();
    }
    try {
        const payload = jwt.verify(
            req.session?.jwt,
            process.env.jwt!
        ) as UserPayload;
        req.currentUser=payload;
    } catch (err) {  }
    next();
}