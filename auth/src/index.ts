import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {

    if (!process.env.jwt) {
        throw new Error('env not defiend')
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    } catch (err) {
        console.log(err);
    }
    app.listen(4000, () => {
        console.log('port serving at 4000');
    })
}

start();