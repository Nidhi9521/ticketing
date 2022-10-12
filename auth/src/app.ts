import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "@ndgokani9521/common"
import { NotFoundError } from "@ndgokani9521/common";
import cookieSession from "cookie-session";

const app = express();
app.use(express.json());
app.set('trust proxy',true);
app.use(cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !== 'test',
}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.use(errorHandler)

app.all('*', async (req, res) => {
    throw new NotFoundError();
})


export { app };