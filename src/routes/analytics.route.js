import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { taskStats, overDueTask, getTeamAnalytics } from "../controllers/analytics.controller.js";
import { analyticsLimiter } from "../middlewares/analyticsLimiter .js";
const analyticsRouter = express.Router();

analyticsRouter.get("/analytics/user/:userId", auth, analyticsLimiter,authorizeRoles("admin","manager","user"), taskStats);

analyticsRouter.get("/analytics/user/:id/overdue", auth, analyticsLimiter,authorizeRoles("admin","manager","user"), overDueTask);
analyticsRouter.post("/analytics/team", auth,analyticsLimiter, authorizeRoles("admin","manager"), getTeamAnalytics);

export { analyticsRouter };
