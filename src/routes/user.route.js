import express from "express";
import { currentUser, login, logout, register } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const authRouter=express.Router()

authRouter.post("/register",authLimiter,register)
authRouter.post("/login",authLimiter,login)
authRouter.post("/logout",authLimiter,logout)
authRouter.get("/currentUser",auth ,currentUser)
export{
    authRouter
}