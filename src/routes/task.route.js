import express from "express";
import { assignTask, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { taskLimiter } from "../middlewares/askRateLimit.middleware.js";

const taskRouter=express.Router()
taskRouter.post("/tasks",auth,taskLimiter,authorizeRoles("admin","manager"),createTask)
taskRouter.get("/tasks",auth,taskLimiter,getTasks)
taskRouter.get("/tasks/:id",auth,taskLimiter, getTaskById)

taskRouter.patch("/tasks/:id",auth,taskLimiter,authorizeRoles("admin","manager"),updateTask)
taskRouter.delete("/tasks/:id",auth,taskLimiter,authorizeRoles("admin"),deleteTask)
taskRouter.post("/tasks/:id/assign",auth,taskLimiter,authorizeRoles("admin","manager"),assignTask)
export{
    taskRouter
}