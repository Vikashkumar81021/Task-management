import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { swaggerUi, specs } from "./config/swagger.js";
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true })); 
app.use(helmet());     
app.use(cors());     
app.use(express.json());
app.use(morgan("dev")); 


import { authRouter } from "./routes/user.route.js";
import { taskRouter } from "./routes/task.route.js";
import {analyticsRouter} from './routes/analytics.route.js'

app.use("/api/v1",authRouter)
app.use("/api/v1",taskRouter);
app.use("/api/v1",analyticsRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
export {app}